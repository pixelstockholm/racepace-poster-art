import { useMemo } from "react";
import { getSkylinePath } from "@/lib/raceSkylines";

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
  bg: string;
  ink: string;
  inkSoft: string;   // 50% ink
  inkFaint: string;  // 30% ink
  hairline: string;  // 10% ink
  accent: string;
  routeStroke: string;
  routeGlow: string; // rgba glow color
  skyline: string;   // skyline silhouette fill
  finishMark: string;
}

export const THEMES: Record<PosterTheme, ThemeTokens & { label: string }> = {
  midnight: {
    label: "Midnight",
    bg: "#020617",
    ink: "#FFFFFF",
    inkSoft: "rgba(255,255,255,0.5)",
    inkFaint: "rgba(255,255,255,0.3)",
    hairline: "rgba(255,255,255,0.1)",
    accent: "#1E3A8A",
    routeStroke: "#3B6FE0",
    routeGlow: "rgba(59,111,224,0.55)",
    skyline: "rgba(255,255,255,0.18)",
    finishMark: "#EF4444",
  },
  ember: {
    label: "Ember",
    bg: "#0F0F10",
    ink: "#F5F1EA",
    inkSoft: "rgba(245,241,234,0.5)",
    inkFaint: "rgba(245,241,234,0.3)",
    hairline: "rgba(245,241,234,0.1)",
    accent: "#F25C1F",
    routeStroke: "#F25C1F",
    routeGlow: "rgba(242,92,31,0.55)",
    skyline: "rgba(245,241,234,0.16)",
    finishMark: "#FFD166",
  },
  forest: {
    label: "Forest",
    bg: "#0A1813",
    ink: "#F1ECDE",
    inkSoft: "rgba(241,236,222,0.5)",
    inkFaint: "rgba(241,236,222,0.3)",
    hairline: "rgba(241,236,222,0.1)",
    accent: "#7FB28C",
    routeStroke: "#7FB28C",
    routeGlow: "rgba(127,178,140,0.5)",
    skyline: "rgba(241,236,222,0.16)",
    finishMark: "#F1ECDE",
  },
  cream: {
    label: "Bone",
    bg: "#EFEAE0",
    ink: "#0B0B0C",
    inkSoft: "rgba(11,11,12,0.55)",
    inkFaint: "rgba(11,11,12,0.32)",
    hairline: "rgba(11,11,12,0.12)",
    accent: "#1E3A8A",
    routeStroke: "#1E3A8A",
    routeGlow: "rgba(30,58,138,0.25)",
    skyline: "rgba(11,11,12,0.18)",
    finishMark: "#B23A2E",
  },
  noir: {
    label: "Noir",
    bg: "#0A0A0B",
    ink: "#F2EFE7",
    inkSoft: "rgba(242,239,231,0.5)",
    inkFaint: "rgba(242,239,231,0.3)",
    hairline: "rgba(242,239,231,0.1)",
    accent: "#F2EFE7",
    routeStroke: "#F2EFE7",
    routeGlow: "rgba(242,239,231,0.35)",
    skyline: "rgba(242,239,231,0.14)",
    finishMark: "#EF4444",
  },
  sky: {
    label: "Steel",
    bg: "#E6EAF0",
    ink: "#0B0B0C",
    inkSoft: "rgba(11,11,12,0.55)",
    inkFaint: "rgba(11,11,12,0.32)",
    hairline: "rgba(11,11,12,0.12)",
    accent: "#1E3A8A",
    routeStroke: "#1E3A8A",
    routeGlow: "rgba(30,58,138,0.25)",
    skyline: "rgba(11,11,12,0.16)",
    finishMark: "#B23A2E",
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

function parseTimeToSeconds(t: string): number | null {
  const m = t.trim().match(/^(\d{1,2}):(\d{2}):(\d{2})$/);
  if (!m) return null;
  return parseInt(m[1]) * 3600 + parseInt(m[2]) * 60 + parseInt(m[3]);
}

function computePace(time: string, distanceKm: number): string {
  const secs = parseTimeToSeconds(time);
  if (!secs || !distanceKm) return "—";
  const perKm = secs / distanceKm;
  const m = Math.floor(perKm / 60);
  const s = Math.round(perKm % 60);
  return `${m}:${s.toString().padStart(2, "0")} /KM`;
}

const RACE_ELEVATION: Record<string, number> = {
  berlin: 73, nyc: 250, london: 95, boston: 246, chicago: 60, tokyo: 82,
  paris: 195, stockholm: 168, valencia: 30, amsterdam: 18, copenhagen: 45,
  vienna: 110, sydney: 246,
};

interface Props {
  config: PosterConfig;
  className?: string;
}

// Split race name across two lines: first word(s) vs last word.
function splitRaceName(race: string): [string, string] {
  const trimmed = race.trim();
  if (!trimmed) return ["YOUR", "RACE"];
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return [parts[0].toUpperCase(), ""];
  const last = parts[parts.length - 1];
  const rest = parts.slice(0, -1).join(" ");
  return [rest.toUpperCase(), last.toUpperCase()];
}

export function PosterPreview({ config, className }: Props) {
  const theme = THEMES[config.theme] ?? THEMES.midnight;

  const [raceLine1, raceLine2] = useMemo(
    () => splitRaceName(config.race),
    [config.race],
  );
  const displayName = useMemo(
    () => (config.name?.trim() || "Your Name").toUpperCase(),
    [config.name],
  );
  const displayTime = config.time?.trim() || "00:00:00";
  const displayDate = formatDate(config.date);
  const year = yearOf(config.date);
  const distanceKm = config.distanceKm ?? 42.195;
  const distanceLabel = `${distanceKm.toFixed(3).replace(/\.?0+$/, "")} KM`;
  const pace = computePace(displayTime, distanceKm);
  const elevation = config.elevationM
    ?? (config.raceId ? RACE_ELEVATION[config.raceId] : undefined)
    ?? 80;
  const skylinePath = getSkylinePath(config.raceId);
  const locationLine = (config.location || "—").toUpperCase();
  const bib = config.bib ?? "—";

  return (
    <div
      className={className}
      style={{
        aspectRatio: "2 / 3",
        backgroundColor: theme.bg,
        color: theme.ink,
        position: "relative",
        overflow: "hidden",
        fontFamily: 'var(--font-sans, "Inter", system-ui, sans-serif)',
        boxShadow:
          "0 1px 1px rgba(0,0,0,0.06), 0 24px 60px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.04)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Skyline silhouette band — bottom half, fades up */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "55%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <svg
          viewBox="0 0 200 40"
          preserveAspectRatio="xMidYEnd meet"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
          }}
        >
          <path d={skylinePath} fill={theme.skyline} />
        </svg>
        {/* gradient fade from bg into skyline */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to top, ${theme.bg} 0%, ${theme.bg}00 60%)`,
          }}
        />
      </div>

      {/* Dot grid texture */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: `radial-gradient(circle at 2px 2px, ${theme.ink} 1px, transparent 0)`,
          backgroundSize: "18px 18px",
        }}
      />

      {/* Decorative corner ticks */}
      <div
        aria-hidden
        style={{
          position: "absolute", top: "4%", left: "4%",
          width: "1.4rem", height: "1.4rem",
          borderTop: `2px solid ${theme.accent}`,
          borderLeft: `2px solid ${theme.accent}`,
          opacity: 0.45,
          zIndex: 1,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute", bottom: "4%", right: "4%",
          width: "1.4rem", height: "1.4rem",
          borderBottom: `2px solid ${theme.accent}`,
          borderRight: `2px solid ${theme.accent}`,
          opacity: 0.45,
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          padding: "8% 7.5% 6.5%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <header>
          <div
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: theme.inkSoft,
              marginBottom: "0.5rem",
            }}
          >
            Official Finisher
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif, "Fraunces", Georgia, serif)',
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(1.6rem, 4.8vw, 3rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
              textTransform: "uppercase",
              margin: 0,
              wordBreak: "break-word",
            }}
          >
            {raceLine1}
            {raceLine2 && (
              <>
                <br />
                {raceLine2}
              </>
            )}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.7rem" }}>
            <span style={{ height: 1, width: "1.6rem", backgroundColor: theme.accent }} />
            <span
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: theme.accent,
              }}
            >
              {locationLine} {year && `· ${year}`}
            </span>
          </div>
        </header>

        {/* Route — hero */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "1.2rem -3% 1rem",
            minHeight: 0,
            position: "relative",
          }}
        >
          {/* glow */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: "10%",
              borderRadius: "50%",
              background: theme.routeGlow,
              filter: "blur(40px)",
              opacity: 0.6,
            }}
          />
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            style={{ width: "100%", height: "100%", display: "block", position: "relative" }}
            aria-hidden
          >
            <path
              d={config.routePath}
              fill="none"
              stroke={theme.routeStroke}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              style={{ filter: `drop-shadow(0 0 6px ${theme.routeGlow})` }}
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
                  <circle cx={sx} cy={sy} r="2" fill={theme.ink} />
                  <circle cx={ex} cy={ey} r="2.4" fill={theme.finishMark} stroke={theme.ink} strokeWidth="0.6" />
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Finish time block */}
        <div
          style={{
            textAlign: "center",
            borderTop: `1px solid ${theme.hairline}`,
            borderBottom: `1px solid ${theme.hairline}`,
            padding: "0.85rem 0 0.9rem",
          }}
        >
          <div
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: theme.inkFaint,
              marginBottom: "0.35rem",
              fontWeight: 600,
            }}
          >
            Official Time
          </div>
          <div
            style={{
              fontFamily: 'var(--font-sans, "Inter", system-ui, sans-serif)',
              fontWeight: 900,
              fontVariantNumeric: "tabular-nums",
              fontSize: "clamp(2rem, 6.4vw, 3.6rem)",
              letterSpacing: "-0.045em",
              lineHeight: 1,
            }}
          >
            {displayTime}
          </div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "0.6rem",
            padding: "0.9rem 0",
            borderBottom: `1px solid ${theme.hairline}`,
          }}
        >
          {[
            { label: "Distance", value: distanceLabel, align: "left" as const },
            { label: "Avg Pace", value: pace, align: "center" as const },
            { label: "Elevation", value: `${elevation} M`, align: "right" as const },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: s.align }}>
              <div
                style={{
                  fontSize: "0.5rem",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: theme.inkFaint,
                  marginBottom: "0.3rem",
                  fontWeight: 600,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-serif, "Fraunces", Georgia, serif)',
                  fontStyle: "italic",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  letterSpacing: "-0.015em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Footer: name + bib/date */}
        <div
          style={{
            marginTop: "0.9rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "1rem",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: "0.95rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
                lineHeight: 1.1,
                wordBreak: "break-word",
              }}
            >
              {displayName}
            </div>
            <div
              style={{
                fontFamily: 'ui-monospace, "JetBrains Mono", "SFMono-Regular", Menlo, monospace',
                fontSize: "0.55rem",
                color: theme.inkFaint,
                letterSpacing: "0.04em",
                marginTop: "0.3rem",
              }}
            >
              BIB #{bib} / {displayDate || "—"}
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.25rem" }}>
            <div style={{ width: "0.4rem", height: "1.6rem", backgroundColor: theme.accent }} />
            <div style={{ width: "0.4rem", height: "1.6rem", backgroundColor: theme.accent, opacity: 0.6 }} />
            <div style={{ width: "0.4rem", height: "1.6rem", backgroundColor: theme.accent, opacity: 0.3 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
