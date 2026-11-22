# Freestyle

Personal PWA that shows a rhyme-seed word for freestyle practice. Orange screen, one big word, four buttons (random / 1 / 2 / 3 syllable). No timer.

## Commands

```bash
npm test
npm run generate-words   # rebuild public/words.json from CMUdict
npm run dev              # http://localhost:5173
npm run deploy           # Cloudflare Pages
```

First deploy may need: `npx wrangler login` then `npx wrangler pages project create freestyle`.
