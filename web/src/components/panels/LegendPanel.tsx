import React from 'react';

export default function LegendPanel() {
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Legend</h3>
      <ul style={{ listStyle: 'none', paddingLeft: 0, lineHeight: 1.8 }}>
        <li>• Marker size = cluster count</li>
        <li>• Color = magnitude bucket</li>
      </ul>
    </div>
  );
}
