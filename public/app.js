import { pickWord } from "./js/pick-word.mjs";

const wordEl = document.getElementById("word");
let words = null;
let current = null;

function show(mode) {
  if (!words) return;
  current = pickWord(words, mode, current);
  if (current) wordEl.textContent = current;
}

function bindTap(root) {
  root.addEventListener("pointerdown", (e) => {
    if (e.button != null && e.button !== 0) return;
    const btn = e.target.closest("button[data-mode]");
    if (!btn || !root.contains(btn)) return;
    e.preventDefault();
    btn.classList.add("is-pressed");
    show(btn.dataset.mode);
  });

  const clear = (e) => {
    const btn = e.target.closest?.("button[data-mode]");
    if (btn) btn.classList.remove("is-pressed");
  };
  root.addEventListener("pointerup", clear);
  root.addEventListener("pointercancel", clear);
  root.addEventListener("pointerleave", clear);
}

async function boot() {
  const res = await fetch("/words.json");
  words = await res.json();
  show("random");

  bindTap(document.querySelector(".word-hit"));
  bindTap(document.querySelector(".controls"));

  if ("serviceWorker" in navigator) {
    try { await navigator.serviceWorker.register("/sw.js"); } catch {}
  }
}

boot();
