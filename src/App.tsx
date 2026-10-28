import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, LayoutDashboard, Zap, BookOpen, ShieldCheck } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ApiPlayground from './pages/ApiPlayground';
import Docs from './pages/Docs';
import FeatureLanding from './pages/FeatureLanding';
import GuidesIndex from './pages/GuidesIndex';
import GuideDetail from './pages/GuideDetail';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import CliAuth from './pages/CliAuth';
import RapidApiAlternative from './pages/RapidApiAlternative';
import EmbedWidget from './pages/EmbedWidget';
import PricingComparison from './pages/PricingComparison';
import AdminPortal from './pages/admin/AdminPortal';
import { AdminRoute } from './components/AdminRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ErrorBoundary } from './ErrorBoundary';
import { Toaster } from 'sonner';
import { ROUTE_META } from './data/routeMeta';

const CURRENT_YEAR = new Date().getFullYear();

function RouteHeadManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // 1. Dynamic Head Title & Meta Description update per route
    const meta = ROUTE_META[pathname] || {
      title: 'IRCTC API — Sub-Millisecond Indian Railways Infrastructure',
      desc: 'High-performance developer platform and REST API gateway for Indian Railways.',
    };

    document.title = meta.title;

    let descEl = document.querySelector('meta[name="description"]');
    if (descEl) {
      descEl.setAttribute('content', meta.desc);
    }

    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) {
      canonicalEl.setAttribute('href', `https://irctc.dev${pathname === '/' ? '/' : pathname}`);
    }

    // 2. Scroll to top or anchor hash
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function Navigation() {
  const location = useLocation();
  const { user } = useAuth();
  const navItems = [
    {
      path: '/',
      icon: <Zap size={14} className="sm:w-[17px] sm:h-[17px] shrink-0" />,
      label: 'Engine',
      renderMobile: 'Engine'
    },
    {
      path: '/dashboard',
      icon: <LayoutDashboard size={14} className="sm:w-[17px] sm:h-[17px] shrink-0" />,
      label: 'Dashboard',
      renderMobile: (
        <>Dash<span className="hidden min-[420px]:inline">board</span></>
      )
    },
    {
      path: '/playground',
      icon: <Terminal size={14} className="sm:w-[17px] sm:h-[17px] shrink-0" />,
      label: 'API Playground',
      renderMobile: (
        <>Play<span className="hidden min-[420px]:inline">ground</span></>
      )
    },
    {
      path: '/docs',
      icon: <BookOpen size={14} className="sm:w-[17px] sm:h-[17px] shrink-0" />,
      label: 'Docs',
      renderMobile: 'Docs'
    },
  ];

  if (user?.role === 'admin') {
    navItems.push({
      path: '/admin',
      icon: <ShieldCheck size={14} className="sm:w-[17px] sm:h-[17px] shrink-0 text-amber-400" />,
      label: 'Admin',
      renderMobile: 'Admin',
    });
  }

  return (
    <nav className="fixed top-0 inset-x-0 w-full flex justify-center z-50 pt-[max(0.75rem,env(safe-area-inset-top))] px-1 sm:px-4 pb-8 bg-gradient-to-b from-[#050505] via-[#050505]/95 to-transparent pointer-events-none">
      <div className="bg-[#121212]/95 backdrop-blur-2xl border border-white/10 rounded-full p-1 sm:p-1.5 flex items-center justify-center gap-0.5 min-[380px]:gap-1 sm:gap-2 pointer-events-auto shadow-2xl shrink-0 max-w-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-2 min-[380px]:px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] min-[380px]:text-xs sm:text-[13px] font-medium transition-all flex items-center gap-1 sm:gap-1.5 rounded-full shrink-0 active:scale-[0.96] ${
                isActive ? 'text-white' : 'text-textMuted hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white/10 rounded-full border border-white/5"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1 sm:gap-1.5">
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
                <span className="inline sm:hidden">{item.renderMobile}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function NotFound() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-24 sm:py-32 flex flex-col items-center text-center">
      <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-xs mb-6">
        HTTP 404 // NOT_FOUND
      </div>
      <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-textMain mb-4">
        Endpoint Not Found
      </h1>
      <p className="text-sm sm:text-base text-textMuted max-w-lg mb-8 leading-relaxed">
        The requested path or Indian Railways resource does not exist or has moved. Return to the home dashboard or explore our API reference.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-brand text-white font-medium text-xs hover:bg-brand/90 transition-colors shadow-lg shadow-brand/20"
        >
          ← Return to Homepage
        </Link>
        <Link
          to="/docs"
          className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-textMain font-medium text-xs transition-colors"
        >
          Explore API Documentation
        </Link>
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/playground" element={<ApiPlayground />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/pnr-status-api" element={<FeatureLanding slug="pnr-status-api" />} />
        <Route path="/irctc-seats-availability-api" element={<FeatureLanding slug="irctc-seats-availability-api" />} />
        <Route path="/chart-vacant-berths-api" element={<FeatureLanding slug="chart-vacant-berths-api" />} />
        <Route path="/live-train-status-api" element={<FeatureLanding slug="live-train-status-api" />} />
        <Route path="/trains-between-stations-api" element={<FeatureLanding slug="trains-between-stations-api" />} />
        <Route path="/train-fare-api" element={<FeatureLanding slug="train-fare-api" />} />
        <Route path="/train-schedule-api" element={<FeatureLanding slug="train-schedule-api" />} />
        <Route path="/guides" element={<GuidesIndex />} />
        <Route path="/guides/:slug" element={<GuideDetail />} />
        <Route path="/admin/*" element={<AdminRoute><AdminPortal /></AdminRoute>} />
        <Route path="/cli-auth" element={<CliAuth />} />
        <Route path="/alternatives/rapidapi-indian-railway-api" element={<RapidApiAlternative />} />
        <Route path="/rapidapi-alternative" element={<RapidApiAlternative />} />
        <Route path="/alternatives/railway-api-pricing-comparison" element={<PricingComparison />} />
        <Route path="/pricing-comparison" element={<PricingComparison />} />
        <Route path="/tools/clean-pnr-checker" element={<FeatureLanding slug="pnr-status-api" />} />
        <Route path="/tools/live-station-radar" element={<FeatureLanding slug="live-train-status-api" />} />
        <Route path="/tools/train-fare-calculator" element={<FeatureLanding slug="train-fare-api" />} />
        <Route path="/embed/:type" element={<EmbedWidget />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export function AppShell() {
  const location = useLocation();
  const isEmbed = location.pathname.startsWith('/embed');
  const hideFooter =
    isEmbed ||
    location.pathname === '/dashboard' ||
    location.pathname === '/playground' ||
    location.pathname === '/cli-auth' ||
    location.pathname.startsWith('/admin');

  return (
    <>
      <RouteHeadManager />
      {!isEmbed && <Toaster theme="dark" position="bottom-right" />}
      {!isEmbed && <Navigation />}
      <div className={`min-h-[100dvh] bg-base text-textMain selection:bg-brand selection:text-white flex flex-col font-sans ${isEmbed ? 'p-0 bg-transparent min-h-0' : ''}`}>
        <main className={`flex-1 flex flex-col ${isEmbed ? 'p-0 pt-0' : hideFooter ? 'pt-16 sm:pt-24 pb-4' : 'pt-16 sm:pt-24 pb-8 sm:pb-4'}`}>
          <ErrorBoundary><AnimatedRoutes /></ErrorBoundary>
        </main>
        {!hideFooter && (
          <footer className="mt-auto border-t border-borderRoot bg-surface/30 px-4 py-8 sm:px-6 md:px-12 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-xs text-textMuted">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
              <div className="flex flex-col gap-1 pb-6 border-b border-borderSubtle/60">
                <span className="text-sm font-semibold text-textMain tracking-tight">IRCTC API Platform</span>
                <p className="text-[11px] text-textMuted max-w-xl">
                  Developer APIs and telemetry infrastructure for live Indian Railways data.
                </p>
              </div>

              {/* Core APIs Crawl Network */}
              <div className="flex flex-wrap items-center gap-x-5 sm:gap-x-7 gap-y-2 py-1 text-[11px] font-mono">
                <Link to="/pnr-status-api" className="hover:text-textMain transition-colors">/pnr-status</Link>
                <Link to="/irctc-seats-availability-api" className="hover:text-textMain transition-colors">/seat-availability</Link>
                <Link to="/chart-vacant-berths-api" className="hover:text-textMain transition-colors">/chart-vacant</Link>
                <Link to="/live-train-status-api" className="hover:text-textMain transition-colors">/live-train-status</Link>
                <Link to="/trains-between-stations-api" className="hover:text-textMain transition-colors">/trains-between-stations</Link>
                <Link to="/train-fare-api" className="hover:text-textMain transition-colors">/train-fare</Link>
                <Link to="/train-schedule-api" className="hover:text-textMain transition-colors">/train-schedule</Link>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-borderSubtle/60 text-[11px]">
                <p>© {CURRENT_YEAR} IRCTC API.</p>
                <div className="flex items-center flex-wrap justify-center gap-x-3 sm:gap-x-4 gap-y-1.5 font-medium">
                  <Link to="/docs" className="hover:text-textMain transition-colors">Docs</Link>
                  <span className="text-white/20 select-none">•</span>
                  <Link to="/guides" className="hover:text-textMain transition-colors">Guides</Link>
                  <span className="text-white/20 select-none">•</span>
                  <Link to="/alternatives/rapidapi-indian-railway-api" className="hover:text-textMain transition-colors">RapidAPI Alternative</Link>
                  <span className="text-white/20 select-none">•</span>
                  <a href="https://github.com/Manj620026" target="_blank" rel="noreferrer" className="hover:text-textMain transition-colors">GitHub</a>
                  <span className="text-white/20 select-none">•</span>
                  <Link to="/terms" className="hover:text-textMain transition-colors">Terms</Link>
                  <span className="text-white/20 select-none">•</span>
                  <Link to="/privacy" className="hover:text-textMain transition-colors">Privacy</Link>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppShell />
      </Router>
    </AuthProvider>
  );
}
