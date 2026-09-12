import { test, type Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT = path.join(__dirname, 'screenshots');

/** Wait for page to settle, then capture a viewport-sized screenshot */
async function captureViewport(page: Page, name: string) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1200); // let entrance animations finish
  await page.screenshot({
    path: path.join(OUT, `${name}.png`),
    fullPage: false,
  });
  console.log(`  ✓ ${name}.png`);
}

/** Scroll to a specific Y offset, wait for animations, capture viewport */
async function captureAtScroll(page: Page, y: number, name: string) {
  await page.evaluate((scrollY) => window.scrollTo({ top: scrollY, behavior: 'instant' }), y);
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(OUT, `${name}.png`),
    fullPage: false,
  });
  console.log(`  ✓ ${name}.png`);
}

/** Scroll through the page in steps, capture at each position */
async function captureScrollSequence(page: Page, baseName: string, steps = 3) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const height = await page.evaluate(() => document.body.scrollHeight);
  const viewH = page.viewportSize()!.height;
  const maxScroll = Math.max(height - viewH, 0);

  if (maxScroll <= 0) {
    // Page fits in one viewport
    await page.screenshot({ path: path.join(OUT, `${baseName}.png`), fullPage: false });
    console.log(`  ✓ ${baseName}.png`);
    return;
  }

  // Capture at top
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, `${baseName}-top.png`), fullPage: false });
  console.log(`  ✓ ${baseName}-top.png`);

  // Capture at evenly spaced scroll positions
  for (let i = 1; i < steps; i++) {
    const y = Math.round((maxScroll * i) / steps);
    await captureAtScroll(page, y, `${baseName}-mid${i}`);
  }

  // Capture at bottom
  await captureAtScroll(page, maxScroll, `${baseName}-bottom`);
}

// ─── User Routes ────────────────────────────────────────────────

test.describe('User – Desktop 1440×900', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('home', async ({ page }) => {
    await page.goto('/');
    await captureScrollSequence(page, 'user-home-desktop-1440x900', 3);
  });

  test('inventory', async ({ page }) => {
    await page.goto('/inventory');
    await captureScrollSequence(page, 'user-inventory-desktop-1440x900', 2);
  });

  test('vehicle detail', async ({ page }) => {
    await page.goto('/vehicle/1');
    await captureScrollSequence(page, 'user-vehicle-desktop-1440x900', 3);
  });

  test('finance', async ({ page }) => {
    await page.goto('/finance');
    await captureScrollSequence(page, 'user-finance-desktop-1440x900', 2);
  });

  test('trade-in', async ({ page }) => {
    await page.goto('/trade-in');
    await captureScrollSequence(page, 'user-tradein-desktop-1440x900', 2);
  });

  test('service', async ({ page }) => {
    await page.goto('/service');
    await captureScrollSequence(page, 'user-service-desktop-1440x900', 2);
  });

  test('contact', async ({ page }) => {
    await page.goto('/contact');
    await captureScrollSequence(page, 'user-contact-desktop-1440x900', 2);
  });

  test('checkout', async ({ page }) => {
    await page.goto('/checkout/1');
    await captureScrollSequence(page, 'user-checkout-desktop-1440x900', 2);
  });
});

test.describe('User – Mobile 390×844', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('home', async ({ page }) => {
    await page.goto('/');
    await captureScrollSequence(page, 'user-home-mobile-390x844', 4);
  });

  test('inventory', async ({ page }) => {
    await page.goto('/inventory');
    await captureScrollSequence(page, 'user-inventory-mobile-390x844', 3);
  });

  test('vehicle detail', async ({ page }) => {
    await page.goto('/vehicle/1');
    await captureScrollSequence(page, 'user-vehicle-mobile-390x844', 3);
  });

  test('finance', async ({ page }) => {
    await page.goto('/finance');
    await captureScrollSequence(page, 'user-finance-mobile-390x844', 2);
  });

  test('trade-in', async ({ page }) => {
    await page.goto('/trade-in');
    await captureScrollSequence(page, 'user-tradein-mobile-390x844', 2);
  });

  test('service', async ({ page }) => {
    await page.goto('/service');
    await captureScrollSequence(page, 'user-service-mobile-390x844', 2);
  });

  test('contact', async ({ page }) => {
    await page.goto('/contact');
    await captureScrollSequence(page, 'user-contact-mobile-390x844', 2);
  });

  test('checkout', async ({ page }) => {
    await page.goto('/checkout/1');
    await captureScrollSequence(page, 'user-checkout-mobile-390x844', 2);
  });
});

// ─── Admin Routes ───────────────────────────────────────────────

async function adminLogin(page: Page) {
  await page.goto('/admin');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
  const dash = page.locator('text=Dashboard').first();
  if (await dash.isVisible({ timeout: 2000 }).catch(() => false)) return;
  await page.fill('#username', 'admin');
  await page.fill('#password', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin', { timeout: 10000 });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
}

test.describe('Admin – Desktop 1440×900', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('login page', async ({ page }) => {
    await page.goto('/admin/login');
    await captureViewport(page, 'admin-login-desktop-1440x900');
  });

  test('dashboard', async ({ page }) => {
    await adminLogin(page);
    await captureViewport(page, 'admin-dashboard-desktop-1440x900');
  });

  test('vehicles tab', async ({ page }) => {
    await adminLogin(page);
    const tab = page.locator('button:has-text("Vehicles"), [role="tab"]:has-text("Vehicles")').first();
    if (await tab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await tab.click();
      await page.waitForTimeout(800);
    }
    await captureViewport(page, 'admin-vehicles-desktop-1440x900');
  });

  test('orders tab', async ({ page }) => {
    await adminLogin(page);
    const tab = page.locator('button:has-text("Orders"), [role="tab"]:has-text("Orders")').first();
    if (await tab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await tab.click();
      await page.waitForTimeout(800);
    }
    await captureViewport(page, 'admin-orders-desktop-1440x900');
  });

  test('leads tab', async ({ page }) => {
    await adminLogin(page);
    const tab = page.locator('button:has-text("Leads"), [role="tab"]:has-text("Leads")').first();
    if (await tab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await tab.click();
      await page.waitForTimeout(800);
    }
    await captureViewport(page, 'admin-leads-desktop-1440x900');
  });

  test('settings tab', async ({ page }) => {
    await adminLogin(page);
    const tab = page.locator('button:has-text("Settings"), [role="tab"]:has-text("Settings")').first();
    if (await tab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await tab.click();
      await page.waitForTimeout(800);
    }
    await captureViewport(page, 'admin-settings-desktop-1440x900');
  });
});

test.describe('Admin – Mobile 390×844', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('login page', async ({ page }) => {
    await page.goto('/admin/login');
    await captureViewport(page, 'admin-login-mobile-390x844');
  });

  test('dashboard', async ({ page }) => {
    await adminLogin(page);
    await captureViewport(page, 'admin-dashboard-mobile-390x844');
  });

  test('sidebar open', async ({ page }) => {
    await adminLogin(page);
    const menuBtn = page.locator('button[aria-label*="menu" i], button:has-text("Menu")').first();
    if (await menuBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await menuBtn.click();
      await page.waitForTimeout(500);
    }
    await captureViewport(page, 'admin-sidebar-mobile-390x844');
  });
});
