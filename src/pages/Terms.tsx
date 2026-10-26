import { useState, useEffect } from 'react';
import { ArrowUp, List, ChevronDown, X } from 'lucide-react';

const sections = [
  { id: 'section-1', num: '01', title: 'Acceptance of Terms' },
  { id: 'section-2', num: '02', title: 'Independent Service Disclaimer' },
  { id: 'section-3', num: '03', title: 'Service Description' },
  { id: 'section-4', num: '04', title: 'API License' },
  { id: 'section-5', num: '05', title: 'API Key Security' },
  { id: 'section-6', num: '06', title: 'Commercial Usage' },
  { id: 'section-7', num: '07', title: 'Prohibited Uses' },
  { id: 'section-8', num: '08', title: 'Data Usage and Storage Restrictions' },
  { id: 'section-9', num: '09', title: 'Acceptable Use of Data' },
  { id: 'section-10', num: '10', title: 'Rate Limits and Fair Usage' },
  { id: 'section-11', num: '11', title: 'Subscription Plans & Request Packs' },
  { id: 'section-12', num: '12', title: 'Security and Suspicious Activity' },
  { id: 'section-13', num: '13', title: 'Account Suspension and Termination' },
  { id: 'section-14', num: '14', title: 'Payments and Refunds' },
  { id: 'section-15', num: '15', title: 'Third-Party Data Sources' },
  { id: 'section-16', num: '16', title: 'Service Availability' },
  { id: 'section-17', num: '17', title: 'Business Dependency Disclaimer' },
  { id: 'section-18', num: '18', title: 'Service Modifications and Discontinuation' },
  { id: 'section-19', num: '19', title: 'Intellectual Property' },
  { id: 'section-20', num: '20', title: 'Disclaimer of Warranties' },
  { id: 'section-21', num: '21', title: 'Limitation of Liability' },
  { id: 'section-22', num: '22', title: 'Indemnification' },
  { id: 'section-23', num: '23', title: 'No Agency Relationship' },
  { id: 'section-24', num: '24', title: 'Changes to Terms' },
  { id: 'section-25', num: '25', title: 'Governing Law' },
];

const Terms = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-white selection:text-black pb-16 sm:pb-24 md:pb-32">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebPage',
                '@id': 'https://irctc.dev/terms/#webpage',
                url: 'https://irctc.dev/terms',
                name: 'Commercial Terms of Service & API Agreement — IRCTC API',
                description: 'Official commercial terms of service, API license, usage guidelines, rate limits, and liability disclaimers for the IRCTC API platform.',
                isPartOf: {
                  '@id': 'https://irctc.dev/#website'
                },
                about: {
                  '@id': 'https://irctc.dev/#webapi'
                },
                inLanguage: 'en-IN'
              },
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://irctc.dev'
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Terms & Conditions',
                    item: 'https://irctc.dev/terms'
                  }
                ]
              }
            ]
          })
        }}
      />

      {/* Header */}
      <header className="relative border-b border-white/10 px-4 sm:px-6 pt-12 sm:pt-24 md:pt-28 pb-8 sm:pb-16 md:pb-20">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-12">
          <div>
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-8">
              <div className="h-px w-6 sm:w-8 bg-white/30"></div>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-white/50">Legal</p>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[9rem] font-light tracking-tighter text-white leading-[0.95] break-words">
              Terms &<br className="hidden sm:inline" /> Conditions
            </h1>
          </div>
          <div className="md:text-right max-w-sm pt-2 sm:pt-0 border-t border-white/5 md:border-none">
            <p className="text-xs sm:text-[15px] font-light leading-relaxed text-white/60">
              The agreement that governs your use of IRCTC API. Last updated {new Date('16 October 2026').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="px-4 sm:px-6 py-8 sm:py-16 md:py-24 max-w-7xl mx-auto">
        {/* Mobile Sticky Quick Jump Bar */}
        <div className="md:hidden sticky top-14 sm:top-16 z-30 mb-8 -mx-4 px-4 py-2 bg-[#050505]/90 backdrop-blur-xl border-y border-white/10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-xs font-mono text-white/80 transition-all"
          >
            <List className="h-3.5 w-3.5 text-white/60" />
            <span>Index</span>
            <span className="text-[10px] text-white/40">({sections.length})</span>
            <ChevronDown className="h-3 w-3 text-white/40" />
          </button>
          <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
            Terms of Service
          </span>
        </div>

        {/* Mobile Table of Contents Bottom Sheet Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
            <div className="bg-[#0b0b0b] border-t border-white/15 rounded-t-2xl max-h-[75vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-250">
              <div className="sticky top-0 bg-[#0b0b0b]/95 backdrop-blur-md px-5 py-3.5 border-b border-white/10 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-2.5">
                  <List className="h-4 w-4 text-white/70" />
                  <span className="font-mono text-xs font-medium uppercase tracking-wider text-white">Table of Contents</span>
                  <span className="text-[11px] font-mono text-white/40">({sections.length})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                  aria-label="Close index"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="overflow-y-auto p-3 space-y-1">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-baseline gap-3 py-2.5 px-3 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors"
                  >
                    <span className="font-mono text-xs text-white/30 shrink-0">{sec.num}</span>
                    <span className="font-light tracking-wide">{sec.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-[280px_1fr] lg:gap-32">
            {/* Desktop Sidebar Navigation */}
            <aside className="md:sticky md:top-32 md:self-start hidden md:block">
              <div className="mb-8 flex items-center gap-3">
                <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white/60">Index</p>
              </div>
              <ul className="flex flex-col gap-3 border-l border-white/10 pl-5">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block text-[13px] tracking-wide font-light text-white/50 transition-all hover:text-white hover:translate-x-1"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Main Content */}
            <div className="flex min-w-0 flex-col gap-12 sm:gap-20 md:gap-32 md:pt-4">
              <article id="section-1" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    01
                  </span>
                  <span>Acceptance of Terms</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">By accessing, purchasing, or using IRCTC API, you agree to be bound by these Terms and Conditions.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">If you do not agree with any part of these Terms, you must immediately discontinue use of the Service.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Continued use of IRCTC API following any modification of these Terms constitutes acceptance of the revised Terms.</li>
                  </ul>
                </div>
              </article>

              <article id="section-2" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    02
                  </span>
                  <span>Independent Service Disclaimer</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API is an independent developer platform.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API is not affiliated with, endorsed by, authorized by, sponsored by, or officially connected with Indian Railways, IRCTC, CRIS, the Government of India, or any railway authority.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API is not an official source of railway information.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Users must independently verify information before relying upon it for operational, financial, legal, regulatory, commercial, or customer-facing purposes.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Use of IRCTC API does not imply any relationship with or approval from any government organization.</li>
                  </ul>
                </div>
              </article>

              <article id="section-3" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    03
                  </span>
                  <span>Service Description</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API provides APIs, developer tools, and related services that aggregate, process, and present railway-related information in a developer-friendly format.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">The Service is intended primarily for developers, experimentation, learning, prototyping, and lightweight integrations.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Access to IRCTC API does not transfer ownership of any software, infrastructure, documentation, intellectual property, or service components.</li>
                  </ul>
                </div>
              </article>

              <article id="section-4" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    04
                  </span>
                  <span>API License</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API grants a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to access and use the Service.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">The license remains valid only while the user's account is active and compliant with these Terms.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">All rights not expressly granted are reserved by IRCTC API.</li>
                  </ul>
                </div>
              </article>

              <article id="section-5" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    05
                  </span>
                  <span>API Key Security</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">API keys are issued to individual accounts and must remain confidential.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Users may not share, transfer, lease, sell, sublicense, publish, or distribute API keys.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Users are solely responsible for all activity performed using their API keys.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Users must immediately notify IRCTC API of any suspected unauthorized access or compromise.</li>
                  </ul>
                </div>
              </article>

              <article id="section-6" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    06
                  </span>
                  <span>Commercial Usage</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Commercial usage is permitted only through an active paid subscription.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-react text-white/30">IRCTC API is an independent developer project and is not marketed as enterprise-grade infrastructure.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Businesses integrating IRCTC API do so entirely at their own risk.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API makes no guarantees regarding suitability for commercial operations, business continuity, compliance requirements, customer obligations, production workloads, or operational decision-making.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Users are solely responsible for determining whether IRCTC API is appropriate for their intended use.</li>
                  </ul>
                </div>
              </article>

              <article id="section-7" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    07
                  </span>
                  <span>Prohibited Uses</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Reselling API access, API responses, or any IRCTC API-derived service.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Redistributing IRCTC API data to third parties.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Providing IRCTC API responses through another API, platform, product, or service.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Creating a competing railway information service or API.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Building derivative products whose primary value is IRCTC API data.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Sharing API keys with customers, clients, partners, contractors, or other organizations.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Creating multiple accounts to bypass quotas, restrictions, pricing, or enforcement actions.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Attempting to circumvent authentication systems, security controls, quotas, or rate limits.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Reverse engineering, probing, testing, or attempting to discover internal implementation details.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Using IRCTC API for unlawful, fraudulent, deceptive, abusive, or unauthorized purposes.</li>
                  </ul>
                </div>
              </article>

              <article id="section-8" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    08
                  </span>
                  <span>Data Usage and Storage Restrictions</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Users may not create, maintain, replicate, enrich, archive, export, mirror, scrape, or distribute databases derived substantially from IRCTC API data.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Users may not use IRCTC API as a source for building permanent railway information repositories.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Users may not create historical datasets, commercial archives, analytics warehouses, or large-scale repositories derived primarily from IRCTC API data.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Long-term retention of IRCTC API data is prohibited except for temporary application functionality.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Temporary caching is permitted only to improve application performance and must not be used to avoid API usage.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Stored data may not be redistributed, resold, licensed, exposed through another service, or made publicly available.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API reserves sole discretion in determining whether a user's storage or caching practices violate these Terms.</li>
                  </ul>
                </div>
              </article>

              <article id="section-9" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    09
                  </span>
                  <span>Acceptable Use of Data</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API data may only be used within applications owned or operated by the subscribing user.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Users may not expose bulk data feeds, downloadable datasets, public APIs, exports, or derivative services primarily based on IRCTC API data.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Users may not use IRCTC API data to create competing platforms, marketplaces, aggregators, analytics products, or commercial data repositories.</li>
                  </ul>
                </div>
              </article>

              <article id="section-10" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    10
                  </span>
                  <span>Rate Limits and Fair Usage</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">All plans are subject to request limits, quotas, fair usage requirements, and technical restrictions.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Rate limits may be enforced per API key, account, IP address, application, organization, or other identifiers.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API may throttle, restrict, suspend, or terminate access where usage adversely affects service stability or violates fair usage policies.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Unused request quotas do not carry over unless explicitly stated.</li>
                  </ul>
                </div>
              </article>

              <article id="section-11" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    11
                  </span>
                  <span>Subscription Plans & Request Packs</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Legacy paid subscriptions remain valid under their original terms. New plans are available monthly or annually as shown at checkout.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">New annual plans are paid upfront for twelve (12) months; included request quota renews monthly during that term.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Request Packs are add-ons available only for an active paid subscription and are not standalone products.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Purchasing a Request Pack increases the API request quota available under the associated active paid subscription.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">A Request Pack purchase does not renew, extend, or otherwise modify the subscription's validity period.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">All unused requests from a Request Pack automatically expire when the associated paid subscription expires.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">When a paid subscription expires, the account reverts to the Free plan and all remaining Request Pack requests are permanently forfeited.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Purchasing a new subscription does not restore or carry forward Request Pack requests that expired with a previous subscription.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Users are responsible for ensuring that sufficient subscription validity remains before purchasing a Request Pack.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Request Pack purchases are non-refundable after successful payment, except where required by applicable law.</li>
                  </ul>
                </div>
              </article>

              <article id="section-12" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    12
                  </span>
                  <span>Security and Suspicious Activity</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API may monitor service activity for security, fraud prevention, abuse detection, compliance, and operational purposes.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Any suspicious, abusive, fraudulent, unauthorized, or potentially harmful activity may result in immediate restriction, suspension, or termination.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Examples include credential sharing, unusual request patterns, scraping, quota abuse, automated account creation, resale attempts, data harvesting, or security violations.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Users may be required to provide additional verification during investigations.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API reserves sole discretion in determining whether activity is suspicious or abusive.</li>
                  </ul>
                </div>
              </article>

              <article id="section-13" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    13
                  </span>
                  <span>Account Suspension and Termination</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API may suspend, restrict, disable, or terminate accounts without prior notice.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Violations involving resale, redistribution, key sharing, abuse, data extraction, suspicious activity, or breaches of these Terms may result in immediate termination.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">All licenses and access rights immediately cease upon termination.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Associated API keys, accounts, IP addresses, domains, applications, organizations, and related resources may also be blocked.</li>
                  </ul>
                </div>
              </article>

              <article id="section-14" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    14
                  </span>
                  <span>Payments and Refunds</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">All payments are final.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Subscriptions, credits, and usage fees are non-refundable unless required by applicable law.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Unused requests, quotas, or subscription periods are non-refundable.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">No refunds will be provided for suspensions or terminations resulting from violations of these Terms.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Users are responsible for evaluating the Service before purchasing a subscription.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Chargebacks, payment fraud, or abusive dispute activity may result in immediate account termination.</li>
                  </ul>
                </div>
              </article>

              <article id="section-15" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    15
                  </span>
                  <span>Third-Party Data Sources</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API may rely on third-party systems, publicly available information, external services, and infrastructure providers.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API does not control such third-party sources and cannot guarantee their availability, continuity, legality, accuracy, completeness, or future accessibility.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Changes made by third-party providers may affect IRCTC API without notice.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API is not responsible for inaccuracies, interruptions, delays, or failures resulting from third-party systems.</li>
                  </ul>
                </div>
              </article>

              <article id="section-16" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    16
                  </span>
                  <span>Service Availability</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API is provided on a best-effort basis.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">No service level agreement (SLA), uptime commitment, availability guarantee, reliability guarantee, or response-time guarantee is provided unless explicitly agreed in writing.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Maintenance, outages, upgrades, infrastructure failures, data source changes, technical issues, force majeure events, or third-party failures may affect service availability.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">The Service may become unavailable at any time without prior notice.</li>
                  </ul>
                </div>
              </article>

              <article id="section-17" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    17
                  </span>
                  <span>Business Dependency Disclaimer</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Users must not treat IRCTC API as their sole source of operationally critical railway information.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Users are responsible for maintaining backup systems, fallback providers, alternative solutions, and contingency plans where business continuity is important.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API shall not be responsible for losses arising from outages, service interruptions, reduced availability, data changes, or service discontinuation.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Users acknowledge that IRCTC API may be modified, restricted, suspended, or discontinued at any time.</li>
                  </ul>
                </div>
              </article>

              <article id="section-18" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    18
                  </span>
                  <span>Service Modifications and Discontinuation</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API reserves the right to modify, suspend, restrict, replace, remove, or discontinue any feature, endpoint, API version, pricing plan, subscription tier, or service component at any time.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API has no obligation to continue operating any part of the Service indefinitely.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">No compensation, migration assistance, replacement services, consulting services, source code access, technical support, or continued operation shall be owed following service modifications or discontinuation except where required by law.</li>
                  </ul>
                </div>
              </article>

              <article id="section-19" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    19
                  </span>
                  <span>Intellectual Property</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">All IRCTC API software, APIs, branding, documentation, infrastructure, website content, designs, logos, and platform components are protected by applicable intellectual property laws.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">No ownership rights are transferred through use of the Service.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Users may not copy, reproduce, distribute, modify, or create derivative works from IRCTC API except as expressly permitted.</li>
                  </ul>
                </div>
              </article>

              <article id="section-20" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    20
                  </span>
                  <span>Disclaimer of Warranties</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">The Service is provided on an 'AS IS' and 'AS AVAILABLE' basis.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API expressly disclaims all warranties, whether express, implied, statutory, or otherwise.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API does not guarantee accuracy, completeness, reliability, availability, suitability, performance, or fitness for any particular purpose.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Users assume all risks associated with use of the Service.</li>
                  </ul>
                </div>
              </article>

              <article id="section-21" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    21
                  </span>
                  <span>Limitation of Liability</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">To the maximum extent permitted by law, IRCTC API and its owner shall not be liable for any direct, indirect, incidental, consequential, special, exemplary, punitive, or economic damages.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">This includes loss of revenue, profits, business opportunities, customers, goodwill, data, contracts, operational capability, or business continuity.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API shall not be liable for decisions made based on information obtained through the Service.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">In all circumstances, IRCTC API's total aggregate liability shall not exceed the amount paid by the user to IRCTC API during the thirty (30) days preceding the event giving rise to the claim.</li>
                  </ul>
                </div>
              </article>

              <article id="section-22" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    22
                  </span>
                  <span>Indemnification</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Users agree to defend, indemnify, and hold harmless IRCTC API and its owner from any claims, liabilities, damages, losses, expenses, legal costs, or demands arising from their use of the Service, violation of these Terms, misuse of API data, or infringement of third-party rights.</li>
                  </ul>
                </div>
              </article>

              <article id="section-23" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    23
                  </span>
                  <span>No Agency Relationship</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Nothing in these Terms creates any partnership, joint venture, employment relationship, agency relationship, franchise relationship, or official representation between IRCTC API and any user.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Users may not represent themselves as official partners, distributors, agents, or representatives of IRCTC API.</li>
                  </ul>
                </div>
              </article>

              <article id="section-24" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    24
                  </span>
                  <span>Changes to Terms</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API may update these Terms at any time.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Changes become effective upon publication.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Continued use of the Service after publication constitutes acceptance of the revised Terms.</li>
                  </ul>
                </div>
              </article>

              <article id="section-25" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    25
                  </span>
                  <span>Governing Law</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">These Terms shall be governed by and construed in accordance with the laws of India.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Any disputes arising from or relating to the Service shall be subject to the exclusive jurisdiction of the courts located in West Bengal, India.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Mandatory consumer protection rights under applicable law shall remain unaffected where legally required.</li>
                  </ul>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Back-to-Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-5 z-40 flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#161616]/90 hover:bg-[#222]/90 active:scale-95 backdrop-blur-md border border-white/15 text-xs text-white shadow-2xl transition-all"
          aria-label="Back to top"
        >
          <ArrowUp className="h-3.5 w-3.5" />
          <span className="font-mono text-[11px] uppercase tracking-wider hidden xs:inline">Top</span>
        </button>
      )}
    </div>
  );
};

export default Terms;
