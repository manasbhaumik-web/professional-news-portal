import React from 'react';
import { Trophy } from 'lucide-react';

interface IccCricketBannerProps {
 activeTab: string;
 cricketLoading: boolean;
 cricketMatches: any[];
 setActiveTab: (tab: string) => void;
}

export default React.memo(function IccCricketBanner({
 activeTab,
 cricketLoading,
 cricketMatches,
 setActiveTab
}: IccCricketBannerProps) {
 return (
 <section id="icc-cricket-banner" className="mb-2 p-3 sm:p-4 border flex flex-col items-start gap-3 shadow-sm transition-colors bg-portal-surface border-blue-500/30 relative overflow-hidden">
 <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-blue-500">
 <Trophy size={100} />
 </div>

 <div className="flex w-full items-center justify-between relative z-10">
 <div className="flex items-center gap-2 text-blue-500 font-bold uppercase text-[9px] tracking-widest font-mono">
 <Trophy size={12} /> Recent ICC International Matches
 </div>
 </div>

 <div className="flex overflow-x-auto space-x-3 pb-1 w-full scrollbar-none relative z-10">
 {cricketLoading ? (
 <div className="text-xs font-mono text-blue-400 p-4">Loading Live Match Data...</div>
 ) : cricketMatches.length > 0 ? (
 cricketMatches.map((game, idx) => {
 let team1Name = "Team 1";
 let team1Score = "-";
 let team2Name = "Team 2";
 let team2Score = "-";

 if (game.score) {
 const parts = game.score.split(/ - | v /);
 if (parts.length === 2) {
 const t1 = parts[0].trim();
 const t2 = parts[1].trim();

 const p1 = t1.lastIndexOf(' ');
 if (p1 > 0) {
 team1Name = t1.substring(0, p1);
 team1Score = t1.substring(p1 + 1);
 } else {
 team1Name = t1;
 team1Score = "";
 }

 const p2 = t2.lastIndexOf(' ');
 if (p2 > 0) {
 team2Name = t2.substring(0, p2);
 team2Score = t2.substring(p2 + 1);
 } else {
 team2Name = t2;
 team2Score = "";
 }
 } else {
 team1Name = game.score;
 team1Score = "";
 team2Name = "";
 team2Score = "";
 }
 } else {
 team1Name = "Score not available";
 team1Score = "";
 team2Name = "";
 team2Score = "";
 }

 return (
 <div key={idx} className="flex flex-col bg-portal-bg p-3.5 border border-portal-border shadow-sm min-w-[280px]">
 <div className="flex flex-col w-full">
 <div className="flex items-center gap-1.5 mb-2 border-b border-portal-border/40 pb-1.5">
 {game.matchType && <span className="text-[9px] font-bold text-portal-text-main bg-portal-surface px-1.5 py-0.5 uppercase">{game.matchType}</span>}
 <span className="text-[10px] text-portal-text-muted font-mono line-clamp-1">{game.title}</span>
 </div>

 <div className="flex flex-col gap-2 py-1.5">
 <div className="flex justify-between items-center w-full">
 <span className="font-bold text-[13px] text-portal-text-main">{team1Name}</span>
 <span className="font-bold text-[13px] text-portal-text-main">{team1Score}</span>
 </div>
 {(team2Name || team2Score) && (
 <div className="flex justify-between items-center w-full">
 <span className="font-bold text-[13px] text-portal-text-main">{team2Name}</span>
 <span className="font-bold text-[13px] text-portal-text-main">{team2Score}</span>
 </div>
 )}
 </div>

 <div className="mt-2 text-[11px] font-bold text-blue-500 w-full pt-1.5 border-t border-portal-border/40">
 {game.status}
 </div>
 </div>
 </div>
 );
 })
 ) : (
 <div className="text-xs font-mono text-portal-text-muted p-4">No recent matches found.</div>
 )}
 </div>

 <div className="flex items-center justify-end w-full relative z-10 mt-1">
 <button
 onClick={() => setActiveTab('cricket')}
 className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-blue-500 hover:text-blue-400 transition-colors group"
 >
 <Trophy size={11} />
 View Match Center
 <span className="group-hover:translate-x-0.5 transition-transform">→</span>
 </button>
 </div>
 </section>
 );
});
