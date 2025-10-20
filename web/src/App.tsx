import React, { useMemo, useState } from 'react';
import AppShell from './components/layout/AppShell';
import Toolbar from './components/layout/Toolbar';
import LegendPanel from './components/panels/LegendPanel';
import MapView from './components/MapView';
import TimeFilter from './components/TimeFilter';
import TopBar from './components/TopBar';
import StatusBadge from './components/StatusBadge';
import IncidentList from './components/panels/IncidentList';
import StateSelect from './components/panels/StateSelect';
import { parseCity, getStateCode, parseMagnitude } from './utils/geo';
import { stateName } from './utils/usStates';

type WindowHours = 1 | 6 | 24 | 72;

export default function App() {
  const [win, setWin] = useState<WindowHours>(24);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [incidents, setIncidents] = useState<GeoJSON.FeatureCollection | null>(null);
  const [selectedState, setSelectedState] = useState<string>(''); // '' = All states
  const [focusId, setFocusId] = useState<string | null>(null);

  // Filtered incidents for map + list
 const filtered = useMemo<GeoJSON.FeatureCollection | null>(() => {
  if (!incidents) return null;
  if (!selectedState) return incidents;
  return {
    type: 'FeatureCollection',
    features: incidents.features.filter((f: any) => (f.properties?.state ?? null) === selectedState),
  };
}, [incidents, selectedState]);

  // Data for list (newest first) — build a single display label
  const listItems = useMemo(() => {
  if (!filtered) return [];
  return filtered.features
    .map((f: any) => {
      const p = f.properties || {};
      const id = f.id ?? p.id ?? crypto.randomUUID();

      const mag = parseMagnitude(p);     // ← use the robust parser

      const city = parseCity(p);
      const stCode = getStateCode(p);
      const stFull = stateName(stCode) ?? null;

      const label =
        city && stFull ? `${city}, ${stFull}` :
        city ? city :
        stFull ? stFull : '(unknown place)';

      const time = p.time ?? 0;
      return { id, mag, label, time };
    })
    .sort((a, b) => b.time - a.time);
}, [filtered]);

  return (
    <AppShell
      header={<TopBar lastUpdated={lastUpdated} />}
      left={
  <>
    {/* Row 1: controls/header */}
    <div className="left-controls">
      <h3 style={{ marginTop: 0 }}>Filter by state</h3>
      <StateSelect value={selectedState} onChange={setSelectedState} />

      <div className="hr" />
      <h3>List</h3>
    </div>

    {/* Row 2: scrollable list area */}
    <div className="sidebar-scroll" role="region" aria-label="Recent activity" tabIndex={0}>
      <IncidentList items={listItems} onSelect={(id) => setFocusId(id)} />
    </div>
  </>
}


      right={<LegendPanel />}
      top={
        <Toolbar>
          <TimeFilter value={win} onChange={setWin} />
          <StatusBadge loading={loading} error={error} />
        </Toolbar>
      }
    >
      <MapView
        win={win}
        data={filtered}
        focusId={focusId}
        onUpdated={setLastUpdated}
        onLoading={setLoading}
        onError={setError}
        onData={setIncidents}   // receives enriched full dataset from MapView
      />
    </AppShell>
  );
}
