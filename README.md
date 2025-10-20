# GeoWatch

**GeoWatch** is a real-time earthquake and seismic monitoring web app built with **React**, **TypeScript**, and **Mapbox GL JS**.  
It displays seismic events across North America, grouped into clusters for quick overview and color-coded by severity for intuitive risk awareness.

---

## Features

- **Interactive Map**
  - Displays seismic events using Mapbox with live clustering.
  - Click cluster markers to zoom and reveal detailed events.

- **Filter by State**
  - Quickly narrow down activity by U.S. state.

- **Event List Panel**
  - Scrollable panel showing all recent events.
  - Each entry displays:
    - **City & State**
    - **Severity (magnitude)**
  - List stays fixed height with internal scrolling (no page scroll).

- **Severity Legend**
  - Explains event color coding (green → red scale by magnitude).
  - Blue markers indicate clustered events.
  - Clean, accessible layout for quick reference.

- **Smart Layout**
  - Full-page static frame—no browser scroll.
  - Panels resize dynamically and maintain consistent structure.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React + TypeScript |
| Map Rendering | Mapbox GL JS |
| Styling | Tailwind CSS + Custom CSS |
| API Data | USGS Earthquake API (real-time feed) |
| State Management | React Hooks + Local Filtering |

---

## ⚙️ Project Setup

### Install Dependencies

npm install
Run the App
bash
Copy code
npm run dev
Then visit: http://localhost:5173

Folder Structure
css
Copy code
src/
 ├── components/
 │    ├── panels/
 │    │     ├── FilterPanel.tsx
 │    │     ├── LegendPanel.tsx
 │    │     └── IncidentList.tsx
 │    ├── map/
 │    │     └── IncidentsLayer.tsx
 │    └── layout/
 │          └── AppShell.tsx
 ├── utils/
 │    └── mag.ts        # shared magnitude color logic
 ├── hooks/
 ├── assets/
 └── main.tsx
Color Scale (Severity)
Magnitude	Color	Meaning
< 2.5	🟢 #10b981	Very Minor
2.5 – 3.9	🟩 #84cc16	Minor
4.0 – 4.9	🟨 #eab308	Light
5.0 – 5.9	🟧 #f59e0b	Moderate
6.0 – 6.9	🟥 #ef4444	Strong
≥ 7.0	🟥 #b91c1c	Severe

Legend Overview
Blue Cluster → multiple nearby seismic events (click to expand)

Colored Dots → single events color-coded by severity

Ranges displayed for easy reference (matches map + list colors)

Future Enhancements
Real-time WebSocket updates

Historical timeline slider

Global map mode

Responsive mobile layout
