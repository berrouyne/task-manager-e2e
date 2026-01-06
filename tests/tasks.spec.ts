import { test, expect, Page } from '@playwright/test';

test.describe.serial('Task 2 - Task Management (CRUD) - Happy Paths', () => {
  let title: string;

  async function gotoDashboard(page: Page) {
    await page.goto('/dashboard');
    // Ensure page is ready
    await expect(page.getByRole('heading', { name: /My Tasks/i })).toBeVisible({ timeout: 15000 });
  }

  function getTaskCard(page: Page, taskTitle: string) {
    // Scopes to a div that contains our specific title
    return page.locator('div').filter({ hasText: taskTitle }).last();
  }

  test('Create Task: create a task and verify it appears', async ({ page }) => {
    title = `pw-task-${Date.now()}`;
    await gotoDashboard(page);

    // 1. Fill and Click
    await page.getByPlaceholder(/groceries/i).fill(title);
    await page.locator('textarea').fill('Task created by Playwright');
    await page.locator('#priority').selectOption('High');
    
    // We wait for the network to settle after clicking
    await Promise.all([
      page.waitForLoadState('networkidle'),
      page.getByRole('button', { name: /Add Task/i }).click()
    ]);

    // 2. THE ULTIMATE FIX: Increased retries with a small pause
    // Cloud DBs can be slow. We give it 30 seconds total to show up.
    await expect(async () => {
      const isVisible = await page.getByText(title).isVisible();
      if (!isVisible) {
        await page.goto('/dashboard'); // Hard refresh to pull fresh data
      }
      await expect(page.getByText(title)).toBeVisible();
    }).toPass({
      intervals: [2000, 5000, 5000], // Wait 2s, then 5s, then 5s between retries
      timeout: 30000
    });
  });

  test('Edit Task: modify priority only', async ({ page }) => {
    await gotoDashboard(page);
    const card = getTaskCard(page, title);
    
    await card.getByRole('button', { name: /edit/i }).click();
    const dropdown = page.locator('#edit-priority, select[name*="priority"]').last();
    await expect(dropdown).toBeVisible();
    
    await dropdown.selectOption('Low');
    await page.locator('button').filter({ hasText: /save|update/i }).first().click();

    // Verify after a fresh load
    await page.goto('/dashboard');
    await expect(getTaskCard(page, title)).toContainText('Low', { timeout: 15000 });
  });

  test('Mark Complete: toggle status', async ({ page }) => {
    await gotoDashboard(page);
    const card = getTaskCard(page, title);
    await card.getByRole('button', { name: /complete/i }).click();
    
    // Wait for DB write then refresh
    await page.waitForTimeout(2000); 
    await page.goto('/dashboard');
    await expect(getTaskCard(page, title)).toContainText(/Complete/i, { timeout: 15000 });
  });

  test('Delete Task: delete and verify removal', async ({ page }) => {
    await gotoDashboard(page);
    const card = getTaskCard(page, title);
    
    page.once('dialog', d => d.accept());
    await card.getByRole('button', { name: /delete/i }).click();

    // Verify gone after refresh
    await page.goto('/dashboard');
    await expect(page.getByText(title)).toHaveCount(0, { timeout: 15000 });
  });
});