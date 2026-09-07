const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
function load(file) {
  const target = { exports: {} };
  new Function('exports', 'module', ts.transpile(fs.readFileSync(file, 'utf8'), { module: ts.ModuleKind.CommonJS }))(target.exports, target);
  return target.exports;
}
const {sq, translate} = load('src/translations.ts');
const {groups, lessons} = load('src/data.ts');
const placeholders = value => [...value.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
for (const [english, albanian] of Object.entries(sq)) {
  assert.ok(albanian.trim(), `Empty translation: ${english}`);
  assert.deepEqual(placeholders(albanian), placeholders(english), `Mismatched placeholders: ${english}`);
}
for (const word of [...lessons.map(lesson => lesson.english), ...groups.map(group => group.name), 'Orange']) {
  assert.ok(Object.hasOwn(sq, word), `Missing lesson translation: ${word}`);
}
const files=['src/ui.tsx','src/LessonBoard.tsx','app/index.tsx','app/lesson/[id].tsx','app/quiz.tsx','app/progress.tsx','app/coloring.tsx'];
for (const file of files) {
  const source=ts.createSourceFile(file, fs.readFileSync(file,'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  function visit(node) {
    if (ts.isJsxText(node)) assert.ok(!/[A-Za-z]/.test(node.text), `Untranslated visible text in ${file}: ${node.text}`);
    if (ts.isCallExpression(node) && node.expression.getText(source)==='t' && ts.isStringLiteral(node.arguments[0])) {
      assert.ok(Object.hasOwn(sq,node.arguments[0].text),`Missing key in ${file}: ${node.arguments[0].text}`);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}
assert.equal(translate('sq', 'Duck'), 'Rosë');
assert.equal(translate('en', 'Duck'), 'Duck');
assert.equal(translate('sq', 'Hear {word} in Arabic', {word:'Rosë'}), 'Dëgjo fjalën Rosë në arabisht');
assert.equal(translate('en', 'Hear {word} in Arabic', {word:'Duck'}), 'Hear Duck in Arabic');
assert.equal(translate('sq', 'بَطَّة'), 'بَطَّة');
const html=fs.readFileSync('dist/index.html','utf8');
assert.ok(html.includes('lang="sq"'));
assert.ok(html.includes('Aventura me arabishten'));
assert.ok(html.includes('Fillo të mësosh'));
assert.ok(!html.includes('Start learning'));
console.log(`Validated ${Object.keys(sq).length} Albanian translations, placeholders, lesson vocabulary, all screen text, English fallback, Arabic preservation, and default web locale.`);
