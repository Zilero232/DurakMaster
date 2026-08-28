import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'packages/*/vitest.config.ts',
      'apps/server/vitest.config.ts',
      'apps/mobile/vitest.config.mts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['packages/game-core/src/**', 'apps/server/src/**']
    }
  }
});
