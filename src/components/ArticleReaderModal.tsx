import React, { useState } from 'react';
import { ArrowLeft, Maximize2, Minimize2, X, Feather, RefreshCw, Sparkles, BookMarked, Share2, ExternalLink, ShieldCheck, Globe } from 'lucide-react';
import { NewsArticle } from '../types';

interface ArticleReaderModalProps {
  selectedArticle: NewsArticle;
  setSelectedArticle: (art: NewsArticle | null) => void;
  isCleanMode: boolean;
  setIsCleanMode: (val: boolean) => void;
  cleanTheme: 'midnight' | 'charcoal' | 'sepia';
  setCleanTheme: (val: 'midnight' | 'charcoal' | 'sepia') => void;
  cleanFontSize: 'sm' | 'md' | 'lg' | 'xl';
  setCleanFontSize: (val: 'sm' | 'md' | 'lg' | 'xl') => void;
  handleDeepDiveExpand: (title: string) => void;
  isExpandingDeepDive: boolean;
  expandedContent: string | null;
  toggleBookmark: (id: string, e: React.MouseEvent) => void;
  bookmarks: string[];
}

export default function ArticleReaderModal({
  selectedArticle,
  setSelectedArticle,
  isCleanMode,
  setIsCleanMode,
  cleanTheme,
  setCleanTheme,
  cleanFontSize,
  setCleanFontSize,
  handleDeepDiveExpand,
  isExpandingDeepDive,
  expandedContent,
  toggleBookmark,
  bookmarks
}: ArticleReaderModalProps) {
  const [showPerspectives, setShowPerspectives] = useState(false);

  const closeReader = () => {
    setSelectedArticle(null);
    setIsCleanMode(false);
  };

  return (
    <div id="article-reader-root-modal" className="fixed inset-0 bg-portal-bg bg-opacity-95 z-50 flex flex-col overflow-y-auto antialiased">
      <nav id="reader-sticky-controls" className="sticky top-0 z-50 h-16 bg-portal-surface border-b border-portal-border flex items-center justify-between px-4 sm:px-8 shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={closeReader}
            className="text-portal-text-muted hover:text-portal-text-main transition-colors p-2 rounded-lg hover:bg-portal-surface-hover flex items-center space-x-1.5 focus:outline-none"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider font-mono">Stream View</span>
          </button>

          <div className="h-5 w-px bg-portal-border hidden sm:block" />

          <div className="flex items-center space-x-2">
            <span className="text-[10px] bg-portal-brand/10 text-portal-brand border border-portal-brand px-2 py-0.5 rounded-full uppercase font-mono tracking-tight">
              {selectedArticle.category}
            </span>
            <span className="hidden md:inline-block text-[11px] text-portal-text-muted font-mono">
              Read stats: {selectedArticle.readTime || '4 min read'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-1 border-r border-portal-border pr-3 sm:pr-4">
            <button
              onClick={() => setIsCleanMode(!isCleanMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${isCleanMode
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 ring-1 ring-blue-400'
                  : 'bg-portal-surface border border-portal-border hover:bg-portal-surface-hover text-portal-text-muted'
                }`}
            >
              {isCleanMode ? <Maximize2 size={13} className="animate-pulse" /> : <Minimize2 size={13} />}
              <span>Clean Mode</span>
            </button>
          </div>

          {isCleanMode && (
            <div className="hidden sm:flex items-center space-x-1">
              {(['midnight', 'charcoal', 'sepia'] as const).map((th) => (
                <button
                  key={th}
                  onClick={() => setCleanTheme(th)}
                  className={`h-6 w-6 rounded-full border flex items-center justify-center transition-all ${th === 'midnight' ? 'bg-[#000000] border-zinc-800' :
                      th === 'charcoal' ? 'bg-[#212121] border-zinc-700' :
                        'bg-[#faf0e6] border-zinc-300'
                    } ${cleanTheme === th ? 'ring-2 ring-blue-500 scale-110' : 'opacity-70'}`}
                >
                  {cleanTheme === th && <span className={`h-1.5 w-1.5 rounded-full ${th === 'sepia' ? 'bg-[#212121]' : 'bg-[#fafafa]'}`} />}
                </button>
              ))}
            </div>
          )}

          {isCleanMode && (
            <div className="flex items-center space-x-1">
              {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setCleanFontSize(sz)}
                  className={`px-2 py-0.5 text-[9px] rounded font-mono uppercase tracking-tighter ${cleanFontSize === sz ? 'bg-blue-600 text-white' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-500'
                    }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          )}

          <button onClick={closeReader} className="text-portal-text-muted hover:text-portal-text-main p-2">
            <X size={18} />
          </button>
        </div>
      </nav>

      <div className={`flex-1 transition-all duration-300 ${isCleanMode
          ? cleanTheme === 'midnight' ? 'bg-[#030303] text-zinc-100' :
            cleanTheme === 'charcoal' ? 'bg-[#18181b] text-neutral-200' :
              'bg-[#f4ebd0] text-[#2c221e]'
          : 'bg-portal-bg text-portal-text-main'
        }`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 ${isCleanMode ? 'pb-32' : 'pb-20'}`}>
          {isCleanMode && (
            <div className="mb-8 p-3 rounded-lg bg-blue-500/10 border border-blue-900/30 text-[11px] font-mono select-none flex items-center justify-between text-blue-400">
              <div className="flex items-center space-x-1.5">
                <Feather size={12} className="animate-bounce" />
                <span>Clean Mode Active: distraction-free layout activated. Adjust background backdrops or scalers in header.</span>
              </div>
              <button onClick={() => setIsCleanMode(false)} className="underline hover:text-white">Exit</button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: THE ARTICLE (70% width) */}
            <div className="lg:col-span-8 space-y-6">
              <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight font-serif leading-tight ${isCleanMode ? 'text-inherit' : 'text-portal-text-main'}`}>
                {selectedArticle.title}
              </h1>

              {/* HERO IMAGE */}
              {selectedArticle.imageUrl && (
                <div className={`rounded-xl overflow-hidden aspect-video max-h-96 w-full relative border ${isCleanMode ? 'border-zinc-800 bg-zinc-950' : 'border-portal-border bg-portal-surface'}`}>
                  <img src={selectedArticle.imageUrl} alt={selectedArticle.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                  <span className="absolute bottom-3 left-3 text-[10px] font-mono text-zinc-300 uppercase tracking-widest bg-black/80 px-2 py-0.5 rounded bg-opacity-70">
                    Analytical Ledger Plate
                  </span>
                </div>
              )}

              {/* ARTICLE BODY */}
              <div className={`transition-all duration-300 font-serif leading-relaxed ${cleanFontSize === 'sm' ? 'text-xs sm:text-sm' :
                  cleanFontSize === 'md' ? 'text-sm sm:text-base' :
                    cleanFontSize === 'lg' ? 'text-base sm:text-lg' :
                      'text-lg sm:text-xl'
                } space-y-6 ${isCleanMode ? (cleanTheme === 'sepia' ? 'text-[#382b26]' : 'text-zinc-200') : 'text-portal-text-main'}`}>
                {selectedArticle.content.split('\n\n').map((paragraph, pIdx) => {
                  // Elegant drop cap on the very first letter of the first paragraph
                  if (pIdx === 0 && paragraph.length > 0 && !isCleanMode) {
                    const firstChar = paragraph.charAt(0);
                    const rest = paragraph.slice(1);
                    return (
                      <p key={pIdx}>
                        <span className="float-left text-5xl font-bold font-serif mr-2.5 mt-1 text-portal-brand leading-none">
                          {firstChar}
                        </span>
                        {rest}
                      </p>
                    );
                  }
                  return <p key={pIdx} className="first-letter:font-mono">{paragraph}</p>;
                })}

                {selectedArticle.originalUrl && (
                  <div className={`pt-6 mt-6 border-t ${isCleanMode ? 'border-zinc-800' : 'border-portal-border/50'}`}>
                    <a
                      href={selectedArticle.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center space-x-2 text-sm font-mono font-bold transition-colors ${isCleanMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-portal-brand hover:opacity-80'
                        }`}
                    >
                      <span>Read Original Article</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: STICKY CONTEXT PANEL (30% width) */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              
              {/* Publication Metadata Block */}
              <div className={`p-5 rounded-xl border ${isCleanMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-portal-surface border-portal-border text-portal-text-muted'} space-y-3`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${isCleanMode ? 'text-white' : 'text-portal-text-main'}`}>
                    Publication Ledger
                  </span>
                  <span className="text-[10px] bg-portal-brand/10 text-portal-brand border border-portal-brand px-2 py-0.5 rounded-full uppercase font-mono tracking-tight">
                    {selectedArticle.category}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span>Source:</span>
                    <span className="font-bold text-portal-text-main">{selectedArticle.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reporter:</span>
                    <span className="text-portal-text-main">Editorial Team</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Filed:</span>
                    <span className="text-portal-text-main">{selectedArticle.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Read stats:</span>
                    <span className="text-portal-text-main">{selectedArticle.readTime || '4 min read'}</span>
                  </div>
                </div>
              </div>

              {/* Trust Score & Perspectives */}
              <div className={`p-5 rounded-xl border ${isCleanMode ? 'bg-zinc-900 border-zinc-800' : 'bg-portal-surface border-portal-border shadow-sm'}`}>
                <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 ${isCleanMode ? 'border-cyan-900 text-cyan-400' : 'border-emerald-500/30 text-emerald-600'} relative shrink-0`}>
                      <span className="text-xs font-black font-mono">94</span>
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 36 36">
                        <path className={`${isCleanMode ? 'text-cyan-400' : 'text-emerald-500'}`} strokeDasharray="94, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
                      </svg>
                    </div>
                    <div>
                      <div className={`flex items-center gap-1.5 font-bold uppercase tracking-widest text-[9px] ${isCleanMode ? 'text-cyan-400' : 'text-emerald-600'}`}>
                        <ShieldCheck size={12} /> <span>Trust Radar</span>
                      </div>
                      <div className={`text-[10px] mt-0.5 ${isCleanMode ? 'text-zinc-550' : 'text-portal-text-muted'}`}>
                        Verified by 4 agencies.
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowPerspectives(!showPerspectives)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-all flex items-center gap-1.5 border ${isCleanMode ? 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700' : 'bg-portal-bg text-portal-text-main border-portal-border shadow-sm hover:bg-portal-surface-hover'}`}
                  >
                    <Globe size={12} className={isCleanMode ? 'text-cyan-400' : 'text-portal-brand'} />
                    <span>Perspectives</span>
                  </button>
                </div>

                {showPerspectives && (
                  <div className="pt-4 border-t border-portal-border/40 space-y-3">
                    <div className={`p-3 rounded-lg border ${isCleanMode ? 'bg-[#09090b] border-zinc-800' : 'bg-portal-bg border-portal-border'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-bold font-mono uppercase ${isCleanMode ? 'text-zinc-300' : 'text-portal-text-main'}`}>European Union Lens</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 font-bold">Regulatory</span>
                      </div>
                      <p className={`text-[10px] leading-normal ${isCleanMode ? 'text-zinc-400' : 'text-portal-text-muted'}`}>Emphasizes standard privacy and regulatory implications.</p>
                    </div>
                    <div className={`p-3 rounded-lg border ${isCleanMode ? 'bg-[#09090b] border-zinc-800' : 'bg-portal-bg border-portal-border'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-bold font-mono uppercase ${isCleanMode ? 'text-zinc-300' : 'text-portal-text-main'}`}>Asia-Pacific Lens</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 font-bold">Markets</span>
                      </div>
                      <p className={`text-[10px] leading-normal ${isCleanMode ? 'text-zinc-400' : 'text-portal-text-muted'}`}>Reports regional market opportunities and supply impact.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Dock */}
              <div className={`p-5 rounded-xl border ${isCleanMode ? 'bg-zinc-900 border-zinc-800' : 'bg-portal-surface border-portal-border shadow-sm'} space-y-3`}>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${isCleanMode ? 'text-zinc-400' : 'text-portal-text-muted'}`}>Quick Actions</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={(e) => toggleBookmark(selectedArticle.id, e)}
                    className={`p-2.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 border ${
                      bookmarks.includes(selectedArticle.id)
                        ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                        : isCleanMode ? 'bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-portal-bg hover:bg-portal-surface-hover text-portal-text-main border-portal-border'
                    }`}
                  >
                    <BookMarked size={13} className={bookmarks.includes(selectedArticle.id) ? "fill-yellow-500" : ""} />
                    <span>{bookmarks.includes(selectedArticle.id) ? 'Saved' : 'Save'}</span>
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Editorial transmission URL copied to system clipboard.");
                    }}
                    className={`p-2.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 border ${
                      isCleanMode ? 'bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-portal-bg hover:bg-portal-surface-hover text-portal-text-main border-portal-border'
                    }`}
                  >
                    <Share2 size={12} />
                    <span>Copy Link</span>
                  </button>
                </div>
              </div>

              {/* Deep-Dive Dossier */}
              <div className={`p-5 rounded-xl space-y-3 border ${isCleanMode ? 'bg-zinc-900 border-zinc-800' : 'bg-portal-surface border-portal-border'}`}>
                <div className="space-y-1">
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-widest block ${isCleanMode ? 'text-cyan-400' : 'text-portal-accent'}`}>EDITORIAL DOSSIER</span>
                  <h4 className={`text-sm font-serif font-semibold ${isCleanMode ? 'text-white' : 'text-portal-text-main'}`}>Formulate Deep-Dive Report</h4>
                  <p className={`text-[10px] ${isCleanMode ? 'text-zinc-500' : 'text-portal-text-muted'}`}>Request the PulseWire engine to run a microanalysis of this event.</p>
                </div>

                <button
                  disabled={isExpandingDeepDive}
                  onClick={() => handleDeepDiveExpand(selectedArticle.title)}
                  className={`w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all font-mono group ${isCleanMode
                      ? 'bg-[#1a1c24] hover:bg-[#20232e] text-cyan-300 border border-cyan-900/30'
                      : 'bg-portal-accent hover:opacity-90 text-white shadow-sm'
                    }`}
                >
                  {isExpandingDeepDive ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" />
                      <span>Formulating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} className="animate-pulse group-hover:scale-110 transition-transform" />
                      <span>Conduct Dossier</span>
                    </>
                  )}
                </button>

                {expandedContent && (
                  <div className={`p-4 rounded-lg space-y-3 border text-left ${isCleanMode ? 'bg-[#09090b] border-zinc-800' : 'bg-portal-bg border-portal-border'}`}>
                    <div className={`flex items-center space-x-2 text-[10px] font-mono ${isCleanMode ? 'text-[#22c55e]' : 'text-emerald-500'}`}>
                      <span className={`inline-block h-1.5 w-1.5 rounded-full ${isCleanMode ? 'bg-[#22c55e]' : 'bg-emerald-500'}`} />
                      <span>DOSSIER OUTPUT:</span>
                    </div>
                    <div className={`text-xs font-serif leading-relaxed whitespace-pre-line border-t pt-2.5 ${isCleanMode ? 'text-zinc-300 border-zinc-850' : 'text-portal-text-main border-portal-border/50'}`}>
                      {expandedContent}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <footer className="sticky bottom-0 h-14 bg-portal-surface border-t border-portal-border flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center space-x-4 text-xs text-portal-text-muted">
          <button
            onClick={(e) => toggleBookmark(selectedArticle.id, e)}
            className="flex items-center space-x-1 hover:text-portal-text-main"
          >
            <BookMarked size={14} className={bookmarks.includes(selectedArticle.id) ? "text-yellow-500 fill-yellow-500" : ""} />
            <span>{bookmarks.includes(selectedArticle.id) ? 'Bookmarked' : 'Add to Focus'}</span>
          </button>
          <span>•</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Editorial transmission URL copied to system clipboard.");
            }}
            className="flex items-center space-x-1 hover:text-portal-text-main"
          >
            <Share2 size={13} />
            <span>Transmission link</span>
          </button>
        </div>
        <button
          onClick={closeReader}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase px-4 py-2 rounded-lg"
        >
          Back to Portal
        </button>
      </footer>
    </div>
  );
}
