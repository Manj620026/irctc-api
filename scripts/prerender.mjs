import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const distSsrDir = path.join(projectRoot, 'dist-ssr');
const templatePath = path.join(distDir, 'index.html');

async function prerender() {
  console.log('🚀 Starting static prerendering for IRCTC API...');

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Base template not found at ${templatePath}. Run "vite build" first.`);
  }

  const ssrEntryPath = path.join(distSsrDir, 'entry-server.js');
  if (!fs.existsSync(ssrEntryPath)) {
    throw new Error(`SSR bundle not found at ${ssrEntryPath}. Run "vite build --ssr" first.`);
  }

  const template = fs.readFileSync(templatePath, 'utf-8');
  const { render, ROUTE_META } = await import(pathToFileURL(ssrEntryPath).href);

  const routes = [
    '/',
    '/docs',
    '/playground',
    '/terms',
    '/privacy',
    '/pnr-status-api',
    '/irctc-seats-availability-api',
    '/chart-vacant-berths-api',
    '/live-train-status-api',
    '/trains-between-stations-api',
    '/train-fare-api',
    '/train-schedule-api',
    '/guides',
    '/guides/whatsapp-train-status-bot-nodejs',
    '/guides/telegram-vacant-berths-alert-bot',
    '/guides/check-indian-railway-pnr-programmatically',
    '/guides/irctc-seat-availability-tracker-python',
    '/404'
  ];
  const results = [];

  for (const route of routes) {
    const meta = ROUTE_META[route] || ROUTE_META['/'];
    const { html } = render(route);

    if (!html || html.length < 50) {
      throw new Error(`SSR render failed for route "${route}": Output HTML is empty or trivial.`);
    }

    const canonicalUrl = `https://irctc.dev${route === '/' ? '/' : route}`;

    let pageHtml = template;

    // 1. Inject rendered HTML inside root container (use function replacer to avoid $ backreference corruption)
    pageHtml = pageHtml.replace('<div id="root"></div>', () => `<div id="root">${html}</div>`);

    // 2. Inject route title
    pageHtml = pageHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${meta.title}</title>`);

    // 3. Inject meta description & robots tag for 404
    if (route === '/404') {
      pageHtml = pageHtml.replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="description" content="${meta.desc}" />\n    <meta name="robots" content="noindex, nofollow" />`
      );
    } else {
      pageHtml = pageHtml.replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="description" content="${meta.desc}" />`
      );
    }

    // 4. Inject canonical link
    pageHtml = pageHtml.replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${canonicalUrl}" />`
    );

    // 5. Inject OpenGraph tags
    pageHtml = pageHtml.replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${meta.title}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:description" content="${meta.desc}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:url" content="${canonicalUrl}" />`
    );

    // 6. Inject Twitter Card tags
    pageHtml = pageHtml.replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${meta.title}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:description" content="${meta.desc}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:url" content="${canonicalUrl}" />`
    );

    // Determine target file path
    let targetFile;
    if (route === '/') {
      targetFile = path.join(distDir, 'index.html');
    } else if (route === '/404') {
      targetFile = path.join(distDir, '404.html');
    } else {
      const routeDir = path.join(distDir, route.slice(1));
      fs.mkdirSync(routeDir, { recursive: true });
      targetFile = path.join(routeDir, 'index.html');
    }

    fs.writeFileSync(targetFile, pageHtml, 'utf-8');
    const sizeKb = (fs.statSync(targetFile).size / 1024).toFixed(2);
    results.push({ route, targetFile: path.relative(distDir, targetFile), sizeKb: `${sizeKb} KB` });
  }

  // Clean up temporary SSR bundle
  try {
    fs.rmSync(distSsrDir, { recursive: true, force: true });
  } catch (err) {
    console.warn('Could not remove temporary dist-ssr directory:', err);
  }

  console.log('✅ Static Prerendering completed successfully:');
  console.table(results);
}

prerender().catch((err) => {
  console.error('❌ Prerender execution failed:', err);
  process.exit(1);
});
