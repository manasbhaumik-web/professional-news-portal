import React, { useState, useEffect } from 'react';
import { PlayCircle, Radio, Eye, ExternalLink, Loader2 } from 'lucide-react';

interface GlobalPageProps {
 theme: 'dark' | 'light' | 'sepia';
}

interface VideoData {
 id: string;
 title: string;
 duration: string;
 source: string;
 region: string;
 views: string;
 isLive: boolean;
 imageUrl: string;
 youtubeUrl: string;
 date?: string;
 description?: string;
}

export default function GlobalPage({ theme }: GlobalPageProps) {
 const isDark = theme === 'dark';
 const isSepia = theme === 'sepia';

 const textMutedClass = isDark ? "text-zinc-400" : isSepia ? "text-[#5C4D3E]" : "text-neutral-500";

 const [globalVideos, setGlobalVideos] = useState<VideoData[]>([]);
 const [activeVideo, setActiveVideo] = useState<VideoData | null>(() => {
   try {
     const saved = localStorage.getItem('horizon_tv_active_video');
     if (saved) return JSON.parse(saved);
   } catch (e) {
     console.error('Failed to load active video from storage', e);
   }
   return null;
 });
 const [isPlaying, setIsPlaying] = useState(false);
 const [loading, setLoading] = useState(true);
 const [visibleCount, setVisibleCount] = useState(12);

 useEffect(() => {
   if (activeVideo) {
     localStorage.setItem('horizon_tv_active_video', JSON.stringify(activeVideo));
   }
 }, [activeVideo]);

 const LIVE_BROADCASTS: VideoData[] = [
 {
 id: "live_stream?channel=UCoMdktPbSTixAyNGwb-PUYA",
 title: "Sky News Live",
 duration: "LIVE",
 source: "Sky News",
 region: "Europe",
 views: "Live",
 isLive: true,
 imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
 youtubeUrl: "https://www.youtube.com/watch?v=9Auq9mYxFEE",
 description: "Watch Sky News live for the latest breaking news and updates."
 },
 {
 id: "live_stream?channel=UCNye-wNBqNL5ZzHSJj3l8Bg",
 title: "Al Jazeera English Live",
 duration: "LIVE",
 source: "Al Jazeera",
 region: "Middle East",
 views: "Live",
 isLive: true,
 imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
 youtubeUrl: "https://www.youtube.com/watch?v=bByzwEGGAgo",
 description: "Al Jazeera English live stream for global news."
 },
 {
 id: "live_stream?channel=UCeY0bbntWzzVIaj2z3QigXg",
 title: "NBC News Live",
 duration: "LIVE",
 source: "NBC News",
 region: "North America",
 views: "Live",
 isLive: true,
 imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
 youtubeUrl: "https://www.youtube.com/watch?v=0bT4R_b2jXQ",
 description: "NBC News NOW live stream."
 }
 ];

 useEffect(() => {
 const fetchVideos = async () => {
 try {
 const res = await fetch('/api/news/videos');
 if (res.ok) {
 const data = await res.json();
 if (data && data.length > 0) {
 const combined = [...LIVE_BROADCASTS, ...data];
 setGlobalVideos(combined);
 setActiveVideo(prev => prev || combined[0]);
 } else {
 setGlobalVideos(LIVE_BROADCASTS);
 setActiveVideo(prev => prev || LIVE_BROADCASTS[0]);
 }
 } else {
 setGlobalVideos(LIVE_BROADCASTS);
 setActiveVideo(prev => prev || LIVE_BROADCASTS[0]);
 }
 } catch (err) {
 console.error("Failed to fetch videos:", err);
 } finally {
 setLoading(false);
 }
 };
 fetchVideos();
 }, []);

 useEffect(() => {
   const handler = (e: CustomEvent) => {
     setActiveVideo(e.detail);
     setIsPlaying(true);
     window.scrollTo({ top: 0, behavior: 'smooth' });
   };
   window.addEventListener('playGlobalVideo', handler as EventListener);
   return () => window.removeEventListener('playGlobalVideo', handler as EventListener);
 }, []);

 if (loading) {
 return (
 <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
 <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-blue-500' : 'text-blue-600'}`} />
 <p className={`font-mono text-sm ${textMutedClass}`}>Connecting to Global TV Feeds...</p>
 </div>
 );
 }

 if (globalVideos.length === 0) {
 return (
 <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
 <Radio className={`w-12 h-12 ${textMutedClass} opacity-50`} />
 <p className={`font-mono text-sm ${textMutedClass}`}>No TV feeds available right now.</p>
 </div>
 );
 }

 return (
    <div className="flex flex-col gap-8 w-full pb-10 font-sans">
      
      {/* Featured Active Player */}
      {activeVideo && (
        <div className={`w-full rounded-2xl overflow-hidden border transition-colors ${
          isDark ? 'bg-[#0F1115] border-white/10' : 
          isSepia ? 'bg-[#FAF6EE] border-[#CDBC9D]' : 
          'bg-white border-neutral-200 shadow-sm'
        }`}>
          {/* Video Player */}
          <div className="w-full aspect-video bg-black relative group/player">
            {isPlaying && activeVideo ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${activeVideo.id}${activeVideo.id.includes('?') ? '&' : '?'}autoplay=1`}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            ) : (
              <div className="w-full h-full relative cursor-pointer" onClick={() => setIsPlaying(true)}>
                <img
                  src={activeVideo?.imageUrl}
                  alt="Main Featured Stream"
                  className="w-full h-full object-cover opacity-90 group-hover/player:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/30 group-hover/player:bg-transparent transition-colors duration-300" />
                <button className="absolute inset-0 m-auto w-16 h-16 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center transform group-hover/player:scale-110 transition-transform shadow-lg">
                  <PlayCircle size={32} className="pl-1" />
                </button>
              </div>
            )}
          </div>

          {/* Active Video Info */}
          <div className="p-4 sm:p-6">
            <h1 className={`text-xl sm:text-2xl font-bold mb-3 ${isDark ? 'text-white' : isSepia ? 'text-[#2C2114]' : 'text-neutral-900'}`}>
              {activeVideo.title}
            </h1>
            <div className={`flex flex-wrap items-center gap-3 text-sm font-medium mb-4 ${textMutedClass}`}>
              <div className="flex items-center gap-2">
                {activeVideo.isLive && (
                  <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 uppercase tracking-wider animate-pulse">
                    <Radio size={12} /> LIVE
                  </span>
                )}
                <span>{activeVideo.source}</span>
              </div>
              <span className="opacity-50">•</span>
              <span>{activeVideo.region}</span>
              <span className="opacity-50">•</span>
              <span className="flex items-center gap-1"><Eye size={14} /> {activeVideo.views}</span>
              {activeVideo.date && (
                <>
                  <span className="opacity-50">•</span>
                  <span>{activeVideo.date}</span>
                </>
              )}
            </div>
            {activeVideo.description && (
              <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : isSepia ? 'text-[#5C4D3E]' : 'text-neutral-600'}`}>
                {activeVideo.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {globalVideos.filter(vid => vid.id !== activeVideo?.id).slice(0, visibleCount).map((vid) => (
          <div
            key={vid.id}
            className="flex flex-col gap-3 group cursor-pointer"
            onClick={() => {
              setActiveVideo(vid);
              setIsPlaying(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {/* Thumbnail */}
            <div className="w-full aspect-video rounded-xl overflow-hidden relative bg-black/10">
              <img 
                src={vid.imageUrl} 
                alt={vid.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle size={40} className="text-white drop-shadow-md" />
              </div>
              <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs font-mono px-1.5 py-0.5 rounded shadow-sm">
                {vid.duration}
              </span>
            </div>

            {/* Video Info */}
            <div className="flex gap-3 px-1">
              {/* Optional Channel Avatar Placeholder */}
              <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                isDark ? 'bg-zinc-800 text-zinc-400' : isSepia ? 'bg-[#CDBC9D] text-[#5C4D3E]' : 'bg-neutral-200 text-neutral-500'
              }`}>
                {vid.source.charAt(0)}
              </div>
              
              <div className="flex flex-col min-w-0">
                <h3 className={`font-semibold text-sm leading-snug line-clamp-2 mb-1 group-hover:text-blue-500 transition-colors ${
                  isDark ? 'text-white' : isSepia ? 'text-[#2C2114]' : 'text-neutral-900'
                }`}>
                  {vid.title}
                </h3>
                <div className={`text-[12px] flex flex-col ${textMutedClass}`}>
                  <span>{vid.source}</span>
                  <div className="flex items-center gap-1">
                    <span>{vid.views}</span>
                    <span className="opacity-50">•</span>
                    <span>{vid.region}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {globalVideos.filter(vid => vid.id !== activeVideo?.id).length > visibleCount && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setVisibleCount(prev => prev + 12)}
            className={`px-8 py-3 rounded-full font-bold uppercase tracking-wide text-xs transition-all ${
              isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 
              isSepia ? 'bg-[#CDBC9D] hover:bg-[#BCA988] text-[#2C2114]' : 
              'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            Load More Videos
          </button>
        </div>
      )}
    </div>
  );
}
