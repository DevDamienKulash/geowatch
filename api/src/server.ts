const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

type Request = import('express').Request;
type Response = import('express').Response;

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Minimal Incident type (we’ll evolve this)
type Incident = {
  id: string;
  type: 'earthquake';
  severity: number;
  ts: number; // epoch ms
  geometry: { type: 'Point'; coordinates: [number, number] };
  props: { title?: string; mag?: number; depth?: number; place?: string; url?: string };
};

// Mock data (same vibe as your frontend)
const now = Date.now();
const hours = (h: number) => now - h * 3600 * 1000;

const mockIncidents: Incident[] = [
  { id: 'eq-1', type: 'earthquake', severity: 4.1, ts: hours(2),  geometry: { type: 'Point', coordinates: [-116.9, 38.8] }, props: { title: 'M4.1 - NV' } },
  { id: 'eq-2', type: 'earthquake', severity: 5.2, ts: hours(8),  geometry: { type: 'Point', coordinates: [-151.0, 63.1] }, props: { title: 'M5.2 - AK' } },
  { id: 'eq-3', type: 'earthquake', severity: 3.6, ts: hours(20), geometry: { type: 'Point', coordinates: [-121.5, 37.7] }, props: { title: 'M3.6 - CA' } },
  { id: 'eq-4', type: 'earthquake', severity: 6.1, ts: hours(50), geometry: { type: 'Point', coordinates: [-66.3, 19.7] }, props: { title: 'M6.1 - PR Trench' } },
  { id: 'eq-5', type: 'earthquake', severity: 2.9, ts: hours(80), geometry: { type: 'Point', coordinates: [-97.5, 35.5] }, props: { title: 'M2.9 - OK' } }
];

// Health
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({ ok: true, time: new Date().toISOString(), count: mockIncidents.length });
});

// Incidents (supports ?since=24 for hours filtering)
app.get('/api/incidents', (req: Request, res: Response) => {
  const sinceH = Number(req.query.since || 24);
  const cutoff = Date.now() - sinceH * 3600 * 1000;
  const filtered = mockIncidents.filter(i => i.ts >= cutoff);

  res.json({
    type: 'FeatureCollection',
    features: filtered.map(i => ({
      type: 'Feature',
      properties: { id: i.id, severity: i.severity, title: i.props.title, ts: i.ts },
      geometry: i.geometry
    }))
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
