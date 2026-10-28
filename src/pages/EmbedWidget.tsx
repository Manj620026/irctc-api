import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Loader2, Train, Ticket, AlertCircle } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.irctc.dev';

export default function EmbedWidget() {
  const { type = 'pnr' } = useParams<{ type: string }>();

  // State for PNR
  const [pnr, setPnr] = useState('');
  const [pnrResult, setPnrResult] = useState<any>(null);

  // State for Live Tracking
  const [trainNo, setTrainNo] = useState('');
  const [liveResult, setLiveResult] = useState<any>(null);

  // Shared state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePnrSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPnr = pnr.replace(/[\s-]/g, '');
    if (!/^\d{10}$/.test(cleanPnr)) {
      setError('Enter a valid 10-digit PNR number');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/pnr/${cleanPnr}`, {
        headers: { 'x-client': 'embed-widget' },
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.error || data.message || 'PNR enquiry failed');
      }
      setPnrResult(data.data || data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLiveSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTrain = trainNo.trim();
    if (!/^\d{4,5}$/.test(cleanTrain)) {
      setError('Enter a valid 4-5 digit train number');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/live/${cleanTrain}`, {
        headers: { 'x-client': 'embed-widget' },
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.error || data.message || 'Live tracking enquiry failed');
      }
      setLiveResult(data.data || data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full min-h-[300px] bg-[#0c0c0e] text-slate-100 p-4 sm:p-5 rounded-2xl border border-white/10 font-sans flex flex-col justify-between select-none">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20 font-bold">
              {type === 'live' ? <Train size={15} /> : <Ticket size={15} />}
            </div>
            <span className="font-bold text-xs text-white tracking-wide">
              {type === 'live' ? 'Live Train Tracking' : 'Indian Railways PNR Enquiry'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Live Telemetry
          </span>
        </div>

        {/* Form Inputs */}
        {type === 'live' ? (
          <form onSubmit={handleLiveSearch} className="flex items-center gap-2 mb-3">
            <input
              type="text"
              value={trainNo}
              onChange={(e) => setTrainNo(e.target.value)}
              placeholder="Train Number (e.g. 12557)"
              className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
              <span>Track</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handlePnrSearch} className="flex items-center gap-2 mb-3">
            <input
              type="text"
              value={pnr}
              onChange={(e) => setPnr(e.target.value)}
              placeholder="10-digit PNR Number"
              className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
              <span>Check</span>
            </button>
          </form>
        )}

        {/* Error message */}
        {error && (
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] flex items-center gap-2 mb-3">
            <AlertCircle size={14} className="shrink-0" />
            <span className="truncate">{error}</span>
          </div>
        )}

        {/* Results Viewer */}
        {type === 'live' && liveResult && (
          <div className="bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-mono space-y-1.5">
            <div className="flex items-center justify-between font-bold text-white">
              <span>{liveResult.trainNumber || trainNo} - {liveResult.trainName || 'Express'}</span>
              <span className={parseInt(liveResult.delayMinutes || 0, 10) > 0 ? 'text-red-400' : 'text-emerald-400'}>
                {parseInt(liveResult.delayMinutes || 0, 10) > 0 ? `Delayed ${liveResult.delayMinutes}m` : 'On Time'}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400">
              Next: <span className="text-zinc-200">{liveResult.nextStationName || 'In Transit'}</span>
              {liveResult.platform && <span className="text-orange-400 font-bold ml-1.5">(PF {liveResult.platform})</span>}
            </div>
          </div>
        )}

        {type !== 'live' && pnrResult && (
          <div className="bg-black/40 border border-white/10 rounded-xl p-3 text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 border-b border-white/5 pb-1.5">
              <span className="font-bold text-white truncate">{pnrResult.trainNumber} {pnrResult.trainName}</span>
              <span className={pnrResult.chartPrepared ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                {pnrResult.chartPrepared ? 'Chart Prepared' : 'Chart Not Prepared'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {(pnrResult.passengers || []).slice(0, 4).map((p: any, idx: number) => (
                <div key={idx} className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
                  <div className="text-[10px] text-zinc-500">P{idx + 1}: {p.currentStatus || 'CNF'}</div>
                  <div className="font-bold text-zinc-200">{p.coach || 'Coach'} - {p.berthNumber || p.seatNumber}</div>
                  {p.berth && p.berth !== 'N.A' && <div className="text-[10px] text-orange-400">{p.berth}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Attribution Footer */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
        <span>⚡ Powered by <a href="https://irctc.dev" target="_blank" rel="noreferrer" className="text-orange-500 hover:underline font-bold">irctc.dev</a></span>
        <a href="https://irctc.dev/docs" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white">Get API</a>
      </div>
    </div>
  );
}
