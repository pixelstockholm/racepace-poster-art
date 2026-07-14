import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const ROUTES_FILE = path.join(ROOT, "src/data/verifiedRoutes.json");

const GOANDRACE_BASE = "https://www.goandrace.com";

const CANDIDATES = [
  {
    race_id: "london",
    id: "london-2026",
    marathon_name: "TCS London Marathon",
    city: "London",
    country: "United Kingdom",
    year: 2026,
    event_url: "https://www.goandrace.com/en/running-events/2026/04/tcs-london-marathon-2026.php",
  },
  {
    race_id: "stockholm",
    id: "stockholm-2026",
    marathon_name: "Stockholm Marathon",
    city: "Stockholm",
    country: "Sweden",
    year: 2026,
    event_url:
      "https://www.goandrace.com/en/running-events/2026/05/adidas-stockholm-marathon-2026.php",
  },
  {
    race_id: "edinburgh",
    id: "edinburgh-2026",
    marathon_name: "Edinburgh Marathon",
    city: "Edinburgh",
    country: "United Kingdom",
    year: 2026,
    event_url:
      "https://www.goandrace.com/en/running-events/2026/05/edinburgh-marathon-festival-2026.php",
  },
  {
    race_id: "capetown",
    id: "capetown-2026",
    marathon_name: "Sanlam Cape Town Marathon",
    city: "Cape Town",
    country: "South Africa",
    year: 2026,
    event_url: "https://www.goandrace.com/en/running-events/2026/05/cape-town-marathon-2026.php",
  },
  {
    race_id: "sydney",
    id: "sydney-2026",
    marathon_name: "Sydney Marathon",
    city: "Sydney",
    country: "Australia",
    year: 2026,
    event_url: "https://www.goandrace.com/en/running-events/2026/08/maratona-sydney-2026.php",
  },
  {
    race_id: "chicago",
    id: "chicago-2026",
    marathon_name: "Bank of America Chicago Marathon",
    city: "Chicago",
    country: "United States",
    year: 2026,
    event_url: "https://www.goandrace.com/en/running-events/2026/10/maratona-di-chicago-2026.php",
  },
  {
    race_id: "amsterdam",
    id: "amsterdam-2026",
    marathon_name: "TCS Amsterdam Marathon",
    city: "Amsterdam",
    country: "Netherlands",
    year: 2026,
    event_url: "https://www.goandrace.com/en/running-events/2026/10/amsterdam-2026.php",
  },
  {
    race_id: "berlin",
    id: "berlin-2026",
    marathon_name: "BMW Berlin Marathon",
    city: "Berlin",
    country: "Germany",
    year: 2026,
    event_url: "https://www.goandrace.com/en/running-events/2026/09/maratona-di-berlino-2026.php",
  },
];

// These are not all in the launch catalog yet. They are useful candidates
// if Racepace expands beyond the current product list.
const ROUTE_READY_EXPANSION = [
  {
    race_id: "hamburg",
    id: "hamburg-2026",
    marathon_name: "Haspa Marathon Hamburg",
    city: "Hamburg",
    country: "Germany",
    year: 2026,
    event_url:
      "https://www.goandrace.com/en/running-events/2026/04/haspa-marathon-hamburg-2026.php",
  },
  {
    race_id: "big-sur",
    id: "big-sur-2026",
    marathon_name: "Big Sur International Marathon",
    city: "Big Sur",
    country: "United States",
    year: 2026,
    event_url:
      "https://www.goandrace.com/en/running-events/2026/04/big-sur-international-marathon-2026.php",
  },
  {
    race_id: "gold-coast",
    id: "gold-coast-2026",
    marathon_name: "Gold Coast Marathon",
    city: "Gold Coast",
    country: "Australia",
    year: 2026,
    event_url:
      "https://www.goandrace.com/en/running-events/2026/07/asics-gold-coast-marathon-2026-southport.php",
  },
  {
    race_id: "san-francisco",
    id: "san-francisco-2026",
    marathon_name: "San Francisco Marathon",
    city: "San Francisco",
    country: "United States",
    year: 2026,
    event_url:
      "https://www.goandrace.com/en/running-events/2026/07/san-francisco-marathon-2026.php",
  },
  {
    race_id: "knysna",
    id: "knysna-2026",
    marathon_name: "Knysna Forest Marathon",
    city: "Knysna",
    country: "South Africa",
    year: 2026,
    event_url:
      "https://www.goandrace.com/en/running-events/2026/07/knysna-forest-marathon-2026.php",
  },
  {
    race_id: "oulu",
    id: "oulu-2026",
    marathon_name: "Terwa Marathon",
    city: "Oulu",
    country: "Finland",
    year: 2026,
    event_url: "https://www.goandrace.com/en/running-events/2026/05/terwa-marathon-2026-oulu.php",
  },
];

const includeExpansion = process.argv.includes("--include-expansion");
const candidates = includeExpansion ? [...CANDIDATES, ...ROUTE_READY_EXPANSION] : CANDIDATES;

function absoluteUrl(url) {
  if (url.startsWith("http")) return url;
  return new URL(url, GOANDRACE_BASE).toString();
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      "user-agent": "Racepace route verification importer (manual editorial review)",
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.text();
}

function findMapUrl(html, eventUrl) {
  const urls = new Set();
  const hrefPattern = /href=["']([^"']*\/(?:en\/)?map\/[^"']+course-map-1(?:-3d)?\.php)["']/g;
  let match;
  while ((match = hrefPattern.exec(html))) urls.add(absoluteUrl(match[1]));

  for (const url of urls) {
    if (!url.includes("-3d.php")) return url;
  }
  for (const url of urls) return url.replace("-3d.php", ".php");

  const derived = eventUrl
    .replace("/running-events/", "/map/")
    .replace(/\.php$/, "-course-map-1.php");
  return derived;
}

function extractPoints(html) {
  const match = html.match(/const\s+points\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) throw new Error("No coordinate array found");
  const raw = JSON.parse(match[1]);
  const points = raw
    .map(([lat, lon]) => ({ lat: Number(lat), lon: Number(lon) }))
    .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lon));
  if (points.length < 2) throw new Error("Too few valid coordinate points");
  return points;
}

function sqSegDist(p, a, b) {
  let x = a.lon;
  let y = a.lat;
  let dx = b.lon - x;
  let dy = b.lat - y;
  if (dx !== 0 || dy !== 0) {
    const t = ((p.lon - x) * dx + (p.lat - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x = b.lon;
      y = b.lat;
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }
  dx = p.lon - x;
  dy = p.lat - y;
  return dx * dx + dy * dy;
}

function simplify(points, tolerance = 0.00015) {
  if (points.length < 3) return points.slice();
  const sqTol = tolerance * tolerance;
  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [i0, i1] = stack.pop();
    let maxD = 0;
    let idx = -1;
    const a = points[i0];
    const b = points[i1];
    for (let i = i0 + 1; i < i1; i++) {
      const d = sqSegDist(points[i], a, b);
      if (d > maxD) {
        maxD = d;
        idx = i;
      }
    }
    if (maxD > sqTol && idx !== -1) {
      keep[idx] = 1;
      stack.push([i0, idx], [idx, i1]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

function toSvgPath(points, { viewBox = 100, padding = 4, decimals = 2 } = {}) {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLon = Infinity;
  let maxLon = -Infinity;
  for (const p of points) {
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
    if (p.lon < minLon) minLon = p.lon;
    if (p.lon > maxLon) maxLon = p.lon;
  }
  const midLat = (minLat + maxLat) / 2;
  const kx = Math.cos((midLat * Math.PI) / 180);
  const projX = (lon) => (lon - minLon) * kx;
  const projY = (lat) => maxLat - lat;
  const w = (maxLon - minLon) * kx;
  const h = maxLat - minLat;
  const inner = viewBox - padding * 2;
  const scale = inner / Math.max(w, h);
  const offX = padding + (inner - w * scale) / 2;
  const offY = padding + (inner - h * scale) / 2;
  const r = (n) => Number(n.toFixed(decimals));

  const d = points
    .map((p, i) => {
      const x = r(offX + projX(p.lon) * scale);
      const y = r(offY + projY(p.lat) * scale);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return {
    d,
    bounds: { minLat, maxLat, minLon, maxLon },
  };
}

function trackDistanceKm(points) {
  const R = 6371;
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLon = ((b.lon - a.lon) * Math.PI) / 180;
    const la1 = (a.lat * Math.PI) / 180;
    const la2 = (b.lat * Math.PI) / 180;
    const s = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
    total += 2 * R * Math.asin(Math.sqrt(s));
  }
  return total;
}

function validateRoute(points, distanceKm) {
  if (points.length < 100) return `too few points (${points.length})`;
  if (distanceKm < 39 || distanceKm > 46) {
    return `distance outside marathon sanity range (${distanceKm.toFixed(2)} km)`;
  }
  return null;
}

async function importCandidate(candidate) {
  const eventHtml = await fetchText(candidate.event_url);
  const mapUrl = findMapUrl(eventHtml, candidate.event_url);
  const mapHtml = await fetchText(mapUrl);
  const rawPoints = extractPoints(mapHtml);
  const distanceKm = trackDistanceKm(rawPoints);
  const validationError = validateRoute(rawPoints, distanceKm);
  if (validationError) {
    return { status: "skipped", reason: validationError, candidate, mapUrl };
  }
  const simplified = simplify(rawPoints);
  const { d, bounds } = toSvgPath(simplified);
  return {
    status: "imported",
    candidate,
    mapUrl,
    route: {
      id: candidate.id,
      race_id: candidate.race_id,
      marathon_name: candidate.marathon_name,
      city: candidate.city,
      country: candidate.country,
      year: candidate.year,
      gpx_file_url: "",
      svg_path: d,
      route_bounds: bounds,
      route_source_url: mapUrl,
      route_verified: true,
      route_notes: `Imported from Go&Race public course-map coordinate array. Distance sanity-check: ${distanceKm.toFixed(
        2,
      )} km from ${rawPoints.length} source points, simplified to ${simplified.length} points.`,
    },
    stats: {
      distanceKm,
      sourcePoints: rawPoints.length,
      simplifiedPoints: simplified.length,
    },
  };
}

async function main() {
  const existing = JSON.parse(await fs.readFile(ROUTES_FILE, "utf8"));
  const byId = new Map(existing.routes.map((route) => [route.id, route]));
  const results = [];

  for (const candidate of candidates) {
    try {
      const result = await importCandidate(candidate);
      results.push(result);
      if (result.status === "imported") byId.set(result.route.id, result.route);
    } catch (error) {
      results.push({
        status: "failed",
        candidate,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const routes = Array.from(byId.values()).sort(
    (a, b) => a.race_id.localeCompare(b.race_id) || b.year - a.year,
  );
  await fs.writeFile(ROUTES_FILE, `${JSON.stringify({ routes }, null, 2)}\n`);

  for (const result of results) {
    const label = `${result.candidate.race_id} ${result.candidate.year}`;
    if (result.status === "imported") {
      console.log(
        `imported ${label}: ${result.stats.distanceKm.toFixed(2)} km, ${
          result.stats.sourcePoints
        } pts -> ${result.stats.simplifiedPoints} pts`,
      );
    } else {
      console.log(`${result.status} ${label}: ${result.reason}`);
    }
  }
  console.log(`saved ${routes.length} verified routes to ${ROUTES_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
