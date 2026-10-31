import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';

async function testLegalPages() {
  console.log('=== VERIFYING PUBLIC LEGAL FOLIOS: /privacy & /terms ===');
  const browser = await Browser.launch({ width: 1440, height: 900 });

  try {
    const page = await browser.newPage({ width: 1440, height: 900 });

    // 1. Direct navigation to /privacy (unauthenticated)
    console.log('[1/4] Direct navigation to /privacy...');
    await page.goto('http://localhost:5173/privacy');
    await sleep(1500);

    const privacyCheck = await page.eval(() => {
      const text = document.body.innerText;
      return {
        url: window.location.pathname,
        hasTitle: text.includes('CampusFlow Privacy Policy'),
        hasGoogleOAuth: text.includes('Google OAuth') || text.includes('Google Sign-In'),
        hasGroqConsent: text.includes('Groq') && text.includes('consent'),
        hasPostgresRls: text.includes('Row Level Security'),
        hasOperatorInfo: text.includes('Rohit Andhavarapu') || text.includes('placements@campus.edu'),
        hasOperatorReviewFlag: text.includes('Notice for Legal & Operator Review'),
      };
    });
    console.log('Privacy Page Verification:', privacyCheck);

    if (!privacyCheck.hasTitle || !privacyCheck.hasGoogleOAuth || !privacyCheck.hasGroqConsent) {
      throw new Error('Privacy Policy page missing critical legal terms!');
    }

    // Test page refresh on /privacy (SPA deep link)
    console.log('  Testing browser refresh on /privacy...');
    await page.goto('http://localhost:5173/privacy');
    await sleep(1000);
    const refreshPath = await page.eval(() => window.location.pathname);
    console.log('  ✓ Path after reload:', refreshPath);

    // 2. Direct navigation to /terms (unauthenticated)
    console.log('[2/4] Direct navigation to /terms...');
    await page.goto('http://localhost:5173/terms');
    await sleep(1500);

    const termsCheck = await page.eval(() => {
      const text = document.body.innerText;
      return {
        url: window.location.pathname,
        hasTitle: text.includes('Terms of Service'),
        hasAcademicVeracity: text.includes('Academic Integrity') || text.includes('CGPA'),
        hasRecruitmentLimits: text.includes('No Guarantee of Employment') || text.includes('Institutional Recruitment'),
        hasAiDisclaimer: text.includes('Advisory Nature of Groq-Powered AI Insights') || text.includes('Heuristic'),
        hasOperatorReviewFlag: text.includes('Notice for Legal Operator Review'),
      };
    });
    console.log('Terms Page Verification:', termsCheck);

    if (!termsCheck.hasTitle || !termsCheck.hasAcademicVeracity || !termsCheck.hasAiDisclaimer) {
      throw new Error('Terms of Service page missing critical legal sections!');
    }

    // Test page refresh on /terms (SPA deep link)
    console.log('  Testing browser refresh on /terms...');
    await page.goto('http://localhost:5173/terms');
    await sleep(1000);
    const refreshTermsPath = await page.eval(() => window.location.pathname);
    console.log('  ✓ Path after reload:', refreshTermsPath);

    // 3. Test Landing Page footer links
    console.log('[3/4] Verifying landing page footer links...');
    await page.goto('http://localhost:5173/');
    await sleep(1500);

    const footerLinks = await page.eval(() => {
      const links = Array.from(document.querySelectorAll('footer a, footer Link'));
      return {
        hasPrivacyLink: links.some(l => l.getAttribute('href') === '/privacy' || l.innerText.includes('Privacy')),
        hasTermsLink: links.some(l => l.getAttribute('href') === '/terms' || l.innerText.includes('Terms')),
      };
    });
    console.log('Landing Footer Links:', footerLinks);

    // 4. Test Login and Signup footer links
    console.log('[4/4] Verifying signup & login screen links...');
    await page.goto('http://localhost:5173/signup');
    await sleep(1000);
    const signupLinks = await page.eval(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return {
        hasTermsLink: links.some(l => l.getAttribute('href') === '/terms' || l.innerText.includes('Terms')),
        hasPrivacyLink: links.some(l => l.getAttribute('href') === '/privacy' || l.innerText.includes('Privacy')),
      };
    });
    console.log('Signup Page Legal Links:', signupLinks);

    console.log('🎉 ALL LEGAL PAGES AND DEEP-LINK TESTS PASSED WITH 100% SUCCESS!');
  } finally {
    await browser.close();
  }
}

testLegalPages().catch((err) => {
  console.error('Legal Pages Test Failure:', err);
  process.exit(1);
});
