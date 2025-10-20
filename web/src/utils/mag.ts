// Consistent magnitude buckets + colors (green -> red)

export type MagBucket = {
  label: string;      // legend label, e.g., "2.5 – 3.9"
  min: number;        // inclusive lower bound
  max: number;        // exclusive upper bound (use Infinity for last)
  color: string;      // hex color
};

// Low severity (green) -> high severity (red)
export const MAG_BUCKETS: MagBucket[] = [
  { label: '< 2.5',         min: -Infinity, max: 2.5,      color: '#10b981' }, // emerald-500
  { label: '2.5 – 3.9',     min: 2.5,       max: 4.0,      color: '#84cc16' }, // lime-500
  { label: '4.0 – 4.9',     min: 4.0,       max: 5.0,      color: '#eab308' }, // yellow-500
  { label: '5.0 – 5.9',     min: 5.0,       max: 6.0,      color: '#f59e0b' }, // amber-500
  { label: '6.0 – 6.9',     min: 6.0,       max: 7.0,      color: '#ef4444' }, // red-500
  { label: '≥ 7.0',         min: 7.0,       max: Infinity, color: '#b91c1c' }, // red-700
];

export function magColor(mag: number | null | undefined): string {
  if (mag == null || !Number.isFinite(mag)) return '#cbd5e1'; // slate-300 fallback
  const b = MAG_BUCKETS.find(b => mag >= b.min && mag < b.max);
  return b ? b.color : '#cbd5e1';
}

export function magBucketLabel(mag: number | null | undefined): string {
  if (mag == null || !Number.isFinite(mag)) return '—';
  const b = MAG_BUCKETS.find(b => mag >= b.min && mag < b.max);
  return b ? b.label : '—';
}
