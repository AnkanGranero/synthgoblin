import { test } from "node:test";
import assert from "node:assert/strict";
import { step } from "./step.mjs";

const grid = { x: 15, y: 15 };
const arrow = (x, y, direction) => ({ x, y, refName: `r${x}-${y}`, type: "Arrow", direction });
const pause = (x, y) => ({ x, y, refName: `r${x}-${y}`, type: "Pause" });
const portal = (x, y, connectsTo) => ({ x, y, refName: `r${x}-${y}`, type: "Portal", connectsTo });

test("moves one cell in the current direction on an empty square", () => {
  const r = step({ x: 5, y: 5, direction: "right" }, [], grid);
  assert.deepEqual(r, {
    x: 5, y: 5, sound: true, direction: "right",
    next: { x: 6, y: 5, refName: "r6-5" },
  });
});

test("moves in every direction", () => {
  const next = (direction) => step({ x: 5, y: 5, direction }, [], grid).next;
  assert.deepEqual(next("up"), { x: 5, y: 4, refName: "r5-4" });
  assert.deepEqual(next("down"), { x: 5, y: 6, refName: "r5-6" });
  assert.deepEqual(next("left"), { x: 4, y: 5, refName: "r4-5" });
});

test("an arrow sets the direction, plays, and moves that way", () => {
  const r = step({ x: 5, y: 5, direction: "right" }, [arrow(5, 5, "up")], grid);
  assert.equal(r.direction, "up");
  assert.equal(r.sound, true);
  assert.deepEqual(r.next, { x: 5, y: 4, refName: "r5-4" });
});

test("a pause is silent but keeps moving", () => {
  const r = step({ x: 5, y: 5, direction: "down" }, [pause(5, 5)], grid);
  assert.equal(r.sound, false);
  assert.deepEqual(r.next, { x: 5, y: 6, refName: "r5-6" });
});

test("stops without playing when the playhead is outside the grid", () => {
  assert.equal(step({ x: 16, y: 5, direction: "right" }, [], grid), null);
  assert.equal(step({ x: 5, y: 0, direction: "up" }, [], grid), null);
});

test("plays the last cell on the edge, then steps outside", () => {
  const r = step({ x: 15, y: 5, direction: "right" }, [], grid);
  assert.equal(r.sound, true);
  assert.deepEqual(r.next, { x: 16, y: 5, refName: "r16-5" });
});

test("entering a portal jumps to its pair and keeps the direction", () => {
  const squares = [portal(3, 3, "r10-10"), portal(10, 10, "r3-3")];
  const r = step({ x: 3, y: 3, direction: "right", previousRefName: "r2-3" }, squares, grid);
  assert.equal(r.sound, true);
  assert.equal(r.direction, "right");
  assert.deepEqual(r.next, { x: 10, y: 10, refName: "r10-10" });
});

test("arriving through a portal moves on instead of jumping back", () => {
  const squares = [portal(3, 3, "r10-10"), portal(10, 10, "r3-3")];
  const r = step({ x: 10, y: 10, direction: "right", previousRefName: "r3-3" }, squares, grid);
  assert.deepEqual(r.next, { x: 11, y: 10, refName: "r11-10" });
});

test("an unpaired portal plays and then stops", () => {
  const r = step({ x: 3, y: 3, direction: "right" }, [portal(3, 3)], grid);
  assert.equal(r.sound, true);
  assert.equal(r.next, null);
});

test("without a direction the playhead stays put", () => {
  const r = step({ x: 5, y: 5, direction: "" }, [], grid);
  assert.deepEqual(r.next, { x: 5, y: 5, refName: "r5-5" });
});
