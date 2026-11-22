import { pickWord } from "./js/pick-word.mjs";
import { wordScale } from "./js/fit-word.mjs";

const wordEl = document.getElementById("word");
const wordFit = document.getElementById("word-fit");
const wordHit = document.querySelector(".word-hit");
let words = null;
let current = null;

function fitWord() {
  wordFit.style.setProperty("--s", "1");
  const style = getComputedStyle(wordHit);
  const maxWidth =
    wordHit.clientWidth -
    parseFloat(style.paddingLeft) -
    parseFloat(style.paddingRight);
  const s = wordScale(wordEl.scrollWidth, maxWidth);
  wordFit.style.setProperty("--s", String(s));
}

function show(mode) {
  if (!words) return;
  current = pickWord(words, mode, current);
  if (!current) return;
  wordEl.textContent = current;
  fitWord();
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
  if (document.fonts?.ready) await document.fonts.ready;
  show("random");

  bindTap(wordHit);
  bindTap(document.querySelector(".controls"));
  window.addEventListener("resize", fitWord);

  if ("serviceWorker" in navigator) {
    try { await navigator.serviceWorker.register("/sw.js"); } catch {}
  }
}

boot();
