import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Clock,
  Calendar,
  Terminal,
  Copy,
  Check,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Cpu,
  CheckCircle2,
  Share2,
  FileCode,
  ExternalLink
} from 'lucide-react';
import { GUIDES_DATA } from '../data/guidesData';

interface GuideDetailProps {
  slug?: string;
}

export default function GuideDetail({ slug: propSlug }: GuideDetailProps) {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const activeSlug = propSlug || paramSlug;
  const guide = activeSlug ? GUIDES_DATA[activeSlug] : null;

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [fullCopied, setFullCopied] = useState<boolean>(false);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!guide) {
    return <Navigate to="/guides" replace />;
  }

  const handleCopy = (text: string, index: number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const handleCopyFullBlueprint = () => {
    const fullCode = guide.steps
      .filter((s) => s.codeSnippet)
      .map(
        (s) =>
          `// ==========================================\n// Step ${s.number}: ${s.title}\n// ${s.description}\n// ==========================================\n${s.codeSnippet}`
      )
      .join('\n\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullCode);
      setFullCopied(true);
      toast.success('Complete code blueprint copied to clipboard!');
      setTimeout(() => setFullCopied(false), 2000);
    }
  };

  const handleCopyGuideLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://irctc.dev/guides/${guide.slug}`);
      setLinkCopied(true);
      toast.success('Guide link copied to clipboard!');
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const allGuides = Object.values(GUIDES_DATA);
  const otherGuides = allGuides.filter((g) => g.slug !== guide.slug);

  // Render XSS-safe code snippet lines
  const renderCodeLines = (code: string) => {
    const lines = code.split('\n');
    return lines.map((line, i) => {
      const trimmed = line.trim();
      const isComment = trimmed.startsWith('//') || trimmed.startsWith('#');
      return (
        <div key={i} className="font-mono text-[12px] sm:text-[12.5px] leading-relaxed">
          {isComment ? (
            <span className="text-slate-500 whitespace-pre">{line || ' '}</span>
          ) : (
            <span className="text-slate-200 whitespace-pre">{line || ' '}</span>
          )}
        </div>
      );
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* JSON-LD Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'TechArticle',
                '@id': `https://irctc.dev/guides/${guide.slug}#article`,
                headline: guide.h1,
                description: guide.metaDescription,
                image: 'https://irctc.dev/og-image.png',
                datePublished: guide.publishedDate,
                dateModified: guide.updatedDate,
                mainEntityOfPage: {
                  '@type': 'WebPage',
                  '@id': `https://irctc.dev/guides/${guide.slug}`
                },
                author: {
                  '@type': 'Person',
                  name: guide.author.name,
                  jobTitle: guide.author.role
                },
                publisher: {
                  '@id': 'https://irctc.dev/#organization'
                },
                about: {
                  '@id': 'https://irctc.dev/#webapi'
                },
                keywords: guide.targetKeywords.join(', '),
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
                    name: 'Guides',
                    item: 'https://irctc.dev/guides'
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: guide.h1,
                    item: `https://irctc.dev/guides/${guide.slug}`
                  }
                ]
              },
              ...(guide.faqs && guide.faqs.length > 0
                ? [
                    {
                      '@type': 'FAQPage',
                      '@id': `https://irctc.dev/guides/${guide.slug}#faq`,
                      mainEntity: guide.faqs.map((faq) => ({
                        '@type': 'Question',
                        name: faq.question,
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: faq.answer
                        }
                      }))
                    }
                  ]
                : [])
            ]
          })
        }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-textMuted mb-6 font-mono">
        <Link to="/" className="hover:text-textMain transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link to="/guides" className="hover:text-textMain transition-colors">
          Guides
        </Link>
        <ChevronRight size={12} />
        <span className="text-brand truncate max-w-[200px] sm:max-w-none">{guide.category}</span>
      </nav>

      {/* Guide Header */}
      <header className="mb-10 sm:mb-12">
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <span className="px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-xs font-mono text-brand font-medium">
            {guide.category}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-textMuted">
            {guide.difficulty}
          </span>
          <div className="flex items-center gap-1 text-xs text-textMuted font-mono ml-auto">
            <Clock size={13} />
            <span>{guide.readingTime}</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-textMain mb-4 leading-tight">
          {guide.h1}
        </h1>

        <p className="text-sm sm:text-base text-textMuted leading-relaxed max-w-3xl mb-6">
          {guide.subtitle}
        </p>

        {/* Author & Meta Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/[0.08]">
          <div className="flex items-center gap-3">
            <img
              src={guide.author.avatarUrl}
              alt={guide.author.name}
              className="w-10 h-10 rounded-full object-cover border border-white/10"
            />
            <div>
              <div className="text-xs font-semibold text-textMain">{guide.author.name}</div>
              <div className="text-[11px] text-textMuted">{guide.author.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-textMuted font-mono">
            <Calendar size={13} />
            <span>Updated {guide.updatedDate}</span>
          </div>
        </div>

        {/* Action & Social Syndication Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 p-3 rounded-xl bg-surface/30 border border-white/[0.06]">
          <button
            onClick={handleCopyFullBlueprint}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-brand hover:bg-brand/90 text-white text-xs font-medium transition-all shadow-sm shadow-brand/20 cursor-pointer"
          >
            {fullCopied ? (
              <>
                <Check size={14} className="text-white" />
                <span>Blueprint Copied!</span>
              </>
            ) : (
              <>
                <FileCode size={14} />
                <span>Copy Full Blueprint</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyGuideLink}
              title="Copy Guide Link"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-textMuted hover:text-textMain text-xs transition-colors cursor-pointer"
            >
              {linkCopied ? (
                <>
                  <Check size={12} className="text-emerald-400" />
                  <span className="text-[11px] text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Share2 size={12} />
                  <span className="text-[11px]">Share</span>
                </>
              )}
            </button>

            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `${guide.title} — via @irctc_dev`
              )}&url=${encodeURIComponent(`https://irctc.dev/guides/${guide.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-textMuted hover:text-textMain text-[11px] transition-colors"
            >
              <span>X / Twitter</span>
              <ExternalLink size={10} />
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                `https://irctc.dev/guides/${guide.slug}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-textMuted hover:text-textMain text-[11px] transition-colors"
            >
              <span>LinkedIn</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </header>

      {/* Prerequisites & Architecture Blueprint */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-surface/40 border border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-textMain mb-3 uppercase tracking-wider">
            <CheckCircle2 size={15} className="text-brand" />
            <span>Prerequisites</span>
          </div>
          <ul className="space-y-2.5 text-xs text-textMuted">
            {guide.prerequisites.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-brand font-bold">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-surface/40 border border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-textMain mb-3 uppercase tracking-wider">
            <Cpu size={15} className="text-emerald-400" />
            <span>Architecture Flow</span>
          </div>
          <p className="text-xs text-textMuted leading-relaxed">
            {guide.architectureOverview}
          </p>
        </div>
      </div>

      {/* Step-by-Step Implementation */}
      <div className="space-y-10 mb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.08] pb-4 gap-3">
          <div className="flex items-center gap-2">
            <Terminal size={18} className="text-brand" />
            <h2 className="text-xl font-bold text-textMain">Implementation Steps</h2>
            <span className="text-xs font-mono text-textMuted ml-1">({guide.steps.length} Steps)</span>
          </div>

          {/* Quick Jump Step Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <span className="text-textMuted text-[11px] mr-1 hidden sm:inline">Jump:</span>
            {guide.steps.map((s) => (
              <a
                key={s.number}
                href={`#step-${s.number}`}
                className="px-2 py-1 rounded bg-white/[0.04] hover:bg-brand/20 hover:text-brand border border-white/[0.06] text-textMuted text-[11px] transition-colors"
              >
                #{s.number}
              </a>
            ))}
          </div>
        </div>

        {guide.steps.map((step, idx) => (
          <div
            key={step.number}
            id={`step-${step.number}`}
            className="p-6 sm:p-8 rounded-2xl bg-surface/30 border border-white/[0.08] relative scroll-mt-24"
          >
            {/* Step Header */}
            <div className="flex items-start gap-4 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-brand/10 border border-brand/20 text-brand font-mono text-sm font-bold shrink-0">
                {step.number}
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-textMain mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-textMuted leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Code Snippet Box */}
            {step.codeSnippet && (
              <div className="mt-4 rounded-xl overflow-hidden border border-white/[0.08] bg-[#0c0d10]">
                <div className="flex items-center justify-between px-4 py-2 bg-white/[0.03] border-b border-white/[0.06] text-xs font-mono text-textMuted">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <span>{step.language || 'code'}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(step.codeSnippet!, idx)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check size={12} className="text-emerald-400" />
                        <span className="text-[11px] text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span className="text-[11px]">Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 overflow-x-auto">
                  {renderCodeLines(step.codeSnippet)}
                </div>
              </div>
            )}

            {/* Step Notes / Pro Tip */}
            {step.notes && (
              <div className="mt-4 flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[11px] text-textMuted">
                <span className="text-amber-400 font-bold uppercase tracking-wider shrink-0">
                  Tip:
                </span>
                <span>{step.notes}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Interactive Gateway CTA */}
      <div className="p-6 sm:p-8 rounded-2xl border border-brand/30 bg-gradient-to-r from-brand/10 via-surface/40 to-surface/40 mb-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono text-brand uppercase tracking-wider font-semibold block mb-1">
            Production Endpoint
          </span>
          <h3 className="text-lg font-bold text-textMain mb-1">
            {guide.relatedEndpoint.name}
          </h3>
          <p className="text-xs text-textMuted">
            Test live queries and inspect sub-100ms response payloads directly in the browser sandbox.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <Link
            to={guide.relatedEndpoint.path}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-textMain text-xs font-medium text-center transition-colors"
          >
            {guide.relatedEndpoint.ctaLabel}
          </Link>
          <Link
            to="/playground"
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-brand hover:bg-brand/90 text-white text-xs font-medium text-center transition-colors shadow-lg shadow-brand/20"
          >
            Open Sandbox →
          </Link>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <h2 className="text-xl font-bold text-textMain mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {guide.faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="rounded-xl border border-white/[0.08] bg-surface/30 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-textMain hover:bg-white/[0.02] transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={16}
                    className={`text-textMuted transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 text-xs text-textMuted leading-relaxed border-t border-white/[0.04] pt-3"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* More Practical Guides */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-textMain">Related Tutorials</h2>
          <Link to="/guides" className="text-xs font-medium text-brand hover:underline">
            View All Guides →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {otherGuides.map((g) => (
            <Link
              key={g.slug}
              to={`/guides/${g.slug}`}
              className="p-5 rounded-xl bg-surface/30 hover:bg-surface/60 border border-white/[0.08] hover:border-brand/30 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-brand mb-2 block">{g.category}</span>
                <h3 className="text-sm font-bold text-textMain mb-2 leading-snug">{g.h1}</h3>
                <p className="text-xs text-textMuted line-clamp-2 mb-4">{g.subtitle}</p>
              </div>
              <div className="flex items-center justify-between text-xs font-medium text-brand">
                <span>Read Tutorial</span>
                <ArrowRight size={13} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
