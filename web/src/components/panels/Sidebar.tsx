import React from 'react';

export default function Sidebar() {
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Filter by state</h3>
      {/* TODO: wire to your data store */}
      <div style={{ height: 8 }} />
      <div style={{ fontSize: 12, color: '#6b7280' }}>Select one or more states to filter events.</div>

      <div style={{ height: 16 }} />
      <div role="list" aria-label="Recent events">
        <div style={{ fontWeight: 600, marginBottom: 8 }}>List</div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>(Coming next: bind to incidents feed)</div>
      </div>
    </div>
  );
}
