import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import React, { useEffect, useRef, useState } from 'react';
import { IncidentsLayer } from '../layers/IncidentsLayer';
import TimeFilter from './TimeFilter';

type WindowHours = 1 | 6 | 24 | 72;

const now = Date.now();
const hours = (h: number) => now - h * 3600 * 1000;

const mockData: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { id: 'eq-1', severity: 4.1, title: 'M4.1 - NV', ts: hours(2) },  geometry: { type: 'Point', coordinates: [-116.9, 38.8] } },
    { type: 'Feature', properties: { id: 'eq-2', severity: 5.2, title: 'M5.2 - AK', ts: hours(8) },  geometry: { type: 'Point', coordinates: [-151.0, 63.1] } },
    { type: 'Feature', properties: { id: 'eq-3', severity: 3.6, title: 'M3.6 - CA', ts: hours(20) }, geometry: { type: 'Point', coordinates: [-121.5, 37.7] } },
    { type: 'Feature', properties: { id: 'eq-4', severity: 6.1, title: 'M6.1 - PR Trench', ts: hours(50) }, geometry: { type: 'Point', coordinates: [-66.3, 19.7] } },
    { type: 'Feature', properties: { id: 'eq-5', severity: 2.9, title: 'M2.9 - OK', ts: hours(80) }, geometry: { type: 'Point', coordinates: [-97.5, 35.5] } }
  ]
};

export default function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const layerRef = useRef<IncidentsLayer | null>(null);
  const [win, setWin] = useState<WindowHours>(24);

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
      applyFilteredData(); // initial draw
    });

    return () => {
      mapRef.current = null;
      layerRef.current = null;
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper to filter and mount data based on selected window
  const applyFilteredData = () => {
    if (!layerRef.current) return;
    const cutoff = Date.now() - win * 3600 * 1000;
    const filtered: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: mockData.features.filter(f => {
        const p = f.properties as any;
        return typeof p?.ts === 'number' && p.ts >= cutoff;
      })
    };
    layerRef.current.mount(filtered);
  };

  // Re-apply when the time window changes
  useEffect(() => {
    applyFilteredData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win]);

  return (
    <>
      <TimeFilter value={win} onChange={setWin} />
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </>
  );
}
