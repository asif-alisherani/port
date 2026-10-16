import { test, expect } from '@playwright/test';

const BASE = process.env.FRONTEND_URL || 'http://localhost:4173';

test.describe('Frontend — against its own bundle only', () => {
  test('renders hero + sections', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    // The hero is canvas-driven; wait until main content mounts.
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible({ timeout: 15_000 });
  });

  test('opens and closes the contact modal', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: /open contact form/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('opens a project detail from the reel', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.getByRole('link', { name: /Koel Panic/i }).first().click();
    await page.waitForURL(/#\/project\//);
    await expect(page.getByRole('button', { name: /All work/i })).toBeVisible();
  });
});
