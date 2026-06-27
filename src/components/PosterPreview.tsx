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
        aspectRatio: "3 / 4",
        backgroundColor: paper,
        color: ink,
        position: "relative",
        overflow: "hidden",
        fontFamily: serif,
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
          padding: "5.5% 6% 4.5%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top metadata strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            alignItems: "baseline",
            fontFamily: sans,
            fontSize: "0.5rem",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: inkSoft,
          }}
        >
          <span style={{ textAlign: "left" }}>Racepace Edition</span>
          <span style={{ textAlign: "center" }}>Official Finisher Poster</span>
          <span style={{ textAlign: "right" }}>Edition Nº {editionNo}</span>
        </div>

        <div style={{ borderTop: `1px solid ${hairline}`, marginTop: "0.6rem" }} />

        {/* MASTHEAD — full-width city name */}
        <h1
          style={{
            fontFamily: serif,
            fontWeight: 800,
            fontSize: "clamp(2.6rem, 11.5vw, 6rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.02em",
            margin: "0.55rem 0 0",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          {cityName}
        </h1>

        <div
          style={{
            fontFamily: serif,
            fontWeight: 400,
            fontSize: "clamp(0.95rem, 3.4vw, 1.85rem)",
            letterSpacing: "0.42em",
            textAlign: "center",
            textTransform: "uppercase",
            marginTop: "0.45rem",
            color: ink,
          }}
        >
          Marathon
        </div>

        <div
          style={{
            fontFamily: serif,
            fontWeight: 400,
            fontStyle: "normal",
            fontSize: "0.85rem",
            letterSpacing: "0.5em",
            color: accent,
            marginTop: "0.55rem",
            paddingLeft: "0.2rem",
          }}
        >
          {year || "—"}
        </div>

        <div style={{ borderTop: `1px solid ${hairline}`, marginTop: "0.5rem" }} />

        {/* MAP / ROUTE */}
        <div
          style={{
            position: "relative",
            flex: "1 1 auto",
            margin: "1rem 0 0.9rem",
            minHeight: "40%",
          }}
        >
          {/* Compass + neighborhoods */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "22%",
              fontFamily: sans,
              fontSize: "0.46rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: inkSoft,
              fontWeight: 500,
              lineHeight: 1.8,
            }}
          >
            <svg viewBox="0 0 40 40" width="22" height="22" style={{ display: "block", marginBottom: "0.4rem" }}>
              <circle cx="20" cy="20" r="13" fill="none" stroke={hairline} strokeWidth="0.8" />
              <text x="20" y="11" textAnchor="middle" fontFamily={serif} fontStyle="italic" fontSize="7" fill={ink}>N</text>
              <line x1="20" y1="14" x2="20" y2="26" stroke={ink} strokeWidth="0.8" />
              <polygon points="20,13 18.2,16 21.8,16" fill={ink} />
            </svg>
            {neighborhoods?.slice(0, 5).map((n) => (
              <div key={n}>{n}</div>
            ))}
          </div>

          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            style={{ width: "100%", height: "100%", display: "block" }}
            aria-hidden
          >
            {/* Faint cartographic backdrop */}
            <rect x="0" y="0" width="100" height="100" fill="transparent" filter={`url(#${mapTextureId})`} opacity="0.55" />
            <path
              d={config.routePath}
              fill="none"
              stroke={mapInk}
              strokeWidth="1.6"
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
                  <circle cx={ex} cy={ey} r="1.6" fill="none" stroke={accent} strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
                  <circle cx={ex} cy={ey} r="0.5" fill={accent} vectorEffect="non-scaling-stroke" />
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Course caption */}
        <div style={{ marginTop: "0.2rem" }}>
          <div
            style={{
              fontFamily: sans,
              fontSize: "0.5rem",
              letterSpacing: "0.36em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: accent,
            }}
          >
            The {cityName.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase())} Course
          </div>
          <div
            style={{
              fontFamily: serif,
              fontStyle: "italic",
              fontSize: "0.82rem",
              letterSpacing: "0.01em",
              color: ink,
              marginTop: "0.3rem",
            }}
          >
            {courseLine}
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${hairline}`, margin: "0.9rem 0 0.8rem" }} />

        {/* Finisher block — two columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1.4fr", gap: "1rem", alignItems: "start" }}>
          <div>
            <div style={{ fontFamily: sans, fontSize: "0.46rem", letterSpacing: "0.34em", textTransform: "uppercase", fontWeight: 700, color: accent, marginBottom: "0.4rem" }}>
              Official Time
            </div>
            <div
              style={{
                fontFamily: serif,
                fontWeight: 500,
                fontSize: "clamp(1.6rem, 5.8vw, 2.6rem)",
                letterSpacing: "0.01em",
                lineHeight: 1,
                color: accent,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {displayTime}
            </div>
          </div>
          <div style={{ background: hairline, width: 1, height: "100%" }} />
          <div>
            <div style={{ fontFamily: sans, fontSize: "0.46rem", letterSpacing: "0.34em", textTransform: "uppercase", fontWeight: 700, color: inkSoft, marginBottom: "0.4rem" }}>
              Finisher
            </div>
            <div
              style={{
                fontFamily: serif,
                fontWeight: 600,
                fontSize: "clamp(1.05rem, 3.2vw, 1.55rem)",
                letterSpacing: "0.04em",
                lineHeight: 1.05,
                textTransform: "uppercase",
                color: ink,
              }}
            >
              {displayName}
            </div>
            <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.75rem", color: inkSoft, marginTop: "0.25rem" }}>
              {distanceLabel}
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${hairline}`, margin: "0.9rem 0 0.5rem" }} />

        {/* Footer triptych */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1px 1fr 1px 1fr",
            alignItems: "center",
            fontFamily: sans,
            fontSize: "0.46rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: ink,
            fontWeight: 500,
          }}
        >
          <FooterCell label="Date" value={displayDate || "—"} align="left" inkSoft={inkSoft} />
          <div style={{ background: hairline, width: 1, height: "1.8rem", justifySelf: "center" }} />
          <FooterCell label="Location" value={countryLine || cityName} align="center" inkSoft={inkSoft} />
          <div style={{ background: hairline, width: 1, height: "1.8rem", justifySelf: "center" }} />
          <FooterCell label="Edition" value={`Nº ${editionNo} / 500`} align="right" inkSoft={inkSoft} />
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
