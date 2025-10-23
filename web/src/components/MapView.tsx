import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import { IncidentsLayer } from '../layers/IncidentsLayer';
import { enrichWithState } from '../utils/geo';

type WindowHours = 1 | 6 | 24 | 72;

const BASE = import.meta.env.VITE_API_BASE_URL;
await fetch(`${BASE}/incidents?since=24`);


export default function MapView({
  win,
  data,
  focusId,
  onUpdated,
  onLoading,
  onError,
  onData
}: {
  win: WindowHours;
  data: GeoJSON.FeatureCollection | null;
  focusId?: string | null;
  onUpdated: (ts: number) => void;
  onLoading: (v: boolean) => void;
  onError: (msg: string | null) => void;
  onData: (fc: GeoJSON.FeatureCollection) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const layerRef = useRef<IncidentsLayer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
      center: [-98.57, 39.83],
      zoom: 3
    });
    mapRef.current = map;
    layerRef.current = new IncidentsLayer(map);
    return () => { map.remove(); mapRef.current = null; layerRef.current = null; };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 10000);

    async function run() {
      onLoading(true);
      onError(null);
      try {
        const resp = await fetch(`${BASE}/api/incidents?since=${win}`, { signal: controller.signal });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const fc = (await resp.json()) as GeoJSON.FeatureCollection;
        const enriched = enrichWithState(fc);
        onData(enriched);
        onUpdated(Date.now());
      } catch (err: any) {
        onError(err?.name === 'AbortError' ? 'Request timed out' : (err?.message ?? 'Failed to load incidents'));
      } finally {
        clearTimeout(t);
        onLoading(false);
      }
    }
    run();
    return () => controller.abort();
  }, [win]);

  useEffect(() => {
    if (data && layerRef.current) layerRef.current.mount(data);
  }, [data]);

  useEffect(() => {
    if (!focusId || !mapRef.current || !data) return;
    const f = data.features.find((f: any) => (f.id ?? f.properties?.id) === focusId);
    if (!f || f.geometry?.type !== 'Point') return;
    const [lng, lat] = f.geometry.coordinates as [number, number];
    mapRef.current.flyTo({ center: [lng, lat], zoom: Math.max(mapRef.current.getZoom(), 6), essential: true });
  }, [focusId, data]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
