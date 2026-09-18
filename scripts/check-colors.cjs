const assert = require('node:assert/strict');
const { load } = require('./load-typescript.cjs');
const { arabicColors } = load('src/color-data.ts');
const { makeColorQuiz } = load('src/color-quiz.ts');
assert.equal(arabicColors.length, 30);
for (const key of ['id', 'arabic', 'hex']) {
  assert.equal(new Set(arabicColors.map((color) => color[key])).size, 30);
}
for (const color of arabicColors) {
  assert.match(color.hex, /^#[0-9A-F]{6}$/i);
  assert.match(color.arabic, /[\u0621-\u064A]/);
  assert.ok(color.say.trim());
}
let seed = 41;
const random = () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};
const covered = new Set();
for (let round = 0; round < 100; round++) {
  const questions = makeColorQuiz(random);
  assert.equal(questions.length, 10);
  assert.equal(new Set(questions.map((q) => q.color.id)).size, 10);
  for (const question of questions) {
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((color) => color.id)).size, 4);
    assert.equal(
      question.options.filter((color) => color.id === question.color.id).length,
      1,
    );
    covered.add(question.color.id);
  }
}
assert.equal(covered.size, 30);
console.log('Validated 30 colors and randomized matching practice.');
