import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const sitemapPath = path.join(projectRoot, 'public', 'sitemap.xml');
const ledgerPath = path.join(__dirname, 'indexing-ledger.json');

// Default known locations for service account key
const DEFAULT_KEY_PATHS = [
  path.join(projectRoot, 'secrets', 'google-sa.json'),
  process.env.GOOGLE_APPLICATION_CREDENTIALS,
  process.env.GOOGLE_SERVICE_ACCOUNT_KEY
].filter(Boolean);

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: false,
    tier: 'all',
    url: null,
    statusOnly: false,
    force: false,
    keyPath: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--force') options.force = true;
    else if (arg === '--tier' && args[i + 1]) options.tier = args[++i];
    else if (arg === '--url' && args[i + 1]) options.url = args[++i];
    else if (arg === '--status' && args[i + 1]) {
      options.statusOnly = true;
      options.url = args[++i];
    } else if (arg === '--key' && args[i + 1]) options.keyPath = args[++i];
  }

  return options;
}

function resolveServiceAccount(customPath) {
  if (customPath && fs.existsSync(customPath)) {
    return JSON.parse(fs.readFileSync(customPath, 'utf-8'));
  }
  for (const candidate of DEFAULT_KEY_PATHS) {
    if (fs.existsSync(candidate)) {
      return JSON.parse(fs.readFileSync(candidate, 'utf-8'));
    }
  }
  throw new Error(
    'Google Service Account JSON not found! Pass via --key <path> or place in secrets/google-sa.json'
  );
}

function base64url(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input, 'utf-8');
  return buf.toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signInput = `${encodedHeader}.${encodedPayload}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signInput);
  signer.end();
  const signature = signer.sign(sa.private_key);
  const assertion = `${signInput}.${base64url(signature)}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion
    })
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Google OAuth2 Token Exchange failed (HTTP ${res.status}): ${errorBody}`);
  }

  const tokenData = await res.json();
  return tokenData.access_token;
}

function loadSitemapUrls() {
  if (!fs.existsSync(sitemapPath)) {
    throw new Error(`Sitemap not found at ${sitemapPath}`);
  }
  const content = fs.readFileSync(sitemapPath, 'utf-8');
  const locMatches = [...content.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)];
  return locMatches.map(m => m[1]);
}

function classifyTier(url) {
  const pathname = new URL(url).pathname;
  if (pathname === '/' || pathname === '/docs' || pathname === '/playground') {
    return { tier: 1, name: 'Tier 1: Core Authority Hubs' };
  }
  if (
    pathname.includes('-api') &&
    !pathname.includes('/guides/')
  ) {
    return { tier: 2, name: 'Tier 2: Programmatic Feature Landings' };
  }
  if (pathname.startsWith('/guides')) {
    return { tier: 3, name: 'Tier 3: Long-Tail Technical Guides' };
  }
  if (pathname === '/privacy' || pathname === '/terms') {
    return { tier: 4, name: 'Tier 4: Legal & EEAT Trust' };
  }
  return { tier: 5, name: 'Tier 5: Other Public Routes' };
}

function loadLedger() {
  if (fs.existsSync(ledgerPath)) {
    try {
      return JSON.parse(fs.readFileSync(ledgerPath, 'utf-8'));
    } catch {
      return {};
    }
  }
  return {};
}

function saveLedger(ledger) {
  fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2), 'utf-8');
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const options = parseArgs();
  console.log('═══════════════════════════════════════════════════════════');
  console.log(' 🚀 IRCTC.DEV — GOOGLE INDEXING API AUTOMATION PIPELINE    ');
  console.log('═══════════════════════════════════════════════════════════');

  const sa = resolveServiceAccount(options.keyPath);
  console.log(`🔑 Service Account: ${sa.client_email}`);
  console.log(`📦 Google Cloud Project: ${sa.project_id}`);

  console.log('\n⏳ Authenticating with Google OAuth2 (RS256 JWT)...');
  const accessToken = await getAccessToken(sa);
  console.log('✅ Access Token acquired successfully from Google!');

  // Status check mode
  if (options.statusOnly && options.url) {
    console.log(`\n🔍 Checking Google Indexing status for: ${options.url}`);
    const metadataUrl = `https://indexing.googleapis.com/v3/urlNotifications/metadata?url=${encodeURIComponent(options.url)}`;
    const res = await fetch(metadataUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const statusData = await res.json();
    console.log('📊 Current Google Metadata:', JSON.stringify(statusData, null, 2));
    return;
  }

  // Determine URLs to publish
  let targetUrls = [];
  if (options.url) {
    targetUrls = [options.url];
  } else {
    targetUrls = loadSitemapUrls();
  }

  const ledger = loadLedger();
  const classified = targetUrls.map(url => ({
    url,
    ...classifyTier(url),
    lastIndexed: ledger[url]?.submittedAt || null
  }));

  // Filter by tier if specified
  let filtered = classified;
  if (options.tier !== 'all') {
    const tierNum = parseInt(options.tier, 10);
    filtered = classified.filter(c => c.tier === tierNum);
  }

  console.log(`\n📋 Target URLs to process: ${filtered.length} (Filter: Tier ${options.tier})`);
  console.table(
    filtered.map(f => ({
      Tier: f.tier,
      URL: f.url.replace('https://irctc.dev', ''),
      LastSubmitted: f.lastIndexed ? new Date(f.lastIndexed).toLocaleDateString() : 'Never'
    }))
  );

  if (options.dryRun) {
    console.log('\n💡 [DRY-RUN MODE]: Verification complete. Zero API quota consumed.');
    console.log('👉 To publish live, run: node scripts/google-index.mjs');
    return;
  }

  console.log('\n🚀 Starting live URL publish to Google Indexing API...');
  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < filtered.length; i++) {
    const item = filtered[i];
    const prev = ledger[item.url];

    // Check if submitted within last 12 hours (unless --force)
    if (!options.force && prev && prev.submittedAt) {
      const hoursSince = (Date.now() - new Date(prev.submittedAt).getTime()) / (1000 * 60 * 60);
      if (hoursSince < 12 && prev.status === 200) {
        console.log(`[${i + 1}/${filtered.length}] ⏭️  SKIP: ${item.url} (Submitted ${hoursSince.toFixed(1)}h ago)`);
        skippedCount++;
        continue;
      }
    }

    process.stdout.write(`[${i + 1}/${filtered.length}] 📡 Submitting: ${item.url} ... `);

    try {
      const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: item.url,
          type: 'URL_UPDATED'
        })
      });

      const responseBody = await res.json();

      if (res.ok) {
        const notifyTime = responseBody.urlNotificationMetadata?.latestUpdate?.notifyTime || new Date().toISOString();
        console.log(`✅ 200 OK (NotifyTime: ${notifyTime})`);
        ledger[item.url] = {
          status: 200,
          type: 'URL_UPDATED',
          notifyTime,
          submittedAt: new Date().toISOString(),
          response: responseBody
        };
        successCount++;
      } else {
        console.log(`❌ ERROR ${res.status}: ${responseBody.error?.message || JSON.stringify(responseBody)}`);
        ledger[item.url] = {
          status: res.status,
          error: responseBody.error?.message || 'Unknown error',
          submittedAt: new Date().toISOString()
        };
        errorCount++;
      }
    } catch (err) {
      console.log(`❌ Network Exception: ${err.message}`);
      errorCount++;
    }

    saveLedger(ledger);
    // Respect rate limits with 400ms delay between calls
    await sleep(400);
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`🎉 RUN COMPLETE: ${successCount} Published | ${skippedCount} Skipped | ${errorCount} Errors`);
  console.log(`📁 Audit ledger updated at: ${path.relative(projectRoot, ledgerPath)}`);
  console.log('═══════════════════════════════════════════════════════════');
}

main().catch(err => {
  console.error('\n💥 Execution Aborted:', err.message);
  process.exit(1);
});
