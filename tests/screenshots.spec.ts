import { test, type Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT = path.join(__dirname, 'screenshots');

async function scrollFullPage(page: Page, delayMs = 600) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  const viewH = page.viewportSize()!.height;
  let y = 0;
  while (y < height) {
    y += viewH;
    await page.evaluate((scrollY) => window.scrollTo({ top: scrollY, behavior: 'instant' }), y);
    await page.waitForTimeout(delayMs);
  }
  // Scroll back to top for a clean capture
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(300);
}

async function screenshotFullPage(page: Page, name: string) {
  // Wait for network to settle
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(800);

  // Scroll through entire page to trigger lazy animations
  await scrollFullPage(page, 700);

  // Take full-page screenshot
  await page.screenshot({
    path: path.join(OUT, `${name}.png`),
    fullPage: true,
  });
  console.log(`  Captured: ${name}.png`);
}

// ─── User Routes ────────────────────────────────────────────────

test.describe('User pages – desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('home page', async ({ page }) => {
    await page.goto('/');
    await screenshotFullPage(page, 'user-home-desktop');
  });

  test('inventory page', async ({ page }) => {
    await page.goto('/inventory');
    await screenshotFullPage(page, 'user-inventory-desktop');
  });

  test('vehicle detail page', async ({ page }) => {
    await page.goto('/vehicle/1');
    await screenshotFullPage(page, 'user-vehicle-detail-desktop');
  });

  test('finance page', async ({ page }) => {
    await page.goto('/finance');
    await screenshotFullPage(page, 'user-finance-desktop');
  });

  test('trade-in page', async ({ page }) => {
    await page.goto('/trade-in');
    await screenshotFullPage(page, 'user-trade-in-desktop');
  });

  test('service page', async ({ page }) => {
    await page.goto('/service');
    await screenshotFullPage(page, 'user-service-desktop');
  });

  test('contact page', async ({ page }) => {
    await page.goto('/contact');
    await screenshotFullPage(page, 'user-contact-desktop');
  });

  test('checkout page', async ({ page }) => {
    await page.goto('/checkout/1');
    await screenshotFullPage(page, 'user-checkout-desktop');
  });
});

test.describe('User pages – mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('home page', async ({ page }) => {
    await page.goto('/');
    await screenshotFullPage(page, 'user-home-mobile');
  });

  test('inventory page', async ({ page }) => {
    await page.goto('/inventory');
    await screenshotFullPage(page, 'user-inventory-mobile');
  });

  test('vehicle detail page', async ({ page }) => {
    await page.goto('/vehicle/1');
    await screenshotFullPage(page, 'user-vehicle-detail-mobile');
  });

  test('finance page', async ({ page }) => {
    await page.goto('/finance');
    await screenshotFullPage(page, 'user-finance-mobile');
  });

  test('trade-in page', async ({ page }) => {
    await page.goto('/trade-in');
    await screenshotFullPage(page, 'user-trade-in-mobile');
  });

  test('service page', async ({ page }) => {
    await page.goto('/service');
    await screenshotFullPage(page, 'user-service-mobile');
  });

  test('contact page', async ({ page }) => {
    await page.goto('/contact');
    await screenshotFullPage(page, 'user-contact-mobile');
  });

  test('checkout page', async ({ page }) => {
    await page.goto('/checkout/1');
    await screenshotFullPage(page, 'user-checkout-mobile');
  });
});

// ─── Admin Routes ───────────────────────────────────────────────

async function adminLogin(page: Page) {
  await page.goto('/admin');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);

  // If already logged in (dashboard visible), skip
  const dashboardHeading = page.locator('text=Dashboard').first();
  if (await dashboardHeading.isVisible({ timeout: 2000 }).catch(() => false)) return;

  // Fill login form using exact IDs from AdminLoginPage
  await page.fill('#username', 'admin');
  await page.fill('#password', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin', { timeout: 10000 });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
}

test.describe('Admin pages – desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('admin login page', async ({ page }) => {
    await page.goto('/admin/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT, 'admin-login-desktop.png'), fullPage: true });
    console.log('  Captured: admin-login-desktop.png');
  });

  test('admin dashboard', async ({ page }) => {
    await adminLogin(page);
    await screenshotFullPage(page, 'admin-dashboard-desktop');
  });

  test('admin inventory tab', async ({ page }) => {
    await adminLogin(page);

    const invTab = page.locator('button:has-text("Inventory"), [role="tab"]:has-text("Inventory")').first();
    if (await invTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await invTab.click();
      await page.waitForTimeout(1000);
    }

    await screenshotFullPage(page, 'admin-inventory-desktop');
  });

  test('admin leads tab', async ({ page }) => {
    await adminLogin(page);

    const leadsTab = page.locator('button:has-text("Leads"), [role="tab"]:has-text("Leads")').first();
    if (await leadsTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await leadsTab.click();
      await page.waitForTimeout(1000);
    }

    await screenshotFullPage(page, 'admin-leads-desktop');
  });

  test('admin orders tab', async ({ page }) => {
    await adminLogin(page);

    const ordersTab = page.locator('button:has-text("Orders"), [role="tab"]:has-text("Orders")').first();
    if (await ordersTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await ordersTab.click();
      await page.waitForTimeout(1000);
    }

    await screenshotFullPage(page, 'admin-orders-desktop');
  });

  test('admin settings tab', async ({ page }) => {
    await adminLogin(page);

    const settingsTab = page.locator('button:has-text("Settings"), [role="tab"]:has-text("Settings")').first();
    if (await settingsTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await settingsTab.click();
      await page.waitForTimeout(1000);
    }

    await screenshotFullPage(page, 'admin-settings-desktop');
  });
});

test.describe('Admin pages – mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('admin login page', async ({ page }) => {
    await page.goto('/admin/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT, 'admin-login-mobile.png'), fullPage: true });
    console.log('  Captured: admin-login-mobile.png');
  });

  test('admin dashboard', async ({ page }) => {
    await adminLogin(page);
    await screenshotFullPage(page, 'admin-dashboard-mobile');
  });

  test('admin sidebar open', async ({ page }) => {
    await adminLogin(page);

    // Try to open sidebar/menu
    const menuBtn = page.locator('button:has-text("Menu"), button[aria-label*="menu" i]').first();
    if (await menuBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await menuBtn.click();
      await page.waitForTimeout(500);
    }

    await screenshotFullPage(page, 'admin-sidebar-mobile');
  });
});
