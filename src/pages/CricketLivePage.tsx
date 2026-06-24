import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Wifi, WifiOff, Trophy, Clock, CheckCircle2, CalendarDays, Radio } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface LiveMatch {
 title: string;
 matchType: string;
 status: string;
 score?: string;
 matchStarted?: boolean;
 gender?: 'Men' | 'Women';
}

interface ResultMatch {
 title: string;
 matchType: string;
 status: string;
 score?: string;
 date: string;
 venue?: string;
 gender?: 'Men' | 'Women';
}

interface FixtureMatch {
 title: string;
 matchType: string;
 status: string;
 date: string;
 time?: string;
 venue?: string;
 gender?: 'Men' | 'Women';
}

type Tab = 'live' | 'results' | 'fixtures';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const matchTypeBadgeColor: Record<string, string> = {
 TEST: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
 ODI: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
 T20: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
 T20I: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
};

function MatchTypeBadge({ type }: { type: string }) {
 const cls = matchTypeBadgeColor[type?.toUpperCase()] ?? 'bg-portal-surface-hover text-portal-text-muted border-portal-border';
 return (
 <span className={`inline-flex items-center text-[9px] font-mono font-bold px-2 py-0.5 border ${cls}`}>
 {type || 'MATCH'}
 </span>
 );
}

function GenderBadge({ gender }: { gender?: 'Men' | 'Women' }) {
 if (!gender) return null;
 const isWomen = gender === 'Women';
 return (
 <span
 className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 border ${
 isWomen
 ? 'bg-pink-500/15 text-pink-300 border-pink-500/30'
 : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
 }`}
 >
 {isWomen ? '♀' : '♂'} {gender}
 </span>
 );
}

function SkeletonCard() {
 return (
 <div className="animate-pulse border border-portal-border bg-portal-surface p-5 space-y-3">
 <div className="flex gap-2 items-center">
 <div className="h-4 w-12 bg-portal-surface-hover " />
 <div className="h-4 w-2/3 bg-portal-surface-hover " />
 </div>
 <div className="h-5 bg-portal-surface-hover w-3/4" />
 <div className="h-3 bg-portal-surface-hover w-1/2" />
 <div className="h-px bg-portal-surface-hover " />
 <div className="h-3 bg-portal-surface-hover w-1/3" />
 </div>
 );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CricketLivePage() {
 const [activeTab, setActiveTab] = useState<Tab>('live');

 const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([]);
 const [resultMatches, setResultMatches] = useState<ResultMatch[]>([]);
 const [fixtureMatches, setFixtureMatches] = useState<FixtureMatch[]>([]);

 const [isMock, setIsMock] = useState(true);
 const [isLoading, setIsLoading] = useState(true);
 const [isRefreshing, setIsRefreshing] = useState(false);
 const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

 // ── Fetch helpers ──

 const fetchTab = useCallback(async (tab: Tab, isRefresh = false) => {
 if (isRefresh) setIsRefreshing(true);
 else setIsLoading(true);

 try {
 const endpoint =
 tab === 'live' ? '/api/cricket/live' :
 tab === 'results' ? '/api/cricket/results' :
 '/api/cricket/fixtures';

 const res = await fetch(endpoint);
 const data = await res.json();

 if (tab === 'live') setLiveMatches(data.matches || []);
 if (tab === 'results') setResultMatches(data.matches || []);
 if (tab === 'fixtures') setFixtureMatches(data.matches || []);

 setIsMock(data.isMock ?? true);
 setLastUpdated(new Date());
 } catch (err) {
 console.error('Cricket fetch failed:', err);
 } finally {
 setIsLoading(false);
 setIsRefreshing(false);
 }
 }, []);

 // Initial load + auto-refresh for live tab
 useEffect(() => {
 fetchTab(activeTab);
 }, [activeTab, fetchTab]);

 useEffect(() => {
 if (activeTab !== 'live') return;
 const id = setInterval(() => fetchTab('live', true), 60_000);
 return () => clearInterval(id);
 }, [activeTab, fetchTab]);

 // ── Tab config ──
 const TABS: { id: Tab; label: string; Icon: React.ElementType; color: string }[] = [
 { id: 'live', label: 'Live', Icon: Radio, color: 'text-red-400' },
 { id: 'results', label: 'Results', Icon: CheckCircle2, color: 'text-green-400' },
 { id: 'fixtures', label: 'Fixtures', Icon: CalendarDays, color: 'text-blue-400' },
 ];

 // ── Render ──

 return (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="space-y-6"
 >
 {/* ── Page Header ────────────────────────────────────────────── */}
 <div className="relative overflow-hidden border border-blue-500/30 shadow-[0_4px_30px_rgba(59,130,246,0.12)] bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a2855]">
 <div className="absolute inset-0 opacity-20"
 style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%)' }} />
 <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none text-blue-400">
 <Trophy size={140} />
 </div>

 <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
 <div>
 <div className="flex items-center gap-2 mb-2">
 <span className="w-2 h-2 bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.9)] animate-pulse" />
 <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">ICC International Cricket</span>
 </div>
 <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
 Match Centre <span className="text-blue-400">Cricket</span>
 </h1>
 <p className="text-white/50 text-xs mt-1 font-mono">
 Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
 </p>
 </div>

 <div className="flex items-center gap-3">
 {isMock ? (
 <span className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 ">
 <WifiOff size={10} /> Demo Data
 </span>
 ) : (
 <span className="flex items-center gap-1.5 text-[10px] font-mono text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 ">
 <Wifi size={10} />
 <span className="w-1.5 h-1.5 bg-green-500 animate-pulse" />
 Live API
 </span>
 )}
 <button
 onClick={() => fetchTab(activeTab, true)}
 disabled={isRefreshing}
 className="flex items-center gap-1.5 text-[10px] font-mono text-white/60 hover:text-blue-400 border border-white/10 hover:border-blue-500/30 px-3 py-1.5 transition-all disabled:opacity-50"
 >
 <RefreshCw size={10} className={isRefreshing ? 'animate-spin text-blue-400' : ''} />
 {isRefreshing ? 'Refreshing...' : 'Refresh'}
 </button>
 </div>
 </div>

 {/* ── Tabs ── */}
 <div className="relative z-10 flex gap-1 px-6 sm:px-8 pb-0">
 {TABS.map(({ id, label, Icon, color }) => {
 const active = activeTab === id;
 return (
 <button
 key={id}
 onClick={() => setActiveTab(id)}
 className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-semibold border-t border-l border-r transition-all ${
 active
 ? 'bg-portal-bg border-portal-border text-white'
 : 'border-transparent text-white/40 hover:text-white/70 hover:bg-white/5'
 }`}
 >
 <Icon size={11} className={active ? color : ''} />
 {label}
 {id === 'live' && (
 <span className="w-1.5 h-1.5 bg-red-500 animate-pulse" />
 )}
 </button>
 );
 })}
 </div>
 </div>

 {/* ── Content ──────────────────────────────────────────────────── */}
 <AnimatePresence mode="wait">
 <motion.div
 key={activeTab}
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -8 }}
 transition={{ duration: 0.2 }}
 >
 {isLoading ? (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
 </div>
 ) : (
 <>
 {/* ── LIVE TAB ── */}
 {activeTab === 'live' && (
 liveMatches.length === 0 ? (
 <EmptyState message="No live matches right now. Check back soon." />
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {liveMatches.map((m, idx) => (
 <LiveCard key={idx} match={m} idx={idx} />
 ))}
 </div>
 )
 )}

 {/* ── RESULTS TAB ── */}
 {activeTab === 'results' && (
 resultMatches.length === 0 ? (
 <EmptyState message="No recent results available." />
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {resultMatches.map((m, idx) => (
 <ResultCard key={idx} match={m} idx={idx} />
 ))}
 </div>
 )
 )}

 {/* ── FIXTURES TAB ── */}
 {activeTab === 'fixtures' && (
 fixtureMatches.length === 0 ? (
 <EmptyState message="No upcoming fixtures found." />
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {fixtureMatches.map((m, idx) => (
 <FixtureCard key={idx} match={m} idx={idx} />
 ))}
 </div>
 )
 )}
 </>
 )}
 </motion.div>
 </AnimatePresence>

 {/* ── Footer ── */}
 <p className="text-center text-[10px] font-mono text-portal-text-muted/60 pb-4">
 Data via CricAPI · Auto-refreshes every 60s (Live tab) ·{' '}
 {isMock ? 'Add CRICKET_API_KEY in .env for live data' : 'Live data active'}
 </p>
 </motion.div>
 );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
 return (
 <div className="text-center py-20 border border-dashed border-portal-border text-portal-text-muted font-mono text-sm">
 {message}
 </div>
 );
}

function LiveCard({ match: m, idx }: { match: LiveMatch; idx: number; key?: React.Key }) {
 return (
 <motion.div
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.25, delay: idx * 0.04 }}
 className="flex flex-col p-5 border bg-portal-surface border-red-500/30 shadow-[0_0_14px_rgba(239,68,68,0.08)] hover:shadow-[0_2px_20px_rgba(239,68,68,0.15)] transition-all"
 >
 {/* Header */}
 <div className="flex items-start justify-between gap-2 mb-3">
 <div className="flex flex-col gap-1.5 min-w-0">
 <div className="flex items-center gap-1.5 flex-wrap">
 <MatchTypeBadge type={m.matchType} />
 <GenderBadge gender={m.gender} />
 </div>
 <p className="text-sm font-bold text-portal-text-main leading-snug">{m.title}</p>
 </div>
 <span className="shrink-0 flex items-center gap-1 text-[9px] font-mono font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 ">
 <span className="w-1.5 h-1.5 bg-red-500 animate-pulse" />
 LIVE
 </span>
 </div>

 {/* Score */}
 {m.score ? (
 <div className="mb-3 font-mono font-bold text-blue-300 text-sm tracking-tight leading-relaxed whitespace-pre-line">
 {m.score}
 </div>
 ) : (
 <div className="mb-3 font-mono text-portal-text-muted text-xs italic">Score not yet available</div>
 )}

 {/* Status footer */}
 <div className="mt-auto pt-3 border-t border-portal-border/40">
 <span className="text-[10px] font-mono font-semibold text-red-400">{m.status}</span>
 </div>
 </motion.div>
 );
}

function ResultCard({ match: m, idx }: { match: ResultMatch; idx: number; key?: React.Key }) {
 return (
 <motion.div
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.25, delay: idx * 0.04 }}
 className="flex flex-col p-5 border bg-portal-surface border-portal-border hover:border-green-500/30 hover:shadow-[0_2px_20px_rgba(34,197,94,0.08)] transition-all"
 >
 {/* Header */}
 <div className="flex items-start justify-between gap-2 mb-3">
 <div className="flex flex-col gap-1.5 min-w-0">
 <div className="flex items-center gap-1.5 flex-wrap">
 <MatchTypeBadge type={m.matchType} />
 <GenderBadge gender={m.gender} />
 </div>
 <p className="text-sm font-bold text-portal-text-main leading-snug">{m.title}</p>
 </div>
 <span className="shrink-0 flex items-center gap-1 text-[9px] font-mono font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 ">
 <CheckCircle2 size={9} />
 FT
 </span>
 </div>

 {/* Score */}
 {m.score && (
 <div className="mb-3 font-mono text-portal-text-main/80 text-xs tracking-tight leading-relaxed whitespace-pre-line">
 {m.score}
 </div>
 )}

 {/* Result */}
 <div className="mb-3 font-semibold text-green-400 text-sm leading-snug">
 {m.status}
 </div>

 {/* Footer */}
 <div className="flex items-center justify-between mt-auto pt-3 border-t border-portal-border/40 gap-2">
 <span className="text-[10px] font-mono text-portal-text-muted flex items-center gap-1">
 <Clock size={9} /> {m.date}
 </span>
 {m.venue && (
 <span className="text-[10px] font-mono text-portal-text-muted truncate max-w-[55%] text-right">
 📍 {m.venue}
 </span>
 )}
 </div>
 </motion.div>
 );
}

function FixtureCard({ match: m, idx }: { match: FixtureMatch; idx: number; key?: React.Key }) {
 return (
 <motion.div
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.25, delay: idx * 0.04 }}
 className="flex flex-col p-5 border bg-portal-surface border-portal-border hover:border-blue-500/30 hover:shadow-[0_2px_20px_rgba(59,130,246,0.08)] transition-all"
 >
 {/* Header */}
 <div className="flex items-start justify-between gap-2 mb-3">
 <div className="flex flex-col gap-1.5 min-w-0">
 <div className="flex items-center gap-1.5 flex-wrap">
 <MatchTypeBadge type={m.matchType} />
 <GenderBadge gender={m.gender} />
 </div>
 <p className="text-sm font-bold text-portal-text-main leading-snug">{m.title}</p>
 </div>
 <span className="shrink-0 flex items-center gap-1 text-[9px] font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 ">
 <CalendarDays size={9} />
 UPCOMING
 </span>
 </div>

 {/* Countdown strip */}
 <div className="flex items-center gap-3 mb-3 bg-blue-500/5 border border-blue-500/10 px-3 py-2">
 <Clock size={12} className="text-blue-400 shrink-0" />
 <div className="flex flex-col min-w-0">
 <span className="text-xs font-mono font-bold text-blue-300">{m.date}</span>
 {m.time && (
 <span className="text-[10px] font-mono text-portal-text-muted">{m.time}</span>
 )}
 </div>
 </div>

 {/* Footer */}
 {m.venue && (
 <div className="mt-auto pt-3 border-t border-portal-border/40">
 <span className="text-[10px] font-mono text-portal-text-muted">
 📍 {m.venue}
 </span>
 </div>
 )}
 </motion.div>
 );
}
