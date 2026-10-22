<div align="center">

# 🚄 IRCTC Developer Portal & API Playground
**Official Web Portal, Interactive Documentation & Developer Console for IRCTC Railway API**

[![Live Portal](https://img.shields.io/badge/Portal-irctc.dev-orange.svg?style=for-the-badge)](https://irctc.dev)
[![API Gateway](https://img.shields.io/badge/API-api.irctc.dev-blue.svg?style=for-the-badge)](https://api.irctc.dev)
[![API Version](https://img.shields.io/badge/API%20Version-v1.0.1-emerald.svg?style=for-the-badge)](https://api.irctc.dev/health)
[![npm version](https://img.shields.io/npm/v/irctc-api.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/irctc-api)
[![npm downloads](https://img.shields.io/npm/dm/irctc-api.svg?style=for-the-badge&logo=npm&color=CB3837)](https://www.npmjs.com/package/irctc-api)
[![npm total downloads](https://img.shields.io/npm/dt/irctc-api.svg?style=for-the-badge&logo=npm&color=blue)](https://www.npmjs.com/package/irctc-api)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

*The official open-source repository for the **IRCTC Developer Portal, API Playground & Interactive Documentation Web App**.  
Designed for developers building train tracking applications, travel booking integrations, and railway intelligence systems.*

</div>

---

## 🌐 Quick Access & Ecosystem Matrix

| Resource | URL | Description |
|---|---|---|
| **🌍 Web Portal** | [https://irctc.dev](https://irctc.dev) | High-performance developer platform & landing page |
| **⚡ API Gateway** | [https://api.irctc.dev](https://api.irctc.dev) | Production REST API base URL (v1.0.1) |
| **🧪 API Playground** | [https://irctc.dev/playground](https://irctc.dev/playground) | In-browser interactive API sandbox with real-time latency benchmarks |
| **📑 Documentation** | [https://irctc.dev/docs](https://irctc.dev/docs) | Complete endpoint schemas, parameters & multi-language code snippets |
| **🔑 Developer Console** | [https://irctc.dev/dashboard](https://irctc.dev/dashboard) | Google OAuth, API key management, quota tracking & telemetry logs |
| **📦 Official Client SDK** | [`irctc-api` on npm](https://www.npmjs.com/package/irctc-api) | Zero-dependency Node.js & TypeScript client library (v4.0.2) |
| **📫 Developer Support** | [support@irctc.dev](mailto:support@irctc.dev) | Integration assistance, technical inquiries & enterprise support |

---

> ### 🎁 Developer Welcome Bonus: Get 10,000 Free Credits Instantly!
> **Sign up with Google in under 5 seconds** at [irctc.dev/dashboard](https://irctc.dev/dashboard) — **no credit card required**.  
> Every new developer account receives **10,000 free API credits** immediately upon registration to test live train tracking, PNR verification, station search, and timetables in our interactive sandbox or your own applications.  
> Need more volume? Top up **100,000 credits for just ₹99** anytime!

---

## 🏗️ Platform Architecture

The web application is built as a blazing-fast, edge-deployed single-page application (SPA) communicating securely with the production API Gateway:

```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                   DEVELOPER CLIENTS                                     │
│             Web Browsers   •   Mobile Devices   •   Official Client SDKs                │
└────────────────────────────────────────────┬────────────────────────────────────────────┘
                                             │ HTTPS
                                             ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    CLOUDFLARE EDGE                                      │
│           DDoS Protection  •  HSTS Preload  •  CSP Level 3  •  Global Edge CDN          │
└────────────────────────────┬───────────────────────────────────────────┬────────────────┘
                             │                                           │
             (Web App Traffic)                                           │ (API Gateway Traffic)
                             ▼                                           ▼
┌──────────────────────────────────────────────┐  ┌──────────────────────────────────────┐
│  DEVELOPER PORTAL & PLAYGROUND               │  │  PRODUCTION API GATEWAY              │
│  (This Repository)                           │  │  (api.irctc.dev)                     │
│  • React 19 + Tailwind CSS v4 + Vite 8       │  │  • Sub-millisecond Execution         │
│  • Interactive Terminal Playground           │  │  • Rate Limiting & Auth Validation    │
│  • Google OAuth & Live Key Lifecycle Engine  │  │  • Real-Time Railway Intelligence     │
│  • Symmetric Multi-Tab Auth Synchronization  │  │  • High-Precision hrtime Stamping    │
│  • RFC 4180 / CWE-1236 Secure CSV Exporter   │  │  • REST Endpoints & JSON Envelopes    │
└──────────────────────────────────────────────┘  └──────────────────────────────────────┘
```

---

## ✨ Key Frontend Features & Capabilities

### 1. 🧪 In-Browser Interactive API Playground
- **Zero-Setup Testing**: Execute live authenticated queries against all railway endpoints (train search, schedule, fare breakup, cancelled trains, live GPS status, NTES station board, and PNR verification) directly from the browser.
- **Latency Benchmarking**: Automatically captures network round-trip time (`performance.now()`) alongside server execution times (`_time`).
- **Race Condition Prevention**: Employs `AbortController` to cancel in-flight queries when switching endpoints, preventing stale responses from overwriting active state.
- **Screen-Share Safety**: Masked password inputs (`type="password"`) with an explicit `+ Use My Key` populator and visual reveal toggle.

### 2. 🔑 Self-Service Developer Console (`/dashboard`)
- **Native Google OAuth**: One-click authentication powered by `@react-oauth/google` with Cross-Origin-Opener-Policy isolation.
- **API Key Lifecycle**: Generate production API keys with custom expiration periods (7 days, 14 days, 30 days, or never) and instant revocation.
- **Quota & Credit Tracking**: Real-time visual progress bars displaying monthly request usage and remaining quota balance.
- **Instant Top-Up**: Integrated Razorpay checkout flow with automated payment verification and 3-second background polling reconciliation.
- **Telemetry Logs Viewer & CSV Export**: Searchable table of past requests with RFC 4180 formula injection defense.

### 3. 📑 Comprehensive API Documentation (`/docs`)
- **Complete Endpoint Specifications**: Method, path, query parameters, request bodies, and expected response payloads for all railway intelligence endpoints.
- **Multi-Language Snippets**: Interactive code tabs for TypeScript (`fetch`), Python (`requests`), and cURL.
- **Pure React Token Renderer**: Eliminates raw HTML injection sinks with a safe syntax token renderer.

### 4. 📱 Mobile Touch Ergonomics & Micro-Interactions
- **iOS Safari Auto-Zoom Prevention**: Input fields lock to `16px` on coarse pointer devices to eliminate unwanted zoom on focus.
- **Zero-Delay Mobile Tap**: Buttons and interactive controls enforce `touch-action: manipulation`, eliminating native 300ms tap latency.
- **Adaptive 3-Tab Sandbox**: On mobile viewports (`< 1024px`), the playground seamlessly transitions from a multi-column desktop layout into a segmented switcher (`Endpoints` • `Config` • `Response`).
- **Framer Motion Spring Physics**: Fluid animated navigation capsules (`layoutId="active-pill"`) and animated live terminal firehose streams.

### 5. ⚖️ Legal & Compliance Suite (`/terms` & `/privacy`)
- Complete commercial terms of service and DPDP/GDPR-compliant privacy policy featuring responsive mobile bottom-sheet index drawers and smooth anchor scrolling.

---

## 📂 Repository Directory Tree (Core Files)

This repository contains the complete source code for the **Developer Portal, Interactive Playground & Documentation Client**:

```text
irctc-api/
├── .env.example                         # Environment template showing Google OAuth & API Gateway variables
├── .gitignore                           # Excludes secrets (.env*), blueprints, reports, node_modules, and dist
├── .oxlintrc.json                       # Fast Rust-based Oxlint configuration for React 19 & hooks rules
├── LICENSE                              # Standard MIT open-source license
├── README.md                            # Comprehensive developer documentation
├── index.html                           # Root HTML5 shell with mobile viewport-fit and dark theme metadata
├── package.json                         # NPM manifest defining React 19, Vite 8, Tailwind v4 & scripts
├── package-lock.json                    # Deterministic lockfile (0 npm audit vulnerabilities)
├── postcss.config.js                    # PostCSS pipeline integrating Tailwind CSS v4 and Autoprefixer
├── tailwind.config.js                   # Design tokens: base (#050505), surface (#121212), brand (#ff4d00)
├── tsconfig.json                        # Root TypeScript project reference orchestrator
├── tsconfig.app.json                    # Strict compiler settings for browser code inside src/
├── tsconfig.node.json                   # Compiler configuration for build scripts (vite.config.ts)
├── vite.config.ts                       # Vite config with strict port 4000, COOP headers, and preview parity
│
├── public/
│   ├── _headers                         # Production Cloudflare Pages headers (CSP Level 3, HSTS Preload, COOP)
│   ├── _redirects                       # SPA routing fallback directive (/* /index.html 200)
│   └── favicon.svg                      # Scalable architectural brand identity graphic
│
└── src/
    ├── App.tsx                          # Router layout, dynamic navigation island, and hash anchor preservation
    ├── ErrorBoundary.tsx                # Class error boundary with production stack trace suppression
    ├── index.css                        # Global CSS declaring Inter & JetBrains Mono fonts and touch rules
    ├── main.tsx                         # Client bootstrap inside GoogleOAuthProvider & React StrictMode
    │
    ├── context/
    │   └── AuthContext.tsx              # Symmetric cross-tab session sync, 401 handling, and user hydration
    │
    └── pages/
        ├── ApiPlayground.tsx            # Interactive API tester, AbortController cancellation & key masking
        ├── Dashboard.tsx                # Key management, RFC 4180 CSV export & Razorpay top-up flow
        ├── Docs.tsx                     # API reference, syntax tokenizer & multi-language tabs
        ├── LandingPage.tsx              # Conversion hero, animated request firehose & benchmark stats
        ├── Privacy.tsx                  # DPDP/GDPR compliant privacy policy with mobile bottom sheet index
        └── Terms.tsx                    # Commercial API usage agreement with mobile drawer navigation
```

---

## 🔑 Authentication & API Key Transport

All API requests to `https://api.irctc.dev` require a valid API key obtained via your [Developer Console](https://irctc.dev/dashboard). Pass your key using any of the following 3 standard mechanisms:

### 1. HTTP Bearer Token (Recommended)
```http
Authorization: Bearer YOUR_API_KEY
```

### 2. Custom Header
```http
x-api-key: YOUR_API_KEY
```

### 3. Query Parameter (Quick Prototyping & Webhooks)
```http
https://api.irctc.dev/api/v1/live/12301?api_key=YOUR_API_KEY
```

---

## ⚡ Multi-Language Quickstart & SDK Reference

### 1. TypeScript / ESM (via Official `irctc-api` SDK)

Install the zero-dependency client from npm:
```bash
npm install irctc-api
```

```typescript
import { 
  IrctcApi, 
  IrctcApiError, 
  RateLimitError, 
  AuthenticationError, 
  NotFoundError 
} from 'irctc-api';

const client = new IrctcApi({
  apiKey: process.env.IRCTC_API_KEY,
  baseUrl: 'https://api.irctc.dev', // Production API Gateway
  timeout: 15000,                   // Request timeout in ms (default: 30000)
});

async function runRailwayQueries() {
  try {
    // 1. Search Trains Between Stations
    const trains = await client.trains.search({
      from: 'NDLS',
      to: 'PNBE',
      date: '2026-10-15',
    });
    console.log(`Found ${trains.length} direct trains.`);

    // 2. Search Trains by Full or Partial Name
    const rajdhaniTrains = await client.trains.searchByName('rajdhani');

    // 3. Complete Train Route Timetable & Halts
    const schedule = await client.trains.getSchedule('12309');
    console.log(`Train ${schedule.trainName} has ${schedule.stations.length} halts.`);

    // 4. Station Autocomplete Search
    const stations = await client.stations.search('patna');

    // 5. Station Daily Timetable (Scheduled Arrivals & Departures)
    const stationBoard = await client.stations.getTimetable('NDLS', '2026-10-15');

    // 6. Station Metadata (Zone, State, Name)
    const stationMeta = await client.stations.getByCode('NDLS');

    // 7. Real-Time GPS Train Running Status & Delay
    const live = await client.live.getStatus('12558', { date: '2026-10-15' });
    console.log(`Location: ${live.currentLocation} | Status: ${live.currentDelayStr}`);

    // 8. Real-Time PNR Confirmation & Charting
    const pnr = await client.pnr.check('2434567890');
    console.log(`Train: ${pnr.trainNumber} | Chart: ${pnr.chartStatus}`);

    // 9. Gateway Health & Status
    const health = await client.health();
    console.log(`Status: ${health.status} | Version: ${health.version}`);

  } catch (error) {
    if (error instanceof RateLimitError) {
      console.error('Rate limit reached. Retry after a few seconds.');
    } else if (error instanceof AuthenticationError) {
      console.error('Invalid or missing API key.');
    } else if (error instanceof NotFoundError) {
      console.error('Train, station, or PNR not found in database.');
    } else if (error instanceof IrctcApiError) {
      console.error(`API Error [${error.status}]: ${error.message}`);
    } else {
      console.error('Network or unexpected error:', error);
    }
  }
}

runRailwayQueries();
```

---

### 2. JavaScript / Node.js (CommonJS)

```javascript
const { IrctcApi, RateLimitError } = require('irctc-api');

const client = new IrctcApi({
  apiKey: process.env.IRCTC_API_KEY,
  baseUrl: 'https://api.irctc.dev',
});

async function main() {
  try {
    const live = await client.live.getStatus('12309');
    console.log('Live Status:', live.currentLocation, live.currentDelayStr);
  } catch (err) {
    if (err instanceof RateLimitError) {
      console.error('Hit rate limit, slowing down...');
    }
  }
}
main();
```

---

### 3. Python 3.9+ (`requests` / `httpx`)

```python
import os
import requests

API_KEY = os.getenv("IRCTC_API_KEY", "your_api_key_here")
BASE_URL = "https://api.irctc.dev"

headers = {
    "x-api-key": API_KEY,
    "accept": "application/json"
}

# 1. Search Trains Between Stations
response = requests.get(
    f"{BASE_URL}/api/v1/trains/search",
    params={"from": "NDLS", "to": "PNBE", "date": "2026-10-15"},
    headers=headers,
    timeout=10
)
print("Trains:", response.json())

# 2. Live GPS Running Status
live_resp = requests.get(
    f"{BASE_URL}/api/v1/live/12558",
    params={"date": "2026-10-15"},
    headers=headers,
    timeout=10
)
print("Live:", live_resp.json())

# 3. Real-Time PNR Status
pnr_resp = requests.get(f"{BASE_URL}/api/v1/pnr/2434567890", headers=headers, timeout=10)
print("PNR:", pnr_resp.json())

# 4. Official Train Fare Breakup
fare_resp = requests.get(
    f"{BASE_URL}/api/v1/trains/12558/fare",
    params={"from": "ANVT", "to": "MFP", "class": "all", "quota": "GN"},
    headers=headers,
    timeout=10
)
print("Fare Breakup:", fare_resp.json())

# 5. Daily Cancelled Trains
cancelled_resp = requests.get(f"{BASE_URL}/api/v1/trains/cancelled", headers=headers, timeout=10)
print("Cancelled Trains:", cancelled_resp.json())

# 6. Live Station Board (Arrivals/Departures)
station_board_resp = requests.get(
    f"{BASE_URL}/api/v1/live/station/NDLS",
    params={"hours": 2},
    headers=headers,
    timeout=10
)
print("Live Station Board:", station_board_resp.json())
```

---

### 4. cURL (Command Line Interface)

```bash
# 1. Live Train Tracking
curl -s -X GET "https://api.irctc.dev/api/v1/live/12558?date=2026-10-15" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "accept: application/json"

# 2. Train Search
curl -s -X GET "https://api.irctc.dev/api/v1/trains/search?from=NDLS&to=PNBE&date=2026-10-15" \
  -H "Authorization: Bearer YOUR_API_KEY"

# 3. Station Autocomplete
curl -s -X GET "https://api.irctc.dev/api/v1/trains/stations?q=patna" \
  -H "x-api-key: YOUR_API_KEY"

# 4. Calculate Train Fare Breakup
curl -s -X GET "https://api.irctc.dev/api/v1/trains/12558/fare?from=ANVT&to=MFP&class=all&quota=GN" \
  -H "x-api-key: YOUR_API_KEY"

# 5. Get Daily Cancelled Trains
curl -s -X GET "https://api.irctc.dev/api/v1/trains/cancelled" \
  -H "x-api-key: YOUR_API_KEY"

# 6. Live Station Board (NTES Arrivals & Departures)
curl -s -X GET "https://api.irctc.dev/api/v1/live/station/NDLS?hours=2" \
  -H "x-api-key: YOUR_API_KEY"

# 7. Gateway Health Check (No Key Required)
curl -s -X GET "https://api.irctc.dev/health"
```

---

## 📡 Complete REST API Catalog

Base URL: `https://api.irctc.dev`

### A. Railway Intelligence & Tracking Endpoints

| Category | Endpoint | Method | Key Parameters | Description |
|---|---|:---:|---|---|
| **System** | `/health` | `GET` | None | Check API gateway liveness, service status & platform version (v1.0.1) |
| **Trains** | `/api/v1/trains/search` | `GET` | `from`, `to`, `date` (YYYY-MM-DD) | Sub-millisecond direct route search between stations |
| **Trains** | `/api/v1/trains/search/name` | `GET` | `name` (min 2 chars) | Search trains by partial or full name string |
| **Trains** | `/api/v1/trains/:trainNo` | `GET` | `:trainNo` (5-digit) | Full timetable, route halts, distance & lat/lng coordinates |
| **Trains** | `/api/v1/trains/:trainNo/fare` | `GET` | `:trainNo`, `from`, `to`, `class` (default `all`), `quota` (default `GN`) | Real-time official IRCTC ticket fare breakup (Base, Superfast, GST, Catering) |
| **Trains** | `/api/v1/trains/cancelled` | `GET` | None | Daily fully & partially cancelled trains across Indian Railways (0ms cache) |
| **Stations** | `/api/v1/trains/stations` | `GET` | `q` (min 2 chars) | High-speed prefix-tree station autocomplete |
| **Stations** | `/api/v1/trains/stations/:code` | `GET` | `:code` (e.g. `NDLS`) | Station metadata, full name, railway zone & state |
| **Stations** | `/api/v1/trains/stations/:code/timetable/:date` | `GET` | `:code`, `:date` (optional) | Scheduled daily arrivals and departures for a station |
| **Live Tracking** | `/api/v1/live/:trainNo` | `GET` | `:trainNo`, `date` (optional) | Real-time GPS running position, current halt & delay status |
| **Live Tracking** | `/api/v1/live/station/:stationCode` | `GET` | `:stationCode`, `hours` (2, 4, 8), `toStation` | Real-time NTES station arrivals & departures board with platforms and delay minutes |
| **PNR Status** | `/api/v1/pnr/:pnr` | `GET` | `:pnr` (10-digit) | Live PNR passenger manifest, berth/coach & charting status |

### B. Developer Console & Account Management Endpoints

| Category | Endpoint | Method | Auth Required | Description |
|---|---|:---:|---|---|
| **Auth** | `/api/v1/auth/google/native` | `POST` | None (`{ idToken }`) | Exchange Google OAuth ID token for session JWT |
| **Profile** | `/api/v1/auth/me` | `GET` | `Bearer <JWT>` | Fetch active user profile, remaining credits & active keys |
| **API Keys** | `/api/v1/auth/keys` | `POST` | `Bearer <JWT>` | Create a new API key (`{ name, expiresIn }`) |
| **API Keys** | `/api/v1/auth/keys/:keyId` | `DELETE` | `Bearer <JWT>` | Permanently revoke and destroy an API key |
| **Billing** | `/api/v1/billing/create-order` | `POST` | `Bearer <JWT>` | Initialize a Razorpay payment order for API credits |
| **Billing** | `/api/v1/billing/verify-payment` | `POST` | `Bearer <JWT>` | Verify Razorpay payment signature & credit account |

---

## 💎 Pricing, Quotas & Rate Limits

The platform is engineered developer-first with a generous welcome tier, an ultra-affordable on-demand top-up model, and tailored enterprise solutions:

| Plan Tier | Price | API Credits / Quota | General API Rate Limit | Live Tracking & PNR Limit | Primary Intended Use |
|:---:|:---:|:---:|:---:|:---:|---|
| **Free Welcome** 🎁 | **₹0** (Free Forever) | **10,000 credits** on signup | **600 req / 10 min** | **10 req / min** | Instant testing, prototyping, student & hobby projects |
| **Pro Top-Up** ⚡ | **₹99** / pack | **100,000 credits** | **2,000 req / 10 min** | **30 req / min** | Commercial tools, WhatsApp/Telegram integrations, mobile apps |
| **Custom Enterprise** 🏢 | **Custom Pricing** | Tailored / Unlimited | **Dedicated Pool** | **Custom RPS** | High-volume OTAs, commercial travel portals & booking apps |

> ⏱️ **Live Tracking & PNR Telemetry:** Live train GPS tracking (`/api/v1/live/*`) and real-time PNR verification (`/api/v1/pnr/*`) endpoints feature dedicated rate limits (**10 req/min on Free**, **30 req/min on Pro**) to guarantee ultra-low latency and zero concurrency bottlenecks during high-traffic booking hours.

### ⚡ Super-Affordable Pro Top-Up (Only ₹99)
Developers can instantly top up their account balance at any time directly from the [Developer Console](https://irctc.dev/dashboard):
- **Unbeatable Value**: Get **100,000 requests for only ₹99** — the most accessible, high-performance railway API pricing in India.
- **Secure Payment Options**: Powered by Razorpay (supports UPI, Google Pay, PhonePe, Paytm, Credit/Debit Cards, and NetBanking).
- **Instant Activation**: Webhook-driven auto-credit applies within seconds, backed by an automated 3-second background polling fallback to prevent frozen UI states.

### 🏢 Custom Enterprise Solutions
Building an OTA, high-traffic commercial booking engine, or enterprise travel management software?
- **Dedicated Infrastructure**: Dedicated gateway compute pools ensuring zero congestion during peak Tatkal booking hours.
- **Custom Rate Limits**: Tailored requests-per-second (RPS) limits built specifically to match your throughput requirements.
- **Guaranteed 99.99% SLA**: Dedicated priority support channel, uptime guarantees, and direct integration engineering assistance.
- **Get in Touch**: Email us directly at **[support@irctc.dev](mailto:support@irctc.dev)** with your expected query volume for custom enterprise onboarding.

---

## 🚦 HTTP Status Codes & Error Envelope

All responses return a standardized JSON envelope with microsecond-accurate server execution times (`_time` in ms):

```json
{
  "success": false,
  "error": "Invalid 10-digit PNR format",
  "message": "Invalid 10-digit PNR format",
  "code": "BAD_REQUEST",
  "_time": 0.32
}
```

| HTTP Status | Error Code | Meaning & Recommended Remediation |
|:---:|---|---|
| `200 OK` | `SUCCESS` | Request succeeded. Response body contains requested payload in `data`. |
| `400 Bad Request` | `BAD_REQUEST` | Missing or invalid parameter (e.g. invalid train number or PNR format). |
| `401 Unauthorized` | `UNAUTHORIZED` | Missing, invalid, or expired API key (`MISSING_API_KEY`, `INVALID_API_KEY`, `API_KEY_EXPIRED`). |
| `402 Payment Required` | `INSUFFICIENT_CREDITS` | Account credit balance exhausted. Top up credits via Developer Console. |
| `403 Forbidden` | `FORBIDDEN` | Access denied or account suspended (`ACCOUNT_SUSPENDED`). |
| `404 Not Found` | `NOT_FOUND` | Specified train, station code, or route does not exist in railway database. |
| `429 Too Many Requests` | `RATE_LIMIT_EXCEEDED` | Concurrency rate limit exceeded. Implement exponential backoff retry. |
| `503 Service Unavailable` | `SERVICE_UNAVAILABLE` | Upstream railway system maintenance or service temporarily unavailable. |

---

## 📋 Live API Response Samples

<details open>
<summary><b>1. Live Train Tracking (<code>GET /api/v1/live/12558?date=2026-10-15</code>)</b></summary>

```json
{
  "success": true,
  "data": {
    "trainNumber": "12558",
    "trainName": "Sapt Kranti Exp",
    "currentLocation": "KATHOLA",
    "locationStatus": "departed from",
    "currentDelayMin": 0,
    "currentDelayStr": "Right Time",
    "totalDistanceKm": 1060,
    "totalHalts": 19,
    "stops": [
      {
        "stationName": "Anand Vihar TRM",
        "day": 1,
        "date": "15-Oct",
        "arrives": "14:46",
        "delayMin": 11,
        "delayStr": "+11 min",
        "status": "passed",
        "distanceKm": 0
      },
      {
        "stationName": "Moradabad",
        "day": 1,
        "date": "15-Oct",
        "arrives": "17:16",
        "departs": "17:33",
        "delayMin": 20,
        "delayStr": "+20 min",
        "status": "passed",
        "distanceKm": 154
      },
      {
        "stationName": "KATHOLA",
        "day": 2,
        "date": "16-Oct",
        "arrives": "00:25",
        "departs": "00:25",
        "delayMin": 0,
        "delayStr": "Right Time",
        "isOnTime": true,
        "status": "current"
      },
      {
        "stationName": "Muzaffarpur Jn",
        "day": 2,
        "date": "16-Oct",
        "arrives": "11:06",
        "departs": null,
        "delayMin": 1,
        "delayStr": "+1 min",
        "status": "upcoming",
        "distanceKm": 1060
      }
    ],
    "updatedAt": "2026-10-15T18:57:35.462Z"
  },
  "source": "irctc-api",
  "_time": 663.1
}
```
</details>

<details open>
<summary><b>2. PNR Status & Berth Confirmation (<code>GET /api/v1/pnr/2434567890</code>)</b></summary>

```json
{
  "success": true,
  "data": {
    "pnr": "2434567890",
    "trainNumber": "12309",
    "trainName": "RJPB TEJAS RAJ",
    "from": { "code": "RJPB", "time": "19:10" },
    "to": { "code": "NDLS", "time": "07:40" },
    "journeyDate": "2026-10-20",
    "class": "3A",
    "quota": "GN",
    "expectedPlatform": "1",
    "chartStatus": "not prepared",
    "passengers": [
      {
        "number": 1,
        "status": "CNF",
        "coach": "B1",
        "seat": "42",
        "berth": "LOWER",
        "isConfirmed": true
      },
      {
        "number": 2,
        "status": "CNF",
        "coach": "B1",
        "seat": "45",
        "berth": "UPPER",
        "isConfirmed": true
      }
    ],
    "updatedAt": "2026-10-15T18:45:00.000Z",
    "source": "irctc-api"
  },
  "source": "irctc-api",
  "_time": 412.5
}
```
</details>

<details open>
<summary><b>3. Calculate Train Fare Breakup (<code>GET /api/v1/trains/12558/fare?from=ANVT&to=MFP&class=all&quota=GN</code>)</b></summary>

```json
{
  "success": true,
  "trainNumber": "12558",
  "trainName": "Sapt Kranti Exp",
  "from": "ANVT",
  "to": "MFP",
  "quota": "GN",
  "category": "Adult",
  "totalClasses": 5,
  "fares": [
    {
      "class": "1A",
      "className": "First AC",
      "totalFare": 3410,
      "breakup": {
        "baseFare": 3112,
        "reservationCharge": 60,
        "superfastCharge": 75,
        "gst": 163,
        "cateringCharge": 0,
        "dynamicFare": 0
      }
    },
    {
      "class": "3A",
      "className": "Third AC",
      "totalFare": 1445,
      "breakup": {
        "baseFare": 1291,
        "reservationCharge": 40,
        "superfastCharge": 45,
        "gst": 69,
        "cateringCharge": 0,
        "dynamicFare": 0
      }
    },
    {
      "class": "SL",
      "className": "Sleeper",
      "totalFare": 565,
      "breakup": {
        "baseFare": 515,
        "reservationCharge": 20,
        "superfastCharge": 30,
        "gst": 0,
        "cateringCharge": 0,
        "dynamicFare": 0
      }
    }
  ],
  "_cached": true,
  "_time": 7.0
}
```
</details>

<details open>
<summary><b>4. Get Cancelled Trains (<code>GET /api/v1/trains/cancelled</code>)</b></summary>

```json
{
  "success": true,
  "date": "20-10-2026",
  "dateISO": "2026-10-20",
  "total": 59,
  "fullyCancelledCount": 19,
  "partiallyCancelledCount": 40,
  "trains": [
    {
      "trainNumber": "11002",
      "trainName": "NANDIGRAM EXP",
      "source": "BALHARSHAH",
      "destination": "C SHIVAJI MAH T",
      "trainType": "EXPRESS",
      "isPartial": true,
      "cancellationType": "PARTIALLY_CANCELLED",
      "cancelledFromStation": "DR",
      "cancelledToStation": "CSMT",
      "startDate": "20-10-2026",
      "railwayTimestamp": "2026-10-01T10:34:23.283000"
    }
  ],
  "source": "irctc-api",
  "_time": 0.0
}
```
</details>

<details open>
<summary><b>5. Live Station Arrivals & Departures (<code>GET /api/v1/live/station/NDLS?hours=2</code>)</b></summary>

```json
{
  "success": true,
  "stationCode": "NDLS",
  "stationName": "NEW DELHI",
  "hours": 2,
  "toStation": null,
  "totalTrains": 28,
  "trains": [
    {
      "trainNo": "12004",
      "trainName": "LKO SHTBDI EXP",
      "route": "NDLS-LKO",
      "trainType": "SHATABDI",
      "platform": {
        "number": "1",
        "isProvisional": false
      },
      "hasCoachPosition": true,
      "arrival": {
        "isSource": true,
        "scheduled": null,
        "actualOrEstimated": null,
        "delay": "Originates Here",
        "delayMinutes": 0,
        "status": "SOURCE"
      },
      "departure": {
        "isDestination": false,
        "scheduled": "06:10",
        "actualOrEstimated": "06:10",
        "delay": "On Time",
        "delayMinutes": 0,
        "status": "ON_TIME"
      }
    }
  ],
  "source": "irctc-api",
  "_time": 210.4
}
```
</details>

<details>
<summary><b>6. Train Search Between Stations (<code>GET /api/v1/trains/search?from=NDLS&to=PNBE</code>)</b></summary>

```json
{
  "success": true,
  "data": [
    {
      "trainNo": "12309",
      "trainName": "RJPB TEJAS RAJ",
      "trainType": "RAJDHANI",
      "fromStation": "NDLS",
      "toStation": "PNBE",
      "fromStationName": "NEW DELHI",
      "toStationName": "PATNA JN",
      "departure": "17:10",
      "arrival": "06:50",
      "durationMin": 820,
      "durationStr": "13:40",
      "runningDays": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      "distance": "1001",
      "estimatedFare": 2240,
      "halts": 4
    }
  ],
  "source": "irctc-api",
  "_time": 4.19
}
```
</details>

<details>
<summary><b>7. Complete Train Route Schedule & Halts (<code>GET /api/v1/trains/12309</code>)</b></summary>

```json
{
  "success": true,
  "data": {
    "trainNo": "12309",
    "trainName": "RJPB TEJAS RAJ",
    "trainType": "RAJDHANI",
    "runningDays": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    "totalDistance": 1001,
    "originCode": "RJPB",
    "destinationCode": "NDLS",
    "stationCodes": ["RJPB", "PNBE", "DDU", "PRYJ", "CNB", "NDLS"],
    "stations": [
      {
        "seq": 1,
        "code": "RJPB",
        "name": "RAJENDRA NAGAR T",
        "arrival": null,
        "departure": "19:10",
        "haltMinutes": 0,
        "distanceKm": 0,
        "lat": 25.6025,
        "lng": 85.1638
      },
      {
        "seq": 2,
        "code": "PNBE",
        "name": "PATNA JN",
        "arrival": "19:25",
        "departure": "19:35",
        "haltMinutes": 10,
        "distanceKm": 3,
        "lat": 25.6022,
        "lng": 85.1376
      },
      {
        "seq": 6,
        "code": "NDLS",
        "name": "NEW DELHI",
        "arrival": "07:40",
        "departure": null,
        "haltMinutes": 0,
        "distanceKm": 1001,
        "lat": 28.6424,
        "lng": 77.2195
      }
    ]
  },
  "source": "irctc-api",
  "_time": 3.29
}
```
</details>

<details>
<summary><b>8. Station Autocomplete (<code>GET /api/v1/trains/stations?q=patna</code>)</b></summary>

```json
{
  "success": true,
  "data": [
    { "code": "PNBE", "name": "Patna Junction", "state": "Bihar" },
    { "code": "PPTA", "name": "Patliputra Junction", "state": "Bihar" },
    { "code": "PNC", "name": "Patna Saheb", "state": "Bihar" },
    { "code": "RJPB", "name": "Rajendra Nagar Terminal", "state": "Bihar" }
  ],
  "source": "irctc-api",
  "cached": true,
  "_time": 0.84
}
```
</details>

<details>
<summary><b>9. Gateway Health & Status (<code>GET /health</code>)</b></summary>

```json
{
  "status": "up",
  "version": "1.0.1",
  "_time": 0.05
}
```
</details>

---

## 🛡️ Security, Hardening & OWASP Compliance

The web application meets strict **OWASP ASVS v4.0** and **OWASP Top 10** standards:

* 🔒 **Screen-Share Safe Credential Masking:** Keys in `ApiPlayground.tsx` default to masked inputs (`type="password"`). Auto-injection on mount is disabled; credentials require an explicit click on `+ Use My Key`.
* 📊 **CSV Formula Injection Neutralization:** Log exports in `Dashboard.tsx` neutralize spreadsheet command triggers (`=`, `+`, `-`, `@`, `\t`, `\r`) in accordance with **RFC 4180 / CWE-1236**.
* 🌐 **Strict Content Security Policy (CSP Level 3):**
  - Strictly whitelists Google OAuth (`accounts.google.com`) and Razorpay (`checkout.razorpay.com`, `api.razorpay.com`).
  - Preloaded HTTP Strict Transport Security (`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`).
  - Enforces `Cross-Origin-Opener-Policy: same-origin-allow-popups` to enable secure Google OAuth popups without CORS framing vulnerabilities.
  - Enforces `X-Frame-Options: DENY` and `X-Content-Type-Options: nosniff`.
* 🔄 **Symmetric Cross-Tab Session Hydration:** In `AuthContext.tsx`, storage event listeners automatically propagate both login (`e.newValue`) and logout (`!e.newValue`) across all active browser tabs in real time.
* ⚡ **Production Sourcemap Elimination:** Vite builds enforce `sourcemap: false` to ensure zero internal architecture reverse-engineering leaks.

---

## 🛠️ Local Development Setup

### Prerequisites
- **Node.js**: `>= 18.0.0` (Node 20+ or 22+ recommended)
- **NPM**, **pnpm**, or **bun**

### 1. Clone & Install
```bash
git clone https://github.com/Manj620026/irctc-api.git
cd irctc-api
npm install
```

### 2. Configure Environment Variables
Copy the environment template:
```bash
cp .env.example .env
```

Populate `.env` with your Google OAuth Client ID and the live API Gateway:
```env
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
VITE_API_URL=https://api.irctc.dev
```

### 3. Start Local Development Server
```bash
npm run dev
```
Starts the Vite server on **`http://localhost:4000`** with strict port enforcement and Hot Module Replacement.

### 4. Code Quality & Linting
```bash
npm run lint
```
Runs high-speed **Oxlint** (Rust-based AST linter) across all TypeScript and React files.

### 5. Typecheck & Production Build
```bash
npm run build
```
Executes strict TypeScript composite typecheck (`tsc -b`) followed by optimized production Vite bundling (`vite build`).

### 6. Local Production Preview
```bash
npm run preview
```
Serves the production build on **`http://localhost:4000`** with production security headers (including COOP) to test OAuth and payment flows authentically.

---

## 🚀 Cloudflare Pages Deployment

Deploy directly to Cloudflare Pages using Wrangler:

```bash
# 1. Compile production bundle
npm run build

# 2. Deploy bundle via Wrangler
npx wrangler pages deploy dist --project-name=irctc-api --branch=main
```

Deployment notes:
- Client-side routing is handled by `public/_redirects` (`/* /index.html 200`).
- Security policies are enforced at the Cloudflare edge via `public/_headers`.

---

## ⚠️ Legal Disclaimer

> **Important**: This project, portal, and API platform are independent developer tools. "IRCTC", "Indian Railways", and related marks and logos are registered trademarks of Indian Railway Catering and Tourism Corporation Ltd. / Ministry of Railways, Government of India. This project is **not** affiliated with, endorsed by, authorized by, sponsored by, or officially connected with Indian Railways, IRCTC, CRIS, or the Government of India. All train schedules, live status, and data are aggregated for developer testing, educational, and research purposes only under best-effort availability.

---

## 🤝 Contributing

Contributions are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewFeature`)
3. Commit your Changes (`git commit -m 'feat: add NewFeature'`)
4. Push to the Branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
Built with passion for developers creating the next generation of railway experiences in India. 🚅
</div>
