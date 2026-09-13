import { test } from '@playwright/test';

import { TEST_ID } from '../../apps/mobile/shared/config/test-ids';

test('inspect the wallet amount', async ({ page }) => {
  test.slow();

  await page.goto('/');
  await page.waitForTimeout(2_000);

  await page.getByRole('button', { name: /создать|create/i }).click();
  await page.getByTestId(TEST_ID.auth.email).fill(`wallet-${Date.now()}@durak.local`);
  await page.getByTestId(TEST_ID.auth.password).fill('wallet-password-1');
  await page.getByTestId(TEST_ID.auth.submit).click();

  await page.getByTestId(TEST_ID.nav.tab('tables')).waitFor({ timeout: 30_000 });
  await page.waitForTimeout(2_000);

  const inputs = await page.evaluate(() => {
    return [...document.querySelectorAll('input')].map((n) => {
      const box = n.getBoundingClientRect();

      return { value: n.value, w: Math.round(box.width), h: Math.round(box.height) };
    });
  });

  console.log('INPUTS', JSON.stringify(inputs));
});
