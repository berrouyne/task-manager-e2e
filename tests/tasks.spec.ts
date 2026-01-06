import { test, expect } from '@playwright/test';

test('Task Management (CRUD) – Happy Path', async ({ page }) => {
  const title = `pw-task-${Date.now()}`;
  console.log(`🚀 Starting test for task: ${title}`);

  // 1. Navigate to Dashboard
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: /my tasks/i })).toBeVisible({ timeout: 15000 });

  // ====================
  // 1. CREATE
  // ====================
  // We use the main page context for creation
  await page.getByPlaceholder(/groceries/i).fill(title);
  await page.locator('textarea').fill('Task created by Playwright');
  await page.locator('#priority').selectOption('High');
  await page.getByRole('button', { name: /add task/i }).first().click();

  await expect(async () => {
    await page.goto('/dashboard');
    await expect(page.getByText(title)).toBeVisible({ timeout: 5000 });
  }).toPass({ timeout: 20000, intervals: [3000] });

  // ====================
  // 2. EDIT
  // ====================
  const taskCard = page.locator('div, li').filter({ hasText: title }).last();
  await taskCard.getByRole('button', { name: /edit/i }).click();

  // FIX: Target the specific Edit Modal by ID found in your error log
  const modal = page.locator('#editTaskModal');
  await modal.waitFor({ state: 'visible' });

  // Select Low inside the modal
  const dropdown = modal.locator('select');
  await dropdown.selectOption('Low');
  
  // FIX: Click the submit button inside the MODAL specifically
  // We use { force: true } to prevent "Pointer Event Intercepted" errors
  const updateBtn = modal.locator('button[type="submit"], button:has-text("Update"), button:has-text("Save")');
  await updateBtn.click({ force: true });
  
  // Wait for modal to disappear
  await expect(modal).not.toBeVisible({ timeout: 10000 });

  // Verification
  await expect(async () => {
    await page.goto('/dashboard');
    const updatedCard = page.locator('div, li').filter({ hasText: title }).last();
    await expect(updatedCard).toContainText(/low/i, { timeout: 5000 });
  }).toPass({ timeout: 25000, intervals: [5000] });

  // ====================
  // 3. COMPLETE
  // ====================
  const currentCard = page.locator('div, li').filter({ hasText: title }).last();
  await currentCard.getByRole('button', { name: /complete/i }).click();
  
  await expect(async () => {
    await page.goto('/dashboard');
    const completedCard = page.locator('div, li').filter({ hasText: title }).last();
    await expect(completedCard).toContainText(/complete/i, { timeout: 5000 });
  }).toPass({ timeout: 15000, intervals: [3000] });

  // ====================
  // 4. DELETE
  // ====================
  page.once('dialog', d => d.accept());
  const finalCard = page.locator('div, li').filter({ hasText: title }).last();
  await finalCard.getByRole('button', { name: /delete/i }).click();

  await expect(async () => {
    await page.goto('/dashboard');
    await expect(page.getByText(title)).toHaveCount(0, { timeout: 5000 });
  }).toPass({ timeout: 15000, intervals: [3000] });
});