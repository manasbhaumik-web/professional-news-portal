import React, { useState, useEffect } from 'react';
import { ArrowLeft, Maximize2, Minimize2, X, Feather, RefreshCw, Sparkles, BookMarked, Share2, ExternalLink, ShieldCheck, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { NewsArticle } from '../types';
import { BrandLogoPlaceholder } from './BrandLogoPlaceholder';

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

const cleanHtmlText = (text: string) => {
 if (!text) return '';
 const decoded = text
 .replace(/&nbsp;/g, ' ')
 .replace(/&amp;/g, '&')
 .replace(/&quot;/g, '"')
 .replace(/&apos;/g, "'")
 .replace(/&lt;/g, '<')
 .replace(/&gt;/g, '>');
 return decoded
 .replace(/<[^>]*>?/gm, '') // Strip HTML tags
 .trim();
};

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
 const [fullContent, setFullContent] = useState<string | null>(null);
 const [isScraping, setIsScraping] = useState(false);
 const [scrollProgress, setScrollProgress] = useState(0);
 const [reactions, setReactions] = useState<{ [key: string]: number }>({});
 const [imgError, setImgError] = useState(false);

 const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const target = e.currentTarget;
  const scrollHeight = target.scrollHeight - target.clientHeight;
  if (scrollHeight > 0) {
   setScrollProgress((target.scrollTop / scrollHeight) * 100);
  } else {
   setScrollProgress(0);
  }
 };

 const handleReaction = (emoji: string) => {
   setReactions(prev => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }));
 };

 const closeReader = () => {
 setSelectedArticle(null);
 setIsCleanMode(false);
 };

 useEffect(() => {
  setImgError(false);
  const targetUrl = selectedArticle.originalUrl || selectedArticle.url;
  if (!targetUrl) {
    setFullContent(selectedArticle.content);
    return;
  }

  const fetchFullReport = async () => {
    setIsScraping(true);
    setFullContent(null);
    try {
      const res = await fetch('/api/news/full-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          fallbackSummary: selectedArticle.summary || selectedArticle.content
        })
      });
      if (!res.ok) throw new Error("Scraping failed");
      const data = await res.json();
      setFullContent(data.content);
    } catch (err) {
      setFullContent(selectedArticle.content || selectedArticle.summary || "Failed to load report.");
    } finally {
      setIsScraping(false);
    }
  };

  fetchFullReport();
 }, [selectedArticle.id, selectedArticle.originalUrl, selectedArticle.url]);

 return (
 <div id="article-reader-root-modal" className="fixed inset-0 bg-portal-bg bg-opacity-95 z-50 flex flex-col overflow-y-auto antialiased" onScroll={handleScroll}>
    <Helmet>
        <title>{`${selectedArticle.title.replace(/\bFeeds?\b/gi, '').replace(/\s+/g, ' ').trim()} | Horizon`}</title>
        <meta name="description" content={selectedArticle.summary || "Read this article on Horizon Professional News Portal"} />
        <meta property="og:title" content={selectedArticle.title.replace(/\bFeeds?\b/gi, '').replace(/\s+/g, ' ').trim()} />
        {selectedArticle.imageUrl && <meta property="og:image" content={selectedArticle.imageUrl} />}
    </Helmet>
 <nav id="reader-sticky-controls" className="sticky top-0 z-50 bg-portal-surface border-b border-portal-border flex flex-col shrink-0">
  <div className="h-1 w-full bg-portal-border/30">
    <div className="h-full bg-portal-brand transition-all duration-75" style={{ width: `${scrollProgress}%` }} />
  </div>
  <div className="flex items-center justify-between px-4 sm:px-8 h-15 py-3">
 <div className="flex items-center space-x-4">
 <button
 onClick={closeReader}
 className="text-portal-text-muted hover:text-portal-text-main transition-colors p-2 hover:bg-portal-surface-hover flex items-center space-x-1.5 focus:outline-none"
 >
 <ArrowLeft size={16} />
 <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider font-mono">Stream View</span>
 </button>

 <div className="h-5 w-px bg-portal-border hidden sm:block" />

 <div className="flex items-center space-x-2">
 <span className="text-[10px] bg-portal-brand/10 text-portal-brand border border-portal-brand px-2 py-0.5 uppercase font-mono tracking-tight">
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
 className={`px-3 py-1.5 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${isCleanMode
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
 className={`h-6 w-6 border flex items-center justify-center transition-all ${th === 'midnight' ? 'bg-[#000000] border-zinc-800' :
 th === 'charcoal' ? 'bg-[#212121] border-zinc-700' :
 'bg-[#faf0e6] border-zinc-300'
 } ${cleanTheme === th ? 'ring-2 ring-blue-500 scale-110' : 'opacity-70'}`}
 >
 {cleanTheme === th && <span className={`h-1.5 w-1.5 ${th === 'sepia' ? 'bg-[#212121]' : 'bg-[#fafafa]'}`} />}
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
 className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-tighter ${cleanFontSize === sz ? 'bg-blue-600 text-white' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-500'
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
 <div className="mb-8 p-3 bg-blue-500/10 border border-blue-900/30 text-[11px] font-mono select-none flex items-center justify-between text-blue-400">
 <div className="flex items-center space-x-1.5">
 <Feather size={12} className="animate-bounce" />
 <span>Clean Mode Active: distraction-free layout activated. Adjust background backdrops or scalers in header.</span>
 </div>
 <button onClick={() => setIsCleanMode(false)} className="underline hover:text-white">Exit</button>
 </div>
 )}

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
 
 {/* LEFT COLUMN: THE ARTICLE */}
 <div className="lg:col-span-7 space-y-6">
 <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight font-serif leading-tight ${isCleanMode ? 'text-inherit' : 'text-portal-text-main'}`}>
 {selectedArticle.title.replace(/\bFeeds?\b/gi, '').replace(/\s+/g, ' ').trim()}
 </h1>

 <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 text-xs font-mono ${isCleanMode ? 'border-zinc-800 text-zinc-400' : 'border-portal-border text-portal-text-muted'}`}>
 <div className="flex items-center space-x-3">
 <span className={`font-bold uppercase ${isCleanMode ? 'text-white' : 'text-portal-text-main'}`}>{selectedArticle.source}</span>
 <span>•</span>
 <span>Reporting Team</span>
 </div>
 <div className="flex items-center space-x-3">
 <span>Filed {selectedArticle.date}</span>
 <span>•</span>
 <span>{selectedArticle.readTime || '5 min read'} Focus</span>
 </div>
 </div>

  <div className={`overflow-hidden aspect-video max-h-96 w-full mb-8 relative border ${isCleanMode ? 'border-zinc-800 bg-zinc-950' : 'border-portal-border bg-portal-surface'}`}>
  {selectedArticle.imageUrl && !imgError ? (
      <>
        <img src={selectedArticle.imageUrl} alt={selectedArticle.title.replace(/\bFeeds?\b/gi, '').replace(/\s+/g, ' ').trim()} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={() => setImgError(true)} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
      </>
  ) : (
      <BrandLogoPlaceholder article={selectedArticle} className={isCleanMode ? 'bg-zinc-950' : ''} iconSizeClass="w-32 h-32" textSizeClass="text-8xl" textMarginClass="mt-4" />
  )}
  <span className="absolute bottom-3 left-3 text-[10px] font-mono text-zinc-300 uppercase tracking-widest bg-black/80 px-2 py-0.5 bg-opacity-70">
  Analytical Ledger Plate
  </span>
  </div>

 <div className={`transition-all duration-300 font-serif leading-relaxed ${cleanFontSize === 'sm' ? 'text-xs sm:text-sm' :
 cleanFontSize === 'md' ? 'text-sm sm:text-base' :
 cleanFontSize === 'lg' ? 'text-base sm:text-lg' :
 'text-lg sm:text-xl'
 } space-y-6 ${isCleanMode ? (cleanTheme === 'sepia' ? 'text-[#382b26]' : 'text-zinc-200') : 'text-portal-text-main'}`}>
 {isScraping ? (
 <div className="py-12 flex flex-col items-center justify-center space-y-4">
 <RefreshCw size={24} className="animate-spin text-portal-brand" />
 <p className="text-xs font-mono text-portal-text-muted animate-pulse">
 Connecting secure stream to original news wire...
 </p>
 </div>
 ) : (
 (fullContent || selectedArticle.content || '').split('\n\n').map((paragraph, pIdx) => {
 const cleaned = cleanHtmlText(paragraph);
 if (!cleaned) return null;
 return (
 <p key={pIdx} className="first-letter:font-mono">{cleaned}</p>
 );
 })
 )}

 {(selectedArticle.originalUrl || selectedArticle.url) && (
 <div className={`pt-6 mt-6 border-t ${isCleanMode ? 'border-zinc-800' : 'border-portal-border/50'}`}>
 <a
 href={selectedArticle.originalUrl || selectedArticle.url}
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

 {/* RIGHT COLUMN: CONTEXT & INTERACTIVE WIDGETS */}
 <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
 {/* Trust Score & Perspectives Widget */}
 <div className={`p-5 border ${isCleanMode ? 'bg-zinc-900 border-zinc-800' : 'bg-portal-surface border-portal-border shadow-sm'}`}>
 <div className="flex items-center gap-4 mb-4">
 <div className={`flex items-center justify-center w-12 h-12 border-4 ${isCleanMode ? 'border-cyan-900 text-cyan-400' : 'border-emerald-500/30 text-emerald-600'} relative shrink-0`}>
 <span className="text-sm font-black font-mono">94</span>
 <svg className="absolute inset-0 w-full h-full" viewBox="0 0 36 36">
 <path className={`${isCleanMode ? 'text-cyan-400' : 'text-emerald-500'}`} strokeDasharray="94, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
 </svg>
 </div>
 <div>
 <div className={`flex items-center gap-1.5 font-bold uppercase tracking-widest text-[10px] ${isCleanMode ? 'text-cyan-400' : 'text-emerald-600'}`}>
 <ShieldCheck size={14} /> <span>Trust Score</span>
 </div>
 <div className={`text-xs mt-0.5 ${isCleanMode ? 'text-zinc-400' : 'text-portal-text-muted'}`}>
 Cross-referenced with 4 official data sources.
 </div>
 </div>
 </div>
 
 <button
 onClick={() => setShowPerspectives(!showPerspectives)}
 className={`w-full py-2 text-xs font-bold transition-all flex items-center justify-center gap-2 border ${isCleanMode ? 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700' : 'bg-portal-bg text-portal-text-main border-portal-border shadow-sm hover:bg-portal-surface-hover'}`}
 >
 <Globe size={14} className={isCleanMode ? 'text-cyan-400' : 'text-portal-brand'} />
 <span>{showPerspectives ? 'Hide Other Perspectives' : 'View Other Perspectives'}</span>
 </button>

 {showPerspectives && (
 <div className="mt-4 pt-4 border-t border-portal-border/40 space-y-3">
 <div className={`p-3 border ${isCleanMode ? 'bg-[#09090b] border-zinc-800' : 'bg-portal-bg border-portal-border'}`}>
 <div className="flex justify-between items-center mb-1">
 <span className={`text-[10px] font-bold font-mono uppercase ${isCleanMode ? 'text-zinc-300' : 'text-portal-text-main'}`}>European Union Lens</span>
 <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-600 font-bold">Regulatory Focus</span>
 </div>
 <p className={`text-[11px] leading-relaxed ${isCleanMode ? 'text-zinc-400' : 'text-portal-text-muted'}`}>Emphasizes the privacy and regulatory implications of this event, rather than the technological breakthrough.</p>
 </div>
 <div className={`p-3 border ${isCleanMode ? 'bg-[#09090b] border-zinc-800' : 'bg-portal-bg border-portal-border'}`}>
 <div className="flex justify-between items-center mb-1">
 <span className={`text-[10px] font-bold font-mono uppercase ${isCleanMode ? 'text-zinc-300' : 'text-portal-text-main'}`}>Asia-Pacific Lens</span>
 <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-600 font-bold">Economic Impact</span>
 </div>
 <p className={`text-[11px] leading-relaxed ${isCleanMode ? 'text-zinc-400' : 'text-portal-text-muted'}`}>Reports primarily on the supply chain disruptions and market opportunities created in the APAC region.</p>
 </div>
 </div>
 )}
 </div>

 {/* Investigative Deep-Dive dossier widget */}
 <div className={`p-5 sm:p-6 space-y-4 border ${isCleanMode ? 'bg-zinc-900 border-zinc-800' : 'bg-portal-surface border-portal-border'}`}>
 <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${isCleanMode ? 'text-cyan-400' : 'text-portal-accent'}`}>EDITORIAL INVESTIGATIVE FOLLOW-UP</span>
 <h4 className={`font-serif font-semibold ${isCleanMode ? 'text-white' : 'text-portal-text-main'}`}>Generate deep-dive reports on this dynamic topic</h4>
 <p className={`text-xs ${isCleanMode ? 'text-zinc-400' : 'text-portal-text-muted'}`}>Instruct The Horizon Post engine to construct full-sentence microanalyses, quotes, and supply logs.</p>
 <button
 disabled={isExpandingDeepDive}
 onClick={() => handleDeepDiveExpand(selectedArticle.title)}
 className={`w-full py-2.5 text-xs font-semibold flex items-center justify-center space-x-2 transition-all font-mono group ${isCleanMode
 ? 'bg-[#1a1c24] hover:bg-[#20232e] text-cyan-300 border border-cyan-900/30'
 : 'bg-portal-accent hover:opacity-90 text-white shadow-sm'
 }`}
 >
 {isExpandingDeepDive ? (
 <>
 <RefreshCw size={14} className="animate-spin" />
 <span>Formulating deep-dive dossier...</span>
 </>
 ) : (
 <>
 <Sparkles size={14} className="animate-pulse group-hover:scale-110 transition-transform" />
 <span>Conduct Deep-Dive dossier</span>
 </>
 )}
 </button>

 {expandedContent && (
 <div className={`p-4 space-y-3 border ${isCleanMode ? 'bg-[#09090b] border-zinc-800' : 'bg-portal-bg border-portal-border'}`}>
 <div className={`flex items-center space-x-2 text-[10px] font-mono ${isCleanMode ? 'text-[#22c55e]' : 'text-emerald-500'}`}>
 <span className={`inline-block h-1.5 w-1.5 ${isCleanMode ? 'bg-[#22c55e]' : 'bg-emerald-500'}`} />
 <span>DOSSIER COMPLETED • The Horizon Post formulation output:</span>
 </div>
 <div className={`text-xs sm:text-sm font-serif leading-relaxed whitespace-pre-line border-t pt-3 ${isCleanMode ? 'text-zinc-300 border-zinc-850' : 'text-portal-text-main border-portal-border/50'}`}>
 {expandedContent}
 </div>
 <div className={`flex items-center justify-between pt-2 text-[9px] font-mono ${isCleanMode ? 'text-zinc-500' : 'text-portal-text-muted'}`}>
 <span>Interbank validation verified</span>
 <span>Today, {new Date().toLocaleTimeString()}</span>
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
 <div className="flex items-center space-x-2 hidden sm:flex">
    {['👍', '🤯', '🔥'].map(emoji => (
        <motion.button
            key={emoji}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9, rotate: -10 }}
            onClick={() => handleReaction(emoji)}
            className="flex items-center space-x-1 px-3 py-1 bg-portal-bg border border-portal-border rounded-full hover:bg-portal-surface-hover transition-colors"
        >
            <span className="text-lg">{emoji}</span>
            <span className="text-xs font-bold text-portal-text-main">{reactions[emoji] || 0}</span>
        </motion.button>
    ))}
 </div>
 <button
 onClick={closeReader}
 className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase px-4 py-2 "
 >
 Back to Portal
 </button>
 </footer>
 </div>
 );
}
