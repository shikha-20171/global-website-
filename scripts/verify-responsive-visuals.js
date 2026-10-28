const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'test-results', 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Exactly the 10 critical viewports requested by the user
const CRITICAL_VIEWPORTS = [
  { id: '320x568', name: '320 × 568 (Small Mobile / iPhone SE 1)', width: 320, height: 568, isMobile: true },
  { id: '344x882', name: '344 × 882 (Galaxy Z Fold)', width: 344, height: 882, isMobile: true },
  { id: '390x844', name: '390 × 844 (iPhone 12/13/14)', width: 390, height: 844, isMobile: true },
  { id: '430x932', name: '430 × 932 (iPhone 14/15/16 Pro Max)', width: 430, height: 932, isMobile: true },
  { id: '768x1024', name: '768 × 1024 (iPad Portrait)', width: 768, height: 1024, isTablet: true },
  { id: '820x1180', name: '820 × 1180 (iPad Air Portrait)', width: 820, height: 1180, isTablet: true },
  { id: '1024x768', name: '1024 × 768 (Tablet Landscape)', width: 1024, height: 768, isTablet: true },
  { id: '1024x1366', name: '1024 × 1366 (iPad Pro 13 Portrait)', width: 1024, height: 1366, isTablet: true },
  { id: '1280x720', name: '1280 × 720 (Compact Laptop)', width: 1280, height: 720 },
  { id: '1440x900', name: '1440 × 900 (MacBook Pro)', width: 1440, height: 900 },
];

const AUDIT_PAGES = [
  { route: '/', name: 'home' },
  { route: '/products', name: 'products' },
  { route: '/products/schooly-core', name: 'product-detail' },
  { route: '/pricing', name: 'pricing' },
  { route: '/compare', name: 'compare' },
  { route: '/contact', name: 'contact' },
  { route: '/login', name: 'login' },
];

async function runVisualVerification() {
  console.log(`Starting Visual Verification & Screenshot Capture`);
  console.log(`Testing ${AUDIT_PAGES.length} key pages across ${CRITICAL_VIEWPORTS.length} critical viewports...`);
  console.log(`Screenshots will be stored in: ${SCREENSHOT_DIR}\n`);

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();

  const report = {
    timestamp: new Date().toISOString(),
    viewportsTested: CRITICAL_VIEWPORTS.map(v => v.name),
    pagesTested: AUDIT_PAGES.map(p => p.route),
    checksCount: 0,
    passedChecks: 0,
    defects: [],
    screenshotsCaptured: [],
  };

  for (const pageItem of AUDIT_PAGES) {
    const page = await context.newPage();
    const url = `${BASE_URL}${pageItem.route}`;
    console.log(`\n📄 Auditing Route: ${pageItem.route}`);

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(500);

      for (const vp of CRITICAL_VIEWPORTS) {
        report.checksCount++;
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.waitForTimeout(150);

        // Layout assertions
        const layoutEval = await page.evaluate((vpWidth) => {
          const scrollW = document.documentElement.scrollWidth;
          const innerW = window.innerWidth;
          const hasDocOverflow = scrollW > innerW + 1;

          // Check visible elements
          const badElements = [];
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

            // Exclude elements inside deliberate horizontally scrollable containers
            if (el.closest('.overflow-x-auto, [class*="overflow-x-auto"], table, pre, code')) {
              continue;
            }

            // Exclude elements inside ancestors with overflow hidden/clip
            let parent = el.parentElement;
            let isClipped = false;
            while (parent && parent !== document.body) {
              const ps = window.getComputedStyle(parent);
              if (ps.overflowX === 'hidden' || ps.overflowX === 'clip' || ps.overflow === 'hidden') {
                isClipped = true;
                break;
              }
              parent = parent.parentElement;
            }
            if (isClipped) continue;

            const rect = el.getBoundingClientRect();
            // Check right protrusion
            if (rect.right > innerW + 2) {
              badElements.push({
                type: 'right-protrusion',
                tag: el.tagName.toLowerCase(),
                cls: (el.className || '').toString().slice(0, 40),
                excess: Math.round(rect.right - innerW),
                text: (el.textContent || '').trim().slice(0, 30),
              });
              if (badElements.length >= 3) break;
            }
          }

          // Check buttons / touch targets on mobile
          const smallButtons = [];
          if (vpWidth < 600) {
            const buttons = document.querySelectorAll('button:not([aria-hidden="true"]), a.btn');
            for (const b of buttons) {
              const rect = b.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0 && (rect.width < 28 || rect.height < 28)) {
                // If it's a visible primary CTA, record it
                const style = window.getComputedStyle(b);
                if (style.display !== 'none' && style.visibility !== 'hidden') {
                  smallButtons.push({
                    text: (b.textContent || b.getAttribute('aria-label') || '').trim().slice(0, 25),
                    width: Math.round(rect.width),
                    height: Math.round(rect.height),
                  });
                }
              }
            }
          }

          return {
            hasDocOverflow,
            scrollW,
            innerW,
            badElements,
            smallButtons: smallButtons.slice(0, 2),
          };
        }, vp.width);

        // Capture screenshot
        const screenshotFileName = `${pageItem.name}_${vp.id}.png`;
        const screenshotPath = path.join(SCREENSHOT_DIR, screenshotFileName);
        await page.screenshot({ path: screenshotPath, fullPage: false });
        report.screenshotsCaptured.push(screenshotFileName);

        if (layoutEval.hasDocOverflow || layoutEval.badElements.length > 0) {
          report.defects.push({
            route: pageItem.route,
            viewport: vp.name,
            scrollWidth: layoutEval.scrollW,
            innerWidth: layoutEval.innerW,
            protrudingElements: layoutEval.badElements,
          });
          console.log(`  ❌ ${vp.name}: Overflow +${layoutEval.scrollW - layoutEval.innerW}px (${layoutEval.badElements.length} bad elements)`);
        } else {
          report.passedChecks++;
          console.log(`  ✅ ${vp.name}: OK (Screenshot: ${screenshotFileName})`);
        }
      }
    } catch (err) {
      console.error(`  ⚠️ Error on ${pageItem.route}: ${err.message}`);
      report.defects.push({ route: pageItem.route, error: err.message });
    }

    await page.close();
  }

  await browser.close();

  const reportPath = path.join(__dirname, '..', 'test-results', 'visual-verification-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n========================================`);
  console.log(`VISUAL VERIFICATION FINISHED`);
  console.log(`Total checks: ${report.checksCount}`);
  console.log(`Passed: ${report.passedChecks}`);
  console.log(`Failed / Defects: ${report.defects.length}`);
  console.log(`Screenshots saved: ${report.screenshotsCaptured.length}`);
  console.log(`Report written to: ${reportPath}`);
  console.log(`========================================\n`);
}

runVisualVerification().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
