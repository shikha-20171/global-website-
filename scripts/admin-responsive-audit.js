const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ADMIN_BASE_URL = process.env.ADMIN_BASE_URL || 'http://localhost:3001';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'test-results', 'admin-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// 12 Comprehensive Viewports across all required device classes
const VIEWPORTS = [
  // Mobile Viewports (Small, Standard, Modern, Large)
  { id: 'mobile-320', name: '320 × 568 (Small Mobile / iPhone SE 1)', width: 320, height: 568, category: 'mobile', isMobile: true },
  { id: 'mobile-375', name: '375 × 667 (iPhone SE / Standard Mobile)', width: 375, height: 667, category: 'mobile', isMobile: true },
  { id: 'mobile-390', name: '390 × 844 (iPhone 12/13/14)', width: 390, height: 844, category: 'mobile', isMobile: true },
  { id: 'mobile-430', name: '430 × 932 (iPhone Pro Max)', width: 430, height: 932, category: 'mobile', isMobile: true },

  // Compact Tablet
  { id: 'tablet-600', name: '600 × 960 (Compact Tablet)', width: 600, height: 960, category: 'tablet', isTablet: true },

  // iPad Portrait
  { id: 'ipad-portrait-768', name: '768 × 1024 (iPad Portrait)', width: 768, height: 1024, category: 'ipad-portrait', isTablet: true },
  { id: 'ipad-portrait-820', name: '820 × 1180 (iPad Air Portrait)', width: 820, height: 1180, category: 'ipad-portrait', isTablet: true },

  // iPad Landscape
  { id: 'ipad-landscape-1024', name: '1024 × 768 (iPad Landscape)', width: 1024, height: 768, category: 'ipad-landscape', isTablet: true },

  // Laptop
  { id: 'laptop-1280', name: '1280 × 720 (Compact Laptop)', width: 1280, height: 720, category: 'laptop' },
  { id: 'laptop-1366', name: '1366 × 768 (Standard Laptop)', width: 1366, height: 768, category: 'laptop' },
  { id: 'laptop-1440', name: '1440 × 900 (MacBook Pro)', width: 1440, height: 900, category: 'laptop' },

  // Desktop
  { id: 'desktop-1920', name: '1920 × 1080 (Full HD Desktop)', width: 1920, height: 1080, category: 'desktop' },
];

// All 26 accessible Admin Panel routes
const ADMIN_ROUTES = [
  { route: '/', name: 'dashboard', requiresAuth: true, modalButtonSelector: null },
  { route: '/analytics', name: 'analytics', requiresAuth: true, modalButtonSelector: null },
  { route: '/website', name: 'website-overview', requiresAuth: true, modalButtonSelector: null },
  { route: '/website/homepage', name: 'website-homepage', requiresAuth: true, modalButtonSelector: null },
  { route: '/website/pages', name: 'website-pages', requiresAuth: true, modalButtonSelector: 'button:has-text("Add New Page")' },
  { route: '/website/navigation', name: 'website-navigation', requiresAuth: true, modalButtonSelector: 'button:has-text("Add Menu Item")' },
  { route: '/website/company', name: 'website-company', requiresAuth: true, modalButtonSelector: null },
  { route: '/website/legal', name: 'website-legal', requiresAuth: true, modalButtonSelector: 'button:has-text("Add Policy")' },
  { route: '/products', name: 'products', requiresAuth: true, modalButtonSelector: 'button:has-text("Add SaaS Product")' },
  { route: '/solutions', name: 'solutions', requiresAuth: true, modalButtonSelector: 'button:has-text("Add Solution")' },
  { route: '/industries', name: 'industries', requiresAuth: true, modalButtonSelector: 'button:has-text("Add Industry")' },
  { route: '/case-studies', name: 'case-studies', requiresAuth: true, modalButtonSelector: 'button:has-text("Add Case Study")' },
  { route: '/leads', name: 'leads', requiresAuth: true, modalButtonSelector: 'button:has-text("View Details"), tr button' },
  { route: '/demos', name: 'demos', requiresAuth: true, modalButtonSelector: 'button:has-text("View Details"), tr button' },
  { route: '/pricing', name: 'pricing', requiresAuth: true, modalButtonSelector: 'button:has-text("Add Plan Tier")' },
  { route: '/resources', name: 'resources-overview', requiresAuth: true, modalButtonSelector: null },
  { route: '/resources/blog', name: 'resources-blog', requiresAuth: true, modalButtonSelector: 'button:has-text("Write Article"), button:has-text("New Article")' },
  { route: '/resources/insights', name: 'resources-insights', requiresAuth: true, modalButtonSelector: 'button:has-text("Add Report")' },
  { route: '/resources/faqs', name: 'resources-faqs', requiresAuth: true, modalButtonSelector: 'button:has-text("Add FAQ")' },
  { route: '/careers', name: 'careers', requiresAuth: true, modalButtonSelector: 'button:has-text("Post New Role"), button:has-text("Post Job")' },
  { route: '/partners', name: 'partners', requiresAuth: true, modalButtonSelector: 'button:has-text("Add Partner")' },
  { route: '/media', name: 'media', requiresAuth: true, modalButtonSelector: 'button:has-text("Upload New Asset"), button:has-text("Upload File")' },
  { route: '/settings', name: 'settings', requiresAuth: true, modalButtonSelector: null },
  { route: '/login', name: 'login', requiresAuth: false, modalButtonSelector: null },
  { route: '/forgot-password', name: 'forgot-password', requiresAuth: false, modalButtonSelector: null },
  { route: '/reset-password', name: 'reset-password', requiresAuth: false, modalButtonSelector: null },
];

const STATIC_ADMIN_USER = {
  id: "usr_1",
  email: "admin@dezoryn.com",
  name: "Super Admin",
  role: "Super Administrator",
  roleId: "super_admin",
  permissions: [
    "website:read", "website:write", "website:publish",
    "products:read", "products:write", "products:publish",
    "solutions:manage", "leads:read", "leads:manage",
    "demos:manage", "content:manage", "media:manage",
    "settings:manage", "users:manage"
  ],
  twoFactorEnforced: true,
  lastLoginAt: new Date().toISOString()
};
const STATIC_ADMIN_TOKEN = "02ec32df954753d192bc51a52ffb4163b73e946b41426838dbdc1c0a622318dd";

async function runAudit() {
  console.log(`========================================================================`);
  console.log(`  DEZORYN ADMIN PANEL — COMPREHENSIVE RESPONSIVE AUDIT`);
  console.log(`========================================================================`);
  console.log(`Admin URL: ${ADMIN_BASE_URL}`);
  console.log(`Routes to audit: ${ADMIN_ROUTES.length}`);
  console.log(`Viewports: ${VIEWPORTS.length}`);
  console.log(`Total Planned Matrix Checks: ${ADMIN_ROUTES.length * VIEWPORTS.length}`);
  console.log(`Screenshots Directory: ${SCREENSHOT_DIR}\n`);

  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  const auditReport = {
    timestamp: new Date().toISOString(),
    adminBaseUrl: ADMIN_BASE_URL,
    totalRoutes: ADMIN_ROUTES.length,
    totalViewports: VIEWPORTS.length,
    testsExecuted: 0,
    testsPassed: 0,
    testsFailed: 0,
    defects: [],
    routeResults: {},
    interactiveTests: {
      mobileDrawer: [],
      headerMenus: [],
      modals: []
    }
  };

  const context = await browser.newContext();

  await context.addInitScript(({ user, token }) => {
    try {
      window.sessionStorage.setItem('dezoryn_admin_token', token);
      window.sessionStorage.setItem('dezoryn_admin_user', JSON.stringify(user));
      window.localStorage.setItem('dezoryn_admin_email', user.email);
    } catch (e) {}
  }, { user: STATIC_ADMIN_USER, token: STATIC_ADMIN_TOKEN });

  const page = await context.newPage();

  const checkLayout = async (pageInstance, vp) => {
    return await pageInstance.evaluate((viewportWidth) => {
      const scrollW = document.documentElement.scrollWidth;
      const innerW = window.innerWidth;
      const docOverflow = scrollW > innerW + 1;

      const overflowingElements = [];
      const allEls = document.querySelectorAll('body *');

      for (const el of allEls) {
        const style = window.getComputedStyle(el);
        if (
          style.display === 'none' ||
          style.visibility === 'hidden' ||
          style.opacity === '0' ||
          style.pointerEvents === 'none' ||
          el.offsetWidth === 0 ||
          el.offsetHeight === 0
        ) {
          continue;
        }

        // Deliberate horizontal scroll areas (tables, chip bars)
        if (el.closest('.overflow-x-auto, [class*="overflow-x-auto"], table, pre, code')) {
          continue;
        }

        let parent = el.parentElement;
        let isClippedContainer = false;
        while (parent && parent !== document.body) {
          const ps = window.getComputedStyle(parent);
          if (ps.overflowX === 'hidden' || ps.overflowX === 'clip' || ps.overflow === 'hidden') {
            isClippedContainer = true;
            break;
          }
          parent = parent.parentElement;
        }

        const rect = el.getBoundingClientRect();

        if (!isClippedContainer && rect.right > viewportWidth + 3 && rect.width > 10) {
          overflowingElements.push({
            tagName: el.tagName.toLowerCase(),
            className: (el.className || '').toString().slice(0, 100),
            text: (el.innerText || '').slice(0, 50).trim(),
            rect: { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) },
            overflowAmount: Math.round(rect.right - viewportWidth)
          });
        }
      }

      return {
        hasDocOverflow: docOverflow,
        scrollWidth: scrollW,
        innerWidth: innerW,
        overflowAmount: Math.max(0, scrollW - innerW),
        overflowingElements: overflowingElements.slice(0, 5),
      };
    }, vp.width);
  };

  for (const item of ADMIN_ROUTES) {
    console.log(`\n------------------------------------------------------------`);
    console.log(`▶ Auditing Route: ${item.route} (${item.name})`);
    console.log(`------------------------------------------------------------`);

    auditReport.routeResults[item.route] = {
      name: item.name,
      viewportsPassed: 0,
      viewportsFailed: 0,
      defects: [],
      modalTested: false
    };

    const targetUrl = `${ADMIN_BASE_URL}${item.route}`;

    // Load page ONCE at desktop width, then dynamically resize viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    try {
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 12000 });
      await page.waitForTimeout(400);
    } catch (e) {
      console.error(`  ✕ Navigation failed for ${item.route}: ${e.message}`);
      for (const vp of VIEWPORTS) {
        auditReport.testsExecuted++;
        auditReport.testsFailed++;
        auditReport.routeResults[item.route].viewportsFailed++;
      }
      auditReport.defects.push({
        route: item.route,
        type: 'NAVIGATION_FAILED',
        message: e.message
      });
      continue;
    }

    for (const vp of VIEWPORTS) {
      auditReport.testsExecuted++;
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(100);

      const check = await checkLayout(page, vp);

      const screenshotViewports = ['mobile-320', 'mobile-375', 'tablet-768', 'ipad-landscape-1024', 'desktop-1920'];
      if (screenshotViewports.includes(vp.id)) {
        const screenshotFileName = `${item.name}-${vp.id}.png`;
        const screenshotPath = path.join(SCREENSHOT_DIR, screenshotFileName);
        try {
          await page.screenshot({ path: screenshotPath, fullPage: false });
        } catch (ssErr) {}
      }

      if (check.hasDocOverflow || check.overflowingElements.length > 0) {
        auditReport.testsFailed++;
        auditReport.routeResults[item.route].viewportsFailed++;
        const defect = {
          route: item.route,
          viewport: vp.id,
          viewportName: vp.name,
          scrollWidth: check.scrollWidth,
          innerWidth: check.innerWidth,
          overflowAmount: check.overflowAmount,
          elements: check.overflowingElements
        };
        auditReport.defects.push(defect);
        auditReport.routeResults[item.route].defects.push(defect);
        console.log(`  ✕ ${vp.name}: OVERFLOW DETECTED (ScrollW: ${check.scrollWidth}px > InnerW: ${check.innerWidth}px, +${check.overflowAmount}px)`);
        if (check.overflowingElements.length > 0) {
          console.log(`    Offending element: <${check.overflowingElements[0].tagName}> class="${check.overflowingElements[0].className}" text="${check.overflowingElements[0].text}"`);
        }
      } else {
        auditReport.testsPassed++;
        auditReport.routeResults[item.route].viewportsPassed++;
        console.log(`  ✓ ${vp.name}: Clean (No horizontal overflow)`);
      }
    }

    // Interactive Modal Test (if applicable)
    if (item.modalButtonSelector) {
      try {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(150);

        const modalBtn = page.locator(item.modalButtonSelector).first();
        if (await modalBtn.isVisible({ timeout: 1500 })) {
          await modalBtn.click();
          await page.waitForTimeout(300);

          const modalCheck = await checkLayout(page, { width: 375 });
          const modalScreenshotPath = path.join(SCREENSHOT_DIR, `${item.name}-modal-mobile-375.png`);
          await page.screenshot({ path: modalScreenshotPath });

          auditReport.interactiveTests.modals.push({
            route: item.route,
            name: item.name,
            selector: item.modalButtonSelector,
            passed: !modalCheck.hasDocOverflow,
            overflowAmount: modalCheck.overflowAmount
          });
          auditReport.routeResults[item.route].modalTested = true;

          console.log(`  ↳ Modal tested on mobile-375: ${!modalCheck.hasDocOverflow ? 'PASSED' : 'OVERFLOW (' + modalCheck.overflowAmount + 'px)'}`);

          await page.keyboard.press('Escape');
          await page.waitForTimeout(150);
        }
      } catch (modalErr) {
        console.log(`  ↳ Modal test skipped or failed to trigger: ${modalErr.message}`);
      }
    }
  }

  // INTERACTIVE NAVIGATION & DRAWER TEST
  console.log(`\n------------------------------------------------------------`);
  console.log(`▶ Interactive Testing: Mobile Drawer & Navigation`);
  console.log(`------------------------------------------------------------`);

  try {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${ADMIN_BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 8000 });
    await page.waitForTimeout(300);

    const hamburgerBtn = page.locator('button[aria-label="Open Navigation"]');
    if (await hamburgerBtn.isVisible()) {
      await hamburgerBtn.click();
      await page.waitForTimeout(300);

      const drawerCheck = await checkLayout(page, { width: 375 });
      const drawerScreenshotPath = path.join(SCREENSHOT_DIR, `mobile-drawer-open-375.png`);
      await page.screenshot({ path: drawerScreenshotPath });

      console.log(`  Drawer Open on mobile-375: ${!drawerCheck.hasDocOverflow ? 'PASSED (no overflow)' : 'FAILED'}`);
      auditReport.interactiveTests.mobileDrawer.push({
        state: 'open',
        passed: !drawerCheck.hasDocOverflow,
        overflowAmount: drawerCheck.overflowAmount
      });

      const closeBtn = page.locator('button[aria-label="Close Admin Sidebar"]');
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await page.waitForTimeout(300);
        console.log(`  Drawer Close button: PASSED`);
      }
    }
  } catch (drawerErr) {
    console.error(`  Drawer test error:`, drawerErr.message);
  }

  // INTERACTIVE HEADER DROPDOWNS (Notifications & Profile)
  console.log(`\n------------------------------------------------------------`);
  console.log(`▶ Interactive Testing: Notifications & Profile Dropdowns`);
  console.log(`------------------------------------------------------------`);

  try {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${ADMIN_BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 8000 });
    await page.waitForTimeout(300);

    const bellBtn = page.locator('button[aria-label="Admin Notifications"]');
    if (await bellBtn.isVisible()) {
      await bellBtn.click();
      await page.waitForTimeout(200);
      const notifCheck = await checkLayout(page, { width: 375 });
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'header-notifications-mobile-375.png') });
      console.log(`  Notifications dropdown on mobile-375: ${!notifCheck.hasDocOverflow ? 'PASSED' : 'OVERFLOW'}`);
      auditReport.interactiveTests.headerMenus.push({
        name: 'notifications',
        passed: !notifCheck.hasDocOverflow,
        overflowAmount: notifCheck.overflowAmount
      });
      await bellBtn.click();
      await page.waitForTimeout(200);
    }

    const profileBtn = page.locator('button[aria-label="Admin Profile Menu"]');
    if (await profileBtn.isVisible()) {
      await profileBtn.click();
      await page.waitForTimeout(200);
      const profileCheck = await checkLayout(page, { width: 375 });
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'header-profile-mobile-375.png') });
      console.log(`  Profile dropdown on mobile-375: ${!profileCheck.hasDocOverflow ? 'PASSED' : 'OVERFLOW'}`);
      auditReport.interactiveTests.headerMenus.push({
        name: 'profile',
        passed: !profileCheck.hasDocOverflow,
        overflowAmount: profileCheck.overflowAmount
      });
    }
  } catch (menuErr) {
    console.error(`  Header dropdowns test error:`, menuErr.message);
  }

  await browser.close();

  const reportPath = path.join(__dirname, '..', 'test-results', 'admin-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditReport, null, 2));

  console.log(`\n========================================================================`);
  console.log(`  AUDIT COMPLETED`);
  console.log(`========================================================================`);
  console.log(`Total checks: ${auditReport.testsExecuted}`);
  console.log(`Passed checks: ${auditReport.testsPassed}`);
  console.log(`Failed checks: ${auditReport.testsFailed}`);
  console.log(`Total defects logged: ${auditReport.defects.length}`);
  console.log(`Full report saved to: ${reportPath}`);
}

runAudit().catch(err => {
  console.error("Fatal audit error:", err);
  process.exit(1);
});
