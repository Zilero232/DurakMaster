import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Сверка файлов переводов.
 *
 * Расхождение ключей не ловится ни типами, ни сборкой: `useTranslations`
 * типизирован по русскому файлу, поэтому недостающий английский ключ
 * молча превращается в сырой идентификатор на экране.
 */

const workspace = join(dirname(fileURLToPath(import.meta.url)), '..');
const localesDir = join(workspace, 'apps', 'client', 'shared', 'i18n', 'locales');

const read = (locale) => JSON.parse(readFileSync(join(localesDir, `${locale}.json`), 'utf8'));

const flatten = (value, prefix = '') => {
  if (value === null || typeof value !== 'object') {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, child]) =>
    flatten(child, prefix ? `${prefix}.${key}` : key),
  );
};

const ru = new Set(flatten(read('ru')));
const en = new Set(flatten(read('en')));

const missingInEn = [...ru].filter((key) => !en.has(key));
const missingInRu = [...en].filter((key) => !ru.has(key));

if (missingInEn.length === 0 && missingInRu.length === 0) {
  // biome-ignore lint/suspicious/noConsole: вывод — назначение CLI-скрипта
  console.log(`locales: ключи совпадают (${ru.size})`);
  process.exit(0);
}

if (missingInEn.length > 0) {
  console.error(`Нет в en.json (${missingInEn.length}):\n  ${missingInEn.join('\n  ')}`);
}

if (missingInRu.length > 0) {
  console.error(`Нет в ru.json (${missingInRu.length}):\n  ${missingInRu.join('\n  ')}`);
}

process.exit(1);
