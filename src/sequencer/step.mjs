// Pure sequencer logic: given where the playhead is, the squares on the grid
// and the grid size, work out what happens on this tick and where to go next.
// No Vue, store or DOM in here, so it can be unit tested and used as the
// reference behaviour when porting to the JUCE plugin.
//
// Coordinates start at 1, like the grid in the UI.
//
// A square is { x, y, refName, type, direction?, connectsTo? } where type is
// "Arrow", "Pause" or "Portal" and connectsTo is the refName of the paired portal.

const refNameFor = (x, y) => `r${x}-${y}`;

const offsets = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

/**
 * @param {{ x: number, y: number, direction: string, previousRefName?: string }} state
 * @param {Array} squares transformed squares on the grid
 * @param {{ x: number, y: number }} gridSize
 * @returns {null | {
 *   x: number, y: number,       // the cell played on this tick
 *   sound: boolean,             // false on a Pause square
 *   direction: string,          // direction after this tick
 *   next: null | { x: number, y: number, refName: string }  // null = stop after this tick
 * }} null when the playhead is outside the grid (stop without playing)
 */
export function step(state, squares, gridSize) {
  const { x, y, previousRefName } = state;
  let { direction } = state;

  if (x < 1 || y < 1 || x > gridSize.x || y > gridSize.y) return null;

  const refName = refNameFor(x, y);
  const square = squares.find((s) => s.refName === refName);
  const type = square ? square.type : "";

  if (square && square.direction) direction = square.direction;

  const result = { x, y, sound: type !== "Pause", direction, next: null };

  // Entering a portal jumps to its pair; leaving the pair (where we just came
  // from) moves on in the current direction instead of jumping back.
  // A portal without a pair stops the playhead.
  if (
    type === "Portal" &&
    (!square.connectsTo || previousRefName !== square.connectsTo)
  ) {
    const target = square.connectsTo
      ? squares.find((s) => s.refName === square.connectsTo)
      : null;
    if (target) {
      result.next = { x: target.x, y: target.y, refName: target.refName };
    }
    return result;
  }

  const offset = offsets[direction] || { x: 0, y: 0 };
  const nextX = x + offset.x;
  const nextY = y + offset.y;
  result.next = { x: nextX, y: nextY, refName: refNameFor(nextX, nextY) };
  return result;
}
