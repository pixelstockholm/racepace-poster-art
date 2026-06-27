import { useMemo } from "react";

import { getRaceIdentity, type RaceIdentity } from "@/lib/raceIdentities";

export type PosterTheme = "midnight" | "ember" | "forest" | "cream" | "noir" | "sky";

export interface PosterConfig {
  name: string;
  race: string;
  date: string;
  time: string;
  theme: PosterTheme;
  routePath: string;
  location?: string;
  distanceKm?: number;
  elevationM?: number;
  raceId?: string;
  bib?: string;
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
  cream:    { label: "Bone",     paper: "#EFE7D6", ink: "#0E1A12", accent: "#C8102E", support: "#1F3A2E", mark: "#0E1A12" },
  midnight: { label: "Midnight", paper: "#0B1B2B", ink: "#F2EDE1", accent: "#F58220", support: "#3A6EA5", mark: "#F2EDE1" },
  ember:    { label: "Ember",    paper: "#1A0F0A", ink: "#F4E8D0", accent: "#E25822", support: "#E0B83C", mark: "#F4E8D0" },
  forest:   { label: "Forest",   paper: "#0E2418", ink: "#EFE7D6", accent: "#E2B45F", support: "#7FB28C", mark: "#EFE7D6" },
  noir:     { label: "Noir",     paper: "#0A0A0B", ink: "#F2EFE7", accent: "#BF1B2C", support: "#F2EFE7", mark: "#F2EFE7" },
  sky:      { label: "Steel",    paper: "#E6EAF0", ink: "#0B1F3A", accent: "#1F4FA8", support: "#0B1F3A", mark: "#0B1F3A" },
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
  berlin:     ["Tiergarten", "Mitte", "Kreuzberg", "Charlottenburg", "Brandenburg Gate"],
  nyc:        ["Staten Island", "Brooklyn", "Queens", "Bronx", "Manhattan", "Central Park"],
  london:     ["Greenwich", "Tower Bridge", "Canary Wharf", "Westminster", "The Mall"],
  boston:     ["Hopkinton", "Ashland", "Heartbreak Hill", "Brookline", "Boylston Street"],
  chicago:    ["Grant Park", "River North", "The Loop", "Lincoln Park", "Chinatown"],
  tokyo:      ["Shinjuku", "Asakusa", "Ginza", "Tokyo Bay", "Nihonbashi"],
  paris:      ["Bois de Vincennes", "Bastille", "Seine", "Eiffel", "Champs-Élysées"],
  stockholm:  ["Södermalm", "Djurgården", "Kungsholmen", "Östermalm", "Gamla Stan"],
  valencia:   ["Ciutat Vella", "Russafa", "Cabanyal", "Turia", "Ciudad de las Artes"],
  amsterdam:  ["Olympisch Stadion", "Vondelpark", "Amstel", "Centrum", "Oud-Zuid"],
  copenhagen: ["Nørrebro", "Frederiksberg", "Christianshavn", "Islands Brygge", "Vesterbro"],
  vienna:     ["Innere Stadt", "Ringstraße", "Prater", "Leopoldstadt", "Wieden"],
  sydney:     ["North Sydney", "The Rocks", "CBD", "Domain", "Opera House"],
};

// Approximate city coordinates for the small bottom-left detail.
const COORDS: Record<string, { lat: string; lon: string }> = {
  berlin:     { lat: "52.5200° N", lon: "13.4050° E" },
  nyc:        { lat: "40.7128° N", lon: "74.0060° W" },
  london:     { lat: "51.5074° N", lon: "0.1278° W" },
  boston:     { lat: "42.3601° N", lon: "71.0589° W" },
  chicago:    { lat: "41.8781° N", lon: "87.6298° W" },
  tokyo:      { lat: "35.6762° N", lon: "139.6503° E" },
  paris:      { lat: "48.8566° N", lon: "2.3522° E" },
  stockholm:  { lat: "59.3293° N", lon: "18.0686° E" },
  valencia:   { lat: "39.4699° N", lon: "0.3763° W" },
  amsterdam:  { lat: "52.3676° N", lon: "4.9041° E" },
  copenhagen: { lat: "55.6761° N", lon: "12.5683° E" },
  vienna:     { lat: "48.2082° N", lon: "16.3738° E" },
  sydney:     { lat: "33.8688° S", lon: "151.2093° E" },
};

export function PosterPreview({ config, className }: Props) {
  const identity: RaceIdentity | null = getRaceIdentity(config.raceId);
  const themeFallback = THEMES[config.theme] ?? THEMES.cream;
  const palette = identity
    ? { paper: identity.paper, ink: identity.ink, accent: identity.accent, support: identity.support, mark: identity.mark }
    : themeFallback;

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
  const countryLine = config.location && config.location.includes(",")
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
  const routeBox = useMemo(() => {
    const m = config.routePath.match(/-?\d+(?:\.\d+)?/g);
    if (!m || m.length < 4) return { vb: "0 0 100 100", endX: 50, endY: 50, startX: 50, startY: 50 };
    const nums = m.map(parseFloat);
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let i = 0; i < nums.length - 1; i += 2) {
      const x = nums[i], y = nums[i + 1];
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
    const w = maxX - minX, h = maxY - minY;
    const pad = Math.max(w, h) * 0.03;
    return {
      vb: `${minX - pad} ${minY - pad} ${w + pad * 2} ${h + pad * 2}`,
      startX: nums[0],
      startY: nums[1],
      endX: nums[nums.length - 2],
      endY: nums[nums.length - 1],
    };
  }, [config.routePath]);

  // Editorial warm paper
  const paper = "#F1EBDD";
  const ink = "#16130E";
  const inkSoft = "rgba(22,19,14,0.62)";
  const inkFaint = "rgba(22,19,14,0.42)";
  const hairline = "rgba(22,19,14,0.28)";
  const accent = palette.accent;

  const grainId = useMemo(() => `grain-${Math.random().toString(36).slice(2, 9)}`, []);

  const serif = '"Fraunces", "Canela", "Tiempos", "Playfair Display", Georgia, "Times New Roman", serif';
  const sans  = '"Inter", system-ui, sans-serif';

  return (
    <div
      className={className}
      style={{
        width: "100%",
        aspectRatio: "3 / 4",
        backgroundColor: paper,
        color: ink,
        position: "relative",
        overflow: "hidden",
        fontFamily: serif,
        containerType: "inline-size",
        boxShadow: "0 1px 1px rgba(0,0,0,0.06), 0 30px 70px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(0,0,0,0.05)",
      }}
    >
      {/* Paper grain */}
      <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id={grainId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>
      <div aria-hidden style={{ position: "absolute", inset: 0, filter: `url(#${grainId})`, opacity: 0.14, mixBlendMode: "multiply", pointerEvents: "none", zIndex: 0 }} />

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
            fontSize: "0.42rem",
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
        <h1
          style={{
            fontFamily: serif,
            fontWeight: 700,
            fontSize: "clamp(1.6rem, 13cqw, 4rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.02em",
            margin: "0.4rem 0 0",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          {cityName}
        </h1>

        <div
          style={{
            fontFamily: serif,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(0.6rem, 3.4cqw, 1.05rem)",
            letterSpacing: "0.01em",
            textAlign: "center",
            marginTop: "0.35rem",
            color: ink,
          }}
        >
          The Marathon
        </div>

        {year && (
          <div
            style={{
              fontFamily: sans,
              fontSize: "clamp(0.55rem, 2.6cqw, 0.85rem)",
              letterSpacing: "0.06em",
              textAlign: "center",
              marginTop: "0.2rem",
              color: accent,
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
            margin: "0.5rem -1.5% 0.3rem",
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
              fontSize: "0.44rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: inkSoft,
              fontWeight: 500,
              paddingLeft: "1.5%",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {neighborhoods.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
            {coords && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem", color: inkFaint, letterSpacing: "0.12em" }}>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{coords.lat}</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{coords.lon}</span>
              </div>
            )}
          </div>

          {/* Route — hero in accent */}
          <svg
            viewBox={routeBox.vb}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: "100%", height: "100%", display: "block" }}
            aria-hidden
          >
            <path
              d={config.routePath}
              fill="none"
              stroke={accent}
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx={routeBox.startX} cy={routeBox.startY} r="1.4" fill="none" stroke={accent} strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <circle cx={routeBox.endX} cy={routeBox.endY} r="1.6" fill={accent} vectorEffect="non-scaling-stroke" />
          </svg>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: hairline, margin: "0.4rem 0 0.7rem" }} />

        {/* Time + finisher */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: "clamp(1.3rem, 8cqw, 2.4rem)",
              letterSpacing: "0.04em",
              lineHeight: 1,
              color: `color-mix(in oklab, ${accent} 78%, #16130E)`,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {displayTime}
          </div>
          <div
            style={{
              fontFamily: sans,
              fontWeight: 500,
              fontSize: "clamp(0.6rem, 2.8cqw, 0.85rem)",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: ink,
              marginTop: "0.55rem",
            }}
          >
            {displayName}
          </div>
          <div
            style={{
              fontFamily: sans,
              fontSize: "0.46rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: inkFaint,
              marginTop: "0.45rem",
              fontWeight: 500,
            }}
          >
            {displayDate}{countryLine ? ` · ${countryLine}` : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
