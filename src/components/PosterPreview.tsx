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
    .toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
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

// Per-city neighborhood lists shown in the map margin (vintage cartographic key).
const NEIGHBORHOODS: Record<string, string[]> = {
  berlin:     ["Mitte", "Kreuzberg", "Neukölln", "Charlottenburg", "Tiergarten"],
  nyc:        ["Staten Island", "Brooklyn", "Queens", "Bronx", "Manhattan"],
  london:     ["Greenwich", "Tower", "Isle of Dogs", "Embankment", "The Mall"],
  boston:     ["Hopkinton", "Framingham", "Wellesley", "Newton", "Boylston"],
  chicago:    ["Loop", "Lincoln Park", "Pilsen", "Chinatown", "Bronzeville"],
  tokyo:      ["Shinjuku", "Imperial Palace", "Shinagawa", "Asakusa", "Odaiba"],
  paris:      ["Concorde", "Rivoli", "Bastille", "Vincennes", "Boulogne"],
  stockholm:  ["Södermalm", "Djurgården", "Kungsholmen", "Östermalm", "Gamla Stan"],
  valencia:   ["Ciutat Vella", "Russafa", "Cabanyal", "Turia", "Ciudad de las Artes"],
  amsterdam:  ["Olympisch", "Vondelpark", "Amstel", "Centrum", "Oud-Zuid"],
  copenhagen: ["Nørrebro", "Frederiksberg", "Christianshavn", "Islands Brygge", "Vesterbro"],
  vienna:     ["Innere Stadt", "Ringstraße", "Prater", "Leopoldstadt", "Wieden"],
  sydney:     ["North Sydney", "The Rocks", "CBD", "Domain", "Opera House"],
  oslo:       ["Bygdøy", "Frogner", "Akershus", "Grünerløkka", "Sentrum"],
  helsinki:   ["Töölö", "Kallio", "Kamppi", "Kruununhaka", "Olympiastadion"],
  barcelona:  ["Diagonal", "Eixample", "Gòtic", "Gràcia", "Sagrada Família"],
  rome:       ["Fori Imperiali", "Trastevere", "Vaticano", "Aventino", "Colosseo"],
  milan:      ["Duomo", "Sforzesco", "Brera", "Navigli", "San Siro"],
};

function isLight(hex: string): boolean {
  const m = hex.replace("#", "");
  if (m.length !== 6) return true;
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 140;
}

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
  const distanceKm = config.distanceKm ?? 42.195;
  const distanceLabel = `${distanceKm.toFixed(3).replace(/\.?0+$/, "")} kilometers`;
  const tagline = identity?.tagline ?? "A point-to-point marathon course";

  const cityName = (() => {
    if (config.location) {
      const c = config.location.split(",")[0]?.trim();
      if (c) return c.toUpperCase();
    }
    return (config.race || "CITY").split(/\s+/)[0]?.toUpperCase() || "CITY";
  })();
  const countryLine = config.location && config.location.includes(",")
    ? config.location.split(",").slice(1).join(",").trim().toUpperCase()
    : (config.location || "").toUpperCase();

  const editionNo = useMemo(() => {
    const seed = `${config.raceId ?? config.race}-${year}`;
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return String((h % 90) + 10).padStart(2, "0");
  }, [config.raceId, config.race, year]);

  const neighborhoods = config.raceId ? NEIGHBORHOODS[config.raceId] : undefined;

  // Course waypoints derived from tagline (used as the italic course line)
  const courseLine = useMemo(() => {
    if (!neighborhoods || neighborhoods.length < 3) return tagline;
    const pts = [neighborhoods[0], neighborhoods[1], neighborhoods[2], neighborhoods[neighborhoods.length - 1]];
    return pts.join(" → ");
  }, [neighborhoods, tagline]);

  // Auto-fit the route inside the SVG by computing its bounding box.
  const routeBox = useMemo(() => {
    const m = config.routePath.match(/-?\d+(?:\.\d+)?/g);
    if (!m || m.length < 4) return { vb: "0 0 100 100", endX: 50, endY: 50 };
    const nums = m.map(parseFloat);
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let i = 0; i < nums.length - 1; i += 2) {
      const x = nums[i], y = nums[i + 1];
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
    const w = maxX - minX, h = maxY - minY;
    const pad = Math.max(w, h) * 0.06;
    return {
      vb: `${minX - pad} ${minY - pad} ${w + pad * 2} ${h + pad * 2}`,
      endX: nums[nums.length - 2],
      endY: nums[nums.length - 1],
    };
  }, [config.routePath]);

  // Archival warm paper, ink, accent
  const paper = "#F1EBDD";
  const ink = "#16130E";
  const inkSoft = "rgba(22,19,14,0.62)";
  const inkFaint = "rgba(22,19,14,0.42)";
  const hairline = "rgba(22,19,14,0.32)";
  const mapInk = isLight(palette.paper) ? palette.ink : "#0E1B2A";
  const accent = palette.accent;

  const grainId = useMemo(() => `grain-${Math.random().toString(36).slice(2, 9)}`, []);
  const mapTextureId = useMemo(() => `map-${Math.random().toString(36).slice(2, 9)}`, []);

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
          <filter id={mapTextureId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="7" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.46  0 0 0 0 0.32  0 0 0 0.22 0" />
          </filter>
        </defs>
      </svg>
      <div aria-hidden style={{ position: "absolute", inset: 0, filter: `url(#${grainId})`, opacity: 0.16, mixBlendMode: "multiply", pointerEvents: "none", zIndex: 0 }} />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          padding: "4.5% 5.5% 3.5%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Minimal top mark */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontFamily: sans,
            fontSize: "0.46rem",
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            fontWeight: 500,
            color: inkFaint,
          }}
        >
          <span>Racepace</span>
          <span>Nº {editionNo}</span>
        </div>



        {/* MASTHEAD — full-width city name */}
        <h1
          style={{
            fontFamily: serif,
            fontWeight: 800,
            fontSize: "clamp(1.4rem, 11cqw, 3.4rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.02em",
            margin: "0.3rem 0 0",
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
            fontSize: "clamp(0.55rem, 3cqw, 0.95rem)",
            letterSpacing: "0.04em",
            textAlign: "center",
            marginTop: "0.4rem",
            color: inkSoft,
          }}
        >
          The Marathon
        </div>

        {/* MAP / ROUTE — hero */}
        <div
          style={{
            position: "relative",
            flex: "1 1 auto",
            margin: "0.9rem 0 0.6rem",
            minHeight: "52%",
          }}
        >
          <svg
            viewBox={routeBox.vb}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: "100%", height: "100%", display: "block" }}
            aria-hidden
          >
            <path
              d={config.routePath}
              fill="none"
              stroke={ink}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx={routeBox.endX} cy={routeBox.endY} r="3" fill={accent} vectorEffect="non-scaling-stroke" />
          </svg>
        </div>

        {/* Finisher — single elegant line */}
        <div style={{ textAlign: "center", marginTop: "auto" }}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 500,
              fontSize: "clamp(1.1rem, 7cqw, 2rem)",
              letterSpacing: "0.02em",
              lineHeight: 1,
              color: accent,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {displayTime}
          </div>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 500,
              fontSize: "clamp(0.7rem, 3.4cqw, 1rem)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: ink,
              marginTop: "0.7rem",
            }}
          >
            {displayName}
          </div>
          <div
            style={{
              fontFamily: sans,
              fontSize: "0.5rem",
              letterSpacing: "0.36em",
              textTransform: "uppercase",
              color: inkFaint,
              marginTop: "0.5rem",
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

function FooterCell({ label, value, align, inkSoft }: { label: string; value: string; align: "left" | "center" | "right"; inkSoft: string }) {
  return (
    <div style={{ textAlign: align }}>
      <div style={{ color: inkSoft, marginBottom: "0.3rem" }}>{label}</div>
      <div style={{ letterSpacing: "0.22em", fontWeight: 600 }}>{value}</div>
    </div>
  );
}
