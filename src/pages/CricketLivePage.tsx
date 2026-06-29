import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Wifi, WifiOff, Trophy, Clock, CheckCircle2, CalendarDays, Radio } from 'lucide-react';

import CricketMatchModal from '../components/CricketMatchModal';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LiveMatch {
  id: string;
 format?: string;
 title: string;
  matchType: string;
  status: string;
  score?: { team: string; score: string }[];
  matchStarted?: boolean;
  gender?: 'Men' | 'Women';
  venue?: string;
}

export interface ResultMatch {
  id: string;
  format?: string;
  title: string;
  matchType: string;
  status: string;
  score?: { team: string; score: string }[];
  date?: string;
  venue?: string;
  gender?: 'Men' | 'Women';
}

export interface FixtureMatch {
  id: string;
  format?: string;
  title: string;
  matchType: string;
  status: string;
  utcDate?: string;
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
      className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 border ${isWomen
          ? 'bg-pink-500/15 text-pink-300 border-pink-500/30'
          : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
        }`}
    >
      {isWomen ? '♀' : '♂'} {gender}
    </span>
  );
}

function MatchStatusBadge({ status }: { status: string }) {
  if (!status) return null;
  const s = status.toLowerCase();
  let color = 'bg-portal-surface-hover text-portal-text-muted border-portal-border';
  let dot = null;
  if (s.includes('stump') || s.includes('drawn') || s.includes('won by') || s.includes('abandon')) {
    color = 'bg-gray-500/10 text-gray-400 border-gray-500/30';
  } else if (s.includes('break') || s.includes('tea') || s.includes('lunch') || s.includes('rain') || s.includes('delay')) {
    color = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else if (s.includes('trail') || s.includes('lead') || s.includes('opt') || s.includes('need') || s.includes('won toss')) {
    color = 'bg-red-500/10 text-red-400 border-red-500/30';
    dot = <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse mr-1.5" />;
  }
  return (
    <span className={`inline-flex items-center text-[10px] font-mono font-bold px-2 py-0.5 border ${color}`}>
      {dot} {status}
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
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);

  const [formatFilter, setFormatFilter] = useState<string>('All');
  const [visibleResults, setVisibleResults] = useState(10);

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
    const id = setInterval(() => fetchTab('live', true), 45_000);
    return () => clearInterval(id);
  }, [activeTab, fetchTab]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const matchId = params.get('matchId');
    if (matchId && !isLoading) {
      const allMatches = [...liveMatches, ...resultMatches, ...fixtureMatches];
      const found = allMatches.find(m => m.id === matchId);
      if (found && !selectedMatch) setSelectedMatch(found);
    }
  }, [isLoading, liveMatches, resultMatches, fixtureMatches, selectedMatch]);

  const handleMatchClick = (m: any, tabName: string) => {
    window.history.pushState({}, '', `?matchId=${m.id}`);
    setSelectedMatch({ ...m, tab: tabName });
  };

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
      <div className="relative overflow-hidden border-b border-portal-border bg-portal-surface">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1600&auto=format&fit=crop" alt="Cricket Stadium" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-portal-surface to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.9)] animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">ICC International Cricket</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-portal-text-main leading-tight">
              Match Centre <span className="text-blue-400">Cricket</span>
            </h1>
            <p className="text-portal-text-main/50 text-xs mt-1 font-mono flex items-center gap-1.5">
              Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {activeTab === 'live' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" title="Live Syncing" />}
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
              className="flex items-center gap-1.5 text-[10px] font-mono text-portal-text-main/60 hover:text-blue-500 border border-portal-border hover:border-blue-500/30 px-3 py-1.5 transition-all disabled:opacity-50"
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
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-semibold border-t border-l border-r transition-all ${active
                    ? 'bg-portal-bg border-portal-border border-b-transparent text-portal-text-main'
                    : 'border-transparent text-portal-text-main/40 hover:text-portal-text-main/70 hover:bg-portal-surface-hover'
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

      {/* ── Filters ── */}
      {activeTab !== 'live' && (
        <div className="flex items-center gap-2 px-6 sm:px-8 py-3 bg-portal-surface border-b border-portal-border/50">
          <span className="text-[10px] font-mono text-portal-text-muted uppercase tracking-widest mr-2">Filter</span>
          {['All', 'Test', 'ODI', 'T20'].map(f => (
            <button key={f} onClick={() => { setFormatFilter(f); setVisibleResults(10); }} className={`px-2 py-1 text-[10px] font-mono font-bold border transition-colors ${formatFilter === f ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-transparent text-portal-text-muted border-portal-border hover:border-portal-border/80'}`}>{f}</button>
          ))}
        </div>
      )}

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
                  <div className="flex overflow-x-auto snap-x gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
                    {liveMatches.map((m, idx) => (
                      <div key={idx} className="shrink-0 w-[85vw] sm:w-[400px] snap-start">
                        <LiveCard match={m} idx={idx} onClick={() => handleMatchClick(m, 'live')} />
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* ── RESULTS TAB ── */}
              {activeTab === 'results' && (() => {
                const filtered = formatFilter === 'All' ? resultMatches : resultMatches.filter(m => m.matchType?.toLowerCase() === formatFilter.toLowerCase() || m.format?.toLowerCase() === formatFilter.toLowerCase());
                return filtered.length === 0 ? (
                  <EmptyState message={`No recent results available for ${formatFilter}.`} />
                ) : (
                  <>
                    <div className="flex flex-col border border-portal-border/50 bg-portal-surface rounded-sm overflow-hidden">
                      {filtered.slice(0, visibleResults).map((m, idx) => (
                        <ResultCard key={idx} match={m} idx={idx} onClick={() => handleMatchClick(m, 'results')} />
                      ))}
                    </div>
                    {filtered.length > visibleResults && (
                      <div className="mt-6 text-center">
                        <button onClick={() => setVisibleResults(prev => prev + 10)} className="px-6 py-2 text-xs font-mono font-bold text-portal-text-main bg-portal-surface-hover border border-portal-border hover:border-portal-brand transition-colors">Load More</button>
                      </div>
                    )}
                  </>
                );
              })()}

              {/* ── FIXTURES TAB ── */}
              {activeTab === 'fixtures' && (() => {
                const filtered = formatFilter === 'All' ? fixtureMatches : fixtureMatches.filter(m => m.matchType?.toLowerCase() === formatFilter.toLowerCase() || m.format?.toLowerCase() === formatFilter.toLowerCase());
                return filtered.length === 0 ? (
                  <EmptyState message={`No upcoming fixtures found for ${formatFilter}.`} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map((m, idx) => (
                      <FixtureCard key={idx} match={m} idx={idx} onClick={() => handleMatchClick(m, 'fixtures')} />
                    ))}
                  </div>
                );
              })()}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Footer ── */}
      <p className="text-center text-[10px] font-mono text-portal-text-muted/60 pb-4">
        Data via CricAPI · Auto-refreshes every 60s (Live tab) ·{' '}
        {isMock ? 'Add CRICKET_API_KEY in .env for live data' : 'Live data active'}
      </p>

      {selectedMatch && (
        <CricketMatchModal match={selectedMatch} onClose={() => { window.history.pushState({}, '', window.location.pathname); setSelectedMatch(null); }} />
      )}
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

function LiveCard({ match: m, idx, onClick }: { match: LiveMatch; idx: number; onClick?: () => void }) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: idx * 0.04 }}
      className="flex flex-col bg-portal-surface hover:bg-portal-surface-hover transition-colors cursor-pointer border border-transparent rounded-sm overflow-hidden"
    >
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] text-portal-text-muted font-mono uppercase tracking-wider">
          <span>{m.matchType || 'MATCH'}</span>
          {m.gender && <span>• {m.gender}</span>}
        </div>
        <span className="flex items-center gap-1.5 text-[9px] font-bold text-red-500 font-mono tracking-widest">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          LIVE
        </span>
      </div>

      <div className="px-4 pb-3 flex flex-col gap-2">
        {m.score && m.score.length > 0 ? (
          m.score.map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className={`font-bold text-sm flex items-center gap-2 ${i === 0 ? 'text-portal-text-main' : 'text-portal-text-main'}`}>
                {i === 0 && <span className="w-1 h-3 bg-red-500 inline-block rounded-sm" />}
                {s.team}
              </span>
              <span className={`font-mono text-sm tracking-tight ${i === 0 ? 'text-portal-text-main font-bold' : 'text-portal-text-main'}`}>{s.score}</span>
            </div>
          ))
        ) : (
          <div className="font-mono text-portal-text-muted text-xs italic">Score not yet available</div>
        )}
      </div>

      <div className="mx-4 pb-3 border-b border-portal-border/40" />
      <div className="px-4 py-2.5 bg-portal-surface-hover border-t border-portal-border/40">
        <MatchStatusBadge status={m.status} />
      </div>
    </motion.div>
  );
}

function ResultCard({ match: m, idx, onClick }: { match: ResultMatch; idx: number; onClick?: () => void }) {
  // Determine winner visually from status text if possible
  const statusLower = m.status ? m.status.toLowerCase() : '';
  let winningTeamIndex = -1;
  if (m.score && m.score.length === 2) {
    if (statusLower.includes(m.score[0].team.toLowerCase())) winningTeamIndex = 0;
    else if (statusLower.includes(m.score[1].team.toLowerCase())) winningTeamIndex = 1;
  }

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: idx * 0.04 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-portal-surface hover:bg-portal-surface-hover transition-colors cursor-pointer border-b border-portal-border/50 last:border-0 gap-3 sm:gap-6"
    >
      <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-center sm:w-[20%] gap-1">
        <span className="text-[10px] text-portal-text-muted font-mono uppercase tracking-wider">{m.matchType || 'MATCH'}</span>
        <span className="text-[10px] text-portal-text-muted font-mono">{m.date}</span>
      </div>

      <div className="flex flex-col gap-1.5 sm:w-[40%]">
        {m.score && m.score.length > 0 && (
          m.score.map((s, i) => {
            const isWinner = winningTeamIndex === i || (winningTeamIndex === -1 && i === 0);
            return (
              <div key={i} className="flex items-center justify-between">
                <span className={`font-bold text-sm flex items-center gap-1 ${isWinner ? 'text-portal-text-main' : 'text-portal-text-muted'}`}>
                  {isWinner && <span className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-portal-text-main border-b-[4px] border-b-transparent mr-1 inline-block" />}
                  {!isWinner && <span className="w-1.5 mr-1" />}
                  {s.team}
                </span>
                <span className={`font-mono text-sm tracking-tight ${isWinner ? 'text-portal-text-main font-bold' : 'text-portal-text-muted'}`}>{s.score}</span>
              </div>
            );
          })
        )}
      </div>

      <div className="flex sm:justify-end sm:w-[40%] mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-portal-border/40">
        <span className="text-xs font-bold text-portal-text-main leading-snug sm:text-right">{m.status}</span>
      </div>
    </motion.div>
  );
}

function FixtureCard({ match: m, idx, onClick }: { match: FixtureMatch; idx: number; onClick?: () => void }) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: idx * 0.04 }}
      className="flex flex-col bg-portal-surface hover:bg-portal-surface-hover transition-colors cursor-pointer border border-transparent rounded-sm overflow-hidden"
    >
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] text-portal-text-muted font-mono uppercase tracking-wider">
          <span>{m.matchType || 'MATCH'}</span>
          {m.gender && <span>• {m.gender}</span>}
        </div>
        <span className="text-[9px] font-bold text-blue-400 font-mono tracking-widest uppercase">Upcoming</span>
      </div>

      <div className="px-4 pb-4">
        <p className="text-sm font-bold text-portal-text-main leading-snug">{m.title}</p>
      </div>

      <div className="mx-4 pb-3 border-b border-portal-border/40" />
      <div className="px-4 py-2.5 bg-portal-surface-hover border-t border-portal-border/40 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-portal-text-main">
            {m.utcDate ? new Date(m.utcDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBD'}
          </span>
          <span className="text-[10px] font-mono text-portal-text-muted">
            {m.utcDate ? new Date(m.utcDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }) : 'TBD'}
          </span>
        </div>
        {m.venue && <span className="text-[9px] font-mono text-portal-text-muted/60 truncate max-w-[40%] text-right">{m.venue}</span>}
      </div>
    </motion.div>
  );
}
