import { test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

import { TEST_ID } from '../apps/mobile/shared/config/test-ids';

const OUT_DIR = join('e2e', '.shots');

const account = () => ({
  email: `shot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@durak.local`,
  password: 'shot-password-1'
});

test('walk through every screen and save a shot of each', async ({ page }, testInfo) => {
  test.slow();

  await mkdir(OUT_DIR, { recursive: true });

  const name = testInfo.project.name;

  const viewport = page.viewportSize() ?? { width: 1280, height: 800 };

  const shoot = (label: string) =>
    page.screenshot({
      path: join(OUT_DIR, `${name}-${label}.png`),
      fullPage: false,
      clip: { x: 0, y: 0, width: viewport.width, height: viewport.height }
    });

  const { email, password } = account();

  await page.goto('/');
  await page.waitForTimeout(2_000);
  await shoot('1-auth');

  await page.getByRole('button', { name: /создать|create/i }).click();
  await page.getByTestId(TEST_ID.auth.email).fill(email);
  await page.getByTestId(TEST_ID.auth.password).fill(password);
  await page.getByTestId(TEST_ID.auth.submit).click();

  await page.getByTestId(TEST_ID.nav.tab('tables')).waitFor({ timeout: 30_000 });
  await page.waitForTimeout(1_500);
  await shoot('2-profile');

  await page.getByTestId(TEST_ID.nav.tab('tables')).click();
  await page.waitForTimeout(800);
  await shoot('3-lobby');

  await page.getByTestId(TEST_ID.nav.tab('create')).click();
  await page.waitForTimeout(800);
  await shoot('4-create');

  await page.getByTestId(TEST_ID.lobby.createSubmit).click();
  await page.getByTestId(TEST_ID.table.ready).waitFor({ timeout: 30_000 });
  await page.waitForTimeout(1_000);
  await shoot('5-table-waiting');

  const addBot = page.getByTestId(TEST_ID.table.addBot);

  while (await addBot.isVisible().catch(() => false)) {
    await addBot.click();
    await page.waitForTimeout(300);
  }

  await page.getByTestId(TEST_ID.table.ready).click();
  await page.waitForTimeout(6_000);
  await shoot('6-table-playing');
});
