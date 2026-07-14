import { useId, useMemo } from "react";

export type PosterTheme = "midnight" | "ember" | "forest" | "cream" | "noir" | "sky";

export interface PosterConfig {
  name: string;
  race: string;
  date: string;
  time: string;
  theme: PosterTheme;
  routePath: string | null;
  location?: string;
  distanceKm?: number;
  elevationM?: number;
  raceId?: string;
  bib?: string;
  size?: string;
}

interface ThemeTokens {
  paper: string;
  ink: string;
  accent: string;
  support: string;
  mark: string;
  label: string;
}

export const THEMES: Record<PosterTheme, ThemeTokens> = {
  cream: {
    label: "Bone",
    paper: "#EFE7D6",
    ink: "#0E1A12",
    accent: "#C8102E",
    support: "#1F3A2E",
    mark: "#0E1A12",
  },
  midnight: {
    label: "Midnight",
    paper: "#0B1B2B",
    ink: "#F2EDE1",
    accent: "#F58220",
    support: "#3A6EA5",
    mark: "#F2EDE1",
  },
  ember: {
    label: "Ember",
    paper: "#1A0F0A",
    ink: "#F4E8D0",
    accent: "#E25822",
    support: "#E0B83C",
    mark: "#F4E8D0",
  },
  forest: {
    label: "Forest",
    paper: "#0E2418",
    ink: "#EFE7D6",
    accent: "#E2B45F",
    support: "#7FB28C",
    mark: "#EFE7D6",
  },
  noir: {
    label: "Noir",
    paper: "#0A0A0B",
    ink: "#F2EFE7",
    accent: "#BF1B2C",
    support: "#F2EFE7",
    mark: "#F2EFE7",
  },
  sky: {
    label: "Steel",
    paper: "#E6EAF0",
    ink: "#0B1F3A",
    accent: "#1F4FA8",
    support: "#0B1F3A",
    mark: "#0B1F3A",
  },
};

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.toUpperCase();
  return d
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

function yearOf(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : String(d.getFullYear());
}

interface Props {
  config: PosterConfig;
  className?: string;
}

// Per-city neighborhood lists — curated, real, not filler.
const NEIGHBORHOODS: Record<string, string[]> = {
  berlin: ["Tiergarten", "Mitte", "Kreuzberg", "Charlottenburg", "Brandenburg Gate"],
  nyc: ["Staten Island", "Brooklyn", "Queens", "Bronx", "Manhattan", "Central Park"],
  london: ["Greenwich", "Tower Bridge", "Canary Wharf", "Westminster", "The Mall"],
  boston: ["Hopkinton", "Ashland", "Heartbreak Hill", "Brookline", "Boylston Street"],
  chicago: ["Grant Park", "River North", "The Loop", "Lincoln Park", "Chinatown"],
  tokyo: ["Shinjuku", "Asakusa", "Ginza", "Tokyo Bay", "Nihonbashi"],
  paris: ["Bois de Vincennes", "Bastille", "Seine", "Eiffel", "Champs-Élysées"],
  stockholm: ["Södermalm", "Djurgården", "Kungsholmen", "Östermalm", "Gamla Stan"],
  hamburg: ["Karolinenviertel", "Alster", "Eppendorf", "HafenCity", "Messe"],
  "big-sur": ["Big Sur", "Bixby Bridge", "Hurricane Point", "Carmel Highlands", "Highway 1"],
  "gold-coast": ["Southport", "Broadwater", "Surfers Paradise", "Burleigh", "Runaway Bay"],
  "san-francisco": [
    "Embarcadero",
    "Fisherman's Wharf",
    "Golden Gate",
    "Haight Street",
    "Oracle Park",
  ],
  knysna: ["Knysna Forest", "Gouna", "Simola", "Estuary", "Knysna Heads"],
  oulu: ["Kuusisaari", "Tuiranranta", "Oulu River", "Raatinsaari", "Athletics Stadium"],
  valencia: ["Ciutat Vella", "Russafa", "Cabanyal", "Turia", "Ciudad de las Artes"],
  amsterdam: ["Olympisch Stadion", "Vondelpark", "Amstel", "Centrum", "Oud-Zuid"],
  copenhagen: ["Nørrebro", "Frederiksberg", "Christianshavn", "Islands Brygge", "Vesterbro"],
  vienna: ["Innere Stadt", "Ringstraße", "Prater", "Leopoldstadt", "Wieden"],
  sydney: ["North Sydney", "The Rocks", "CBD", "Domain", "Opera House"],
};

// Approximate city coordinates for the small bottom-left detail.
const COORDS: Record<string, { lat: string; lon: string }> = {
  berlin: { lat: "52.5200° N", lon: "13.4050° E" },
  nyc: { lat: "40.7128° N", lon: "74.0060° W" },
  london: { lat: "51.5074° N", lon: "0.1278° W" },
  boston: { lat: "42.3601° N", lon: "71.0589° W" },
  chicago: { lat: "41.8781° N", lon: "87.6298° W" },
  tokyo: { lat: "35.6762° N", lon: "139.6503° E" },
  paris: { lat: "48.8566° N", lon: "2.3522° E" },
  stockholm: { lat: "59.3293° N", lon: "18.0686° E" },
  hamburg: { lat: "53.5511° N", lon: "9.9937° E" },
  "big-sur": { lat: "36.2704° N", lon: "121.8081° W" },
  "gold-coast": { lat: "27.9719° S", lon: "153.4063° E" },
  "san-francisco": { lat: "37.7749° N", lon: "122.4194° W" },
  knysna: { lat: "34.0351° S", lon: "23.0465° E" },
  oulu: { lat: "65.0201° N", lon: "25.4618° E" },
  valencia: { lat: "39.4699° N", lon: "0.3763° W" },
  amsterdam: { lat: "52.3676° N", lon: "4.9041° E" },
  copenhagen: { lat: "55.6761° N", lon: "12.5683° E" },
  vienna: { lat: "48.2082° N", lon: "16.3738° E" },
  sydney: { lat: "33.8688° S", lon: "151.2093° E" },
};

const CITY_PALETTES: Record<string, { paper: string; ink: string; muted: string; line: string }> = {
  berlin: { paper: "#1B1713", ink: "#F4EADC", muted: "#D1C2AF", line: "#F4EADC" },
  nyc: { paper: "#F1C84B", ink: "#17130C", muted: "#5C4C19", line: "#17130C" },
  london: { paper: "#B01828", ink: "#FFF4E8", muted: "#F1C9C6", line: "#FFF4E8" },
  stockholm: { paper: "#2474E8", ink: "#FFFFFF", muted: "#D7E7FF", line: "#FFFFFF" },
  hamburg: { paper: "#214B5F", ink: "#F5E8D7", muted: "#C6D2D4", line: "#F5E8D7" },
  "big-sur": { paper: "#40563B", ink: "#F3E9D8", muted: "#D3DBC8", line: "#F3E9D8" },
  "gold-coast": { paper: "#E1A83C", ink: "#17120B", muted: "#604816", line: "#17120B" },
  "san-francisco": { paper: "#C34A2E", ink: "#FFF0DF", muted: "#F3C8B8", line: "#FFF0DF" },
  knysna: { paper: "#0E4A42", ink: "#F2E7D4", muted: "#BBD2C8", line: "#F2E7D4" },
  oulu: { paper: "#D9E7F2", ink: "#142536", muted: "#5B7285", line: "#142536" },
  edinburgh: { paper: "#4A314F", ink: "#F5E8D8", muted: "#D8C4D6", line: "#F5E8D8" },
  amsterdam: { paper: "#E75B2C", ink: "#FFF0E5", muted: "#FFD0BB", line: "#FFF0E5" },
  paris: { paper: "#E8DED1", ink: "#151515", muted: "#5D554B", line: "#151515" },
};

export function PosterPreview({ config, className }: Props) {
  const displayName = (config.name?.trim() || "Your Name").toUpperCase();
  const displayTime = config.time?.trim() || "00:00:00";
  const displayDate = formatDate(config.date);
  const year = yearOf(config.date);

  const cityName = (() => {
    if (config.location) {
      const c = config.location.split(",")[0]?.trim();
      if (c) return c.toUpperCase();
    }
    return (config.race || "CITY").split(/\s+/)[0]?.toUpperCase() || "CITY";
  })();
  const countryLine =
    config.location && config.location.includes(",")
      ? config.location.split(",").slice(1).join(",").trim().toUpperCase()
      : "";

  const editionNo = useMemo(() => {
    const seed = `${config.raceId ?? config.race}-${year}`;
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return String((h % 90) + 10).padStart(2, "0");
  }, [config.raceId, config.race, year]);

  const neighborhoods = (config.raceId && NEIGHBORHOODS[config.raceId]) || [];
  const coords = config.raceId ? COORDS[config.raceId] : undefined;

  // Auto-fit the route inside the SVG by computing its bounding box.
  const hasRoute = !!config.routePath;
  const routeBox = useMemo(() => {
    const empty = { vb: "0 0 100 100", endX: 50, endY: 50, startX: 50, startY: 50 };
    if (!config.routePath) return empty;
    const m = config.routePath.match(/-?\d+(?:\.\d+)?/g);
    if (!m || m.length < 4) return empty;
    const nums = m.map(parseFloat);
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    for (let i = 0; i < nums.length - 1; i += 2) {
      const x = nums[i],
        y = nums[i + 1];
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    const w = maxX - minX,
      h = maxY - minY;
    const pad = Math.max(w, h) * 0.03;
    return {
      vb: `${minX - pad} ${minY - pad} ${w + pad * 2} ${h + pad * 2}`,
      startX: nums[0],
      startY: nums[1],
      endX: nums[nums.length - 2],
      endY: nums[nums.length - 1],
    };
  }, [config.routePath]);

  const cityPalette = (config.raceId && CITY_PALETTES[config.raceId]) || CITY_PALETTES.berlin;
  const paper = cityPalette.paper;
  const ink = cityPalette.ink;
  const inkSoft = cityPalette.muted;
  const inkFaint = cityPalette.muted;
  const hairline = colorWithAlpha(cityPalette.ink, 0.36);
  const routeInk = cityPalette.line;
  const routeInkSoft = cityPalette.muted;

  const reactId = useId();
  const grainId = `grain-${reactId.replace(/:/g, "")}`;

  const serif =
    '"Fraunces", "Canela", "Tiempos", "Playfair Display", Georgia, "Times New Roman", serif';
  const sans = '"Inter", system-ui, sans-serif';

  return (
    <div
      className={className}
      data-racepace-poster
      style={{
        width: "100%",
        aspectRatio: aspectRatioForSize(config.size),
        backgroundColor: paper,
        color: ink,
        position: "relative",
        overflow: "hidden",
        fontFamily: serif,
        containerType: "inline-size",
        boxShadow:
          "0 1px 1px rgba(0,0,0,0.06), 0 30px 70px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.12)",
      }}
    >
      {/* Paper grain */}
      <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id={grainId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          filter: `url(#${grainId})`,
          opacity: 0.1,
          mixBlendMode: isLightPalette(paper) ? "multiply" : "screen",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          padding: "4% 6% 4%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top mark */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontFamily: sans,
            fontSize: "1.6cqw",
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            fontWeight: 500,
            color: inkFaint,
          }}
        >
          <span>Racepace Edition</span>
          <span>Edition Nº {editionNo}</span>
        </div>

        {/* MASTHEAD */}
        <div
          style={{
            fontFamily: serif,
            fontWeight: 700,
            fontSize: "13cqw",
            lineHeight: 0.92,
            letterSpacing: "0.01em",
            margin: "1.8cqw 0 0",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          {cityName}
        </div>

        <div
          style={{
            fontFamily: serif,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "3.4cqw",
            letterSpacing: "0.01em",
            textAlign: "center",
            marginTop: "1.5cqw",
            color: ink,
          }}
        >
          The Marathon
        </div>

        {year && (
          <div
            style={{
              fontFamily: sans,
              fontSize: "2.6cqw",
              letterSpacing: "0.06em",
              textAlign: "center",
              marginTop: "0.8cqw",
              color: inkSoft,
              fontWeight: 500,
            }}
          >
            {year}
          </div>
        )}

        {/* ROUTE + LEFT-SIDE NEIGHBORHOODS */}
        <div
          style={{
            position: "relative",
            flex: "1 1 0",
            minHeight: 0,
            margin: "2cqw -1.5% 1.2cqw",
            display: "grid",
            gridTemplateColumns: "minmax(0, 19%) 1fr",
            gap: "2%",
            alignItems: "stretch",
          }}
        >
          {/* Neighborhood column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              fontFamily: sans,
              fontSize: "1.7cqw",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: inkSoft,
              fontWeight: 500,
              paddingLeft: "1.5%",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6em" }}>
              {neighborhoods.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
            {coords && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.2em",
                  color: inkFaint,
                  letterSpacing: "0.12em",
                }}
              >
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{coords.lat}</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{coords.lon}</span>
              </div>
            )}
          </div>

          {/* Route — hero in accent, or a "pending" plate when no verified GPX yet */}
          {hasRoute ? (
            <svg
              viewBox={routeBox.vb}
              preserveAspectRatio="xMidYMid meet"
              style={{ width: "100%", height: "100%", display: "block" }}
              aria-hidden
            >
              <path
                d={config.routePath ?? ""}
                fill="none"
                stroke={routeInk}
                strokeWidth="1.35"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx={routeBox.startX}
                cy={routeBox.startY}
                r="1.4"
                fill="none"
                stroke={routeInk}
                strokeWidth="1"
              />
              <circle cx={routeBox.endX} cy={routeBox.endY} r="1.6" fill={routeInk} />
            </svg>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px dashed ${hairline}`,
                fontFamily: sans,
                fontSize: "1.6cqw",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: inkFaint,
                textAlign: "center",
                padding: "3cqw",
              }}
            >
              Route pending verification
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: hairline, margin: "1.2cqw 0 2cqw" }} />

        {/* Time + finisher */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: "8cqw",
              letterSpacing: "0.04em",
              lineHeight: 1,
              color: routeInkSoft,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {displayTime}
          </div>
          <div
            style={{
              fontFamily: sans,
              fontWeight: 500,
              fontSize: "2.8cqw",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: ink,
              marginTop: "2.2cqw",
            }}
          >
            {displayName}
          </div>
          <div
            style={{
              fontFamily: sans,
              fontSize: "1.8cqw",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: inkFaint,
              marginTop: "1.8cqw",
              fontWeight: 500,
            }}
          >
            {displayDate}
            {countryLine ? ` · ${countryLine}` : ""}
          </div>
        </div>
      </div>
    </div>
  );
}

export function aspectRatioForSize(size?: string): string {
  const normalized = (size || "").toLowerCase().replace(/[×x]/g, "x").replace(/\s/g, "");
  if (normalized.includes("70x100")) return "7 / 10";
  if (normalized.includes("50x70")) return "5 / 7";
  if (normalized.includes("30x40")) return "3 / 4";
  return "3 / 4";
}

function colorWithAlpha(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function isLightPalette(hex: string): boolean {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 190;
}
