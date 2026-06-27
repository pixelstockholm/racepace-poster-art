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

// Theme = paper finish, used as fallback / for custom races.
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

// Split race name across two lines: drop a sponsor first-word like "TCS", "BMW".
function splitRaceName(race: string): string[] {
  const trimmed = race.trim();
  if (!trimmed) return ["YOUR RACE"];
  const cleaned = trimmed
    .replace(/^(TCS|BMW|Bank of America|Schneider Electric|Mainova|Generali|Nike|Sanlam|Spar|Orlen|Volkswagen|Acea|Zurich|EDP|N Kolay|Irish Life)\s+/i, "")
    .trim();
  const parts = cleaned.split(/\s+/);
  if (parts.length === 1) return [parts[0].toUpperCase()];
  // Put "Marathon" alone on line 2 if it's the last word.
  if (parts.length >= 2 && /^marathon$/i.test(parts[parts.length - 1])) {
    return [parts.slice(0, -1).join(" ").toUpperCase(), parts[parts.length - 1].toUpperCase()];
  }
  // Otherwise split roughly in half.
  const mid = Math.ceil(parts.length / 2);
  return [parts.slice(0, mid).join(" ").toUpperCase(), parts.slice(mid).join(" ").toUpperCase()];
}

// Detect light vs dark paper for adjustments.
function isLight(hex: string): boolean {
  const m = hex.replace("#", "");
  if (m.length !== 6) return true;
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 140;
}

export function PosterPreview({ config, className }: Props) {
  // City identity wins when known; otherwise use selected theme.
  const identity: RaceIdentity | null = getRaceIdentity(config.raceId);
  const themeFallback = THEMES[config.theme] ?? THEMES.cream;
  const palette = identity
    ? {
        paper: identity.paper,
        ink: identity.ink,
        accent: identity.accent,
        support: identity.support,
        mark: identity.mark,
      }
    : themeFallback;

  const raceLines = splitRaceName(config.race);
  const displayName = (config.name?.trim() || "Your Name").toUpperCase();
  const displayTime = config.time?.trim() || "00:00:00";
  const displayDate = formatDate(config.date);
  const year = yearOf(config.date);
  const distanceKm = config.distanceKm ?? 42.195;
  const distanceLabel = `${distanceKm.toFixed(3).replace(/\.?0+$/, "")} KM`;
  const locationLine = (config.location || "").toUpperCase();
  const tagline = identity?.tagline ?? "";
  const cityName = (() => {
    if (config.location) {
      const c = config.location.split(",")[0]?.trim();
      if (c) return c.toUpperCase();
    }
    return (raceLines[0] || "CITY").toUpperCase();
  })();
  const countryLine = config.location && config.location.includes(",")
    ? config.location.split(",").slice(1).join(",").trim().toUpperCase()
    : "";
  const editionNo = (() => {
    const seed = `${config.raceId ?? config.race}-${year}`;
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return String((h % 90) + 10).padStart(2, "0");
  })();


  // Warm off-white archival paper, regardless of identity.
  const paper = "#F1EBDD";
  const ink = "#1A1714";
  const inkSoft = "rgba(26,23,20,0.6)";
  const inkFaint = "rgba(26,23,20,0.38)";
  const hairline = "rgba(26,23,20,0.28)";
  const accent = palette.accent;

  const grainId = useMemo(() => `grain-${Math.random().toString(36).slice(2, 9)}`, []);

  const dayMonth = useMemo(() => {
    if (!config.date) return "";
    const d = new Date(config.date);
    if (Number.isNaN(d.getTime())) return config.date;
    return d
      .toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
      .toUpperCase();
  }, [config.date]);

  const serif = '"Fraunces", "Canela", "Tiempos", "Playfair Display", Georgia, "Times New Roman", serif';
  const sans  = '"Inter", system-ui, sans-serif';

  return (
    <div
      className={className}
      style={{
        aspectRatio: "2 / 3",
        backgroundColor: paper,
        color: ink,
        position: "relative",
        overflow: "hidden",
        fontFamily: serif,
        boxShadow:
          "0 1px 1px rgba(0,0,0,0.06), 0 30px 70px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(0,0,0,0.05)",
      }}
    >
      {/* Subtle paper grain */}
      <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
        <filter id={grainId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          filter: `url(#${grainId})`,
          opacity: 0.14,
          mixBlendMode: "multiply",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 0% 0%, rgba(120,90,40,0.07), transparent 45%), radial-gradient(ellipse at 100% 100%, rgba(120,90,40,0.07), transparent 45%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          padding: "7% 8% 6%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top edition mark */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontFamily: sans,
            fontSize: "0.5rem",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 500,
            color: inkSoft,
          }}
        >
          <span>Edition Nº {editionNo}</span>
          <span style={{ color: accent }}>·</span>
          <span>Racepace</span>
        </div>

        <div style={{ borderTop: `1px solid ${hairline}`, margin: "0.55rem 0 1.4rem" }} />

        {/* CITY / MARATHON / YEAR — the hero wordmark */}
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontFamily: serif,
              fontWeight: 500,
              fontStyle: "normal",
              fontSize: "clamp(2.6rem, 10vw, 5.4rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.025em",
              margin: 0,
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
              fontSize: "clamp(0.9rem, 2.6vw, 1.4rem)",
              letterSpacing: "0.02em",
              marginTop: "0.25rem",
              color: ink,
            }}
          >
            Marathon
          </div>
          <div
            style={{
              fontFamily: sans,
              fontSize: "0.55rem",
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              fontWeight: 500,
              marginTop: "0.55rem",
              color: accent,
            }}
          >
            {year || "—"}
          </div>
        </div>

        {/* ROUTE — hero illustration, ~40% of poster */}
        <div
          style={{
            flex: "1 1 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "1.2rem 0 0.6rem",
            minHeight: 0,
          }}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            style={{ width: "92%", height: "100%", display: "block" }}
            aria-hidden
          >
            <path
              d={config.routePath}
              fill="none"
              stroke={ink}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            {(() => {
              const m = config.routePath.match(/-?\d+(?:\.\d+)?/g);
              if (!m || m.length < 4) return null;
              const sx = parseFloat(m[0]);
              const sy = parseFloat(m[1]);
              const ex = parseFloat(m[m.length - 2]);
              const ey = parseFloat(m[m.length - 1]);
              return (
                <g>
                  <circle cx={sx} cy={sy} r="1.6" fill={accent} vectorEffect="non-scaling-stroke" />
                  <circle cx={ex} cy={ey} r="1.6" fill={accent} vectorEffect="non-scaling-stroke" />
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Tagline — course descriptor */}
        {tagline && (
          <div
            style={{
              textAlign: "center",
              fontFamily: serif,
              fontStyle: "italic",
              fontSize: "0.72rem",
              letterSpacing: "0.02em",
              color: inkSoft,
              marginBottom: "1.2rem",
            }}
          >
            {tagline}
          </div>
        )}

        <div style={{ borderTop: `1px solid ${hairline}`, marginBottom: "1rem" }} />

        {/* Finisher block — minimal hierarchy */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: sans,
              fontSize: "0.46rem",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: inkFaint,
              marginBottom: "0.35rem",
            }}
          >
            Official Time
          </div>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 500,
              fontSize: "clamp(1.6rem, 5vw, 2.4rem)",
              letterSpacing: "-0.01em",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              color: ink,
            }}
          >
            {displayTime}
          </div>
          <div
            style={{
              fontFamily: serif,
              fontStyle: "italic",
              fontSize: "0.95rem",
              letterSpacing: "0.01em",
              marginTop: "0.7rem",
              color: ink,
            }}
          >
            {displayName
              .toLowerCase()
              .replace(/(^|\s)\S/g, (c) => c.toUpperCase())}
          </div>
          <div
            style={{
              fontFamily: sans,
              fontSize: "0.5rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 500,
              color: inkSoft,
              marginTop: "0.45rem",
            }}
          >
            {distanceLabel} <span style={{ color: accent }}>·</span> {displayDate || dayMonth || "—"}
          </div>
        </div>

        <div style={{ flex: "0 0 auto", marginTop: "auto", paddingTop: "1rem" }}>
          <div style={{ borderTop: `1px solid ${hairline}`, marginBottom: "0.5rem" }} />
          <div
            style={{
              textAlign: "center",
              fontFamily: sans,
              fontSize: "0.44rem",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              fontWeight: 500,
              color: inkFaint,
            }}
          >
            Edition Nº {editionNo} {countryLine ? `· ${countryLine}` : ""}
          </div>
        </div>
      </div>
    </div>
  );
}


