import { test, expect, Page } from '@playwright/test';

test.describe.serial('Task 2 - Task Management (CRUD) - Happy Paths', () => {
  let title: string;

  async function gotoDashboard(page: Page) {
    await page.goto('/dashboard');
    await expect(page.locator('text=My Tasks')).toBeVisible();
  }

  function taskTitle(page: Page, text: string) {
    return page.locator(`text=${text}`).first();
  }

  function taskCard(page: Page, text: string) {
    return taskTitle(page, text).locator('xpath=ancestor::div[1]');
  }

  test('Create Task: create a task and verify it appears', async ({ page }) => {
    title = `pw-task-${Date.now()}`;

    await gotoDashboard(page);

    await page.fill('input[placeholder="e.g., Buy groceries"]', title);
    await page.fill('textarea', 'Task created by Playwright');
    await page.locator('#priority').selectOption('High');

    await page.click('button:has-text("Add Task")');

    // 🔑 REQUIRED FOR CI
    await page.reload();
    await expect(taskTitle(page, title)).toBeVisible();
  });

  test('Edit Task: modify priority only', async ({ page }) => {
    await gotoDashboard(page);

    const card = taskCard(page, title);
    await expect(card).toBeVisible();

    await card.locator('button:has-text("Edit")').click();
    await page.locator('#edit-priority').selectOption('Low');
    await page.click('button:has-text("Save Changes")');

    await page.reload();
    await expect(taskTitle(page, title)).toBeVisible();
  });

  test('Mark Complete: toggle status', async ({ page }) => {
    await gotoDashboard(page);

    const card = taskCard(page, title);
    await expect(card).toBeVisible();

    await card.locator('button:has-text("Mark Complete")').click();
    await expect(card.locator('text=Status: Complete')).toBeVisible();
  });

  test('Delete Task: delete and verify removal', async ({ page }) => {
    await gotoDashboard(page);

    const card = taskCard(page, title);
    await expect(card).toBeVisible();

    page.once('dialog', d => d.accept());
    await card.locator('button:has-text("Delete")').click();

    await expect(taskTitle(page, title)).toHaveCount(0);
  });
});
