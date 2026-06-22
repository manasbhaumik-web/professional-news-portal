import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, RefreshCw, Clock, ChevronLeft, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Goal {
 minute: number;
 scorer: string;
 teamId?: number;
}

interface Match {
 id?: string | number;
 team1: string;
 flag1: string | null;
 crest1?: string;
 score1: number | string;
 team2: string;
 flag2: string | null;
 crest2?: string;
 score2: number | string;
 status: string;
 date: string;
 winner?: string | null;
 goals?: Goal[];
}

const FALLBACK: Match[] = [
 {
 team1: 'France', flag1: null, crest1: 'https://flagcdn.com/fr.svg', score1: 2, team2: 'Uruguay', flag2: null, crest2: 'https://flagcdn.com/uy.svg', score2: 1, status: 'FT', date: 'Jun 17',
 goals: [
 { minute: 28, scorer: 'Mbappé' },
 { minute: 54, scorer: 'Griezmann' },
 { minute: 81, scorer: 'Nunez' }
 ]
 },
 {
 team1: 'Brazil', flag1: null, crest1: 'https://flagcdn.com/br.svg', score1: 3, team2: 'Serbia', flag2: null, crest2: 'https://flagcdn.com/rs.svg', score2: 0, status: 'FT', date: 'Jun 17',
 goals: [
 { minute: 9, scorer: 'Vinicius Jr.' },
 { minute: 42, scorer: 'Rodrygo' },
 { minute: 76, scorer: 'Raphinha' }
 ]
 },
 {
 team1: 'Spain', flag1: null, crest1: 'https://flagcdn.com/es.svg', score1: 2, team2: 'Ecuador', flag2: null, crest2: 'https://flagcdn.com/ec.svg', score2: 0, status: 'FT', date: 'Jun 16',
 goals: [
 { minute: 18, scorer: 'Morata' },
 { minute: 65, scorer: 'Williams' }
 ]
 },
 {
 team1: 'Germany', flag1: null, crest1: 'https://flagcdn.com/de.svg', score1: 3, team2: 'Chile', flag2: null, crest2: 'https://flagcdn.com/cl.svg', score2: 2, status: 'FT', date: 'Jun 16',
 goals: [
 { minute: 12, scorer: 'Sánchez' },
 { minute: 34, scorer: 'Havertz' },
 { minute: 49, scorer: 'Musiala' },
 { minute: 71, scorer: 'Vidal' },
 { minute: 85, scorer: 'Wirtz' }
 ]
 },
 {
 team1: 'Canada', flag1: null, crest1: 'https://flagcdn.com/ca.svg', score1: 1, team2: 'Morocco', flag2: null, crest2: 'https://flagcdn.com/ma.svg', score2: 0, status: 'FT', date: 'Jun 15',
 goals: [
 { minute: 59, scorer: 'David' }
 ]
 },
 {
 team1: 'Japan', flag1: null, crest1: 'https://flagcdn.com/jp.svg', score1: 3, team2: 'Senegal', flag2: null, crest2: 'https://flagcdn.com/sn.svg', score2: 1, status: 'FT', date: 'Jun 15',
 goals: [
 { minute: 14, scorer: 'Mitoma' },
 { minute: 38, scorer: 'Dia' },
 { minute: 67, scorer: 'Kubo' },
 { minute: 82, scorer: 'Doan' }
 ]
 },
 {
 team1: 'Australia', flag1: null, crest1: 'https://flagcdn.com/au.svg', score1: 2, team2: 'Türkiye', flag2: null, crest2: 'https://flagcdn.com/tr.svg', score2: 0, status: 'FT', date: 'Jun 14',
 goals: [
 { minute: 31, scorer: 'Duke' },
 { minute: 78, scorer: 'Irvine' }
 ]
 },
 {
 team1: 'South Korea', flag1: null, crest1: 'https://flagcdn.com/kr.svg', score1: 2, team2: 'Czechia', flag2: null, crest2: 'https://flagcdn.com/cz.svg', score2: 1, status: 'FT', date: 'Jun 14',
 goals: [
 { minute: 22, scorer: 'Son' },
 { minute: 55, scorer: 'Schick' },
 { minute: 73, scorer: 'Hwang' }
 ]
 },
 {
 team1: 'Mexico', flag1: null, crest1: 'https://flagcdn.com/mx.svg', score1: 2, team2: 'S. Africa', flag2: null, crest2: 'https://flagcdn.com/za.svg', score2: 0, status: 'FT', date: 'Jun 13',
 goals: [
 { minute: 40, scorer: 'Giménez' },
 { minute: 89, scorer: 'Martin' }
 ]
 },
 {
 team1: 'USA', flag1: null, crest1: 'https://flagcdn.com/us.svg', score1: 4, team2: 'Paraguay', flag2: null, crest2: 'https://flagcdn.com/py.svg', score2: 1, status: 'FT', date: 'Jun 12',
 goals: [
 { minute: 10, scorer: 'Pulisic' },
 { minute: 28, scorer: 'Balogun' },
 { minute: 45, scorer: 'Almirón' },
 { minute: 61, scorer: 'Weah' },
 { minute: 85, scorer: 'Pepi' }
 ]
 },
];

function getImg(m: Match, side: 'team1' | 'team2') {
 const flag = side === 'team1' ? m.flag1 : m.flag2;
 const crest = side === 'team1' ? m.crest1 : m.crest2;
 if (flag && flag.startsWith('http')) return flag;
 if (crest) return crest;
 if (flag) return `https://flagcdn.com/${flag}.svg`;
 return '';
}

function statusLabel(s: string) {
 if (s === 'FT' || s === 'FINISHED') return 'FULL TIME';
 if (s === 'IN_PLAY') return 'LIVE';
 return s;
}

function statusColor(s: string) {
 if (s === 'IN_PLAY' || s === 'LIVE') return 'text-green-500 bg-green-500/10 border-green-500/30';
 return 'text-[#c9a84c] bg-[#c9a84c]/10 border-[#c9a84c]/30';
}

interface FifaAllScoresPageProps {
 onBack: () => void;
 onSelectMatch?: (match: Match, allMatches: Match[]) => void;
}

export default function FifaAllScoresPage({ onBack, onSelectMatch }: FifaAllScoresPageProps) {
 const [matches, setMatches] = useState<Match[]>(FALLBACK);
 const [scorers, setScorers] = useState<any[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [apiStatus, setApiStatus] = useState<'live' | 'demo' | 'loading'>('loading');
 const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
 const [isRefreshing, setIsRefreshing] = useState(false);
 const [filterStatus, setFilterStatus] = useState<'ALL' | 'UPCOMING' | 'LIVE' | 'SCORERS'>('ALL');

 const fetchMatches = useCallback(async () => {
 setIsRefreshing(true);
 const demoScorers = [
 { name: 'Kylian Mbappé', team: 'France', goals: 8, flag: 'https://flagcdn.com/fr.svg' },
 { name: 'Lionel Messi', team: 'Argentina', goals: 7, flag: 'https://flagcdn.com/ar.svg' },
 { name: 'Julián Álvarez', team: 'Argentina', goals: 4, flag: 'https://flagcdn.com/ar.svg' },
 { name: 'Olivier Giroud', team: 'France', goals: 4, flag: 'https://flagcdn.com/fr.svg' },
 { name: 'Álvaro Morata', team: 'Spain', goals: 3, flag: 'https://flagcdn.com/es.svg' }
 ];
 const demoUpcoming: Match[] = [
 { team1: 'Japan', flag1: 'jp', score1: '-', team2: 'Croatia', flag2: 'hr', score2: '-', status: 'UPCOMING', date: '16 Jun, 18:00' },
 { team1: 'Spain', flag1: 'es', score1: '-', team2: 'Netherlands', flag2: 'nl', score2: '-', status: 'UPCOMING', date: '16 Jun, 21:00' },
 { team1: 'England', flag1: 'gb', score1: '-', team2: 'Italy', flag2: 'it', score2: '-', status: 'UPCOMING', date: '17 Jun, 15:00' },
 { team1: 'Argentina', flag1: 'ar', score1: '-', team2: 'Portugal', flag2: 'pt', score2: '-', status: 'UPCOMING', date: '17 Jun, 18:00' },
 { team1: 'France', flag1: 'fr', score1: '-', team2: 'Belgium', flag2: 'be', score2: '-', status: 'UPCOMING', date: '17 Jun, 21:00' },
 ];

 try {
 if (filterStatus === 'SCORERS') {
 const res = await fetch('/api/football/wc2026/scorers');
 const data = await res.json();
 if (res.ok && data.scorers && data.scorers.length > 0) {
 setScorers(data.scorers);
 setApiStatus('live');
 } else {
 setScorers(demoScorers);
 setApiStatus('demo');
 }
 } else {
 const statusQuery = filterStatus === 'UPCOMING' ? 'SCHEDULED' : filterStatus === 'LIVE' ? 'IN_PLAY' : 'FINISHED';
 const res = await fetch(`/api/football/wc2026?status=${statusQuery}`);
 const data = await res.json();
 if (res.ok && data.matches && data.matches.length > 0) {
 setMatches(data.matches);
 setApiStatus('live');
 } else {
 setMatches(filterStatus === 'UPCOMING' ? demoUpcoming : FALLBACK);
 setApiStatus('demo');
 }
 }
 setLastUpdated(new Date());
 } catch {
 if (filterStatus === 'SCORERS') {
 setScorers(demoScorers);
 } else {
 setMatches(filterStatus === 'UPCOMING' ? demoUpcoming : FALLBACK);
 }
 setApiStatus('demo');
 } finally {
 setIsLoading(false);
 setIsRefreshing(false);
 }
 }, [filterStatus]);

 useEffect(() => { fetchMatches(); }, [fetchMatches]);

 const filtered = matches.filter(m => {
 if (filterStatus === 'ALL') return true;
 if (filterStatus === 'LIVE') return m.status === 'IN_PLAY' || m.status === 'LIVE';
 if (filterStatus === 'UPCOMING') return m.status === 'UPCOMING' || m.status === 'SCHEDULED' || m.status === 'TIMED';
 return m.status === 'FT' || m.status === 'FINISHED' || m.status === 'FULL TIME';
 });

 return (
 <div className="space-y-5">

 {/* Page Header */}
 <div className="relative overflow-hidden border border-[#c9a84c]/30 shadow-[0_4px_30px_rgba(201,168,76,0.12)] bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
 <div className="absolute inset-0 opacity-20"
 style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #c9a84c 0%, transparent 50%)' }} />
 <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none text-[#c9a84c]">
 <Trophy size={140} />
 </div>
 <div className="relative z-10 p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
 <div>
 <button
 onClick={onBack}
 className="flex items-center gap-1.5 text-[10px] font-mono text-white/50 hover:text-[#c9a84c] transition-colors mb-3"
 >
 <ChevronLeft size={12} /> Back to FIFA 2026
 </button>
 <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
 All Match <span className="text-[#c9a84c]">Results</span>
 </h1>
 <p className="text-white/50 text-xs mt-1 font-mono">
 FIFA World Cup 2026 · {filtered.length} matches shown
 </p>
 </div>
 <div className="flex items-center gap-3 flex-wrap">
 {lastUpdated && (
 <span className="text-[9px] font-mono text-white/40 flex items-center gap-1">
 <Clock size={9} /> {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
 </span>
 )}
 {apiStatus === 'live' && (
 <span className="flex items-center gap-1 text-[10px] font-mono text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 ">
 <span className="w-1.5 h-1.5 bg-green-500 animate-pulse"></span> Live API
 </span>
 )}
 {apiStatus === 'demo' && (
 <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 ">
 ⚠ Demo Data
 </span>
 )}
 <button
 onClick={fetchMatches}
 disabled={isRefreshing}
 className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all disabled:opacity-50"
 >
 <RefreshCw size={11} className={isRefreshing ? 'animate-spin' : ''} />
 {isRefreshing ? 'Refreshing...' : 'Refresh'}
 </button>
 </div>
 </div>
 </div>

 {/* Filter Pills */}
 <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none hide-scrollbar">
 {(['ALL', 'UPCOMING', 'LIVE', 'SCORERS'] as const).map(f => (
 <button
 key={f}
 onClick={() => setFilterStatus(f)}
 className={`px-4 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider border transition-all shrink-0 ${filterStatus === f
 ? 'bg-[#c9a84c] text-[#1a1a2e] border-[#c9a84c] shadow-[0_0_12px_rgba(201,168,76,0.3)]'
 : 'border-portal-border text-portal-text-muted hover:border-[#c9a84c]/40 hover:text-[#c9a84c]'
 }`}
 >
 {f === 'ALL' ? `All Results` : f === 'UPCOMING' ? `Upcoming Matches` : f === 'LIVE' ? `🔴 Live` : `Goal Scorers`}
 </button>
 ))}
 <span className="ml-auto pl-2 text-[10px] font-mono text-portal-text-muted whitespace-nowrap shrink-0">
 Showing {filterStatus === 'SCORERS' ? scorers.length : filtered.length} result{filterStatus === 'SCORERS' ? (scorers.length !== 1 ? 's' : '') : (filtered.length !== 1 ? 's' : '')}
 </span>
 </div>

 {/* Matches List */}
 {isLoading ? (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {Array.from({ length: 8 }).map((_, i) => (
 <div key={i} className="animate-pulse border border-portal-border bg-portal-surface p-4 flex items-center gap-4">
 <div className="w-10 h-10 bg-portal-surface-hover shrink-0" />
 <div className="flex-1 space-y-2">
 <div className="h-3 bg-portal-surface-hover w-2/3" />
 <div className="h-3 bg-portal-surface-hover w-1/3" />
 </div>
 <div className="w-10 h-10 bg-portal-surface-hover shrink-0" />
 </div>
 ))}
 </div>
 ) : filtered.length === 0 && filterStatus !== 'SCORERS' ? (
 <div className="text-center py-16 text-portal-text-muted font-mono text-sm border border-dashed border-portal-border ">
 No matches found for this filter.
 </div>
 ) : filterStatus === 'SCORERS' ? (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {scorers.map((s, idx) => (
 <div key={idx} className="flex items-center gap-4 p-4 border border-portal-border bg-portal-surface hover:border-[#c9a84c]/30 hover:shadow-[0_2px_16px_rgba(201,168,76,0.07)] transition-all">
 <div className="w-12 h-12 overflow-hidden shrink-0 border border-portal-border relative bg-portal-surface-hover flex items-center justify-center font-bold text-lg text-portal-text-muted">
 {s.playerImage ? <img src={s.playerImage} alt={s.name} className="w-full h-full object-cover" /> : s.name.charAt(0)}
 </div>
 <div className="flex flex-col flex-1 min-w-0">
 <div className="font-bold text-portal-text-main truncate text-sm">{s.name}</div>
 <div className="flex items-center gap-1.5 text-xs text-portal-text-muted mt-0.5">
 {s.flag && <img src={s.flag.startsWith('http') ? s.flag : `https://flagcdn.com/${s.flag}.svg`} alt={s.team} className="w-4 h-4 object-cover shrink-0" onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />}
 <span className="truncate">{s.team}</span>
 </div>
 </div>
 <div className="text-2xl font-black font-mono text-[#c9a84c] tracking-tighter shrink-0 text-right w-12">
 {s.goals}
 </div>
 </div>
 ))}
 </div>
 ) : (
 <AnimatePresence mode="wait">
 <motion.div
 key={filterStatus}
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -8 }}
 transition={{ duration: 0.2 }}
 className="grid grid-cols-1 md:grid-cols-2 gap-3"
 >
 {filtered.map((m, idx) => {
 const img1 = getImg(m, 'team1');
 const img2 = getImg(m, 'team2');
 const sl = statusLabel(m.status);
 const sc = statusColor(m.status);
 const isLive = m.status === 'IN_PLAY' || m.status === 'LIVE';

 return (
 <motion.div
 key={m.id ?? idx}
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.25, delay: idx * 0.03 }}
 className="flex flex-col p-3 border border-portal-border bg-portal-surface transition-all group"
 >
 <div className="flex items-center gap-3 w-full">
 {/* Date */}
 <div className="text-[9px] font-mono text-portal-text-muted w-10 shrink-0 text-center leading-tight">
 {m.date}
 </div>

 {/* Team 1 */}
 <div className="flex items-center gap-1.5 w-[90px] shrink-0 justify-end">
 <span className="text-xs font-bold text-portal-text-main text-right truncate">{m.team1}</span>
 <img src={img1} alt={m.team1}
 className="w-7 h-7 object-cover border border-portal-border/50 shrink-0"
 onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
 </div>

 {/* Score + Status */}
 <div className="flex flex-col items-center flex-1 min-w-0">
 <div className="text-lg font-black font-mono text-portal-text-main tracking-widest flex items-center gap-1">
 <span>{m.score1}</span>
 <span className="text-portal-text-muted/40 font-light text-sm">-</span>
 <span>{m.score2}</span>
 </div>
 <div className={`text-[8px] font-bold font-mono uppercase tracking-widest px-2 py-0.5 border mt-0.5 ${sc} ${isLive ? 'animate-pulse' : ''}`}>
 {sl}
 </div>
 </div>

 {/* Team 2 */}
 <div className="flex items-center gap-1.5 w-[90px] shrink-0 justify-start">
 <img src={img2} alt={m.team2}
 className="w-7 h-7 object-cover border border-portal-border/50 shrink-0"
 onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
 <span className="text-xs font-bold text-portal-text-main truncate">{m.team2}</span>
 </div>
 </div>

 {/* Scorers */}
 {m.goals && m.goals.length > 0 && (
 <div className="mt-2 text-[9px] text-portal-text-muted border-t border-portal-border/40 pt-1.5 text-center font-mono truncate px-4 w-full">
 ⚽ {m.goals.map(g => `${g.scorer} (${g.minute}')`).join(', ')}
 </div>
 )}
 </motion.div>
 );
 })}
 </motion.div>
 </AnimatePresence>
 )}
 </div>
 );
}
