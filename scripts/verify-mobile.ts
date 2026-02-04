
import { chromium } from 'playwright';
import { spawn } from 'child_process';

async function main() {
  console.log('Starting verification...');

  // Start the Next.js server
  const PORT = 3005;
  const server = spawn('npm', ['run', 'dev', '--', '-p', String(PORT)], {
    cwd: process.cwd(),
    stdio: 'pipe',
    shell: true,
    env: { ...process.env, PORT: String(PORT) },
  });

  const serverUrl = `http://localhost:${PORT}`;

  // Wait for server to be ready
  await new Promise<void>((resolve) => {
    server.stdout.on('data', (data) => {
      const str = data.toString();
      console.log('[Next.js]', str);
      if (str.includes('Ready in') || str.includes('started server on') || str.includes(`http://localhost:${PORT}`)) {
        resolve();
      }
    });
    // Fallback if stdout is not reliable or buffered
    setTimeout(() => {
        resolve();
    }, 15000);
  });

  console.log(`Server potentially ready at ${serverUrl}`);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }, // iPhone SE dimensions
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();

  const routes = ['/', '/vysledky', '/galerie'];
  let hasErrors = false;

  for (const route of routes) {
    const url = `${serverUrl}${route}`;
    console.log(`Checking ${url}...`);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      // Check for horizontal overflow
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      if (overflow) {
        console.error(`❌ Overflow detected on ${route}`);
        hasErrors = true;
      } else {
        console.log(`✅ Layout OK on ${route}`);
      }

      // Screenshot
      // await page.screenshot({ path: `mobile-verify-${route.replace('/', '') || 'home'}.png` });

    } catch (e) {
      console.error(`❌ Error checking ${route}:`, e);
      hasErrors = true;
    }
  }

  await browser.close();
  server.kill();

  if (hasErrors) {
    console.log('Verification FAILED.');
    process.exit(1);
  } else {
    console.log('Verification PASSED.');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
