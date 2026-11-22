import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { pickWord } from "../src/pick-word.mjs";

const words = {
  "1": ["cat", "dog", "beat"],
  "2": ["freestyle", "rhythm"],
  "3": ["microphone", "silhouette", "opportunity"],
};

describe("pickWord", () => {
  it("picks from a syllable bucket", () => {
    const word = pickWord(words, "2", null, () => 0);
    assert.equal(word, "freestyle");
  });

  it("picks from all buckets for random", () => {
    const word = pickWord(words, "random", null, () => 0);
    assert.equal(word, "cat");
  });

  it("avoids repeating the current word when alternatives exist", () => {
    const word = pickWord(words, "1", "cat", () => 0);
    assert.equal(word, "dog");
  });

  it("returns the only word even if it matches current", () => {
    const solo = { "1": ["only"], "2": [], "3": [] };
    assert.equal(pickWord(solo, "1", "only", () => 0), "only");
  });
});
