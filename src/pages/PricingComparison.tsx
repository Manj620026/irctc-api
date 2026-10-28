import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  Building2,
  Globe2,
  Terminal,
  ChevronDown
} from 'lucide-react';

const PRICING_TIERS = [
  {
    name: 'Official CRIS / IRCTC Enterprise',
    price: '₹50,00,000+',
    billingPeriod: 'Bank Guarantee + Annual SLA',
    description: 'Direct institutional access provided by Centre for Railway Information Systems (CRIS).',
    badge: 'Enterprise Only',
    badgeColor: 'text-zinc-400 bg-zinc-800 border-zinc-700',
    features: [
      { text: '₹50 Lakhs upfront bank guarantee', ok: false },
      { text: '3-6 months bureaucratic approvals & CERT-In audit', ok: false },
      { text: 'Complex VPN tunnels & static IP requirements', ok: false },
      { text: 'Dedicated 99.99% PRS access', ok: true },
      { text: 'High-volume ticketing authorization', ok: true },
    ],
    summary: 'Essential for MakeMyTrip and Paytm; completely inaccessible for startups and indie developers.'
  },
  {
    name: 'RapidAPI Resellers',
    price: '$35 - $100 / mo',
    billingPeriod: '₹2,900 - ₹8,300 monthly recurring',
    description: 'Third-party scrapers sold on global API marketplaces in US Dollars.',
    badge: 'High Latency',
    badgeColor: 'text-red-400 bg-red-500/10 border-red-500/20',
    features: [
      { text: 'Mandatory international credit card with recurring auto-debit', ok: false },
      { text: '18% GST + 3.5% foreign currency conversion charges', ok: false },
      { text: '4,500ms - 8,200ms latency per request', ok: false },
      { text: 'Frequent 504 timeouts when scrapers break', ok: false },
      { text: 'Limited to 4-5 basic endpoints', ok: false },
    ],
    summary: 'Expensive recurring USD subscriptions with sluggish multi-second response times.'
  },
  {
    name: 'Self-Hosted Scrapers',
    price: '₹8,000+ / mo',
    billingPeriod: 'VPS RAM + Residential Proxies',
    description: 'Building and maintaining your own Puppeteer/Selenium headless browser fleet.',
    badge: 'Maintenance Heavy',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    features: [
      { text: 'Heavy RAM overhead (300MB+ per Chrome instance)', ok: false },
      { text: 'Costly residential rotating proxy subscriptions', ok: false },
      { text: '15-20 hours/week fixing broken HTML selectors', ok: false },
      { text: 'Frequent IP bans by Akamai & Cloudflare', ok: false },
      { text: 'Zero enterprise SLA or uptime guarantee', ok: false },
    ],
    summary: 'High maintenance engineering sink that constantly breaks on captcha changes.'
  },
  {
    name: 'irctc.dev Rail Engine',
    price: '₹99',
    billingPeriod: '100,000 requests (Pay As You Go)',
    description: 'High-speed distributed Indian Railways API platform built specifically for developers.',
    badge: 'Recommended',
    badgeColor: 'text-brand bg-brand/10 border-brand/30',
    highlight: true,
    features: [
      { text: '10,000 Free Credits on 1-click Google signup', ok: true },
      { text: 'Sub-10ms route search & 430ms PNR status', ok: true },
      { text: 'Pay-as-you-go via UPI, GPay, PhonePe (zero recurring card lock)', ok: true },
      { text: '14 production endpoints (Seat Availability, Vacant Berths, Fares)', ok: true },
      { text: 'Credits never expire & only deduct on 200 OK responses', ok: true },
    ],
    summary: 'Production-ready, sub-10ms railway infrastructure with 97% lower cost.'
  }
];

const FAQS = [
  {
    q: 'Why does official Indian Railways (CRIS) API access cost ₹50 Lakhs?',
    a: 'CRIS and IRCTC maintain high institutional barriers to protect core reservation mainframes from unauthorized ticketing botnets. Direct enterprise B2B integration requires a ₹50 Lakh bank guarantee, audited corporate infrastructure, and lengthy legal clearances, making it strictly viable only for large OTAs like MakeMyTrip, ConfirmTKT, and Paytm.'
  },
  {
    q: 'How does irctc.dev provide 100,000 requests for just ₹99?',
    a: 'By indexing all 10,647 trains and 8,500+ station routes in-memory in RAM, 95% of queries execute in sub-10 milliseconds without making expensive outbound network requests or running heavy headless Chrome browsers. This drastic efficiency allows us to pass 97% cost savings directly to developers.'
  },
  {
    q: 'Do credits purchased on irctc.dev ever expire?',
    a: 'No. Unlike RapidAPI which wipes out your unutilized monthly quotas at the end of every 30 days, credits on irctc.dev never expire. Furthermore, credits are only deducted on successful 200 OK API responses.'
  },
  {
    q: 'Can I test the API before spending any money?',
    a: 'Yes! Every developer receives 10,000 free API credits immediately upon 1-click Google OAuth sign-in. Zero credit card or payment details are required.'
  }
];

export default function PricingComparison() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

      {/* Header */}
      <div className="max-w-4xl w-full text-center mb-12 sm:mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-mono font-medium mb-6">
          <CreditCard size={14} />
          <span>TRANSPARENCY REPORT // 2026 PRICING BREAKDOWN</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-textMain mb-6 leading-[1.1]">
          Indian Railways API Pricing: <span className="text-brand">From ₹50 Lakhs to ₹99</span>
        </h1>

        <p className="text-textMuted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          The reality check: A complete economic and technical breakdown comparing official CRIS enterprise contracts, RapidAPI monthly credit card locks, self-hosted scrapers, and irctc.dev.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand hover:bg-brand/90 text-white font-semibold text-sm transition-all shadow-lg shadow-brand/25"
          >
            Claim 10,000 Free Credits <ArrowRight size={15} />
          </Link>
          <Link
            to="/alternatives/rapidapi-indian-railway-api"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-textMain border border-borderRoot font-medium text-sm transition-colors"
          >
            RapidAPI Migration Guide
          </Link>
        </div>
      </div>

      {/* 4 Pricing Architecture Tiers */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 sm:mb-24 relative z-10">
        {PRICING_TIERS.map((tier, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-6 flex flex-col justify-between border transition-all ${
              tier.highlight
                ? 'bg-gradient-to-b from-brand/10 to-transparent border-brand/40 shadow-2xl shadow-brand/10 ring-1 ring-brand/30'
                : 'bg-[#0a0a0c]/80 border-white/10 hover:border-white/20'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${tier.badgeColor}`}>
                  {tier.badge}
                </span>
              </div>

              <h3 className="text-base font-bold text-textMain mb-1">{tier.name}</h3>
              <p className="text-xs text-textMuted leading-relaxed mb-4">{tier.description}</p>

              <div className="pb-4 mb-4 border-b border-white/10">
                <div className="text-2xl font-bold font-mono text-white">{tier.price}</div>
                <div className="text-[11px] text-textMuted">{tier.billingPeriod}</div>
              </div>

              <div className="space-y-2 mb-6">
                {tier.features.map((f, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2 text-xs">
                    {f.ok ? (
                      <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <X size={14} className="text-red-400 shrink-0 mt-0.5" />
                    )}
                    <span className={f.ok ? 'text-zinc-200' : 'text-zinc-400'}>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-textMuted pt-4 border-t border-white/10 italic">
              {tier.summary}
            </p>
          </div>
        ))}
      </div>

      {/* The 4 Hard Realities of Railway Tech */}
      <div className="max-w-4xl w-full mb-16 sm:mb-24 relative z-10 bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-10">
        <h2 className="text-xl sm:text-2xl font-bold text-textMain mb-6 text-center">
          Why We Built irctc.dev: The Developer Dilemma
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-textMuted leading-relaxed">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Building2 size={16} className="text-brand" /> 1. The ₹50 Lakh Institutional Lock
            </h4>
            <p>
              CRIS enterprise access requires high net-worth incorporation, audited security policies, and ₹50L bank guarantees. If you are an engineering student building a portfolio, an indie hacker testing an idea, or a startup in seed stage, you are locked out of official channels.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Globe2 size={16} className="text-red-400" /> 2. The RapidAPI USD Trap
            </h4>
            <p>
              Marketplaces like RapidAPI force Indian developers to bill in US Dollars with recurring monthly credit card commitments. A $35 tier costs ₹3,500+ after factoring in 18% GST and bank forex markup, even if you only make 10 test calls.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Terminal size={16} className="text-amber-400" /> 3. Fragile GitHub Scrapers
            </h4>
            <p>
              95% of open-source Indian Railways scrapers on GitHub die within 2 weeks because CRIS, NTES, and booking portals update captcha algorithms, session tokens, and Akamai Bot Manager rules continuously.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" /> 4. The 10ms Rail Engine Solution
            </h4>
            <p>
              We converted deep-tech reverse-engineering learnings into an in-memory rail engine: 10,647 trains in RAM, zero-dependency Node.js OCR solving CRIS captchas in &lt;0.1ms, and ₹99 pay-as-you-go micro-topups via native UPI.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl w-full mb-16 sm:mb-24 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-textMain tracking-tight text-center mb-8">
          Frequently Asked Questions
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

      {/* Bottom Conversion Callout */}
      <div className="max-w-4xl w-full text-center bg-gradient-to-b from-brand/10 to-transparent border border-brand/20 rounded-3xl p-8 sm:p-12 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-textMain mb-3 tracking-tight">
          Start Building with 10,000 Free Credits
        </h2>
        <p className="text-xs sm:text-sm text-textMuted max-w-md mx-auto mb-6 leading-relaxed">
          Zero credit card required. 1-click Google OAuth setup. Test live authenticated queries in under 60 seconds.
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
