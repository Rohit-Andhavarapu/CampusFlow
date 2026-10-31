import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';

async function testRouteGuard() {
  console.log('--- Testing Role Authorization & Guard for Real Users ---');
  const browser = await Browser.launch({ width: 1440, height: 900 });

  try {
    const page = await browser.newPage({ width: 1440, height: 900 });

    // 1. Visit /login and sign in with clean real student
    await page.goto('http://localhost:5173/login');
    await sleep(1500);

    // Fill in real student credentials
    await page.eval(() => {
      const emailInput = document.querySelector('input[type="email"]');
      const passInput = document.querySelector('input[type="password"]');
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      if (emailInput && passInput) {
        nativeSetter.call(emailInput, 'real.student.test@campus.edu');
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        nativeSetter.call(passInput, 'CampusFlowPassword2026!');
        passInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      setTimeout(() => {
        const btn = document.querySelector('button[type="submit"]');
        btn?.click();
      }, 100);
    });

    for (let i = 0; i < 20; i++) {
      await sleep(500);
      const url = await page.eval(() => window.location.pathname);
      if (url.includes('/student/dashboard')) break;
    }

    let currentUrl = await page.eval(() => window.location.pathname);
    console.log('✓ Signed in as real student, current path:', currentUrl);

    // 2. Attempt unauthorized navigation to /admin/dashboard
    console.log('Attempting unauthorized navigation to /admin/dashboard...');
    await page.goto('http://localhost:5173/admin/dashboard');
    await sleep(2000);

    currentUrl = await page.eval(() => window.location.pathname);
    console.log('Current URL after navigating to /admin/dashboard:', currentUrl);
    if (currentUrl.includes('/student/dashboard')) {
      console.log('✓ PASS: Real student was successfully intercepted and redirected to /student/dashboard!');
    } else {
      console.error('✗ FAIL: Real student was not redirected, current URL:', currentUrl);
      process.exit(1);
    }

    // 3. Attempt unauthorized navigation to /recruiter/dashboard
    console.log('Attempting unauthorized navigation to /recruiter/dashboard...');
    await page.goto('http://localhost:5173/recruiter/dashboard');
    await sleep(2000);

    currentUrl = await page.eval(() => window.location.pathname);
    console.log('Current URL after navigating to /recruiter/dashboard:', currentUrl);
    if (currentUrl.includes('/student/dashboard')) {
      console.log('✓ PASS: Real student was successfully intercepted away from /recruiter/dashboard!');
    } else {
      console.error('✗ FAIL: Real student was not redirected, current URL:', currentUrl);
      process.exit(1);
    }

    console.log('🎉 ALL ROUTE GUARD TESTS PASSED WITH 100% SUCCESS!');
  } finally {
    await browser.close();
  }
}

testRouteGuard().catch((err) => {
  console.error('Route Guard Test Error:', err);
  process.exit(1);
});
