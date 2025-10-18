/* CommonJS requires (no ESM imports here) */
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios');

/* Type aliases to avoid ESM import syntax under verbatimModuleSyntax */
type Request = import('express').Request;
type Response = import('express').Response;

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

/* --- Domain types --- */
type Incident = {
  id: string;
  type: 'earthquake';
  severity: number; // magnitude used as severity
  ts: number;       // epoch ms
  geometry: { type: 'Point'; coordinates: [number, number] } | any; // USGS gives depth as z; keep as-is
  props: { title?: string; mag?: number; depth?: number; place?: string; url?: string };
};

/* --- Simple 60s in-memory cache to avoid hammering USGS --- */
type CacheEntry = {
  key: string;
  fetchedAt: number;
  data: GeoJSON.FeatureCollection;
  count: number;
};
let cache: CacheEntry | null = null;
const CACHE_TTL_MS = 60 * 1000;

/* --- USGS fetcher ---
   Uses FDSN API: /fdsnws/event/1/query?format=geojson&starttime=...&endtime=...
   Docs: https://earthquake.usgs.gov/fdsnws/event/1/
*/
async function fetchUSGSIncidents(sinceHours: number): Promise<{ fc: GeoJSON.FeatureCollection; count: number }> {
  const end = new Date(); // now
  const start = new Date(end.getTime() - sinceHours * 3600 * 1000);

  const params = {
    format: 'geojson',
    starttime: start.toISOString(),
    endtime: end.toISOString(),
    orderby: 'time', // most recent first
    limit: 20000     // generous upper bound; USGS caps internally
    // Optional later: minmagnitude, bbox (minlatitude, maxlatitude, minlongitude, maxlongitude)
  };

  const resp = await axios.get('https://earthquake.usgs.gov/fdsnws/event/1/query', { params });
  const features = (resp.data?.features ?? []) as any[];

  // Map USGS -> Incident FeatureCollection used by your frontend
  const fc: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: features.map((f) => ({
      type: 'Feature',
      properties: {
        id: f.id,
        severity: typeof f.properties?.mag === 'number' ? f.properties.mag : 0,
        title: f.properties?.title ?? 'Earthquake',
        ts: typeof f.properties?.time === 'number' ? f.properties.time : Date.now()
      },
      geometry: f.geometry // Point [lon, lat, depth?]
    }))
  };

  return { fc, count: features.length };
}

/* --- Health / status --- */
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
    lastFetchIso: cache?.fetchedAt ? new Date(cache.fetchedAt).toISOString() : null,
    lastFetchCount: cache?.count ?? null
  });
});

/* --- Incidents endpoint (now live from USGS, with a tiny cache) ---
   Query: /api/incidents?since=24 (hours)
*/
app.get('/api/incidents', async (req: Request, res: Response) => {
  const sinceH = Math.max(1, Number(req.query.since || 24)); // clamp at >=1h
  const cacheKey = `since=${sinceH}`;

  // Serve from cache if fresh
  if (cache && cache.key === cacheKey && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return res.json(cache.data);
  }

  try {
    const { fc, count } = await fetchUSGSIncidents(sinceH);
    cache = { key: cacheKey, fetchedAt: Date.now(), data: fc, count };
    res.json(fc);
  } catch (err: any) {
    // On failure, return a clear error while not blowing up the server
    console.error('USGS fetch failed:', err?.message || err);
    res.status(502).json({ error: 'Failed to fetch USGS data' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
