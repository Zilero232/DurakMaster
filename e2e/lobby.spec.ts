import { expect, test } from '@playwright/test';

import { TEST_ID } from '../apps/mobile/shared/config/test-ids';
import { signUp } from './support/sign-in';

test.describe('lobby', () => {
  test('lands on the profile tab after signing up', async ({ page }) => {
    await signUp(page);

    await expect(page.getByTestId(TEST_ID.nav.tab('profile'))).toBeVisible();
    await expect(page.getByTestId(TEST_ID.nav.tab('create'))).toBeVisible();
  });

  test('moves between the tabs', async ({ page }) => {
    await signUp(page);

    await page.getByTestId(TEST_ID.nav.tab('create')).click();

    await expect(page.getByTestId(TEST_ID.lobby.createSubmit)).toBeVisible();

    await page.getByTestId(TEST_ID.nav.tab('tables')).click();

    await expect(page.getByTestId(TEST_ID.lobby.createSubmit)).toBeHidden();
  });

  test('keeps the language switch reachable while signed in', async ({ page }) => {
    await signUp(page);

    await expect(page.getByRole('button', { name: /язык|language/i })).toBeVisible();
  });
});
