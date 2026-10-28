const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  await page.goto('http://localhost:3001/login');
  await page.fill('input[type="email"]', 'admin@dezoryn.com');
  await page.fill('input[type="password"]', 'SuperSecretAdminPassword2026!');
  await page.click('button[type="submit"]');
  await page.waitForURL('http://localhost:3001/', { timeout: 15000 });

  await page.goto('http://localhost:3001/products');
  await page.waitForFunction(() => !document.body.innerText.includes('Verifying Super Admin Session'), { timeout: 15000 });
  await page.setViewportSize({ width: 375, height: 667 });

  await page.click('button:has-text("Add New Product")');
  await page.waitForTimeout(400);

  const tabLabels = ['1. General', '2. Content & Features', '3. Commercial', '4. Media & Gallery', '5. SEO', '6. Publishing & Web'];

  for (const tab of tabLabels) {
    const tabBtn = page.locator(`button:has-text("${tab}")`);
    await tabBtn.click();
    await page.waitForTimeout(200);

    const check = await page.evaluate((tName) => {
      const modal = document.querySelector('[role="dialog"]');
      const body = modal.querySelector('.overflow-y-auto');
      const bad = [];
      body.querySelectorAll('*').forEach(el => {
        if (el.offsetWidth === 0) return;
        const r = el.getBoundingClientRect();
        const mRect = modal.getBoundingClientRect();
        if (r.right > mRect.right + 2) {
          bad.push({ tag: el.tagName, cls: el.className, text: (el.innerText || '').slice(0, 30), diff: Math.round(r.right - mRect.right) });
        }
      });
      return { tab: tName, scrollW: body.scrollWidth, clientW: body.clientWidth, bad };
    }, tab);

    console.log(`Tab [${tab}]:`, check.scrollW > check.clientW ? `INTERNAL OVERFLOW (+${check.scrollW - check.clientW}px)` : 'OK', check.bad.length > 0 ? check.bad : '');
  }

  await browser.close();
})();

