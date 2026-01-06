import { test, expect, Page } from '@playwright/test';

test.describe.serial('Task 2 - Task Management (CRUD) - Happy Paths', () => {
  let title: string;

  async function gotoDashboard(page: Page) {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'My Tasks' })).toBeVisible({ timeout: 15000 });
  }

  test('Create Task: create a task and verify it appears', async ({ page }) => {
    title = `pw-task-${Date.now()}`;
    await gotoDashboard(page);

    // Fill out form
    await page.getByPlaceholder(/groceries/i).fill(title);
    await page.locator('textarea').fill('Task created by Playwright');
    await page.locator('#priority').selectOption('High');
    
    // Click Add Task - We wait for the URL to change (the '?' reload)
    await page.getByRole('button', { name: /Add Task/i }).click();
    
    // Wait for the URL to contain dashboard again after the reload
    await page.waitForURL('**/dashboard*');

    // If it's not visible, do one clean reload (this fixed it for you before)
    if (await page.getByText(title).count() === 0) {
      await page.goto('/dashboard');
    }

    await expect(page.getByText(title)).toBeVisible({ timeout: 15000 });
  });

  test('Edit Task: modify priority only', async ({ page }) => {
    await gotoDashboard(page);
    const card = page.locator('div').filter({ hasText: title }).last();
    
    await card.getByRole('button', { name: /edit/i }).click();
    await page.locator('#edit-priority').selectOption('Low');
    await page.locator('button').filter({ hasText: /save|update/i }).first().click();

    await page.goto('/dashboard');
    await expect(page.locator('div').filter({ hasText: title }).last()).toContainText('Low', { timeout: 10000 });
  });

  test('Mark Complete: toggle status', async ({ page }) => {
    await gotoDashboard(page);
    const card = page.locator('div').filter({ hasText: title }).last();
    await card.getByRole('button', { name: /complete/i }).click();
    
    await page.waitForTimeout(1000); 
    await page.goto('/dashboard');
    await expect(page.locator('div').filter({ hasText: title }).last()).toContainText('Complete');
  });

  test('Delete Task: delete and verify removal', async ({ page }) => {
    await gotoDashboard(page);
    const card = page.locator('div').filter({ hasText: title }).last();
    
    page.once('dialog', d => d.accept());
    await card.getByRole('button', { name: /delete/i }).click();

    await page.goto('/dashboard');
    await expect(page.getByText(title)).toHaveCount(0);
  });
});