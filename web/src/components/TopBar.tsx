import React, { useEffect, useState } from 'react';

export default function TopBar({ lastUpdated }: { lastUpdated: number | null }) {
  const [now, setNow] = useState(Date.now());

  // Tick every 10s so the “x seconds ago” stays fresh
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 10_000);
    return () => clearInterval(id);
  }, []);

  const rel = (() => {
    if (!lastUpdated) return '—';
    const s = Math.max(0, Math.round((now - lastUpdated) / 1000));
    if (s < 60) return `${s}s ago`;
    const m = Math.round(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.round(m / 60);
    return `${h}h ago`;
  })();

  return (
    <header className="topbar" role="banner">
      <div className="topbar__brand">GeoWatch</div>
      <div className="topbar__meta">
        <span className="dot dot--ok" aria-hidden />
        <span title={lastUpdated ? new Date(lastUpdated).toLocaleString() : ''}>
          Last updated: {rel}
        </span>
      </div>
    </header>
  );
}
