import { eslint } from '@siberiacancode/eslint';

export default eslint(
  {
    typescript: true,
    react: true,
    jsxA11y: true,
    ignores: [
      '**/node_modules',
      '**/dist',
      '**/generated',
      '**/.expo',
      '**/expo-env.d.ts',
      // Нативные проекты создаёт `expo prebuild` — их содержимое не наше.
      'apps/mobile/android',
      'apps/mobile/ios',
      'apps/mobile/assets',
      'apps/server/prisma/migrations',
      // i18next расширяет собственный модуль, а слить можно только interface.
      'apps/mobile/shared/i18n/i18next.d.ts',
      'docs/**',
      '**/*.md/**'
    ]
  },

  // Общий конфиг применяет эти правила ко всем языкам, которые разбирает,
  // и на JSON/YAML они падают («rules do not support the language jsonc»).
  // Без этого блока eslint вообще не стартует.
  {
    name: 'durak/data-files',
    files: ['**/*.json', '**/*.json5', '**/*.jsonc', '**/*.yaml', '**/*.yml', '**/*.toml'],
    rules: {
      'arrow-body-style': 'off',
      'import/newline-after-import': 'off',
      'no-console': 'off',
      'prefer-template': 'off',
      'unicorn/no-typeof-undefined': 'off',
      'unicorn/no-useless-spread': 'off'
    }
  },

  {
    name: 'durak/typescript',
    files: ['**/*.?([cm])[jt]s?(x)'],
    rules: {
      // `type` везде, никогда `interface` — см. docs/style.md.
      'ts/consistent-type-definitions': ['error', 'type'],
      // В пресете обе выключены. `any` сносит проверку типов там, где она
      // нужнее всего, а `!` глушит единственное предупреждение о null.
      'ts/no-explicit-any': 'error',
      'ts/no-non-null-assertion': 'warn',
      // Adding a second statement to a branch should not require rewriting it.
      curly: ['error', 'all'],
      // Bun и Node дают их глобально; правило требует require(),
      // которому в ESM-воркспейсе не место.
      'node/prefer-global/buffer': 'off',
      'node/prefer-global/process': 'off'
    }
  },

  // Сортировка ключей манифестов — пустой шум, ломающий привычный порядок полей.
  {
    name: 'durak/manifests',
    files: ['**/package.json', '**/tsconfig*.json'],
    rules: {
      'jsonc/sort-keys': 'off'
    }
  },

  {
    name: 'durak/server',
    files: ['apps/server/**'],
    rules: {
      // Nest достаёт зависимости из метаданных декораторов, а `import type`
      // их стирает — приложение падает с «Nest can't resolve».
      'ts/consistent-type-imports': 'off',
      // main.ts — ESM-точка входа, Bun запускает её напрямую.
      'antfu/no-top-level-await': 'off',
      // `useFactory` — провайдер Nest, а не React-хук.
      'react/no-unnecessary-use-prefix': 'off'
    }
  },

  // Консоль — это канал вывода CLI-скрипта, а не забытая отладка.
  {
    name: 'durak/scripts',
    files: ['**/scripts/**'],
    rules: {
      'no-console': 'off'
    }
  },

  // Metro связывает ассет с бандлом только по статическому `require` с
  // литеральным путём — `import` там не работает, обойти правило нечем.
  {
    name: 'durak/assets',
    files: ['apps/mobile/shared/lib/sound/sound-assets.ts'],
    rules: {
      'ts/no-require-imports': 'off'
    }
  }
);
