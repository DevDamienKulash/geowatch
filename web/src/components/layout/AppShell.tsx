// web/src/components/layout/AppShell.tsx
import type { ReactNode } from 'react';
import './app-shell.css';

type Props = {
  header?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  top?: ReactNode;       // chips/status row ABOVE the map
  children: ReactNode;   // the map
};

export default function AppShell({ header, left, right, top, children }: Props) {
  return (
    <div className="shell">
      <header className="shell__header">{header}</header>

      <div className="shell__frame">
        <aside className="shell__left">{left}</aside>

        <main className="shell__main">
          {top && <div className="shell__top">{top}</div>}
          <div className="shell__content">{children}</div>
        </main>

        <aside className="shell__right">{right}</aside>
      </div>
    </div>
  );
}
