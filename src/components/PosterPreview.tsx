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


  // Newspaper paper tone — slightly warm off-white regardless of identity.
  const paper = "#F2ECDC";
  const ink = "#16130E";
  const inkSoft = "rgba(22,19,14,0.62)";
  const inkFaint = "rgba(22,19,14,0.42)";
  const hairline = "rgba(22,19,14,0.55)";
  const accent = palette.accent;

  const grainId = useMemo(() => `grain-${Math.random().toString(36).slice(2, 9)}`, []);

  // Today-like dateline string ("SATURDAY, 27 SEPTEMBER 2025")
  const dateline = useMemo(() => {
    if (!config.date) return "";
    const d = new Date(config.date);
    if (Number.isNaN(d.getTime())) return config.date.toUpperCase();
    return d
      .toLocaleDateString("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
      .toUpperCase();
  }, [config.date]);

  const headline = useMemo(() => {
    // Use the city as the masthead headline — like "THE BERLIN HERALD"
    const city = (cityName || "RACE").replace(/\.$/, "");
    return `THE ${city} HERALD`;
  }, [cityName]);

  const raceFullName = useMemo(() => {
    return (config.race || raceLines.join(" ")).toUpperCase();
  }, [config.race, raceLines]);

  return (
    <div
      className={className}
      style={{
        aspectRatio: "2 / 3",
        backgroundColor: paper,
        color: ink,
        position: "relative",
        overflow: "hidden",
        fontFamily: 'var(--font-serif, "Fraunces", "Playfair Display", Georgia, "Times New Roman", serif)',
        boxShadow:
          "0 1px 1px rgba(0,0,0,0.06), 0 30px 70px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(0,0,0,0.06)",
      }}
    >
      {/* Paper grain — newsprint texture */}
      <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
        <filter id={grainId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          filter: `url(#${grainId})`,
          opacity: 0.22,
          mixBlendMode: "multiply",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Faint foxing in the corners */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 0% 0%, rgba(120,90,40,0.10), transparent 35%), radial-gradient(ellipse at 100% 100%, rgba(120,90,40,0.10), transparent 35%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          padding: "5% 6% 4.5%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top metadata strip — vol, edition, city, price */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontFamily: 'var(--font-sans, "Inter", system-ui, sans-serif)',
            fontSize: "0.46rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 500,
            color: ink,
            paddingBottom: "0.4rem",
          }}
        >
          <span>Vol. {year || "—"} · {(countryLine || locationLine || "Worldwide").split(",")[0]}</span>
          <span>Edition Nº {editionNo}</span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>Price · One Marathon</span>
        </div>
        <div style={{ borderTop: `2px solid ${hairline}`, borderBottom: `1px solid ${hairline}`, height: 3 }} />

        {/* MASTHEAD */}
        <h1
          style={{
            fontFamily: 'var(--font-serif, "Fraunces", "Playfair Display", "Times New Roman", serif)',
            fontWeight: 800,
            fontStyle: "italic",
            fontSize: "clamp(1.6rem, 6.2vw, 3.4rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            margin: "0.6rem 0 0.4rem",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          {headline}
        </h1>

        {/* Dateline strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            borderTop: `1px solid ${hairline}`,
            borderBottom: `1px solid ${hairline}`,
            padding: "0.35rem 0",
            fontFamily: 'var(--font-sans, "Inter", system-ui, sans-serif)',
            fontSize: "0.44rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: ink,
          }}
        >
          <span>{(countryLine || locationLine || "—").split(",")[0]}</span>
          <span>{dateline || "—"}</span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>Nº {editionNo}</span>
        </div>

        {/* Section kicker */}
        <div
          style={{
            textAlign: "center",
            fontFamily: 'var(--font-sans, "Inter", system-ui, sans-serif)',
            fontSize: "0.4rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: accent,
            fontWeight: 700,
            margin: "0.9rem 0 0.4rem",
          }}
        >
          Sport · Athletics · Long Distance
        </div>

        {/* Article headline */}
        <h2
          style={{
            fontFamily: 'var(--font-serif, "Fraunces", "Playfair Display", Georgia, serif)',
            fontWeight: 700,
            fontSize: "clamp(1.1rem, 3.4vw, 1.9rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            margin: "0 0 0.35rem",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          {raceFullName}
        </h2>

        {/* Deck / subhead */}
        <p
          style={{
            textAlign: "center",
            fontFamily: 'var(--font-serif, "Fraunces", Georgia, serif)',
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "0.72rem",
            lineHeight: 1.35,
            margin: "0 auto 0.6rem",
            maxWidth: "82%",
            color: inkSoft,
          }}
        >
          {tagline || "An account of the day's long run, traced through the streets of the city."}
        </p>

        {/* By-line */}
        <div
          style={{
            textAlign: "center",
            fontFamily: 'var(--font-sans, "Inter", system-ui, sans-serif)',
            fontSize: "0.42rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: inkFaint,
            marginBottom: "0.7rem",
          }}
        >
          By Our Athletics Correspondent · {(countryLine || "—").split(",").pop()?.trim() || "—"}
        </div>

        {/* ROUTE — illustration plate with caption (like a print engraving) */}
        <figure
          style={{
            margin: 0,
            borderTop: `1px solid ${hairline}`,
            borderBottom: `1px solid ${hairline}`,
            padding: "0.8rem 0 0.55rem",
          }}
        >
          <div
            style={{
              height: "22vh",
              minHeight: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
              style={{ width: "78%", height: "100%", display: "block" }}
              aria-hidden
            >
              <path
                d={config.routePath}
                fill="none"
                stroke={ink}
                strokeWidth="1.2"
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
                  <g>
                    <circle cx={ex} cy={ey} r="1.6" fill={accent} vectorEffect="non-scaling-stroke" />
                  </g>
                );
              })()}
            </svg>
          </div>
          <figcaption
            style={{
              textAlign: "center",
              fontFamily: 'var(--font-serif, "Fraunces", Georgia, serif)',
              fontStyle: "italic",
              fontSize: "0.55rem",
              letterSpacing: "0.04em",
              color: inkSoft,
              marginTop: "0.4rem",
            }}
          >
            Fig. {editionNo} — Course of the {cityName.toLowerCase()} marathon, as run on {dateline || "the day"}.
          </figcaption>
        </figure>

        {/* Two-column body */}
        <div
          style={{
            marginTop: "0.9rem",
            display: "grid",
            gridTemplateColumns: "1fr 1px 1fr",
            columnGap: "0.9rem",
            flex: "1 1 auto",
          }}
        >
          <NewsColumn
            kicker="Finisher of Record"
            value={displayName}
            body={`Completed the full ${distanceLabel.toLowerCase()} course in an official time of ${displayTime}, entered into the registry as edition Nº ${editionNo} of ${year || "the year"}.`}
            ink={ink}
            inkSoft={inkSoft}
            inkFaint={inkFaint}
          />
          <div style={{ background: hairline, width: 1, height: "100%" }} />
          <NewsColumn
            kicker="Official Particulars"
            value={displayTime}
            body={`Distance ${distanceLabel}. Run on ${dateline || "—"}. Filed from ${(countryLine || locationLine || "—").split(",")[0]}.`}
            ink={ink}
            inkSoft={inkSoft}
            inkFaint={inkFaint}
            tabularValue
          />
        </div>

        {/* Bottom rule + imprint */}
        <div style={{ borderTop: `2px solid ${hairline}`, marginTop: "0.8rem", paddingTop: "0.4rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              fontFamily: 'var(--font-sans, "Inter", system-ui, sans-serif)',
              fontSize: "0.42rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: inkFaint,
            }}
          >
            <span>Racepace Editions · Printed on Newsprint</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>
              Nº {editionNo} / {year || "—"} · {distanceLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface NewsColumnProps {
  kicker: string;
  value: string;
  body: string;
  ink: string;
  inkSoft: string;
  inkFaint: string;
  tabularValue?: boolean;
}

function NewsColumn({ kicker, value, body, ink, inkSoft, inkFaint, tabularValue }: NewsColumnProps) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-sans, "Inter", system-ui, sans-serif)',
          fontSize: "0.42rem",
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: inkFaint,
          marginBottom: "0.35rem",
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-serif, "Fraunces", Georgia, serif)',
          fontWeight: 600,
          fontSize: "0.95rem",
          lineHeight: 1.1,
          letterSpacing: "-0.005em",
          color: ink,
          marginBottom: "0.45rem",
          textTransform: "uppercase",
          fontVariantNumeric: tabularValue ? "tabular-nums" : "normal",
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
      <p
        style={{
          fontFamily: 'var(--font-serif, "Fraunces", Georgia, serif)',
          fontSize: "0.6rem",
          lineHeight: 1.45,
          color: inkSoft,
          margin: 0,
          textAlign: "justify",
          hyphens: "auto",
        }}
      >
        {body}
      </p>
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

