import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Clock, Radio, RefreshCw, Search, X, XCircle } from 'lucide-react';
import {
  formatDateLabel,
  formatIstAt,
  formatIstTime,
  istDate,
  shiftDate,
  type ChartDayResponse,
  type ChartFilter,
  type ChartRow,
  type ChartSide,
  type ChartSort,
} from './chartDay';

interface ChartDayPanelProps {
  apiUrl: string;
  adminFetch: (url: string, options?: RequestInit) => Promise<Response>;
  onClose: () => void;
}

const PAGE_SIZE = 100;
const REFRESH_MS = 60000;

const BUCKET_DOT: Record<ChartRow['bucket'], string> = {
  both: 'bg-emerald-400',
  firstOnly: 'bg-cyan-400',
  pending: 'bg-white/25',
  missed: 'bg-red-400',
};

function ChartCell({ side, date }: { side: ChartSide; date: string }) {
  if (side.status === 'done') {
    return (
      <div title={side.syncedAt ? `Captured ${formatIstAt(side.syncedAt, date)} IST` : undefined}>
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <CheckCircle2 size={12} className="shrink-0" />
          <span className="tabular-nums">{side.at ? formatIstAt(side.at, date) : 'Prepared'}</span>
        </div>
        <div className="text-[10px] text-textMuted tabular-nums mt-0.5">synced {formatIstAt(side.syncedAt, date)}</div>
      </div>
    );
  }
  if (side.status === 'missed') {
    return (
      <div className="flex items-center gap-1.5 text-red-400 font-semibold">
        <XCircle size={12} className="shrink-0" />
        <span>Missed</span>
      </div>
    );
  }
  const due = side.status === 'due';
  return (
    <div title={`IRCTC usually publishes by ~${formatIstAt(side.expectedAt, date)}; fetch at ${formatIstAt(side.fetchAt, date)}`}>
      <div className={`flex items-center gap-1.5 font-semibold ${due ? 'text-amber-400' : 'text-textMain'}`}>
        {due ? <AlertTriangle size={12} className="shrink-0" /> : <Clock size={12} className="shrink-0 text-textMuted" />}
        <span className="tabular-nums">{due ? 'Due' : `~${formatIstAt(side.expectedAt, date)}`}</span>
      </div>
      <div className="text-[10px] text-textMuted tabular-nums mt-0.5">
        {due ? `expected ~${formatIstAt(side.expectedAt, date)}` : `fetch ${formatIstAt(side.fetchAt, date)}`}
      </div>
    </div>
  );
}

function VacantCell({ row }: { row: ChartRow }) {
  if (row.vacant === null) return <span className="text-textMuted">—</span>;
  const classes = Object.entries(row.byClass || {})
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  return (
    <div>
      <div className="text-textMain font-semibold tabular-nums">{row.vacant}</div>
      {classes.length > 0 && (
        <div className="text-[10px] text-textMuted tabular-nums mt-0.5 whitespace-nowrap">
          {classes.map(([cls, n]) => `${cls} ${n}`).join(' · ')}
        </div>
      )}
    </div>
  );
}

export default function ChartDayPanel({ apiUrl, adminFetch, onClose }: ChartDayPanelProps) {
  const today = istDate();
  const [date, setDate] = useState(today);
  const [filter, setFilter] = useState<ChartFilter>('all');
  const [sort, setSort] = useState<ChartSort>('departure');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ChartDayResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  // "Loading" is derived: the filters changed and their answer has not arrived yet, or a
  // manual refresh is running. Background refreshes stay silent.
  const requestKey = `${date}|${filter}|${sort}|${page}|${debouncedQuery}`;
  const [settledKey, setSettledKey] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [tick, setTick] = useState(0); // bumped by the refresh button and the 60s timer
  const loading = settledKey !== requestKey || refreshing;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let cancelled = false; // set when filters change or the panel closes mid-request
    const key = `${date}|${filter}|${sort}|${page}|${debouncedQuery}`;
    const params = new URLSearchParams({ date, bucket: filter, sort, page: String(page), limit: String(PAGE_SIZE) });
    if (debouncedQuery) params.set('q', debouncedQuery);

    adminFetch(`${apiUrl}/api/v1/admin/ops/charts/day?${params.toString()}`)
      .then((res) => res.json() as Promise<ChartDayResponse>)
      .then((json) => {
        if (cancelled) return;
        if (json.success) {
          setData(json);
          setError(null);
        } else {
          setError(json.error || 'Failed to load chart status');
        }
      })
      .catch((err: Error) => {
        if (!cancelled && err.message !== 'UNAUTHORIZED') setError('Network error while loading chart status');
      })
      .finally(() => {
        if (cancelled) return;
        setSettledKey(key);
        setRefreshing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [adminFetch, apiUrl, date, filter, sort, page, debouncedQuery, tick]);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), REFRESH_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const summary = data?.summary;
  const rows = data?.rows || [];
  const pagination = data?.pagination;
  const remaining = summary ? summary.pending + summary.firstOnly : 0;
  // Fetch times are judged against the server's clock, not the browser's
  const generatedMs = data ? Date.parse(data.generatedAt) : 0;

  const chips: { id: ChartFilter; label: string; count: number | undefined; color: string }[] = [
    { id: 'all', label: 'All', count: summary?.total, color: 'text-textMain' },
    { id: 'both', label: 'Completed', count: summary?.both, color: 'text-emerald-400' },
    { id: 'firstOnly', label: 'First only', count: summary?.firstOnly, color: 'text-cyan-400' },
    { id: 'pending', label: 'Pending', count: summary?.pending, color: 'text-textMain' },
    { id: 'due', label: 'Due now', count: summary?.due, color: 'text-amber-400' },
    { id: 'missed', label: 'Missed', count: summary?.missed, color: 'text-red-400' },
  ];

  const dates = [
    { label: 'Yesterday', value: shiftDate(today, -1) },
    { label: 'Today', value: today },
    { label: 'Tomorrow', value: shiftDate(today, 1) },
  ];

  const firstShown = pagination && pagination.total > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const lastShown = pagination ? Math.min(pagination.total, pagination.page * pagination.limit) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
        role="dialog"
        aria-modal="true"
        aria-label="Reservation charts by train"
        className="w-full max-w-6xl bg-[#0f1014] border border-white/[0.12] rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden relative"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Radio size={20} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-textMain tracking-tight">Reservation Charts</h3>
              <p className="text-xs text-textMuted font-mono mt-0.5">
                {summary ? `${summary.total.toLocaleString()} trains leaving origin on ${formatDateLabel(date)}` : formatDateLabel(date)}
                {data?.generatedAt && <span> · updated {formatIstTime(data.generatedAt)}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center p-0.5 bg-[#08080a] border border-white/[0.08] rounded-xl">
              {dates.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => {
                    setDate(d.value);
                    setPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer active:scale-95 ${
                    date === d.value ? 'bg-[#1e2026] text-white font-semibold' : 'text-textMuted hover:text-textMain'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setRefreshing(true);
                setTick((t) => t + 1);
              }}
              disabled={loading}
              aria-label="Refresh"
              className="p-2 bg-[#181920] hover:bg-white/5 active:scale-95 border border-white/10 rounded-xl text-textMuted hover:text-textMain transition-all cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin text-brand' : ''} />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 rounded-xl text-textMuted hover:text-textMain hover:bg-white/5 cursor-pointer ml-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 pt-4 shrink-0 font-mono text-xs">
          {[
            { label: 'Total trains', value: summary?.total, color: 'text-textMain' },
            { label: 'Completed', value: summary?.both, color: 'text-emerald-400' },
            { label: 'First only', value: summary?.firstOnly, color: 'text-cyan-400' },
            { label: 'Pending', value: summary?.pending, color: 'text-textMain' },
            { label: 'Missed', value: summary?.missed, color: 'text-red-400' },
          ].map((k) => (
            <div key={k.label} className="bg-[#090a0d] border border-white/[0.06] rounded-xl p-2.5 sm:p-3">
              <span className="text-[10px] text-textMuted uppercase tracking-wider block mb-1 truncate">{k.label}</span>
              <span className={`text-base sm:text-lg font-bold tabular-nums ${k.color}`}>{k.value?.toLocaleString() ?? '—'}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-[11px] font-mono text-textMuted shrink-0">
          <span>First chart ✓ <span className="text-textMain font-medium tabular-nums">{summary?.firstDone.toLocaleString() ?? '—'}</span></span>
          <span>Final chart ✓ <span className="text-textMain font-medium tabular-nums">{summary?.finalDone.toLocaleString() ?? '—'}</span></span>
          <span>Remaining <span className="text-textMain font-medium tabular-nums">{summary ? remaining.toLocaleString() : '—'}</span></span>
          <span>Due now <span className="text-amber-400 font-medium tabular-nums">{summary?.due.toLocaleString() ?? '—'}</span></span>
        </div>

        {/* Next up */}
        {data && data.nextUp.length > 0 && (
          <div className="flex items-center gap-2 pt-3 shrink-0 overflow-x-auto scrollbar-none">
            <span className="text-[10px] text-textMuted uppercase tracking-wider font-mono shrink-0">Next</span>
            {data.nextUp.slice(0, 6).map((n) => (
              <span
                key={`${n.trainNo}-${n.kind}`}
                title={n.trainName}
                className="shrink-0 px-2 py-0.5 rounded-lg bg-[#08080a] border border-white/[0.06] text-[11px] font-mono text-textMain"
              >
                {n.trainNo} <span className="text-textMuted">{n.kind}</span> {formatIstAt(n.at, date)}
              </span>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 py-3 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {chips.map((chip) => {
              const selected = filter === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => {
                    setFilter(chip.id);
                    setPage(1);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all shrink-0 cursor-pointer border active:scale-95 ${
                    selected
                      ? 'bg-[#1e2026] border-white/20 text-white font-semibold shadow-sm'
                      : 'bg-[#08080a] hover:bg-white/5 border-white/[0.06] text-textMuted hover:text-textMain'
                  }`}
                >
                  <span>{chip.label}</span>
                  <span className={`px-1.5 rounded text-[10px] bg-white/[0.04] ${chip.color} font-medium tabular-nums`}>
                    {chip.count?.toLocaleString() ?? '—'}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 lg:w-64">
              <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Train no, name, station"
                aria-label="Search trains"
                className="w-full pl-9 pr-3 py-1.5 bg-[#08080a] border border-white/10 rounded-xl text-xs font-mono text-textMain placeholder:text-textMuted/50 focus:outline-none focus:border-brand/60 transition-colors"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as ChartSort);
                setPage(1);
              }}
              aria-label="Sort"
              className="px-3 py-1.5 bg-[#08080a] border border-white/10 rounded-xl text-xs font-mono text-textMain focus:outline-none focus:border-brand/60 transition-colors cursor-pointer"
            >
              <option value="departure">Sort: departure</option>
              <option value="next">Sort: next fetch</option>
              <option value="train">Sort: train no</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div
          aria-busy={loading}
          className={`flex-1 overflow-auto border border-white/[0.08] rounded-2xl bg-[#0a0b0e] shadow-inner scrollbar-thin transition-opacity ${
            loading && data ? 'opacity-60' : ''
          }`}
        >
          <table className="w-full text-left text-xs min-w-[860px]">
            <thead className="bg-[#08080a] border-b border-white/[0.06] text-textMuted font-mono text-[10px] uppercase tracking-wider sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2.5">Train</th>
                <th className="px-3 py-2.5">Route</th>
                <th className="px-3 py-2.5">Departs</th>
                <th className="px-3 py-2.5">First chart</th>
                <th className="px-3 py-2.5">Final chart</th>
                <th className="px-3 py-2.5">Vacant</th>
                <th className="px-4 py-2.5 text-right">Next</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-mono">
              {error && !data ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-red-400">{error}</td>
                </tr>
              ) : loading && !data ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-textMuted">Loading chart status…</td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-textMuted">No trains match these filters.</td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.trainNo} className="hover:bg-white/[0.02] transition-colors align-top">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${BUCKET_DOT[row.bucket]}`} />
                        <span className="text-textMain font-semibold tabular-nums">{row.trainNo}</span>
                      </div>
                      <div className="text-[10px] text-textMuted mt-0.5 max-w-[220px] truncate pl-3.5" title={row.trainName}>
                        {row.trainName}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-textMain whitespace-nowrap">
                      {row.from} <span className="text-textMuted">→</span> {row.to}
                    </td>
                    <td className="px-3 py-2.5 text-textMain tabular-nums">{row.departure}</td>
                    <td className="px-3 py-2.5"><ChartCell side={row.first} date={date} /></td>
                    <td className="px-3 py-2.5"><ChartCell side={row.final} date={date} /></td>
                    <td className="px-3 py-2.5"><VacantCell row={row} /></td>
                    <td className="px-4 py-2.5 text-right whitespace-nowrap">
                      {row.next ? (
                        <span className="text-textMain tabular-nums">
                          <span className="text-textMuted">{row.next.kind === 'first' ? 'First' : 'Final'}</span>{' '}
                          {Date.parse(row.next.at) <= generatedMs ? (
                            <span className="text-amber-400">due</span>
                          ) : (
                            formatIstAt(row.next.at, date)
                          )}
                        </span>
                      ) : (
                        <span className="text-textMuted">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 pt-3 text-[11px] font-mono text-textMuted shrink-0">
          <span className="tabular-nums">
            {pagination && pagination.total > 0
              ? `${firstShown.toLocaleString()}–${lastShown.toLocaleString()} of ${pagination.total.toLocaleString()}`
              : ''}
            {error && data && <span className="text-red-400 ml-2">{error}</span>}
          </span>
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => setPage(pagination.page - 1)}
                className="px-3 py-1 border border-white/10 rounded-lg disabled:opacity-40 hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
              >
                Previous
              </button>
              <span className="tabular-nums">{pagination.page} / {pagination.totalPages}</span>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage(pagination.page + 1)}
                className="px-3 py-1 border border-white/10 rounded-lg disabled:opacity-40 hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
