import type { Page } from '@playwright/test';

import { expect } from '@playwright/test';

import { TEST_ID } from '../../apps/mobile/shared/config/test-ids';

export type Account = {
  email: string;
  password: string;
};

export const freshAccount = (): Account => ({
  email: `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@durak.local`,
  password: 'e2e-password-1'
});

export const signUp = async (page: Page, account = freshAccount()): Promise<Account> => {
  await page.goto('/');

  await expect(page.getByTestId(TEST_ID.auth.submit)).toBeVisible();

  await page.getByRole('button', { name: /создать|create/i }).click();

  await page.getByTestId(TEST_ID.auth.email).fill(account.email);
  await page.getByTestId(TEST_ID.auth.password).fill(account.password);
  await page.getByTestId(TEST_ID.auth.submit).click();

  await expect(page.getByTestId(TEST_ID.nav.tab('tables'))).toBeVisible({ timeout: 30_000 });

  return account;
};
