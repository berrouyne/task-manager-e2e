import { test, expect, Page } from '@playwright/test';

test.describe.serial('Task 2 - Task Management (CRUD) - Happy Paths', () => {
  let title: string;

  async function gotoDashboard(page: Page) {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'My Tasks' })).toBeVisible({ timeout: 15000 });
  }

  // Helper to find the card or wait for it to exist
  function getTaskCard(page: Page, taskTitle: string) {
    return page.locator('.task-card, .border, div').filter({ hasText: taskTitle }).last();
  }

  test('Create Task: create a task and verify it appears', async ({ page }) => {
    title = `pw-task-${Date.now()}`;
    await gotoDashboard(page);

    // Fill out the form
    await page.getByPlaceholder(/groceries/i).fill(title);
    await page.locator('textarea').fill('Task created by Playwright');
    await page.locator('#priority').selectOption('High');
    
    // Click Add Task
    await page.getByRole('button', { name: /Add Task/i }).click();

    // RETRY LOGIC: The server might be slow. 
    // We will wait, then reload up to 3 times if the task isn't there.
    let passed = false;
    for (let i = 0; i < 3; i++) {
      try {
        await expect(page.getByText(title)).toBeVisible({ timeout: 5000 });
        passed = true;
        break;
      } catch (e) {
        await page.goto('/dashboard'); // Clean reload without the '?'
      }
    }
    
    if (!passed) {
      throw new Error(`Task "${title}" did not appear after creation and 3 reloads.`);
    }
  });

  test('Edit Task: modify priority only', async ({ page }) => {
    await gotoDashboard(page);
    const card = getTaskCard(page, title);
    
    await card.getByRole('button', { name: /edit/i }).click();
    const dropdown = page.locator('#edit-priority, select[name*="priority"]').last();
    await expect(dropdown).toBeVisible();
    
    await dropdown.selectOption('Low');
    await page.locator('button').filter({ hasText: /save|update/i }).click();

    // Verify change with a reload if necessary
    await page.goto('/dashboard');
    await expect(getTaskCard(page, title)).toContainText('Low', { timeout: 10000 });
  });

  test('Mark Complete: toggle status', async ({ page }) => {
    await gotoDashboard(page);
    const card = getTaskCard(page, title);
    
    await card.getByRole('button', { name: /complete/i }).click();
    
    // Allow for a reload if the UI doesn't update via AJAX
    await page.waitForTimeout(1000); 
    await page.goto('/dashboard');
    await expect(getTaskCard(page, title)).toContainText('Complete');
  });

  test('Delete Task: delete and verify removal', async ({ page }) => {
    await gotoDashboard(page);
    const card = getTaskCard(page, title);
    
    page.once('dialog', d => d.accept());
    await card.getByRole('button', { name: /delete/i }).click();

    // Verify removal
    await page.goto('/dashboard');
    await expect(page.getByText(title)).toHaveCount(0);
  });
});