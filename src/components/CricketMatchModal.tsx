import React from 'react';
import { motion } from 'framer-motion';
import { X, Clock, CalendarDays, CheckCircle2, Trophy, MapPin, Activity } from 'lucide-react';

interface CricketMatchModalProps {
  match: any;
  onClose: () => void;
}

export default function CricketMatchModal({ match, onClose }: CricketMatchModalProps) {
  if (!match) return null;

  let target = null;
  if (match.status) {
    const targetMatch = match.status.match(/need (\d+) runs/i);
    if (targetMatch && targetMatch[1]) target = targetMatch[1];
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-portal-surface border border-portal-border shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-portal-surface-hover text-portal-text-muted border border-portal-border/50">
                  {match.matchType || 'MATCH'}
                </span>
                {match.gender && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-portal-surface-hover text-portal-text-muted border border-portal-border/50">
                    {match.gender}
                  </span>
                )}
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border flex items-center gap-1 ${
                  match.tab === 'live' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  match.tab === 'results' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}>
                  {match.tab === 'live' && <Activity size={10} className="animate-pulse" />}
                  {match.tab === 'results' && <CheckCircle2 size={10} />}
                  {match.tab === 'fixtures' && <CalendarDays size={10} />}
                  {match.tab?.toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-bold text-portal-text-main leading-tight">{match.title}</h2>
            </div>
            
            <button
              onClick={onClose}
              className="p-1.5 text-portal-text-muted hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Big Scoreboard */}
          {match.score && match.score.length > 0 && (
            <div className="mb-8 p-4 bg-portal-surface-hover border border-portal-border rounded-lg space-y-3">
              {match.score.map((s: any, i: number) => (
                <div key={i} className={`flex items-center justify-between pb-3 ${i === 0 && match.score.length > 1 ? 'border-b border-portal-border/50' : ''}`}>
                  <div className="flex flex-col">
                    <span className={`font-bold text-lg ${i === 0 && match.tab === 'live' ? 'text-blue-400' : 'text-portal-text-main'}`}>
                      {s.team}
                      {i === 0 && match.tab === 'live' && <span className="ml-2 text-[10px] font-mono text-blue-400/60 font-normal border border-blue-500/30 px-1 py-0.5 rounded">BATTING</span>}
                    </span>
                    {i === 0 && s.crr && (
                      <span className="text-[11px] font-mono text-portal-text-muted mt-1">CRR: {s.crr}</span>
                    )}
                  </div>
                  <span className={`font-mono text-xl tracking-tight ${i === 0 && match.tab === 'live' ? 'text-white' : 'text-portal-text-main/80'}`}>
                    {s.score}
                  </span>
                </div>
              ))}
              {target && match.tab === 'live' && (
                <div className="pt-2 flex justify-between items-center text-[11px] font-mono border-t border-portal-border/40 text-portal-text-muted mt-2">
                  <span>Target: <strong className="text-white">{target}</strong></span>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 p-3 bg-portal-bg border border-portal-border/50 rounded">
              <span className="text-[10px] font-mono text-portal-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={12} /> Status
              </span>
              <span className="text-sm font-semibold text-portal-text-main leading-snug">{match.status || 'N/A'}</span>
            </div>

            {match.venue && (
              <div className="flex flex-col gap-1 p-3 bg-portal-bg border border-portal-border/50 rounded">
                <span className="text-[10px] font-mono text-portal-text-muted uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={12} /> Venue
                </span>
                <span className="text-sm font-semibold text-portal-text-main leading-snug">{match.venue}</span>
              </div>
            )}

            {(match.utcDate || match.date) && (
              <div className="flex flex-col gap-1 p-3 bg-portal-bg border border-portal-border/50 rounded sm:col-span-2">
                <span className="text-[10px] font-mono text-portal-text-muted uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={12} /> Local Time
                </span>
                <span className="text-sm font-semibold text-portal-text-main leading-snug">
                  {match.utcDate 
                    ? new Date(match.utcDate).toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })
                    : match.date}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-portal-bg border-t border-portal-border flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold bg-white text-black hover:bg-gray-200 transition-colors rounded"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
