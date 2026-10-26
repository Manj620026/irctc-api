export interface FeatureParameter {
  name: string;
  in: 'PATH' | 'QUERY' | 'HEADER';
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

export interface FeatureFaq {
  question: string;
  answer: string;
}

export interface FeatureGuideLink {
  title: string;
  slug: string;
  badge?: string;
  description: string;
}

export interface FeaturePageConfig {
  slug: string;
  endpointPath: string;
  method: 'GET' | 'POST';
  badge: string;
  title: string;
  h1: string;
  subtitle: string;
  metaDescription: string;
  targetKeywords: string[];
  latencyBenchmark: string;
  uptimeGuarantee: string;
  cacheTtl: string;
  reqPath: string;
  parameters: FeatureParameter[];
  responseJson: string;
  highlights: {
    title: string;
    description: string;
  }[];
  faqs: FeatureFaq[];
  relatedSlugs: string[];
  featuredGuide?: FeatureGuideLink;
}

export const FEATURE_PAGES: Record<string, FeaturePageConfig> = {
  'pnr-status-api': {
    slug: 'pnr-status-api',
    endpointPath: '/api/v1/pnr/:pnr',
    method: 'GET',
    badge: 'Real-Time Passenger Telemetry',
    title: 'PNR Status API — Real-Time Indian Railways Passenger & Charting Status',
    h1: 'Real-Time PNR Status API',
    subtitle: 'Sub-100ms Indian Railways passenger confirmation, coach & berth allocation, and chart preparation status with zero scraping headaches.',
    metaDescription: 'Query live 10-digit PNR status, coach/berth allocations (CNF, RAC, WL), and chart preparation status with sub-100ms response time. Free developer sandbox.',
    targetKeywords: ['pnr status api', 'pnr status api json', 'indian railway pnr api', 'free pnr api', 'irctc pnr status api'],
    latencyBenchmark: '68ms avg',
    uptimeGuarantee: '99.95%',
    cacheTtl: '60s Redis Cache',
    reqPath: '/api/v1/pnr/2265248473',
    parameters: [
      {
        name: 'pnr',
        in: 'PATH',
        type: 'string',
        required: true,
        description: '10-digit authentic Indian Railways PNR number without hyphens or spaces.',
        example: '2265248473'
      }
    ],
    responseJson: JSON.stringify({
      success: true,
      data: {
        pnr: "2265248473",
        trainNumber: "15726",
        trainName: "ANVT NJP EXP",
        from: { code: "MFP", time: "Nov 23, 2026 10:05:00 AM" },
        to: { code: "NJP", time: "Nov 23, 2026 6:45:00 PM" },
        journeyDate: "Nov 23, 2026 10:05:00 AM",
        class: "SL",
        quota: "GN",
        chartStatus: "chart not prepared",
        passengers: [
          {
            number: 1,
            status: "CNF",
            coach: "S4",
            seat: "65",
            berth: "LOWER BERTH",
            raw: "CNF/S4/65/LB"
          },
          {
            number: 2,
            status: "CNF",
            coach: "S4",
            seat: "66",
            berth: "MIDDLE BERTH",
            raw: "CNF/S4/66/MB"
          }
        ],
        updatedAt: "2026-10-24T07:40:06.056Z",
        source: "irctc-api"
      },
      source: "irctc-api",
      _time: 0.082
    }, null, 2),
    highlights: [
      {
        title: 'Deep Passenger Manifest',
        description: 'Instant parsing of all ticket holders with discrete booking status, current confirmation, coach code, and berth assignment (Lower, Middle, Upper, Side Lower).'
      },
      {
        title: 'Charting Status Detection',
        description: 'Accurate boolean flags detecting whether 1st chart or final chart has been prepared at the train origin station.'
      },
      {
        title: 'Zero Captcha / Direct Sync',
        description: 'Bypass Cloudflare and IRCTC session rotation limits with our automated rotating residential IP pool.'
      }
    ],
    faqs: [
      {
        question: 'How fast is the PNR status response time?',
        answer: 'Our average round-trip execution latency is under 80 milliseconds. Cached queries resolve in sub-5ms through globally distributed Redis edge instances.'
      },
      {
        question: 'Do you provide coach and seat numbers for confirmed tickets?',
        answer: 'Yes. Once a ticket is in CNF status or charted, our API returns the exact coach (e.g. B2, S4) and berth allocation (e.g. 45 LOWER BERTH).'
      },
      {
        question: 'Is there a free tier to test the PNR Status API?',
        answer: 'Every registered developer receives 10,000 free API credits upon signup at https://irctc.dev/dashboard, with zero credit card required.'
      }
    ],
    relatedSlugs: ['irctc-seats-availability-api', 'chart-vacant-berths-api', 'train-schedule-api'],
    featuredGuide: {
      title: 'How to Check Indian Railway PNR Status Programmatically',
      slug: '/guides/check-indian-railway-pnr-programmatically',
      badge: 'Production Guide',
      description: 'Step-by-step tutorial with complete Node.js and Python code samples for PNR decoding, berth allocations, and charting state.'
    }
  },

  'irctc-seats-availability-api': {
    slug: 'irctc-seats-availability-api',
    endpointPath: '/api/v1/trains/:trainNo/availability',
    method: 'GET',
    badge: '14-Day Calendar Matrix',
    title: 'IRCTC Seat Availability API — 14-Day Calendar Forecast & Confirmation Status',
    h1: 'IRCTC Seat Availability API with 14-Day Calendar',
    subtitle: 'Fetch real-time PRS seat & berth availability across all classes and quotas with a full 14-day continuous calendar forecast in a single request.',
    metaDescription: 'Fetch real-time PRS seat & berth availability across all classes (1A, 2A, 3A, 3E, SL) and quotas (GN, TQ, PT). 14-day continuous calendar in 1 call.',
    targetKeywords: ['irctc seat availability api', 'train seat availability api', '14 day seat availability forecast', 'irctc tatkal availability api', 'indian railway berth availability'],
    latencyBenchmark: '92ms avg',
    uptimeGuarantee: '99.9%',
    cacheTtl: '120s Smart Invalidation',
    reqPath: '/api/v1/trains/12557/availability?from=NKE&to=ANVT&date=17-11-2026&class=3A&quota=GN',
    parameters: [
      {
        name: 'trainNo',
        in: 'PATH',
        type: 'string',
        required: true,
        description: '5-digit Indian Railways train number (e.g. 12557).',
        example: '12557'
      },
      {
        name: 'from',
        in: 'QUERY',
        type: 'string',
        required: true,
        description: 'Source station code (e.g. NKE).',
        example: 'NKE'
      },
      {
        name: 'to',
        in: 'QUERY',
        type: 'string',
        required: true,
        description: 'Destination station code (e.g. ANVT).',
        example: 'ANVT'
      },
      {
        name: 'date',
        in: 'QUERY',
        type: 'string',
        required: true,
        description: 'Journey date in DD-MM-YYYY format (e.g. 17-11-2026).',
        example: '17-11-2026'
      },
      {
        name: 'class',
        in: 'QUERY',
        type: 'string',
        required: false,
        description: 'Travel class code (1A, 2A, 3A, 3E, CC, EC, SL). Defaults to 3A.',
        example: '3A'
      },
      {
        name: 'quota',
        in: 'QUERY',
        type: 'string',
        required: false,
        description: 'Reservation quota code (GN = General, TQ = Tatkal, PT = Premium Tatkal, LD = Ladies). Defaults to GN.',
        example: 'GN'
      }
    ],
    responseJson: JSON.stringify({
      success: true,
      trainNumber: "12557",
      trainName: "SAPT KRANTI EXP",
      from: "NKE",
      to: "ANVT",
      date: "17-11-2026",
      class: "3A",
      quota: "GN",
      availability: [
        { date: "2026-11-17", status: "AVAILABLE-0042", type: "AVAILABLE", currentBooking: "N" },
        { date: "2026-11-18", status: "GNWL271/WL140", type: "WAITLIST", currentBooking: "N" },
        { date: "2026-11-19", status: "GNWL200/WL138", type: "WAITLIST", currentBooking: "N" },
        { date: "2026-11-20", status: "GNWL160/WL110", type: "WAITLIST", currentBooking: "N" },
        { date: "2026-11-21", status: "AVAILABLE-0018", type: "AVAILABLE", currentBooking: "N" }
      ],
      source: "irctc-api",
      _cached: true,
      _time: 0.092
    }, null, 2),
    highlights: [
      {
        title: 'Continuous 14-Day Forecast',
        description: 'Return full two-week availability calendar in one request, eliminating 14 separate round-trips for OTA flight/train comparison screens.'
      },
      {
        title: 'Multi-Quota Support',
        description: 'Seamless query switching between General (GN), Tatkal (TQ), Premium Tatkal (PT), and Ladies (LD) quotas.'
      },
      {
        title: 'Current Booking Status',
        description: 'Real-time flag indicating if the train has opened for Current Booking at station counters.'
      }
    ],
    faqs: [
      {
        question: 'Does this API support Tatkal quota seat availability?',
        answer: 'Yes. Simply pass quota=TQ in your query parameters to retrieve Tatkal seat availability and waitlist numbers.'
      },
      {
        question: 'What is the date format required for seat availability?',
        answer: 'Pass the date parameter as DD-MM-YYYY (e.g. 17-11-2026).'
      },
      {
        question: 'How fresh is the seat availability data?',
        answer: 'Data is synced directly with PRS servers. Uncached queries fetch live availability in real time, while popular routes refresh continuously in background micro-batches.'
      }
    ],
    relatedSlugs: ['chart-vacant-berths-api', 'pnr-status-api', 'train-fare-api'],
    featuredGuide: {
      title: 'Build a Telegram Alert Bot for Vacant Berths After Chart Preparation',
      slug: '/guides/telegram-vacant-berths-alert-bot',
      badge: 'Companion Guide',
      description: 'Complement seat availability checks with automated alerts when waitlisted trains open vacant berths post-charting.'
    }
  },

  'chart-vacant-berths-api': {
    slug: 'chart-vacant-berths-api',
    endpointPath: '/api/v1/trains/:trainNo/chart-vacant',
    method: 'GET',
    badge: 'Exclusive Developer Moat',
    title: 'Vacant Berths After Chart Preparation API — Current Booking & TTE Allotment',
    h1: 'Vacant Berths After Chart Preparation API',
    subtitle: 'Access real-time vacant berths post-charting directly from online reservation charts. Coach-by-coach layout, current booking berths, and TTE allotment data.',
    metaDescription: 'Access real-time vacant berths post-charting directly from online reservation charts. Coach-by-coach layout, current booking vacant seats, and remote station charting.',
    targetKeywords: ['vacant berths after chart preparation api', 'irctc vacant berth api', 'train chart vacant seats api', 'current booking vacant berths api', 'irctc current booking api'],
    latencyBenchmark: '85ms avg',
    uptimeGuarantee: '99.9%',
    cacheTtl: '30s Real-Time Sync',
    reqPath: '/api/v1/trains/12557/chart-vacant?boardingStation=GKP&date=2026-10-24&class=ALL',
    parameters: [
      {
        name: 'trainNo',
        in: 'PATH',
        type: 'string',
        required: true,
        description: '5-digit Indian Railways train number (e.g. 12557).',
        example: '12557'
      },
      {
        name: 'boardingStation',
        in: 'QUERY',
        type: 'string',
        required: true,
        description: 'Boarding station code (e.g. GKP).',
        example: 'GKP'
      },
      {
        name: 'date',
        in: 'QUERY',
        type: 'string',
        required: false,
        description: 'Journey date in YYYY-MM-DD or DD-MM-YYYY format (defaults to current date).',
        example: '2026-10-24'
      },
      {
        name: 'class',
        in: 'QUERY',
        type: 'string',
        required: false,
        description: 'Travel class code (1A, 2A, 3A, 3E, SL, or ALL). Defaults to ALL.',
        example: 'ALL'
      }
    ],
    responseJson: JSON.stringify({
      success: true,
      trainNumber: "12557",
      trainName: "SAPT KRANTI EXP",
      boardingStation: "GKP",
      from: "MFP",
      to: "ANVT",
      date: "2026-10-24",
      chartStatus: {
        isChartPrepared: true,
        firstChartTime: "2026-10-24 08:40:47",
        remoteStation: "GKP",
        nextRemoteStation: "LKO"
      },
      totalVacantBerths: 14,
      summaryByClass: { "1A": 0, "2A": 2, "3A": 5, "3E": 3, "SL": 4 },
      coaches: [
        { coach: "A1", class: "2A", position: 1, vacantBerths: 2 },
        { coach: "B1", class: "3A", position: 3, vacantBerths: 5 },
        { coach: "M1", class: "3E", position: 8, vacantBerths: 3 },
        { coach: "S1", class: "SL", position: 10, vacantBerths: 4 }
      ],
      source: "irctc-api",
      syncedAt: "2026-10-24T07:36:22.920Z",
      _time: 0.085
    }, null, 2),
    highlights: [
      {
        title: 'Zero Competitor Parity',
        description: 'No other commercial API gateway exposes clean JSON structured vacant berth data post-charting. Give your travel app a unique market moat.'
      },
      {
        title: 'Coach Composition & Layout',
        description: 'Includes full train rake configuration with coach positions (A1, B1, S1) and vacant counts per coach.'
      },
      {
        title: 'Current Booking Intelligence',
        description: 'Empower users to book unallocated berths at station current counters or IRCTC app after charting.'
      }
    ],
    faqs: [
      {
        question: 'When is chart vacant data generated?',
        answer: 'First reservation chart is prepared ~4 hours prior to train origin departure. The final chart is prepared 30 minutes before departure.'
      },
      {
        question: 'Does the API work for intermediate boarding stations?',
        answer: 'Yes! Specify your boardingStation code, and our engine resolves charting status for that specific remote charting location.'
      },
      {
        question: 'Can this data be used to automate Current Booking alerts?',
        answer: 'Yes, apps use this endpoint to send instant push notifications to waitlisted travelers when seats open up in current booking.'
      }
    ],
    relatedSlugs: ['irctc-seats-availability-api', 'live-train-status-api', 'pnr-status-api'],
    featuredGuide: {
      title: 'How to Build a Telegram Alert Bot for Vacant Berths After Chart Preparation',
      slug: '/guides/telegram-vacant-berths-alert-bot',
      badge: 'Bot Blueprint',
      description: 'Step-by-step tutorial on building a Telegram bot to get alerted when train charts are prepared and vacant berths open for IRCTC Current Booking.'
    }
  },

  'live-train-status-api': {
    slug: 'live-train-status-api',
    endpointPath: '/api/v1/live/:trainNo',
    method: 'GET',
    badge: 'Real-Time Satellite GPS Sync',
    title: 'Live Train Running Status API — Real-Time Satellite GPS Delay & Halts Telemetry',
    h1: 'Live Train Running Status API',
    subtitle: 'Track real-time train running status, current station, GPS delay in minutes, and platform numbers directly from railway telemetry feeds with sub-second execution.',
    metaDescription: 'Track real-time train location, current station, live delay in minutes, and platform numbers directly from live tracking feeds. Sub-second response for tracking apps.',
    targetKeywords: ['live train status api', 'live train running status api json', 'live train tracking api', 'train running status api', 'indian railway gps location api'],
    latencyBenchmark: '54ms avg',
    uptimeGuarantee: '99.95%',
    cacheTtl: '45s Real-Time Buffer',
    reqPath: '/api/v1/live/12557?date=2026-10-24',
    parameters: [
      {
        name: 'trainNo',
        in: 'PATH',
        type: 'string',
        required: true,
        description: '5-digit Indian Railways train number (e.g. 12557).',
        example: '12557'
      },
      {
        name: 'date',
        in: 'QUERY',
        type: 'string',
        required: false,
        description: 'Journey start date in YYYY-MM-DD format (defaults to current date).',
        example: '2026-10-24'
      }
    ],
    responseJson: JSON.stringify({
      success: true,
      data: {
        trainNumber: "12557",
        trainName: "Sapt Kranti Exp",
        currentLocation: "Chakia",
        locationStatus: "departed from",
        currentDelayMin: 33,
        currentDelayStr: "+33 min",
        lastUpdated: "24 Oct 2026 12:58",
        totalDistanceKm: 1060,
        totalHalts: 18,
        stops: [
          { stationName: "Muzaffarpur Jn", day: 1, arrives: "11:46", delayMin: 11, status: "passed", distanceKm: 0 },
          { stationName: "Motipur", day: 1, arrives: "12:10", delayMin: 3, status: "passed", distanceKm: 26 },
          { stationName: "Chakia", day: 1, arrives: "12:58", delayMin: 33, status: "current", distanceKm: 48 },
          { stationName: "Moradabad", day: 2, arrives: "05:46", delayMin: 64, status: "upcoming", distanceKm: 906 },
          { stationName: "Anand Vihar TRM", day: 2, arrives: "09:09", delayMin: 89, status: "upcoming", distanceKm: 1059 }
        ],
        updatedAt: "2026-10-24T07:38:35.596Z",
        source: "irctc-api"
      },
      source: "irctc-api",
      _time: 0.054
    }, null, 2),
    highlights: [
      {
        title: 'Passed vs Upcoming Halts',
        description: 'Clean discrete status classification ("passed", "current", "upcoming") for rendering intuitive progress bars and travel timelines.'
      },
      {
        title: 'Precision Delay Minutes',
        description: 'Integer delay (e.g. 33) and formatted strings ("+33 min") for effortless calculation of expected arrival times.'
      },
      {
        title: 'Zero Latency Telemetry Buffer',
        description: 'Edge-cached telemetry prevents upstream rate-limits while delivering fresh updates every 45-60 seconds.'
      }
    ],
    faqs: [
      {
        question: 'How frequently is the train GPS location updated?',
        answer: 'Location data refreshes continuously from railway GPS transponders and station passing records every 45 to 60 seconds.'
      },
      {
        question: 'Does this endpoint support multi-day overnight trains?',
        answer: 'Yes. Each halt contains a day counter (e.g. Day 1, Day 2) and full cumulative distance in kilometers.'
      },
      {
        question: 'Can I track trains by train name instead of number?',
        answer: 'Use our Train Search by Name endpoint to resolve the 5-digit train number first, then query this live status endpoint.'
      }
    ],
    relatedSlugs: ['train-schedule-api', 'trains-between-stations-api', 'pnr-status-api'],
    featuredGuide: {
      title: 'How to Build a WhatsApp Train Running Status & PNR Bot in Node.js',
      slug: '/guides/whatsapp-train-status-bot-nodejs',
      badge: 'WhatsApp Bot Tutorial',
      description: 'Complete tutorial on building an automated WhatsApp bot for Indian Railways live train status and PNR checks using Baileys and Node.js.'
    }
  },

  'trains-between-stations-api': {
    slug: 'trains-between-stations-api',
    endpointPath: '/api/v1/trains/search',
    method: 'GET',
    badge: 'Core Route Discovery',
    title: 'Trains Between Stations API — Direct Indian Railways Route Search & Schedule',
    h1: 'Trains Between Stations API',
    subtitle: 'Search all running trains between any two Indian Railways station codes with travel duration, running days, distance, halts, and base fares.',
    metaDescription: 'Search all running trains between any two Indian Railways station codes (e.g. NDLS to BTI) with travel duration, running days, distance, and base fares.',
    targetKeywords: ['trains between stations api', 'find trains api', 'indian railway route search api', 'train search api json', 'irctc direct trains api'],
    latencyBenchmark: '42ms avg',
    uptimeGuarantee: '99.95%',
    cacheTtl: '24h In-Memory Hash',
    reqPath: '/api/v1/trains/search?from=NDLS&to=GD&date=2026-10-24',
    parameters: [
      {
        name: 'from',
        in: 'QUERY',
        type: 'string',
        required: true,
        description: 'Source station code (e.g. NDLS).',
        example: 'NDLS'
      },
      {
        name: 'to',
        in: 'QUERY',
        type: 'string',
        required: true,
        description: 'Destination station code (e.g. GD).',
        example: 'GD'
      },
      {
        name: 'date',
        in: 'QUERY',
        type: 'string',
        required: false,
        description: 'Journey date in YYYY-MM-DD format to filter active running days.',
        example: '2026-10-24'
      }
    ],
    responseJson: JSON.stringify({
      success: true,
      data: [
        {
          trainNo: "12556",
          trainName: "GORAKHDHAM EXP",
          trainType: "SUPERFAST",
          fromStation: "NDLS",
          toStation: "GD",
          fromStationName: "NEW DELHI",
          toStationName: "GONDA JN",
          departure: "21:25",
          arrival: "07:00",
          durationMin: 575,
          durationStr: "9:35",
          runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          distance: "631",
          estimatedFare: 372,
          halts: 4
        },
        {
          trainNo: "12566",
          trainName: "BIHAR S KRANTI",
          trainType: "SUPERFAST",
          fromStation: "NDLS",
          toStation: "GD",
          fromStationName: "NEW DELHI",
          toStationName: "GONDA JN",
          departure: "12:45",
          arrival: "22:26",
          durationMin: 581,
          durationStr: "9:41",
          runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          distance: "639",
          estimatedFare: 376,
          halts: 4
        }
      ],
      source: "irctc-api",
      _time: 0.042
    }, null, 2),
    highlights: [
      {
        title: 'Lightning Route Resolution',
        description: 'Calculates all direct services across 8,500+ Indian stations in under 50ms using pre-compiled graph routing tables.'
      },
      {
        title: 'Running Days & Weekly Calendar',
        description: 'Instant verification of weekday frequency (Mon through Sun) with automated date matching.'
      },
      {
        title: 'Fare & Duration Estimates',
        description: 'Built-in base fare estimation and duration formatting for immediate rendering in flight/bus comparison screens.'
      }
    ],
    faqs: [
      {
        question: 'What station codes are supported?',
        answer: 'All 8,500+ Indian Railways station codes (e.g. NDLS, CSMT, HWH, MAS, SBC, PNBE) are fully indexed.'
      },
      {
        question: 'Does this endpoint show connecting trains?',
        answer: 'This endpoint currently resolves direct point-to-point services. Direct routes represent over 92% of commuter and express bookings.'
      },
      {
        question: 'Can I filter trains running only on a specific date?',
        answer: 'Yes, passing the date parameter automatically filters results to trains operating on that particular calendar day.'
      }
    ],
    relatedSlugs: ['train-schedule-api', 'irctc-seats-availability-api', 'train-fare-api'],
    featuredGuide: {
      title: 'How to Build a WhatsApp Train Running Status & PNR Bot in Node.js',
      slug: '/guides/whatsapp-train-status-bot-nodejs',
      badge: 'Route Automation',
      description: 'Integrate route search and live train status directly into an automated WhatsApp messaging workflow.'
    }
  },

  'train-fare-api': {
    slug: 'train-fare-api',
    endpointPath: '/api/v1/trains/:trainNo/fare',
    method: 'GET',
    badge: 'Transparent Fare Calculator',
    title: 'Train Fare API — Real-Time Ticket Fare Breakup & Dynamic Pricing',
    h1: 'Train Fare & Ticket Pricing API',
    subtitle: 'Fetch real-time train ticket fare breakups across all classes with discrete components: Base Fare, Reservation, Superfast, GST, and Catering.',
    metaDescription: 'Calculate real-time train ticket fares across all classes. Detailed breakup of Base Fare, Reservation Charges, Superfast Surcharge, GST, and Catering.',
    targetKeywords: ['train fare api', 'irctc ticket fare api', 'railway fare breakup api', 'train fare calculator json', 'indian railway ticket price api'],
    latencyBenchmark: '48ms avg',
    uptimeGuarantee: '99.95%',
    cacheTtl: '12h Price Table Cache',
    reqPath: '/api/v1/trains/12558/fare?from=ANVT&to=NKE&class=all&quota=GN',
    parameters: [
      {
        name: 'trainNo',
        in: 'PATH',
        type: 'string',
        required: true,
        description: '5-digit Indian Railways train number (e.g. 12558).',
        example: '12558'
      },
      {
        name: 'from',
        in: 'QUERY',
        type: 'string',
        required: true,
        description: 'Origin station code (e.g. ANVT).',
        example: 'ANVT'
      },
      {
        name: 'to',
        in: 'QUERY',
        type: 'string',
        required: true,
        description: 'Destination station code (e.g. NKE).',
        example: 'NKE'
      },
      {
        name: 'class',
        in: 'QUERY',
        type: 'string',
        required: false,
        description: 'Travel class code (1A, 2A, 3A, 3E, SL, or all). Defaults to all.',
        example: 'all'
      },
      {
        name: 'quota',
        in: 'QUERY',
        type: 'string',
        required: false,
        description: 'Quota code (GN = General, TQ = Tatkal). Defaults to GN.',
        example: 'GN'
      }
    ],
    responseJson: JSON.stringify({
      success: true,
      trainNumber: "12558",
      trainName: "SAPT KRANTI EXP",
      from: "ANVT",
      to: "NKE",
      quota: "GN",
      totalClasses: 4,
      fares: [
        {
          class: "1A",
          className: "First AC",
          totalFare: 3045,
          breakup: { baseFare: 2765, reservationCharge: 60, superfastCharge: 75, gst: 145, cateringCharge: 0 }
        },
        {
          class: "2A",
          className: "Second AC",
          totalFare: 1825,
          breakup: { baseFare: 1643, reservationCharge: 50, superfastCharge: 45, gst: 87, cateringCharge: 0 }
        },
        {
          class: "3A",
          className: "Third AC",
          totalFare: 1300,
          breakup: { baseFare: 1149, reservationCharge: 40, superfastCharge: 45, gst: 62, cateringCharge: 0 }
        },
        {
          class: "SL",
          className: "Sleeper",
          totalFare: 505,
          breakup: { baseFare: 454, reservationCharge: 20, superfastCharge: 30, gst: 0, cateringCharge: 0 }
        }
      ],
      source: "irctc-api",
      _time: 0.048
    }, null, 2),
    highlights: [
      {
        title: 'Itemized Fee Breakdown',
        description: 'Transparent audit of GST, Reservation Charge, and Superfast fee for seamless financial reporting in corporate expense apps.'
      },
      {
        title: 'All-Class Comparison',
        description: 'Pass class=all to receive fares for First AC, 2A, 3A, Economy 3E, and Sleeper in a single API query.'
      },
      {
        title: 'Tatkal & Dynamic Fare Support',
        description: 'Automatic computation of Tatkal charges and dynamic pricing surge adjustments.'
      }
    ],
    faqs: [
      {
        question: 'Does the fare response include GST for AC coaches?',
        answer: 'Yes, Indian Railways 5% GST on AC travel classes is broken down explicitly in breakup.gst.'
      },
      {
        question: 'Can I fetch fares for Tatkal quota?',
        answer: 'Pass quota=TQ to receive total Tatkal fares including applicable reservation surcharges.'
      },
      {
        question: 'Are concession fares supported?',
        answer: 'Our fare engine returns standard adult commercial tariffs used by IRCTC authorized booking agents and OTAs.'
      }
    ],
    relatedSlugs: ['trains-between-stations-api', 'irctc-seats-availability-api', 'pnr-status-api'],
    featuredGuide: {
      title: 'How to Check Indian Railway PNR Status Programmatically',
      slug: '/guides/check-indian-railway-pnr-programmatically',
      badge: 'Fare & Passenger Guide',
      description: 'Pair ticket fare calculation with passenger verification workflows using production-tested Node.js and Python blueprints.'
    }
  },

  'train-schedule-api': {
    slug: 'train-schedule-api',
    endpointPath: '/api/v1/trains/:trainNo',
    method: 'GET',
    badge: 'Complete Timetable & GPS Halts',
    title: 'Train Schedule API — Full Timetable, Route Halts & Station GPS Coordinates',
    h1: 'Train Schedule & Route Halts API',
    subtitle: 'Fetch the complete timetable for any 5-digit Indian Railways train: sequential station halts, arrival/departure timings, halt durations, distance, and lat/long coordinates.',
    metaDescription: 'Fetch complete schedule for any 5-digit Indian Railways train. Includes station sequence, arrival/departure times, halt durations, distance, and lat/long.',
    targetKeywords: ['train schedule api', 'train timetable api', 'train route halts api', 'indian railway train schedule json', 'train station sequence api'],
    latencyBenchmark: '38ms avg',
    uptimeGuarantee: '99.95%',
    cacheTtl: '7d Static Rake Cache',
    reqPath: '/api/v1/trains/26502',
    parameters: [
      {
        name: 'trainNo',
        in: 'PATH',
        type: 'string',
        required: true,
        description: '5-digit Indian Railways train number (e.g. 26502 for Vande Bharat).',
        example: '26502'
      }
    ],
    responseJson: JSON.stringify({
      success: true,
      data: {
        trainNo: "26502",
        trainName: "VANDE BHARAT EXP",
        trainType: "VANDE_BHARAT",
        runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sun"],
        totalDistance: 384,
        originCode: "GKP",
        destinationCode: "PPTA",
        stations: [
          { seq: 1, code: "GKP", name: "GORAKHPUR JN", departure: "05:40", haltMinutes: 0, distanceKm: 0, lat: 26.7596, lng: 83.3818 },
          { seq: 2, code: "CPJ", name: "KAPTANGANJ JN", arrival: "06:24", departure: "06:26", haltMinutes: 2, distanceKm: 40, lat: 26.9262, lng: 83.6990 },
          { seq: 3, code: "BTH", name: "BETTIAH", arrival: "08:36", departure: "08:38", haltMinutes: 2, distanceKm: 187, lat: 26.8053, lng: 84.5223 },
          { seq: 4, code: "MFP", name: "MUZAFFARPUR JN", arrival: "10:45", departure: "10:50", haltMinutes: 5, distanceKm: 310, lat: 26.1223, lng: 85.3779 },
          { seq: 5, code: "PPTA", name: "PATLIPUTRA", arrival: "12:45", haltMinutes: 0, distanceKm: 384, lat: 25.6216, lng: 85.0688 }
        ]
      },
      source: "irctc-api",
      _time: 0.038
    }, null, 2),
    highlights: [
      {
        title: 'Geospatial Lat & Lng Data',
        description: 'Every station halt contains precise geographic coordinates for direct plotting on Mapbox, Google Maps, or Leaflet.'
      },
      {
        title: 'Halt Minutes & Day Offset',
        description: 'Explicit halt duration (e.g. 5 minutes) and day offsets for accurate scheduling on trans-continental express trains.'
      },
      {
        title: 'Comprehensive 8,500 Station Network',
        description: 'Over 13,000 passenger, superfast, mail express, Rajdhani, and Vande Bharat train routes indexed.'
      }
    ],
    faqs: [
      {
        question: 'Does this endpoint include station geographic coordinates?',
        answer: 'Yes! Every station in the stations array has lat and lng coordinates ready for map visualization.'
      },
      {
        question: 'How are intermediate stops ordered?',
        answer: 'Stations are strictly sorted in sequential order using the seq index (1 through N).'
      },
      {
        question: 'Can I query schedules for special festival trains?',
        answer: 'Yes, our timetable engine synchronizes weekly with railway databases to index special seasonal and festival express trains.'
      }
    ],
    relatedSlugs: ['live-train-status-api', 'trains-between-stations-api', 'pnr-status-api'],
    featuredGuide: {
      title: 'How to Build a WhatsApp Train Running Status & PNR Bot in Node.js',
      slug: '/guides/whatsapp-train-status-bot-nodejs',
      badge: 'Route & Halts Guide',
      description: 'Combine complete train timetable halts with live satellite GPS updates for real-time passenger tracking.'
    }
  }
};
