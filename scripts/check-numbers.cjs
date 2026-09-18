const assert = require('node:assert/strict');
const fs = require('node:fs');
const { load } = require('./load-typescript.cjs');
const { arabicNumbers } = load('src/number-data.ts');
assert.deepEqual(
  arabicNumbers.map((number) => number.value),
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 1000],
);
const manifest = JSON.parse(
  fs.readFileSync('assets/audio/numbers/words.json', 'utf8'),
);
assert.deepEqual(
  manifest,
  Object.fromEntries(
    arabicNumbers.map((number) => [number.value, number.arabic]),
  ),
);
const imports = [
  ...fs
    .readFileSync('src/number-audio.ts', 'utf8')
    .matchAll(/require\(['"]\.\.\/assets\/audio\/numbers\/(\d+)\.mp3['"]\)/g),
].map((match) => Number(match[1]));
assert.deepEqual(
  imports,
  arabicNumbers.map((number) => number.value),
);
for (const number of arabicNumbers) {
  assert.match(number.arabic, /^[\u0600-\u06ff ]+$/);
  const audio = fs.readFileSync(`assets/audio/numbers/${number.value}.mp3`);
  assert.ok(audio.length > 1000, `Missing audio for ${number.value}`);
  assert.ok(
    audio.subarray(0, 3).toString() === 'ID3' ||
      (audio[0] === 0xff && (audio[1] & 0xe0) === 0xe0),
    `Invalid MP3 for ${number.value}`,
  );
}
console.log('Validated all 20 numbers and their bundled Arabic audio.');
