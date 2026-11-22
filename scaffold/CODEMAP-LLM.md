# Code map (agent reference)

Dense codebase/system map for agents — compact is fine. Optimized so an agent can understand the system without grepping the whole codebase.

Confirmed product and system facts only. No open questions. Lessons and pitfalls belong here as short factual notes, or in scaffold/CODEMAP-HUMAN.md when they are mainly a maintainer-facing map note.

## Product

- Personal freestyle rhyme-prompt PWA: shows one word; user taps a button to get the next.
- Purpose: words are rhyme *seeds* (phonetic starting points). Meaning and “interestingness” do not matter; do not cull for dull/awkward vocabulary.
- UI: orange full-screen background; large centered word; bottom buttons: Random, 1-syllable, 2-syllable, 3-syllable.
- Word stays until a button is pressed. No timer.
- PWA; pinch-zoom disabled so it feels like a native app.

## Data

- Bundled static JSON word lists (no database, no runtime API).
- Source: CMU Pronouncing Dictionary (CMUdict); syllable counts derived from pronunciation stress marks.
- Scale: thousands of words (not a curated hundreds list). Keep 1-, 2-, and 3-syllable buckets large.

## Deploy

- Static app on Cloudflare Pages (no VPS / no server for v1).
- `wrangler.jsonc` `pages_build_output_dir` is `public/`.
- Service worker caches the app shell and `words.json` for offline use.
