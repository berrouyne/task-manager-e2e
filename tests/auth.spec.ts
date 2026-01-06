import { test, expect } from '@playwright/test';

const PASSWORD = 'Test@12345';

function uniqueUser() {
  const id = Date.now();
  return {
    username: `user${id}`,
    email: `user${id}@test.com`,
  };
}

test.describe('Task 1 - Authentication', () => {

  test('User can register successfully', async ({ page }) => {
    const user = uniqueUser();

    await page.goto('/auth/register');

    await page.fill('input[placeholder="yourusername"]', user.username);
    await page.fill('input[placeholder="name@company.com"]', user.email);
    await page.fill('input[type="password"]', PASSWORD);

    await page.click('button:has-text("Create an account")');

    // Registration success = Login link visible
    await expect(page.locator('text=Login here')).toBeVisible();
  });

  test('Login fails with invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    await page.fill('input[placeholder="name@company.com"]', 'wrong@test.com');
    await page.fill('input[type="password"]', 'wrongpassword');

    await page.click('button:has-text("Sign in")');

    // ✅ Stable assertion: user stays on login page
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('User can login with valid credentials', async ({ page }) => {
    const user = uniqueUser();

    // Register
    await page.goto('/auth/register');
    await page.fill('input[placeholder="yourusername"]', user.username);
    await page.fill('input[placeholder="name@company.com"]', user.email);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button:has-text("Create an account")');

    // Go to login
    await page.click('text=Login here');

    await page.fill('input[placeholder="name@company.com"]', user.email);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button:has-text("Sign in")');

    // Open hamburger menu
    await page.locator('button:has(svg)').first().click();

    // Logged-in state = Logout visible
    await expect(page.locator('text=Logout')).toBeVisible();
  });

  test('User can logout successfully', async ({ page }) => {
    const user = uniqueUser();

    // Register
    await page.goto('/auth/register');
    await page.fill('input[placeholder="yourusername"]', user.username);
    await page.fill('input[placeholder="name@company.com"]', user.email);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button:has-text("Create an account")');

    // Login
    await page.click('text=Login here');
    await page.fill('input[placeholder="name@company.com"]', user.email);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button:has-text("Sign in")');

    // Open menu → logout
    await page.locator('button:has(svg)').first().click();
    await page.click('text=Logout');

    // After logout → login page
    await expect(page).toHaveURL(/auth\/login/);
  });

});
