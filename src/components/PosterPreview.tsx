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

  const locationLine = (config.location || "").toUpperCase();
  const tagline = identity?.tagline ?? "";

  // City name = first segment of location ("Berlin, Germany" → "BERLIN").
  // Fallback: clean the race name.
  const cityName = useMemo(() => {
    if (config.location) {
      const c = config.location.split(",")[0]?.trim();
      if (c) return c.toUpperCase();
    }
    return (raceLines[0] || "CITY").toUpperCase();
  }, [config.location, raceLines]);

  const countryLine = useMemo(() => {
    if (config.location && config.location.includes(",")) {
      return config.location.split(",").slice(1).join(",").trim().toUpperCase();
    }
    return "";
  }, [config.location]);

  // Stable "edition number" for the editorial feel (deterministic from id+year)
  const editionNo = useMemo(() => {
    const seed = `${config.raceId ?? config.race}-${year}`;
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return String((h % 90) + 10).padStart(2, "0"); // 10–99
  }, [config.raceId, config.race, year]);

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
      {/* Paper grain */}
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
          opacity: grainOpacity,
          mixBlendMode: lightPaper ? "multiply" : "screen",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Magazine-cover content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          padding: "8% 8% 6.5%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Masthead row — country · edition */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: "0.5rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: inkSoft,
            paddingBottom: "0.6rem",
            borderBottom: `1px solid ${hairline}`,
          }}
        >
          <span>{countryLine || "MARATHON"}</span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>Nº {editionNo}</span>
        </div>

        {/* HERO — CITY · MARATHON · YEAR */}
        <header style={{ marginTop: "1.4rem" }}>
          <h1
            style={{
              fontFamily: 'var(--font-serif, "Fraunces", "Playfair Display", Georgia, serif)',
              fontWeight: 600,
              fontSize: "clamp(2.4rem, 8.5vw, 4.6rem)",
              lineHeight: 0.86,
              letterSpacing: "-0.04em",
              margin: 0,
              textTransform: "uppercase",
              wordBreak: "break-word",
            }}
          >
            {cityName}
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: "0.8rem",
              marginTop: "0.35rem",
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-serif, "Fraunces", Georgia, serif)',
                fontWeight: 400,
                fontSize: "clamp(1rem, 2.6vw, 1.4rem)",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: palette.ink,
              }}
            >
              Marathon
            </span>
            <span
              style={{
                fontFamily: 'var(--font-serif, "Fraunces", Georgia, serif)',
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(1.1rem, 2.8vw, 1.5rem)",
                color: palette.accent,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {year || "—"}
            </span>
          </div>
        </header>

        {/* ROUTE — ~26% of poster height */}
        <div
          style={{
            height: "26%",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "1.8rem 0 1.2rem",
          }}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            style={{ width: "100%", height: "100%", display: "block" }}
            aria-hidden
          >
            <path
              d={config.routePath}
              fill="none"
              stroke={palette.ink}
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            {(() => {
              const m = config.routePath.match(/-?\d+(?:\.\d+)?/g);
              if (!m || m.length < 4) return null;
              const ex = parseFloat(m[m.length - 2]);
              const ey = parseFloat(m[m.length - 1]);
              return (
                <circle
                  cx={ex}
                  cy={ey}
                  r="1.8"
                  fill={palette.accent}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })()}
          </svg>
        </div>

        {/* Course caption */}
        {tagline && (
          <p
            style={{
              textAlign: "center",
              fontFamily: 'var(--font-serif, "Fraunces", Georgia, serif)',
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "0.72rem",
              lineHeight: 1.35,
              letterSpacing: "0.02em",
              color: inkSoft,
              margin: "0 auto",
              maxWidth: "85%",
            }}
          >
            {tagline}
          </p>
        )}

        {/* Spacer pushes footer down */}
        <div style={{ flex: "1 1 auto" }} />

        {/* Editorial footer grid */}
        <div
          style={{
            borderTop: `1px solid ${hairline}`,
            paddingTop: "1rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            rowGap: "0.9rem",
            columnGap: "1rem",
          }}
        >
          <FooterField label="Finisher" value={displayName} ink={palette.ink} inkFaint={inkFaint} />
          <FooterField
            label="Official Time"
            value={displayTime}
            ink={palette.ink}
            inkFaint={inkFaint}
            align="right"
            tabular
          />
          <FooterField
            label="Date"
            value={displayDate || "—"}
            ink={palette.ink}
            inkFaint={inkFaint}
          />
          <FooterField
            label="Distance"
            value={distanceLabel}
            ink={palette.ink}
            inkFaint={inkFaint}
            align="right"
            tabular
          />
        </div>

        {/* Bottom imprint */}
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: "0.46rem",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: inkFaint,
          }}
        >
          <span>Racepace Editions</span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>
            Edition Nº {editionNo} / {year || "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

interface FooterFieldProps {
  label: string;
  value: string;
  ink: string;
  inkFaint: string;
  align?: "left" | "right";
  tabular?: boolean;
}

function FooterField({ label, value, ink, inkFaint, align = "left", tabular }: FooterFieldProps) {
  return (
    <div style={{ textAlign: align }}>
      <div
        style={{
          fontSize: "0.46rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          fontWeight: 600,
          color: inkFaint,
          marginBottom: "0.3rem",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-serif, "Fraunces", Georgia, serif)',
          fontWeight: 500,
          fontSize: "0.95rem",
          letterSpacing: "-0.005em",
          color: ink,
          lineHeight: 1.15,
          fontVariantNumeric: tabular ? "tabular-nums" : "normal",
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

