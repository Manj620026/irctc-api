import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

const ENDPOINTS = [
  {
    title: 'Get Server Health',
    method: 'GET',
    path: '/health',
    description: 'Check if the API server is up and running.',
    reqPath: '/health',
    parameters: [],
    response: `{\n  "status": "up",\n  "version": "1.0.0"\n}`
  },
  {
    title: 'Search Trains Between Stations',
    method: 'GET',
    path: '/api/v1/trains/search',
    description: 'Discover direct and connecting trains between two station codes.',
    reqPath: '/api/v1/trains/search?from=NDLS&to=PNBE&date=2026-10-09',
    parameters: [
      { name: 'from', in: 'QUERY', type: 'string', required: true, description: 'Source station code' },
      { name: 'to', in: 'QUERY', type: 'string', required: true, description: 'Destination station code' },
      { name: 'date', in: 'QUERY', type: 'string', required: false, description: 'Date in YYYY-MM-DD' }
    ],
    response: `{\n  "success": true,\n  "data": {\n    "trains": [\n      { "trainNo": "12309", "departureTime": "17:10", "arrivalTime": "06:50" }\n    ]\n  }\n}`
  },
  {
    title: 'Search Trains by Name',
    method: 'GET',
    path: '/api/v1/trains/search/name',
    description: 'Search for trains using a partial or full name.',
    reqPath: '/api/v1/trains/search/name?name=rajdhani',
    parameters: [
      { name: 'name', in: 'QUERY', type: 'string', required: true, description: 'Partial or full train name' }
    ],
    response: `{\n  "success": true,\n  "data": {\n    "matches": [\n      { "trainNo": "12309", "name": "RJPB TEJAS RAJ" },\n      { "trainNo": "12951", "name": "NDLS TEJAS RAJ" }\n    ]\n  }\n}`
  },
  {
    title: 'Get Train Schedule',
    method: 'GET',
    path: '/api/v1/trains/:trainNo',
    description: 'Get the full schedule, halts, timings, and route for a specific 5-digit train number.',
    reqPath: '/api/v1/trains/12309',
    parameters: [
      { name: 'trainNo', in: 'PATH', type: 'string', required: true, description: '5-digit train number' }
    ],
    response: `{\n  "success": true,\n  "data": {\n    "trainNo": "12309",\n    "route": [\n      { "station": "RJPB", "day": 1, "arrivalTime": "Source", "departureTime": "19:10" },\n      { "station": "NDLS", "day": 2, "arrivalTime": "07:40", "departureTime": "Destination" }\n    ]\n  }\n}`
  },
  {
    title: 'Search Stations (Autocomplete)',
    method: 'GET',
    path: '/api/v1/trains/stations',
    description: 'Lightning-fast autocomplete search for railway stations by name or exact code.',
    reqPath: '/api/v1/trains/stations?q=patna',
    parameters: [
      { name: 'q', in: 'QUERY', type: 'string', required: true, description: 'Search query' }
    ],
    response: `{\n  "success": true,\n  "data": {\n    "matches": [\n      { "code": "PNBE", "name": "Patna Junction" },\n      { "code": "PPTA", "name": "Patliputra Junction" }\n    ]\n  }\n}`
  },
  {
    title: 'Get Station Timetable',
    method: 'GET',
    path: '/api/v1/trains/stations/:code/timetable/:date',
    description: 'Get a complete list of all trains arriving or departing from a specific station on a given date.',
    reqPath: '/api/v1/trains/stations/NDLS/timetable/2026-10-09',
    parameters: [
      { name: 'code', in: 'PATH', type: 'string', required: true, description: 'Station code' },
      { name: 'date', in: 'PATH', type: 'string', required: true, description: 'Date in YYYY-MM-DD' }
    ],
    response: `{\n  "success": true,\n  "data": {\n    "station": "NDLS",\n    "date": "2026-10-09",\n    "trains": [\n      { "trainNo": "12004", "type": "DEPARTURE", "time": "06:10" }\n    ]\n  }\n}`
  },
  {
    title: 'Get Station Details',
    method: 'GET',
    path: '/api/v1/trains/stations/:code',
    description: 'Fetch detailed information about a station including its full name, zone, and location.',
    reqPath: '/api/v1/trains/stations/NDLS',
    parameters: [
      { name: 'code', in: 'PATH', type: 'string', required: true, description: 'Station code' }
    ],
    response: `{\n  "success": true,\n  "data": {\n    "code": "NDLS",\n    "name": "New Delhi",\n    "zone": "NR",\n    "state": "Delhi"\n  }\n}`
  },
  {
    title: 'Track Live Train Status',
    method: 'GET',
    path: '/api/v1/live/:trainNo',
    description: 'Get real-time running status, current station, delay, and upcoming halts.',
    reqPath: '/api/v1/live/12309?date=2026-10-09',
    parameters: [
      { name: 'trainNo', in: 'PATH', type: 'string', required: true, description: '5-digit train number' },
      { name: 'date', in: 'QUERY', type: 'string', required: false, description: 'Journey date in YYYY-MM-DD' }
    ],
    response: `{\n  "success": true,\n  "data": {\n    "trainNo": "12309",\n    "currentStation": "CNB",\n    "status": "Arrived at Kanpur Central"\n  }\n}`
  },
  {
    title: 'Check PNR Status',
    method: 'GET',
    path: '/api/v1/pnr/:pnr',
    description: 'Fetch real-time current PNR status, passenger info, and charting status.',
    reqPath: '/api/v1/pnr/2434567890',
    parameters: [
      { name: 'pnr', in: 'PATH', type: 'string', required: true, description: '10-digit PNR number' }
    ],
    response: `{\n  "success": true,\n  "data": {\n    "pnr": "2434567890",\n    "trainNo": "12309",\n    "chartStatus": "Chart Not Prepared",\n    "passengers": [\n      { "no": 1, "status": "CNF/B1/42" }\n    ]\n  }\n}`
  }
];

const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.irctc.dev';

// Syntax Colors (Vercel/Linear Vibe)
const kw = "text-[#f81ce5]"; // Keywords
const st = "text-[#50e3c2]"; // Strings
const fn = "text-[#3291ff]"; // Functions
const p = "text-[#888888]";  // Punctuation
const v = "text-[#ededed]";  // Variables

const escapeHtml = (str: string) =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

const getSnippet = (lang: string, path: string) => {
  const url = `${BASE_URL}${path}`;
  const safeUrl = escapeHtml(url);
  if (lang === 'JavaScript') {
    return {
      code: `const response = await fetch("${url}", {\n  method: "GET",\n  headers: {\n    "Authorization": "Bearer YOUR_API_KEY",\n    "accept": "application/json",\n  },\n});\n\nconst data = await response.json();\nconsole.log(data);`,
      html: `<span class="${kw}">const</span> <span class="${v}">response</span> <span class="${p}">=</span> <span class="${kw}">await</span> <span class="${fn}">fetch</span><span class="${p}">(</span><span class="${st}">"${safeUrl}"</span><span class="${p}">, {</span>
  <span class="${v}">method:</span> <span class="${st}">"GET"</span><span class="${p}">,</span>
  <span class="${v}">headers:</span> <span class="${p}">{</span>
    <span class="${st}">"Authorization"</span><span class="${p}">:</span> <span class="${st}">"Bearer YOUR_API_KEY"</span><span class="${p}">,</span>
    <span class="${st}">"accept"</span><span class="${p}">:</span> <span class="${st}">"application/json"</span><span class="${p}">,</span>
  <span class="${p}">},</span>
<span class="${p}">});</span>

<span class="${kw}">const</span> <span class="${v}">data</span> <span class="${p}">=</span> <span class="${kw}">await</span> <span class="${v}">response</span><span class="${p}">.</span><span class="${fn}">json</span><span class="${p}">();</span>
<span class="${v}">console</span><span class="${p}">.</span><span class="${fn}">log</span><span class="${p}">(</span><span class="${v}">data</span><span class="${p}">);</span>`
    };
  }
  if (lang === 'Python') {
    return {
      code: `import requests\n\nurl = "${url}"\nheaders = {\n    "Authorization": "Bearer YOUR_API_KEY",\n    "accept": "application/json"\n}\n\nresponse = requests.get(url, headers=headers)\nprint(response.json())`,
      html: `<span class="${kw}">import</span> <span class="${v}">requests</span>

<span class="${v}">url</span> <span class="${p}">=</span> <span class="${st}">"${safeUrl}"</span>
<span class="${v}">headers</span> <span class="${p}">= {</span>
    <span class="${st}">"Authorization"</span><span class="${p}">:</span> <span class="${st}">"Bearer YOUR_API_KEY"</span><span class="${p}">,</span>
    <span class="${st}">"accept"</span><span class="${p}">:</span> <span class="${st}">"application/json"</span>
<span class="${p}">}</span>

<span class="${v}">response</span> <span class="${p}">=</span> <span class="${v}">requests</span><span class="${p}">.</span><span class="${fn}">get</span><span class="${p}">(</span><span class="${v}">url</span><span class="${p}">,</span> <span class="${v}">headers</span><span class="${p}">=</span><span class="${v}">headers</span><span class="${p}">)</span>
<span class="${fn}">print</span><span class="${p}">(</span><span class="${v}">response</span><span class="${p}">.</span><span class="${fn}">json</span><span class="${p}">())</span>`
    };
  }
  if (lang === 'cURL') {
    return {
      code: `curl -X GET "${url}" \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "accept: application/json"`,
      html: `<span class="${kw}">curl</span> <span class="${p}">-X</span> <span class="${v}">GET</span> <span class="${st}">"${safeUrl}"</span> <span class="${p}">\\</span>
  <span class="${p}">-H</span> <span class="${st}">"Authorization: Bearer YOUR_API_KEY"</span> <span class="${p}">\\</span>
  <span class="${p}">-H</span> <span class="${st}">"accept: application/json"</span>`
    };
  }
  return { code: '', html: '' };
};

// Syntax highlighting for JSON Responses (Minimalist/Ponytail style)
const highlightJSON = (jsonString: string) => {
  return jsonString.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      const isKey = /^"/.test(match) && /:$/.test(match);
      const isStr = /^"/.test(match) && !isKey;
      const isBoolNull = /^(true|false|null)$/.test(match);
      const escaped = escapeHtml(match);

      if (isKey) {
        return `<span class="text-[#3291ff]">${escaped.slice(0, -1)}</span><span class="${p}">:</span>`;
      }
      const cls = isStr ? "text-[#50e3c2]" : (isBoolNull ? "text-[#f81ce5]" : "text-[#f5a623]");
      return `<span class="${cls}">${escaped}</span>`;
    }
  );
};

export default function Docs() {
  const [activeLang, setActiveLang] = useState('JavaScript');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTabs, setActiveTabs] = useState<Record<number, 'req' | 'res'>>({});

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleTab = (idx: number, tab: 'req' | 'res') => {
    setActiveTabs(prev => ({ ...prev, [idx]: tab }));
  };

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col pt-16 pb-32"
    >
      {/* HEADER SECTION */}
      <motion.div variants={itemVariants} className="max-w-3xl mb-12 sm:mb-24">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter mb-3 sm:mb-5 text-textMain">API Reference</h2>
        <p className="text-textMuted text-sm sm:text-lg leading-relaxed mb-6 sm:mb-10 max-w-2xl">
          Integrate the IRCTC API into your application. Authenticate your requests using your secret API keys and fetch real-time Indian Railways data instantly.
        </p>

        {/* Global Language Switcher - Sleek Segmented Control */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-textMuted/60">Language:</span>
          <div className="grid grid-cols-3 sm:flex bg-[#111] p-1 rounded-lg border border-white/[0.05] shadow-inner w-full sm:w-auto">
            {['JavaScript', 'Python', 'cURL'].map(lang => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`py-2 px-3 sm:px-6 text-center text-xs font-medium rounded-md transition-all duration-200 active:scale-[0.97] ${
                  activeLang === lang 
                    ? 'bg-[#222] text-white shadow-sm ring-1 ring-white/10' 
                    : 'text-textMuted hover:text-textMain hover:bg-white/[0.02]'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ENDPOINTS LIST - 40/60 Split Layout */}
      <div className="flex flex-col">
        {ENDPOINTS.map((endpoint, idx) => {
          const snippet = getSnippet(activeLang, endpoint.reqPath);
          const currentTab = activeTabs[idx] || 'req';
          
          return (
            <motion.div 
              key={idx} 
              variants={itemVariants} 
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start border-t border-white/[0.04] py-10 sm:py-16 first:pt-0 first:border-0"
            >
              
              {/* Left Column: Docs Info (Takes up 5 cols out of 12) */}
              <div className="lg:col-span-5 flex flex-col pt-1">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <h4 className="text-xl sm:text-2xl font-medium tracking-tight text-textMain">{endpoint.title}</h4>
                </div>
                
                <p className="text-textMuted text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                  {endpoint.description}
                </p>

                <div className="mb-6 sm:mb-8">
                  <div className="inline-flex items-center gap-2.5 sm:gap-3 bg-[#111] border border-white/[0.08] rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 font-mono text-[10px] sm:text-[11px] text-white shadow-sm hover:border-white/20 transition-colors cursor-default max-w-full">
                    <span className="text-emerald-400 font-bold uppercase tracking-wider shrink-0">{endpoint.method}</span> 
                    <span className="text-white/80 truncate">{endpoint.path}</span>
                  </div>
                </div>

                {/* Parameters Section */}
                {endpoint.parameters && endpoint.parameters.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-textMuted/70 mb-3 sm:mb-4">Parameters</h5>
                    <div className="border-t border-white/[0.05]">
                      {endpoint.parameters.map((param, pIdx) => (
                        <div key={pIdx} className="py-2.5 sm:py-3 border-b border-white/[0.03] flex flex-col gap-1 sm:gap-1.5">
                          <div className="flex items-center gap-2">
                            <code className="text-[11px] sm:text-[12px] font-mono text-emerald-400">{param.name}</code>
                            {param.required && (
                              <span className="text-[9px] uppercase tracking-wider font-bold text-[#ff5f56] bg-[#ff5f56]/10 px-1.5 py-0.5 rounded">Required</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono text-textMuted/60">
                            <span>in: <span className="text-textMuted">{param.in.toLowerCase()}</span></span>
                            <span>&bull;</span>
                            <span>type: <span className="text-textMuted">{param.type}</span></span>
                          </div>
                          <p className="text-xs sm:text-sm text-textMuted/90 mt-0.5 sm:mt-1">{param.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Column: Terminal Window (Takes up 7 cols out of 12) */}
              <div className="lg:col-span-7 relative rounded-xl overflow-hidden bg-[#000] border border-white/[0.08] shadow-2xl">
                {/* Terminal Header with Tabs */}
                <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-[#161616] border-b border-white/[0.05] gap-2">
                  <div className="hidden sm:flex items-center gap-2 mr-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                  </div>
                  
                  {/* Request / Response Tabs */}
                  <div className="flex items-center bg-[#0a0a0a] rounded-md p-0.5 sm:p-1 border border-white/[0.03]">
                    <button
                      onClick={() => toggleTab(idx, 'req')}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-medium rounded-sm transition-all active:scale-[0.97] ${
                        currentTab === 'req'
                          ? 'bg-[#222] text-white shadow-sm'
                          : 'text-textMuted hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      Request
                    </button>
                    <button
                      onClick={() => toggleTab(idx, 'res')}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-medium rounded-sm transition-all active:scale-[0.97] ${
                        currentTab === 'res'
                          ? 'bg-[#222] text-white shadow-sm'
                          : 'text-textMuted hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      Response
                    </button>
                  </div>

                  <button
                    onClick={() => copyCode(currentTab === 'req' ? snippet.code : endpoint.response || '', idx)}
                    className="flex items-center gap-1.5 text-[10px] font-medium text-textMuted hover:text-white active:scale-[0.95] transition-all ml-auto px-2 py-1 rounded bg-[#0a0a0a] border border-white/[0.04]"
                  >
                    {copiedIndex === idx ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    {copiedIndex === idx ? 'COPIED' : 'COPY'}
                  </button>
                </div>
                
                {/* Terminal Body */}
                <div className="p-4 sm:p-6 overflow-x-auto min-h-[250px] sm:min-h-[350px]">
                  <AnimatePresence mode="wait">
                    {currentTab === 'req' ? (
                      <motion.pre
                        key="req"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="font-mono text-[13px] leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: snippet.html }}
                      />
                    ) : (
                      <motion.pre
                        key="res"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="font-mono text-[13px] leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: highlightJSON(endpoint.response || '{}') }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </motion.div>
          )
        })}
      </div>
    </motion.div>
  );
}
