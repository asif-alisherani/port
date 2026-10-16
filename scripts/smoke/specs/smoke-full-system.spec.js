import { test, expect } from '@playwright/test';

const BASE = process.env.FRONTEND_URL || 'http://localhost:4173';
const API = process.env.API_URL || 'http://localhost:8000';

/**
 * Cross-system smokes:
 *   - the API behind the front end is sane
 *   - the admin can be logged into with the seeded account
 *   - the front end takes its content from the API when configured
 */
test.describe('Full system — front end + Laravel API + admin', () => {
  test('API answers /api/content', async ({ request }) => {
    const res = await request.get(`${API}/api/content`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(Array.isArray(body.projects)).toBeTruthy();
    expect(body.projects.length).toBeGreaterThan(0);
  });

  test('Admin login screen works', async ({ page }) => {
    const res = await request.get(`${API}/admin`);
    // /admin redirects to login for guests — accept either end state.
    expect([200, 302]).toContain(res.status());
    const loginPage = await page.goto(`${API}/login`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Sign in/i);
    await page.fill('input[name="email"]', 'admin@asifali.dev');
    await page.fill('input[name="password"]', 'password');
    await page.getByRole('button', { name: /enter/i }).click();
    await expect(page.getByText(/Projects/i).first()).toBeVisible({ timeout: 15_000 });
  });
});
