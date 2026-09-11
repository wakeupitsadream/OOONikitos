import { pathToFileURL } from 'node:url';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const EXTENSIONS = ['.ts', '.tsx', '.mjs', '.js'];

/** Достраивает расширение и index-файл, как это делает сборщик. */
function resolveFile(basePath) {
  if (existsSync(basePath) && statSync(basePath).isFile()) return basePath;
  for (const ext of EXTENSIONS) {
    const withExt = `${basePath}${ext}`;
    if (existsSync(withExt)) return withExt;
  }
  for (const ext of EXTENSIONS) {
    const asIndex = path.join(basePath, `index${ext}`);
    if (existsSync(asIndex)) return asIndex;
  }
  return null;
}

/** Разрешает алиас @/* из tsconfig для node --test. */
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const file = resolveFile(path.join(ROOT, specifier.slice(2)));
    if (file) return nextResolve(pathToFileURL(file).href, context);
  }
  return nextResolve(specifier, context);
}
