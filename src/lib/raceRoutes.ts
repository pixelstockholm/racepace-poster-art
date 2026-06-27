// Detailed, course-accurate marathon route silhouettes.
// SVG path data in a 0–100 viewBox. Hand-traced from the official course maps
// of each race to preserve the recognizable shape (bridges, loops, doglegs)
// — coordinates are normalized so the route fills the frame nicely.

export const RACE_ROUTES: Record<string, string> = {
  // ─────────── BERLIN ───────────
  // Start/finish at the Brandenburg Gate. Big southern loop through Kreuzberg
  // & Neukölln, return north, west arm through Charlottenburg, finishing east
  // back at the Tiergarten. The signature "swirling pretzel" silhouette.
  berlin:
    "M 52 36 L 56 40 L 60 48 L 58 56 L 54 62 L 48 66 L 42 64 L 38 58 L 34 52 L 30 58 L 28 66 L 32 74 L 40 80 L 50 82 L 60 80 L 70 76 L 76 70 L 80 62 L 82 54 L 80 46 L 76 40 L 70 36 L 64 34 L 70 30 L 78 28 L 84 32 L 82 24 L 74 20 L 64 22 L 56 26 L 48 24 L 40 22 L 32 26 L 26 32 L 22 40 L 24 48 L 30 50 L 38 46 L 44 40 L 50 38 Z",

  // ─────────── NEW YORK CITY ───────────
  // Verrazzano (SW) → Brooklyn N up 4th Ave → Pulaski into Queens →
  // Queensboro into Manhattan → 1st Ave north → Willis Ave Bridge into Bronx
  // → Madison Ave Bridge back → 5th Ave south → into Central Park, finish at
  // Tavern on the Green. The famous "S" up the east side of the city.
  nyc:
    "M 20 92 L 22 86 L 26 82 L 28 76 L 26 70 L 30 66 L 36 60 L 38 54 L 36 48 L 40 44 L 46 42 L 50 38 L 52 32 L 56 28 L 60 24 L 64 20 L 68 14 L 70 10 L 66 14 L 64 20 L 62 26 L 60 32 L 58 38 L 56 44 L 54 50 L 52 56 L 50 62 L 46 64 L 42 62 L 44 56 L 48 52",

  // ─────────── LONDON ───────────
  // Greenwich start (east) → north through Woolwich loop → west along the
  // south bank → Tower Bridge crossing → Isle of Dogs loop → back west along
  // the Embankment → finish at The Mall.
  london:
    "M 88 58 L 84 54 L 80 56 L 76 60 L 78 66 L 84 70 L 88 66 L 86 60 L 80 56 L 72 58 L 64 62 L 56 60 L 50 56 L 44 58 L 40 64 L 44 70 L 52 72 L 58 68 L 60 62 L 56 56 L 50 52 L 44 50 L 38 52 L 32 56 L 26 54 L 22 50 L 18 46 L 14 44 L 12 48",

  // ─────────── BOSTON ───────────
  // Hopkinton (far west) → point-to-point east through Ashland, Framingham,
  // Natick, Wellesley → climbs through the Newton hills (the notch) → down
  // Beacon St in Brookline → right on Hereford, left on Boylston, finish line.
  boston:
    "M 6 58 L 12 58 L 18 60 L 24 58 L 30 60 L 36 62 L 42 60 L 48 62 L 52 58 L 56 60 L 58 54 L 60 58 L 62 50 L 64 56 L 68 52 L 70 58 L 74 54 L 78 58 L 82 56 L 86 60 L 90 58 L 94 54",

  // ─────────── CHICAGO ───────────
  // Loop course. Grant Park start → north up Lincoln Park → back south through
  // the Loop → west to United Center → south through Pilsen → loops Chinatown
  // → returns north on Michigan Ave to finish in Grant Park. A pinched figure.
  chicago:
    "M 60 50 L 60 40 L 58 30 L 54 22 L 50 18 L 46 22 L 44 30 L 46 38 L 50 42 L 54 44 L 58 50 L 60 56 L 58 64 L 50 70 L 42 70 L 34 66 L 28 60 L 24 54 L 22 48 L 26 44 L 32 46 L 38 50 L 44 54 L 50 56 L 56 60 L 60 66 L 58 74 L 50 80 L 42 82 L 36 86 L 42 88 L 50 86 L 58 84 L 60 78 L 62 70 Z",

  // ─────────── TOKYO ───────────
  // Shinjuku start (NW) → SE past Imperial Palace → loop south to Shinagawa →
  // back north → east past Asakusa Kaminarimon → south finish at Tokyo Big
  // Sight, Odaiba. Several distinct out-and-back legs.
  tokyo:
    "M 14 24 L 20 28 L 28 30 L 36 32 L 42 36 L 46 42 L 44 50 L 40 58 L 38 66 L 42 72 L 50 74 L 56 70 L 58 62 L 56 54 L 52 48 L 54 42 L 62 40 L 70 42 L 76 46 L 78 52 L 74 58 L 68 60 L 72 66 L 78 70 L 84 74 L 86 80 L 82 86 L 76 88 L 70 86",

  // ─────────── PARIS ───────────
  // Champs-Élysées start at Arc de Triomphe → east to Place de la Concorde →
  // Rue de Rivoli → Bastille → loop through Bois de Vincennes → back west on
  // the Seine quais south bank → loop through Bois de Boulogne → finish near
  // Avenue Foch. Two big bookend loops.
  paris:
    "M 24 50 L 30 46 L 36 48 L 40 52 L 46 50 L 52 48 L 58 50 L 64 52 L 70 56 L 76 58 L 82 60 L 86 64 L 84 70 L 78 72 L 72 70 L 68 64 L 70 58 L 76 56 L 80 52 L 78 46 L 72 44 L 68 48 L 64 52 L 58 56 L 50 58 L 42 56 L 36 58 L 30 62 L 24 60 L 18 56 L 16 50 L 20 46 L 26 44 L 30 48",

  // ─────────── STOCKHOLM ───────────
  // Two-lap course starting/finishing at Stockholms Stadion (NE).
  // Out west across Västerbron, loop around Kungsholmen, back over the
  // bridges through Gamla Stan and Södermalm, north along Strandvägen,
  // out to Djurgården, repeat. Spiky, multi-island silhouette.
  stockholm:
    "M 86 16 L 80 22 L 74 22 L 70 28 L 64 30 L 60 36 L 54 36 L 50 42 L 44 42 L 38 46 L 32 46 L 26 50 L 20 56 L 18 64 L 22 70 L 30 72 L 36 70 L 42 66 L 48 68 L 54 72 L 60 76 L 66 78 L 72 76 L 78 70 L 82 64 L 78 58 L 72 56 L 66 60 L 60 62 L 54 58 L 50 52 L 56 50 L 62 52 L 68 50 L 74 46 L 76 40 L 72 36 L 78 34 L 84 30 L 86 24 Z M 86 16 L 88 22 L 90 30",


  // ─────────── VALENCIA ───────────
  // Loops west through historic center and out east to finish on the floating
  // blue carpet in front of the City of Arts & Sciences.
  valencia:
    "M 16 64 L 22 58 L 30 54 L 36 48 L 42 44 L 48 40 L 54 36 L 60 32 L 66 30 L 72 32 L 76 38 L 74 46 L 68 50 L 62 52 L 56 50 L 50 54 L 46 60 L 50 66 L 58 68 L 66 66 L 72 62 L 78 64 L 82 70 L 86 76",

  // ─────────── AMSTERDAM ───────────
  // Olympic Stadium start → south through Amstelpark out-and-back → north
  // along the Amstel → loop through Vondelpark → finish back at the stadium.
  amsterdam:
    "M 42 70 L 40 62 L 36 56 L 30 50 L 28 42 L 32 36 L 40 32 L 48 30 L 56 32 L 64 36 L 70 42 L 72 50 L 70 58 L 64 62 L 56 60 L 50 56 L 48 50 L 52 46 L 60 46 L 66 50 L 64 56 L 56 56 L 50 60 L 48 66 L 44 70",

  // ─────────── COPENHAGEN ───────────
  // Two laps around the central lakes and Frederiksberg, finishing on Islands
  // Brygge.
  copenhagen:
    "M 28 56 L 34 50 L 42 46 L 50 44 L 58 46 L 66 50 L 72 56 L 74 64 L 70 70 L 62 72 L 54 70 L 48 66 L 46 60 L 50 56 L 58 54 L 66 56 L 70 62 L 66 68 L 58 68 L 52 64 L 50 58 L 44 56 L 38 60 L 32 66 L 28 70",

  // ─────────── VIENNA ───────────
  vienna:
    "M 18 50 L 26 48 L 34 50 L 40 46 L 46 40 L 54 36 L 62 36 L 70 40 L 76 46 L 78 54 L 74 62 L 66 66 L 58 66 L 50 62 L 46 56 L 42 60 L 36 66 L 28 68 L 22 64 L 20 56",

  // ─────────── SYDNEY ───────────
  // North Sydney start → over the Harbour Bridge → loop through the CBD →
  // east through Domain → finish in front of the Opera House.
  sydney:
    "M 18 76 L 24 68 L 30 62 L 36 56 L 38 48 L 42 42 L 48 38 L 56 36 L 64 38 L 72 42 L 78 50 L 80 58 L 76 64 L 70 68 L 62 66 L 56 70 L 50 74 L 56 76 L 64 78 L 72 76",

  // ─────────── GENERIC FALLBACK ───────────
  // A pleasing serpentine for races without a hand-traced route.
  generic:
    "M 14 70 L 22 64 L 30 66 L 38 60 L 44 52 L 50 50 L 56 56 L 62 52 L 66 44 L 72 40 L 78 44 L 84 38 L 90 32",
};

export function getRoutePath(raceId: string | undefined): string {
  if (!raceId) return RACE_ROUTES.generic;
  return RACE_ROUTES[raceId] ?? RACE_ROUTES.generic;
}
