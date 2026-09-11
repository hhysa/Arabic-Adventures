// The small Node checks can exercise pure TS modules without a test framework.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function load(file) {
  const target = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const requireRelative = (name) =>
    load(path.join(path.dirname(file), name + '.ts'));
  new Function('exports', 'module', 'require', code)(
    target.exports,
    target,
    requireRelative,
  );
  return target.exports;
}
module.exports = { load };
