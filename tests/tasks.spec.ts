import { test, expect, Page } from '@playwright/test';

test.describe.serial('Task 2 - Task Management (CRUD) - Happy Paths', () => {
  let title: string;

  async function gotoDashboard(page: Page) {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: /My Tasks/i })).toBeVisible({ timeout: 15000 });
  }

  test('Create Task: create a task and verify it appears', async ({ page }) => {
    // 1. Give this specific test 60 seconds to complete
    test.setTimeout(60000); 
    
    title = `pw-task-${Date.now()}`;
    await gotoDashboard(page);

    // 2. Slow down the typing slightly to ensure the backend receives it correctly
    await page.getByPlaceholder(/groceries/i).pressSequentially(title, { delay: 50 });
    await page.locator('textarea').fill('Task created by Playwright');
    await page.locator('#priority').selectOption('High');
    
    // 3. Click and wait for network to settle
    await page.getByRole('button', { name: /Add Task/i }).click();
    await page.waitForLoadState('networkidle').catch(() => {});

    // 4. RETRY LOGIC: Increased timeout to 45s to stay under the 60s test limit
    await expect(async () => {
      const isVisible = await page.getByText(title).isVisible();
      if (!isVisible) {
        await page.goto('/dashboard'); 
      }
      await expect(page.getByText(title)).toBeVisible({ timeout: 5000 });
    }).toPass({
      intervals: [3000, 5000, 5000], 
      timeout: 45000
    });
  });

  test('Edit Task: modify priority only', async ({ page }) => {
    await gotoDashboard(page);
    const card = page.locator('div').filter({ hasText: title }).last();
    
    await card.getByRole('button', { name: /edit/i }).click();
    await page.locator('#edit-priority').selectOption('Low');
    await page.locator('button').filter({ hasText: /save|update/i }).first().click();

    await page.goto('/dashboard');
    await expect(page.locator('div').filter({ hasText: title }).last()).toContainText('Low', { timeout: 15000 });
  });

  test('Mark Complete: toggle status', async ({ page }) => {
    await gotoDashboard(page);
    const card = page.locator('div').filter({ hasText: title }).last();
    await card.getByRole('button', { name: /complete/i }).click();
    
    await page.waitForTimeout(2000); 
    await page.goto('/dashboard');
    await expect(page.locator('div').filter({ hasText: title }).last()).toContainText(/Complete/i, { timeout: 15000 });
  });

  test('Delete Task: delete and verify removal', async ({ page }) => {
    await gotoDashboard(page);
    const card = page.locator('div').filter({ hasText: title }).last();
    
    page.once('dialog', d => d.accept());
    await card.getByRole('button', { name: /delete/i }).click();

    await page.goto('/dashboard');
    await expect(page.getByText(title)).toHaveCount(0, { timeout: 15000 });
  });
});