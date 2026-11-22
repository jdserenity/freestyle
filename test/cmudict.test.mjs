import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  countSyllables,
  normalizeWord,
  parseCmudictLine,
  bucketWords,
} from "../src/cmudict.mjs";

describe("countSyllables", () => {
  it("counts stress-marked vowels as syllables", () => {
    assert.equal(countSyllables(["K", "AE1", "T"]), 1);
    assert.equal(countSyllables(["F", "R", "IY1", "S", "T", "AY2", "L"]), 2);
    assert.equal(countSyllables(["M", "AY1", "K", "R", "AH0", "F", "OW2", "N"]), 3);
  });
});

describe("normalizeWord", () => {
  it("lowercases and strips pronunciation variant markers", () => {
    assert.equal(normalizeWord("CAT"), "cat");
    assert.equal(normalizeWord("CAT(2)"), "cat");
  });

  it("rejects non-letter spellings", () => {
    assert.equal(normalizeWord("3D"), null);
    assert.equal(normalizeWord("AT&T"), null);
    assert.equal(normalizeWord("NEW-YORK"), null);
  });

  it("allows apostrophes inside words", () => {
    assert.equal(normalizeWord("CAN'T"), "can't");
  });
});

describe("parseCmudictLine", () => {
  it("parses a word and pronunciation", () => {
    assert.deepEqual(parseCmudictLine("CAT  K AE1 T"), {
      word: "cat",
      syllables: 1,
    });
  });

  it("skips comments and blank lines", () => {
    assert.equal(parseCmudictLine(";;; comment"), null);
    assert.equal(parseCmudictLine(""), null);
  });

  it("skips invalid words", () => {
    assert.equal(parseCmudictLine("AT&T  EY1 T IY1"), null);
  });
});

describe("bucketWords", () => {
  it("groups unique words into 1/2/3 syllable lists", () => {
    const lines = [
      "CAT  K AE1 T",
      "CAT(2)  K AE0 T",
      "FREESTYLE  F R IY1 S T AY2 L",
      "MICROPHONE  M AY1 K R AH0 F OW2 N",
      "OPPORTUNITY  AA2 P ER0 T UW1 N AH0 T IY0",
    ];
    const buckets = bucketWords(lines);
    assert.deepEqual(buckets["1"], ["cat"]);
    assert.deepEqual(buckets["2"], ["freestyle"]);
    assert.deepEqual(buckets["3"], ["microphone"]);
    assert.ok(!buckets["4"]);
  });
});
