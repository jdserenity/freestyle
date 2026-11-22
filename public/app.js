import { pickWord } from "./js/pick-word.mjs";

const wordEl = document.getElementById("word");
let words = null;
let current = null;

function show(mode) {
  if (!words) return;
  current = pickWord(words, mode, current);
  if (current) wordEl.textContent = current;
}

function modeButton(target, root) {
  const btn = target?.closest?.("button[data-mode]");
  if (!btn || !root.contains(btn)) return null;
  return btn;
}

function bindTap(root) {
  // Visual press only — do not change the word here (avoids double-fire with click).
  root.addEventListener("pointerdown", (e) => {
    if (e.button != null && e.button !== 0) return;
    const btn = modeButton(e.target, root);
    if (btn) btn.classList.add("is-pressed");
  });

  const clear = (e) => {
    const btn = modeButton(e.target, root);
    if (btn) btn.classList.remove("is-pressed");
  };
  root.addEventListener("pointerup", clear);
  root.addEventListener("pointercancel", clear);
  root.addEventListener("pointerleave", clear);

  // One word change per tap/click/keyboard activate.
  root.addEventListener("click", (e) => {
    const btn = modeButton(e.target, root);
    if (!btn) return;
    show(btn.dataset.mode);
  });
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
