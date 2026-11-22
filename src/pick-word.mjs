/** Pick a word from syllable buckets. mode: "random" | "1" | "2" | "3". */
export function pickWord(words, mode, current = null, random = Math.random) {
  let pool;
  if (mode === "random") {
    pool = [...(words["1"] || []), ...(words["2"] || []), ...(words["3"] || [])];
  } else {
    pool = words[mode] || [];
  }
  if (pool.length === 0) return null;
  if (pool.length === 1) return pool[0];

  let choices = pool;
  if (current != null) {
    const filtered = pool.filter((w) => w !== current);
    if (filtered.length > 0) choices = filtered;
  }

  const index = Math.floor(random() * choices.length);
  return choices[index];
}
