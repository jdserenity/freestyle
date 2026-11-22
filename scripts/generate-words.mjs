#!/usr/bin/env node
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { bucketWords } from "../src/cmudict.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const cachePath = join(root, "data", "cmudict-0.7b");
const outPath = join(root, "public", "words.json");
const CMUDICT_URL =
  "https://raw.githubusercontent.com/cmusphinx/cmudict/master/cmudict.dict";

async function loadCmudict() {
  try {
    return await readFile(cachePath, "utf8");
  } catch {
    const res = await fetch(CMUDICT_URL);
    if (!res.ok) throw new Error(`Failed to download CMUdict: ${res.status}`);
    const text = await res.text();
    await mkdir(dirname(cachePath), { recursive: true });
    await writeFile(cachePath, text);
    return text;
  }
}

const text = await loadCmudict();
const lines = text.split(/\r?\n/);
const buckets = bucketWords(lines);
await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, JSON.stringify(buckets) + "\n");

const counts = Object.fromEntries(
  Object.entries(buckets).map(([k, v]) => [k, v.length]),
);
console.log("Wrote", outPath, counts);
console.log("Total", Object.values(counts).reduce((a, b) => a + b, 0));
