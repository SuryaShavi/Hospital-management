import { test, expect } from '@playwright/test';
import { CREDENTIALS } from './credentials';

// Environment variable FRONTEND_URL or default set in config

test.describe('Authentication flow', () => {
  Object.entries(CREDENTIALS).forEach(([role, creds]) => {
    test(`${role} can login and logout`, async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[name="email"]', creds.email);
      await page.fill('input[name="password"]', creds.pass);
      // form button reads "Sign In" rather than "Login"
      await page.click('button:text("Sign In")');
      // the application redirects to the dashboard index
      // URL may remain '/' even though dashboard component renders
      await expect(page).toHaveURL(/(\/dashboard|\/)$/);
      await expect(page.locator('button:text("Logout")')).toBeVisible();

      // logout and verify redirection
      await page.click('button:text("Logout")');
      await expect(page).toHaveURL(/login/);
    });
  });
});
