import { useMemo } from "react";
import { getSkylinePath } from "@/lib/raceSkylines";
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

  const lightPaper = isLight(palette.paper);
  const inkSoft = lightPaper ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.62)";
  const inkFaint = lightPaper ? "rgba(0,0,0,0.32)" : "rgba(255,255,255,0.38)";
  const hairline = lightPaper ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.22)";
  const grainOpacity = lightPaper ? 0.18 : 0.12;

  const raceLines = useMemo(() => splitRaceName(config.race), [config.race]);
  const displayName = useMemo(
    () => (config.name?.trim() || "Your Name").toUpperCase(),
    [config.name],
  );
  const displayTime = config.time?.trim() || "00:00:00";
  const displayDate = formatDate(config.date);
  const year = yearOf(config.date);
  const distanceKm = config.distanceKm ?? 42.195;
  const distanceLabel = `${distanceKm.toFixed(3).replace(/\.?0+$/, "")} KM`;
  const skylinePath = getSkylinePath(config.raceId);
  const locationLine = (config.location || "").toUpperCase();
  const tagline = identity?.tagline ?? locationLine;

  const grainId = useMemo(() => `grain-${Math.random().toString(36).slice(2, 9)}`, []);

  return (
    <div
      className={className}
      style={{
        aspectRatio: "2 / 3",
        backgroundColor: palette.paper,
        color: palette.ink,
        position: "relative",
        overflow: "hidden",
        fontFamily: 'var(--font-sans, "Inter", system-ui, sans-serif)',
        boxShadow:
          "0 1px 1px rgba(0,0,0,0.06), 0 30px 70px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Paper grain texture */}
      <svg
        aria-hidden
        width="0"
        height="0"
        style={{ position: "absolute" }}
      >
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
          opacity: grainOpacity,
          mixBlendMode: lightPaper ? "multiply" : "screen",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Subtle landmark silhouette, bottom anchored */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "32%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <svg
          viewBox="0 0 200 40"
          preserveAspectRatio="xMidYEnd meet"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
        >
          <path d={skylinePath} fill={palette.ink} opacity={lightPaper ? 0.08 : 0.12} />
        </svg>
      </div>

      {/* Inner deckle border */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "3.5%",
          border: `1px solid ${hairline}`,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          padding: "9% 8.5% 7%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER — Race name + year */}
        <header style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "0.5rem",
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: palette.accent,
              marginBottom: "0.8rem",
              paddingLeft: "0.5em",
            }}
          >
            {(identity ? config.location : locationLine) || "Marathon"}
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif, "Fraunces", "Playfair Display", Georgia, serif)',
              fontWeight: 900,
              fontSize: raceLines.length > 1 ? "clamp(1.5rem, 4.6vw, 2.7rem)" : "clamp(1.8rem, 5.4vw, 3.2rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.025em",
              textTransform: "uppercase",
              margin: 0,
              wordBreak: "break-word",
            }}
          >
            {raceLines.map((line, i) => (
              <span key={i} style={{ display: "block" }}>{line}</span>
            ))}
          </h1>
          <div
            style={{
              marginTop: "0.7rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.8rem",
            }}
          >
            <span style={{ height: 1, width: "1.4rem", backgroundColor: palette.accent }} />
            <span
              style={{
                fontFamily: 'var(--font-serif, "Fraunces", Georgia, serif)',
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: "0.95rem",
                letterSpacing: "0.08em",
                color: palette.ink,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {year || "—"}
            </span>
            <span style={{ height: 1, width: "1.4rem", backgroundColor: palette.accent }} />
          </div>
        </header>

        {/* ROUTE — hero element, ~45% of poster height */}
        <div
          style={{
            flex: "1 1 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "1.2rem -3% 1rem",
            position: "relative",
            minHeight: 0,
          }}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            style={{ width: "100%", height: "100%", display: "block" }}
            aria-hidden
          >
            {/* faint shadow */}
            <path
              d={config.routePath}
              fill="none"
              stroke={palette.ink}
              strokeOpacity={lightPaper ? 0.08 : 0.12}
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              transform="translate(0.6, 0.8)"
            />
            {/* main route — bold screen-print accent */}
            <path
              d={config.routePath}
              fill="none"
              stroke={palette.accent}
              strokeWidth="8"
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
                  <circle cx={sx} cy={sy} r="2.6" fill={palette.paper} stroke={palette.ink} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
                  <circle cx={ex} cy={ey} r="3.4" fill={palette.mark} stroke={palette.paper} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Tagline — small italic local reference */}
        {tagline && (
          <div
            style={{
              textAlign: "center",
              fontFamily: 'var(--font-serif, "Fraunces", Georgia, serif)',
              fontStyle: "italic",
              fontSize: "0.6rem",
              letterSpacing: "0.04em",
              color: inkSoft,
              marginBottom: "1rem",
            }}
          >
            {tagline}
          </div>
        )}

        {/* FOOTER — Runner + time, then tiny race details */}
        <div style={{ borderTop: `1px solid ${hairline}`, paddingTop: "1rem" }}>
          <div
            style={{
              fontSize: "0.5rem",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: inkFaint,
              textAlign: "center",
              marginBottom: "0.45rem",
            }}
          >
            Finisher
          </div>
          <div
            style={{
              fontFamily: 'var(--font-serif, "Fraunces", Georgia, serif)',
              fontWeight: 800,
              fontSize: "clamp(1rem, 2.6vw, 1.35rem)",
              letterSpacing: "-0.01em",
              textAlign: "center",
              textTransform: "uppercase",
              lineHeight: 1.1,
              wordBreak: "break-word",
            }}
          >
            {displayName}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-sans, "Inter", system-ui, sans-serif)',
              fontWeight: 800,
              fontSize: "clamp(1.6rem, 5vw, 2.6rem)",
              letterSpacing: "-0.04em",
              fontVariantNumeric: "tabular-nums",
              textAlign: "center",
              marginTop: "0.35rem",
              color: palette.accent,
              lineHeight: 1,
            }}
          >
            {displayTime}
          </div>

          {/* Tiny race details row */}
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "0.6rem",
              fontFamily: 'ui-monospace, "JetBrains Mono", "SFMono-Regular", Menlo, monospace',
              fontSize: "0.5rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: inkFaint,
            }}
          >
            <span>{displayDate || "—"}</span>
            <span style={{ flex: 1, height: 1, backgroundColor: hairline }} />
            <span>{distanceLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
