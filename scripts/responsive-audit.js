const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const VIEWPORTS = [
  // Mobile Phones
  { id: 'mobile-320', name: '320 × 568 (Small Mobile)', width: 320, height: 568, isMobile: true },
  { id: 'mobile-344', name: '344 × 882 (Galaxy Z Fold)', width: 344, height: 882, isMobile: true },
  { id: 'mobile-360', name: '360 × 640 (Compact Android)', width: 360, height: 640, isMobile: true },
  { id: 'mobile-375', name: '375 × 667 (iPhone SE)', width: 375, height: 667, isMobile: true },
  { id: 'mobile-390', name: '390 × 844 (iPhone 12/13/14)', width: 390, height: 844, isMobile: true },
  { id: 'mobile-393', name: '393 × 852 (iPhone 15/16)', width: 393, height: 852, isMobile: true },
  { id: 'mobile-414', name: '414 × 896 (iPhone XR/Plus)', width: 414, height: 896, isMobile: true },
  { id: 'mobile-430', name: '430 × 932 (iPhone 14/15/16 Pro Max)', width: 430, height: 932, isMobile: true },

  // Tablets and iPads
  { id: 'tablet-600', name: '600 × 960 (Compact Tablet)', width: 600, height: 960, isTablet: true },
  { id: 'tablet-768', name: '768 × 1024 (iPad Portrait)', width: 768, height: 1024, isTablet: true },
  { id: 'tablet-820', name: '820 × 1180 (iPad Air Portrait)', width: 820, height: 1180, isTablet: true },
  { id: 'tablet-1024-p', name: '1024 × 1366 (iPad Pro 13 Portrait)', width: 1024, height: 1366, isTablet: true },
  { id: 'tablet-1024-l', name: '1024 × 768 (Tablet Landscape)', width: 1024, height: 768, isTablet: true },
  { id: 'tablet-1180-l', name: '1180 × 820 (Tablet Landscape)', width: 1180, height: 820, isTablet: true },

  // Laptops and Desktops
  { id: 'desktop-1280', name: '1280 × 720 (Compact Laptop)', width: 1280, height: 720 },
  { id: 'desktop-1366', name: '1366 × 768 (Standard Laptop)', width: 1366, height: 768 },
  { id: 'desktop-1440', name: '1440 × 900 (MacBook Pro)', width: 1440, height: 900 },
  { id: 'desktop-1920', name: '1920 × 1080 (Full HD)', width: 1920, height: 1080 },
];

const ROUTES = [
  '/',
  '/products',
  '/products/schooly-core',
  '/products/dezo-care',
  '/products/real-estate',
  '/marketplace',
  '/marketplace/search',
  '/marketplace/category/education',
  '/pricing',
  '/compare',
  '/solutions',
  '/solutions/enterprise',
  '/solutions/ai',
  '/solutions/mobile',
  '/industries',
  '/industries/education',
  '/industries/healthcare',
  '/portfolio',
  '/case-studies',
  '/case-studies/schooly-core-campus',
  '/projects',
  '/projects/schooly-core-campus',
  '/resources',
  '/resources/insights',
  '/resources/docs',
  '/resources/api',
  '/resources/guides',
  '/blog',
  '/blog/agentic-ai-workflow-orchestration',
  '/company',
  '/mission',
  '/partners',
  '/careers',
  '/faq',
  '/contact',
  '/contact-sales',
  '/demo',
  '/start-trial',
  '/login',
  '/legal',
  '/legal/privacy',
  '/legal/terms',
];

async function runAudit() {
  console.log(`Starting Comprehensive Responsive Audit across ${ROUTES.length} routes and ${VIEWPORTS.length} viewports...`);
  console.log(`Base URL: ${BASE_URL}`);

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();

  const results = {
    timestamp: new Date().toISOString(),
    routesTotal: ROUTES.length,
    viewportsTotal: VIEWPORTS.length,
    testsExecuted: 0,
    testsPassed: 0,
    testsFailed: 0,
    defects: [],
    consoleErrors: [],
  };

  const checkPageLayout = async (page) => {
    return await page.evaluate(() => {
      const scrollW = document.documentElement.scrollWidth;
      const innerW = window.innerWidth;
      const hasDocOverflow = scrollW > innerW + 1;

      const protrudingElements = [];
      const allEls = document.querySelectorAll('body *');

      for (const el of allEls) {
        const style = window.getComputedStyle(el);
        // Ignore invisible or decorative elements
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

        // Ignore deliberate horizontally scrollable elements (tables, code blocks, tab strips)
        if (el.closest('.overflow-x-auto, [class*="overflow-x-auto"], table, pre, code')) {
          continue;
        }

        // Ignore elements inside ancestors that clip overflow
        let parent = el.parentElement;
        let isClipped = false;
        while (parent && parent !== document.body) {
          const pStyle = window.getComputedStyle(parent);
          if (pStyle.overflowX === 'hidden' || pStyle.overflowX === 'clip' || pStyle.overflow === 'hidden') {
            isClipped = true;
            break;
          }
          parent = parent.parentElement;
        }
        if (isClipped) continue;

        const rect = el.getBoundingClientRect();
        if (rect.right > innerW + 2) {
          let tag = el.tagName.toLowerCase();
          let id = el.id ? `#${el.id}` : '';
          let cls = el.className && typeof el.className === 'string'
            ? `.${el.className.trim().split(/\s+/).slice(0, 3).join('.')}`
            : '';
          let text = (el.textContent || '').trim().slice(0, 35);

          protrudingElements.push({
            selector: `${tag}${id}${cls}`,
            text,
            rectRight: Math.round(rect.right),
            excess: Math.round(rect.right - innerW),
          });

          if (protrudingElements.length >= 5) break;
        }
      }

      return {
        hasDocOverflow,
        scrollW,
        innerW,
        protrudingElements,
      };
    });
  };

  // Test mobile menu interaction on representative viewports
  const testMobileMenu = async (page, vp) => {
    if (vp.width >= 1280) return true; // desktop navbar is visible
    try {
      const menuBtn = page.locator('button[aria-label="Open menu"], button[aria-label="Close menu"]').first();
      if (await menuBtn.isVisible({ timeout: 1000 })) {
        await menuBtn.click();
        await page.waitForTimeout(250);
        const drawer = page.locator('[role="dialog"][aria-label="Mobile Navigation Menu"]').first();
        const isOpen = await drawer.isVisible();
        if (isOpen) {
          // Verify drawer fits inside viewport
          const box = await drawer.boundingBox();
          const fits = box && box.width <= vp.width + 1;
          // Close menu
          const closeBtn = page.locator('button[aria-label="Close menu"]').first();
          if (await closeBtn.isVisible()) {
            await closeBtn.click();
            await page.waitForTimeout(200);
          }
          return fits;
        }
      }
      return true;
    } catch {
      return true;
    }
  };

  let routeIndex = 0;
  for (const route of ROUTES) {
    routeIndex++;
    const page = await context.newPage();
    const pageErrors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        pageErrors.push(`[${msg.type()}] ${msg.text()}`);
      }
    });

    page.on('pageerror', err => {
      pageErrors.push(`[Exception] ${err.message}`);
    });

    const targetUrl = `${BASE_URL}${route}`;
    process.stdout.write(`[${routeIndex}/${ROUTES.length}] Testing route ${route} ... `);

    try {
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(300);

      let routeFailures = 0;

      for (const vp of VIEWPORTS) {
        results.testsExecuted++;
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.waitForTimeout(80);

        const check = await checkPageLayout(page);
        const menuOk = (route === '/' && vp.width < 1280) ? await testMobileMenu(page, vp) : true;

        if (check.hasDocOverflow || check.protrudingElements.length > 0 || !menuOk) {
          results.testsFailed++;
          routeFailures++;
          const defect = {
            route,
            viewport: vp.name,
            width: vp.width,
            height: vp.height,
            scrollWidth: check.scrollW,
            innerWidth: check.innerW,
            overflowPixels: Math.max(0, check.scrollW - check.innerW),
            protrudingElements: check.protrudingElements,
            menuOk,
          };
          results.defects.push(defect);
        } else {
          results.testsPassed++;
        }
      }

      if (routeFailures === 0) {
        console.log(`✅ All ${VIEWPORTS.length} viewports PASSED`);
      } else {
        console.log(`❌ ${routeFailures}/${VIEWPORTS.length} viewports FAILED`);
      }
    } catch (navErr) {
      console.log(`⚠️ Navigation Error: ${navErr.message}`);
      for (const vp of VIEWPORTS) {
        results.testsExecuted++;
        results.testsFailed++;
        results.defects.push({
          route,
          viewport: vp.name,
          error: navErr.message,
        });
      }
    }

    if (pageErrors.length > 0) {
      results.consoleErrors.push({
        route,
        errors: pageErrors,
      });
    }

    await page.close();
  }

  await browser.close();

  fs.writeFileSync('test-results/audit-summary.json', JSON.stringify(results, null, 2));
  console.log('\n========================================');
  console.log(`AUDIT FINISHED`);
  console.log(`Total tests: ${results.testsExecuted}`);
  console.log(`Passed: ${results.testsPassed}`);
  console.log(`Failed: ${results.testsFailed}`);
  console.log(`Defects Count: ${results.defects.length}`);
  console.log('Results saved to test-results/audit-summary.json');
  console.log('========================================\n');
}

runAudit().catch(err => {
  console.error('Audit failed with critical error:', err);
  process.exit(1);
});
