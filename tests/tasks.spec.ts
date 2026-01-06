import { test, expect, Page } from '@playwright/test';

test.describe.serial('Task 2 - Task Management (CRUD) - Happy Paths', () => {
  let title: string;

  async function gotoDashboard(page: Page) {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: /My Tasks/i })).toBeVisible({ timeout: 15000 });
  }

  test('Create Task: create a task and verify it appears', async ({ page }) => {
    title = `pw-task-${Date.now()}`;
    await gotoDashboard(page);

    await page.getByPlaceholder(/groceries/i).fill(title);
    await page.locator('textarea').fill('Task created by Playwright');
    await page.locator('#priority').selectOption('High');
    
    // 1. We wait for ANY network activity to finish after clicking
    // This is better than a blind reload.
    await Promise.all([
        page.waitForLoadState('networkidle'), 
        page.getByRole('button', { name: /Add Task/i }).click()
    ]);

    // 2. If it's not there, the app might need a clean reload (Koyeb lag)
    const task = page.getByText(title);
    if (await task.count() === 0) {
        await page.waitForTimeout(2000); // Small pause for the DB to catch up
        await page.goto('/dashboard');
    }

    // 3. Final check with a long timeout
    await expect(page.getByText(title)).toBeVisible({ timeout: 15000 });
  });

  test('Edit Task: modify priority only', async ({ page }) => {
    await gotoDashboard(page);
    const card = page.locator('div').filter({ hasText: title }).last();
    
    await card.getByRole('button', { name: /edit/i }).click();
    await page.locator('#edit-priority').selectOption('Low');
    
    await Promise.all([
        page.waitForLoadState('networkidle'),
        page.locator('button').filter({ hasText: /save|update/i }).first().click()
    ]);

    await page.goto('/dashboard');
    await expect(page.locator('div').filter({ hasText: title }).last()).toContainText('Low', { timeout: 10000 });
  });

  test('Mark Complete: toggle status', async ({ page }) => {
    await gotoDashboard(page);
    const card = page.locator('div').filter({ hasText: title }).last();
    
    await card.getByRole('button', { name: /complete/i }).click();
    await page.waitForLoadState('networkidle');
    
    await page.goto('/dashboard');
    await expect(page.locator('div').filter({ hasText: title }).last()).toContainText(/Complete/i);
  });

  test('Delete Task: delete and verify removal', async ({ page }) => {
    await gotoDashboard(page);
    const card = page.locator('div').filter({ hasText: title }).last();
    
    page.once('dialog', d => d.accept());
    await card.getByRole('button', { name: /delete/i }).click();
    await page.waitForLoadState('networkidle');

    await page.goto('/dashboard');
    await expect(page.getByText(title)).toHaveCount(0, { timeout: 10000 });
  });
});