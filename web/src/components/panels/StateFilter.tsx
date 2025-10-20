import React from 'react';

export default function StateFilter({
  states,
  value,
  onChange
}: {
  states: string[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  if (!states.length) {
    return <div style={{ color: '#6b7280', fontSize: 12 }}>No states detected yet.</div>;
  }

  const toggle = (st: string) => {
    const set = new Set(value);
    if (set.has(st)) set.delete(st); else set.add(st);
    onChange(Array.from(set).sort());
  };

  return (
    <div role="group" aria-label="Filter by state" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
      {states.map((st) => (
        <label key={st} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={value.includes(st)}
            onChange={() => toggle(st)}
          />
          <span style={{ fontSize: 13, fontWeight: 600 }}>{st}</span>
        </label>
      ))}
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange([])}
          style={{ gridColumn: '1 / -1', marginTop: 6, fontSize: 12 }}
        >
          Clear
        </button>
      )}
    </div>
  );
}
