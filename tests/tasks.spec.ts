import { test, expect } from '@playwright/test';

test('Task Management (CRUD) – Happy Path', async ({ page }) => {
  const title = `pw-task-${Date.now()}`;

  // Go to dashboard
  await page.goto('/dashboard');
  await expect(
    page.getByRole('heading', { name: /my tasks/i })
  ).toBeVisible({ timeout: 15000 });

  // ====================
  // CREATE
  // ====================
  await page.getByPlaceholder(/groceries/i).fill(title);
  await page.locator('textarea').fill('Task created by Playwright');
  await page.locator('#priority').selectOption('High');

  await page.getByRole('button', { name: /add task/i }).click();

  // UI does NOT auto-refresh
  await page.reload();

  await expect(page.getByText(title)).toBeVisible({ timeout: 15000 });

  // ====================
  // EDIT
  // ====================
  await page.getByRole('button', { name: /edit/i }).first().click();

  const dropdown = page
    .locator('#edit-priority, select[name*="priority"]')
    .first();

  await expect(dropdown).toBeVisible();
  await dropdown.selectOption('Low');
  await page.keyboard.press('Enter');

  await page.reload();
  await expect(page.getByText(title)).toBeVisible();

  // ====================
  // COMPLETE
  // ====================
  await page.getByRole('button', { name: /complete/i }).first().click();

  await page.reload();
  await expect(page.getByText(title)).toBeVisible();

  // ====================
  // DELETE
  // ====================
  page.once('dialog', d => d.accept());

  await page.getByRole('button', { name: /delete/i }).first().click();

  await page.reload();
  await expect(page.getByText(title)).toHaveCount(0);
});
