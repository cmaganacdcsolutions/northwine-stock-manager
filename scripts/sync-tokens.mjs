// Copies ../brand/tokens.css (published by senior-uiux-design) into
// src/styles/tokens.css. Safe to run repeatedly; no-ops with a warning
// if the brand file does not exist yet (placeholders stay in place).
import { copyFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const source = path.resolve(__dirname, '..', '..', 'brand', 'tokens.css');
const dest = path.resolve(__dirname, '..', 'src', 'styles', 'tokens.css');

if (!existsSync(source)) {
  console.warn(
    `[sync:tokens] No se encontró ${source}. Se mantienen los placeholders en src/styles/tokens.css.`,
  );
  process.exit(0);
}

copyFileSync(source, dest);
console.log(`[sync:tokens] Copiado ${source} -> ${dest}`);
