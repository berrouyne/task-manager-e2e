import { test, expect, Page } from '@playwright/test';

test.describe.serial('Task 2 - Task Management (CRUD) - Happy Paths', () => {
  let title: string;

  async function gotoDashboard(page: Page) {
    // Force navigation to the clean dashboard URL
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'My Tasks' })).toBeVisible({ timeout: 15000 });
  }

  function getTaskCard(page: Page, taskTitle: string) {
    return page.locator('div').filter({ hasText: taskTitle }).last();
  }

  test('Create Task: create a task and verify it appears', async ({ page }) => {
    title = `pw-task-${Date.now()}`;
    await gotoDashboard(page);

    await page.getByPlaceholder(/e\.g\., Buy groceries/i).fill(title);
    await page.locator('textarea').fill('Task created by Playwright');
    await page.locator('#priority').selectOption('High');
    
    // 1. Click Add Task
    await page.getByRole('button', { name: /Add Task/i }).click();

    // 2. Since your app seems to refresh/redirect, let's wait for navigation to finish
    // or manually go back to the dashboard if the app doesn't redirect automatically.
    await page.waitForURL('**/dashboard*'); 
    
    // 3. Verify the task is visible
    await expect(page.getByText(title)).toBeVisible({ timeout: 15000 });
  });

  test('Edit Task: modify priority only', async ({ page }) => {
    await gotoDashboard(page);

    const card = getTaskCard(page, title);
    await card.getByRole('button', { name: /edit/i }).click();
    
    const dropdown = page.locator('#edit-priority');
    await expect(dropdown).toBeVisible();
    
    await dropdown.selectOption('Low');
    await page.locator('button').filter({ hasText: /save/i }).click();

    // After saving, wait for the dashboard state to settle
    await expect(card).toContainText('Low', { timeout: 10000 });
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