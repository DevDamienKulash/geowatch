// web/src/components/layout/Toolbar.tsx
import React from 'react';

export default function Toolbar({
  children,
}: { children: React.ReactNode }) {
  const kids = React.Children.toArray(children);
  return (
    <div className="chipbar">
      <div className="chipbar__spacer" />
      <div className="chipbar__center">{kids[0] ?? null}</div>
      <div className="chipbar__right">{kids.slice(1)}</div>
    </div>
  );
}
