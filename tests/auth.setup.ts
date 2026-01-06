import { test, expect } from '@playwright/test';

const PASSWORD = 'P@ssw0rd!12345';

function uniqueUser() {
  const id = Date.now();
  return {
    username: `pw_user_${id}`,
    email: `pw_user_${id}@test.com`,
  };
}

test('setup: register + login and save state', async ({ page }) => {
  const user = uniqueUser();

  // 1️⃣ Register
  await page.goto('/auth/register');
  await page.fill('input[placeholder="yourusername"]', user.username);
  await page.fill('input[placeholder="name@company.com"]', user.email);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button:has-text("Create an account")');

  // 2️⃣ Login explicitly (VERY IMPORTANT)
  await page.goto('/auth/login');
  await page.fill('input[placeholder="name@company.com"]', user.email);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button:has-text("Sign in")');

  // 3️⃣ Go to dashboard
  await page.goto('/dashboard');

  // 4️⃣ Auth proof
  await expect(page.locator('h1:has-text("My Tasks")')).toBeVisible();

  // 5️⃣ Save session
  await page.context().storageState({ path: 'storageState.json' });
});
