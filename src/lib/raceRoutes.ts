// Poster route lookup.
// Routes come from the verified store (src/data/verifiedRoutes.json), which
// the Racepace admin app populates from real GPX files. No AI-generated
// silhouettes, no hand-drawn fallbacks — a race without a verified route
// returns null and callers must render a "route pending" state.

import { getVerifiedRoute } from "@/lib/verifiedRoutes";

export function getRoutePath(raceId: string | undefined): string | null {
  const v = getVerifiedRoute(raceId);
  return v ? v.svg_path : null;
}

export function isRouteVerified(raceId: string | undefined): boolean {
  return getVerifiedRoute(raceId) != null;
}
