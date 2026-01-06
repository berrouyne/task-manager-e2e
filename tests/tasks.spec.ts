import { test, expect, Page } from '@playwright/test';

test.describe.serial('Task 2 - Task Management (CRUD) - Happy Paths', () => {
  let title: string;

  async function gotoDashboard(page: Page) {
    await page.goto('/dashboard');
    // This waits for the page to actually load correctly
    await expect(page.getByRole('heading', { name: 'My Tasks' })).toBeVisible({ timeout: 15000 });
  }

  function getTaskCard(page: Page, taskTitle: string) {
    // Scopes actions to the specific task card
    return page.locator('div').filter({ hasText: taskTitle }).last();
  }

  test('Create Task: create a task and verify it appears', async ({ page }) => {
    title = `pw-task-${Date.now()}`;
    await gotoDashboard(page);

    await page.getByPlaceholder(/e\.g\., Buy groceries/i).fill(title);
    await page.locator('textarea').fill('Task created by Playwright');
    await page.locator('#priority').selectOption('High');
    
    // Click Add
    await page.getByRole('button', { name: /Add Task/i }).click();

    // No reload needed. Playwright waits for the UI to update automatically.
    await expect(page.getByText(title)).toBeVisible({ timeout: 15000 });
  });

  test('Edit Task: modify priority only', async ({ page }) => {
    await gotoDashboard(page);

    const card = getTaskCard(page, title);
    await card.getByRole('button', { name: /edit/i }).click();
    
    // Wait for the edit form to appear
    const dropdown = page.locator('#edit-priority');
    await expect(dropdown).toBeVisible();
    
    await dropdown.selectOption('Low');
    
    // Use a locator that finds the button specifically
    await page.locator('button').filter({ hasText: /save/i }).click();

    // Verify change within the card
    await expect(card).toContainText('Low');
  });

  test('Mark Complete: toggle status', async ({ page }) => {
    await gotoDashboard(page);
    const card = getTaskCard(page, title);
    await card.getByRole('button', { name: /Mark Complete/i }).click();
    await expect(card).toContainText('Status: Complete');
  });

  test('Delete Task: delete and verify removal', async ({ page }) => {
    await gotoDashboard(page);
    const card = getTaskCard(page, title);
    page.once('dialog', d => d.accept());
    await card.getByRole('button', { name: /delete/i }).click();
    await expect(page.getByText(title)).toHaveCount(0);
  });
});