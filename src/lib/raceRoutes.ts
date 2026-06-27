// Stylized race route silhouettes. SVG path data, viewBox 0 0 100 100.
// These are artistic interpretations — recognizable shape, not GPS-accurate.
// Stroke is drawn with `stroke-linecap: round`, `stroke-linejoin: round`.

export const RACE_ROUTES: Record<string, string> = {
  // Berlin — loop through Tiergarten, finish at Brandenburg Gate
  berlin:
    "M 22 70 L 30 62 Q 22 50 32 38 Q 48 22 68 28 Q 84 36 82 54 Q 78 70 62 72 L 50 72 L 50 64 L 58 64",
  // NYC — five boroughs, Verrazzano up through Brooklyn, Queens, Bronx, finish Central Park
  nyc:
    "M 18 88 L 28 78 L 24 64 L 38 50 L 32 40 L 46 32 L 42 22 L 58 18 L 70 26 L 64 38 L 76 44 L 70 58 L 56 62 L 52 74",
  // London — loop along the Thames, finish at the Mall
  london:
    "M 78 60 Q 70 72 54 70 Q 38 66 30 54 Q 24 42 34 32 Q 48 22 64 28 Q 78 36 76 50 L 82 56",
  // Boston — point-to-point, Hopkinton east into Boston (heartbreak hill notch)
  boston:
    "M 12 60 L 28 58 L 38 62 L 48 56 L 56 60 L 62 50 L 70 54 L 80 50 L 88 56",
  // Chicago — downtown loop figure
  chicago:
    "M 50 22 L 30 28 L 28 50 L 38 70 L 50 78 L 64 70 L 72 50 L 68 30 Z M 50 50 L 70 50",
  // Tokyo — point-to-point through the city, doglegs
  tokyo:
    "M 18 30 L 34 32 L 38 48 L 56 50 L 58 36 L 74 38 L 78 56 L 66 70 L 50 72 L 36 66 L 30 78",
  // Paris — loop, Champs-Elysees finish
  paris:
    "M 28 50 Q 28 30 50 26 Q 72 30 74 50 Q 72 70 50 74 Q 30 70 28 52 L 50 50 L 78 38",
  // Stockholm — bridges & loops
  stockholm:
    "M 22 40 L 36 36 Q 42 48 56 44 Q 70 38 78 52 Q 70 66 56 64 Q 42 60 36 72 L 22 70",
  // Valencia — finish near city of arts
  valencia:
    "M 20 70 L 36 64 L 40 50 L 56 46 L 60 32 L 76 28 L 84 44 L 72 56 L 78 70",
  // Amsterdam — Olympic stadium loop along canals
  amsterdam:
    "M 30 60 Q 22 44 38 32 Q 56 24 72 34 Q 84 46 76 60 Q 64 72 48 68 Q 38 66 36 60 L 42 56",
  // Copenhagen
  copenhagen:
    "M 24 56 L 36 52 Q 44 38 60 40 Q 76 44 78 60 Q 72 74 56 72 Q 40 68 36 60 L 28 68",
  // Vienna
  vienna:
    "M 20 50 L 36 46 L 40 32 L 60 30 L 74 42 L 70 58 L 56 64 L 40 60 L 32 70 L 22 66",
  // Sydney — harbour bridge to Opera House
  sydney:
    "M 20 72 L 34 60 L 36 46 L 54 42 Q 70 36 78 50 Q 84 64 72 70 L 60 66 L 48 72",
  // Generic fallback — handsome serpentine
  generic:
    "M 16 70 Q 28 50 44 56 Q 60 62 64 46 Q 68 30 84 38 L 90 32",
};

export function getRoutePath(raceId: string | undefined): string {
  if (!raceId) return RACE_ROUTES.generic;
  return RACE_ROUTES[raceId] ?? RACE_ROUTES.generic;
}
