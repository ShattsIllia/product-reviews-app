import { test, expect } from '@playwright/test';
import { baseURL, openFirstProduct } from './_utils';

test.describe('Products (E2E)', () => {
    test('product cards render and detail page opens', async ({ page }) => {
        await page.goto(`${baseURL}/products`);
        await expect(page).toHaveURL(`${baseURL}/products`);

        const cards = page.locator('[data-testid="product-card"]');
        await expect(cards.first()).toBeVisible({ timeout: 15000 });

        await openFirstProduct(page);
    });
});

