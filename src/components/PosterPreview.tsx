import { useMemo } from "react";

export type PosterTheme = "midnight" | "ember" | "forest" | "cream" | "noir" | "sky";

export interface PosterConfig {
  name: string;
  race: string;
  date: string; // YYYY-MM-DD or display string
  time: string; // HH:MM:SS
  theme: PosterTheme;
}

interface ThemeTokens {
  bg: string;
  ink: string;
  accent: string;
  muted: string;
}

export const THEMES: Record<PosterTheme, ThemeTokens & { label: string }> = {
  midnight: { label: "Midnight", bg: "#0E1A2B", ink: "#F5F1E8", accent: "#9FB4D4", muted: "#7E8FA8" },
  ember:    { label: "Ember",    bg: "#F5EFE6", ink: "#1F1A17", accent: "#C2410C", muted: "#7A6A5C" },
  forest:   { label: "Forest",   bg: "#10241B", ink: "#F2EBDD", accent: "#A8C3A0", muted: "#7F8F82" },
  cream:    { label: "Cream",    bg: "#F4ECDD", ink: "#1A1A1A", accent: "#1E3A8A", muted: "#7A6E59" },
  noir:     { label: "Noir",     bg: "#111111", ink: "#EFEAE0", accent: "#EFEAE0", muted: "#8A857E" },
  sky:      { label: "Sky",      bg: "#E8EEF6", ink: "#0F1B33", accent: "#1E3A8A", muted: "#6B7891" },
};

function formatDate(iso: string): string {
  if (!iso) return "";
  // Accept either ISO or already-formatted; try to format ISO.
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.toUpperCase();
  return d
    .toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
    .toUpperCase();
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

  return (
    <div
      className={className}
      style={{
        aspectRatio: "2 / 3",
        backgroundColor: theme.bg,
        color: theme.ink,
        padding: "8%",
        display: "flex",
        flexDirection: "column",
        boxShadow:
          "0 1px 1px rgba(0,0,0,0.04), 0 12px 40px rgba(20,20,20,0.18), inset 0 0 0 1px rgba(0,0,0,0.04)",
        fontFamily: 'var(--font-serif, "Fraunces", Georgia, serif)',
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          fontFamily: 'var(--font-sans, "Inter", system-ui, sans-serif)',
          fontSize: "0.7rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: theme.muted,
          marginBottom: "1.5rem",
        }}
      >
        Racepace · Finisher
      </div>

      {/* Race name */}
      <div
        style={{
          fontWeight: 600,
          fontSize: "clamp(1.6rem, 4.2vw, 3rem)",
          lineHeight: 1.02,
          letterSpacing: "-0.01em",
          color: theme.ink,
          wordBreak: "break-word",
        }}
      >
        {displayRace}
      </div>

      {/* Accent rule */}
      <div
        style={{
          height: 3,
          width: "38%",
          backgroundColor: theme.accent,
          margin: "1.4rem 0 1.6rem",
        }}
      />

      {/* Runner name */}
      <div
        style={{
          fontFamily: 'var(--font-sans, "Inter", system-ui, sans-serif)',
          fontSize: "0.65rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: theme.muted,
        }}
      >
        Finisher
      </div>
      <div
        style={{
          fontSize: "clamp(1.1rem, 2.6vw, 1.6rem)",
          fontWeight: 500,
          marginTop: "0.25rem",
        }}
      >
        {displayName}
      </div>

      <div style={{ flex: 1 }} />

      {/* Time */}
      <div
        style={{
          fontFamily: 'var(--font-sans, "Inter", system-ui, sans-serif)',
          fontSize: "0.65rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: theme.muted,
        }}
      >
        Finish Time
      </div>
      <div
        style={{
          fontFeatureSettings: '"tnum" 1',
          fontVariantNumeric: "tabular-nums",
          fontSize: "clamp(2rem, 6vw, 4rem)",
          color: theme.accent,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          marginTop: "0.2rem",
        }}
      >
        {displayTime}
      </div>

      {/* Footer row */}
      <div
        style={{
          marginTop: "1.4rem",
          display: "flex",
          justifyContent: "space-between",
          fontFamily: 'var(--font-sans, "Inter", system-ui, sans-serif)',
          fontSize: "0.7rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: theme.muted,
        }}
      >
        <span>{displayDate || "—"}</span>
        <span>42.195 KM</span>
      </div>
    </div>
  );
}
