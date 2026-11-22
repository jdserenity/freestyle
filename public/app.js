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
  // Touch/pen: act on press for snappy feel; prevent the delayed synthetic click.
  root.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "touch" && e.pointerType !== "pen") return;
    const btn = modeButton(e.target, root);
    if (!btn) return;
    e.preventDefault();
    btn.classList.add("is-pressed");
    show(btn.dataset.mode);
  });

  // Mouse + keyboard: normal click.
  root.addEventListener("click", (e) => {
    const btn = modeButton(e.target, root);
    if (!btn) return;
    show(btn.dataset.mode);
  });

  const clear = (e) => {
    const btn = modeButton(e.target, root);
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
