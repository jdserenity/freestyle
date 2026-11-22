import { pickWord } from "./js/pick-word.mjs";

const wordEl = document.getElementById("word");
let words = null;
let current = null;

function show(mode) {
  if (!words) return;
  current = pickWord(words, mode, current);
  if (current) wordEl.textContent = current;
}

async function boot() {
  const res = await fetch("/words.json");
  words = await res.json();
  show("random");

  document.querySelector(".controls").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-mode]");
    if (!btn) return;
    show(btn.dataset.mode);
  });

  if ("serviceWorker" in navigator) {
    try { await navigator.serviceWorker.register("/sw.js"); } catch {}
  }
}

boot();
