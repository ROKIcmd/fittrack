// Public holidays from the free Nager.Date API (no API key needed).
// Docs: https://date.nager.at  ->  GET /api/v3/PublicHolidays/{year}/{countryCode}
const cache = new Map();

export async function fetchHolidays(year, country = "PH") {
  const key = `${country}-${year}`;
  if (cache.has(key)) return cache.get(key);
  const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`);
  if (!res.ok) throw new Error(`Holiday API error ${res.status}`);
  const data = await res.json();
  const map = Object.fromEntries(data.map((h) => [h.date, h.localName || h.name]));
  cache.set(key, map);
  return map; // { "2026-12-25": "Pasko", ... }
}
