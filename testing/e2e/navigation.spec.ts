import { test, expect } from '@playwright/test';

const pages = [
  '/dashboard',
  '/patients',
  '/doctors',
  '/appointments',
  '/medical-records',
  '/billing',
  '/pharmacy',
  '/reports',
  '/settings',
];

import { CREDENTIALS } from './credentials';

test.describe('Routing & role access', () => {
  Object.entries(CREDENTIALS).forEach(([role, creds]) => {
    test.describe(`${role} routes`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[name="email"]', creds.email);
        await page.fill('input[name="password"]', creds.pass);
        await page.click('button:text("Sign In")');
        // wait for successful login indication
        await page.waitForURL(/(\/dashboard|\/)$/);
        await expect(page.locator('button:text("Logout")')).toBeVisible();
      });

      pages.forEach((route) => {
        test(`should navigate to ${route}`, async ({ page }) => {
          // intercept appointments fetch and ensure no forbidden response
          let appointmentsResponse: import('@playwright/test').Response | undefined;
          page.on('response', (resp) => {
            if (resp.url().includes('/api/appointments')) {
              appointmentsResponse = resp;
            }
          });
          await page.goto(route);
          await expect(page).toHaveURL(new RegExp(route));
          await expect(page.locator('h1')).toBeVisible();
          if (route === '/appointments') {
            // give some time for fetch to happen
            await page.waitForTimeout(500);
            expect(appointmentsResponse).toBeDefined();
            expect(appointmentsResponse?.status()).not.toBe(403);
          }
        });
      });
    });
  });
});
