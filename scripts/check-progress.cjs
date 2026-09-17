const assert = require('node:assert/strict');
const { load } = require('./load-typescript.cjs');
const {
  emptyProgress,
  completeLesson,
  rewardQuiz,
  totalStars,
  parseProgress,
  streak,
  localDay,
} = load('src/progress-model.ts');
const now = new Date(2026, 8, 11, 12);
assert.deepEqual(
  parseProgress(
    JSON.stringify({ completed: ['envelope', 'fingernail', 'back', 'zaby'] }),
  ).completed,
  ['envelope', 'zaby'],
  'Replacing fingernail and back preserves completion without duplicate rewards',
);
assert.deepEqual(
  parseProgress(JSON.stringify({ completed: ['duck', 'door', 'orange'] }))
    .completed,
  ['duck', 'orange'],
  'Replacing door preserves completion without duplicate rewards',
);
const today = localDay(now),
  yesterday = localDay(new Date(2026, 8, 10, 12));
let progress = completeLesson(emptyProgress, 'duck', today);
progress = completeLesson(progress, 'duck', today);
assert.equal(
  totalStars(progress),
  3,
  'Repeated completion must not award extra stars',
);
assert.deepEqual(progress.days, [today]);
progress = rewardQuiz(progress, today);
assert.equal(totalStars(progress), 4);
assert.deepEqual(
  parseProgress(JSON.stringify(progress)),
  progress,
  'Existing storage records retain their shape',
);
assert.deepEqual(
  parseProgress(
    JSON.stringify({ ...progress, completed: ['duck', 'removed-word'] }),
  ).completed,
  ['duck'],
);
assert.deepEqual(
  emptyProgress,
  { completed: [], days: [], quizStars: 0 },
  'Updates must not mutate shared state',
);
assert.equal(streak([yesterday, today], now), 2);
assert.equal(streak([yesterday], now), 1);
assert.equal(streak([], now), 0);
assert.deepEqual(
  now,
  new Date(2026, 8, 11, 12),
  'Streak calculation must not mutate its date input',
);
console.log(
  'Progress checks passed: rewards, repeat completion, storage compatibility, immutable updates, and streaks.',
);
