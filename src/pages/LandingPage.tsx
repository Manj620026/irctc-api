import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Activity,
  Database,
  Search,
  Route,
  ShieldCheck,
  Terminal,
  Mail,
  MapPin,
  Copy,
  Check,
  ChevronDown,
  HelpCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FIREHOSE_LOGS = [
  { method: "GET", path: "/api/v1/live/12309", status: 200, time: "0.4ms" },
  { method: "GET", path: "/api/v1/trains/12558/fare?from=ANVT&to=MFP", status: 200, time: "0.7ms" },
  { method: "GET", path: "/api/v1/trains/search?from=NDLS&to=PNBE", status: 200, time: "1.2ms" },
  { method: "GET", path: "/api/v1/live/station/NDLS?hours=2", status: 200, time: "1.1ms" },
  { method: "GET", path: "/api/v1/trains/cancelled", status: 200, time: "0.0ms" },
  { method: "GET", path: "/api/v1/trains/stations?q=patna", status: 200, time: "0.1ms" },
  { method: "GET", path: "/api/v1/trains/12557/availability?from=NKE&to=ANVT", status: 200, time: "1.4s" },
  { method: "GET", path: "/api/v1/pnr/2434567890", status: 200, time: "0.8ms" },
  { method: "GET", path: "/api/v1/trains/26501/chart-vacant?boardingStation=BTH", status: 200, time: "0.8s" },
  { method: "GET", path: "/api/v1/trains/12309", status: 200, time: "0.3ms" },
  { method: "GET", path: "/health", status: 200, time: "0.1ms" },
  { method: "GET", path: "/api/v1/trains/stations/NDLS", status: 200, time: "0.2ms" },
];

type LogEntry = typeof FIREHOSE_LOGS[0] & { id: number };

function FirehoseTerminal() {
  const [logs, setLogs] = useState<LogEntry[]>(() =>
    FIREHOSE_LOGS.slice(0, 5).map((log, id) => ({ ...log, id }))
  );

  useEffect(() => {
    let i = 5;
    let idCounter = 5;

    const interval = setInterval(() => {
      setLogs(prev => {
        const newLog = { ...FIREHOSE_LOGS[i % FIREHOSE_LOGS.length], id: idCounter++ };
        i++;
        return [...prev, newLog].slice(-5);
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-lg lg:ml-auto">
      {/* Specular Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#ff4d00]/10 blur-[90px] rounded-full pointer-events-none" />

      <div className="relative bg-[#070709]/90 backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-[0_24px_70px_-15px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)] overflow-hidden ring-1 ring-black/60">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]" />
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-textMuted uppercase tracking-wider font-semibold">
            <Activity size={12} className="text-[#ff4d00] animate-pulse" />
            <span>Telemetry Firehose</span>
          </div>
        </div>

        {/* Terminal Body with balanced padding & tabular digits */}
        <div className="p-4 sm:p-5 font-mono text-xs flex flex-col gap-2.5 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            {logs.map((log, index) => (
              <motion.div
                layout
                key={log.id}
                initial={{ opacity: 0, x: -8, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.18 } }}
                transition={{ type: "spring", stiffness: 340, damping: 28 }}
                className={`flex items-center justify-between gap-2.5 ${index === logs.length - 1 ? 'text-textMain' : 'text-textMuted/65'} w-full`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-sky-400 font-bold shrink-0 text-[11px] px-1 py-0.2 rounded bg-sky-400/10 border border-sky-400/20">
                    {log.method}
                  </span>
                  <span className="truncate text-textMain/90 text-xs">{log.path}</span>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 text-xs">
                  <span className="text-emerald-400 font-semibold px-1.5 py-0.5 rounded bg-emerald-400/10 border border-emerald-400/20 text-[10px]">
                    {log.status}
                  </span>
                  <span className="w-12 text-right text-textMuted font-mono tabular-nums">
                    {log.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const FAQS = [
  {
    q: "Is there a free tier for developers?",
    a: "Yes. Every developer receives 10,000 free API credits upon signing in with Google OAuth — no credit card required. You can test live PNR verification, 14-day seat availability, route search, and station boards immediately. Pro top-up packs are available at ₹99 for 100,000 requests."
  },
  {
    q: "How do I check live PNR status using the API?",
    a: "Send an authenticated GET request to https://api.irctc.dev/api/v1/pnr/:pnr with your API key, or use client.pnr.check(pnrNumber) with the irctc-api npm package. The response includes passenger confirmation status, coach, seat, normalized berth allocation, and charting status."
  },
  {
    q: "How does the 14-day train seat availability forecast work?",
    a: "The Seat Availability endpoint queries the central railway PRS reservation engine directly. It delivers a multi-class, multi-day availability forecast calendar with confirmed confirmation codes (Available, Waitlist, RAC) and zero browser RAM overhead."
  },
  {
    q: "Can I check vacant seats after chart preparation?",
    a: "Yes. The Vacant Seats After Chart Preparation endpoint (/api/v1/trains/:trainNo/chart-vacant) checks real-time vacant berths across coaches for Current Booking and TTE allocation once the reservation chart is prepared."
  },
  {
    q: "What programming languages and SDKs are supported?",
    a: "We provide the zero-dependency irctc-api npm package with 100% TypeScript definitions for Node.js, alongside runnable code snippets for Python (requests/httpx) and standard cURL."
  }
];

export default function LandingPage() {
  const [heroCopied, setHeroCopied] = useState(false);
  const [snippetTab, setSnippetTab] = useState<'sdk' | 'fetch'>('sdk');
  const [snippetCopied, setSnippetCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const copyHeroInstall = () => {
    navigator.clipboard?.writeText('npm i irctc-api').then(() => {
      setHeroCopied(true);
      setTimeout(() => setHeroCopied(false), 2000);
    }).catch(() => {});
  };

  const copyCode = (text: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setSnippetCopied(true);
      setTimeout(() => setSnippetCopied(false), 2000);
    }).catch(() => {});
  };

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <div className="w-full flex-1 scroll-smooth overflow-x-clip selection:bg-[#ff4d00]/30 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            '@id': 'https://irctc.dev/#faq',
            'mainEntity': FAQS.map(faq => ({
              '@type': 'Question',
              'name': faq.q,
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': faq.a
              }
            }))
          })
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-2 sm:pt-4 lg:pt-6 pb-6 flex flex-col gap-12 sm:gap-16 lg:gap-20"
      >

        {/* --- 1. HERO SECTION (Refined Copy, Unified CTA, Aligned Terminal) --- */}
        <motion.section variants={item} style={{ willChange: "transform, opacity" }} className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-8 items-center">

          <div className="flex flex-col items-start max-w-2xl">
            {/* Pill Header Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#ff4d00]/25 rounded-full mb-4 sm:mb-5 text-xs font-mono text-[#ff4d00] bg-[#ff4d00]/5 shadow-[0_0_15px_rgba(255,77,0,0.1),inset_0_1px_0_rgba(255,255,255,0.05)]">
              <span className="w-1.5 h-1.5 bg-[#ff4d00] rounded-full animate-pulse shadow-[0_0_6px_rgba(255,77,0,0.9)]" />
              <span>LIVE RAILWAY TELEMETRY // REST API</span>
            </div>

            {/* High-Impact Headline */}
            <h1 className="text-[2.4rem] min-[400px]:text-4xl sm:text-6xl lg:text-8xl font-medium tracking-[-0.04em] leading-[1.02] sm:leading-[0.95] mb-4 sm:mb-5 text-textMain">
              Railway Data.<br />
              <span className="text-textMuted">Zero Bullshit.</span>
            </h1>

            {/* Streamlined Value Proposition (No duplicate install copy) */}
            <p className="text-base sm:text-lg text-textMuted max-w-xl mb-6 sm:mb-8 leading-relaxed">
              High-throughput railway data infrastructure. Instant access to real-time train tracking, PNR verification, and railway graph routing through a single unified API key.
            </p>

            {/* Primary Action Row with tactile depth */}
            <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-3 sm:gap-3.5">
              <Link
                to="/playground"
                className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-b from-[#ff550a] to-[#d64000] text-white px-7 sm:px-8 h-[50px] rounded-xl hover:brightness-110 active:scale-[0.98] transition-all duration-200 font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_20px_rgba(255,77,0,0.25)] text-sm sm:text-base shrink-0"
              >
                <span>Open API Playground</span>
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                type="button"
                onClick={copyHeroInstall}
                aria-label="Copy npm install command"
                className="group relative inline-flex items-center justify-between sm:justify-center gap-3 bg-[#0d0d10]/80 hover:bg-white/[0.06] border border-white/10 hover:border-white/20 px-5 sm:px-6 h-[50px] rounded-xl active:scale-[0.98] transition-all duration-200 font-mono text-xs sm:text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] select-none shrink-0 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 font-normal select-none">$</span>
                  <span className="text-textMain/95 font-medium tracking-tight">npm i irctc-api</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400 group-hover:text-textMain transition-colors">
                  {heroCopied ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span className="text-[11px] font-sans font-medium text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <Copy size={14} className="group-hover:scale-110 transition-transform text-zinc-400 group-hover:text-white" />
                  )}
                </div>
              </button>
            </div>

            {/* Sub-bar with clean visual separation */}
            <div className="mt-4 w-full sm:w-auto flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-textMuted/75">
              <a href="#ecosystem" className="hover:text-textMain transition-colors flex items-center gap-1 py-1">
                Explore 14 API Endpoints ↓
              </a>
              <span className="text-zinc-700 select-none">•</span>
              <a
                href="https://www.npmjs.com/package/irctc-api"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#ff4d00] transition-colors font-mono text-[11px] text-textMuted/75 hover:underline py-1"
              >
                v4.1.0 on npm ↗
              </a>
            </div>
          </div>

          {/* Right Column: Firehose Terminal */}
          <div className="w-full flex justify-center lg:justify-end">
            <FirehoseTerminal />
          </div>
        </motion.section>


        {/* --- 2. ARCHITECTURE BENTO GRID (Symmetrical 3-Tier Hierarchy & Tabular Digits) --- */}
        <motion.section variants={item} style={{ willChange: "transform, opacity" }} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              icon: Activity,
              metric: "0.4ms",
              label: "Sub-Ms Latency",
              desc: "In-memory caching of 10,000+ trains delivers sub-millisecond P99 response times."
            },
            {
              icon: Search,
              metric: "8,500+",
              label: "Indexed Stations",
              desc: "Typo-tolerant prefix-tree station autocomplete engineered for high-frequency input."
            },
            {
              icon: Database,
              metric: "100%",
              label: "In-Memory Graph",
              desc: "Pathfinding graph engine runs decoupled from live networks for guaranteed uptime."
            },
            {
              icon: ShieldCheck,
              metric: "99.9%",
              label: "Production SLA",
              desc: "Enterprise rate-limiting, stateless JWT sessions, and multi-zone PRS failover protection."
            }
          ].map((card, i) => (
            <div
              key={i}
              className="group relative bg-[#0a0a0d]/80 border border-white/[0.08] hover:border-[#ff4d00]/40 p-4 sm:p-6 lg:p-7 rounded-2xl flex flex-col justify-between transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:bg-white/[0.02]"
            >
              {/* Top: Icon Grounding Badge */}
              <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#ff4d00] mb-5 group-hover:scale-105 group-hover:border-[#ff4d00]/30 transition-all">
                <card.icon size={18} strokeWidth={1.8} />
              </div>

              {/* Middle: Tabular Metric & Monospaced Label */}
              <div>
                <div className="text-2xl sm:text-3xl font-medium font-mono tabular-nums mb-1 text-textMain group-hover:text-[#ff4d00] transition-colors tracking-tight">
                  {card.metric}
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider text-textMuted/90 mb-2">
                  {card.label}
                </div>
                {/* Bottom: Crisp 2-line Description */}
                <p className="text-xs sm:text-sm text-textMuted leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </motion.section>


        {/* --- 3. API ECOSYSTEM (Balanced Symmetrical 2-Column 7:7 Grid - All 14 Endpoints) --- */}
        <motion.section variants={item} id="ecosystem" className="flex flex-col gap-6 sm:gap-10 scroll-mt-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[#ff4d00] font-mono text-[10px] uppercase tracking-widest font-semibold mb-2">
              <Sparkles size={12} />
              Engine Specification // 14 Production Endpoints
            </div>
            <h2 className="text-2xl sm:text-4xl font-medium mb-2.5 tracking-tight text-textMain">The API Ecosystem</h2>
            <p className="text-sm sm:text-base text-textMuted">A comprehensive suite of 14 REST endpoints covering live telemetry, routing, fares, and station intelligence.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {/* Column 1: Passenger & Rail Engine (7 Endpoints) */}
            <div className="flex flex-col bg-[#0a0a0d]/60 border border-white/[0.08] p-5 sm:p-7 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5 mb-4">
                <div className="flex items-center gap-2.5 text-textMain font-medium text-base">
                  <MapPin className="text-[#ff4d00]" size={18} />
                  <span>Passenger &amp; Rail Engine</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">7 Endpoints</span>
              </div>
              <div className="flex flex-col gap-3 flex-1 justify-between">
                <Link to="/live-train-status-api" className="group block p-2.5 -mx-2.5 rounded-xl hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/10">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">GET /api/v1/live/:trainNo</span>
                    <span className="text-[10px] font-mono text-[#ff4d00] opacity-0 group-hover:opacity-100 transition-opacity">View API →</span>
                  </div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">Real-time satellite GPS tracking, platform assignment, and live running delay.</p>
                </Link>

                <Link to="/playground?endpoint=liveStation" className="group block p-2.5 -mx-2.5 rounded-xl hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/10">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">GET /api/v1/live/station/:code</span>
                    <span className="text-[10px] font-mono text-[#ff4d00] opacity-0 group-hover:opacity-100 transition-opacity">Test API →</span>
                  </div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">Station arrival &amp; departure board with scheduled vs expected platforms.</p>
                </Link>

                <Link to="/pnr-status-api" className="group block p-2.5 -mx-2.5 rounded-xl hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/10">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">GET /api/v1/pnr/:pnr</span>
                    <span className="text-[10px] font-mono text-[#ff4d00] opacity-0 group-hover:opacity-100 transition-opacity">View API →</span>
                  </div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">Passenger manifests, berth types, charting status, and waitlist movements.</p>
                </Link>

                <Link to="/irctc-seats-availability-api" className="group block p-2.5 -mx-2.5 rounded-xl hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/10">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">GET /api/v1/trains/:trainNo/availability</span>
                    <span className="text-[10px] font-mono text-[#ff4d00] opacity-0 group-hover:opacity-100 transition-opacity">View API →</span>
                  </div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">14-day multi-class seat confirmation forecast direct from the PRS reservation engine.</p>
                </Link>

                <Link to="/chart-vacant-berths-api" className="group block p-2.5 -mx-2.5 rounded-xl hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/10">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">GET /api/v1/trains/:trainNo/chart-vacant</span>
                    <span className="text-[10px] font-mono text-[#ff4d00] opacity-0 group-hover:opacity-100 transition-opacity">View API →</span>
                  </div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">Vacant berths after chart preparation for Current Booking &amp; TTE allocation.</p>
                </Link>

                <Link to="/train-fare-api" className="group block p-2.5 -mx-2.5 rounded-xl hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/10">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">GET /api/v1/trains/:trainNo/fare</span>
                    <span className="text-[10px] font-mono text-[#ff4d00] opacity-0 group-hover:opacity-100 transition-opacity">View API →</span>
                  </div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">Real-time ticket fare breakup across 1A, 2A, 3A, SL, and Tatkal quotas.</p>
                </Link>

                <Link to="/playground?endpoint=cancelledTrains" className="group block p-2.5 -mx-2.5 rounded-xl hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/10">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">GET /api/v1/trains/cancelled</span>
                    <span className="text-[10px] font-mono text-[#ff4d00] opacity-0 group-hover:opacity-100 transition-opacity">Test API →</span>
                  </div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">Daily list of fully and partially cancelled trains updated with 0ms cache.</p>
                </Link>
              </div>
            </div>

            {/* Column 2: Timetable & Station Intelligence (7 Endpoints) */}
            <div className="flex flex-col bg-[#0a0a0d]/60 border border-white/[0.08] p-5 sm:p-7 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5 mb-4">
                <div className="flex items-center gap-2.5 text-textMain font-medium text-base">
                  <Route className="text-[#ff4d00]" size={18} />
                  <span>Timetable &amp; Station Intelligence</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">7 Endpoints</span>
              </div>
              <div className="flex flex-col gap-3 flex-1 justify-between">
                <Link to="/trains-between-stations-api" className="group block p-2.5 -mx-2.5 rounded-xl hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/10">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">GET /api/v1/trains/search</span>
                    <span className="text-[10px] font-mono text-[#ff4d00] opacity-0 group-hover:opacity-100 transition-opacity">View API →</span>
                  </div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">Direct train search between any two stations with running days filter.</p>
                </Link>

                <Link to="/playground?endpoint=trainSearchByName" className="group block p-2.5 -mx-2.5 rounded-xl hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/10">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">GET /api/v1/trains/search/name</span>
                    <span className="text-[10px] font-mono text-[#ff4d00] opacity-0 group-hover:opacity-100 transition-opacity">Test API →</span>
                  </div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">Fuzzy search trains by partial or full name with instant suggestions.</p>
                </Link>

                <Link to="/train-schedule-api" className="group block p-2.5 -mx-2.5 rounded-xl hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/10">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">GET /api/v1/trains/:trainNo</span>
                    <span className="text-[10px] font-mono text-[#ff4d00] opacity-0 group-hover:opacity-100 transition-opacity">View API →</span>
                  </div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">Full A-to-Z running timetable, halt durations, distance offsets, and day counters.</p>
                </Link>

                <Link to="/playground?endpoint=stationAutocomplete" className="group block p-2.5 -mx-2.5 rounded-xl hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/10">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">GET /api/v1/trains/stations</span>
                    <span className="text-[10px] font-mono text-[#ff4d00] opacity-0 group-hover:opacity-100 transition-opacity">Test API →</span>
                  </div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">High-speed prefix-tree autocomplete for 8,500+ Indian Railway stations.</p>
                </Link>

                <Link to="/playground?endpoint=stationTimetable" className="group block p-2.5 -mx-2.5 rounded-xl hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/10">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">GET /api/v1/trains/stations/:code/timetable/:date</span>
                    <span className="text-[10px] font-mono text-[#ff4d00] opacity-0 group-hover:opacity-100 transition-opacity">Test API →</span>
                  </div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">Complete daily arrival and departure schedule for any railway station.</p>
                </Link>

                <Link to="/playground?endpoint=stationByCode" className="group block p-2.5 -mx-2.5 rounded-xl hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/10">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">GET /api/v1/trains/stations/:code</span>
                    <span className="text-[10px] font-mono text-[#ff4d00] opacity-0 group-hover:opacity-100 transition-opacity">Test API →</span>
                  </div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">Master station intelligence: platform counts, division, and zone metadata.</p>
                </Link>

                <Link to="/playground?endpoint=health" className="group block p-2.5 -mx-2.5 rounded-xl hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/10">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">GET /health</span>
                    <span className="text-[10px] font-mono text-[#ff4d00] opacity-0 group-hover:opacity-100 transition-opacity">Test API →</span>
                  </div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">High-frequency health probe for gateway status, uptime SLA, and PRS latencies.</p>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* --- 4. DEVELOPER EXPERIENCE (Tactile Pills & Semantic Syntax Highlighting) --- */}
        <motion.section variants={item} className="grid grid-cols-1 lg:grid-cols-2 items-center bg-[#09090c] border border-white/[0.09] rounded-3xl overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <div className="p-6 sm:p-10 lg:p-14 flex flex-col">
            <div className="inline-flex items-center gap-2 text-[#ff4d00] font-mono text-[10px] uppercase tracking-widest font-semibold mb-2">
              <Terminal size={12} />
              Zero-Dependency NPM Client
            </div>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight mb-3 text-textMain">Designed for Developers.</h2>
            <p className="text-textMuted text-sm sm:text-base leading-relaxed mb-7 max-w-md">
              Zero dependencies, native <code className="text-white/90 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-xs font-mono">fetch</code>, and 100% typed. Integrate live Indian Railways tracking and routing into your stack in minutes.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/playground"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ff4d00]/10 hover:bg-[#ff4d00]/20 border border-[#ff4d00]/30 hover:border-[#ff4d00]/50 text-[#ff4d00] font-medium text-xs sm:text-sm transition-all"
              >
                <span>Try Live Playground</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-textMuted hover:text-textMain font-medium text-xs sm:text-sm transition-all"
              >
                <span>SDK Documentation →</span>
              </Link>
            </div>
          </div>

          <div className="bg-[#050507] h-full p-4 sm:p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-white/[0.08] flex items-center justify-center relative overflow-hidden">
            {/* Ambient specular highlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-[#ff4d00]/10 blur-[90px] rounded-full pointer-events-none" />

            <div className="relative w-full max-w-md bg-[#0a0a0d] border border-white/[0.12] rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/70">
              {/* Window Chrome */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#111115] border-b border-white/[0.08] backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>

                {/* Editor File Tabs */}
                <div className="flex items-center bg-black/60 rounded-lg p-0.5 border border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setSnippetTab('sdk')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                      snippetTab === 'sdk'
                        ? 'bg-white/10 text-white font-medium shadow-sm'
                        : 'text-textMuted hover:text-white'
                    }`}
                  >
                    <span className="text-[#79c0ff] font-bold text-[9px]">TS</span>
                    client.ts
                  </button>
                  <button
                    type="button"
                    onClick={() => setSnippetTab('fetch')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                      snippetTab === 'fetch'
                        ? 'bg-white/10 text-white font-medium shadow-sm'
                        : 'text-textMuted hover:text-white'
                    }`}
                  >
                    <span className="text-[#ffbd2e] font-bold text-[9px]">JS</span>
                    fetch.js
                  </button>
                </div>

                {/* Copy snippet button */}
                <button
                  type="button"
                  onClick={() =>
                    copyCode(
                      snippetTab === 'sdk'
                        ? `import { IrctcApi } from 'irctc-api';\n\nconst irctc = new IrctcApi({\n  apiKey: 're_live_••••••••••••'\n});\n\nconst live = await irctc.live.getStatus('12301');\nconsole.log(live.currentLocation, live.delayMinutes);`
                        : `const response = await fetch("https://api.irctc.dev/api/v1/live/12301", {\n  headers: {\n    "x-api-key": "re_live_••••••••••••"\n  }\n});\n\nconst data = await response.json();`
                    )
                  }
                  className="flex items-center gap-1 text-[11px] font-mono text-textMuted hover:text-textMain transition-colors px-2 py-1 rounded hover:bg-white/5 cursor-pointer"
                  title="Copy code snippet"
                >
                  {snippetCopied ? (
                    <>
                      <Check size={11} className="text-emerald-400" />
                      <span className="text-emerald-400 text-[10px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={11} />
                      <span className="text-[10px] hidden min-[400px]:inline">Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Semantic Code Syntax Highlighting */}
              {snippetTab === 'sdk' ? (
                <div className="p-4 sm:p-5 font-mono text-[11px] sm:text-[13px] leading-relaxed overflow-x-auto text-gray-300">
                  <span className="text-[#ff7b72]">import</span> {'{'} <span className="text-[#79c0ff]">IrctcApi</span> {'}'} <span className="text-[#ff7b72]">from</span> <span className="text-[#a5d6ff]">'irctc-api'</span>;<br/>
                  <br/>
                  <span className="text-[#ff7b72]">const</span> irctc = <span className="text-[#ff7b72]">new</span> <span className="text-[#79c0ff]">IrctcApi</span>({'{'} <br/>
                  &nbsp;&nbsp;apiKey: <span className="text-[#a5d6ff]">'re_live_••••••••••••'</span> <br/>
                  {'}'});<br/>
                  <br/>
                  <span className="text-[#8b949e] italic">// Real-time running status &amp; GPS</span><br/>
                  <span className="text-[#ff7b72]">const</span> live = <span className="text-[#ff7b72]">await</span> irctc.live.<span className="text-[#d2a8ff]">getStatus</span>(<span className="text-[#a5d6ff]">'12301'</span>);<br/>
                  <span className="text-[#8b949e] italic">// =&gt; {'{'} trainNumber: '12301', currentLocation: 'Howrah Jn' {'}'}</span>
                </div>
              ) : (
                <div className="p-4 sm:p-5 font-mono text-[11px] sm:text-[13px] leading-relaxed overflow-x-auto text-gray-300">
                  <span className="text-[#ff7b72]">const</span> response = <span className="text-[#ff7b72]">await</span> fetch(<span className="text-[#a5d6ff]">"https://api.irctc.dev/api/v1/live/12301"</span>, {'{'} <br/>
                  &nbsp;&nbsp;headers: {'{'} <br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#a5d6ff]">"x-api-key"</span>: <span className="text-[#a5d6ff]">"re_live_••••••••••••"</span> <br/>
                  &nbsp;&nbsp;{'}'} <br/>
                  {'}'}); <br/>
                  <br/>
                  <span className="text-[#ff7b72]">const</span> data = <span className="text-[#ff7b72]">await</span> response.json();<br/>
                  <span className="text-[#8b949e] italic">// =&gt; {'{'} success: true, data: {'{'} currentStatus: 'Running' {'}'} {'}'}</span>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* --- 5. FAQ ACCORDION (Enforced 65-75 char reading measure: max-w-3xl) --- */}
        <motion.section variants={item} className="flex flex-col gap-6 sm:gap-8 max-w-3xl mx-auto w-full">
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <div className="inline-flex items-center justify-center sm:justify-start gap-2 text-[#ff4d00] font-mono text-[10px] uppercase tracking-widest font-semibold">
              <HelpCircle size={12} className="text-[#ff4d00]" />
              Frequently Asked Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-textMain">Everything you need to know.</h2>
            <p className="text-sm text-textMuted">Common architectural, data source, and developer integration questions answered.</p>
          </div>

          <div className="flex flex-col gap-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                    isOpen
                      ? 'bg-[#0f0f13]/90 border-white/[0.16] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
                      : 'bg-[#0a0a0d]/40 border-white/[0.08] hover:border-white/[0.14]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 text-left cursor-pointer focus:outline-none"
                  >
                    <span className="text-sm sm:text-base font-medium text-textMain leading-snug">{faq.q}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="shrink-0 text-textMuted"
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as const }}
                      >
                        <div className="px-5 sm:px-6 pb-5 pt-1 text-sm text-textMuted leading-relaxed border-t border-white/[0.04]">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* --- 6. CREATOR & MAINTAINER SECTION (Centered Badges & Refined Highlights) --- */}
        <motion.div variants={item} className="flex flex-col">
          <section className="bg-[#0a0a0d]/60 border border-white/[0.09] rounded-3xl p-6 sm:p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:bg-[#0c0c10]/80 transition-colors">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-[#ff4d00] font-mono text-[10px] mb-2 sm:mb-3 uppercase tracking-widest font-semibold">
                <Clock size={12} strokeWidth={2.5} />
                Creator &amp; Maintainer
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-textMain mb-2 sm:mb-3">Engineered by Manjot Singh</h2>
              <p className="text-textMuted text-xs sm:text-sm leading-relaxed max-w-xl mx-auto md:mx-0">
                Built to solve the latency and reliability issues of traditional railway data APIs. Designed from the ground up for extreme speed, offline routing capabilities, and a flawless developer experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <a
                href="https://github.com/Manj620026"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2.5 bg-[#101014] hover:bg-[#18181e] active:scale-[0.98] border border-white/10 hover:border-white/20 px-5 py-3 rounded-xl transition-all w-full md:w-auto shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-textMuted"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5 0-1.4-.5-2.5-1.5-3.3.1-.3.5-1.5-.1-3.2 0 0-1.2-.4-3.9 1.4a12.3 12.3 0 0 0-7 0C3.9 1.5 2.7 1.9 2.7 1.9a9 9 0 0 0-.1 3.2C1.5 6 1 7.1 1 8.5c0 5 3 6.2 6 6.5-.4.4-.7 1-.8 1.9-.1.1-.3.1-.4.1-.7 0-1.3-.3-1.6-.8-.5-.8-1.2-1.2-1.8-1.1-.5 0-.2.5.1.7.3.2.7.7 1 1.4.3.8 1.2 1 1.9 1 .1 0 .2 0 .4-.1v2.3" /></svg>
                <span className="font-medium text-xs sm:text-sm text-textMain">@Manj620026</span>
              </a>
              <a
                href="mailto:support@irctc.dev"
                className="flex items-center justify-center gap-2.5 bg-[#101014] hover:bg-[#18181e] active:scale-[0.98] border border-white/10 hover:border-white/20 px-5 py-3 rounded-xl transition-all w-full md:w-auto shadow-sm"
              >
                <Mail size={16} className="text-textMuted" />
                <span className="font-medium text-xs sm:text-sm text-textMain">support@irctc.dev</span>
              </a>
            </div>
          </section>
        </motion.div>

      </motion.div>
    </div>
  );
}
