import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './test/e2e',
    testMatch: /.*\.e2e\.spec\.ts/,
    fullyParallel: false,
    retries: process.env.CI ? 2 : 0,
    webServer: [
        {
            command: 'pnpm -s --filter @product-reviews/backend dev',
            url: 'http://localhost:3000/api/v1/products',
            reuseExistingServer: true,
            timeout: 180_000,
            cwd: '../..',
        },
        {
            // Use `start` (no `--open`) to keep CI non-interactive.
            command: 'pnpm -s --filter @product-reviews/frontend start',
            url: 'http://localhost:4200',
            reuseExistingServer: true,
            timeout: 180_000,
            cwd: '../..',
        },
    ],
    use: {
        baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:4200',
        trace: 'on-first-retry',
    },
});

