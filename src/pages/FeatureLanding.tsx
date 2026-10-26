import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  Terminal,
  Clock,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Database,
  Layers,
  Cpu,
  BookOpen
} from 'lucide-react';
import { FEATURE_PAGES } from '../data/featurePages';

interface FeatureLandingProps {
  slug: string;
}

const BASE_URL = 'https://api.irctc.dev';

const getSnippet = (lang: string, path: string): string => {
  const url = `${BASE_URL}${path}`;
  if (lang === 'cURL') {
    return `curl -X GET "${url}" \\
  -H "x-api-key: your_api_key"`;
  }
  if (lang === 'JavaScript') {
    return `const res = await fetch("${url}", {
  headers: {
    "x-api-key": process.env.IRCTC_API_KEY,
  },
});

const data = await res.json();
console.log(data);`;
  }
  if (lang === 'Python') {
    return `import os, requests

url = "${url}"
headers = {"x-api-key": os.getenv("IRCTC_API_KEY")}

response = requests.get(url, headers=headers)
print(response.json())`;
  }
  return '';
};

// Calibrated syntax highlighter avoiding neon glare (Xcode/Linear dark theme tokens)
const renderHighlightedJson = (jsonString: string) => {
  const lines = jsonString.split('\n');
  return lines.map((line, i) => {
    const keyMatch = line.match(/^(\s*)(".*?":)(.*)$/);
    if (keyMatch) {
      const [, indent, keyStr, rest] = keyMatch;
      let valueColor = 'text-slate-200';
      if (rest.includes('true') || rest.includes('false') || rest.includes('null')) {
        valueColor = 'text-violet-300';
      } else if (/\d/.test(rest)) {
        valueColor = 'text-amber-200';
      } else if (rest.includes('"')) {
        valueColor = 'text-emerald-300';
      }
      return (
        <div key={i} className="font-mono text-[12.5px] leading-relaxed">
          <span className="whitespace-pre">{indent}</span>
          <span className="text-slate-400">{keyStr}</span>
          <span className={valueColor}>{rest}</span>
        </div>
      );
    }
    return (
      <div key={i} className="text-slate-500 font-mono text-[12.5px] leading-relaxed whitespace-pre">
        {line || ' '}
      </div>
    );
  });
};

const renderSnippet = (code: string) => {
  const lines = code.split('\n');
  return lines.map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || trimmed.startsWith('//')) {
      return (
        <div key={i} className="font-mono text-[12.5px] leading-relaxed text-slate-500 whitespace-pre">
          {line || ' '}
        </div>
      );
    }
    let content: React.ReactNode = line;
    if (line.startsWith('import ') || line.startsWith('from ') || line.startsWith('const ') || line.startsWith('curl ') || line.startsWith('curl')) {
      const firstSpace = line.indexOf(' ');
      if (firstSpace !== -1) {
        const keyword = line.slice(0, firstSpace);
        const remainder = line.slice(firstSpace);
        content = (
          <>
            <span className="text-violet-300 font-semibold">{keyword}</span>
            <span className="text-slate-200">{remainder}</span>
          </>
        );
      }
    }
    return (
      <div key={i} className="font-mono text-[12.5px] leading-relaxed whitespace-pre">
        {content || ' '}
      </div>
    );
  });
};

export default function FeatureLanding({ slug }: FeatureLandingProps) {
  const [activeLang, setActiveLang] = useState<'cURL' | 'JavaScript' | 'Python'>('cURL');
  const [copied, setCopied] = useState(false);
  const [installCopied, setInstallCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const feature = FEATURE_PAGES[slug];
  if (!feature) {
    return <Navigate to="/docs" replace />;
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleCopyInstall = (text: string) => {
    navigator.clipboard.writeText(text);
    setInstallCopied(true);
    setTimeout(() => setInstallCopied(false), 1800);
  };

  const snippets = {
    cURL: getSnippet('cURL', feature.reqPath),
    JavaScript: getSnippet('JavaScript', feature.reqPath),
    Python: getSnippet('Python', feature.reqPath),
  };

  const schemaLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebAPI',
        '@id': `https://irctc.dev/${feature.slug}#api`,
        'name': feature.title,
        'description': feature.metaDescription,
        'url': `https://irctc.dev/${feature.slug}`,
        'documentation': 'https://irctc.dev/docs',
        'isPartOf': {
          '@type': 'WebAPI',
          '@id': 'https://irctc.dev/#webapi',
          'name': 'IRCTC API Platform'
        },
        'provider': {
          '@id': 'https://irctc.dev/#organization'
        },
        'inLanguage': 'en-IN',
        'termsOfService': 'https://irctc.dev/terms'
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://irctc.dev'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'APIs',
            'item': 'https://irctc.dev/docs'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': feature.h1,
            'item': `https://irctc.dev/${feature.slug}`
          }
        ]
      },
      {
        '@type': 'FAQPage',
        'mainEntity': feature.faqs.map(faq => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer
          }
        }))
      }
    ]
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full flex-1 flex flex-col pt-6 pb-24 font-sans text-textMain selection:bg-brand selection:text-white">
      {/* Ambient subtle atmospheric spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[1000px] h-[380px] bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.08),transparent_70%)] blur-2xl -z-10"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLd) }}
      />

      {/* 1. BREADCRUMBS & SYSTEM METRICS (Restrained, Tabular Numbers) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-10 text-xs text-textMuted border-b border-white/[0.06] pb-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={12} className="text-white/30" />
          <Link to="/docs" className="hover:text-white transition-colors">APIs</Link>
          <ChevronRight size={12} className="text-white/30" />
          <span className="text-white font-medium">{feature.badge}</span>
        </nav>

        <div className="flex items-center gap-2.5 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tabular-nums">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {feature.latencyBenchmark}
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/[0.04] text-textMuted border border-white/[0.08] tabular-nums">
            <Clock size={11} className="text-white/50" />
            {feature.uptimeGuarantee} SLA
          </div>
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/[0.04] text-textMuted border border-white/[0.08]">
            <Database size={11} className="text-white/50" />
            TTL: {feature.cacheTtl}
          </div>
        </div>
      </div>

      {/* 2. HERO SECTION (Negative Optical Tracking, No Sparkles/Zap Clichés) */}
      <div className="max-w-4xl mb-14 sm:mb-18">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-xs font-mono text-textMuted mb-5">
          <span className="text-brand font-semibold tracking-wider">{feature.method}</span>
          <span className="text-white/20">|</span>
          <span className="text-slate-300">{feature.endpointPath}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.08] text-white mb-5">
          {feature.h1}
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-textMuted leading-relaxed max-w-3xl mb-8">
          {feature.subtitle}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-colors shadow-sm active:scale-[0.98]"
          >
            Get Free API Key
            <ArrowRight size={14} className="opacity-70" />
          </Link>
          <Link
            to={`/playground?endpoint=${encodeURIComponent(feature.endpointPath)}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/10 text-sm font-medium text-white hover:bg-white/[0.08] hover:border-white/20 transition-all active:scale-[0.98]"
          >
            <Terminal size={14} className="text-textMuted" />
            Interactive Playground
          </Link>
          <Link
            to="/docs"
            className="inline-flex items-center gap-1.5 px-3 py-2.5 text-textMuted hover:text-white text-sm transition-colors"
          >
            API Reference
            <ChevronRight size={13} className="opacity-60" />
          </Link>
        </div>
      </div>

      {/* 3. SIDE-BY-SIDE INTERACTIVE CONSOLE (Framer Motion Spring Pill Tab) */}
      <section className="mb-20 sm:mb-28">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
              Live Protocol Demo
            </h2>
            <p className="text-xs text-textMuted">
              Production headers and authentic PRS gateway response.
            </p>
          </div>

          {/* Fluid Spring Tab Switcher */}
          <div className="relative inline-flex p-1 rounded-lg bg-surface border border-white/[0.08] self-start sm:self-auto">
            {(['cURL', 'JavaScript', 'Python'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`relative z-10 px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                  activeLang === lang ? 'text-white' : 'text-textMuted hover:text-white'
                }`}
              >
                {activeLang === lang && (
                  <motion.div
                    layoutId="activeLangTab"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className="absolute inset-0 bg-white/15 rounded-md -z-10 border border-white/10"
                  />
                )}
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Request Panel */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0c0c0c] overflow-hidden flex flex-col shadow-xl min-h-[380px] max-h-[460px]">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{feature.method}</span>
                <span className="text-slate-300 truncate max-w-[200px] sm:max-w-xs">{feature.reqPath}</span>
              </div>
              <button
                onClick={() => handleCopy(snippets[activeLang])}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-textMuted hover:text-white transition-all cursor-pointer"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-4 sm:p-5 overflow-x-auto overflow-y-auto flex-1 text-xs sm:text-sm">
              {(['cURL', 'JavaScript', 'Python'] as const).map(lang => (
                <div key={lang} className={activeLang === lang ? 'block' : 'hidden'}>
                  {renderSnippet(snippets[lang])}
                </div>
              ))}
            </div>
          </div>

          {/* Response Panel */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0c0c0c] overflow-hidden flex flex-col shadow-xl min-h-[380px] max-h-[460px]">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-emerald-400 font-medium">200 OK</span>
                <span className="text-white/20">·</span>
                <span className="text-textMuted">application/json</span>
              </div>
              <span className="font-mono text-[10px] text-textMuted px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]">
                latency: {feature.latencyBenchmark}
              </span>
            </div>
            <div className="p-4 sm:p-5 overflow-x-auto overflow-y-auto flex-1 text-xs sm:text-sm">
              {renderHighlightedJson(feature.responseJson)}
            </div>
          </div>
        </div>
      </section>

      {/* 4. ASYMMETRIC ARCHITECTURE BENTO (Unique Endpoint Highlights & Specs) */}
      <section className="mb-20 sm:mb-28">
        <div className="max-w-2xl mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white mb-2">
            Engineered for Railway Throughput
          </h2>
          <p className="text-sm text-textMuted leading-relaxed">
            High-throughput PRS reservation engine connectivity with sub-second Redis caches and 99.9% uptime reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Bento Card 1: 8 Cols - Primary Technical Highlight with Version Switcher */}
          <div className="lg:col-span-8 p-6 sm:p-7 rounded-2xl bg-surface/60 border border-white/[0.08] flex flex-col justify-between">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-brand flex-shrink-0">
                    <Layers size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white leading-tight">
                      Direct Gateway Architecture
                    </h3>
                    <span className="text-[11px] font-mono text-textMuted">
                      Multi-hop routing & telemetry
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-emerald-400 self-start sm:self-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Dedicated PRS Socket</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-textMuted leading-relaxed">
                Queries route through high-speed edge clusters across Indian data center zones with direct PRS gateway connectivity and sub-millisecond dispatch.
              </p>
            </div>

            {/* Architecture Visual Pipeline Display Area */}
            <div className="relative min-h-[155px] flex flex-col justify-center">
              <div className="p-4 sm:p-5 rounded-xl bg-black/50 border border-white/[0.06] font-mono">
                <div className="flex items-center justify-between text-[10px] text-textMuted/70 border-b border-white/[0.04] pb-2 mb-3">
                  <span>HOP_TELEMETRY // DEDICATED_SOCKET</span>
                  <span>TOTAL_BUDGET: {feature.latencyBenchmark}</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {/* Hop 01 */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-[11px] text-textMuted/60">01</span>
                      <span className="text-slate-200 font-medium">Edge Ingress</span>
                      <span className="text-[10px] text-textMuted truncate hidden sm:inline">
                        · TLS 1.3 · TCP Fast Open · Anycast DC
                      </span>
                    </div>
                    <span className="text-slate-300 flex-shrink-0">12ms</span>
                  </div>

                  {/* Hop 02 */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-[11px] text-brand/80">02</span>
                      <span className="text-white font-medium">Edge Router</span>
                      <span className="text-[10px] text-textMuted truncate hidden sm:inline">
                        · Session Pool Dispatch · {feature.cacheTtl}
                      </span>
                    </div>
                    <span className="text-brand font-medium flex-shrink-0">&lt; 2ms</span>
                  </div>

                  {/* Hop 03 */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-[11px] text-emerald-400/80">03</span>
                      <span className="text-white font-medium">Central PRS Tunnel</span>
                      <span className="text-[10px] text-textMuted truncate hidden sm:inline">
                        · Dedicated PRS Gateway Socket
                      </span>
                    </div>
                    <span className="text-emerald-400 font-medium flex-shrink-0">{feature.latencyBenchmark}</span>
                  </div>
                </div>

                {/* Proportional Latency Allocation Bar */}
                <div className="mt-3.5">
                  <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden flex gap-0.5">
                    <div className="w-[15%] bg-slate-500/40 rounded-l-full" />
                    <div className="w-[5%] bg-brand/70" />
                    <div className="w-[80%] bg-emerald-400/70 rounded-r-full" />
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-textMuted/60 pt-1.5">
                    <span>Ingress: ~15%</span>
                    <span>Edge: &lt;5%</span>
                    <span>PRS Core: ~80%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Card 2: 4 Cols - Secondary Highlight & Production Specs */}
          <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl bg-surface/60 border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/70 mb-4">
                <Cpu size={16} />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                Production SLAs & Latency
              </h3>
              <p className="text-xs text-textMuted leading-relaxed mb-5">
                Deterministic throughput backed by enterprise uptime guarantees.
              </p>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-textMuted">Latency Benchmark</span>
                <span className="text-emerald-400">{feature.latencyBenchmark}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-textMuted">Uptime SLA</span>
                <span className="text-white">{feature.uptimeGuarantee}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-textMuted">Rate Limits</span>
                <span className="text-white">1,000 req/min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-textMuted">Cache Strategy</span>
                <span className="text-slate-300">{feature.cacheTtl}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Capabilities Grid */}
        {feature.highlights && feature.highlights.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {feature.highlights.map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-surface/40 border border-white/[0.06] flex flex-col justify-between">
                <div>
                  <span className="text-brand font-mono text-[11px] font-semibold uppercase tracking-wider block mb-2">
                    0{idx + 1} // Capability
                  </span>
                  <h4 className="text-sm font-semibold text-white mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-textMuted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. REQUEST PARAMETERS (Apple Inset Grouped List with Calm Semantic Badges) */}
      <section className="mb-20 sm:mb-28">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-1 tracking-tight">
            Parameters Specification
          </h2>
          <p className="text-xs sm:text-sm text-textMuted">
            Query and path parameters for <code className="text-brand font-mono">{feature.endpointPath}</code>
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c0c]/80 divide-y divide-white/[0.06] overflow-hidden shadow-lg">
          <div className="hidden sm:flex items-center justify-between px-5 py-2.5 bg-white/[0.02] border-b border-white/[0.06] text-[11px] font-mono text-textMuted uppercase tracking-wider">
            <span>Parameter & Location</span>
            <span>Requirement</span>
          </div>
          {feature.parameters.map((param, idx) => (
            <div key={idx} className="p-4 sm:p-5 hover:bg-white/[0.02] transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 font-mono text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-white text-sm">{param.name}</span>
                  <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-slate-300 text-[11px]">
                    {param.type}
                  </span>
                  <span className="text-textMuted text-[11px]">in: {param.in}</span>
                </div>
                <div>
                  {param.required ? (
                    <span className="text-white text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.08] border border-white/10">
                      required
                    </span>
                  ) : (
                    <span className="text-textMuted text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06]">
                      optional
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-textMuted leading-relaxed">
                {param.description}
              </p>
              {param.example && (
                <div className="mt-2 text-xs font-mono text-textMuted flex items-center gap-2">
                  <span className="text-white/40">Example:</span>
                  <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/[0.06] text-emerald-300 font-mono text-[11px]">
                    {param.example}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Status Codes & Gateway Error Handling (Compact Specs) */}
        <div className="mt-4 px-4 py-3 rounded-xl border border-white/[0.06] bg-[#0c0c0c]/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-textMuted">
          <span className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">Response Status:</span>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> <span className="text-white font-medium">200</span> OK</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-white/40" /> <span className="text-white font-medium">400</span> Bad Request</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-white/40" /> <span className="text-white font-medium">404</span> Not Found</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-white/40" /> <span className="text-white font-medium">503</span> Upstream Maintenance</span>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION (Unified Apple Grouped List + Spring Expansion) */}
      <section className="mb-20 sm:mb-28 max-w-4xl">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-textMuted">
            Technical specs regarding IRCTC session lifetime, authentication, and quotas.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-surface/50 divide-y divide-white/[0.06] overflow-hidden">
          {feature.faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="transition-colors">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                >
                  <span className="text-sm sm:text-base font-medium text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-textMuted shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                    >
                      <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-textMuted leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6b. PRODUCTION GUIDE / BLUEPRINT (Topic Cluster Authority Link) */}
      {feature.featuredGuide && (
        <section className="mb-20 sm:mb-24 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-brand/10 via-surface/80 to-surface border border-brand/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-brand/20 border border-brand/30 text-brand font-mono text-[11px] font-semibold mb-2.5">
              <BookOpen size={12} />
              {feature.featuredGuide.badge || 'Implementation Tutorial'}
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5">
              {feature.featuredGuide.title}
            </h3>
            <p className="text-xs sm:text-sm text-textMuted leading-relaxed max-w-2xl">
              {feature.featuredGuide.description}
            </p>
          </div>
          <Link
            to={feature.featuredGuide.slug}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors shadow-sm shrink-0"
          >
            <span>Read Tutorial</span>
            <ArrowRight size={13} />
          </Link>
        </section>
      )}

      {/* 7. RELATED ENDPOINTS (Crisp Technical Strip with Keyword-Rich Anchor Text) */}
      <section className="mb-20 sm:mb-24">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
          Related Railway Endpoints
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {feature.relatedSlugs.map(relSlug => {
            const rel = FEATURE_PAGES[relSlug];
            if (!rel) return null;
            return (
              <Link
                key={relSlug}
                to={`/${relSlug}`}
                className="group p-4 rounded-xl bg-surface/60 border border-white/[0.08] hover:border-white/25 hover:bg-white/[0.04] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] font-mono text-brand mb-1">
                    {rel.method} {rel.endpointPath}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors line-clamp-1 mb-1">
                    {rel.h1}
                  </h4>
                  <p className="text-xs text-textMuted group-hover:text-slate-300 line-clamp-2 transition-colors">
                    {rel.subtitle}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-textMuted group-hover:text-white transition-colors">
                  <span>View endpoint</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 8. WORKBENCH CTA (Restrained Developer Tone) */}
      <section className="rounded-2xl border border-white/10 bg-surface/80 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 font-mono text-xs text-slate-300 mb-6">
            <span className="text-textMuted select-none">$</span>
            <span>npm i irctc-api</span>
            <button
              onClick={() => handleCopyInstall('npm i irctc-api')}
              aria-label="Copy install command"
              className="ml-1 p-1 hover:text-white text-textMuted transition-colors cursor-pointer"
            >
              {installCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            </button>
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-3">
            Integrate {feature.h1}
          </h2>
          <p className="text-xs sm:text-sm text-textMuted mb-7 leading-relaxed">
            Integrate live Indian Railways data into your production or staging stack. 10,000 free sandbox calls included.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-colors shadow-sm active:scale-[0.98]"
            >
              Get API Key
              <ArrowRight size={14} className="opacity-70" />
            </Link>
            <Link
              to="/docs"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/10 text-white text-sm font-medium hover:bg-white/[0.08] transition-all"
            >
              Browse 14 Endpoints
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
