import React from 'react';
import { US_STATES } from '../../utils/usStates';

export default function StateSelect({
  value,
  onChange
}: {
  value: string;                  // '' = All
  onChange: (st: string) => void;
}) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontSize: 12, color: '#6b7280' }}>State</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: '8px 10px',
          background: '#fff'
        }}
      >
        <option value="">All states</option>
        {US_STATES.map(s => (
          <option key={s.code} value={s.code}>
            {s.name} ({s.code})
          </option>
        ))}
      </select>
    </label>
  );
}
