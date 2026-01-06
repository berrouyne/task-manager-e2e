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

  // Reload to fetch list
  await page.reload();

  const task = page.getByText(title);

  // 🔑 FIX: scroll into view BEFORE asserting
  await task.scrollIntoViewIfNeeded();
  await expect(task).toBeVisible({ timeout: 15000 });

  // ====================
  // EDIT
  // ====================
  await task.locator('..').getByRole('button', { name: /edit/i }).click();
  const dropdown = page.locator('#edit-priority, select[name*="priority"]').first();
  await dropdown.selectOption('Low');
  await page.keyboard.press('Enter');

  await page.reload();
  await task.scrollIntoViewIfNeeded();
  await expect(task).toBeVisible();

  // ====================
  // COMPLETE
  // ====================
  await task.locator('..').getByRole('button', { name: /complete/i }).click();
  await page.reload();
  await task.scrollIntoViewIfNeeded();
  await expect(task).toBeVisible();

  // ====================
  // DELETE
  // ====================
  page.once('dialog', d => d.accept());
  await task.locator('..').getByRole('button', { name: /delete/i }).click();

  await page.reload();
  await expect(page.getByText(title)).toHaveCount(0);
});
