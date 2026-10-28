import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Copy,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Clock,
  CreditCard,
  ChevronDown,
  Layers,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface ComparisonRow {
  metric: string;
  irctcDev: string;
  rapidApi: string;
  winner: 'irctc' | 'rapidapi' | 'tie';
  detail: string;
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    metric: 'PNR Status Latency',
    irctcDev: '430ms avg',
    rapidApi: '4,500ms - 8,200ms',
    winner: 'irctc',
    detail: '18x faster via direct socket pooling & CRIS CommonCaptcha math bitmap solver.'
  },
  {
    metric: 'Schedule & Search Latency',
    irctcDev: '< 10ms (In-Memory)',
    rapidApi: '1,500ms - 3,500ms',
    winner: 'irctc',
    detail: 'All 10,647 Indian Railways trains indexed in RAM for microsecond queries.'
  },
  {
    metric: 'Free Welcome Tier',
    irctcDev: '10,000 Free Credits',
    rapidApi: '500 requests / month',
    winner: 'irctc',
    detail: '20x more free queries. 1-click Google OAuth with zero credit card required.'
  },
  {
    metric: 'Pro Pricing Economy',
    irctcDev: '₹99 for 100,000 credits',
    rapidApi: '$35 / mo (₹2,900) for 10k',
    winner: 'irctc',
    detail: '97% cheaper. No forced recurring subscriptions. Pay-as-you-go via native UPI.'
  },
  {
    metric: 'Payment Methods',
    irctcDev: 'UPI, GPay, PhonePe, Cards',
    rapidApi: 'Mandatory International CC',
    winner: 'irctc',
    detail: 'Frictionless local Indian payments via Razorpay without foreign currency fees.'
  },
  {
    metric: 'Total Production Endpoints',
    irctcDev: '14 Flagship Endpoints',
    rapidApi: '4 - 5 Basic Endpoints',
    winner: 'irctc',
    detail: 'Includes 14-day seat forecast, post-chart vacant berths, and cancelled trains.'
  },
  {
    metric: '14-Day Seat Forecast',
    irctcDev: 'Supported (1 Call = 14 Days)',
    rapidApi: '1 Day per Request',
    winner: 'irctc',
    detail: 'Single query returns complete 2-week continuous calendar across quotas.'
  },
  {
    metric: 'Post-Chart Vacant Berths',
    irctcDev: 'Supported (Coach & Berth)',
    rapidApi: 'Not Supported',
    winner: 'irctc',
    detail: 'Direct access to online reservation charts for Current Booking allocation.'
  },
  {
    metric: 'Drop-In Code Rewrite',
    irctcDev: 'Zero Code Changes (Shim)',
    rapidApi: 'N/A',
    winner: 'irctc',
    detail: 'Supports RapidAPI headers & parameters transparently via /api/v1/rapidapi-shim.'
  }
];

const CODE_EXAMPLES = {
  curl: {
    title: 'cURL Terminal',
    diff: `curl -X GET "https://api.irctc.dev/api/v1/rapidapi-shim/liveTrainStatus?trainNo=12557&startDay=0" \\
  -H "X-RapidAPI-Key: YOUR_IRCTC_DEV_API_KEY" \\
  -H "Accept: application/json"`
  },
  node: {
    title: 'Node.js (Fetch)',
    diff: `// 1. Simply replace the hostname with api.irctc.dev/api/v1/rapidapi-shim
const response = await fetch(
  "https://api.irctc.dev/api/v1/rapidapi-shim/liveTrainStatus?trainNo=12557&startDay=0",
  {
    headers: {
      // 2. Keep your existing header! Just pass your irctc.dev key:
      "X-RapidAPI-Key": process.env.IRCTC_API_KEY
    }
  }
);
const data = await response.json();
console.log(data);`
  },
  python: {
    title: 'Python (Requests)',
    diff: `import requests

# 1. Update the endpoint URL to our drop-in compatibility shim:
url = "https://api.irctc.dev/api/v1/rapidapi-shim/liveTrainStatus"
params = {"trainNo": "12557", "startDay": "0"}

# 2. Your existing RapidAPI headers work out of the box:
headers = {
    "X-RapidAPI-Key": "YOUR_IRCTC_DEV_API_KEY"
}

response = requests.get(url, params=params, headers=headers)
print(response.json())`
  }
};

const FAQS = [
  {
    q: 'Can I switch from RapidAPI with zero code changes?',
    a: 'Yes. Our Drop-In Gateway Shim (/api/v1/rapidapi-shim/*) natively accepts RapidAPI endpoint paths (liveTrainStatus, checkPnrStatus, trainBetweenStations, getTrainSchedule), RapidAPI query parameters (trainNo, startDay, pnrNumber, fromStationCode), and even your existing X-RapidAPI-Key header. You only change the base URL domain.'
  },
  {
    q: 'Why is irctc.dev so much faster than RapidAPI (180ms vs 5,000ms)?',
    a: 'Most RapidAPI railway API sellers spin up fresh headless Chrome instances on cheap cloud servers on every user request, which causes Akamai bot blocks and massive 5-second delays. irctc.dev runs a distributed in-memory engine with 10,647 trains in RAM, native CRIS CommonCaptcha bitmap math decompression in <0.1ms, and pre-warmed socket pools.'
  },
  {
    q: 'Do I need an international credit card for irctc.dev?',
    a: 'No! RapidAPI forces developers in India to use international credit cards with recurring monthly auto-debits in USD ($35/month + GST + forex fees). On irctc.dev, you can top up 100,000 credits for ₹99 using native UPI, Google Pay, PhonePe, Paytm, or Indian debit cards with zero recurring locks.'
  },
  {
    q: 'What happens to my API key when migrating?',
    a: 'You can claim 10,000 free API credits in 5 seconds by signing in with Google OAuth at https://irctc.dev/dashboard. Simply copy your secret key (starts with re_live_) and pass it in either the X-RapidAPI-Key or x-api-key header.'
  }
];

export default function RapidApiAlternative() {
  const [activeTab, setActiveTab] = useState<'curl' | 'node' | 'python'>('curl');
  const [copiedCode, setCopiedCode] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const copySnippet = () => {
    if (!navigator.clipboard?.writeText) {
      toast.error('Clipboard access not supported in this browser');
      return;
    }
    navigator.clipboard
      .writeText(CODE_EXAMPLES[activeTab].diff)
      .then(() => {
        setCopiedCode(true);
        toast.success('Code snippet copied to clipboard');
        setTimeout(() => setCopiedCode(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy code snippet');
      });
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative">
      {/* Schema.org FAQPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
              },
            })),
          }),
        }}
      />

      {/* Atmospheric Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-radial from-brand/10 via-brand/5 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Header */}
      <div className="max-w-4xl w-full text-center mb-12 sm:mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-mono font-medium mb-6">
          <Layers size={13} />
          <span>MIGRATION GUIDE // ZERO-REWRITE DROP-IN SHIM</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-textMain mb-6 leading-[1.1]">
          The <span className="text-brand">10ms Alternative</span> to RapidAPI Indian Railway APIs
        </h1>

        <p className="text-textMuted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          Tired of 5,000ms latency spikes, frequent 504 timeouts, and $35 monthly credit card locks? Switch to <code className="text-textMain font-mono text-sm bg-white/5 px-2 py-0.5 rounded">irctc.dev</code> in 30 seconds with zero code rewrites.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand hover:bg-brand/90 text-white font-semibold text-sm transition-all shadow-lg shadow-brand/25"
          >
            Claim 10,000 Free Credits <ArrowRight size={15} />
          </Link>
          <Link
            to="/playground"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-textMain border border-borderRoot font-medium text-sm transition-colors"
          >
            Test Live Sandbox
          </Link>
        </div>
      </div>

      {/* Side-by-Side Live Benchmark Table */}
      <div className="max-w-5xl w-full mb-16 sm:mb-24 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-textMain tracking-tight">
              Head-to-Head Architecture Matrix
            </h2>
            <p className="text-xs text-textMuted">Measured empirically under live Indian Railways PRS network conditions</p>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-mono text-brand bg-brand/10 border border-brand/20 px-2.5 py-1 rounded-md">
            97% COST REDUCTION
          </span>
        </div>

        <div className="bg-[#0a0a0a]/95 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.6)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-textMuted font-mono text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6">CAPABILITY / SPEC</th>
                  <th className="py-3.5 px-4 sm:px-6 text-brand font-semibold">irctc.dev (Rail Engine)</th>
                  <th className="py-3.5 px-4 sm:px-6">RapidAPI Indian Railway</th>
                  <th className="py-3.5 px-4 sm:px-6">ARCHITECTURAL ADVANTAGE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {COMPARISON_DATA.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-medium text-textMain">
                      {row.metric}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-mono font-semibold text-emerald-400 flex items-center gap-1.5">
                      <Check size={14} className="text-emerald-400 shrink-0" />
                      <span>{row.irctcDev}</span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-textMuted/80 line-through">
                      <span className="inline-flex items-center gap-1">
                        <X size={12} className="text-red-400 shrink-0" />
                        {row.rapidApi}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-textMuted leading-relaxed">
                      {row.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Interactive Drop-In Code Switcher */}
      <div className="max-w-4xl w-full mb-16 sm:mb-24 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-textMain tracking-tight mb-2">
            The 30-Second Drop-In Shim
          </h2>
          <p className="text-sm text-textMuted max-w-xl mx-auto">
            Zero changes to your data models or response handlers. Point your existing RapidAPI client to our drop-in compatibility route:
          </p>
        </div>

        <div className="bg-[#0c0c0e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {/* Top Bar Switcher */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-1.5">
              {(['curl', 'node', 'python'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                    activeTab === tab
                      ? 'bg-brand text-white'
                      : 'text-textMuted hover:text-textMain hover:bg-white/5'
                  }`}
                >
                  {CODE_EXAMPLES[tab].title}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={copySnippet}
              className="flex items-center gap-1.5 text-xs text-textMuted hover:text-white px-2.5 py-1 rounded border border-white/10 hover:bg-white/5 transition-all cursor-pointer"
            >
              {copiedCode ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Code Viewer Body */}
          <div className="p-4 sm:p-6 overflow-x-auto font-mono text-xs text-slate-300 leading-relaxed bg-black/40">
            <pre>
              <code>{CODE_EXAMPLES[activeTab].diff}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* 3 Core Moats Bento */}
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-5 mb-16 sm:mb-24 relative z-10">
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-brand/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-4">
            <Cpu size={20} />
          </div>
          <h3 className="text-base font-bold text-textMain mb-2">10,647 Routes in RAM</h3>
          <p className="text-xs text-textMuted leading-relaxed">
            Instead of launching sluggish Chromium browsers to scrape station pairs, our engine compiles all Indian Railways routes in RAM for instant 7ms calculations.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-brand/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
            <Clock size={20} />
          </div>
          <h3 className="text-base font-bold text-textMain mb-2">CRIS Math Captcha Solver</h3>
          <p className="text-xs text-textMuted leading-relaxed">
            Our deterministic Node.js bitmap OCR solver decompresses CRIS math challenges in &lt;0.1ms with 99.9% accuracy, bypassing fragile scraper breakdowns.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-brand/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
            <CreditCard size={20} />
          </div>
          <h3 className="text-base font-bold text-textMain mb-2">₹99 Native UPI Top-Ups</h3>
          <p className="text-xs text-textMuted leading-relaxed">
            No recurring $35/month lock-ins. Top up 100k API credits for ₹99 via UPI, GPay, or PhonePe. Credits never expire and only deduct on successful 200 OK responses.
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-3xl w-full mb-16 sm:mb-24 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-textMain tracking-tight text-center mb-8">
          Migration & Compatibility FAQs
        </h2>

        <div className="bg-[#0a0a0a]/90 border border-white/10 rounded-2xl divide-y divide-white/[0.06] overflow-hidden">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="transition-colors">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left py-4 px-5 sm:px-6 flex items-center justify-between gap-4 font-semibold text-sm text-textMain hover:text-white transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-textMuted transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-4 pt-1 text-xs text-textMuted leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Conversion Banner */}
      <div className="max-w-4xl w-full text-center bg-gradient-to-b from-brand/10 to-transparent border border-brand/20 rounded-3xl p-8 sm:p-12 relative z-10">
        <ShieldCheck size={40} className="text-brand mx-auto mb-4" />
        <h2 className="text-2xl sm:text-3xl font-bold text-textMain mb-3 tracking-tight">
          Ready to experience sub-100ms Indian Railways APIs?
        </h2>
        <p className="text-xs sm:text-sm text-textMuted max-w-md mx-auto mb-6 leading-relaxed">
          Claim 10,000 free API credits in 5 seconds. Connect via our RapidAPI Drop-In Shim today with zero code rewrites.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand hover:bg-brand/90 text-white font-semibold text-sm transition-all shadow-lg shadow-brand/20"
        >
          Claim 10,000 Free Credits on Signup <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
