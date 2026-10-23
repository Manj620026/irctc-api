import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Activity, Database, Search, Route, TrainFront, ShieldCheck, Terminal, Mail, MapPin, Copy, Check } from 'lucide-react';
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
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    let i = 0;
    let idCounter = 0;
    // Initial burst
    const initialLogs = FIREHOSE_LOGS.slice(0, 3).map(log => ({ ...log, id: idCounter++ }));
    setLogs(initialLogs);
    i = 3;

    const interval = setInterval(() => {
      setLogs(prev => {
        const newLog = { ...FIREHOSE_LOGS[i % FIREHOSE_LOGS.length], id: idCounter++ };
        i++;
        return [...prev, newLog].slice(-6); // Keep max 6 lines
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-lg lg:ml-auto">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand/10 blur-[80px] rounded-full pointer-events-none" />
      
      <motion.div 
        className="relative bg-[#050505]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/5"
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-mono text-textMuted uppercase tracking-widest font-semibold">
            <Activity size={12} className="text-brand animate-pulse" />
            Live Network Firehose
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-3.5 sm:p-5 font-mono text-xs flex flex-col justify-end gap-2 sm:gap-2.5 min-h-[200px] sm:min-h-[240px]">
          <AnimatePresence mode="popLayout" initial={false}>
            {logs.map((log, index) => (
              <motion.div 
                layout
                key={log.id}
                initial={{ opacity: 0, x: -10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`flex items-center justify-between gap-2 ${index === logs.length - 1 ? 'text-textMain' : 'text-textMuted/60'} w-full`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-blue-400 font-bold shrink-0 text-[10px] sm:text-xs">{log.method}</span>
                  <span className="truncate text-textMain/90 text-[10px] sm:text-xs">{log.path}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-[10px] sm:text-xs">
                  <span className="text-emerald-400 font-semibold">{log.status}</span>
                  <span className="w-11 sm:w-12 text-right text-textMuted">{log.time}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <motion.div layout className="flex items-center gap-2 text-textMuted/40 mt-0.5 text-[10px] sm:text-xs">
            <span className="text-brand animate-pulse">_</span>
            Listening for connections...
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  const [heroCopied, setHeroCopied] = useState(false);
  const [snippetTab, setSnippetTab] = useState<'sdk' | 'fetch'>('sdk');
  const [snippetCopied, setSnippetCopied] = useState(false);

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

  const container: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
  };

  const item: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="w-full flex-1 scroll-smooth overflow-x-clip">
      <motion.div variants={container} initial="hidden" animate="visible" className="max-w-7xl mx-auto px-4 sm:px-6 pt-1 sm:pt-4 lg:pt-6 pb-4 sm:pb-6 flex flex-col gap-12 sm:gap-16 lg:gap-20">
        
        {/* --- 1. HERO SECTION --- */}
        <motion.section variants={item} style={{ willChange: "transform, opacity" }} className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-8 items-center">
          
          <div className="flex flex-col items-start max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-brand/20 rounded-full mb-3.5 sm:mb-5 text-xs font-mono text-brand bg-brand/5 shadow-[0_0_15px_rgba(255,77,0,0.1)]">
              <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse shadow-[0_0_5px_rgba(255,77,0,0.8)]" />
              NATIVE NODE &amp; REST API // V2 ENGINE
            </div>
            
            <h1 className="text-[2.2rem] min-[400px]:text-4xl sm:text-6xl lg:text-8xl font-medium tracking-[-0.04em] leading-[1.05] sm:leading-[0.95] mb-3.5 sm:mb-5 text-textMain">
              IRCTC Data.<br />
              <span className="text-textMuted">Zero Bullshit.</span>
            </h1>
            
            <div className="text-sm sm:text-lg text-textMuted max-w-xl sm:max-w-2xl mb-5 sm:mb-7 leading-[1.6] space-y-1.5 sm:space-y-2">
              <p>One API key. Instant access to real-time train tracking, PNR verification, and railway graph routing.</p>
              <p>Plug it into your backend with <code className="text-white/90 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono">npm i irctc-api</code> and let our managed infrastructure handle the scale.</p>
            </div>

            <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-3 sm:gap-3.5">
              <Link
                to="/playground"
                className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-b from-brand to-[#d64000] text-white px-6 sm:px-8 h-[48px] sm:h-[50px] rounded-xl hover:brightness-110 active:scale-[0.98] transition-all duration-300 font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_20px_rgba(255,77,0,0.2)] text-sm sm:text-base shrink-0"
              >
                Open API Playground
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button
                type="button"
                onClick={copyHeroInstall}
                aria-label="Copy npm install command"
                className="group relative inline-flex items-center justify-center gap-3 bg-surface/80 hover:bg-surfaceHover border border-borderRoot/90 hover:border-white/20 px-5 sm:px-6 h-[48px] sm:h-[50px] rounded-xl active:scale-[0.98] transition-all duration-200 font-mono text-xs sm:text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] select-none shrink-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 font-normal select-none">$</span>
                  <span className="text-textMain/90 font-medium tracking-tight">npm i irctc-api</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400 group-hover:text-textMain transition-colors">
                  {heroCopied ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span className="text-[11px] font-sans font-medium text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <Copy size={14} className="group-hover:scale-110 transition-transform text-zinc-500 group-hover:text-white" />
                  )}
                </div>
              </button>
            </div>

            {/* Subtle Sub-Bar - Centered on mobile, flush left on desktop */}
            <div className="mt-3 w-full sm:w-auto flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-2.5 text-xs text-textMuted/70">
              <a href="#ecosystem" className="hover:text-textMain transition-colors flex items-center gap-1 py-1">
                Explore API endpoints ↓
              </a>
              <span className="text-zinc-700 select-none">•</span>
              <a
                href="https://www.npmjs.com/package/irctc-api"
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand transition-colors font-mono text-[11px] text-textMuted/70 hover:underline py-1 px-1 rounded"
              >
                v4.1.0 on npm ↗
              </a>
            </div>
          </div>

          <div className="w-full flex justify-center lg:justify-end">
            <FirehoseTerminal />
          </div>
        </motion.section>


        {/* --- 2. ARCHITECTURE BENTO GRID --- */}
        <motion.section variants={item} style={{ willChange: "transform, opacity" }} className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {[
            { icon: Activity, value: "0.4ms", label: "Sub-Ms Latency", desc: "Bypasses databases entirely, keeping 10,000+ trains hot in memory for instantaneous O(1) lookups." },
            { icon: Search, value: "Zero-Delay", label: "Autocomplete", desc: "Typo-tolerant, lightning-fast station code autocomplete built for modern frontends." },
            { icon: ShieldCheck, value: "OAuth 2.0", label: "Enterprise Security", desc: "Secure Google Sign-in layer protecting all endpoints with stateless JWT session management." },
            { icon: Database, value: "100% Offline", label: "Graph Engine", desc: "Pathfinding engine works entirely offline, decoupling routing logic from network bottlenecks." }
          ].map((block, i) => (
            <div key={i} className="bg-surface border border-borderRoot p-3.5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl flex flex-col justify-between group hover:border-brand/40 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:bg-white/[0.02]">
              <block.icon className="text-textMuted group-hover:text-brand transition-colors mb-3 sm:mb-8" size={20} strokeWidth={1.5} />
              <div>
                <div className="text-lg sm:text-2xl lg:text-3xl font-medium mb-1 sm:mb-2 text-textMain group-hover:text-brand transition-colors tracking-tight">{block.value}</div>
                <div className="text-textMuted text-[9px] sm:text-[11px] font-semibold uppercase tracking-wider sm:tracking-widest mb-1.5 sm:mb-2">{block.label}</div>
                <p className="text-textMuted text-[11px] sm:text-sm leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">{block.desc}</p>
              </div>
            </div>
          ))}
        </motion.section>


        {/* --- 3. API ECOSYSTEM --- */}
        <motion.section variants={item} id="ecosystem" className="flex flex-col gap-6 sm:gap-10 scroll-mt-24">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-medium mb-2 sm:mb-3 tracking-tight">The API Ecosystem</h2>
            <p className="text-xs sm:text-base text-textMuted">A comprehensive suite of REST endpoints covering live status, routing, and station intelligence.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Group 1 */}
            <div className="flex flex-col gap-4 sm:gap-5 bg-surface/40 border border-borderRoot p-4 sm:p-6 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              <div className="flex items-center gap-2.5 sm:gap-3 text-textMain font-medium border-b border-borderRoot pb-3 text-sm sm:text-base">
                <MapPin className="text-brand" size={18} />
                Live Tracking & PNR
              </div>
              <div className="flex flex-col gap-3.5 sm:gap-4">
                <div className="group cursor-default">
                  <div className="text-[10px] sm:text-[11px] font-mono text-emerald-400 mb-1 sm:mb-1.5 bg-emerald-400/10 inline-block px-2 py-0.5 rounded border border-emerald-400/20 break-all sm:break-normal">GET /api/v1/live/:trainNo</div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">Pinpoint real-time GPS location and delay status of any running train.</p>
                </div>
                <div className="group cursor-default">
                  <div className="text-[10px] sm:text-[11px] font-mono text-emerald-400 mb-1 sm:mb-1.5 bg-emerald-400/10 inline-block px-2 py-0.5 rounded border border-emerald-400/20 break-all sm:break-normal">GET /api/v1/live/station/:stationCode</div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">Real-time NTES station arrivals &amp; departures board with platform numbers and delays.</p>
                </div>
                <div className="group cursor-default">
                  <div className="text-[10px] sm:text-[11px] font-mono text-emerald-400 mb-1 sm:mb-1.5 bg-emerald-400/10 inline-block px-2 py-0.5 rounded border border-emerald-400/20 break-all sm:break-normal">GET /api/v1/pnr/:pnr</div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">Fetch passenger manifests, berth types, charting status, and waitlist movements.</p>
                </div>
              </div>
            </div>

            {/* Group 2 */}
            <div className="flex flex-col gap-4 sm:gap-5 bg-surface/40 border border-borderRoot p-4 sm:p-6 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              <div className="flex items-center gap-2.5 sm:gap-3 text-textMain font-medium border-b border-borderRoot pb-3 text-sm sm:text-base">
                <Route className="text-brand" size={18} />
                Train Routing & Fares
              </div>
              <div className="flex flex-col gap-3.5 sm:gap-4">
                <div className="group cursor-default">
                  <div className="text-[10px] sm:text-[11px] font-mono text-emerald-400 mb-1 sm:mb-1.5 bg-emerald-400/10 inline-block px-2 py-0.5 rounded border border-emerald-400/20 break-all sm:break-normal">GET /api/v1/trains/search</div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">Find Trains (Between Stations) with intelligent pathfinding and running days.</p>
                </div>
                <div className="group cursor-default">
                  <div className="text-[10px] sm:text-[11px] font-mono text-emerald-400 mb-1 sm:mb-1.5 bg-emerald-400/10 inline-block px-2 py-0.5 rounded border border-emerald-400/20 break-all sm:break-normal">GET /api/v1/trains/:trainNo/fare</div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">Fare Lookup: real-time official ticket fare breakup across classes.</p>
                </div>
                <div className="group cursor-default">
                  <div className="text-[10px] sm:text-[11px] font-mono text-emerald-400 mb-1 sm:mb-1.5 bg-emerald-400/10 inline-block px-2 py-0.5 rounded border border-emerald-400/20 break-all sm:break-normal">GET /api/v1/trains/:trainNo/availability</div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">Seat Availability: official 14-day multi-class confirmation forecast.</p>
                </div>
                <div className="group cursor-default">
                  <div className="text-[10px] sm:text-[11px] font-mono text-emerald-400 mb-1 sm:mb-1.5 bg-emerald-400/10 inline-block px-2 py-0.5 rounded border border-emerald-400/20 break-all sm:break-normal">GET /api/v1/trains/:trainNo/chart-vacant</div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">Vacant Seats After Chart Preparation: current booking &amp; TTE berth allocations.</p>
                </div>
                <div className="group cursor-default">
                  <div className="text-[10px] sm:text-[11px] font-mono text-emerald-400 mb-1 sm:mb-1.5 bg-emerald-400/10 inline-block px-2 py-0.5 rounded border border-emerald-400/20 break-all sm:break-normal">GET /api/v1/trains/cancelled</div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">Cancelled Trains: daily fully &amp; partially cancelled trains with 0ms cache.</p>
                </div>
              </div>
            </div>

            {/* Group 3 */}
            <div className="flex flex-col gap-4 sm:gap-5 bg-surface/40 border border-borderRoot p-4 sm:p-6 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              <div className="flex items-center gap-2.5 sm:gap-3 text-textMain font-medium border-b border-borderRoot pb-3 text-sm sm:text-base">
                <TrainFront className="text-brand" size={18} />
                Station Intelligence
              </div>
              <div className="flex flex-col gap-3.5 sm:gap-4">
                <div className="group cursor-default">
                  <div className="text-[10px] sm:text-[11px] font-mono text-emerald-400 mb-1 sm:mb-1.5 bg-emerald-400/10 inline-block px-2 py-0.5 rounded border border-emerald-400/20 break-all sm:break-normal">GET /api/v1/trains/stations</div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">High-speed prefix-tree autocomplete for over 8,500+ Indian Railway stations.</p>
                </div>
                <div className="group cursor-default">
                  <div className="text-[10px] sm:text-[11px] font-mono text-emerald-400 mb-1 sm:mb-1.5 bg-emerald-400/10 inline-block px-2 py-0.5 rounded border border-emerald-400/20 break-all sm:break-normal">GET /api/v1/trains/:trainNo</div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">Complete A-to-Z running schedule, halt durations, and day offsets.</p>
                </div>
                <div className="group cursor-default">
                  <div className="text-[10px] sm:text-[11px] font-mono text-emerald-400 mb-1 sm:mb-1.5 bg-emerald-400/10 inline-block px-2 py-0.5 rounded border border-emerald-400/20 break-all sm:break-normal">GET /api/v1/trains/stations/:code</div>
                  <p className="text-xs sm:text-sm text-textMuted group-hover:text-textMain transition-colors leading-snug">Live departure and arrival boards, and master timetable for any station.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* --- 4. DEVELOPER EXPERIENCE --- */}
        <motion.section variants={item} className="grid grid-cols-1 lg:grid-cols-2 items-center bg-surface border border-borderRoot rounded-3xl overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <div className="p-5 sm:p-10 lg:p-14 flex flex-col">
            <div className="inline-flex items-center gap-2 text-brand font-mono text-[10px] uppercase tracking-widest font-semibold mb-2">
              Official irctc-api NPM Package
            </div>
            <h2 className="text-xl sm:text-3xl font-medium tracking-tight mb-2.5 sm:mb-4 text-textMain">Designed for Developers.</h2>
            <p className="text-textMuted text-xs sm:text-base leading-relaxed mb-6 max-w-md">
              Zero dependencies, native <code className="text-white/90 bg-white/5 px-1.5 py-0.5 rounded text-xs font-mono">fetch</code>, and 100% typed. Integrate live Indian Railways tracking and routing into your stack in minutes.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/playground" className="text-brand font-medium hover:text-brand/80 active:opacity-70 transition-all flex items-center gap-1.5 border-b border-brand/30 pb-0.5 text-xs sm:text-sm">
                Try the Live Playground <ArrowRight size={15} />
              </Link>
              <Link to="/docs" className="text-textMuted hover:text-textMain transition-colors flex items-center gap-1.5 text-xs sm:text-sm">
                SDK Documentation →
              </Link>
            </div>
          </div>

          <div className="bg-[#080808] h-full p-3.5 sm:p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-borderRoot flex items-center justify-center relative overflow-hidden">
            {/* Glowing background blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative w-full max-w-md bg-[#0a0a0a] border border-borderRoot/60 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/5">
              {/* Window Chrome */}
              <div className="flex items-center justify-between px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#111] border-b border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>
                
                {/* Editor File Tabs */}
                <div className="flex items-center bg-black/60 rounded-lg p-0.5 border border-white/5">
                  <button
                    type="button"
                    onClick={() => setSnippetTab('sdk')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all flex items-center gap-1.5 ${
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
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all flex items-center gap-1.5 ${
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
                  className="flex items-center gap-1 text-[11px] font-mono text-textMuted hover:text-textMain transition-colors px-2 py-1 rounded hover:bg-white/5"
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

              {snippetTab === 'sdk' ? (
                <div className="p-4 sm:p-5 font-mono text-[11px] sm:text-[13px] leading-relaxed overflow-x-auto text-gray-300">
                  <span className="text-[#ff7b72]">import</span> {'{'} <span className="text-[#79c0ff]">IrctcApi</span> {'}'} <span className="text-[#ff7b72]">from</span> <span className="text-[#a5d6ff]">'irctc-api'</span>;<br/>
                  <br/>
                  <span className="text-[#ff7b72]">const</span> irctc = <span className="text-[#ff7b72]">new</span> <span className="text-[#79c0ff]">IrctcApi</span>({'{'} <br/>
                  &nbsp;&nbsp;apiKey: <span className="text-[#a5d6ff]">'re_live_••••••••••••'</span> <br/>
                  {'}'});<br/>
                  <br/>
                  <span className="text-[#8b949e] italic">// Real-time running status &amp; GPS</span><br/>
                  <span className="text-[#ff7b72]">const</span> live = <span className="text-[#ff7b72]">await</span> irctc.live.<span className="text-[#d2a8ff]">getStatus</span>(<span className="text-[#79c0ff]">'12301'</span>);<br/>
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

        {/* --- 5. CREATOR & MAINTAINER SECTION --- */}
        <motion.div variants={item} className="flex flex-col">
          <section className="bg-surface/30 border border-borderRoot rounded-3xl p-5 sm:p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] hover:bg-surface/50 transition-colors">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 text-brand font-mono text-[10px] mb-2 sm:mb-3 uppercase tracking-widest font-semibold">
                <Terminal size={12} strokeWidth={2.5} />
                Creator & Maintainer
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-textMain mb-2 sm:mb-3">Engineered by Manjot Singh</h2>
              <p className="text-textMuted text-xs sm:text-sm leading-relaxed max-w-xl">
                Built to solve the latency and reliability issues of traditional railway data APIs. Designed from the ground up for extreme speed, offline routing capabilities, and a flawless developer experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-row items-center gap-2.5 sm:gap-3 w-full md:w-auto shrink-0">
              <a href="https://github.com/Manj620026" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2.5 bg-[#0a0a0a] hover:bg-[#151515] active:scale-[0.98] border border-borderRoot px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl transition-all w-full md:w-auto shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-textMuted"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5 0-1.4-.5-2.5-1.5-3.3.1-.3.5-1.5-.1-3.2 0 0-1.2-.4-3.9 1.4a12.3 12.3 0 0 0-7 0C3.9 1.5 2.7 1.9 2.7 1.9a9 9 0 0 0-.1 3.2C1.5 6 1 7.1 1 8.5c0 5 3 6.2 6 6.5-.4.4-.7 1-.8 1.9-.1.1-.3.1-.4.1-.7 0-1.3-.3-1.6-.8-.5-.8-1.2-1.2-1.8-1.1-.5 0-.2.5.1.7.3.2.7.7 1 1.4.3.8 1.2 1 1.9 1 .1 0 .2 0 .4-.1v2.3" /></svg>
                <span className="font-medium text-xs sm:text-sm text-textMain">@Manj620026</span>
              </a>
              <a href="mailto:support@irctc.dev" className="flex items-center justify-center gap-2.5 bg-[#0a0a0a] hover:bg-[#151515] active:scale-[0.98] border border-borderRoot px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl transition-all w-full md:w-auto shadow-sm">
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
