import { test, expect } from '@playwright/test';

test('Task Management (CRUD) – Happy Path', async ({ page }) => {
  const title = `pw-task-${Date.now()}`;
  console.log(`🚀 Starting test for task: ${title}`);

  // --------------------
  // DASHBOARD
  // --------------------
  await page.goto('/dashboard');
  await expect(
    page.getByRole('heading', { name: /my tasks/i })
  ).toBeVisible({ timeout: 20000 });

  // --------------------
  // CREATE
  // --------------------
  await page.getByPlaceholder(/groceries/i).fill(title);
  await page.locator('textarea').fill('Task created by Playwright');
  await page.locator('#priority').selectOption('High');
  await page.getByRole('button', { name: /add task/i }).click();

  // 🔑 Wait until backend persisted task
  await expect(async () => {
    await page.goto('/dashboard');
    const task = page.getByText(title);
    await expect(task).toHaveCount(1);
  }).toPass({ timeout: 30000, intervals: [3000] });

  // 🔑 Now safe to scroll & assert
  let task = page.getByText(title);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(task).toBeVisible({ timeout: 10000 });

  // --------------------
  // EDIT
  // --------------------
  await task.locator('xpath=ancestor::*[self::div or self::li]')
    .getByRole('button', { name: /edit/i })
    .click();

  const dropdown = page.locator('#edit-priority, select[name*="priority"]').first();
  await dropdown.selectOption('Low');
  await page.keyboard.press('Enter');

  await expect(async () => {
    await page.goto('/dashboard');
    task = page.getByText(title);
    await expect(task).toBeVisible();
  }).toPass({ timeout: 20000 });

  // --------------------
  // COMPLETE
  // --------------------
  await task.locator('xpath=ancestor::*[self::div or self::li]')
    .getByRole('button', { name: /complete/i })
    .click();

  await expect(async () => {
    await page.goto('/dashboard');
    task = page.getByText(title);
    await expect(task).toBeVisible();
  }).toPass({ timeout: 20000 });

  // --------------------
  // DELETE
  // --------------------
  page.once('dialog', d => d.accept());
  await task.locator('xpath=ancestor::*[self::div or self::li]')
    .getByRole('button', { name: /delete/i })
    .click();

  await expect(async () => {
    await page.goto('/dashboard');
    await expect(page.getByText(title)).toHaveCount(0);
  }).toPass({ timeout: 20000 });
});
