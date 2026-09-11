const assert = require('node:assert/strict');
const { load } = require('./load-typescript.cjs');
const { beginStroke, moveStroke } = load('src/drawing.ts');
// Simulate React applying all updates after the pointer has already been released.
let active = beginStroke(35, 70, 'red');
const first = active.stroke;
const pending = [(previous) => [...previous, first]];
active = moveStroke(active, 20, 30);
const moved = active.stroke;
pending.push((previous) => [...previous.slice(0, -1), moved]);
active = null;
const strokes = pending.reduce((previous, update) => update(previous), []);
assert.deepEqual(strokes, [
  { color: 'red', points: 'M 35 70 l 0.1 0.1 L 55 100' },
]);
assert.equal(first.points, 'M 35 70 l 0.1 0.1');
// Different starting positions and negative/out-of-bounds movement stay in canvas space.
for (const [x, y] of [
  [0, 0],
  [140, 200],
  [450, 410],
]) {
  const start = beginStroke(x, y, 'blue');
  assert.equal(
    moveStroke(start, -50, 15).stroke.points,
    `M ${x} ${y} l 0.1 0.1 L ${x - 50} ${y + 15}`,
  );
  assert.equal(moveStroke(start, NaN, 1), start);
}
assert.ok(
  beginStroke(12, 13, 'green').stroke.points.includes('l 0.1 0.1'),
  'Single taps create a dot',
);
assert.equal(
  strokes[0].color,
  'red',
  'Later gestures cannot recolor earlier strokes',
);
console.log(
  'Drawing checks passed: delayed updates after release, immutable snapshots, canvas offsets, edge movement, and single taps.',
);
