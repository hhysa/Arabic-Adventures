const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const { load } = require('./load-typescript.cjs');
const { sq, translate } = load('src/translations.ts');
const { groups, lessons } = load('src/data.ts');
const allWords = [...lessons];
const manifest = JSON.parse(fs.readFileSync('assets/audio/words.json', 'utf8'));
assert.deepEqual(
  manifest,
  Object.fromEntries(allWords.map((word) => [word.id, word.arabic])),
  'Run npm run audio:sync after changing vocabulary',
);
const importedAudio = [
  ...fs
    .readFileSync('src/audio.ts', 'utf8')
    .matchAll(/require\(['"]\.\.\/assets\/audio\/([^'"/]+)\.wav['"]\)/g),
]
  .map((match) => match[1])
  .sort();
assert.deepEqual(
  importedAudio,
  allWords.map((word) => word.id).sort(),
  'Audio imports must match the catalog',
);
assert.equal(
  groups.map((g) => g.letter).join(''),
  'أبتثجحخدذرزسشصضطظعغفقكلمنهوي',
);
assert.equal(groups.length, 28);
assert.equal(lessons.length, 56);
assert.equal(new Set(lessons.map((l) => l.id)).size, 56);
for (const lesson of lessons) {
  assert.equal(
    lesson.arabic[0],
    groups[lesson.group].letter,
    `Wrong initial: ${lesson.id}`,
  );
  assert.ok(
    fs.statSync(`assets/audio/${lesson.id}.wav`).size > 1000,
    `Missing audio: ${lesson.id}`,
  );
}
assert.ok(fs.statSync('assets/audio/orange.wav').size > 1000);
for (const id of [
  'lion',
  'rabbit',
  'duck',
  'orange',
  'apple',
  'dates',
  'fish',
  'car',
  'moon',
  'pencil',
])
  assert.ok(
    lessons.some((l) => l.id === id),
    'Existing progress ID changed',
  );
const { makeQuiz } = load('src/quiz.ts');
let seed = 17;
const random = () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};
const covered = new Set();
for (let i = 0; i < 100; i++) {
  const questions = makeQuiz(random);
  assert.equal(questions.length, 10);
  assert.equal(questions.filter((q) => q.kind === 'letter').length, 5);
  assert.equal(questions.filter((q) => q.kind === 'image').length, 5);
  assert.equal(new Set(questions.map((q) => q.word.group)).size, 10);
  for (const q of questions) {
    assert.equal(new Set(q.options).size, 4);
    assert.ok(q.options.includes(q.correctOption));
    if (q.kind === 'image') {
      assert.equal(lessons[q.correctOption].id, q.word.id);
      for (const option of q.options) {
        assert.ok(lessons[option]);
        if (option !== q.correctOption) {
          assert.notEqual(lessons[option].emoji, q.word.emoji);
          assert.notEqual(lessons[option].arabic, q.word.arabic);
        }
      }
    } else {
      assert.equal(q.correctOption, q.word.group);
    }
    covered.add(q.word.group);
  }
}
assert.equal(covered.size, 28, 'Quiz must cover the entire alphabet');
const placeholders = (value) =>
  [...value.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
for (const [english, albanian] of Object.entries(sq)) {
  assert.ok(albanian.trim(), `Empty translation: ${english}`);
  assert.deepEqual(
    placeholders(albanian),
    placeholders(english),
    `Mismatched placeholders: ${english}`,
  );
}
for (const word of [
  ...lessons.map((lesson) => lesson.english),
  ...groups.map((group) => group.name),
  'Orange',
]) {
  assert.ok(Object.hasOwn(sq, word), `Missing lesson translation: ${word}`);
}
const files = [
  'src/ui.tsx',
  'src/LanguageSwitcher.tsx',
  'src/LessonBoard.tsx',
  'app/index.tsx',
  'app/levels.tsx',
  'app/lesson/[id].tsx',
  'app/quiz.tsx',
  'app/progress.tsx',
  'app/coloring.tsx',
];
for (const file of files) {
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  function visit(node) {
    if (ts.isJsxText(node))
      assert.ok(
        !/[A-Za-z]/.test(node.text),
        `Untranslated visible text in ${file}: ${node.text}`,
      );
    if (
      ts.isCallExpression(node) &&
      node.expression.getText(source) === 't' &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      assert.ok(
        Object.hasOwn(sq, node.arguments[0].text),
        `Missing key in ${file}: ${node.arguments[0].text}`,
      );
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}
assert.equal(translate('sq', 'Duck'), 'Rosë');
assert.equal(translate('en', 'Duck'), 'Duck');
assert.equal(
  translate('sq', 'Hear {word} in Arabic', { word: 'Rosë' }),
  'Dëgjo fjalën Rosë në arabisht',
);
assert.equal(
  translate('en', 'Hear {word} in Arabic', { word: 'Duck' }),
  'Hear Duck in Arabic',
);
assert.equal(translate('sq', 'بَطَّة'), 'بَطَّة');
if (process.argv.includes('--export')) {
  const html = fs.readFileSync('dist/index.html', 'utf8');
  assert.ok(html.includes('lang="sq"'));
  assert.ok(html.includes('Aventura me arabishten'));
  assert.ok(html.includes('Le të luajmë!'));
  assert.ok(!html.includes('Start learning'));
}
console.log(
  `Validated ${Object.keys(sq).length} Albanian translations, placeholders, lesson vocabulary, all screen text, English fallback, Arabic preservation, and default web locale.`,
);
