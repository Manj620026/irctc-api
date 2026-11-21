import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  ArrowRight,
  Search,
  Layers,
  Rss
} from 'lucide-react';
import { GUIDES_DATA } from '../data/guidesData';

const CATEGORIES = ['All', 'Bots & Messaging', 'Alerts & Automation', 'Developer Guides'];

export default function GuidesIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const selectedCategory = categoryParam && CATEGORIES.includes(categoryParam) ? categoryParam : 'All';
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleCategorySelect = (cat: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams, { replace: true });
  };

  const guides = Object.values(GUIDES_DATA);

  const filteredGuides = guides.filter((guide) => {
    const matchesCategory =
      selectedCategory === 'All' || guide.category === selectedCategory;
    const matchesSearch =
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.techStack.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* JSON-LD Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'CollectionPage',
                '@id': 'https://irctc.dev/guides/#webpage',
                url: 'https://irctc.dev/guides',
                name: 'IRCTC API Developer Guides & Practical Tutorials',
                description: 'Production-grade walkthroughs, zero-copy-paste-bugs code, and runnable blueprints for WhatsApp bots, Telegram vacancy alerts, and automated PNR verifications.',
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
                    name: 'Guides',
                    item: 'https://irctc.dev/guides'
                  }
                ]
              },
              {
                '@type': 'ItemList',
                numberOfItems: guides.length,
                itemListElement: guides.map((g, idx) => ({
                  '@type': 'ListItem',
                  position: idx + 1,
                  url: `https://irctc.dev/guides/${g.slug}`,
                  name: g.title
                }))
              }
            ]
          })
        }}
      />

      {/* Hero Header */}
      <div className="relative mb-12 sm:mb-16">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-brand shadow-sm">
              <BookOpen size={13} className="text-brand" />
              <span>Developer Guides &amp; Practical Tutorials</span>
            </div>

            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/25 text-orange-400 text-xs font-mono transition-colors shadow-sm"
              title="Subscribe to IRCTC API Guides RSS Feed"
            >
              <Rss size={12} />
              <span>RSS Feed</span>
            </a>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-textMain mb-4 leading-tight">
            Build Real Railway Apps in <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-brand to-amber-300">Minutes</span>
          </h1>

          <p className="text-sm sm:text-base text-textMuted leading-relaxed max-w-2xl">
            Production-grade walkthroughs, zero-copy-paste-bugs code, and runnable blueprints for WhatsApp bots, Telegram vacancy alerts, and automated PNR verifications.
          </p>

          {/* Search & Filter Bar */}
          <div className="w-full max-w-xl mt-8 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted" />
              <input
                type="text"
                placeholder="Search guides, tech stack, or commands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface/50 border border-white/[0.08] text-sm text-textMain placeholder:text-textMuted/60 focus:outline-none focus:border-brand/50 transition-colors"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-brand text-white shadow-sm'
                      : 'bg-white/[0.03] text-textMuted hover:text-textMain hover:bg-white/[0.06] border border-white/[0.05]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {filteredGuides.map((guide) => (
          <Link
            key={guide.slug}
            to={`/guides/${guide.slug}`}
            className="group relative flex flex-col justify-between p-6 rounded-2xl bg-surface/40 hover:bg-surface/70 border border-white/[0.08] hover:border-brand/30 transition-all duration-300 shadow-lg hover:shadow-brand/5 hover:-translate-y-1"
          >
            <div>
              {/* Card Meta Badges */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.06] text-[11px] font-mono text-brand font-medium">
                  {guide.category}
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-textMuted font-mono">
                  <Clock size={12} />
                  <span>{guide.readingTime}</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-lg font-bold text-textMain group-hover:text-brand transition-colors mb-2.5 leading-snug">
                {guide.h1}
              </h2>

              <p className="text-xs text-textMuted line-clamp-3 mb-6 leading-relaxed">
                {guide.subtitle}
              </p>
            </div>

            <div>
              {/* Tech Stack Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-white/[0.06] mb-4">
                {guide.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.03] border border-white/[0.04] text-textMuted"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Footer CTA */}
              <div className="flex items-center justify-between text-xs font-medium text-brand">
                <span>Read Tutorial</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Zero Results State */}
      {filteredGuides.length === 0 && (
        <div className="text-center py-16 px-4 rounded-2xl border border-white/[0.08] bg-surface/20 max-w-lg mx-auto mb-16">
          <Layers size={32} className="mx-auto text-textMuted/60 mb-3" />
          <h3 className="text-sm font-semibold text-textMain mb-1">No matching guides found</h3>
          <p className="text-xs text-textMuted mb-4">Try adjusting your search query or switching categories.</p>
          <button
            onClick={() => {
              handleCategorySelect('All');
              setSearchQuery('');
            }}
            className="px-3.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-textMain transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Quickstart Banner / Terminal Callout */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-r from-surface/80 via-surface/40 to-surface/80 p-8 sm:p-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-mono uppercase tracking-wider text-brand font-semibold mb-2 block">
              TypeScript Client SDK
            </span>
            <h3 className="text-xl font-bold text-textMain mb-2">
              Ready to build? Install the zero-dependency SDK
            </h3>
            <p className="text-xs sm:text-sm text-textMuted leading-relaxed">
              Access all 14 Indian Railways endpoints with complete TypeScript autocompletion, retries, and sub-100ms response caching.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="w-full sm:w-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-slate-300">
              <span className="text-brand">$</span>
              <span>npm install irctc-api</span>
            </div>
            <Link
              to="/docs"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-brand hover:bg-brand/90 text-white font-medium text-xs text-center transition-colors shadow-lg shadow-brand/20 shrink-0"
            >
              Explore API Reference →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
