import React from 'react';

type WindowHours = 1 | 6 | 24 | 72;
const OPTIONS: WindowHours[] = [1, 6, 24, 72];

export default function TimeFilter({
  value,
  onChange
}: {
  value: WindowHours;
  onChange: (v: WindowHours) => void;
}) {
  return (
    <div
      role="toolbar"
      aria-label="Time window"
      style={{
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 10,
        background: 'rgba(255,255,255,0.95)',
        padding: '6px 8px',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        display: 'flex',
        gap: 6
      }}
    >
      {OPTIONS.map((h) => {
        const isActive = value === h;
        return (
          <button
            key={h}
            type="button"
            onClick={() => onChange(h)}
            aria-pressed={isActive}
            title={`Show incidents from the last ${h} hours`}
            style={{
              padding: '6px 12px',
              borderRadius: 999,
              border: isActive ? '1px solid #111' : '1px solid #ccc',
              background: isActive ? '#eee' : '#fff',
              color: '#111',               // ← ensure visible text
              fontWeight: 600,
              cursor: 'pointer',
              lineHeight: 1,
              outline: 'none'
            }}
            onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.2)')}
            onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
          >
            Last {h}h
          </button>
        );
      })}
    </div>
  );
}
