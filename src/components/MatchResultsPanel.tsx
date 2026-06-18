import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, RefreshCw, Clock } from 'lucide-react';

interface Goal {
  minute: number;
  scorer: string;
  teamId?: number;
}

interface MatchResult {
  team1: string;
  flag1: string;
  score1: number | string;
  team2: string;
  flag2: string;
  score2: number | string;
  status: string;
  date: string;
  goals?: Goal[];
}

// Static fallback shown when API key is not yet configured (Today & Tomorrow upcoming schedule)
const FALLBACK_MATCHES: MatchResult[] = [
  {
    team1: 'Japan', flag1: 'jp', score1: '-', team2: 'Croatia', flag2: 'hr', score2: '-', status: 'UPCOMING', date: '16 Jun, 18:00',
  },
  {
    team1: 'Spain', flag1: 'es', score1: '-', team2: 'Netherlands', flag2: 'nl', score2: '-', status: 'UPCOMING', date: '16 Jun, 21:00',
  },
  {
    team1: 'England', flag1: 'gb', score1: '-', team2: 'Italy', flag2: 'it', score2: '-', status: 'UPCOMING', date: '17 Jun, 15:00',
  },
  {
    team1: 'Argentina', flag1: 'ar', score1: '-', team2: 'Portugal', flag2: 'pt', score2: '-', status: 'UPCOMING', date: '17 Jun, 18:00',
  },
  {
    team1: 'France', flag1: 'fr', score1: '-', team2: 'Belgium', flag2: 'be', score2: '-', status: 'UPCOMING', date: '17 Jun, 21:00',
  },
];

// Static fallback shown when API key is not yet configured (Ordered descending by date)
const FALLBACK_RESULTS: MatchResult[] = [
  {
    team1: 'Japan', flag1: 'jp', score1: 3, team2: 'Senegal', flag2: 'sn', score2: 1, status: 'FT', date: 'Jun 15',
    goals: [
      { minute: 14, scorer: 'Mitoma' },
      { minute: 38, scorer: 'Dia' },
      { minute: 67, scorer: 'Kubo' },
      { minute: 82, scorer: 'Doan' }
    ]
  },
  {
    team1: 'Australia', flag1: 'au', score1: 2, team2: 'Türkiye', flag2: 'tr', score2: 0, status: 'FT', date: 'Jun 14',
    goals: [
      { minute: 31, scorer: 'Duke' },
      { minute: 78, scorer: 'Irvine' }
    ]
  },
  {
    team1: 'S.Korea', flag1: 'kr', score1: 2, team2: 'Czechia', flag2: 'cz', score2: 1, status: 'FT', date: 'Jun 14',
    goals: [
      { minute: 22, scorer: 'Son' },
      { minute: 55, scorer: 'Schick' },
      { minute: 73, scorer: 'Hwang' }
    ]
  },
  {
    team1: 'Mexico', flag1: 'mx', score1: 2, team2: 'S.Africa', flag2: 'za', score2: 0, status: 'FT', date: 'Jun 13',
    goals: [
      { minute: 40, scorer: 'Giménez' },
      { minute: 89, scorer: 'Martin' }
    ]
  },
  {
    team1: 'USA', flag1: 'us', score1: 4, team2: 'Paraguay', flag2: 'py', score2: 1, status: 'FT', date: 'Jun 12',
    goals: [
      { minute: 10, scorer: 'Pulisic' },
      { minute: 28, scorer: 'Balogun' },
      { minute: 45, scorer: 'Almirón' },
      { minute: 61, scorer: 'Weah' },
      { minute: 85, scorer: 'Pepi' }
    ]
  },
];

export default function MatchResultsPanel({ setActiveTab, activeTab }: { setActiveTab: (tab: any) => void, activeTab?: string }) {
  const isAllScores = activeTab === 'fifaAllScores';
  const currentFallback = isAllScores ? FALLBACK_MATCHES : FALLBACK_RESULTS;
  const [matches, setMatches] = useState<MatchResult[]>(currentFallback);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [countdown, setCountdown] = useState(300);
  const [apiStatus, setApiStatus] = useState<'live' | 'fallback' | 'loading'>('loading');

  const fetchMatches = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const statusQuery = isAllScores ? 'SCHEDULED' : 'FINISHED';
      const res = await fetch(`/api/football/wc2026?status=${statusQuery}`);
      const data = await res.json();

      if (res.ok && data.matches && data.matches.length > 0) {
        // Map API response — flag1/flag2 are crest SVG URLs from football-data.org
        const mapped: MatchResult[] = data.matches.slice(0, 5).map((m: any) => ({
          team1: m.team1,
          flag1: m.flag1, // SVG crest URL or null
          score1: m.score1,
          team2: m.team2,
          flag2: m.flag2,
          score2: m.score2,
          status: m.status,
          date: m.date,
          goals: m.goals,
        }));
        setMatches(mapped);
        setApiStatus('live');
      } else {
        // API key not set or no matches yet — show fallback
        setMatches(currentFallback);
        setApiStatus('fallback');
      }
    } catch {
      setMatches(currentFallback);
      setApiStatus('fallback');
    } finally {
      setIsRefreshing(false);
      setLastUpdated(new Date());
      setCountdown(300);
    }
  }, [isAllScores, currentFallback]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchMatches, 300000);
    return () => clearInterval(interval);
  }, [fetchMatches]);

  // Countdown timer
  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown(prev => (prev <= 1 ? 300 : prev - 1));
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <section
      id="fifa-match-results-card"
      className="border border-[#c9a84c]/30 rounded-xl flex flex-col overflow-hidden transition-all bg-portal-surface shadow-[0_4px_20px_rgba(201,168,76,0.08)] relative"
    >
      {/* Glow accent */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-[#c9a84c]/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />

      {/* Header */}
      <header className="p-3 border-b flex items-center justify-between border-[#c9a84c]/20 bg-[#c9a84c]/5 relative z-10">
        <h3 className="text-xs font-bold font-mono tracking-wider flex items-center text-portal-text-main gap-1.5">
          <Trophy size={12} className="text-[#c9a84c]" />
          <span>FIFA WC 2026</span>
          <span className="text-[9px] bg-[#c9a84c]/20 text-[#c9a84c] px-1.5 py-0.5 rounded font-mono uppercase tracking-widest font-bold ring-1 ring-[#c9a84c]/30 ml-1">
            {isAllScores ? 'Schedule' : 'Results'}
          </span>
          {apiStatus === 'live' && (
            <span className="ml-auto flex items-center gap-1 text-[8px] font-mono text-green-500">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>Live
            </span>
          )}
          {apiStatus === 'fallback' && (
            <span className="ml-auto flex items-center gap-1 text-[8px] font-mono text-amber-500">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>Demo
            </span>
          )}
        </h3>
        <button
          onClick={fetchMatches}
          disabled={isRefreshing}
          title="Refresh match results"
          className="flex items-center gap-1 text-[9px] font-mono text-portal-text-muted hover:text-[#c9a84c] transition-colors disabled:opacity-50 px-1.5 py-1 rounded hover:bg-[#c9a84c]/10"
        >
          <RefreshCw size={10} className={isRefreshing ? 'animate-spin text-[#c9a84c]' : ''} />
          <span>{isRefreshing ? 'Updating...' : 'Refresh'}</span>
        </button>
      </header>

      {/* Match list */}
      <div className="p-3 space-y-2 relative z-10">
        {matches.map((m, idx) => (
          <div
            key={idx}
            className="flex flex-col p-2 rounded-lg bg-portal-bg border border-portal-border/60 hover:border-[#c9a84c]/30 hover:shadow-[0_0_10px_rgba(201,168,76,0.06)] transition-all"
          >
            <div className="flex items-center gap-2">
              {/* Team 1 */}
              <div className="flex flex-col items-center w-10 shrink-0">
                <img
                  src={m.flag1 && m.flag1.startsWith('http') ? m.flag1 : `https://flagcdn.com/${m.flag1}.svg`}
                  alt={m.team1}
                  className="w-6 h-6 rounded-full object-cover border border-portal-border/50 mb-0.5"
                  onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
                />
                <span className="text-[9px] font-bold font-mono text-portal-text-main truncate w-full text-center">
                  {m.team1}
                </span>
              </div>

              {/* Score */}
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div className="text-sm font-black font-mono text-portal-text-main tracking-widest">
                  {m.score1} <span className="text-portal-text-muted/40 font-light">-</span> {m.score2}
                </div>
                <div className="text-[8px] font-bold font-mono uppercase tracking-widest text-[#c9a84c] bg-[#c9a84c]/10 px-1.5 py-0.5 rounded-full mt-0.5">
                  {m.status}
                </div>
                <div className="text-[8px] text-portal-text-muted font-mono mt-0.5">{m.date}</div>
              </div>

              {/* Team 2 */}
              <div className="flex flex-col items-center w-10 shrink-0">
                <img
                  src={m.flag2 && m.flag2.startsWith('http') ? m.flag2 : `https://flagcdn.com/${m.flag2}.svg`}
                  alt={m.team2}
                  className="w-6 h-6 rounded-full object-cover border border-portal-border/50 mb-0.5"
                  onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
                />
                <span className="text-[9px] font-bold font-mono text-portal-text-main truncate w-full text-center">
                  {m.team2}
                </span>
              </div>
            </div>
            {/* Scorers */}
            {m.goals && m.goals.length > 0 && (
              <div className="mt-1.5 text-[8px] text-portal-text-muted border-t border-portal-border/40 pt-1 text-center font-mono truncate px-1">
                ⚽ {m.goals.map(g => `${g.scorer} (${g.minute}')`).join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer — countdown */}
      <footer className="px-3 py-2 border-t border-[#c9a84c]/10 bg-[#c9a84c]/5 flex flex-col gap-1.5 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono text-portal-text-muted flex items-center gap-1">
            <Clock size={9} />
            Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-[9px] font-mono text-[#c9a84c] font-bold">
            Next: {formatCountdown(countdown)}
          </span>
        </div>
        <button
          onClick={() => setActiveTab(isAllScores ? 'fifa' : 'fifaAllScores')}
          className="w-full text-center text-[10px] font-mono text-[#c9a84c] hover:bg-[#c9a84c]/10 py-2 rounded transition-colors"
        >
          {isAllScores ? 'View Results →' : 'View All Scores →'}
        </button>
      </footer>
    </section>
  );
}
