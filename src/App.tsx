import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, LayoutDashboard, Zap, BookOpen, ShieldCheck } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ApiPlayground from './pages/ApiPlayground';
import Docs from './pages/Docs';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import AdminPortal from './pages/admin/AdminPortal';
import { AdminRoute } from './components/AdminRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ErrorBoundary } from './ErrorBoundary';
import { Toaster } from 'sonner';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
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

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/playground" element={<ApiPlayground />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/admin/*" element={<AdminRoute><AdminPortal /></AdminRoute>} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Toaster theme="dark" position="bottom-right" />
        <Navigation />
        <div className="min-h-[100dvh] bg-base text-textMain selection:bg-brand selection:text-white flex flex-col font-sans">
          <main className="flex-1 flex flex-col pt-16 sm:pt-24 pb-8 sm:pb-4">
            <ErrorBoundary><AnimatedRoutes /></ErrorBoundary>
          </main>
          <footer className="mt-auto border-t border-borderRoot bg-surface/30 px-4 py-5 sm:px-6 md:px-12 pb-[max(1.25rem,env(safe-area-inset-bottom))] flex flex-col sm:flex-row items-center justify-between text-xs text-textMuted gap-3.5 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400/90">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                Operational
              </div>
              <span className="text-borderRoot">|</span>
              <p>© {new Date().getFullYear()} IRCTC API.</p>
            </div>
            <div className="flex items-center flex-wrap justify-center gap-4 sm:gap-6 text-[11px] sm:text-xs font-medium">
              <Link to="/playground" className="hover:text-textMain transition-colors">Playground</Link>
              <Link to="/dashboard" className="hover:text-textMain transition-colors">Dashboard</Link>
              <a href="https://github.com/Manj620026" target="_blank" rel="noreferrer" className="hover:text-textMain transition-colors">GitHub</a>
              <Link to="/terms" className="hover:text-textMain transition-colors">Terms</Link>
              <Link to="/privacy" className="hover:text-textMain transition-colors">Privacy</Link>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}
