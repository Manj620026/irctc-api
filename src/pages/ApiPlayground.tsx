import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Play, Loader2, Copy, Check, Settings2, Server, Key, Search, Eye, EyeOff, Terminal, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';

type Param = {
  key: string;
  label: string;
  type: 'path' | 'query';
  default: string;
  options?: string[];
};

type Endpoint = {
  id: string;
  group: string;
  method: string;
  basePath: string;
  name: string;
  params: Param[];
};

const ENDPOINTS: Endpoint[] = [
  {
    "group": "System",
    "id": "health",
    "method": "GET",
    "basePath": "/health",
    "name": "Gateway Health",
    "params": []
  },
  {
    "group": "Trains",
    "id": "trainSearch",
    "method": "GET",
    "basePath": "/api/v1/trains/search",
    "name": "Find Trains (Between Stations)",
    "params": [
      {
        "key": "from",
        "label": "From Code",
        "type": "query",
        "default": "NDLS"
      },
      {
        "key": "to",
        "label": "To Code",
        "type": "query",
        "default": "GD"
      },
      {
        "key": "date",
        "label": "Date (YYYY-MM-DD)",
        "type": "query",
        "default": "2026-10-25"
      }
    ]
  },
  {
    "group": "Trains",
    "id": "trainSearchByName",
    "method": "GET",
    "basePath": "/api/v1/trains/search/name",
    "name": "Train by Name",
    "params": [
      {
        "key": "name",
        "label": "Train Name",
        "type": "query",
        "default": "duronto"
      }
    ]
  },
  {
    "group": "Trains",
    "id": "cancelledTrains",
    "method": "GET",
    "basePath": "/api/v1/trains/cancelled",
    "name": "Cancelled Trains",
    "params": []
  },
  {
    "group": "Trains",
    "id": "trainSchedule",
    "method": "GET",
    "basePath": "/api/v1/trains/:trainNo",
    "name": "Train by Number",
    "params": [
      {
        "key": "trainNo",
        "label": "Train Number",
        "type": "path",
        "default": "26502"
      }
    ]
  },
  {
    "group": "Trains",
    "id": "trainFare",
    "method": "GET",
    "basePath": "/api/v1/trains/:trainNo/fare",
    "name": "Fare Lookup",
    "params": [
      {
        "key": "trainNo",
        "label": "Train Number",
        "type": "path",
        "default": "12558"
      },
      {
        "key": "from",
        "label": "Origin Station",
        "type": "query",
        "default": "ANVT"
      },
      {
        "key": "to",
        "label": "Destination Station",
        "type": "query",
        "default": "NKE"
      },
      {
        "key": "class",
        "label": "Travel Class",
        "type": "query",
        "default": "all",
        "options": [
          "all",
          "1A",
          "2A",
          "3A",
          "3E",
          "CC",
          "EC",
          "SL",
          "2S"
        ]
      },
      {
        "key": "quota",
        "label": "Quota",
        "type": "query",
        "default": "GN",
        "options": [
          "GN",
          "TQ",
          "PT",
          "LD"
        ]
      }
    ]
  },
  {
    "group": "Trains",
    "id": "seatAvailability",
    "method": "GET",
    "basePath": "/api/v1/trains/:trainNo/availability",
    "name": "Seat Availability",
    "params": [
      {
        "key": "trainNo",
        "label": "Train Number",
        "type": "path",
        "default": "12557"
      },
      {
        "key": "from",
        "label": "Origin Station",
        "type": "query",
        "default": "NKE"
      },
      {
        "key": "to",
        "label": "Destination Station",
        "type": "query",
        "default": "ANVT"
      },
      {
        "key": "date",
        "label": "Journey Date (DD-MM-YYYY)",
        "type": "query",
        "default": "17-11-2026"
      },
      {
        "key": "class",
        "label": "Travel Class",
        "type": "query",
        "default": "3A",
        "options": [
          "3A",
          "2A",
          "1A",
          "3E",
          "CC",
          "EC",
          "SL",
          "2S"
        ]
      },
      {
        "key": "quota",
        "label": "Quota",
        "type": "query",
        "default": "GN",
        "options": [
          "GN",
          "TQ",
          "PT",
          "LD"
        ]
      }
    ]
  },
  {
    "group": "Trains",
    "id": "chartVacant",
    "method": "GET",
    "basePath": "/api/v1/trains/:trainNo/chart-vacant",
    "name": "Vacant Seats After Chart Preparation",
    "params": [
      {
        "key": "trainNo",
        "label": "Train Number",
        "type": "path",
        "default": "12557"
      },
      {
        "key": "boardingStation",
        "label": "Boarding Station",
        "type": "query",
        "default": "GKP"
      },
      {
        "key": "date",
        "label": "Journey Date (YYYY-MM-DD)",
        "type": "query",
        "default": "2026-10-25"
      },
      {
        "key": "class",
        "label": "Travel Class",
        "type": "query",
        "default": "ALL",
        "options": [
          "ALL",
          "3A",
          "2A",
          "1A",
          "3E",
          "SL",
          "CC",
          "2S"
        ]
      }
    ]
  },
  {
    "group": "Stations",
    "id": "stationAutocomplete",
    "method": "GET",
    "basePath": "/api/v1/trains/stations",
    "name": "Station by Name",
    "params": [
      {
        "key": "q",
        "label": "Search Query",
        "type": "query",
        "default": "pur"
      }
    ]
  },
  {
    "group": "Stations",
    "id": "stationTimetable",
    "method": "GET",
    "basePath": "/api/v1/trains/stations/:code/timetable/:date",
    "name": "Station Timetable",
    "params": [
      {
        "key": "code",
        "label": "Station Code",
        "type": "path",
        "default": "NKE"
      },
      {
        "key": "date",
        "label": "Date (DD-MM-YYYY)",
        "type": "path",
        "default": "17-11-2026"
      }
    ]
  },
  {
    "group": "Stations",
    "id": "stationByCode",
    "method": "GET",
    "basePath": "/api/v1/trains/stations/:code",
    "name": "Station by Code",
    "params": [
      {
        "key": "code",
        "label": "Station Code",
        "type": "path",
        "default": "NDLS"
      }
    ]
  },
  {
    "group": "Live Status & PNR",
    "id": "live",
    "method": "GET",
    "basePath": "/api/v1/live/:trainNo",
    "name": "Live Train Running Status",
    "params": [
      {
        "key": "trainNo",
        "label": "Train Number",
        "type": "path",
        "default": "12557"
      },
      {
        "key": "date",
        "label": "Date (YYYY-MM-DD)",
        "type": "query",
        "default": "2026-10-25"
      }
    ]
  },
  {
    "group": "Live Status & PNR",
    "id": "liveStation",
    "method": "GET",
    "basePath": "/api/v1/live/station/:stationCode",
    "name": "Live Station Display Board",
    "params": [
      {
        "key": "stationCode",
        "label": "Station Code",
        "type": "path",
        "default": "GKP"
      },
      {
        "key": "hours",
        "label": "Hours Window",
        "type": "query",
        "default": "2",
        "options": [
          "2",
          "4",
          "8"
        ]
      },
      {
        "key": "toStation",
        "label": "Destination Filter (Optional)",
        "type": "query",
        "default": ""
      }
    ]
  },
  {
    "group": "Live Status & PNR",
    "id": "pnr",
    "method": "GET",
    "basePath": "/api/v1/pnr/:pnr",
    "name": "PNR Status",
    "params": [
      {
        "key": "pnr",
        "label": "PNR Number",
        "type": "path",
        "default": "2265248473"
      }
    ]
  }
];

const buildUrl = (ep: Endpoint, vals: Record<string, string>) => {
  let url = ep.basePath;
  
  // Replace path variables
  ep.params.filter(p => p.type === 'path').forEach(p => {
    const val = vals[p.key] || '';
    url = url.replace(`:${p.key}`, encodeURIComponent(val));
  });
  
  // Append query variables
  const queryParams = new URLSearchParams();
  ep.params.filter(p => p.type === 'query').forEach(p => {
    if (vals[p.key]) queryParams.append(p.key, vals[p.key]);
  });
  
  const queryStr = queryParams.toString();
  return queryStr ? `${url}?${queryStr}` : url;
};

// Extremely lightweight JSON syntax highlighter for the response payload
const renderHighlightedJson = (jsonString: string) => {
  const lines = jsonString.split('\n');
  return lines.map((line, i) => {
    // Match `"key": value` pattern
    const keyMatch = line.match(/^(\s*)(".*?":)(.*)$/);
    if (keyMatch) {
      const [, indent, keyStr, rest] = keyMatch;
      
      let valueColor = 'text-textMain';
      if (rest.includes('true') || rest.includes('false') || rest.includes('null')) valueColor = 'text-brand';
      else if (/\d/.test(rest)) valueColor = 'text-blue-400';
      else if (rest.includes('"')) valueColor = 'text-emerald-400/90';
      
      return (
        <div key={i} className="font-mono">
          <span className="whitespace-pre">{indent}</span>
          <span className="text-textMuted/80">{keyStr}</span>
          <span className={valueColor}>{rest}</span>
        </div>
      );
    }
    return <div key={i} className="text-textMuted/60 font-mono">{line}</div>;
  });
};

export default function ApiPlayground() {
  const [searchParams, setSearchParams] = useSearchParams();
  const endpointQuery = searchParams.get('endpoint');

  const findEndpoint = (param: string | null): Endpoint | undefined => {
    if (!param) return undefined;
    const clean = decodeURIComponent(param).trim().toLowerCase();
    return ENDPOINTS.find(ep =>
      ep.id.toLowerCase() === clean ||
      ep.basePath.toLowerCase() === clean ||
      ep.basePath.toLowerCase().replace(/:\w+/g, '').replace(/\/+$/, '') === clean.replace(/:\w+/g, '').replace(/\/+$/, '')
    );
  };

  const initialEndpoint = findEndpoint(endpointQuery) || ENDPOINTS[0];
  const [activeEndpoint, setActiveEndpoint] = useState<Endpoint>(initialEndpoint);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [playgroundKey, setPlaygroundKey] = useState<string>('');
  const [mobileTab, setMobileTab] = useState<'endpoints' | 'params' | 'response'>('endpoints');
  const [endpointSearch, setEndpointSearch] = useState('');
  const [showKeyPassword, setShowKeyPassword] = useState(false);
  const [curlCopied, setCurlCopied] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [reqState, setReqState] = useState({
    data: '', loading: false, time: 0, status: 0, size: 0, copied: false
  });
  const { user, setUser, logout } = useAuth();
  const isPlaygroundActive = Boolean(user);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Sync active endpoint if URL query param changes
  useEffect(() => {
    if (endpointQuery) {
      const match = findEndpoint(endpointQuery);
      if (match && match.id !== activeEndpoint.id) {
        setActiveEndpoint(match);
      }
    }
  }, [endpointQuery]);

  // Filter and group endpoints for the sidebar
  const filteredEndpoints = ENDPOINTS.filter(ep => {
    if (!endpointSearch.trim()) return true;
    const q = endpointSearch.toLowerCase();
    return ep.name.toLowerCase().includes(q) || ep.basePath.toLowerCase().includes(q) || ep.group.toLowerCase().includes(q);
  });

  const groupedEndpoints = filteredEndpoints.reduce((acc, ep) => {
    if (!acc[ep.group]) acc[ep.group] = [];
    acc[ep.group].push(ep);
    return acc;
  }, {} as Record<string, Endpoint[]>);

  // Initialize parameters when endpoint changes (with optional URL override)
  useEffect(() => {
    const initialVals: Record<string, string> = {};
    activeEndpoint.params.forEach(p => {
      const urlVal = searchParams.get(p.key);
      initialVals[p.key] = urlVal || p.default;
    });
    setParamValues(initialVals);
    setReqState(s => ({...s, data: '', time: 0, status: 0, size: 0}));
  }, [activeEndpoint]);

  const handleSelectEndpoint = (ep: Endpoint) => {
    setActiveEndpoint(ep);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('endpoint', ep.id);
    setSearchParams(newParams, { replace: true });
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setMobileTab('params');
    }
  };

  const currentUrl = buildUrl(activeEndpoint, paramValues);

  const getCurlCommand = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'https://api.irctc.dev';
    const cleanKey = playgroundKey.trim();
    const authHeader = cleanKey ? `-H "x-api-key: ${cleanKey}"` : `-H "x-api-key: YOUR_API_KEY"`;
    return `curl -s -X ${activeEndpoint.method} "${API_URL}${currentUrl}" \\\n  ${authHeader} \\\n  -H "accept: application/json"`;
  };

  const copyCurl = () => {
    navigator.clipboard?.writeText(getCurlCommand()).then(() => {
      setCurlCopied(true);
      toast.success('cURL command copied to clipboard');
      setTimeout(() => setCurlCopied(false), 2000);
    }).catch(() => {
      toast.error('Failed to copy cURL command');
    });
  };

  const handleTest = async () => {
    if (reqState.loading) return;
    const cleanKey = playgroundKey.trim();
    const isPublicEndpoint = activeEndpoint.id === 'health';
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setMobileTab('response');
    }

    if (!cleanKey && !isPublicEndpoint) {
      setReqState({
        data: '{\n  "error": "API Key Required. Please paste your valid API key in the Configuration panel, or test public /health endpoint."\n}',
        loading: false,
        time: 0,
        status: 401,
        size: 0,
        copied: false
      });
      return;
    }

    // Check for masked keys (bullet characters) or any non-ASCII characters that crash native fetch headers
    if (cleanKey && (/[^\x20-\x7E]/.test(cleanKey) || cleanKey.includes('•'))) {
      setReqState({
        data: '{\n  "error": "Invalid API Key format. You pasted a masked key (••••). Please generate a new key in the Dashboard and copy the real one."\n}',
        loading: false,
        time: 0,
        status: 401,
        size: 0,
        copied: false
      });
      return;
    }

    const missingPathParam = activeEndpoint.params.find(p => p.type === 'path' && !paramValues[p.key]?.trim());
    if (missingPathParam) {
      setReqState({
        data: JSON.stringify({ error: `Parameter Required: Please enter a valid value for "${missingPathParam.label}"` }, null, 2),
        loading: false,
        time: 0,
        status: 400,
        size: 0,
        copied: false
      });
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setReqState(s => ({ ...s, loading: true, data: '', copied: false }));
    const t0 = performance.now();
    try {
      const headers: Record<string, string> = {
        accept: 'application/json'
      };
      if (cleanKey) {
        headers['x-api-key'] = cleanKey;
      }
      const API_URL = import.meta.env.VITE_API_URL || 'https://api.irctc.dev';
      const res = await fetch(`${API_URL}${currentUrl}`, { headers, signal: controller.signal });
      const text = await res.text();
      let formatted = text;
      let backendTime = Math.round((performance.now() - t0) * 100) / 100;

      try {
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed === 'object' && parsed._time !== undefined) {
          backendTime = parsed._time;
          delete parsed._time; // Remove from display payload
        }
        formatted = JSON.stringify(parsed, null, 2);
      } catch {}

      setReqState({
        data: formatted,
        loading: false,
        time: backendTime,
        status: res.status,
        size: new Blob([text]).size,
        copied: false
      });
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setReqState({
        data: JSON.stringify({ error: err.message }, null, 2),
        loading: false,
        time: Math.round((performance.now() - t0) * 100) / 100,
        status: 0,
        size: 0,
        copied: false
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard?.writeText(reqState.data).then(() => {
      setReqState(s => ({ ...s, copied: true }));
      setTimeout(() => setReqState(s => ({ ...s, copied: false })), 2000);
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  return (
    <div className="relative w-full flex flex-col min-h-[calc(100dvh-80px)] lg:h-[calc(100vh-100px)] pt-6 sm:pt-8 pb-6 lg:overflow-hidden">
      {/* Schema.org Structured Data for Developer Sandbox */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebApplication',
                '@id': 'https://irctc.dev/playground/#webapp',
                url: 'https://irctc.dev/playground',
                name: 'IRCTC API Interactive Playground & Developer Sandbox',
                description: 'Interactive developer console and sandbox to test live Indian Railways API endpoints, query PNR status, seat availability, train schedules, and live train GPS telemetry with real-time latency metrics.',
                applicationCategory: 'DeveloperApplication',
                operatingSystem: 'Web Browsers',
                browserRequirements: 'Requires JavaScript. Requires HTML5.',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'INR'
                },
                featureList: [
                  'Live 10-Digit PNR Status Verification',
                  '14-Day PRS Seat Availability Forecast',
                  'Post-Charting Vacant Berths Allocation',
                  'Live Train GPS Telemetry & Delays',
                  'Station Timetable & Live Display Boards',
                  'Sub-100ms Microsecond Execution Timing'
                ]
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
                    name: 'API Playground',
                    item: 'https://irctc.dev/playground'
                  }
                ]
              }
            ]
          })
        }}
      />

      {/* Ghost UI Content */}
      <motion.div
        initial={{ opacity: 0, filter: 'blur(0px) grayscale(0%)' }}
        animate={{
          opacity: isPlaygroundActive ? 1 : 0.5,
          filter: isPlaygroundActive ? 'blur(0px) grayscale(0%)' : 'blur(4px) grayscale(60%)'
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-[1400px] mx-auto px-4 sm:px-6 w-full flex flex-1 flex-col min-h-0 ${!isPlaygroundActive ? 'select-none pointer-events-none' : ''}`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3.5 sm:mb-8 shrink-0">
          <div>
            <h2 className="text-xl sm:text-3xl font-medium tracking-tight mb-0.5 sm:mb-2">API Playground</h2>
            <p className="text-textMuted text-xs sm:text-sm">Interactive developer console to test live IRCTC API endpoints.</p>
          </div>

          <div className="flex items-center gap-3 bg-surface border border-borderRoot rounded-full p-1.5 pr-2.5 shadow-sm w-full sm:w-auto shrink-0">
            <img
              src={user?.avatar || user?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=1a1a1a&color=fff`}
              alt="Avatar"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-base shrink-0 ring-1 ring-white/10"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=1a1a1a&color=fff`;
              }}
            />
            <div className="flex flex-col justify-center px-1 min-w-0 flex-1 sm:flex-initial">
              <span className="text-xs sm:text-[13px] font-semibold text-textMain leading-none tracking-tight mb-1 truncate sm:max-w-[200px]">
                {user?.name || 'Guest Developer'}
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-textMuted leading-none truncate">
                {user?.email || 'Sign in required'}
              </span>
            </div>
            {user && (
              <button
                onClick={() => logout()}
                className="ml-auto text-[11px] sm:text-xs font-medium text-textMuted hover:text-red-400 active:scale-[0.96] transition-all bg-base px-3 py-1.5 rounded-full border border-borderRoot shadow-sm hover:border-red-400/30 hover:bg-red-400/10 shrink-0 cursor-pointer"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>

        {/* Mobile View Switcher Tabs (Visible only on mobile/tablet < 1024px) */}
        <div className="grid grid-cols-3 lg:hidden bg-[#0e0e0e] p-1 rounded-xl border border-borderRoot mb-3 shrink-0 shadow-sm gap-1">
          <button
            onClick={() => setMobileTab('endpoints')}
            className={`py-2 px-2 text-xs font-medium rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
              mobileTab === 'endpoints' ? 'bg-[#222] text-white shadow-sm ring-1 ring-white/10' : 'text-textMuted hover:text-white'
            }`}
          >
            <span>Endpoints</span>
          </button>
          <button
            onClick={() => setMobileTab('params')}
            className={`py-2 px-2 text-xs font-medium rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
              mobileTab === 'params' ? 'bg-[#222] text-white shadow-sm ring-1 ring-white/10' : 'text-textMuted hover:text-white'
            }`}
          >
            <span>Config</span>
          </button>
          <button
            onClick={() => setMobileTab('response')}
            className={`py-2 px-2 text-xs font-medium rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
              mobileTab === 'response' ? 'bg-[#222] text-white shadow-sm ring-1 ring-white/10' : 'text-textMuted hover:text-white'
            }`}
          >
            {reqState.status > 0 && (
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${reqState.status === 200 ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.8)]'}`} />
            )}
            <span>Response</span>
            {reqState.status > 0 && (
              <span className="font-mono text-[10px] text-textMuted font-bold">({reqState.status})</span>
            )}
          </button>
        </div>

        {/* Main App Container */}
        <div className="flex flex-col lg:flex-row flex-1 min-h-0 border border-borderRoot bg-surface rounded-xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/5">
          
          {/* 1. Sidebar (Endpoints List) */}
          <div className={`w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-borderRoot flex-col bg-[#080808] ${mobileTab === 'endpoints' ? 'flex flex-1 min-h-0' : 'hidden lg:flex'}`}>
            
            {/* Search filter for endpoints */}
            <div className="p-3 border-b border-borderRoot bg-[#080808]/90 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-2 bg-[#050505] border border-borderRoot rounded-lg px-2.5 py-1.5 focus-within:border-brand/40 focus-within:ring-1 focus-within:ring-brand/40 transition-all">
                <Search size={13} className="text-textMuted shrink-0" />
                <input
                  type="text"
                  value={endpointSearch}
                  onChange={(e) => setEndpointSearch(e.target.value)}
                  placeholder="Filter endpoints..."
                  className="bg-transparent border-none outline-none text-xs text-textMain placeholder:text-textMuted/50 w-full"
                />
                {endpointSearch && (
                  <button 
                    type="button" 
                    onClick={() => setEndpointSearch('')}
                    className="text-[10px] text-textMuted hover:text-textMain px-1 font-mono"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="p-3 sm:p-4 py-4 sm:py-6 flex flex-col gap-6 overflow-y-auto flex-1 min-h-0">
              {Object.keys(groupedEndpoints).length === 0 ? (
                <div className="p-4 text-center text-xs text-textMuted font-mono">
                  No matching endpoints
                </div>
              ) : Object.entries(groupedEndpoints).map(([groupName, eps]) => (
                <div key={groupName} className="flex flex-col">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-textMuted font-semibold mb-2 sm:mb-3 px-2 sm:px-3">
                    {groupName}
                  </h3>
                  <div className="flex flex-col gap-1">
                    {eps.map(ep => {
                      const isActive = activeEndpoint.id === ep.id;
                      return (
                        <button
                          key={ep.id}
                          onClick={() => handleSelectEndpoint(ep)}
                          className="relative w-full text-left px-3 py-2.5 sm:py-2 transition-colors group flex flex-col rounded-md active:bg-white/[0.04] cursor-pointer"
                        >
                          {isActive && (
                            <motion.div
                              layoutId="playground-sidebar-active"
                              className="absolute inset-0 bg-brand/10 border-l-2 border-brand rounded-r-md"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          <div className="relative z-10 flex items-center justify-between mb-0.5 sm:mb-1">
                            <span className={`text-[13px] font-medium transition-colors ${isActive ? 'text-brand' : 'text-textMuted group-hover:text-textMain'}`}>
                              {ep.name}
                            </span>
                          </div>
                          <div className="relative z-10 flex items-center gap-2">
                            <span className="text-[9px] px-1.5 py-0.5 font-mono font-medium tracking-wider text-blue-400 bg-blue-400/10 rounded-sm shrink-0">
                              {ep.method}
                            </span>
                            <span className="font-mono text-[10px] text-textMuted truncate w-full group-hover:text-textMuted/80 transition-colors">
                              {ep.basePath}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Middle Column (Parameters & Settings) */}
          <div className={`w-full lg:w-80 xl:w-96 shrink-0 border-b lg:border-b-0 lg:border-r border-borderRoot bg-surface/30 flex-col overflow-y-auto ${mobileTab === 'params' ? 'flex flex-1 min-h-0' : 'hidden lg:flex'}`}>
            
            {/* Active Endpoint Context Header */}
            <div className="p-3 sm:p-4 border-b border-borderRoot bg-[#0a0a0a] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded text-blue-400 bg-blue-400/10 shrink-0">
                  {activeEndpoint.method}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-textMain truncate">{activeEndpoint.name}</div>
                  <div className="text-[11px] font-mono text-textMuted truncate">{activeEndpoint.basePath}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileTab('endpoints')}
                className="lg:hidden text-[11px] font-medium text-brand hover:underline shrink-0 bg-brand/10 hover:bg-brand/20 px-2.5 py-1 rounded-md transition-colors"
              >
                Change
              </button>
            </div>
            
            <div className="p-4 sm:p-6 flex-1 flex flex-col">
              <div className="mb-5 sm:mb-8">
                <label className="text-[11px] sm:text-xs text-textMuted font-medium flex items-center justify-between mb-2 uppercase tracking-wider">
                  <span>Authentication (API Key)</span>
                  {user?.apiKeys?.[0]?.key && !playgroundKey && (
                    <button
                      type="button"
                      onClick={() => setPlaygroundKey(user.apiKeys[0].key)}
                      className="text-[10px] text-brand hover:underline font-mono normal-case tracking-normal"
                    >
                      + Use My Key
                    </button>
                  )}
                </label>
                <div className="flex items-center gap-2.5 bg-[#050505] border border-borderRoot rounded-lg px-3 py-2 sm:py-2.5 shadow-sm focus-within:border-brand/50 focus-within:ring-1 focus-within:ring-brand/50 transition-all">
                  <Key size={15} className={`shrink-0 ${playgroundKey ? "text-emerald-500" : "text-textMuted"}`} />
                  <input
                    type={showKeyPassword ? "text" : "password"}
                    value={playgroundKey}
                    onChange={(e) => setPlaygroundKey(e.target.value)}
                    placeholder="Paste your API key (re_live_...)"
                    className="bg-transparent border-none outline-none text-base sm:text-xs font-mono text-textMain w-full placeholder:text-textMuted/50 min-w-0"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                  {playgroundKey && (
                    <button
                      type="button"
                      onClick={() => setShowKeyPassword(!showKeyPassword)}
                      className="text-textMuted hover:text-textMain p-1 rounded transition-colors shrink-0"
                      title={showKeyPassword ? "Hide API Key" : "Show API Key"}
                    >
                      {showKeyPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  )}
                </div>
              </div>

              <div className="h-px w-full bg-borderRoot mb-5 sm:mb-8" />

              <div className="flex items-center gap-2 mb-3 text-[11px] sm:text-xs font-semibold text-textMuted uppercase tracking-wider">
                <Settings2 size={13} className="text-textMuted" />
                Parameters
              </div>
              {activeEndpoint.params.length > 0 ? (
                <div className="flex flex-col gap-4 sm:gap-6">
                  {activeEndpoint.params.map(param => (
                    <div key={param.key} className="flex flex-col gap-1.5 sm:gap-2">
                      <label className="text-xs text-textMain font-medium flex items-center justify-between">
                        {param.label}
                        <span className="text-[10px] font-mono text-textMuted bg-base px-1.5 py-0.5 rounded border border-borderRoot shadow-sm">
                          {param.type === 'path' ? `:${param.key}` : `?${param.key}=`}
                        </span>
                      </label>
                      {param.options ? (
                        <select
                          value={paramValues[param.key] ?? param.default}
                          onChange={(e) => setParamValues(prev => ({...prev, [param.key]: e.target.value}))}
                          className="w-full bg-[#050505] border border-borderRoot rounded-md px-3 py-2 text-base sm:text-[13px] text-textMain focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all shadow-sm cursor-pointer"
                        >
                          {param.options.map(opt => (
                            <option key={opt} value={opt} className="bg-[#111] text-textMain">
                              {opt === 'all' ? 'all (All Running Classes)' : opt}
                            </option>
                          ))}
                        </select>
                      ) : (() => {
                        const isDdMmYyyy = param.label.includes('DD-MM-YYYY') || (param.default && /^\d{2}-\d{2}-\d{4}$/.test(param.default));
                        const inputType = (param.key === 'date' && !isDdMmYyyy) ? 'date' : 'text';
                        return (
                          <input
                            type={inputType}
                            value={paramValues[param.key] || ''}
                            onChange={(e) => setParamValues(prev => ({...prev, [param.key]: e.target.value}))}
                            onKeyDown={(e) => e.key === 'Enter' && handleTest()}
                            className="w-full bg-[#050505] border border-borderRoot rounded-md px-3 py-2 text-base sm:text-[13px] text-textMain focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all placeholder:text-textMuted/40 shadow-sm"
                            placeholder={isDdMmYyyy ? 'DD-MM-YYYY (e.g. 17-11-2026)' : `Enter ${param.label.toLowerCase()}`}
                            autoCapitalize={['from', 'to', 'code', 'station', 'trainNo', 'pnr'].includes(param.key) ? 'characters' : 'none'}
                            autoCorrect="off"
                            spellCheck="false"
                            style={{ colorScheme: 'dark' }}
                          />
                        );
                      })()}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs sm:text-sm text-textMuted/60 font-medium bg-[#050505] border border-borderRoot rounded-lg p-5 text-center flex flex-col items-center gap-2">
                  <Server size={18} className="text-textMuted/40" />
                  No parameters required
                </div>
              )}

              {/* Direct Send button on Mobile inside Configuration tab */}
              <div className="mt-8 pt-4 border-t border-borderRoot flex lg:hidden">
                <button
                  onClick={handleTest}
                  disabled={reqState.loading}
                  className="w-full bg-brand text-white py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-brand/20 transition-all cursor-pointer"
                >
                  {reqState.loading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
                  Send Request
                </button>
              </div>
            </div>
          </div>

          {/* 3. Right Column (The Engine: URL + Response) */}
          <div className={`flex-1 flex-col min-w-0 min-h-0 bg-[#050505] ${mobileTab === 'response' ? 'flex flex-1 min-h-[400px] lg:min-h-0' : 'hidden lg:flex'}`}>
            
            {/* Command Bar (Cockpit) */}
            <div className="p-2.5 sm:p-4 border-b border-borderRoot bg-surface">
              <div className="flex items-center bg-[#050505] rounded-lg border border-borderRoot overflow-hidden p-1 sm:p-0 shadow-sm gap-2 sm:gap-0 focus-within:ring-2 focus-within:ring-brand/20 focus-within:border-brand/40 transition-all">
                <div className="flex-1 font-mono text-xs sm:text-sm flex items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-2 sm:py-3 overflow-x-auto whitespace-nowrap scrollbar-none min-w-0">
                  <span className="text-blue-400 font-bold text-xs sm:text-sm shrink-0">{activeEndpoint.method}</span>
                  <span className="text-textMuted select-none hidden sm:inline">{import.meta.env.VITE_API_URL || 'https://api.irctc.dev'}</span>
                  <span className="text-textMain truncate sm:overflow-visible">{currentUrl}</span>
                </div>
                {/* Copy cURL Button */}
                <button
                  type="button"
                  onClick={copyCurl}
                  title="Copy executable cURL command"
                  className="flex items-center gap-1.5 px-3 py-2 sm:py-3 text-xs font-mono text-textMuted hover:text-textMain hover:bg-white/[0.04] transition-colors border-r border-borderRoot shrink-0 cursor-pointer"
                >
                  {curlCopied ? <Check size={13} className="text-emerald-400" /> : <Terminal size={13} />}
                  <span className="hidden sm:inline">{curlCopied ? 'cURL Copied' : 'cURL'}</span>
                </button>

                {/* Postman Collection Button */}
                <a
                  href="/postman_collection.json"
                  download="irctc_postman_collection.json"
                  title="Download Postman Collection v2.1.0 with Test Assertions"
                  className="flex items-center gap-1.5 px-3 py-2 sm:py-3 text-xs font-mono text-textMuted hover:text-textMain hover:bg-white/[0.04] transition-colors border-r border-borderRoot shrink-0"
                >
                  <Download size={13} className="text-orange-400" />
                  <span className="hidden sm:inline">Postman</span>
                </a>

                <button
                  onClick={handleTest}
                  disabled={reqState.loading}
                  className="bg-brand text-white px-4 sm:px-8 py-2 sm:py-3 font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-brand/90 disabled:opacity-50 active:scale-[0.98] transition-all cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] rounded-md sm:rounded-none shrink-0"
                >
                  {reqState.loading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
                  <span>Send</span>
                </button>
              </div>
            </div>

            {/* Response Viewer */}
            <div className="flex-1 relative bg-[#050505] overflow-hidden flex flex-col min-h-[300px] lg:min-h-0 shadow-[inset_0_4px_24px_rgba(0,0,0,0.2)]">
              
              {/* Meta Bar */}
              <div className="absolute top-0 left-0 right-0 z-10 h-10 border-b border-borderRoot flex items-center justify-between px-4 sm:px-5 bg-[#050505]/80 backdrop-blur-md">
                <div className="flex items-center gap-3 sm:gap-5 text-xs font-mono">
                  {reqState.status > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${reqState.status === 200 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                      <span className={reqState.status === 200 ? 'text-emerald-500 font-medium' : 'text-red-500 font-medium'}>
                        {reqState.status}
                      </span>
                    </div>
                  )}
                  {reqState.time > 0 && <span className="text-textMuted">{reqState.time}ms</span>}
                  {reqState.size > 0 && <span className="text-textMuted">{(reqState.size / 1024).toFixed(2)} KB</span>}
                </div>
                
                <AnimatePresence>
                  {reqState.data && (
                    <motion.button 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      onClick={copyToClipboard} 
                      className="text-textMuted hover:text-textMain transition-colors flex items-center gap-1.5 text-xs font-medium"
                    >
                      {reqState.copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      {reqState.copied ? 'Copied' : 'Copy'}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              
              {/* JSON Output / Loading / Empty */}
              <div className="flex-1 overflow-auto p-4 sm:p-5 pt-14 relative">
                <AnimatePresence mode="wait">
                  {reqState.loading ? (
                    <motion.div 
                      key="loading" 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="h-full flex flex-col gap-2 p-2"
                    >
                      <div className="w-1/3 h-4 bg-white/5 rounded animate-pulse" />
                      <div className="w-1/2 h-4 bg-white/5 rounded animate-pulse" />
                      <div className="w-1/4 h-4 bg-white/5 rounded animate-pulse" />
                      <div className="w-2/5 h-4 bg-white/5 rounded animate-pulse mt-2" />
                    </motion.div>
                  ) : reqState.data ? (
                    <motion.div 
                      key="data" 
                      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                      className="text-xs sm:text-[13px] leading-relaxed font-mono whitespace-pre overflow-x-auto pb-4"
                    >
                      {renderHighlightedJson(reqState.data)}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="empty" 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-textMuted font-mono text-xs select-none px-4 text-center"
                    >
                      <div className="mb-3 p-3 bg-white/[0.02] rounded-2xl border border-borderRoot text-textMuted/40">
                        <Server size={28} strokeWidth={1.5} />
                      </div>
                      <div className="opacity-60 max-w-xs">{'>'} Ready. Configure parameters and hit Send.</div>
                      <button
                        onClick={() => setMobileTab('params')}
                        className="mt-4 lg:hidden text-xs font-sans font-medium text-brand bg-brand/10 hover:bg-brand/20 px-3.5 py-1.5 rounded-lg transition-colors pointer-events-auto"
                      >
                        Configure Parameters →
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Ghost UI Auth Overlay */}
      {!isPlaygroundActive && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
            className="max-w-md w-full p-8 bg-[#0a0a0a]/90 border border-white/10 backdrop-blur-3xl rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] ring-1 ring-white/5 flex flex-col items-center text-center mx-4 -mt-10"
          >
            <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mb-6 ring-1 ring-brand/30 shadow-[inset_0_0_20px_rgba(var(--brand),0.2)]">
              <Server size={32} strokeWidth={1.5} />
            </div>

            <h1 className="text-2xl font-bold text-textMain tracking-tight mb-2">Enter the Playground</h1>
            <p className="text-textMuted text-sm mb-8 leading-relaxed max-w-xs mx-auto">
              Sign in to test live API endpoints, view payloads, and interact with the engine.
            </p>

            <div className="w-full flex justify-center mb-4">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (credentialResponse.credential) {
                    try {
                      const API_URL = import.meta.env.VITE_API_URL || 'https://api.irctc.dev';
                      const res = await fetch(`${API_URL}/api/v1/auth/google/native`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ idToken: credentialResponse.credential })
                      });
                      const data = await res.json();
                      if (data.success) {
                        setUser(data.user);
                        localStorage.setItem('irctc_api_token', data.token);
                        toast.success('Welcome back!');
                      } else {
                        toast.error(data.message || 'Login Failed');
                      }
                    } catch (err) {
                      console.error('Login failed', err);
                      toast.error('Network error during login.');
                    }
                  }
                }}
                onError={() => toast.error('Google Login Failed')}
                theme="filled_black"
                size="large"
                width="300px"
              />
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
