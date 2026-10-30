<div align="center">

<a href="https://irctc.dev">
  <img src="banner.svg" alt="irctc-api // irctc.dev — Minimalist Rail Engine Banner" width="100%" />
</a>

<br/><br/>

# 🚄 IRCTC Developer Portal & API Playground
**Official Web Portal, Interactive Documentation & Developer Console for IRCTC Railway API**

[![Live Portal](https://img.shields.io/badge/Portal-irctc.dev-orange.svg?style=for-the-badge)](https://irctc.dev)
[![API Gateway](https://img.shields.io/badge/API-api.irctc.dev-blue.svg?style=for-the-badge)](https://api.irctc.dev)
[![API Version](https://img.shields.io/badge/API%20Version-v1.0.2-emerald.svg?style=for-the-badge)](https://api.irctc.dev/health)
[![npm version](https://img.shields.io/npm/v/irctc-api.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/irctc-api)
[![PyPI version](https://img.shields.io/pypi/v/irctc-api.svg?style=for-the-badge&logo=pypi&color=3776AB)](https://pypi.org/project/irctc-api/)
[![n8n Community Node](https://img.shields.io/npm/v/n8n-nodes-irctc.svg?label=n8n%20node&style=for-the-badge&logo=n8n&color=EA4B71)](https://www.npmjs.com/package/n8n-nodes-irctc)
[![MCP Server](https://img.shields.io/npm/v/irctc-mcp.svg?label=irctc-mcp&style=for-the-badge&logo=anthropic&color=black)](https://www.npmjs.com/package/irctc-mcp)
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
| **⚡ API Gateway** | [https://api.irctc.dev](https://api.irctc.dev) | Production REST API base URL (v1.0.2) |
| **🧪 API Playground** | [https://irctc.dev/playground](https://irctc.dev/playground) | In-browser interactive API sandbox with real-time latency benchmarks |
| **📑 Documentation** | [https://irctc.dev/docs](https://irctc.dev/docs) | Complete endpoint schemas, parameters & multi-language code snippets |
| **🔑 Developer Console** | [https://irctc.dev/dashboard](https://irctc.dev/dashboard) | Google OAuth, API key management, quota tracking & telemetry logs |
| **📦 TypeScript / Node SDK** | [`irctc-api` on npm](https://www.npmjs.com/package/irctc-api) | Zero-dependency Node.js & TypeScript client library (v4.3.1) |
| **🐍 Python Client SDK** | [`irctc-api` on PyPI](https://pypi.org/project/irctc-api/) | Zero-dependency Python 3.8+ client library (`pip install irctc-api`) |
| **🤖 Model Context Protocol (MCP)** | [`irctc-mcp` on npm](https://www.npmjs.com/package/irctc-mcp) | Official 14-tool AI Agent integration for Cursor, Windsurf & Claude Desktop |
| **🔄 n8n Community Node** | [`n8n-nodes-irctc` on npm](https://www.npmjs.com/package/n8n-nodes-irctc) | Official low-code automation node for n8n (15 operations, 5 resources) |
| **💻 Zero-Install CLI** | `npx irctc-api` on npm | Instant terminal train tracking & 1-click device OAuth tunnel |
| **📮 Postman Collection** | [Download Collection](https://irctc.dev/postman_collection.json) | OpenAPI 3.1 & Postman v2.1.0 test suite with automated assertions |
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
- **Zero-Setup Testing**: Execute live authenticated queries against all 14 railway intelligence endpoints (route search, train info, fare lookup, 14-day seat availability, post-charting vacant berths, cancelled trains, station autocomplete, live GPS tracking, live station board, and PNR verification) directly from the browser.
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
        ├── CliAuth.tsx                  # RFC 8628 Terminal-to-Dashboard 1-click OAuth approval tunnel
        ├── Dashboard.tsx                # Key management, RFC 4180 CSV export & Razorpay top-up flow
        ├── Docs.tsx                     # API reference, syntax tokenizer & multi-language tabs
        ├── EmbedWidget.tsx              # Standalone embeddable iframe widget for travel sites & blogs
        ├── LandingPage.tsx              # Conversion hero, animated request firehose & benchmark stats
        ├── PricingComparison.tsx        # Railway API pricing transparency report (CRIS ₹50L vs irctc.dev)
        ├── Privacy.tsx                  # DPDP/GDPR compliant privacy policy with mobile bottom sheet index
        ├── RapidApiAlternative.tsx      # RapidAPI switcher hub with head-to-head latency benchmarks
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
    // 1. Find Trains (Between Stations)
    const trains = await client.trains.search({
      from: 'NDLS',
      to: 'PNBE',
      date: '2026-10-15',
    });
    console.log(`Found ${trains.length} direct trains.`);

    // 2. Train by Name (Search & Autocomplete)
    const rajdhaniTrains = await client.trains.searchByName('rajdhani');

    // 3. Train by Number (Full Timetable & Halts)
    const schedule = await client.trains.getSchedule('12309');
    console.log(`Train ${schedule.trainName} has ${schedule.stations.length} halts.`);

    // 4. Fare Lookup (Official IRCTC Breakup)
    const fare = await client.trains.getFare('12558', { from: 'ANVT', to: 'MFP', class: 'all', quota: 'GN' });
    console.log(`Fare classes available: ${fare.fares.length}`);

    // 5. Seat Availability (Official 14-Day Calendar Forecast)
    const seatForecast = await client.trains.getAvailability('12557', { from: 'NKE', to: 'ANVT', date: '17-11-2026', class: '3A', quota: 'GN' });
    console.log(`Seat Status on ${seatForecast.date}: ${seatForecast.availability[0]?.status}`);

    // 6. Vacant Seats After Chart Preparation (Current Booking)
    const chartVacant = await client.trains.getChartVacant('26501', { boardingStation: 'BTH', class: 'ALL' });
    console.log(`Total Vacant Berths post-charting: ${chartVacant.totalVacantBerths}`);

    // 7. Cancelled Trains Bulletin
    const cancelled = await client.trains.getCancelledTrains();
    console.log(`Total Cancelled Trains today: ${cancelled.total}`);

    // 8. Station by Name (Autocomplete Search)
    const stations = await client.stations.search('patna');

    // 9. Station by Code (Details & Metadata)
    const stationMeta = await client.stations.getByCode('NDLS');

    // 10. Station Timetable (Scheduled Daily Trains)
    const stationBoard = await client.stations.getTimetable('NDLS', '2026-10-15');

    // 11. Live Train Running Status (GPS & Delays)
    const live = await client.live.getStatus('12558', { date: '2026-10-15' });
    console.log(`Location: ${live.currentLocation} | Status: ${live.currentDelayStr}`);

    // 12. Live Station Display Board (Platforms & Real-Time Delays)
    const liveBoard = await client.live.getStation('NDLS', { hours: 2 });
    console.log(`Live Trains at ${liveBoard.stationName}: ${liveBoard.totalTrains}`);

    // 13. PNR Status & Passenger Manifest
    const pnr = await client.pnr.check('2434567890');
    console.log(`Train: ${pnr.trainNumber} | Chart: ${pnr.chartStatus}`);

    // 14. Gateway Health & Status
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

# 5. Live Seat Availability (14-Day Forecast)
seat_resp = requests.get(
    f"{BASE_URL}/api/v1/trains/12557/availability",
    params={"from": "NKE", "to": "ANVT", "date": "17-11-2026", "class": "3A", "quota": "GN"},
    headers=headers,
    timeout=10
)
print("Seat Availability:", seat_resp.json())

# 6. Vacant Seats After Chart Preparation (Current Booking)
chart_resp = requests.get(
    f"{BASE_URL}/api/v1/trains/26501/chart-vacant",
    params={"boardingStation": "BTH", "class": "ALL"},
    headers=headers,
    timeout=10
)
print("Chart Vacant Berths:", chart_resp.json())

# 7. Daily Cancelled Trains
cancelled_resp = requests.get(f"{BASE_URL}/api/v1/trains/cancelled", headers=headers, timeout=10)
print("Cancelled Trains:", cancelled_resp.json())

# 8. Live Station Display Board (Arrivals/Departures)
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

# 2. Find Trains Between Stations
curl -s -X GET "https://api.irctc.dev/api/v1/trains/search?from=NDLS&to=PNBE&date=2026-10-15" \
  -H "Authorization: Bearer YOUR_API_KEY"

# 3. Station Autocomplete
curl -s -X GET "https://api.irctc.dev/api/v1/trains/stations?q=patna" \
  -H "x-api-key: YOUR_API_KEY"

# 4. Calculate Train Fare Breakup
curl -s -X GET "https://api.irctc.dev/api/v1/trains/12558/fare?from=ANVT&to=MFP&class=all&quota=GN" \
  -H "x-api-key: YOUR_API_KEY"

# 5. Check Seat Availability (14-Day Forecast)
curl -s -X GET "https://api.irctc.dev/api/v1/trains/12557/availability?from=NKE&to=ANVT&date=17-11-2026&class=3A&quota=GN" \
  -H "x-api-key: YOUR_API_KEY"

# 6. Vacant Seats After Chart Preparation (Current Booking)
curl -s -X GET "https://api.irctc.dev/api/v1/trains/26501/chart-vacant?boardingStation=BTH&class=ALL" \
  -H "x-api-key: YOUR_API_KEY"

# 7. Get Daily Cancelled Trains
curl -s -X GET "https://api.irctc.dev/api/v1/trains/cancelled" \
  -H "x-api-key: YOUR_API_KEY"

# 8. Live Station Board (NTES Arrivals & Departures)
curl -s -X GET "https://api.irctc.dev/api/v1/live/station/NDLS?hours=2" \
  -H "x-api-key: YOUR_API_KEY"

# 9. Gateway Health Check (No Key Required)
curl -s -X GET "https://api.irctc.dev/health"
```

---

### 5. Python Client SDK (`pip install irctc-api`)

Zero-dependency Python 3.8+ library built with native Python standard library (`urllib.request`, `ssl`, `json`). Ultra-lightweight (< 20 KB), with instant sub-second installation and full PEP 561 typed auto-completion.

```bash
pip install irctc-api
```

```python
from irctc import RailEngine

rail = RailEngine(api_key="your_api_key_here")

# 1. Live Train Tracking
live = rail.live.get_status("12557")
print(f"Train {live['trainNumber']}: {live['currentLocation']} (Delay: {live['currentDelayStr']})")

# 2. Check PNR Status
pnr = rail.pnr.check("2265248473")
print(f"PNR Status: {pnr['chartStatus']} | Coach: {pnr['passengers'][0]['coach']} Berth: {pnr['passengers'][0]['berth']}")

# 3. 14-Day Continuous Seat Availability Forecast
seats = rail.trains.get_availability("12557", from_station="NKE", to_station="ANVT", date="17-11-2026", class_code="3A")
print(f"Availability: {seats['availability'][0]['status']}")

# 4. Vacant Berths Post-Chart Preparation (Current Booking)
vacant = rail.trains.get_chart_vacant("12557", boarding_station="NKE")
print(f"Vacant Berths: {vacant['totalVacantBerths']}")
```

---

## 💻 Zero-Install Terminal CLI (`npx irctc-api`)

Get live Indian Railways data directly in your active terminal in **under 3 seconds without signing up or creating an account**.

```bash
# 1. Check Live GPS Train Status
npx irctc-api live 12557

# 2. Check PNR Confirmation & Berth Allocations
npx irctc-api pnr 2265248473

# 3. Search Direct Trains Between Stations
npx irctc-api search NDLS PNBE

# 4. Calculate Official Multi-Class Ticket Fare
npx irctc-api fare 12558 ANVT MFP

# 5. One-Click Device OAuth Login Tunnel
npx irctc-api login
```

- **Pipe-Friendly Pure JSON**: By default or when piping (`npx irctc-api live 12557 | jq`), output emits clean machine-readable JSON on `stdout`.
- **Global Install Available**: `npm install -g irctc-api` provides the short `irctc live 12557` command in any shell.

---

## 🤖 Model Context Protocol (MCP) Server for AI IDEs (`irctc-mcp`)

Connect your AI coding agents in **Cursor, Claude Desktop, Windsurf, and Claude Code** directly to live Indian Railways intelligence across all 14 platform endpoints.

[![MCP Server](https://img.shields.io/npm/v/irctc-mcp.svg?label=irctc-mcp&style=for-the-badge&logo=anthropic&color=black)](https://www.npmjs.com/package/irctc-mcp)

### 1-Command Stdio Usage
```bash
npx -y irctc-mcp
```

### IDE Configuration

#### Claude Desktop (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "irctc": {
      "command": "npx",
      "args": ["-y", "irctc-mcp"],
      "env": {
        "IRCTC_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

#### Cursor IDE (`.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "irctc": {
      "command": "npx",
      "args": ["-y", "irctc-mcp"],
      "env": {
        "IRCTC_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

### 14 Available AI Agent Tools
Ask your AI agent natural questions like:
- *"Check if train 12557 is on time today"* (`get_live_running_status`)
- *"Check the current booking chart for vacant berths on train 12557 at NKE"* (`get_vacant_berths_post_chart`)
- *"What is my coach and seat for PNR 2265248473?"* (`check_pnr`)
- *"Find trains running between Delhi and Patna on Friday"* (`search_trains`)
- *"Calculate ticket fare for train 12558 from ANVT to MFP"* (`get_train_fare`)

---

## 🔄 Workflow Automation with n8n (`n8n-nodes-irctc`)

Automate railway alerts, Tatkal watchdog bots, and commute Slack digests with the official community node for **n8n**.

[![n8n Community Node](https://img.shields.io/npm/v/n8n-nodes-irctc.svg?label=n8n%20node&style=for-the-badge&logo=n8n&color=EA4B71)](https://www.npmjs.com/package/n8n-nodes-irctc)

### Installation
In your self-hosted or cloud n8n instance:
1. Go to **Settings** > **Community Nodes**.
2. Click **Install a community node**.
3. Enter `n8n-nodes-irctc` and click **Install**.

### Capabilities (15 Operations across 5 Resources):
- **PNR Status (`pnr`)**: Real-time confirmation, coach, berth, and charting status.
- **Live Tracking (`liveStatus`)**: Live GPS running status, delays, and 2-hour station arrivals/departures board.
- **Trains & Fares (`trains`)**: Train search, 14-day continuous seat availability calendar, post-charting vacant berths, ticket fare breakup, route schedule, train by number, train by name, daily cancelled trains.
- **Stations & Timetables (`stations`)**: Station autocomplete, station details, daily timetable by date.
- **Engine Health (`health`)**: Uptime and latency probe (`status: "up"`).

### 3 Ready-to-Import Workflow Blueprints (`workflows/`):
1. **`pnr-confirmation-alert.json`**: Cron polls PNR every 30m, detects `CNF` confirmation, and dispatches immediate Telegram alert.
2. **`morning-commute-delay-digest.json`**: Scheduled weekday 8:30 AM cron checking daily commute trains and posting live status digest to Slack.
3. **`tatkal-vacancy-watchdog.json`**: Polls charts 4 hours prior to departure, immediately pushing Current Booking vacant seat allocations to Telegram.

---

## 📡 Complete REST API Catalog

Base URL: `https://api.irctc.dev`

### A. Railway Intelligence & Tracking Endpoints

| Category | Endpoint | Method | Key Parameters | Operation Name & Description |
|---|---|:---:|---|---|
| **System** | `/health` | `GET` | None | **Gateway Health:** Check API gateway liveness, service status & platform version (v1.0.2) |
| **Trains** | `/api/v1/trains/search` | `GET` | `from`, `to`, `date` (YYYY-MM-DD) | **Find Trains (Between Stations):** Sub-millisecond direct route search between stations |
| **Trains** | `/api/v1/trains/search/name` | `GET` | `name` (min 2 chars) | **Train by Name:** Search trains by partial or full name string |
| **Trains** | `/api/v1/trains/:trainNo` | `GET` | `:trainNo` (5-digit) | **Train by Number:** Full timetable, route halts, distance & lat/lng coordinates |
| **Trains** | `/api/v1/trains/:trainNo/fare` | `GET` | `:trainNo`, `from`, `to`, `class` (default `all`), `quota` (default `GN`) | **Fare Lookup:** Real-time official IRCTC ticket fare breakup (Base, Superfast, GST, Catering) |
| **Trains** | `/api/v1/trains/:trainNo/availability` | `GET` | `:trainNo`, `from`, `to`, `date`, `class` (default `3A`), `quota` (default `GN`) | **Seat Availability:** Real-time official CRIS seat & berth availability with 14-day forecast |
| **Trains** | `/api/v1/trains/:trainNo/chart-vacant` | `GET` | `:trainNo`, `boardingStation`, `date`, `class` (default `ALL`) | **Vacant Seats After Chart Preparation:** Real-time IRCTC reservation chart vacant berths post-charting (Current Booking / TTE) |
| **Trains** | `/api/v1/trains/cancelled` | `GET` | None | **Cancelled Trains:** Daily fully & partially cancelled trains across Indian Railways (0ms cache) |
| **Stations** | `/api/v1/trains/stations` | `GET` | `q` (min 2 chars) | **Station by Name:** High-speed prefix-tree station autocomplete |
| **Stations** | `/api/v1/trains/stations/:code` | `GET` | `:code` (e.g. `NDLS`) | **Station by Code:** Station metadata, full name, railway zone & state |
| **Stations** | `/api/v1/trains/stations/:code/timetable/:date` | `GET` | `:code`, `:date` (optional) | **Station Timetable:** Scheduled daily arrivals and departures for a station |
| **Live Tracking** | `/api/v1/live/:trainNo` | `GET` | `:trainNo`, `date` (optional) | **Live Train Running Status:** Real-time GPS running position, current halt & delay status |
| **Live Tracking** | `/api/v1/live/station/:stationCode` | `GET` | `:stationCode`, `hours` (2, 4, 8), `toStation` | **Live Station Display Board:** Real-time NTES station arrivals & departures board with platforms and delay minutes |
| **PNR Status** | `/api/v1/pnr/:pnr` | `GET` | `:pnr` (10-digit) | **PNR Status:** Live PNR passenger manifest, berth/coach & charting status |

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
<summary><b>1. Gateway Health (<code>GET /health</code>)</b></summary>

```json
{
  "status": "up",
  "version": "1.0.2"
}
```
</details>

<details open>
<summary><b>2. Find Trains (Between Stations) (<code>GET /api/v1/trains/search?from=NDLS&to=GD&date=2026-10-24</code>)</b></summary>

```json
{
  "success": true,
  "data": [
    {
      "trainNo": "12556",
      "trainName": "GORAKHDHAM EXP",
      "trainType": "SUPERFAST",
      "fromStation": "NDLS",
      "toStation": "GD",
      "fromStationName": "NEW DELHI",
      "toStationName": "GONDA JN",
      "trainSrc": "BTI",
      "trainDstn": "GKP",
      "departure": "21:25",
      "arrival": "07:00",
      "durationMin": 575,
      "durationStr": "9:35",
      "runningDays": [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
      ],
      "classes": [],
      "distance": "631",
      "estimatedFare": 372,
      "halts": 4,
      "fromStationDayOffset": 0,
      "toStationDayOffset": 1
    },
    {
      "trainNo": "12566",
      "trainName": "BIHAR S KRANTI",
      "trainType": "SUPERFAST",
      "fromStation": "NDLS",
      "toStation": "GD",
      "fromStationName": "NEW DELHI",
      "toStationName": "GONDA JN",
      "trainSrc": "NDLS",
      "trainDstn": "DBG",
      "departure": "12:45",
      "arrival": "22:26",
      "durationMin": 581,
      "durationStr": "9:41",
      "runningDays": [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
      ],
      "classes": [],
      "distance": "639",
      "estimatedFare": 376,
      "halts": 4,
      "fromStationDayOffset": 0,
      "toStationDayOffset": 0
    },
    {
      "trainNo": "15566",
      "trainName": "VAISHALI EXP",
      "trainType": "MAIL_EXPRESS",
      "fromStation": "NDLS",
      "toStation": "GD",
      "fromStationName": "NEW DELHI",
      "toStationName": "GONDA JN",
      "trainSrc": "NDLS",
      "trainDstn": "LLP",
      "departure": "20:40",
      "arrival": "06:33",
      "durationMin": 593,
      "durationStr": "9:53",
      "runningDays": [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
      ],
      "classes": [],
      "distance": "639",
      "estimatedFare": 376,
      "halts": 8,
      "fromStationDayOffset": 0,
      "toStationDayOffset": 1
    }
  ],
  "source": "irctc-api",
  "isLive": false
}
```
</details>

<details>
<summary><b>3. Train by Name (<code>GET /api/v1/trains/search/name?name=duronto</code>)</b></summary>

```json
{
  "success": true,
  "data": [
    {
      "trainNo": "12213",
      "trainName": "YPR DEE DURONTO",
      "trainType": "DURONTO",
      "from": "YPR",
      "to": "DEE"
    },
    {
      "trainNo": "12214",
      "trainName": "DEE YPR DURONTO",
      "trainType": "DURONTO",
      "from": "DEE",
      "to": "YPR"
    },
    {
      "trainNo": "12219",
      "trainName": "SC DURONTO EXP",
      "trainType": "DURONTO",
      "from": "LTT",
      "to": "SC"
    },
    {
      "trainNo": "12220",
      "trainName": "LTT DURONTO",
      "trainType": "DURONTO",
      "from": "SC",
      "to": "LTT"
    },
    {
      "trainNo": "12221",
      "trainName": "HOWRAH DURONTO",
      "trainType": "DURONTO",
      "from": "PUNE",
      "to": "HWH"
    },
    {
      "trainNo": "12222",
      "trainName": "PUNE DURONTO EX",
      "trainType": "DURONTO",
      "from": "HWH",
      "to": "PUNE"
    },
    {
      "trainNo": "12223",
      "trainName": "LTT ERS DURONTO",
      "trainType": "DURONTO",
      "from": "LTT",
      "to": "ERS"
    },
    {
      "trainNo": "12224",
      "trainName": "ERS LTT DURONTO",
      "trainType": "DURONTO",
      "from": "ERS",
      "to": "LTT"
    },
    {
      "trainNo": "12227",
      "trainName": "INDB DURONTO",
      "trainType": "DURONTO",
      "from": "MMCT",
      "to": "INDB"
    },
    {
      "trainNo": "12228",
      "trainName": "MMCT DURONTO",
      "trainType": "DURONTO",
      "from": "INDB",
      "to": "MMCT"
    }
  ],
  "total": 10,
  "source": "irctc-api"
}
```
</details>

<details>
<summary><b>4. Cancelled Trains (<code>GET /api/v1/trains/cancelled</code>)</b></summary>

```json
{
  "success": true,
  "date": "23-10-2026",
  "dateISO": "2026-10-23",
  "total": 65,
  "fullyCancelledCount": 17,
  "partiallyCancelledCount": 48,
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
      "startDate": "23-10-2026",
      "railwayTimestamp": "2026-10-01T10:34:23.288000"
    },
    {
      "trainNumber": "11020",
      "trainName": "KONARK EXPRESS",
      "source": "BHUBANESWAR NEW JN",
      "destination": "C SHIVAJI MAH T",
      "trainType": "EXPRESS",
      "isPartial": true,
      "cancellationType": "PARTIALLY_CANCELLED",
      "cancelledFromStation": "DR",
      "cancelledToStation": "CSMT",
      "startDate": "23-10-2026",
      "railwayTimestamp": "2026-10-01T06:09:16.750000"
    },
    {
      "trainNumber": "12134",
      "trainName": "MAJN CSMT SF EXP",
      "source": "MANGALORE JN",
      "destination": "C SHIVAJI MAH T",
      "trainType": "EXPRESS",
      "isPartial": true,
      "cancellationType": "PARTIALLY_CANCELLED",
      "cancelledFromStation": "TNA",
      "cancelledToStation": "CSMT",
      "startDate": "23-10-2026",
      "railwayTimestamp": "2026-10-01T06:19:18.079000"
    }
  ],
  "syncedAt": "2026-10-23T12:23:57.049Z",
  "isArchivedFallback": true
}
```
</details>

<details>
<summary><b>5. Train by Number (<code>GET /api/v1/trains/26502</code>)</b></summary>

```json
{
  "success": true,
  "data": {
    "trainNo": "26502",
    "trainName": "VANDE BHARAT EXP",
    "trainType": "VANDE_BHARAT",
    "runningDays": [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sun"
    ],
    "totalDistance": 384,
    "originCode": "GKP",
    "destinationCode": "PPTA",
    "stationCodes": [
      "GKP",
      "CPJ",
      "BUG",
      "NKE",
      "BTH",
      "SGL",
      "BMKI",
      "MFP",
      "HJP",
      "PPTA"
    ],
    "stations": [
      {
        "seq": 1,
        "code": "GKP",
        "name": "GORAKHPUR JN",
        "arrival": null,
        "departure": "05:40",
        "arrivalMin": null,
        "departureMin": 340,
        "dayOffset": 0,
        "haltMinutes": 0,
        "distanceKm": 0,
        "lat": 26.7596884,
        "lng": 83.381806,
        "arrivalDayOffset": null
      },
      {
        "seq": 2,
        "code": "CPJ",
        "name": "KAPTANGANJ JN",
        "arrival": "06:24",
        "departure": "06:26",
        "arrivalMin": 384,
        "departureMin": 386,
        "dayOffset": 0,
        "haltMinutes": 2,
        "distanceKm": 40,
        "lat": 26.9262389,
        "lng": 83.69904849999999,
        "arrivalDayOffset": 0
      },
      {
        "seq": 3,
        "code": "BUG",
        "name": "BAGAHA",
        "arrival": "07:30",
        "departure": "07:32",
        "arrivalMin": 450,
        "departureMin": 452,
        "dayOffset": 0,
        "haltMinutes": 2,
        "distanceKm": 109,
        "lat": 27.1304131,
        "lng": 84.0674887,
        "arrivalDayOffset": 0
      },
      {
        "seq": 4,
        "code": "NKE",
        "name": "NARKATIAGANJ JN",
        "arrival": "08:08",
        "departure": "08:10",
        "arrivalMin": 488,
        "departureMin": 490,
        "dayOffset": 0,
        "haltMinutes": 2,
        "distanceKm": 151,
        "lat": 27.1050503,
        "lng": 84.4627715,
        "arrivalDayOffset": 0
      },
      {
        "seq": 5,
        "code": "BTH",
        "name": "BETTIAH",
        "arrival": "08:36",
        "departure": "08:38",
        "arrivalMin": 516,
        "departureMin": 518,
        "dayOffset": 0,
        "haltMinutes": 2,
        "distanceKm": 187,
        "lat": 26.805388,
        "lng": 84.5223565,
        "arrivalDayOffset": 0
      },
      {
        "seq": 6,
        "code": "SGL",
        "name": "SAGAULI JN",
        "arrival": "08:54",
        "departure": "08:56",
        "arrivalMin": 534,
        "departureMin": 536,
        "dayOffset": 0,
        "haltMinutes": 2,
        "distanceKm": 209,
        "lat": 26.7585186,
        "lng": 84.7397626,
        "arrivalDayOffset": 0
      },
      {
        "seq": 7,
        "code": "BMKI",
        "name": "BAPUDM MOTIHARI",
        "arrival": "09:18",
        "departure": "09:20",
        "arrivalMin": 558,
        "departureMin": 560,
        "dayOffset": 0,
        "haltMinutes": 2,
        "distanceKm": 231,
        "lat": 26.6554373,
        "lng": 84.9050998,
        "arrivalDayOffset": 0
      },
      {
        "seq": 8,
        "code": "MFP",
        "name": "MUZAFFARPUR JN",
        "arrival": "10:45",
        "departure": "10:50",
        "arrivalMin": 645,
        "departureMin": 650,
        "dayOffset": 0,
        "haltMinutes": 5,
        "distanceKm": 310,
        "lat": 26.1223553,
        "lng": 85.3779498,
        "arrivalDayOffset": 0
      },
      {
        "seq": 9,
        "code": "HJP",
        "name": "HAJIPUR JN",
        "arrival": "11:43",
        "departure": "11:45",
        "arrivalMin": 703,
        "departureMin": 705,
        "dayOffset": 0,
        "haltMinutes": 2,
        "distanceKm": 364,
        "lat": 25.7019167,
        "lng": 85.2149445,
        "arrivalDayOffset": 0
      },
      {
        "seq": 10,
        "code": "PPTA",
        "name": "PATLIPUTRA",
        "arrival": "12:45",
        "departure": null,
        "arrivalMin": 765,
        "departureMin": null,
        "dayOffset": 0,
        "haltMinutes": 0,
        "distanceKm": 384,
        "lat": 25.6216198,
        "lng": 85.0688695,
        "arrivalDayOffset": 0
      }
    ],
    "convertedAt": "2026-07-08T11:06:11.814Z",
    "dataVersion": 2,
    "source": "mntes"
  },
  "source": "irctc-api"
}
```
</details>

<details>
<summary><b>6. Fare Lookup (<code>GET /api/v1/trains/12558/fare?from=ANVT&to=NKE&class=all&quota=GN</code>)</b></summary>

```json
{
  "success": true,
  "trainNumber": "12558",
  "trainName": "SAPT KRANTI EXP",
  "from": "ANVT",
  "to": "NKE",
  "quota": "GN",
  "category": "Adult",
  "availableClasses": [
    {
      "code": "1A",
      "name": "First AC"
    },
    {
      "code": "2A",
      "name": "Second AC"
    },
    {
      "code": "3A",
      "name": "Third AC"
    },
    {
      "code": "3E",
      "name": "AC 3 Tier Economy"
    },
    {
      "code": "SL",
      "name": "Sleeper"
    }
  ],
  "availableQuotas": [
    {
      "code": "GN",
      "name": "General Quota"
    },
    {
      "code": "TQ",
      "name": "Tatkal Quota"
    }
  ],
  "totalClasses": 5,
  "fares": [
    {
      "class": "1A",
      "className": "First AC",
      "totalFare": 3045,
      "breakup": {
        "baseFare": 2765,
        "reservationCharge": 60,
        "superfastCharge": 75,
        "gst": 145,
        "cateringCharge": 0,
        "dynamicFare": 0
      }
    },
    {
      "class": "2A",
      "className": "Second AC",
      "totalFare": 1825,
      "breakup": {
        "baseFare": 1643,
        "reservationCharge": 50,
        "superfastCharge": 45,
        "gst": 87,
        "cateringCharge": 0,
        "dynamicFare": 0
      }
    },
    {
      "class": "3A",
      "className": "Third AC",
      "totalFare": 1300,
      "breakup": {
        "baseFare": 1149,
        "reservationCharge": 40,
        "superfastCharge": 45,
        "gst": 62,
        "cateringCharge": 0,
        "dynamicFare": 0
      }
    },
    {
      "class": "3E",
      "className": "AC 3 Tier Economy",
      "totalFare": 1205,
      "breakup": {
        "baseFare": 1062,
        "reservationCharge": 40,
        "superfastCharge": 45,
        "gst": 58,
        "cateringCharge": 0,
        "dynamicFare": 0
      }
    },
    {
      "class": "SL",
      "className": "Sleeper",
      "totalFare": 505,
      "breakup": {
        "baseFare": 454,
        "reservationCharge": 20,
        "superfastCharge": 30,
        "gst": 0,
        "cateringCharge": 0,
        "dynamicFare": 0
      }
    }
  ],
  "_cached": false
}
```
</details>

<details>
<summary><b>7. Seat Availability (<code>GET /api/v1/trains/12557/availability?from=NKE&to=ANVT&date=17-11-2026&class=3A&quota=GN</code>)</b></summary>

```json
{
  "success": true,
  "trainNumber": "12557",
  "trainName": "SAPT KRANTI EXP",
  "from": "NKE",
  "to": "ANVT",
  "date": "17-11-2026",
  "class": "3A",
  "quota": "GN",
  "availability": [
    {
      "date": "2026-11-17",
      "status": "REGRET/GNWL151",
      "type": "REGRET",
      "currentBooking": "N"
    },
    {
      "date": "2026-11-18",
      "status": "GNWL271/WL140",
      "type": "WAITLIST",
      "currentBooking": "N"
    },
    {
      "date": "2026-11-19",
      "status": "GNWL200/WL138",
      "type": "WAITLIST",
      "currentBooking": "N"
    },
    {
      "date": "2026-11-20",
      "status": "GNWL160/WL110",
      "type": "WAITLIST",
      "currentBooking": "N"
    },
    {
      "date": "2026-11-21",
      "status": "AVAILABLE-0042",
      "type": "AVAILABLE",
      "currentBooking": "N"
    }
  ],
  "source": "irctc-api",
  "_cached": true,
  "_time": 1.482
}
```
</details>

<details>
<summary><b>8. Vacant Seats After Chart Preparation (<code>GET /api/v1/trains/12557/chart-vacant?boardingStation=GKP&date=2026-10-24&class=ALL</code>)</b></summary>

```json
{
  "success": true,
  "trainNumber": "12557",
  "trainName": "SAPT KRANTI EXP",
  "boardingStation": "GKP",
  "from": "MFP",
  "to": "ANVT",
  "date": "2026-10-24",
  "chartStatus": {
    "isChartPrepared": true,
    "firstChartTime": "2026-10-24 08:40:47",
    "currentChartTime": null,
    "remoteStation": "GKP",
    "nextRemoteStation": "LKO"
  },
  "totalVacantBerths": 0,
  "summaryByClass": {
    "2A": 0,
    "3A": 0,
    "1A": 0,
    "3E": 0,
    "SL": 0
  },
  "vacantBerths": [],
  "coaches": [
    {
      "coach": "A1",
      "class": "2A",
      "position": 0,
      "vacantBerths": 0
    },
    {
      "coach": "A2",
      "class": "2A",
      "position": 0,
      "vacantBerths": 0
    },
    {
      "coach": "B1",
      "class": "3A",
      "position": 0,
      "vacantBerths": 0
    },
    {
      "coach": "B2",
      "class": "3A",
      "position": 0,
      "vacantBerths": 0
    },
    {
      "coach": "B3",
      "class": "3A",
      "position": 0,
      "vacantBerths": 0
    },
    {
      "coach": "B4",
      "class": "3A",
      "position": 0,
      "vacantBerths": 0
    },
    {
      "coach": "B5",
      "class": "3A",
      "position": 0,
      "vacantBerths": 0
    },
    {
      "coach": "H1",
      "class": "1A",
      "position": 0,
      "vacantBerths": 0
    },
    {
      "coach": "M1",
      "class": "3E",
      "position": 0,
      "vacantBerths": 0
    },
    {
      "coach": "S1",
      "class": "SL",
      "position": 0,
      "vacantBerths": 0
    },
    {
      "coach": "S2",
      "class": "SL",
      "position": 0,
      "vacantBerths": 0
    },
    {
      "coach": "S3",
      "class": "SL",
      "position": 0,
      "vacantBerths": 0
    },
    {
      "coach": "S4",
      "class": "SL",
      "position": 0,
      "vacantBerths": 0
    },
    {
      "coach": "S5",
      "class": "SL",
      "position": 0,
      "vacantBerths": 0
    },
    {
      "coach": "S6",
      "class": "SL",
      "position": 0,
      "vacantBerths": 0
    }
  ],
  "source": "irctc-charts",
  "syncedAt": "2026-10-24T07:36:22.920Z"
}
```
</details>

<details>
<summary><b>9. Station by Name (<code>GET /api/v1/trains/stations?q=pur</code>)</b></summary>

```json
{
  "success": true,
  "data": [
    {
      "code": "AAM",
      "name": "Angadippuram",
      "state": "Malappuram"
    },
    {
      "code": "AAP",
      "name": "Ambiapur",
      "state": "Ambiapur"
    },
    {
      "code": "ABKP",
      "name": "Ambikapur",
      "state": "Ambikapur"
    },
    {
      "code": "ABP",
      "name": "Akbarpur",
      "state": "Akbarpur"
    },
    {
      "code": "ADR",
      "name": "Mandi Adampur",
      "state": "Adampur"
    },
    {
      "code": "ADTP",
      "name": "Adityapur",
      "state": "Jamshedpur"
    },
    {
      "code": "ADX",
      "name": "Adapur",
      "state": ""
    },
    {
      "code": "AFR",
      "name": "Asafpur",
      "state": "Asafpur"
    }
  ],
  "source": "irctc-api",
  "degraded": false,
  "cached": false
}
```
</details>

<details>
<summary><b>10. Station Timetable (<code>GET /api/v1/trains/stations/NKE/timetable/2026-10-24</code>)</b></summary>

```json
{
  "success": true,
  "data": {
    "stationCode": "NKE",
    "day": "Sat",
    "total": 53,
    "trains": [
      {
        "trainNo": "63374",
        "trainName": "NKE-RXL-DBG MEMU",
        "trainType": "SUBURBAN",
        "arrival": null,
        "departure": "02:35",
        "dayOffset": 0,
        "from": "NKE",
        "to": "DBG",
        "runsOn": [
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
          "Sun"
        ]
      },
      {
        "trainNo": "63338",
        "trainName": "NKE-MFP MEMU",
        "trainType": "SUBURBAN",
        "arrival": null,
        "departure": "02:45",
        "dayOffset": 0,
        "from": "NKE",
        "to": "MFP",
        "runsOn": [
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
          "Sun"
        ]
      },
      {
        "trainNo": "15515",
        "trainName": "NKE-DNR EXPRESS",
        "trainType": "MAIL_EXPRESS",
        "arrival": null,
        "departure": "03:25",
        "dayOffset": 0,
        "from": "NKE",
        "to": "DNR",
        "runsOn": [
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
          "Sun"
        ]
      },
      {
        "trainNo": "15202",
        "trainName": "BUG-PPTA INTERCITY EXP",
        "trainType": "MAIL_EXPRESS",
        "arrival": "04:55",
        "departure": "05:05",
        "dayOffset": 0,
        "from": "BUG",
        "to": "PPTA",
        "runsOn": [
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
          "Sun"
        ]
      }
    ]
  },
  "source": "irctc-api"
}
```
</details>

<details>
<summary><b>11. Station by Code (<code>GET /api/v1/trains/stations/NDLS</code>)</b></summary>

```json
{
  "success": true,
  "data": {
    "code": "NDLS",
    "name": "New Delhi",
    "state": "Delhi"
  },
  "source": "irctc-api",
  "cached": true
}
```
</details>

<details>
<summary><b>12. Live Train Running Status (<code>GET /api/v1/live/12557?date=2026-10-24</code>)</b></summary>

```json
{
  "success": true,
  "data": {
    "trainNumber": "12557",
    "trainName": "Sapt Kranti Exp",
    "currentLocation": "Chakia",
    "locationStatus": "departed from",
    "currentDelayMin": 33,
    "currentDelayStr": "+33 min",
    "lastUpdated": "24 Oct 2026 12:58,",
    "totalDistanceKm": 1060,
    "totalHalts": 18,
    "stops": [
      {
        "stationName": "Muzaffarpur Jn",
        "day": 1,
        "date": "24-Oct",
        "arrives": "11:46",
        "departs": null,
        "delayMin": 11,
        "delayStr": "+11 min",
        "isOnTime": false,
        "status": "passed",
        "distanceKm": 0
      },
      {
        "stationName": "Motipur",
        "day": 1,
        "date": "24-Oct",
        "arrives": "12:10",
        "departs": "12:12",
        "delayMin": 3,
        "delayStr": "+3 min",
        "isOnTime": false,
        "status": "passed",
        "distanceKm": 26
      },
      {
        "stationName": "Mehsi",
        "day": 1,
        "date": "24-Oct",
        "arrives": "12:28",
        "departs": "12:30",
        "delayMin": 6,
        "delayStr": "+6 min",
        "isOnTime": false,
        "status": "passed",
        "distanceKm": 39
      },
      {
        "stationName": "Chakia",
        "day": 1,
        "date": "24-Oct",
        "arrives": "12:58",
        "departs": "13:09",
        "delayMin": 33,
        "delayStr": "+33 min",
        "isOnTime": false,
        "status": "current",
        "distanceKm": 48
      },
      {
        "stationName": "Moradabad",
        "day": 2,
        "date": "25-Oct",
        "arrives": "05:46",
        "departs": "05:54",
        "delayMin": 64,
        "delayStr": "+64 min",
        "isOnTime": false,
        "status": "upcoming",
        "distanceKm": 906
      },
      {
        "stationName": "Anand Vihar TRM",
        "day": 2,
        "date": "25-Oct",
        "arrives": "09:09",
        "departs": null,
        "delayMin": 89,
        "delayStr": "+89 min",
        "isOnTime": false,
        "status": "upcoming",
        "distanceKm": 1059
      }
    ],
    "updatedAt": "2026-10-24T07:38:35.596Z",
    "source": "confirmtkt-fetch"
  },
  "source": "irctc-api"
}
```
</details>

<details>
<summary><b>13. Live Station Display Board (<code>GET /api/v1/live/station/GKP?hours=2</code>)</b></summary>

```json
{
  "success": true,
  "stationCode": "GKP",
  "stationName": "GORAKHPUR JN",
  "totalTrains": 23,
  "trains": [
    {
      "trainNo": "04013",
      "trainName": "LKQ ANVT SPL",
      "route": "LKQ-ANVT",
      "trainType": "TRAIN ON DEMAND 2A,3A,SL,GEN,PWD",
      "platform": {
        "number": "6",
        "isProvisional": true
      },
      "hasCoachPosition": true,
      "arrival": {
        "isSource": false,
        "scheduled": "10:25",
        "actualOrEstimated": "12:16*",
        "delay": "01:51 Hrs.",
        "delayMinutes": 111,
        "status": "DELAYED"
      },
      "departure": {
        "isDestination": false,
        "scheduled": "10:35",
        "actualOrEstimated": "12:21*",
        "delay": "01:46 Hrs.",
        "delayMinutes": 106,
        "status": "DELAYED"
      }
    },
    {
      "trainNo": "22551",
      "trainName": "DBG-JUC ANTYODAY EXPRESS",
      "route": "DBG-JUC",
      "trainType": "SUPERFAST GEN",
      "platform": {
        "number": "4",
        "isProvisional": false
      },
      "hasCoachPosition": true,
      "arrival": {
        "isSource": false,
        "scheduled": "10:40",
        "actualOrEstimated": "12:56",
        "delay": "02:16 Hrs.",
        "delayMinutes": 136,
        "status": "DELAYED"
      },
      "departure": {
        "isDestination": false,
        "scheduled": "10:50",
        "actualOrEstimated": "13:01*",
        "delay": "02:11 Hrs.",
        "delayMinutes": 131,
        "status": "DELAYED"
      }
    },
    {
      "trainNo": "55032",
      "trainName": "GD-GKP PASSENGER",
      "route": "GD-GKP",
      "trainType": "PASSENGER GEN,PWD",
      "platform": {
        "number": "4",
        "isProvisional": true
      },
      "hasCoachPosition": true,
      "arrival": {
        "isSource": false,
        "scheduled": "09:05",
        "actualOrEstimated": "13:05*",
        "delay": "04:00 Hrs.",
        "delayMinutes": 240,
        "status": "DELAYED"
      },
      "departure": {
        "isDestination": true,
        "scheduled": null,
        "actualOrEstimated": null,
        "delay": "Terminates Here",
        "delayMinutes": 0,
        "status": "DESTINATION"
      }
    }
  ],
  "hours": 2,
  "toStation": null,
  "queryTime": "2026-10-24T07:38:47.241Z"
}
```
</details>

<details>
<summary><b>14. PNR Status (<code>GET /api/v1/pnr/2265248473</code>)</b></summary>

```json
{
  "success": true,
  "data": {
    "pnr": "2265248473",
    "trainNumber": "15726",
    "trainName": "ANVT NJP EXP",
    "from": {
      "code": "MFP",
      "time": "Nov 23, 2026 10:05:00 AM"
    },
    "to": {
      "code": "NJP",
      "time": "Nov 23, 2026 6:45:00 PM"
    },
    "journeyDate": "Nov 23, 2026 10:05:00 AM",
    "class": "SL",
    "quota": "GN",
    "expectedPlatform": null,
    "chartStatus": "chart not prepared",
    "passengers": [
      {
        "number": 1,
        "status": "CNF",
        "coach": "S4",
        "seat": "65",
        "berth": "LOWER BERTH",
        "raw": "CNF/S4/65/LB"
      },
      {
        "number": 2,
        "status": "CNF",
        "coach": "S4",
        "seat": "66",
        "berth": "MIDDLE BERTH",
        "raw": "CNF/S4/66/MB"
      }
    ],
    "updatedAt": "2026-10-24T07:40:06.056Z",
    "source": "indianrail"
  },
  "source": "irctc-api"
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
