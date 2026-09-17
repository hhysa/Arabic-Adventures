const assert = require('node:assert/strict');
const { load } = require('./load-typescript.cjs');
const { getLevels } = load('src/levels.ts');
assert.equal(getLevels([]).length, 28);
assert.equal(
  getLevels([]).find((level) => !level.complete).nextWord.id,
  'lion',
);
assert.equal(getLevels(['lion'])[0].count, 1);
assert.equal(getLevels(['lion'])[0].nextWord.id, 'rabbit');
assert.equal(getLevels(['lion', 'rabbit'])[0].complete, true);
assert.equal(
  getLevels(['lion', 'rabbit']).find((level) => !level.complete).number,
  2,
);
assert.equal(getLevels(['lion', 'lion'])[0].count, 1);
const { lessons } = load('src/data.ts');
assert.ok(
  getLevels(lessons.map((word) => word.id)).every((level) => level.complete),
);
assert.equal(
  getLevels(['duck', 'door'])[1].complete,
  true,
  'Existing nonsequential progress must carry over',
);
console.log('Level progression checks passed.');
