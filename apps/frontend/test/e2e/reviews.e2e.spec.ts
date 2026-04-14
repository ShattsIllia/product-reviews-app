import { test, expect } from '@playwright/test';
import { register, login, openFirstProduct, expectSnackBar } from './_utils';

test.describe('Reviews (E2E)', () => {
    test('create and delete review', async ({ page }) => {
        const unique = Date.now();
        const user = {
            email: `e2e-${unique}@example.com`,
            password: 'E2eTestPassword123!',
            displayName: 'E2E Test User',
        };

        await register(page, user);
        await login(page, user);

        // ensure session works after relogin
        await page.click('[data-testid="user-menu"]');
        await page.click('button[role="menuitem"]:has-text("Logout")');
        await login(page, user);

        await openFirstProduct(page);

        const reviewForm = page.locator('[data-testid="review-form"]');
        await reviewForm.scrollIntoViewIfNeeded();

        await page.click('button[aria-label="5 stars"]');
        const comment = `Great product! ${unique}`;
        await page.fill('textarea[formControlName="comment"]', comment);
        await page.click('button[data-testid="submit-review"]');
        await expectSnackBar(page, 'Review added successfully');

        const reviewItem = page.locator('[data-testid="review-item"]').filter({ hasText: comment });
        await expect(reviewItem).toBeVisible();

        await reviewItem.locator('button:has-text("Delete")').click();
        const dialog = page.locator('mat-dialog-container');
        await expect(dialog).toBeVisible();
        await dialog.locator('button:has-text("Delete")').click();
        await expectSnackBar(page, 'Review deleted');
        await expect(reviewItem).toHaveCount(0);
    });
});

