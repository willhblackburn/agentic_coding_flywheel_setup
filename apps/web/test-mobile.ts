/**
 * Mobile viewport testing script using Playwright
 * Run with: bunx playwright test test-mobile.ts --headed
 */
import { chromium, devices } from 'playwright';

const PAGES_TO_TEST = [
  { path: '/', name: 'landing' },
  { path: '/flywheel', name: 'flywheel' },
  { path: '/wizard/os-selection', name: 'wizard-os' },
  { path: '/wizard/install-terminal', name: 'wizard-terminal' },
  { path: '/wizard/generate-ssh-key', name: 'wizard-ssh' },
  { path: '/wizard/rent-vps', name: 'wizard-vps' },
  { path: '/wizard/create-vps', name: 'wizard-create' },
  { path: '/wizard/ssh-connect', name: 'wizard-connect' },
  { path: '/wizard/run-installer', name: 'wizard-install' },
  { path: '/wizard/reconnect-ubuntu', name: 'wizard-reconnect' },
  { path: '/wizard/status-check', name: 'wizard-status' },
  { path: '/wizard/launch-onboarding', name: 'wizard-launch' },
];

const VIEWPORTS = [
  { name: 'iPhone SE', ...devices['iPhone SE'].viewport },
  { name: 'iPhone 14', ...devices['iPhone 14'].viewport },
  { name: 'Pixel 5', ...devices['Pixel 5'].viewport },
];

interface TestResult {
  page: string;
  viewport: string;
  issues: string[];
  passed: boolean;
}

async function testMobileViewports() {
  const browser = await chromium.launch({ headless: true });
  const results: TestResult[] = [];

  console.log('🧪 Starting mobile viewport tests...\n');

  for (const viewport of VIEWPORTS) {
    console.log(`📱 Testing viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);

    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });

    const page = await context.newPage();

    for (const testPage of PAGES_TO_TEST) {
      const issues: string[] = [];

      try {
        // Navigate to page
        await page.goto(`http://localhost:3000${testPage.path}`, {
          waitUntil: 'networkidle',
          timeout: 10000,
        });

        // Wait for animations to settle
        await page.waitForTimeout(500);

        // Test 1: Check for horizontal overflow
        const hasHorizontalOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        if (hasHorizontalOverflow) {
          issues.push('❌ Horizontal overflow detected');

          // Find the overflowing element
          const overflowingElements = await page.evaluate(() => {
            const docWidth = document.documentElement.clientWidth;
            const elements: string[] = [];
            document.querySelectorAll('*').forEach(el => {
              const rect = el.getBoundingClientRect();
              if (rect.right > docWidth + 10) {
                const tag = el.tagName.toLowerCase();
                const className = el.className?.toString().slice(0, 50) || '';
                elements.push(`${tag}.${className}`);
              }
            });
            return elements.slice(0, 5);
          });

          if (overflowingElements.length > 0) {
            issues.push(`   Overflowing: ${overflowingElements.join(', ')}`);
          }
        }

        // Test 2: Check for touch target sizes
        const smallTouchTargets = await page.evaluate(() => {
          const MIN_SIZE = 44; // Apple HIG minimum
          const small: string[] = [];

          document.querySelectorAll('button, a, [role="button"], input, select, textarea').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              if (rect.width < MIN_SIZE || rect.height < MIN_SIZE) {
                const tag = el.tagName.toLowerCase();
                const text = (el.textContent || '').slice(0, 20).trim();
                small.push(`${tag}[${text}]: ${Math.round(rect.width)}x${Math.round(rect.height)}`);
              }
            }
          });

          return small.slice(0, 5);
        });

        if (smallTouchTargets.length > 0) {
          issues.push(`⚠️  Small touch targets: ${smallTouchTargets.join(', ')}`);
        }

        // Test 3: Check for text that's too small
        const smallText = await page.evaluate(() => {
          const MIN_FONT_SIZE = 12; // Minimum readable on mobile
          const small: string[] = [];

          document.querySelectorAll('p, span, div, li, td, th').forEach(el => {
            const style = window.getComputedStyle(el);
            const fontSize = parseFloat(style.fontSize);
            const text = (el.textContent || '').trim();

            if (fontSize > 0 && fontSize < MIN_FONT_SIZE && text.length > 5) {
              small.push(`${el.tagName.toLowerCase()}(${fontSize}px): "${text.slice(0, 20)}"`);
            }
          });

          return small.slice(0, 3);
        });

        if (smallText.length > 0) {
          issues.push(`📝 Small text: ${smallText.join(', ')}`);
        }

        // Test 4: Check main content is visible (not hidden behind fixed elements)
        const contentVisible = await page.evaluate(() => {
          const main = document.querySelector('main') || document.querySelector('[role="main"]');
          if (!main) return true;

          const rect = main.getBoundingClientRect();
          // Check if main content starts below the fold on mobile
          return rect.top < window.innerHeight * 0.5;
        });

        if (!contentVisible) {
          issues.push('⚠️  Main content may be pushed down too far');
        }

        // Take screenshot for manual review
        await page.screenshot({
          path: `./mobile-screenshots/${viewport.name.replace(/\s+/g, '-')}-${testPage.name}.png`,
          fullPage: true,
        });

      } catch (error) {
        issues.push(`🔥 Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      const passed = issues.length === 0;
      results.push({
        page: testPage.path,
        viewport: viewport.name,
        issues,
        passed,
      });

      console.log(`  ${passed ? '✅' : '❌'} ${testPage.path}`);
      if (!passed) {
        issues.forEach(issue => console.log(`     ${issue}`));
      }
    }

    await context.close();
    console.log('');
  }

  await browser.close();

  // Summary
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;

  console.log('\n' + '='.repeat(60));
  console.log(`📊 SUMMARY: ${passedCount}/${totalCount} tests passed`);
  console.log('='.repeat(60));

  // Group issues by type
  const allIssues = results.filter(r => !r.passed);
  if (allIssues.length > 0) {
    console.log('\n⚠️  Pages with issues:');
    allIssues.forEach(r => {
      console.log(`\n  ${r.viewport} - ${r.page}:`);
      r.issues.forEach(i => console.log(`    ${i}`));
    });
  } else {
    console.log('\n🎉 All mobile tests passed!');
  }

  return results;
}

// Create screenshots directory and run tests
import { mkdir } from 'fs/promises';

(async () => {
  await mkdir('./mobile-screenshots', { recursive: true });
  await testMobileViewports();
})().catch(console.error);
