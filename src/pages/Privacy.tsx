import { useState, useEffect } from 'react';
import { Mail, ArrowUp, List, ChevronDown, X } from 'lucide-react';

const sections = [
  { id: 'section-1', num: '01', title: 'Introduction' },
  { id: 'section-2', num: '02', title: 'Information We Collect' },
  { id: 'section-3', num: '03', title: 'Usage Logs' },
  { id: 'section-4', num: '04', title: 'How We Use Information' },
  { id: 'section-5', num: '05', title: 'Security Monitoring' },
  { id: 'section-6', num: '06', title: 'Data Sharing' },
  { id: 'section-7', num: '07', title: 'Data Retention' },
  { id: 'section-8', num: '08', title: 'Cookies' },
  { id: 'section-9', num: '09', title: 'Data Security' },
  { id: 'section-10', num: '10', title: 'Third-Party Services' },
  { id: 'section-11', num: '11', title: 'Policy Updates' },
  { id: 'section-12', num: '12', title: 'Questions about this Policy?' },
];

const Privacy = () => {
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
      {/* Header */}
      <header className="relative border-b border-white/10 px-4 sm:px-6 pt-12 sm:pt-24 md:pt-28 pb-8 sm:pb-16 md:pb-20">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-12">
          <div>
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-8">
              <div className="h-px w-6 sm:w-8 bg-white/30"></div>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-white/50">Legal</p>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[9rem] font-light tracking-tighter text-white leading-[0.95] break-words">
              Privacy<br className="hidden sm:inline" /> Policy
            </h1>
          </div>
          <div className="md:text-right max-w-sm pt-2 sm:pt-0 border-t border-white/5 md:border-none">
            <p className="text-xs sm:text-[15px] font-light leading-relaxed text-white/60">
              How IRCTC API collects, uses, and protects information when you use our website and APIs. Last updated {new Date('2 June 2026').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.
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
            Privacy Policy
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
                  <span>Introduction</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">This Privacy Policy describes how IRCTC API handles your information.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">It applies to our website, APIs, dashboard, and Node.js SDK.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">By using the Service, you agree to the practices described here.</li>
                  </ul>
                </div>
              </article>

              <article id="section-2" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    02
                  </span>
                  <span>Information We Collect</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Name and email address.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Account information.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">API usage statistics.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IP addresses and device information.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Browser and operating system details.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Payment transaction metadata.</li>
                  </ul>
                </div>
              </article>

              <article id="section-3" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    03
                  </span>
                  <span>Usage Logs</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API records API requests, response metrics, and timestamps.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">We log IP addresses and other operational metadata for security and reliability.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Logs are used to detect abuse, debug issues, and improve the Service.</li>
                  </ul>
                </div>
              </article>

              <article id="section-4" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    04
                  </span>
                  <span>How We Use Information</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Provide and maintain services.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Authenticate users.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Monitor API usage.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Enforce rate limits.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Prevent abuse and fraud.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Process payments.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Communicate service updates.</li>
                  </ul>
                </div>
              </article>

              <article id="section-5" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    05
                  </span>
                  <span>Security Monitoring</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">We analyze account activity, request patterns, and IP addresses.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Usage behavior is reviewed to detect suspicious activity and enforce platform security.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Monitoring helps protect both users and the platform from abuse.</li>
                  </ul>
                </div>
              </article>

              <article id="section-6" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    06
                  </span>
                  <span>Data Sharing</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">We do not sell personal information.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Data may be shared with payment processors.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">We may also share data with legal authorities when required by law.</li>
                  </ul>
                </div>
              </article>

              <article id="section-7" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    07
                  </span>
                  <span>Data Retention</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Information may be retained as long as necessary for operational purposes.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">We retain data for security, legal, and business needs.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">You may request deletion of your account data, subject to legal obligations.</li>
                  </ul>
                </div>
              </article>

              <article id="section-8" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    08
                  </span>
                  <span>Cookies</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Cookies and similar technologies may be used to improve user experience.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">They help the website function correctly and remember preferences.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">You can control cookies through your browser settings.</li>
                  </ul>
                </div>
              </article>

              <article id="section-9" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    09
                  </span>
                  <span>Data Security</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Reasonable security measures are implemented to protect stored information.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Encryption, access controls, and monitoring are part of our security stack.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">No system can guarantee absolute security.</li>
                  </ul>
                </div>
              </article>

              <article id="section-10" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    10
                  </span>
                  <span>Third-Party Services</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">IRCTC API may integrate with third-party services.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Each provider follows its own privacy practices.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">We are not responsible for the privacy practices of external providers.</li>
                  </ul>
                </div>
              </article>

              <article id="section-11" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px]">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    11
                  </span>
                  <span>Policy Updates</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <ul className="flex flex-col gap-4 sm:gap-5 pl-0">
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">This Privacy Policy may be updated periodically.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Updates will be reflected by revising the 'lastUpdated' value.</li>
                    <li className="relative pl-6 sm:pl-8 leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:content-['—'] before:text-white/30">Continued use of the service constitutes acceptance of any updates.</li>
                  </ul>
                </div>
              </article>

              <article id="section-12" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-[100px] mt-4 border-t border-white/10 pt-10">
                <h2 className="mb-6 sm:mb-8 flex items-baseline gap-3.5 sm:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-mono text-xs sm:text-sm font-medium tracking-widest text-white/30 shrink-0 select-none">
                    12
                  </span>
                  <span>Questions about this Policy?</span>
                </h2>
                <div className="max-w-[65ch] text-[15px] sm:text-base md:text-[17px] font-light leading-relaxed md:leading-loose text-white/70">
                  <p className="mb-4">Reach out and we will get back to you.</p>
                  <p>
                    <a
                      href="mailto:support@irctc.dev"
                      className="inline-flex items-center gap-2.5 px-3 py-2 -ml-3 rounded-lg border border-transparent hover:border-white/15 bg-white/5 hover:bg-white/10 text-sm font-medium text-white transition-all min-h-[44px]"
                    >
                      <Mail className="h-4 w-4 text-white/70" />
                      support@irctc.dev
                    </a>
                  </p>
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

export default Privacy;
