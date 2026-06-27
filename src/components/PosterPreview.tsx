import { useMemo } from "react";

export type PosterTheme = "midnight" | "ember" | "forest" | "cream" | "noir" | "sky";

export interface PosterConfig {
  name: string;
  race: string;
  date: string; // YYYY-MM-DD or display string
  time: string; // HH:MM:SS
  theme: PosterTheme;
  routePath: string; // SVG path data in a 0 0 100 100 viewBox
  location?: string; // e.g. "Berlin, Germany"
  distanceKm?: number;
}

interface ThemeTokens {
  bg: string;
  ink: string;
  accent: string;
  muted: string;
  routeStroke: string;
}

export const THEMES: Record<PosterTheme, ThemeTokens & { label: string }> = {
  midnight: { label: "Midnight", bg: "#0B1220", ink: "#F2F4F8", accent: "#5B8DEF", muted: "#6E7A93", routeStroke: "#F2F4F8" },
  ember:    { label: "Ember",    bg: "#0F0F10", ink: "#F5F1EA", accent: "#F25C1F", muted: "#6E6A63", routeStroke: "#F25C1F" },
  forest:   { label: "Forest",   bg: "#0E1A14", ink: "#F1ECDE", accent: "#7FB28C", muted: "#6A7670", routeStroke: "#F1ECDE" },
  cream:    { label: "Bone",     bg: "#EFEAE0", ink: "#0B0B0C", accent: "#1E3A8A", muted: "#6A6358", routeStroke: "#0B0B0C" },
  noir:     { label: "Noir",     bg: "#0A0A0B", ink: "#F2EFE7", accent: "#F2EFE7", muted: "#6E6A63", routeStroke: "#F2EFE7" },
  sky:      { label: "Steel",    bg: "#E6EAF0", ink: "#0B0B0C", accent: "#1E3A8A", muted: "#5C6577", routeStroke: "#1E3A8A" },
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

export function PosterPreview({ config, className }: Props) {
  const theme = THEMES[config.theme] ?? THEMES.cream;

  const displayName = useMemo(
    () => (config.name?.trim() || "Your Name").toUpperCase(),
    [config.name],
  );
  const displayRace = useMemo(
    () => (config.race?.trim() || "Your Race").toUpperCase(),
    [config.race],
  );
  const displayTime = config.time?.trim() || "00:00:00";
  const displayDate = formatDate(config.date);
  const year = yearOf(config.date);
  const distance = config.distanceKm ? `${config.distanceKm.toFixed(3).replace(/\.?0+$/, "")} KM` : "42.195 KM";

  return (
    <div
      className={className}
      style={{
        aspectRatio: "2 / 3",
        backgroundColor: theme.bg,
        color: theme.ink,
        padding: "9% 8% 7%",
        display: "flex",
        flexDirection: "column",
        boxShadow:
          "0 1px 1px rgba(0,0,0,0.04), 0 18px 50px rgba(10,10,10,0.22), inset 0 0 0 1px rgba(0,0,0,0.04)",
        fontFamily: 'var(--font-sans, "Inter", system-ui, sans-serif)',
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top meta row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.6rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: theme.muted,
        }}
      >
        <span>{(config.location || "—").toUpperCase()}</span>
        <span>{year || "—"}</span>
      </div>

      {/* Race name */}
      <div
        style={{
          fontFamily: 'var(--font-serif, "Fraunces", Georgia, serif)',
          fontWeight: 500,
          fontSize: "clamp(1.2rem, 3vw, 2rem)",
          lineHeight: 1.0,
          letterSpacing: "-0.02em",
          marginTop: "0.9rem",
          wordBreak: "break-word",
        }}
      >
        {displayRace}
      </div>

      {/* Route — HERO. Takes the dominant share of the poster. */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "1.4rem -2% 1.2rem",
          minHeight: 0,
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
            stroke={theme.routeStroke}
            strokeWidth="2.6"
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
                <circle cx={sx} cy={sy} r="1.8" fill={theme.bg} stroke={theme.routeStroke} strokeWidth="1.2" />
                <circle cx={ex} cy={ey} r="2.6" fill={theme.accent} />
              </g>
            );
          })()}
        </svg>
      </div>

      {/* hairline */}
      <div style={{ height: 1, backgroundColor: theme.muted, opacity: 0.4 }} />

      {/* Finish time — large, but the route remains the visual lead */}
      <div style={{ marginTop: "1rem" }}>
        <div
          style={{
            fontSize: "0.55rem",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: theme.muted,
            marginBottom: "0.3rem",
          }}
        >
          Finish Time · {distance}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-serif, "Fraunces", Georgia, serif)',
            fontFeatureSettings: '"tnum" 1',
            fontVariantNumeric: "tabular-nums",
            fontSize: "clamp(1.9rem, 5.6vw, 3.4rem)",
            fontWeight: 500,
            letterSpacing: "-0.035em",
            lineHeight: 0.95,
            color: theme.ink,
          }}
        >
          {displayTime}
        </div>
      </div>

      {/* Runner + date footer */}
      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.6rem 1rem",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.52rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: theme.muted,
              marginBottom: "0.25rem",
            }}
          >
            Finisher
          </div>
          <div style={{ fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.02em" }}>
            {displayName}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: "0.52rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: theme.muted,
              marginBottom: "0.25rem",
            }}
          >
            Date
          </div>
          <div style={{ fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.02em" }}>
            {displayDate || "—"}
          </div>
        </div>
      </div>

      {/* wordmark */}
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.52rem",
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: theme.muted,
        }}
      >
        <span>Racepace</span>
        <span>Finisher Series</span>
      </div>

    </div>
  );
}
