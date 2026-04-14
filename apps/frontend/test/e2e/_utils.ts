import { expect, Page } from '@playwright/test';

export const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:4200';

export async function expectSnackBar(page: Page, text: string) {
    const snack = page.locator('mat-snack-bar-container').last();
    await expect(snack).toBeVisible();
    await expect(snack).toContainText(text);
}

export async function register(page: Page, user: { email: string; password: string; displayName: string }) {
    await page.goto(`${baseURL}/auth/register`);
    await page.fill('input[formControlName="email"]', user.email);
    await page.fill('input[formControlName="displayName"]', user.displayName);
    await page.fill('input[formControlName="password"]', user.password);
    await page.fill('input[formControlName="confirmPassword"]', user.password);
    await page.click('button[type="submit"]');
    // Registration does not log in. It redirects to login page.
    await expect(page).toHaveURL(`${baseURL}/auth/login`);
    await expectSnackBar(page, 'Registration successful!');
}

export async function login(page: Page, user: { email: string; password: string }) {
    await page.goto(`${baseURL}/auth/login`);
    await page.fill('input[formControlName="email"]', user.email);
    await page.fill('input[formControlName="password"]', user.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(`${baseURL}/products`);
    await expectSnackBar(page, 'Sign in successful!');
}

export async function openFirstProduct(page: Page) {
    const cards = page.locator('[data-testid="product-card"]');
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
    await cards.first().click({ force: true });
    await expect(page).toHaveURL(/\/products\/\w+/);
    await expect(page.locator('[data-testid="product-title"]')).toBeVisible();
}

