import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    ignores: [
      '**/node_modules/**',
      './apps/mobile/.expo/**',
      './apps/mobile/android/**',
      './apps/mobile/ios/**',
      './apps/mobile/assets/**'
    ]
  },
  {
    files: ['./apps/mobile/**'],
    rules: {
      // Shared holds segments rather than slices here, and segments are imported
      // by path on purpose: `@/shared/lib/cards`, not one barrel over everything.
      // See docs/fsd.md §1.
      'fsd/no-public-api-sidestep': 'off',
      // A slice used by a single consumer is still the right home for it: the
      // rule optimises for reuse, the layer boundary is what we want to keep.
      'fsd/insignificant-slice': 'off',
      // `durak-table`, `kozel-table` name the game they draw, and the repetition
      // is the point.
      'fsd/repetitive-naming': 'off',
      // The app layer is Expo Router's routes directory: file names there are the
      // URL contract, not ours to rename.
      'fsd/no-reserved-folder-names': 'off',
      // "settings" is the established name for the slice and reads wrong singular.
      'fsd/inconsistent-naming': 'off'
    }
  }
]);
