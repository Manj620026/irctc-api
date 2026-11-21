// Types and IST time helpers for the admin "Reservation Charts" day view
// (GET /api/v1/admin/ops/charts/day). All times are shown in IST regardless of the
// browser's time zone.

export type ChartStatus = 'done' | 'upcoming' | 'due' | 'missed';
export type ChartBucket = 'both' | 'firstOnly' | 'pending' | 'missed';
export type ChartFilter = 'all' | ChartBucket | 'due';
export type ChartSort = 'departure' | 'next' | 'train';

export interface ChartSide {
  status: ChartStatus;
  at: string | null; // IRCTC's own chart time
  syncedAt: string | null; // when we captured it
  expectedAt: string | null;
  fetchAt: string | null;
}

export interface ChartRow {
  trainNo: string;
  trainName: string;
  from: string;
  to: string;
  departure: string;
  departureAt: string;
  bucket: ChartBucket;
  first: ChartSide;
  final: ChartSide;
  vacant: number | null;
  byClass: Record<string, number> | null;
  checkedAt: string | null;
  next: { kind: 'first' | 'final'; at: string } | null;
}

export interface ChartDaySummary {
  total: number;
  firstDone: number;
  finalDone: number;
  both: number;
  firstOnly: number;
  pending: number;
  missed: number;
  due: number;
}

export interface ChartNextUp {
  trainNo: string;
  trainName: string;
  kind: 'first' | 'final';
  at: string;
}

/** `engines.chart.today` from GET /api/v1/admin/ops/workers. */
export interface ChartTodaySummary extends ChartDaySummary {
  date: string;
  nextUp: ChartNextUp[];
}

export interface ChartDayResponse {
  success: boolean;
  error?: string;
  date: string;
  generatedAt: string;
  summary: ChartDaySummary;
  nextUp: ChartNextUp[];
  rows: ChartRow[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

const timeFormat = new Intl.DateTimeFormat('en-IN', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'Asia/Kolkata',
});
const dayFormat = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });
const labelFormat = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });

/** IST calendar date (YYYY-MM-DD). */
export function istDate(ms: number = Date.now()): string {
  return new Date(ms + IST_OFFSET_MS).toISOString().slice(0, 10);
}

export function shiftDate(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** "20:10" in IST. */
export function formatIstTime(iso: string | null | undefined): string {
  return iso ? timeFormat.format(new Date(iso)) : '—';
}

/** "20:10", or "18 Nov 20:10" when the time falls on another day than `date`. */
export function formatIstAt(iso: string | null | undefined, date: string): string {
  if (!iso) return '—';
  const ms = Date.parse(iso);
  const time = timeFormat.format(ms);
  return istDate(ms) === date ? time : `${dayFormat.format(ms)} ${time}`;
}

/** "Thu, 19 Nov" */
export function formatDateLabel(date: string): string {
  return labelFormat.format(new Date(`${date}T12:00:00Z`));
}

export function formatAgo(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || !Number.isFinite(seconds)) return '—';
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${Math.round(seconds / 3600)}h`;
}
