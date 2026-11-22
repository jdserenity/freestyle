/** Count syllables from CMUdict ARPAbet phones (digits mark vowel stress). */
export function countSyllables(phones) {
  let n = 0;
  for (const phone of phones) {
    if (/\d/.test(phone)) n += 1;
  }
  return n;
}

/** Lowercase spelling; null if not a simple letter word (apostrophe ok). */
export function normalizeWord(raw) {
  const base = raw.replace(/\(\d+\)$/, "");
  if (!/^[A-Za-z']+$/.test(base)) return null;
  return base.toLowerCase();
}

/** Parse one CMUdict line into { word, syllables } or null. */
export function parseCmudictLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith(";;;")) return null;
  const parts = trimmed.split(/\s+/);
  if (parts.length < 2) return null;
  const word = normalizeWord(parts[0]);
  if (!word) return null;
  const syllables = countSyllables(parts.slice(1));
  if (syllables < 1) return null;
  return { word, syllables };
}

/** Build { "1": [...], "2": [...], "3": [...] } from CMUdict lines. First pronunciation wins. */
export function bucketWords(lines) {
  const seen = new Set();
  const buckets = { "1": [], "2": [], "3": [] };
  for (const line of lines) {
    const parsed = parseCmudictLine(line);
    if (!parsed) continue;
    if (parsed.syllables < 1 || parsed.syllables > 3) continue;
    if (seen.has(parsed.word)) continue;
    seen.add(parsed.word);
    buckets[String(parsed.syllables)].push(parsed.word);
  }
  for (const key of Object.keys(buckets)) buckets[key].sort();
  return buckets;
}
