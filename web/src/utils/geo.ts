// utils/geo.ts
import { stateCodeFromName, stateName } from './usStates';

export const STATE_CODES = new Set([
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC','PR'
]);

/** Prefer explicit props.state; else parse ", ST" or ", StateName" */
export function getStateCode(props: any): string | null {
  if (!props) return null;

  // explicit
  const s = props.state?.toString().toUpperCase();
  if (s && STATE_CODES.has(s)) return s;

  const src: string | undefined = props.place || props.title;
  if (!src) return null;

  // ", ST"
  let m = src.match(/,\s*([A-Z]{2})(?:\s|$)/);
  if (m && STATE_CODES.has(m[1])) return m[1];

  // ", StateName"
  m = src.match(/,\s*([A-Za-z .-]+)(?:\s|$)/);
  if (m && m[1]) {
    const code = stateCodeFromName(m[1].trim());
    if (code) return code;
  }
  return null;
}

/** Robust city parser for "... of City, ST/StateName" and "City, ST/StateName" */
export function parseCity(props: any): string | null {
  const src: string | undefined = props?.place || props?.title;
  if (!src) return null;

  // "... of City, ST/StateName"
  let m = src.match(/\bof\s+([^,]+),\s*([A-Z]{2}|[A-Za-z .-]+)\b/i);
  if (m && m[1]) return m[1].trim();

  // "City, ST/StateName"
  m = src.match(/^([^,]+),\s*([A-Z]{2}|[A-Za-z .-]+)\b/);
  if (m && m[1]) return m[1].trim();

  // Fallback: first segment if it doesn't look like a distance
  const first = src.split(',')[0].trim();
  if (!/^\d+(\.\d+)?\s*(km|mi)\b/i.test(first)) return first || null;
  return null;
}

/** For completeness: full name from props.state code, if present */
export function stateFullNameFromProps(props: any): string | null {
  const code = getStateCode(props);
  return code ? stateName(code) : null;
}

/** Add state code if we can infer it */
export function enrichWithState(fc: GeoJSON.FeatureCollection): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: fc.features.map((f: any) => {
      const props = { ...(f.properties || {}) };
      const code = getStateCode(props);
      if (code) props.state = code;
      return { ...f, properties: props };
    })
  };
}
// Parse magnitude from props.mag or from "M 1.6" in title/place
export function parseMagnitude(props: any): number | null {
  const raw = props?.mag;
  if (raw !== undefined && raw !== null) {
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }
  const src: string | undefined = props?.title || props?.place;
  if (!src) return null;
  const m = src.match(/\bM\s*([0-9]+(?:\.[0-9]+)?)\b/i);
  return m ? parseFloat(m[1]) : null;
}
