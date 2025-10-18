import maplibregl from 'maplibre-gl';

export class IncidentsLayer {
  private sourceId: string;
  private clusterId: string;
  private clusterCountId: string;
  private pointId: string;
  private map: maplibregl.Map;

  constructor(map: maplibregl.Map, id = 'incidents') {
    this.map = map;
    this.sourceId = id;
    this.clusterId = id + '-clusters';
    this.clusterCountId = id + '-cluster-count';
    this.pointId = id + '-points';
  }

  mount(data: GeoJSON.FeatureCollection) {
    const existing = this.map.getSource(this.sourceId) as maplibregl.GeoJSONSource | undefined;

    if (!existing) {
      // Source with clustering
      this.map.addSource(this.sourceId, {
        type: 'geojson',
        data,
        cluster: true,
        clusterRadius: 60,     // px at default zoom
        clusterMaxZoom: 14     // stop clustering past this zoom
      });

      // Cluster circles
      this.map.addLayer({
        id: this.clusterId,
        type: 'circle',
        source: this.sourceId,
        filter: ['has', 'point_count'],
        paint: {
          // larger circles as counts increase
          'circle-radius': ['step', ['get', 'point_count'], 16, 50, 22, 200, 28],
          // color ramp by count
          'circle-color': ['step', ['get', 'point_count'], '#9BE7FF', 50, '#4FC3F7', 200, '#0288D1'],
          'circle-stroke-color': '#fff',
          'circle-stroke-width': 1
        }
      });

      // Cluster count labels
      this.map.addLayer({
        id: this.clusterCountId,
        type: 'symbol',
        source: this.sourceId,
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-size': 12
        },
        paint: {
          'text-color': '#082032'
        }
      });

      // Unclustered points
      this.map.addLayer({
        id: this.pointId,
        type: 'circle',
        source: this.sourceId,
        filter: ['!', ['has', 'point_count']],
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

      // Click clusters to zoom in (expand)
this.map.on('click', this.clusterId, (e) => {
  const f = e.features?.[0];
  if (!f) return;

  const clusterId = (f.properties as any)['cluster_id'];
  const source = this.map.getSource(this.sourceId) as any; // 👈 declare it here

  if (source && typeof source.getClusterExpansionZoom === 'function') {
    source.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
      if (err) return;
      const [lng, lat] = (f.geometry as any).coordinates;
      this.map.easeTo({ center: [lng, lat], zoom });
    });
  }
});


      // Click unclustered points → popup
      this.map.on('click', this.pointId, (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const [lng, lat] = (f.geometry as any).coordinates;

        // Properties can be stringified; parse if needed
        let p: any;
        try {
          p = typeof f.properties === 'string' ? JSON.parse(f.properties) : f.properties;
        } catch {
          p = f.properties;
        }
        const title = p?.title ?? 'Incident';
        const sev = p?.severity ?? '—';

        new maplibregl.Popup({closeButton: false, closeOnClick: true})
          .setLngLat([lng, lat])
          .setHTML(`<strong>${title}</strong><br/>Severity: ${sev}`)
          .addTo(this.map);
      });

      // Cursor hints
      this.map.on('mouseenter', this.clusterId, () => (this.map.getCanvas().style.cursor = 'pointer'));
      this.map.on('mouseleave', this.clusterId, () => (this.map.getCanvas().style.cursor = ''));
      this.map.on('mouseenter', this.pointId, () => (this.map.getCanvas().style.cursor = 'pointer'));
      this.map.on('mouseleave', this.pointId, () => (this.map.getCanvas().style.cursor = ''));
    } else {
      // Just update data if source already exists
      existing.setData(data);
    }
  }
}
