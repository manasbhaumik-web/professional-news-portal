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

  if (game.score && Array.isArray(game.score)) {
   if (game.score.length > 0) {
     team1Name = game.score[0].team || "Team 1";
     team1Score = game.score[0].score || "-";
   }
   if (game.score.length > 1) {
     team2Name = game.score[1].team || "Team 2";
     team2Score = game.score[1].score || "-";
   }
  } else {
   team1Name = "Score not available";
   team1Score = "";
   team2Name = "";
   team2Score = "";
  }

 return (
 <div key={idx} className="flex flex-col bg-white p-2.5 sm:p-3 rounded-lg shadow-sm min-w-[260px] border border-gray-100 hover:border-gray-200 transition-colors">
 <div className="flex items-center justify-between mb-1.5">
 <span className="text-[9px] text-gray-500 font-mono tracking-tight line-clamp-1 pr-2">{game.title}</span>
 {game.matchType && (
 <span className="text-[8px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
 {game.matchType}
 </span>
 )}
 </div>

 <div className="flex flex-col gap-1 my-1">
 <div className="flex justify-between items-center w-full">
 <span className="font-bold text-[11px] text-gray-800 line-clamp-1 pr-2">{team1Name}</span>
 <span className="font-bold text-[12px] text-blue-600 font-mono shrink-0">{team1Score}</span>
 </div>
 
 {(team2Name || team2Score) && (
 <div className="flex justify-between items-center w-full">
 <span className="font-bold text-[11px] text-gray-800 line-clamp-1 pr-2">{team2Name}</span>
 <span className="font-bold text-[12px] text-orange-500 font-mono shrink-0">{team2Score}</span>
 </div>
 )}
 </div>

 <div className="text-[9px] font-bold text-gray-600 w-full mt-1.5 pt-1.5 border-t border-gray-100 flex items-center justify-between">
 <span className="line-clamp-1 text-indigo-500">{game.status}</span>
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
