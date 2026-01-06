import { test, expect, Page } from '@playwright/test';

async function gotoDashboard(page: Page) {
  await page.goto('/dashboard');
  await expect(
    page.getByRole('heading', { name: /my tasks/i })
  ).toBeVisible({ timeout: 15000 });
}

test.describe('Task 3 - Negative Scenarios & Edge Cases', () => {

  test('Missing title: task should NOT be created', async ({ page }) => {
    await gotoDashboard(page);

    await page.locator('textarea').fill('Task without title');
    await page.locator('#priority').selectOption('High');
    await page.getByRole('button', { name: /add task/i }).click();

    await expect(page.getByText('Task without title')).toHaveCount(0);
  });

  test('Whitespace-only title: task should NOT be created', async ({ page }) => {
    await gotoDashboard(page);

    await page.getByPlaceholder(/groceries/i).fill('   ');
    await page.locator('textarea').fill('Whitespace title');
    await page.getByRole('button', { name: /add task/i }).click();

    await expect(page.getByText('Whitespace title')).toHaveCount(0);
  });

  test('Very long title: app should handle safely', async ({ page }) => {
    const longTitle = 'A'.repeat(300);

    await gotoDashboard(page);

    await page.getByPlaceholder(/groceries/i).fill(longTitle);
    await page.locator('textarea').fill('Long title test');
    await page.getByRole('button', { name: /add task/i }).click();

    // Pass condition = app did not crash
    await expect(
      page.getByRole('heading', { name: /my tasks/i })
    ).toBeVisible();
  });

  test('Special characters in title: should be stored/displayed', async ({ page }) => {
    const specialTitle = '!@#$%^&*()_+{}:"<>?';

    await gotoDashboard(page);

    await page.getByPlaceholder(/groceries/i).fill(specialTitle);
    await page.locator('textarea').fill('Special characters test');
    await page.getByRole('button', { name: /add task/i }).click();

    await page.reload();
    await expect(page.getByText(specialTitle)).toBeVisible({ timeout: 15000 });
  });

});
