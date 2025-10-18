import maplibregl from 'maplibre-gl';

export class IncidentsLayer {
  private sourceId: string;
  private pointId: string;
  private map: maplibregl.Map;

  constructor(map: maplibregl.Map, id = 'incidents') {
    this.map = map;
    this.sourceId = id;
    this.pointId = id + '-points';
  }

  mount(data: GeoJSON.FeatureCollection) {
    if (!this.map.getSource(this.sourceId)) {
      this.map.addSource(this.sourceId, { type: 'geojson', data });

      this.map.addLayer({
        id: this.pointId,
        type: 'circle',
        source: this.sourceId,
        paint: {
          'circle-radius': 6,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
          'circle-color': [
            'interpolate', ['linear'], ['get', 'severity'],
            3, '#8BC34A',
            5, '#FFC107',
            6, '#E53935'
          ]
        }
      });

      this.map.on('click', this.pointId, (e) => {
  const f = e.features?.[0];
  if (!f) return;

  const [lng, lat] = (f.geometry as any).coordinates;
  // MapLibre sometimes wraps props in strings — coerce to a real object
  let p: any;
  try {
    p = typeof f.properties === 'string' ? JSON.parse(f.properties) : f.properties;
  } catch {
    p = f.properties;
  }

  const title = p?.title ?? 'Incident';
  const sev = p?.severity ?? '—';

  new maplibregl.Popup()
    .setLngLat([lng, lat])
    .setHTML(`<strong>${title}</strong><br/>Severity: ${sev}`)
    .addTo(this.map);
});



      this.map.on('mouseenter', this.pointId, () => (this.map.getCanvas().style.cursor = 'pointer'));
      this.map.on('mouseleave', this.pointId, () => (this.map.getCanvas().style.cursor = ''));
    } else {
      (this.map.getSource(this.sourceId) as maplibregl.GeoJSONSource).setData(data);
    }
  }
}
