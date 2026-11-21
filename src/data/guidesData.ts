export interface GuideStep {
  number: number;
  title: string;
  description: string;
  language?: 'typescript' | 'javascript' | 'python' | 'bash' | 'json';
  codeSnippet?: string;
  notes?: string;
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface GuideConfig {
  slug: string;
  title: string;
  h1: string;
  subtitle: string;
  metaDescription: string;
  targetKeywords: string[];
  category: 'Bots & Messaging' | 'Alerts & Automation' | 'Developer Guides';
  readingTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  techStack: string[];
  publishedDate: string;
  updatedDate: string;
  author: {
    name: string;
    role: string;
    avatarUrl: string;
  };
  prerequisites: string[];
  architectureOverview: string;
  steps: GuideStep[];
  faqs: GuideFaq[];
  relatedEndpoint: {
    name: string;
    path: string;
    ctaLabel: string;
  };
}

export const GUIDES_DATA: Record<string, GuideConfig> = {
  'whatsapp-train-status-bot-nodejs': {
    slug: 'whatsapp-train-status-bot-nodejs',
    title: 'How to Build a WhatsApp Train Running Status & PNR Bot in Node.js (2026 Tutorial)',
    h1: 'Build a WhatsApp Train Running Status & PNR Bot in Node.js',
    subtitle: 'Step-by-step guide to building a production-ready WhatsApp bot for live Indian Railways GPS tracking, PNR verification, and seat availability using Baileys and the irctc-api SDK.',
    metaDescription: 'Complete tutorial on building an automated WhatsApp bot for Indian Railways live train status and PNR checks using Baileys and Node.js with copy-paste code.',
    targetKeywords: [
      'whatsapp train bot nodejs',
      'railway pnr whatsapp bot',
      'live train status whatsapp bot',
      'irctc whatsapp bot tutorial',
      'baileys whatsapp train bot'
    ],
    category: 'Bots & Messaging',
    readingTime: '12 min read',
    difficulty: 'Intermediate',
    techStack: ['Node.js', 'TypeScript', 'Baileys', 'irctc-api'],
    publishedDate: '2026-10-25',
    updatedDate: '2026-10-25',
    author: {
      name: 'IRCTC Developer Relations',
      role: 'Platform Engineering',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=faces'
    },
    prerequisites: [
      'Node.js 18+ LTS installed on your machine or VPS',
      'An active WhatsApp account on your mobile phone',
      'Free IRCTC API Key from https://irctc.dev/dashboard'
    ],
    architectureOverview:
      'User sends a WhatsApp message (!live 12558 or !pnr 2265248473) ➔ Baileys socket receives text ➔ Command router dispatches query to https://api.irctc.dev with caching ➔ Bot sends back a richly formatted WhatsApp message with delays and berth status.',
    steps: [
      {
        number: 1,
        title: 'Initialize Node.js Project & Install Dependencies',
        description:
          'Create a new project directory and install @whiskeysockets/baileys for WhatsApp Web socket connectivity, qrcode-terminal for initial login scanning, irctc-api for railway data, and dotenv for environment variable security.',
        language: 'bash',
        codeSnippet: `mkdir irctc-whatsapp-bot && cd irctc-whatsapp-bot
npm init -y
npm install @whiskeysockets/baileys qrcode-terminal irctc-api dotenv
npm install -D typescript @types/node ts-node
npx tsc --init`,
        notes: 'Baileys connects directly via WhatsApp Web WebSocket protocol with zero recurring Twilio or Meta WhatsApp Business API fees.'
      },
      {
        number: 2,
        title: 'Configure Environment Variables (.env)',
        description:
          'Create a .env file in the root directory to store your secret IRCTC Developer API key securely. Never commit this file to version control.',
        language: 'bash',
        codeSnippet: `IRCTC_API_KEY=your_api_key_here
BOT_PREFIX=!
NODE_ENV=production`,
        notes: 'Get your free API key with 10,000 initial credits at https://irctc.dev/dashboard.'
      },
      {
        number: 3,
        title: 'Initialize the IRCTC API Client & WhatsApp Socket',
        description:
          'Create index.ts and initialize the Baileys socket with persistent multi-file authentication credentials so you only need to scan the QR code once.',
        language: 'typescript',
        codeSnippet: `import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode-terminal';
import { IrctcApi } from 'irctc-api';
import dotenv from 'dotenv';

dotenv.config();

// 1. Initialize IRCTC Developer Client
const irctc = new IrctcApi({
  apiKey: process.env.IRCTC_API_KEY || ''
});

// 2. Start WhatsApp Socket Connection
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      console.log('⚡ Scan QR code with WhatsApp on your phone:');
      qrcode.generate(qr, { small: true });
    }
    if (connection === 'close') {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Connection closed. Reconnecting:', shouldReconnect);
      if (shouldReconnect) startBot();
    } else if (connection === 'open') {
      console.log('✅ IRCTC WhatsApp Bot is online and listening!');
    }
  });

  sock.ev.on('creds.update', saveCreds);

  return sock;
}

startBot();`,
        notes: 'auth_info_baileys directory saves login tokens. Keep it secure and add it to your .gitignore.'
      },
      {
        number: 4,
        title: 'Handle Incoming Messages & Command Parsing',
        description:
          'Listen to incoming messages via sock.ev.on("messages.upsert") and parse commands: !live <trainNo>, !pnr <pnrNumber>, and !help.',
        language: 'typescript',
        codeSnippet: `// Inside startBot() after socket setup:
sock.ev.on('messages.upsert', async ({ messages, type }) => {
  if (type !== 'notify') return;
  const msg = messages[0];
  if (!msg.message || msg.key.fromMe) return;

  const sender = msg.key.remoteJid!;
  const text =
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text ||
    '';

  const trimmed = text.trim();

  // 1. Help Menu Command
  if (trimmed === '!help' || trimmed === '!start') {
    const helpText = \`🚆 *IRCTC Railway Assistant*
Available Commands:
• *!live <TrainNo>* — Live running status & delay
• *!pnr <10-Digit PNR>* — Passenger status & berths
• *!fare <TrainNo> <From> <To>* — Ticket fare breakup

*Example:* !live 12558\`;
    await sock.sendMessage(sender, { text: helpText });
    return;
  }

  // 2. Live Train Status Command
  if (trimmed.startsWith('!live ')) {
    const trainNo = trimmed.replace('!live ', '').trim();
    if (!/^\\d{4,5}$/.test(trainNo)) {
      await sock.sendMessage(sender, { text: '⚠️ Please provide a valid 4 or 5 digit train number.' });
      return;
    }

    try {
      await sock.sendMessage(sender, { text: \`🔍 Fetching live running status for train \${trainNo}...\` });
      const status = await irctc.live.getRunningStatus(trainNo);

      const reply = \`🚆 *Train \${status.trainNumber} — \${status.trainName}*
📍 *Current Station:* \${status.currentStationName} (\${status.currentStationCode})
⏱️ *Status:* \${status.delayMinutes > 0 ? \`Delayed by \${status.delayMinutes} mins\` : 'Running On Time 🟢'}
🎯 *Next Station:* \${status.nextStationName}
🏁 *Updated:* \${status.updatedAt || 'Just now'}\`;

      await sock.sendMessage(sender, { text: reply });
    } catch (err: any) {
      await sock.sendMessage(sender, { text: \`❌ Error: \${err.message || 'Could not fetch status'}\` });
    }
  }

  // 3. PNR Status Command
  if (trimmed.startsWith('!pnr ')) {
    const pnr = trimmed.replace('!pnr ', '').trim();
    if (!/^\\d{10}$/.test(pnr)) {
      await sock.sendMessage(sender, { text: '⚠️ Please provide a valid 10-digit PNR number.' });
      return;
    }

    try {
      await sock.sendMessage(sender, { text: \`🔍 Verifying PNR \${pnr} with Indian Railways PRS...\` });
      const pnrData = await irctc.pnr.check(pnr);

      let passengersList = pnrData.passengers
        .map((p: any, i: number) => \`  • Passenger \${i + 1}: *\${p.currentStatus}* (Coach \${p.coach || 'N.A'}, Berth \${p.berthNumber || 'N.A'} \${p.berth ? \`[\${p.berth}]\` : ''})\`)
        .join('\\n');

      const pnrReply = \`📋 *PNR Status: \${pnrData.pnr}*
🚆 *Train:* \${pnrData.trainNumber} - \${pnrData.trainName}
🗓️ *Date of Journey:* \${pnrData.doj}
🛣️ *Route:* \${pnrData.from} ➔ \${pnrData.to}
📊 *Charting:* \${pnrData.chartStatus}

👥 *Passenger Manifest:*
\${passengersList}\`;

      await sock.sendMessage(sender, { text: pnrReply });
    } catch (err: any) {
      await sock.sendMessage(sender, { text: \`❌ Error: \${err.message || 'Failed to check PNR'}\` });
    }
  }
});`,
        notes: 'Notice how we extract the normalized berth field (e.g. LOWER BERTH) so passengers know their exact seat location immediately.'
      },
      {
        number: 5,
        title: 'Add In-Memory Request Caching to Protect Quotas',
        description:
          'When hundreds of users query the same popular train (e.g. 12558 Sapt Kranti), caching the result for 60 seconds saves API credits and cuts response time to under 5ms.',
        language: 'typescript',
        codeSnippet: `// Simple in-memory LRU cache
const liveCache = new Map<string, { data: any; expiry: number }>();

async function getCachedLiveStatus(trainNo: string) {
  const now = Date.now();
  const cached = liveCache.get(trainNo);
  if (cached && cached.expiry > now) {
    return cached.data;
  }

  const live = await irctc.live.getRunningStatus(trainNo);
  liveCache.set(trainNo, { data: live, expiry: now + 60_000 }); // 60s TTL
  return live;
}`,
        notes: 'In production with multiple instances, you can swap this in-memory Map with Redis for distributed multi-process caching.'
      },
      {
        number: 6,
        title: 'Run 24/7 in Background with PM2 on VPS',
        description:
          'Compile TypeScript to JavaScript and configure PM2 process manager to ensure your bot auto-restarts on server reboots or unexpected crashes.',
        language: 'bash',
        codeSnippet: `npm run build # or npx tsc
npm install -g pm2
pm2 start dist/index.js --name "irctc-whatsapp-bot"
pm2 save
pm2 startup`,
        notes: 'Use pm2 logs irctc-whatsapp-bot to monitor live conversations, queries, and connection events in real time.'
      }
    ],
    faqs: [
      {
        question: 'Does this bot require paid WhatsApp Business API credentials?',
        answer: 'No. This guide uses Baileys to connect via WhatsApp Web WebSocket protocol. It works with standard WhatsApp numbers with zero per-message charges.'
      },
      {
        question: 'How fast are the live train status and PNR responses?',
        answer: 'IRCTC API queries execute in sub-100ms. Combined with WhatsApp WebSocket transmission, users receive formatted updates in under 1 second.'
      },
      {
        question: 'Can I add support for group chats?',
        answer: 'Yes. In msg.key.remoteJid, group chats end with @g.us. You can configure the bot to only reply when mentioned or when a command begins with !live.'
      }
    ],
    relatedEndpoint: {
      name: 'Live Train Running Status API',
      path: '/live-train-status-api',
      ctaLabel: 'Inspect Live Running API Docs'
    }
  },

  'telegram-vacant-berths-alert-bot': {
    slug: 'telegram-vacant-berths-alert-bot',
    title: 'How to Build a Telegram Alert Bot for Vacant Berths After Chart Preparation',
    h1: 'Build a Telegram Alert Bot for Vacant Berths After Chart Preparation',
    subtitle: 'Learn how to monitor Indian Railways chart preparation 4 hours before departure and send instant Telegram push notifications when vacant berths open for Current Booking.',
    metaDescription: 'Step-by-step tutorial on building a Telegram bot to get alerted when train charts are prepared and vacant berths open for IRCTC Current Booking.',
    targetKeywords: [
      'train chart vacancy alert telegram bot',
      'irctc current booking notification',
      'vacant berths after chart preparation api',
      'telegram railway alert bot nodejs',
      'irctc vacant berth alert'
    ],
    category: 'Alerts & Automation',
    readingTime: '10 min read',
    difficulty: 'Intermediate',
    techStack: ['Node.js', 'Telegram Bot API', 'irctc-api', 'node-cron'],
    publishedDate: '2026-10-25',
    updatedDate: '2026-10-25',
    author: {
      name: 'IRCTC Developer Relations',
      role: 'Platform Engineering',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=faces'
    },
    prerequisites: [
      'Node.js 18+ installed locally or on a cloud server',
      'A Telegram account to create a bot token with @BotFather',
      'Free IRCTC Developer API key from https://irctc.dev/dashboard'
    ],
    architectureOverview:
      'Cron job polls https://api.irctc.dev/api/v1/trains/:trainNo/chart-vacant every 2 minutes starting 4.5 hours before departure ➔ Checks isChartPrepared === true ➔ Extracts vacant seats in 3A/2A/SL ➔ Sends rich Telegram alert with 1-click booking link.',
    steps: [
      {
        number: 1,
        title: 'Create Your Telegram Bot with @BotFather',
        description:
          'Open Telegram, search for @BotFather, send /newbot, and follow prompts to name your bot. Save the HTTP API bot token (e.g. 7182938491:AAH...g).',
        language: 'bash',
        codeSnippet: `/newbot
# Enter name: IRCTC Vacant Berth Notifier
# Enter username: irctc_vacant_alert_bot
# BotFather returns: Use this token to access the HTTP API:
# 7182938491:AAHk1_example_token_here`,
        notes: 'Also get your personal Telegram Chat ID by messaging @userinfobot to receive test alerts.'
      },
      {
        number: 2,
        title: 'Project Setup & Package Installation',
        description:
          'Create a directory and install node-telegram-bot-api for Telegram notifications, irctc-api for real-time vacant berth checking, and node-cron for automated scheduling.',
        language: 'bash',
        codeSnippet: `mkdir irctc-telegram-alerts && cd irctc-telegram-alerts
npm init -y
npm install node-telegram-bot-api irctc-api node-cron dotenv
npm install -D typescript @types/node @types/node-telegram-bot-api ts-node
npx tsc --init`,
        notes: 'node-cron handles precise periodic polling without heavy external workflow infrastructure.'
      },
      {
        number: 3,
        title: 'Configure .env Secrets',
        description:
          'Store your Telegram credentials and IRCTC API key in .env.',
        language: 'bash',
        codeSnippet: `TELEGRAM_BOT_TOKEN=7182938491:AAHk1_example_token_here
TELEGRAM_CHAT_ID=123456789
IRCTC_API_KEY=your_api_key_here`,
        notes: 'Make sure TELEGRAM_CHAT_ID matches your user ID or channel ID where you want alerts delivered.'
      },
      {
        number: 4,
        title: 'Implement the Chart Vacant Monitoring Engine',
        description:
          'Create bot.ts to poll the vacant berth endpoint, filter target travel classes (e.g. 3A, 2A, SL), and dispatch formatted Telegram push alerts.',
        language: 'typescript',
        codeSnippet: `import TelegramBot from 'node-telegram-bot-api';
import { IrctcApi } from 'irctc-api';
import cron from 'node-cron';
import dotenv from 'dotenv';

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true });
const irctc = new IrctcApi({ apiKey: process.env.IRCTC_API_KEY! });
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

// Track alerted state to avoid spamming the user
const alertedTrains = new Set<string>();

interface WatchTarget {
  trainNo: string;
  boardingStation: string;
  desiredClass?: string; // e.g. '3A' or 'ALL'
}

const WATCHLIST: WatchTarget[] = [
  { trainNo: '12557', boardingStation: 'NKE', desiredClass: '3A' },
  { trainNo: '26501', boardingStation: 'BTH', desiredClass: 'ALL' }
];

async function checkVacancies(target: WatchTarget) {
  const watchKey = \`\${target.trainNo}:\${target.boardingStation}\`;

  try {
    const chart = await irctc.trains.getChartVacant(target.trainNo, {
      boardingStation: target.boardingStation,
      class: target.desiredClass || 'ALL'
    });

    // 1. Chart not ready yet
    if (!chart.isChartPrepared) {
      console.log(\`[⏳ Wait] Train \${target.trainNo}: Chart not prepared yet.\`);
      return;
    }

    // 2. Chart prepared and vacancies found
    if (chart.totalVacantBerths > 0 && !alertedTrains.has(watchKey)) {
      alertedTrains.add(watchKey);

      let berthBreakdown = '';
      if (chart.classSummary) {
        berthBreakdown = Object.entries(chart.classSummary)
          .map(([cls, count]) => \`  • *\${cls}:* \${count} berths\`)
          .join('\\n');
      }

      const alertMessage = \`🚨 *VACANT BERTHS ALERT (Current Booking Open)*

🚆 *Train:* \${chart.trainNumber} - \${chart.trainName}
🚉 *Boarding:* \${chart.boardingStation}
📋 *Chart Status:* Chart Prepared ✅
🎟️ *Total Vacant Berths:* *\${chart.totalVacantBerths}*

📊 *Vacancies by Class:*
\${berthBreakdown}

⚡ *Action:* Open IRCTC App immediately and book under *Current Booking* before seats sell out!\`;

      await bot.sendMessage(CHAT_ID, alertMessage, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '📲 Book on IRCTC Portal',
                url: 'https://www.irctc.co.in/nget/train-search'
              }
            ]
          ]
        }
      });

      console.log(\`✅ Sent alert for train \${target.trainNo}: \${chart.totalVacantBerths} berths available.\`);
    }
  } catch (error: any) {
    console.error(\`Error checking train \${target.trainNo}:\`, error.message);
  }
}

// Poll every 2 minutes
cron.schedule('*/2 * * * *', async () => {
  console.log('⏰ Running vacant berth poll cycle...');
  for (const target of WATCHLIST) {
    await checkVacancies(target);
  }
});

console.log('🤖 Telegram Vacant Berth Alert Bot active and scheduled!');`,
        notes: 'The alert includes an inline button linking directly to the IRCTC e-ticketing portal for instant reservation.'
      },
      {
        number: 5,
        title: 'Run with Docker or PM2',
        description:
          'Keep the script running 24/7 on a cloud server so you never miss a chart preparation announcement.',
        language: 'bash',
        codeSnippet: `npx tsc
pm2 start dist/bot.js --name "vacant-berths-bot"
pm2 save`,
        notes: 'Because Current Booking tickets open 4 hours before departure, running 24/7 on a lightweight VPS guarantees timely alerts.'
      }
    ],
    faqs: [
      {
        question: 'When is Indian Railways train chart prepared?',
        answer: 'The first reservation chart is typically prepared 4 hours before scheduled departure. If seats remain unsold, they are released for Current Booking at regular ticket prices.'
      },
      {
        question: 'Can I monitor multiple trains and stations simultaneously?',
        answer: 'Yes. Simply add more objects to the WATCHLIST array. The script iterates through each target during every 2-minute cycle.'
      },
      {
        question: 'Does this endpoint give coach and berth numbers?',
        answer: 'Yes. The API returns the exact coach name (e.g. B2, S4) and berth number (e.g. 17 Lower Berth) in the berths array.'
      }
    ],
    relatedEndpoint: {
      name: 'Vacant Berths After Charting API',
      path: '/chart-vacant-berths-api',
      ctaLabel: 'View Vacant Berths API Reference'
    }
  },

  'check-indian-railway-pnr-programmatically': {
    slug: 'check-indian-railway-pnr-programmatically',
    title: 'How to Check Indian Railway PNR Status Programmatically (Node.js & Python Guide)',
    h1: 'Check Indian Railway PNR Status Programmatically',
    subtitle: 'The definitive developer guide to querying live 10-digit PNR status, passenger manifests, berth allocations, and charting status with Node.js and Python.',
    metaDescription: 'Learn how to check Indian Railways 10-digit PNR status programmatically in Node.js and Python with complete response fields, berth allocations, and charting state.',
    targetKeywords: [
      'check pnr programmatically',
      'pnr status api python',
      'railway pnr nodejs script',
      'indian railway pnr rest api',
      'check pnr status code'
    ],
    category: 'Developer Guides',
    readingTime: '8 min read',
    difficulty: 'Beginner',
    techStack: ['Node.js', 'Python', 'TypeScript', 'REST API'],
    publishedDate: '2026-10-25',
    updatedDate: '2026-10-25',
    author: {
      name: 'IRCTC Developer Relations',
      role: 'Platform Engineering',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&fit=crop&crop=faces'
    },
    prerequisites: [
      'Basic familiarity with JavaScript/TypeScript or Python',
      'A valid 10-digit Indian Railways PNR number',
      'Free API key from https://irctc.dev/dashboard'
    ],
    architectureOverview:
      'Client application sends HTTP GET https://api.irctc.dev/api/v1/pnr/:pnr with x-api-key header ➔ Gateway queries central PRS reservation engine with zero browser overhead ➔ Returns normalized JSON passenger manifest with coach, berth, and chartStatus in under 100ms.',
    steps: [
      {
        number: 1,
        title: 'Anatomy of an Indian Railways PNR',
        description:
          'A Passenger Name Record (PNR) is a unique 10-digit number generated by the PRS reservation system upon ticket booking. The first 3 digits indicate the PRS booking zone (e.g. 2 for Northern Railway, 8 for South Eastern), and the remaining 7 digits form the unique passenger record.',
        language: 'json',
        codeSnippet: `// Example: 2265248473
// Zone prefix: 226 (Northern Railway PRS)
// Serial: 5248473 (Unique Transaction Manifest)`,
        notes: 'Indian Railways purges PNR records approximately 5-9 days after train completion.'
      },
      {
        number: 2,
        title: 'Check PNR in Node.js / TypeScript',
        description:
          'Using the irctc-api npm package, checking a PNR requires just 3 lines of code with complete TypeScript types.',
        language: 'typescript',
        codeSnippet: `import { IrctcApi } from 'irctc-api';

const client = new IrctcApi({
  apiKey: process.env.IRCTC_API_KEY || 'your_api_key_here'
});

async function verifyBooking(pnrNumber: string) {
  try {
    const pnr = await client.pnr.check(pnrNumber);

    console.log(\`Train: \${pnr.trainNumber} - \${pnr.trainName}\`);
    console.log(\`From: \${pnr.from} -> To: \${pnr.to} | Date: \${pnr.doj}\`);
    console.log(\`Chart Status: \${pnr.chartStatus}\`);

    pnr.passengers.forEach((p, idx) => {
      console.log(\`Passenger \${idx + 1}: \${p.currentStatus} | Coach: \${p.coach} | Seat: \${p.berthNumber} (\${p.berth})\`);
    });
  } catch (error: any) {
    console.error('PNR verification error:', error.message);
  }
}

verifyBooking('2265248473');`,
        notes: 'Notice the p.berth field: it returns clean, normalized berth types like "LOWER BERTH" or "MIDDLE BERTH" instead of ambiguous internal codes.'
      },
      {
        number: 3,
        title: 'Check PNR in Python',
        description:
          'In Python, you can use the standard requests library to call the gateway directly with standard JSON parsing.',
        language: 'python',
        codeSnippet: `import os
import requests

API_KEY = os.getenv("IRCTC_API_KEY", "your_api_key_here")
PNR = "2265248473"

url = f"https://api.irctc.dev/api/v1/pnr/{PNR}"
headers = {
    "x-api-key": API_KEY,
    "accept": "application/json",
    "User-Agent": "pnr-verifier/v1.0"
}

response = requests.get(url, headers=headers, timeout=5.0)

if response.status_code == 200:
    data = response.json().get("data", {})
    print(f"Train: {data.get('trainNumber')} - {data.get('trainName')}")
    print(f"Journey Date: {data.get('doj')} ({data.get('from')} -> {data.get('to')})")
    print(f"Chart: {data.get('chartStatus')}")

    for idx, p in enumerate(data.get("passengers", []), 1):
        print(f"  P{idx}: {p.get('currentStatus')} | Coach {p.get('coach', 'N.A')} / Seat {p.get('berthNumber', 'N.A')} [{p.get('berth', 'N.A')}]")
else:
    print(f"Failed with HTTP {response.status_code}: {response.text}")`,
        notes: 'Python scripts can be easily integrated into Django, FastAPI, Flask, or AWS Lambda serverless functions.'
      },
      {
        number: 4,
        title: 'Understanding Passenger Status Transitions',
        description:
          'Indian Railways passengers transition across three primary booking states: CNF (Confirmed), RAC (Reservation Against Cancellation), and WL (Waitlist).',
        language: 'json',
        codeSnippet: `{
  "bookingStatus": "WL 45",
  "currentStatus": "CNF",
  "coach": "B3",
  "berthNumber": 24,
  "berth": "LOWER BERTH"
}`,
        notes: 'When chartStatus changes to "CHART PREPARED", final coach and berth numbers are locked and cannot change.'
      },
      {
        number: 5,
        title: 'Smart Polling vs Anti-Patterns',
        description:
          'Do NOT poll PNR every 5 seconds. PNR status only changes upon cancellation or chart preparation (4 hours prior to departure). A smart backoff algorithm polls once daily until 24h before travel, then once every 30 minutes.',
        language: 'typescript',
        codeSnippet: `// Recommended Polling Schedule:
// • > 48h before departure: Poll once every 24 hours
// • 12h - 48h before departure: Poll every 4 hours
// • < 6h before departure: Poll every 15 minutes to catch Chart Preparation`,
        notes: 'Smart polling saves your API credits while ensuring passengers receive status updates the moment their ticket confirms.'
      }
    ],
    faqs: [
      {
        question: 'Does this API work for Tatkal and Premium Tatkal tickets?',
        answer: 'Yes. Any valid 10-digit Indian Railways PNR issued under General, Tatkal, Ladies, Senior Citizen, or Foreign Tourist quota is fully supported.'
      },
      {
        question: 'What happens if a PNR is flushed or expired?',
        answer: 'If the journey took place more than 5 days ago, Indian Railways purges the PNR from active PRS databases. The API returns a clean 400 Bad Request with message "FLUSHED PNR / PNR not generated".'
      },
      {
        question: 'Is PNR data cached?',
        answer: 'To ensure instant sub-100ms responses while preserving freshness, active PNRs are cached in Redis with a short TTL that safely invalidates as departure nears.'
      }
    ],
    relatedEndpoint: {
      name: 'Real-Time PNR Status API',
      path: '/pnr-status-api',
      ctaLabel: 'Explore PNR Status Endpoint'
    }
  },

  'irctc-seat-availability-tracker-python': {
    slug: 'irctc-seat-availability-tracker-python',
    title: 'How to Build an Automated 14-Day Seat Availability Tracker in Python',
    h1: 'Automated 14-Day Seat Availability Tracker in Python',
    subtitle: 'Monitor Indian Railways seat availability across classes and quotas with a recurring Python daemon and instant Telegram/Discord alerts.',
    metaDescription: 'Step-by-step tutorial on building an automated Python daemon to monitor Indian Railways 14-day seat availability and send instant Telegram alerts when tickets become available.',
    targetKeywords: [
      'irctc seat availability tracker python',
      'railway seat availability alert python',
      'indian railway seat monitor bot',
      'irctc ticket availability cron',
      'train seat alert script'
    ],
    category: 'Alerts & Automation',
    readingTime: '10 min read',
    difficulty: 'Intermediate',
    techStack: ['Python', 'REST API', 'Telegram Bot', 'Schedule'],
    publishedDate: '2026-10-25',
    updatedDate: '2026-10-25',
    author: {
      name: 'IRCTC Developer Relations',
      role: 'Platform Engineering',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&fit=crop&crop=faces'
    },
    prerequisites: [
      'Python 3.9+ with requests and schedule installed (pip install requests schedule)',
      'Free API key from https://irctc.dev/dashboard',
      'Telegram bot token and chat ID for notifications'
    ],
    architectureOverview:
      'Background Python daemon schedules periodic requests to https://api.irctc.dev/api/v1/trains/:trainNo/availability with date in DD-MM-YYYY format ➔ Parses 14-day availability array and tracks status changes in memory ➔ Fires Telegram webhook whenever status transitions from WL/RAC to AVAILABLE.',
    steps: [
      {
        number: 1,
        title: 'Install Dependencies & Setup Environment',
        description:
          'Create a virtual environment and install requests for API communication and schedule for recurring execution.',
        language: 'bash',
        codeSnippet: `mkdir irctc-tracker && cd irctc-tracker
python3 -m venv venv
source venv/bin/activate  # On Windows: .\\venv\\Scripts\\activate
pip install requests schedule

# Set environment variables
export IRCTC_API_KEY="your_api_key_here"
export TELEGRAM_BOT_TOKEN="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
export TELEGRAM_CHAT_ID="987654321"`,
        notes: 'Never hardcode production API credentials in source control. Always load from environment variables.'
      },
      {
        number: 2,
        title: 'Query 14-Day Live Availability with Date Parsing',
        description:
          'Construct an authenticated HTTP GET request to the Seat Availability endpoint. Note that the date parameter must follow the DD-MM-YYYY format.',
        language: 'python',
        codeSnippet: `import os
import requests
from datetime import datetime

API_BASE = "https://api.irctc.dev"
API_KEY = os.environ.get("IRCTC_API_KEY")

def check_availability(train_no: str, src: str, dest: str, date_str: str, cls: str = "3A", quota: str = "GN"):
    """
    Query Indian Railways PRS 14-day seat availability calendar.
    date_str must be in DD-MM-YYYY format.
    """
    url = f"{API_BASE}/api/v1/trains/{train_no}/availability"
    headers = {
        "x-api-key": API_KEY,
        "accept": "application/json"
    }
    params = {
        "from": src,
        "to": dest,
        "date": date_str,
        "class": cls,
        "quota": quota
    }

    resp = requests.get(url, headers=headers, params=params, timeout=10)
    resp.raise_for_status()
    data = resp.json()

    if not data.get("success"):
        raise ValueError(data.get("error", "Unknown API error"))

    return data.get("availability", [])`,
        notes: 'Remember the Date Format Rule: Seat Availability uses DD-MM-YYYY, whereas Route Search uses YYYY-MM-DD.'
      },
      {
        number: 3,
        title: 'State Machine & Change Detection',
        description:
          'Keep an in-memory dictionary of last known statuses to prevent duplicate alert notifications. Trigger an alert only when a seat status flips to AVAILABLE.',
        language: 'python',
        codeSnippet: `# Track previous statuses to avoid duplicate alerts
last_status_cache = {}

def evaluate_status_change(train_no: str, day_record: dict) -> bool:
    date_key = f"{train_no}_{day_record.get('date')}_{day_record.get('class')}"
    current_status = day_record.get("status", "").upper()
    previous_status = last_status_cache.get(date_key)

    # Update cache
    last_status_cache[date_key] = current_status

    # Check if seats became AVAILABLE from a previously unavailable state
    is_available = "AVAILABLE" in current_status or "CURR_AVBL" in current_status
    was_unavailable = previous_status is not None and not ("AVAILABLE" in previous_status or "CURR_AVBL" in previous_status)

    # Trigger alert if freshly available
    return is_available and was_unavailable`,
        notes: 'You can also customize the filter to alert if Waitlist drops below a threshold (e.g. WL < 5).'
      },
      {
        number: 4,
        title: 'Dispatch Telegram Alert & Run Recurring Daemon',
        description:
          'Send markdown formatted notifications via Telegram Bot API and schedule the checker to run every 10 minutes.',
        language: 'python',
        codeSnippet: `import time
import schedule

BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID")

def send_telegram_alert(message: str):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": CHAT_ID,
        "text": message,
        "parse_mode": "Markdown"
    }
    try:
        requests.post(url, json=payload, timeout=5)
    except Exception as e:
        print(f"Telegram notification error: {e}")

def job():
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Checking seat availability...")
    try:
        records = check_availability(
            train_no="12557",
            src="NKE",
            dest="ANVT",
            date_str="17-11-2026",
            cls="3A",
            quota="GN"
        )
        for record in records:
            if evaluate_status_change("12557", record):
                alert_text = (
                    f"🚨 *Train Ticket Alert!*\n\n"
                    f"🚆 *Train:* 12557 (Sapt Kranti Express)\n"
                    f"📅 *Date:* {record.get('date')}\n"
                    f"💺 *Status:* {record.get('status')}\n"
                    f"⚡ *Class:* 3A | *Quota:* GN\n\n"
                    f"👉 Book immediately on IRCTC!"
                )
                send_telegram_alert(alert_text)
                print("Alert dispatched!")
    except Exception as err:
        print(f"Error checking availability: {err}")

# Schedule job every 10 minutes
schedule.every(10).minutes.do(job)

# Run initial check immediately
job()

print("🚂 IRCTC Seat Availability Tracker running. Press Ctrl+C to stop.")
while True:
    schedule.run_pending()
    time.sleep(1)`,
        notes: 'For zero-downtime background execution on a server, run with systemd, Docker, or PM2.'
      }
    ],
    faqs: [
      {
        question: 'What date format is required for seat availability?',
        answer: 'The seat availability endpoint strictly requires dates in DD-MM-YYYY format (e.g., 17-11-2026). Passing YYYY-MM-DD will return a 400 Bad Request.'
      },
      {
        question: 'How frequently can I poll the availability endpoint?',
        answer: 'The IRCTC API gateway supports high concurrency and responses are returned in under 100ms. For automated trackers, a polling frequency of 5 to 15 minutes is recommended to monitor booking fluctuations without exhausting account rate limits.'
      },
      {
        question: 'Can I track Tatkal (TQ) and Ladies (LD) quotas?',
        answer: 'Yes. Simply change the quota parameter to TQ for Tatkal, PT for Premium Tatkal, or LD for Ladies quota. The response structure remains identical.'
      },
      {
        question: 'How many days of availability are returned in one call?',
        answer: 'The endpoint returns a 14-day continuous availability forecast starting from the queried journey date, allowing you to monitor an entire two-week travel window in a single API request.'
      }
    ],
    relatedEndpoint: {
      name: 'IRCTC Seat Availability API',
      path: '/irctc-seats-availability-api',
      ctaLabel: 'View Seat Availability Endpoint'
    }
  }
};
