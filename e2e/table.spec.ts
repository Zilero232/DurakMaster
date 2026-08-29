import { expect, test } from '@playwright/test';

import { TEST_ID } from '../apps/mobile/shared/config/test-ids';
import { signUp } from './support/sign-in';

const MAX_BOTS = 5;

const createTable = async (page: import('@playwright/test').Page) => {
  await page.getByTestId(TEST_ID.nav.tab('create')).click();
  await page.getByTestId(TEST_ID.lobby.createSubmit).click();

  await expect(page.getByTestId(TEST_ID.table.ready)).toBeVisible({ timeout: 30_000 });
};

test.describe('table', () => {
  test('creates a table and shows the ready button', async ({ page }) => {
    await signUp(page);
    await createTable(page);

    await expect(page.getByTestId(TEST_ID.table.addBot)).toBeVisible();
  });

  test('toggles ready without starting a game alone', async ({ page }) => {
    await signUp(page);
    await createTable(page);

    const ready = page.getByTestId(TEST_ID.table.ready);

    await ready.click();

    await expect(ready).toBeVisible();
  });

  test('fills the table with bots and deals a hand', async ({ page }) => {
    await signUp(page);
    await createTable(page);

    const addBot = page.getByTestId(TEST_ID.table.addBot);

    await expect(addBot, 'bots are a development-build affordance').toBeVisible();

    for (let seat = 0; seat < MAX_BOTS; seat += 1) {
      if ((await addBot.count()) === 0) {
        break;
      }

      await addBot.click({ timeout: 5_000 }).catch(() => undefined);
    }

    await page.getByTestId(TEST_ID.table.ready).click();

    await expect(page.getByTestId(TEST_ID.table.ready)).toBeHidden({ timeout: 30_000 });
  });
});
