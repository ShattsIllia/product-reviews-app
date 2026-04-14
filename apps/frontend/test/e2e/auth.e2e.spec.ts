import { test, expect } from '@playwright/test';
import { baseURL, register, login } from './_utils';

test.describe('Auth (E2E)', () => {
    test('register → logout → login', async ({ page }) => {
        const unique = Date.now();
        const user = {
            email: `e2e-${unique}@example.com`,
            password: 'E2eTestPassword123!',
            displayName: 'E2E Test User',
        };

        await register(page, user);

        await page.click('[data-testid="user-menu"]');
        await page.click('button[role="menuitem"]:has-text("Logout")');
        await expect(page).toHaveURL(`${baseURL}/auth/login`);

        await login(page, user);
    });
});

