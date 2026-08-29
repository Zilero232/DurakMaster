import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

config();

const { E2E_WEB_URL } = process.env;

if (!E2E_WEB_URL) {
  throw new Error(
    'E2E_WEB_URL is not set — see .env.example locally, or the workflow env block in CI'
  );
}

export default defineConfig({
  testDir: './e2e',
  testIgnore: process.env.E2E_SHOTS ? [] : ['**/screenshots.spec.ts'],
  outputDir: './e2e/.results',

  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,

  timeout: 90_000,
  expect: { timeout: 15_000 },

  reporter: process.env.CI ? [['github'], ['list']] : [['list']],

  webServer: [
    {
      command: 'bun --filter @durak-master/server start',
      url: 'http://localhost:4000/health',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    },
    {
      command: 'bun --filter @durak-master/mobile web',
      url: E2E_WEB_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000
    }
  ],

  use: {
    baseURL: E2E_WEB_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off'
  },

  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        deviceScaleFactor: 1,
        viewport: { width: 1280, height: 800 }
      }
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], deviceScaleFactor: 1, viewport: { width: 412, height: 820 } }
    }
  ]
});
