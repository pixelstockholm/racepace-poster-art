// Verified route store.
// Source of truth: src/data/verifiedRoutes.json — populated by the Racepace
// admin app. Each entry is one marathon+year with a GPX-derived SVG path.
// Posters render ONLY routes present here. No AI-generated fallbacks.

import raw from "@/data/verifiedRoutes.json";
import type { RouteBounds } from "@/lib/gpx";

export interface VerifiedRoute {
  id: string;                   // stable key, e.g. "berlin-2024"
  race_id: string;              // matches Race.id in src/lib/races.ts
  marathon_name: string;
  city: string;
  country: string;
  year: number;
  gpx_file_url: string;         // storage URL of the original GPX
  svg_path: string;             // "M x y L x y …" in 0–100 viewBox
  route_bounds: RouteBounds;    // real-world bbox from the GPX
  route_source_url: string;     // where the GPX was obtained
  route_verified: boolean;      // must be true to render
  route_notes?: string;
}

interface RouteFile { routes: VerifiedRoute[] }

const store = raw as unknown as RouteFile;

const byRaceId = new Map<string, VerifiedRoute>();
for (const r of store.routes) {
  if (!r.route_verified) continue;
  // Prefer the most recent verified year per race_id.
  const existing = byRaceId.get(r.race_id);
  if (!existing || r.year > existing.year) byRaceId.set(r.race_id, r);
}

export function getVerifiedRoute(raceId: string | undefined): VerifiedRoute | null {
  if (!raceId) return null;
  return byRaceId.get(raceId) ?? null;
}

export function hasVerifiedRoute(raceId: string | undefined): boolean {
  return getVerifiedRoute(raceId) != null;
}

export function listVerifiedRoutes(): VerifiedRoute[] {
  return Array.from(byRaceId.values());
}
