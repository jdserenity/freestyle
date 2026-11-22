import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { wordScale } from "../public/js/fit-word.mjs";

describe("wordScale", () => {
  it("stays at 1 when text already fits", () => {
    assert.equal(wordScale(200, 300), 1);
  });

  it("scales down when text is wider than the box", () => {
    assert.equal(wordScale(400, 200), 0.5);
  });

  it("returns 1 for invalid sizes", () => {
    assert.equal(wordScale(0, 200), 1);
    assert.equal(wordScale(200, 0), 1);
  });
});
