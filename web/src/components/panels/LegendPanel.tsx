import React from 'react';
import { MAG_BUCKETS } from '../../utils/mag';

/** Blue cluster marker (sample) */
function ClusterIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
      <circle cx="15" cy="15" r="15" fill="#3b82f6" opacity="0.14" />
      <circle cx="15" cy="15" r="11" fill="#3b82f6" opacity="0.22" />
      <circle cx="15" cy="15" r="8"  fill="#3b82f6" />
      <text x="15" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">27</text>
    </svg>
  );
}

/** Single-event colored dot (uses bucket colors in the legend list below) */
function EventDot({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        width: 12,
        height: 12,
        borderRadius: 12,
        background: color,
        border: '1px solid rgba(0,0,0,0.08)',
        marginRight: 10,
      }}
    />
  );
}

export default function LegendPanel() {
  return (
    <div className="legend">
      <h3 className="legend__heading">Legend</h3>

      {/* What markers mean */}
      <section className="legend__card" aria-label="Marker types">
        <div className="legend__row">
          <ClusterIcon />
          <div className="legend__text">
            <div className="legend__title">Cluster</div>
            <div className="legend__muted">Blue circle shows grouped events. Bigger number = more. Click/zoom to expand.</div>
          </div>
        </div>

        <div className="legend__row">
          <EventDot color="#10b981" />
          <div className="legend__text">
            <div className="legend__title">Single event</div>
            <div className="legend__muted">Color shows severity by magnitude (see scale).</div>
          </div>
        </div>
      </section>

      {/* Severity scale */}
      <section className="legend__card" aria-label="Severity scale">
        <div className="legend__title" style={{ marginBottom: 8 }}>Severity (magnitude)</div>
        <ul className="legend__scale" role="list">
          {MAG_BUCKETS.map((b) => (
            <li key={b.label} className="legend__scale-row">
              <EventDot color={b.color} />
              <span className="legend__label">{b.label}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
