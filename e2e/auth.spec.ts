import { expect, test } from '@playwright/test';

import { TEST_ID } from '../apps/mobile/shared/config/test-ids';

test.describe('sign-in screen', () => {
  test('shows the auth form to a signed-out visitor', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId(TEST_ID.auth.submit)).toBeVisible();
  });

  test('keeps the card within a readable width on a wide screen', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'width rule only applies to desktop');

    await page.goto('/');

    const submit = page.getByTestId(TEST_ID.auth.submit);

    await expect(submit).toBeVisible();

    const box = await submit.boundingBox();

    expect(box).not.toBeNull();
    expect(box?.width ?? 0).toBeLessThan(560);
  });

  test('switches the interface language and keeps it after a reload', async ({ page }) => {
    await page.goto('/');

    const language = page.getByRole('button', { name: /язык|language/i });

    await expect(language).toBeVisible();

    const before = await language.textContent();

    await language.click();

    await expect(language).not.toHaveText(before ?? '');

    const after = await language.textContent();

    await page.reload();

    await expect(page.getByRole('button', { name: /язык|language/i })).toHaveText(after ?? '');
  });
});
