// GPX → normalized SVG path pipeline for Racepace routes.
// Pure functions — no DOM/network side effects beyond DOMParser.
// Input: raw GPX XML text. Output: SVG path in a 0–100 viewBox plus real-world bounds.

export interface LatLon { lat: number; lon: number }

export interface RouteBounds {
  minLat: number; maxLat: number;
  minLon: number; maxLon: number;
}

export interface GpxRouteResult {
  svgPath: string;              // "M x y L x y L …" in a 0–100 viewBox
  bounds: RouteBounds;          // real-world bounding box of source points
  pointCount: number;           // simplified point count
  sourcePoints: number;         // original point count
  distanceKm: number;           // great-circle length of simplified track
}

// ---------- 1. Parse ----------
export function parseGpx(gpxText: string): LatLon[] {
  if (typeof DOMParser === "undefined") {
    throw new Error("parseGpx must run in a browser environment");
  }
  const doc = new DOMParser().parseFromString(gpxText, "application/xml");
  const err = doc.querySelector("parsererror");
  if (err) throw new Error("Invalid GPX: " + err.textContent);

  const nodes = Array.from(
    doc.querySelectorAll("trkpt, rtept, wpt"),
  ) as Element[];
  const points: LatLon[] = [];
  for (const n of nodes) {
    const lat = parseFloat(n.getAttribute("lat") ?? "");
    const lon = parseFloat(n.getAttribute("lon") ?? "");
    if (Number.isFinite(lat) && Number.isFinite(lon)) points.push({ lat, lon });
  }
  if (points.length < 2) throw new Error("GPX contains fewer than 2 points");
  return points;
}

// ---------- 2. Simplify (Douglas–Peucker) ----------
// Tolerance is in the same units as the points (degrees here). ~0.00015 deg ≈ 15 m.
export function simplify(points: LatLon[], tolerance = 0.00015): LatLon[] {
  if (points.length < 3) return points.slice();
  const sqTol = tolerance * tolerance;
  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;

  const stack: [number, number][] = [[0, points.length - 1]];
  while (stack.length) {
    const [i0, i1] = stack.pop()!;
    let maxD = 0;
    let idx = -1;
    const a = points[i0], b = points[i1];
    for (let i = i0 + 1; i < i1; i++) {
      const d = sqSegDist(points[i], a, b);
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > sqTol && idx !== -1) {
      keep[idx] = 1;
      stack.push([i0, idx], [idx, i1]);
    }
  }
  const out: LatLon[] = [];
  for (let i = 0; i < points.length; i++) if (keep[i]) out.push(points[i]);
  return out;
}

function sqSegDist(p: LatLon, a: LatLon, b: LatLon): number {
  let x = a.lon, y = a.lat;
  let dx = b.lon - x, dy = b.lat - y;
  if (dx !== 0 || dy !== 0) {
    const t = ((p.lon - x) * dx + (p.lat - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) { x = b.lon; y = b.lat; }
    else if (t > 0) { x += dx * t; y += dy * t; }
  }
  dx = p.lon - x; dy = p.lat - y;
  return dx * dx + dy * dy;
}

// ---------- 3. Project + normalize to 0–100 viewBox ----------
// Equirectangular projection scaled by cos(midLat) so the aspect ratio
// matches what a human sees on a map at that latitude. Uniform scale so
// the route silhouette is not distorted, centered inside the viewBox.
export function toSvgPath(
  points: LatLon[],
  opts: { viewBox?: number; padding?: number; decimals?: number } = {},
): { d: string; bounds: RouteBounds } {
  const V = opts.viewBox ?? 100;
  const PAD = opts.padding ?? 4;
  const DEC = opts.decimals ?? 2;

  let minLat = Infinity, maxLat = -Infinity, minLon = Infinity, maxLon = -Infinity;
  for (const p of points) {
    if (p.lat < minLat) minLat = p.lat; if (p.lat > maxLat) maxLat = p.lat;
    if (p.lon < minLon) minLon = p.lon; if (p.lon > maxLon) maxLon = p.lon;
  }
  const midLat = (minLat + maxLat) / 2;
  const kx = Math.cos((midLat * Math.PI) / 180);

  const projX = (lon: number) => (lon - minLon) * kx;
  const projY = (lat: number) => (maxLat - lat); // y grows downward in SVG

  const w = (maxLon - minLon) * kx;
  const h = maxLat - minLat;
  const inner = V - PAD * 2;
  const scale = inner / Math.max(w, h);
  const offX = PAD + (inner - w * scale) / 2;
  const offY = PAD + (inner - h * scale) / 2;

  const r = (n: number) => Number(n.toFixed(DEC));
  let d = "";
  for (let i = 0; i < points.length; i++) {
    const x = r(offX + projX(points[i].lon) * scale);
    const y = r(offY + projY(points[i].lat) * scale);
    d += (i === 0 ? "M " : " L ") + x + " " + y;
  }
  return { d, bounds: { minLat, maxLat, minLon, maxLon } };
}

// ---------- 4. Distance (great-circle, Haversine) ----------
export function trackDistanceKm(points: LatLon[]): number {
  const R = 6371;
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i];
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLon = ((b.lon - a.lon) * Math.PI) / 180;
    const la1 = (a.lat * Math.PI) / 180;
    const la2 = (b.lat * Math.PI) / 180;
    const s =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
    total += 2 * R * Math.asin(Math.sqrt(s));
  }
  return total;
}

// ---------- 5. Convenience pipeline ----------
export function gpxToRoute(
  gpxText: string,
  opts: { tolerance?: number; viewBox?: number; padding?: number } = {},
): GpxRouteResult {
  const raw = parseGpx(gpxText);
  const simplified = simplify(raw, opts.tolerance ?? 0.00015);
  const { d, bounds } = toSvgPath(simplified, {
    viewBox: opts.viewBox,
    padding: opts.padding,
  });
  return {
    svgPath: d,
    bounds,
    pointCount: simplified.length,
    sourcePoints: raw.length,
    distanceKm: trackDistanceKm(simplified),
  };
}
