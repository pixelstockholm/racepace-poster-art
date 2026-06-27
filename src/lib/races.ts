// Static race database. Date is the most recent / next scheduled edition (ISO).
export interface Race {
  id: string;
  name: string;
  city: string;
  country: string;
  date: string; // YYYY-MM-DD
  distanceKm: number;
}

export const RACES: Race[] = [
  { id: "berlin",     name: "BMW Berlin Marathon",         city: "Berlin",     country: "Germany",        date: "2024-09-29", distanceKm: 42.195 },
  { id: "nyc",        name: "TCS New York City Marathon",  city: "New York",   country: "United States",  date: "2024-11-03", distanceKm: 42.195 },
  { id: "london",     name: "TCS London Marathon",         city: "London",     country: "United Kingdom", date: "2025-04-27", distanceKm: 42.195 },
  { id: "boston",     name: "Boston Marathon",             city: "Boston",     country: "United States",  date: "2025-04-21", distanceKm: 42.195 },
  { id: "chicago",    name: "Bank of America Chicago Marathon", city: "Chicago", country: "United States", date: "2024-10-13", distanceKm: 42.195 },
  { id: "tokyo",      name: "Tokyo Marathon",              city: "Tokyo",      country: "Japan",          date: "2025-03-02", distanceKm: 42.195 },
  { id: "stockholm",  name: "Stockholm Marathon",          city: "Stockholm",  country: "Sweden",         date: "2025-05-31", distanceKm: 42.195 },
  { id: "valencia",   name: "Valencia Marathon",           city: "Valencia",   country: "Spain",          date: "2024-12-01", distanceKm: 42.195 },
  { id: "paris",      name: "Schneider Electric Marathon de Paris", city: "Paris", country: "France",      date: "2025-04-13", distanceKm: 42.195 },
  { id: "amsterdam",  name: "TCS Amsterdam Marathon",      city: "Amsterdam",  country: "Netherlands",    date: "2024-10-20", distanceKm: 42.195 },
  { id: "copenhagen", name: "Copenhagen Marathon",         city: "Copenhagen", country: "Denmark",        date: "2025-05-18", distanceKm: 42.195 },
  { id: "oslo",       name: "Oslo Marathon",               city: "Oslo",       country: "Norway",         date: "2024-09-21", distanceKm: 42.195 },
  { id: "helsinki",   name: "Helsinki City Marathon",      city: "Helsinki",   country: "Finland",        date: "2025-08-16", distanceKm: 42.195 },
  { id: "reykjavik",  name: "Reykjavík Marathon",          city: "Reykjavík",  country: "Iceland",        date: "2024-08-24", distanceKm: 42.195 },
  { id: "barcelona",  name: "Zurich Marató de Barcelona",  city: "Barcelona",  country: "Spain",          date: "2025-03-16", distanceKm: 42.195 },
  { id: "rome",       name: "Acea Run Rome The Marathon",  city: "Rome",       country: "Italy",          date: "2025-03-16", distanceKm: 42.195 },
  { id: "milan",      name: "Milano Marathon",             city: "Milan",      country: "Italy",          date: "2025-04-06", distanceKm: 42.195 },
  { id: "frankfurt",  name: "Mainova Frankfurt Marathon",  city: "Frankfurt",  country: "Germany",        date: "2024-10-27", distanceKm: 42.195 },
  { id: "munich",     name: "Generali München Marathon",   city: "Munich",     country: "Germany",        date: "2024-10-13", distanceKm: 42.195 },
  { id: "vienna",     name: "Vienna City Marathon",        city: "Vienna",     country: "Austria",        date: "2025-04-06", distanceKm: 42.195 },
  { id: "dublin",     name: "Irish Life Dublin Marathon",  city: "Dublin",     country: "Ireland",        date: "2024-10-27", distanceKm: 42.195 },
  { id: "edinburgh",  name: "Edinburgh Marathon",          city: "Edinburgh",  country: "United Kingdom", date: "2025-05-25", distanceKm: 42.195 },
  { id: "manchester", name: "Manchester Marathon",         city: "Manchester", country: "United Kingdom", date: "2025-04-27", distanceKm: 42.195 },
  { id: "lisbon",     name: "EDP Lisbon Marathon",         city: "Lisbon",     country: "Portugal",       date: "2024-10-20", distanceKm: 42.195 },
  { id: "athens",     name: "Athens Authentic Marathon",   city: "Athens",     country: "Greece",         date: "2024-11-10", distanceKm: 42.195 },
  { id: "istanbul",   name: "N Kolay Istanbul Marathon",   city: "Istanbul",   country: "Türkiye",        date: "2024-11-03", distanceKm: 42.195 },
  { id: "prague",     name: "Volkswagen Prague Marathon",  city: "Prague",     country: "Czechia",        date: "2025-05-04", distanceKm: 42.195 },
  { id: "budapest",   name: "Spar Budapest Marathon",      city: "Budapest",   country: "Hungary",        date: "2024-10-13", distanceKm: 42.195 },
  { id: "warsaw",     name: "Orlen Warsaw Marathon",       city: "Warsaw",     country: "Poland",         date: "2025-04-27", distanceKm: 42.195 },
  { id: "toronto",    name: "TCS Toronto Waterfront Marathon", city: "Toronto", country: "Canada",        date: "2024-10-20", distanceKm: 42.195 },
  { id: "sydney",     name: "Sydney Marathon",             city: "Sydney",     country: "Australia",      date: "2025-08-31", distanceKm: 42.195 },
  { id: "melbourne",  name: "Nike Melbourne Marathon",     city: "Melbourne",  country: "Australia",      date: "2024-10-13", distanceKm: 42.195 },
  { id: "capetown",   name: "Sanlam Cape Town Marathon",   city: "Cape Town",  country: "South Africa",   date: "2024-10-20", distanceKm: 42.195 },
  { id: "marathon-du-medoc", name: "Marathon du Médoc",    city: "Pauillac",   country: "France",         date: "2025-09-06", distanceKm: 42.195 },
];

export function findRaceById(id: string | undefined): Race | undefined {
  if (!id) return undefined;
  return RACES.find((r) => r.id === id);
}
