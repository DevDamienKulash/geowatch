import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import React, { useEffect, useRef, useState } from 'react';
import { IncidentsLayer } from '../layers/IncidentsLayer';
import TimeFilter from './TimeFilter';

type WindowHours = 1 | 6 | 24 | 72;

const API_BASE = 'http://localhost:3001'; // change later to env var for prod

export default function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const layerRef = useRef<IncidentsLayer | null>(null);
  const [win, setWin] = useState<WindowHours>(24);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Create the map once
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [-98.5795, 39.8283],
      zoom: 3
    });

    mapRef.current = map;

    map.on('load', () => {
      layerRef.current = new IncidentsLayer(map);
      fetchAndRender(win); // initial draw
    });

    return () => {
      mapRef.current = null;
      layerRef.current = null;
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch incidents from API and mount to the layer
  const fetchAndRender = async (hours: number) => {
    if (!layerRef.current) return;
    setLoading(true);
    setErrorMsg(null);

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 10000); // 10s safety

    try {
      const resp = await fetch(`${API_BASE}/api/incidents?since=${hours}`, {
        signal: controller.signal
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = (await resp.json()) as GeoJSON.FeatureCollection;
      layerRef.current.mount(data);
    } catch (err: any) {
      console.error('Failed to fetch incidents:', err);
      setErrorMsg(err?.message ?? 'Failed to load incidents');
    } finally {
      clearTimeout(t);
      setLoading(false);
    }
  };

  // Re-fetch when the time window changes
  useEffect(() => {
    fetchAndRender(win);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win]);

  return (
    <>
      <TimeFilter value={win} onChange={setWin} />
      {/* Simple status pill */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 10,
          background: 'rgba(255,255,255,0.95)',
          padding: '6px 10px',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          fontSize: 12
          
        }}
        aria-live="polite"
      >
        {loading ? 'Loading incidents…' : errorMsg ? `Error: ${errorMsg}` : 'Data loaded'}
      </div>

      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </>
  );
}
