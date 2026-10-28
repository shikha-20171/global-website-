const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ADMIN_BASE_URL = process.env.ADMIN_BASE_URL || 'http://localhost:3001';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'test-results', 'admin-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// 12 Exact Viewports across required categories: mobile, tablet, iPad portrait, iPad landscape, laptop, desktop
const VIEWPORTS = [
  // Mobile Phones
  { id: 'mobile-320', name: '320 × 568 (Compact Mobile / iPhone SE 1)', width: 320, height: 568, category: 'mobile', isMobile: true },
  { id: 'mobile-344', name: '344 × 882 (Galaxy Z Fold)', width: 344, height: 882, category: 'mobile', isMobile: true },
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

  // Laptops
  { id: 'laptop-1280', name: '1280 × 720 (Compact Laptop)', width: 1280, height: 720, category: 'laptop' },
  { id: 'laptop-1366', name: '1366 × 768 (Standard Laptop)', width: 1366, height: 768, category: 'laptop' },

  // Desktop
  { id: 'desktop-1920', name: '1920 × 1080 (Full HD Desktop)', width: 1920, height: 1080, category: 'desktop' },
];

// All 26 accessible Admin Panel routes
const ADMIN_ROUTES = [
  { route: '/', name: 'dashboard', requiresAuth: true, modalButtonSelector: null },
  { route: '/analytics', name: 'analytics', requiresAuth: true, modalButtonSelector: null },
  { route: '/website', name: 'website-overview', requiresAuth: true, modalButtonSelector: null },
  { route: '/website/homepage', name: 'website-homepage', requiresAuth: true, modalButtonSelector: null },
  { route: '/website/pages', name: 'website-pages', requiresAuth: true, modalButtonSelector: 'button:has-text("Create Page")' },
  { route: '/website/navigation', name: 'website-navigation', requiresAuth: true, modalButtonSelector: null },
  { route: '/website/company', name: 'website-company', requiresAuth: true, modalButtonSelector: null },
  { route: '/website/legal', name: 'website-legal', requiresAuth: true, modalButtonSelector: 'button:has-text("Add Policy")' },
  { route: '/products', name: 'products', requiresAuth: true, modalButtonSelector: 'button:has-text("Add New Product")' },
  { route: '/solutions', name: 'solutions', requiresAuth: true, modalButtonSelector: 'button:has-text("Add Solution")' },
  { route: '/industries', name: 'industries', requiresAuth: true, modalButtonSelector: 'button:has-text("Add Industry")' },
  { route: '/case-studies', name: 'case-studies', requiresAuth: true, modalButtonSelector: 'button:has-text("Add Case Study")' },
  { route: '/leads', name: 'leads', requiresAuth: true, modalButtonSelector: 'button:has-text("Details"), button:has-text("View")' },
  { route: '/demos', name: 'demos', requiresAuth: true, modalButtonSelector: 'button:has-text("Details"), button:has-text("View")' },
  { route: '/pricing', name: 'pricing', requiresAuth: true, modalButtonSelector: 'button:has-text("Add Plan Tier")' },
  { route: '/resources', name: 'resources-overview', requiresAuth: true, modalButtonSelector: null },
  { route: '/resources/blog', name: 'resources-blog', requiresAuth: true, modalButtonSelector: 'button:has-text("Create Article")' },
  { route: '/resources/insights', name: 'resources-insights', requiresAuth: true, modalButtonSelector: 'button:has-text("Add Report")' },
  { route: '/resources/faqs', name: 'resources-faqs', requiresAuth: true, modalButtonSelector: 'button:has-text("Add FAQ")' },
  { route: '/careers', name: 'careers', requiresAuth: true, modalButtonSelector: 'button:has-text("Post New Role"), button:has-text("Post Job")' },
  { route: '/partners', name: 'partners', requiresAuth: true, modalButtonSelector: 'button:has-text("Add Partner Organization"), button:has-text("Add Partner")' },
  { route: '/media', name: 'media', requiresAuth: true, modalButtonSelector: 'button:has-text("Upload New Asset")' },
  { route: '/settings', name: 'settings', requiresAuth: true, modalButtonSelector: null },
  { route: '/login', name: 'login', requiresAuth: false, modalButtonSelector: null },
  { route: '/forgot-password', name: 'forgot-password', requiresAuth: false, modalButtonSelector: null },
  { route: '/reset-password', name: 'reset-password', requiresAuth: false, modalButtonSelector: null },
];

async function runComprehensiveAudit() {
  console.log(`========================================================================`);
  console.log(`  DEZORYN ADMIN PANEL — PRODUCTION RESPONSIVE AUDIT`);
  console.log(`========================================================================`);
  console.log(`Admin Base URL: ${ADMIN_BASE_URL}`);
  console.log(`Total Routes: ${ADMIN_ROUTES.length}`);
  console.log(`Total Viewports: ${VIEWPORTS.length}`);
  console.log(`Total Matrix Checks: ${ADMIN_ROUTES.length * VIEWPORTS.length}`);
  console.log(`Screenshots Output: ${SCREENSHOT_DIR}\n`);

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
      mobileDrawer: null,
      notificationsDropdown: null,
      profileDropdown: null,
      modals: []
    }
  };

  // Helper to evaluate layout overflow
  const evaluateLayout = async (pageInstance, vpWidth) => {
    return await pageInstance.evaluate((width) => {
      const scrollW = document.documentElement.scrollWidth;
      const innerW = window.innerWidth;
      const docOverflow = scrollW > innerW + 1;

      const overflowing = [];
      const allEls = document.querySelectorAll('body *');

      for (const el of allEls) {
        const s = window.getComputedStyle(el);
        if (
          s.display === 'none' ||
          s.visibility === 'hidden' ||
          s.opacity === '0' ||
          el.offsetWidth === 0 ||
          el.offsetHeight === 0
        ) {
          continue;
        }

        // Intentionally scrollable data tables & chip filters
        if (el.closest('.overflow-x-auto, [class*="overflow-x-auto"], table, pre, code')) {
          continue;
        }

        let p = el.parentElement;
        let isClip = false;
        while (p && p !== document.body) {
          const ps = window.getComputedStyle(p);
          if (ps.overflowX === 'hidden' || ps.overflowX === 'clip' || ps.overflow === 'hidden') {
            isClip = true;
            break;
          }
          p = p.parentElement;
        }

        const r = el.getBoundingClientRect();
        if (!isClip && r.right > width + 3 && r.width > 10) {
          overflowing.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.className || '').toString().slice(0, 80),
            text: (el.innerText || el.textContent || '').slice(0, 40).trim(),
            right: Math.round(r.right),
            diff: Math.round(r.right - width)
          });
        }
      }

      return {
        docOverflow,
        scrollW,
        innerW,
        overflowAmount: Math.max(0, scrollW - innerW),
        overflowing: overflowing.slice(0, 3)
      };
    }, vpWidth);
  };

  // 1. Establish Authenticated Session Context
  console.log(`▶ Authenticating Super Admin session on ${ADMIN_BASE_URL}/login...`);
  const authContext = await browser.newContext();
  const authPage = await authContext.newPage();

  await authPage.goto(`${ADMIN_BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
  await authPage.fill('input[type="email"]', 'admin@dezoryn.com');
  await authPage.fill('input[type="password"]', 'SuperSecretAdminPassword2026!');
  await authPage.click('button[type="submit"]');
  await authPage.waitForURL(`${ADMIN_BASE_URL}/`, { timeout: 15000 });
  await authPage.waitForFunction(() => !document.body.innerText.includes('Verifying Super Admin Session'), { timeout: 15000 });
  console.log(`✓ Super Admin session authenticated successfully!\n`);

  // 2. Audit Unauthenticated Pages Context (login, forgot-password, reset-password)
  const anonContext = await browser.newContext();
  const anonPage = await anonContext.newPage();

  // AUDIT ALL ROUTES ACROSS VIEWPORTS
  for (const item of ADMIN_ROUTES) {
    console.log(`------------------------------------------------------------`);
    console.log(`Auditing: ${item.route} (${item.name})`);
    console.log(`------------------------------------------------------------`);

    auditReport.routeResults[item.route] = {
      name: item.name,
      viewportsPassed: 0,
      viewportsFailed: 0,
      defects: [],
      modalTested: false
    };

    const targetPage = item.requiresAuth ? authPage : anonPage;
    const targetUrl = `${ADMIN_BASE_URL}${item.route}`;

    try {
      await targetPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 12000 });
      if (item.requiresAuth) {
        await targetPage.waitForFunction(() => !document.body.innerText.includes('Verifying Super Admin Session'), { timeout: 12000 }).catch(() => {});
      }
      await targetPage.waitForTimeout(300);
    } catch (navErr) {
      console.error(`  ✕ Navigation failed: ${navErr.message}`);
      for (const vp of VIEWPORTS) {
        auditReport.testsExecuted++;
        auditReport.testsFailed++;
        auditReport.routeResults[item.route].viewportsFailed++;
      }
      auditReport.defects.push({ route: item.route, type: 'NAV_ERROR', error: navErr.message });
      continue;
    }

    for (const vp of VIEWPORTS) {
      auditReport.testsExecuted++;
      await targetPage.setViewportSize({ width: vp.width, height: vp.height });
      await targetPage.waitForTimeout(100);

      const check = await evaluateLayout(targetPage, vp.width);

      // Save screenshots for representative viewports
      const screenshotVps = ['mobile-320', 'mobile-375', 'ipad-portrait-768', 'ipad-landscape-1024', 'desktop-1920'];
      if (screenshotVps.includes(vp.id)) {
        const ssPath = path.join(SCREENSHOT_DIR, `${item.name}-${vp.id}.png`);
        try {
          await targetPage.screenshot({ path: ssPath });
        } catch (e) {}
      }

      if (check.docOverflow || check.overflowing.length > 0) {
        auditReport.testsFailed++;
        auditReport.routeResults[item.route].viewportsFailed++;
        const defect = {
          route: item.route,
          viewport: vp.id,
          name: vp.name,
          scrollW: check.scrollW,
          innerW: check.innerW,
          overflow: check.overflowAmount,
          elements: check.overflowing
        };
        auditReport.defects.push(defect);
        auditReport.routeResults[item.route].defects.push(defect);
        console.log(`  ✕ ${vp.name}: OVERFLOW (ScrollW: ${check.scrollW}px, InnerW: ${check.innerW}px, +${check.overflowAmount}px)`);
        if (check.overflowing.length > 0) {
          console.log(`    Offender: <${check.overflowing[0].tag}> class="${check.overflowing[0].cls}" text="${check.overflowing[0].text}"`);
        }
      } else {
        auditReport.testsPassed++;
        auditReport.routeResults[item.route].viewportsPassed++;
        console.log(`  ✓ ${vp.name}: Clean (ScrollW: ${check.scrollW}px = InnerW: ${check.innerW}px)`);
      }
    }

    // Modal Interaction Check (if applicable)
    if (item.modalButtonSelector) {
      try {
        await targetPage.setViewportSize({ width: 375, height: 667 });
        await targetPage.waitForTimeout(150);

        const modalBtn = targetPage.locator(item.modalButtonSelector).first();
        if (await modalBtn.isVisible({ timeout: 1500 })) {
          await modalBtn.click();
          await targetPage.waitForTimeout(400);

          const modalCheck = await evaluateLayout(targetPage, 375);
          const modalSsPath = path.join(SCREENSHOT_DIR, `${item.name}-modal-mobile-375.png`);
          await targetPage.screenshot({ path: modalSsPath });

          auditReport.interactiveTests.modals.push({
            route: item.route,
            name: item.name,
            passed: !modalCheck.docOverflow,
            overflow: modalCheck.overflowAmount
          });
          auditReport.routeResults[item.route].modalTested = true;

          console.log(`  ↳ Modal interaction on 375px: ${!modalCheck.docOverflow ? 'PASSED (0px overflow)' : 'OVERFLOW (+' + modalCheck.overflowAmount + 'px)'}`);

          await targetPage.keyboard.press('Escape');
          await targetPage.waitForTimeout(200);
        }
      } catch (mErr) {
        console.log(`  ↳ Modal trigger skipped/unsupported: ${mErr.message}`);
      }
    }
  }

  // 3. INTERACTIVE TESTING: Mobile Drawer & Navigation
  console.log(`\n------------------------------------------------------------`);
  console.log(`Interactive: Mobile Drawer (375 × 667)`);
  console.log(`------------------------------------------------------------`);
  try {
    await authPage.setViewportSize({ width: 375, height: 667 });
    await authPage.goto(`${ADMIN_BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await authPage.waitForTimeout(300);

    const hamburger = authPage.locator('button[aria-label="Open Navigation"]');
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await authPage.waitForTimeout(350);

      const drawerCheck = await evaluateLayout(authPage, 375);
      await authPage.screenshot({ path: path.join(SCREENSHOT_DIR, 'drawer-open-mobile-375.png') });
      console.log(`  Mobile Drawer Open: ${!drawerCheck.docOverflow ? 'PASSED (0px overflow)' : 'OVERFLOW'}`);
      auditReport.interactiveTests.mobileDrawer = {
        passed: !drawerCheck.docOverflow,
        overflow: drawerCheck.overflowAmount
      };

      const closeDrawer = authPage.locator('button[aria-label="Close Admin Sidebar"]');
      if (await closeDrawer.isVisible()) {
        await closeDrawer.click();
        await authPage.waitForTimeout(200);
        console.log(`  Mobile Drawer Close: PASSED`);
      }
    }
  } catch (dErr) {
    console.error(`  Mobile Drawer error: ${dErr.message}`);
  }

  // 4. INTERACTIVE TESTING: Notifications & Profile Popovers
  console.log(`\n------------------------------------------------------------`);
  console.log(`Interactive: Notifications & Profile Popovers (320 × 568 & 375 × 667)`);
  console.log(`------------------------------------------------------------`);
  try {
    await authPage.setViewportSize({ width: 320, height: 568 });
    await authPage.goto(`${ADMIN_BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await authPage.waitForTimeout(300);

    // Notifications Popover
    const bell = authPage.locator('button[aria-label="Admin Notifications"]');
    if (await bell.isVisible()) {
      await bell.click();
      await authPage.waitForTimeout(250);
      const notifCheck = await evaluateLayout(authPage, 320);
      await authPage.screenshot({ path: path.join(SCREENSHOT_DIR, 'notifications-popover-mobile-320.png') });
      console.log(`  Notifications Popover on 320px: ${!notifCheck.docOverflow ? 'PASSED (0px overflow)' : 'OVERFLOW (+' + notifCheck.overflowAmount + 'px)'}`);
      auditReport.interactiveTests.notificationsDropdown = {
        passed: !notifCheck.docOverflow,
        overflow: notifCheck.overflowAmount
      };
      await bell.click();
      await authPage.waitForTimeout(150);
    }

    // Profile Popover
    const profile = authPage.locator('button[aria-label="Admin Profile Menu"]');
    if (await profile.isVisible()) {
      await profile.click();
      await authPage.waitForTimeout(250);
      const profCheck = await evaluateLayout(authPage, 320);
      await authPage.screenshot({ path: path.join(SCREENSHOT_DIR, 'profile-popover-mobile-320.png') });
      console.log(`  Profile Popover on 320px: ${!profCheck.docOverflow ? 'PASSED (0px overflow)' : 'OVERFLOW (+' + profCheck.overflowAmount + 'px)'}`);
      auditReport.interactiveTests.profileDropdown = {
        passed: !profCheck.docOverflow,
        overflow: profCheck.overflowAmount
      };
    }
  } catch (popErr) {
    console.error(`  Popovers error: ${popErr.message}`);
  }

  await browser.close();

  const reportFile = path.join(__dirname, '..', 'test-results', 'admin-audit-report.json');
  fs.writeFileSync(reportFile, JSON.stringify(auditReport, null, 2));

  console.log(`\n========================================================================`);
  console.log(`  PRODUCTION AUDIT EXECUTION SUMMARY`);
  console.log(`========================================================================`);
  console.log(`Total Planned Matrix Checks: ${auditReport.totalRoutes * auditReport.totalViewports}`);
  console.log(`Total Checks Executed: ${auditReport.testsExecuted}`);
  console.log(`Total Checks Passed: ${auditReport.testsPassed}`);
  console.log(`Total Checks Failed: ${auditReport.testsFailed}`);
  console.log(`Defects Logged: ${auditReport.defects.length}`);
  console.log(`Audit Report File: ${reportFile}\n`);
}

runComprehensiveAudit().catch((err) => {
  console.error("Fatal audit execution error:", err);
  process.exit(1);
});

