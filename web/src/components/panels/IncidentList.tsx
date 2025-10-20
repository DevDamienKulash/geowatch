// components/panels/IncidentList.tsx
import React from 'react';

export default function IncidentList({
  items,
  onSelect,
}: {
  items: Array<{ id: string; mag: number | null; label: string; time: number }>;
  onSelect: (id: string) => void;
}) {
  return (
    <div role="list" aria-label="Recent incidents" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
      {items.slice(0, 200).map((it) => (
        <button
          key={it.id}
          role="listitem"
          type="button"
          onClick={() => onSelect(it.id)}
          style={{
            textAlign: 'left',
            border: '1px solid #e5e7eb',
            background: '#fff',
            borderRadius: 10,
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            cursor: 'pointer',
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', color: '#0f172a' }}>
            {it.label}
          </div>
          <div style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>
            Severity: {it.mag != null ? it.mag.toFixed(1) : '—'}
          </div>
        </button>
      ))}
    </div>
  );
}
