export interface RouteMeta {
  title: string;
  desc: string;
}

export const ROUTE_META: Record<string, RouteMeta> = {
  '/': {
    title: 'IRCTC API — Sub-Millisecond Indian Railways Infrastructure for Developers',
    desc: 'High-performance Indian Railways API developer platform, interactive playground, and TypeScript SDK. 14 REST endpoints for PNR, live GPS tracking, 14-day seat availability, and vacant berths.',
  },
  '/docs': {
    title: 'API Documentation & 14 Endpoints Reference — IRCTC API',
    desc: 'Complete REST API documentation for Indian Railways: live seat availability, chart vacant berths, ticket fare breakup, PNR verification, and live station display boards.',
  },
  '/playground': {
    title: 'Interactive API Playground & Live Sandbox — IRCTC API',
    desc: 'Test live authenticated queries against Indian Railways APIs directly in your browser. Measure execution latency and inspect real-time JSON responses.',
  },
  '/dashboard': {
    title: 'Developer Console & API Key Management — IRCTC API',
    desc: 'Manage secret API keys, monitor request quotas, view real-time telemetry logs, and top up credits with Google OAuth authentication.',
  },
  '/terms': {
    title: 'Commercial Terms of Service — IRCTC API',
    desc: 'Read the commercial terms of service, API license, usage guidelines, and service agreements governing the IRCTC API platform.',
  },
  '/privacy': {
    title: 'Privacy Policy & Data Protection — IRCTC API',
    desc: 'Learn how IRCTC API collects, stores, and protects developer information in compliance with DPDP and GDPR data protection regulations.',
  },
  '/pnr-status-api': {
    title: 'PNR Status API — Real-Time Indian Railways Passenger & Charting Status',
    desc: 'Query live 10-digit PNR status, coach/berth allocations (CNF, RAC, WL), and chart preparation status with sub-100ms response time. Free developer sandbox.',
  },
  '/irctc-seats-availability-api': {
    title: 'IRCTC Seat Availability API — 14-Day Calendar Forecast & Confirmation Status',
    desc: 'Fetch real-time PRS seat & berth availability across all classes (1A, 2A, 3A, 3E, SL) and quotas (GN, TQ, PT). 14-day continuous calendar in 1 call.',
  },
  '/chart-vacant-berths-api': {
    title: 'Vacant Berths After Chart Preparation API — Current Booking & TTE Allotment',
    desc: 'Access real-time vacant berths post-charting directly from online reservation charts. Coach-by-coach layout, current booking vacant seats, and remote station charting.',
  },
  '/live-train-status-api': {
    title: 'Live Train Running Status API — Real-Time Satellite GPS Delay & Halts Telemetry',
    desc: 'Track real-time train location, current station, live delay in minutes, and platform numbers directly from live tracking feeds. Sub-second response for tracking apps.',
  },
  '/trains-between-stations-api': {
    title: 'Trains Between Stations API — Direct Indian Railways Route Search & Schedule',
    desc: 'Search all running trains between any two Indian Railways station codes (e.g. NDLS to BTI) with travel duration, running days, distance, and base fares.',
  },
  '/train-fare-api': {
    title: 'Train Fare API — Real-Time Ticket Fare Breakup & Dynamic Pricing',
    desc: 'Calculate real-time train ticket fares across all classes. Detailed breakup of Base Fare, Reservation Charges, Superfast Surcharge, GST, and Catering.',
  },
  '/train-schedule-api': {
    title: 'Train Schedule API — Full Timetable, Route Halts & Station GPS Coordinates',
    desc: 'Fetch complete schedule for any 5-digit Indian Railways train. Includes station sequence, arrival/departure times, halt durations, distance, and lat/long.',
  },
  '/guides': {
    title: 'Developer Guides & Practical Railway Tutorials — IRCTC API',
    desc: 'Production-ready walkthroughs and runnable blueprints: build WhatsApp train bots, Telegram vacant berth alerts, and automated PNR checks in Node.js and Python.',
  },
  '/guides/whatsapp-train-status-bot-nodejs': {
    title: 'How to Build a WhatsApp Train Running Status & PNR Bot in Node.js (2026 Tutorial)',
    desc: 'Complete tutorial on building an automated WhatsApp bot for Indian Railways live train status and PNR checks using Baileys and Node.js with copy-paste code.',
  },
  '/guides/telegram-vacant-berths-alert-bot': {
    title: 'How to Build a Telegram Alert Bot for Vacant Berths After Chart Preparation',
    desc: 'Step-by-step tutorial on building a Telegram bot to get alerted when train charts are prepared and vacant berths open for IRCTC Current Booking.',
  },
  '/guides/check-indian-railway-pnr-programmatically': {
    title: 'How to Check Indian Railway PNR Status Programmatically (Node.js & Python Guide)',
    desc: 'Learn how to check Indian Railways 10-digit PNR status programmatically in Node.js and Python with complete response fields, berth allocations, and charting state.',
  },
  '/guides/irctc-seat-availability-tracker-python': {
    title: 'How to Build an Automated 14-Day Seat Availability Tracker in Python',
    desc: 'Step-by-step tutorial on building an automated Python daemon to monitor Indian Railways 14-day seat availability and send instant Telegram alerts when tickets become available.',
  },
  '/404': {
    title: '404 — Page Not Found | IRCTC Developer Platform',
    desc: 'The requested Indian Railways endpoint or resource does not exist.',
  },
};
