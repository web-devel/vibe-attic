import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Maintainer tool only. The delivered foundation needs no build step to play.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'checkpoints/01-baseline.html');
const target = path.join(root, 'foundation/runner.html');
let html = readFileSync(source, 'utf8');

function replaceOnce(before, after) {
  if (html.split(before).length !== 2) throw new Error(`Expected one source marker: ${before}`);
  html = html.replace(before, () => after);
}

const provenance = html.match(/  <!--[\s\S]*?-->/)?.[0];
if (!provenance) throw new Error('Missing checkpoint provenance');
replaceOnce(provenance, `  <!--
  Ready game foundation extracted from checkpoints/01-baseline.html.
  Prepared reference code, not an M1/local-model output or timing result.
  Page, styles, drawings, and baseline rules are supplied together in this file.
  Copy to root index.html before making a participant's requested changes.
  See AGENTS.md for short step guides. Start at EDIT: CONFIG or EDIT: RULES.
  -->`);
replaceOnce('<title>Dino Run — The first run</title>', '<title>Dino Run — Game foundation</title>');
replaceOnce('<span class="stage">The first run</span>', '<span class="stage">Game foundation</span>');
replaceOnce('SAVE POINT 01', 'FOUNDATION');
replaceOnce('  <style>', '  <!-- RESOURCE: STYLES — reuse the supplied layout. -->\n  <style>');
replaceOnce('  <main>', '  <!-- RESOURCE: PAGE — score, canvas, instructions, and restart. -->\n  <main>');
replaceOnce('// EXPERIMENT HERE:', '// EDIT: CONFIG\n// EXPERIMENT HERE:');
replaceOnce("const canvas = document.getElementById('game');", "// EDIT: RULES — state, input, jumping, collisions, score, and restart.\nconst canvas = document.getElementById('game');");
replaceOnce('// DRAWING: pictures', '// END EDIT: RULES\n\n// RESOURCE: DRAWINGS\n// DRAWING: pictures');
replaceOnce('// ONE LOOP:', '// END RESOURCE: DRAWINGS\n\n// RESOURCE: LOOP — restart resets state; it never starts another loop.\n// ONE LOOP:');

const args = process.argv.slice(2);
if (args.length > 1 || (args.length === 1 && args[0] !== '--check')) {
  throw new Error('Usage: node scripts/extract-foundation.mjs [--check]');
}
if (args[0] === '--check') {
  if (readFileSync(target, 'utf8').replace(/\r\n/g, '\n') !== html.replace(/\r\n/g, '\n')) {
    throw new Error('Foundation differs from extraction; review changes before regenerating.');
  }
  console.log('Foundation matches the baseline extraction.');
} else {
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, html, 'utf8');
  console.log('Wrote foundation/runner.html; checkpoints and root index.html were left intact.');
}
