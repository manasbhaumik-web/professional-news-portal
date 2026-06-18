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
  const [activeVideo, setActiveVideo] = useState<VideoData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

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
            setActiveVideo(combined[0]);
          } else {
            setGlobalVideos(LIVE_BROADCASTS);
            setActiveVideo(LIVE_BROADCASTS[0]);
          }
        } else {
          setGlobalVideos(LIVE_BROADCASTS);
          setActiveVideo(LIVE_BROADCASTS[0]);
        }
      } catch (err) {
        console.error("Failed to fetch videos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
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
    <div id="global-video-panel" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Featured Top Player (Left Side) */}
      <div className="lg:col-span-2">
        <div
          className={`rounded-2xl overflow-hidden border relative flex flex-col ${isDark ? 'border-zinc-800 bg-[#0F1115]' : isSepia ? 'border-[#CDBC9D] bg-[#FAF6EE]' : 'border-neutral-200 bg-white'
            }`}
        >
          {/* MAIN VIDEO WRAPPER */}
          <div className="bg-black w-full flex justify-center border-b border-neutral-800/50">
            <div className="w-full aspect-video relative flex items-center justify-center">
              {isPlaying && activeVideo ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${activeVideo.id}${activeVideo.id.includes('?') ? '&' : '?'}autoplay=1`}
                  title={activeVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 rounded-lg shadow-2xl"
                ></iframe>
              ) : (
                <div className="w-full h-full relative cursor-pointer group rounded-lg overflow-hidden shadow-2xl" onClick={() => setIsPlaying(true)}>
                  <img
                    src={activeVideo?.imageUrl}
                    alt="Main Featured Stream"
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent" />
                  <button className="absolute inset-0 m-auto w-16 h-16 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg shadow-red-900/50 transform group-hover:scale-110 transition-transform flex items-center justify-center">
                    <PlayCircle size={32} />
                  </button>
                  {activeVideo?.isLive && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center space-x-1 uppercase tracking-wider animate-pulse">
                      <Radio size={12} />
                      <span>LIVE</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM TITLE, DESCRIPTION & DATE */}
          <div className="p-5 sm:p-6 pt-5">
            <div className="flex justify-between items-center mb-3">
              <div className={`text-[10px] font-mono tracking-widest font-bold uppercase ${isDark ? 'text-blue-500' : isSepia ? 'text-[#8C6239]' : 'text-blue-600'
                }`}>
                {activeVideo?.source}
              </div>
              <div className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${isDark ? 'border-zinc-700 text-zinc-400 bg-zinc-800/50' : isSepia ? 'border-[#CDBC9D] text-[#8C6239] bg-[#FAF6EE]' : 'border-neutral-200 text-neutral-500 bg-neutral-50'
                }`}>
                {activeVideo?.region}
              </div>
            </div>

            <h4 className={`text-2xl sm:text-3xl font-serif font-black leading-tight mb-3 ${isDark ? 'text-white' : isSepia ? 'text-[#2C2114]' : 'text-neutral-950'
              }`}>
              {activeVideo?.title}
            </h4>

            <p className={`text-sm sm:text-base leading-relaxed mb-4 ${isDark ? 'text-zinc-300' : isSepia ? 'text-[#5C4D3E]' : 'text-neutral-600'
              }`}>
              {activeVideo?.description}
            </p>
            <div className={`text-[11px] font-mono flex flex-wrap items-center gap-4 ${textMutedClass}`}>
              <span className="flex items-center space-x-1 font-bold">
                <span>{activeVideo?.date}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye size={12} />
                <span>{activeVideo?.views}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Clip List (Right Side) */}
      <div className="lg:col-span-1 flex flex-col space-y-3 overflow-y-auto max-h-[85vh] pr-2" style={{ scrollbarWidth: 'thin' }}>
        <h3 className={`font-serif font-bold text-lg mb-2 flex items-center space-x-2 ${isDark ? 'text-white' : isSepia ? 'text-[#2C2114]' : 'text-neutral-900'}`}>
          <PlayCircle size={18} />
          <span>Up Next</span>
        </h3>
        {globalVideos.filter(vid => vid.id !== activeVideo?.id).map((vid) => (
          <div
            key={vid.id}
            className={`cursor-pointer group flex flex-col transition-opacity hover:opacity-80`}
            onClick={() => {
              setActiveVideo(vid);
              setIsPlaying(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-full aspect-video relative bg-zinc-900 rounded-xl overflow-hidden shrink-0 mb-2">
              <img
                src={vid.imageUrl}
                alt={vid.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/50 p-2 rounded-full backdrop-blur-sm shadow-xl">
                  <PlayCircle size={20} className="text-white" />
                </div>
              </div>
              <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-mono px-1 py-0.5 rounded shadow-sm">
                {vid.duration}
              </span>
            </div>
            <div className="flex flex-col px-1">
              <h5 className={`font-serif font-bold text-xs leading-snug line-clamp-2 mb-1 ${isDark ? 'text-slate-200' : isSepia ? 'text-[#2C2114]' : 'text-neutral-900'
                }`}>
                {vid.title}
              </h5>
              <div className={`text-[10px] font-mono flex items-center gap-1.5 ${textMutedClass}`}>
                <span>{vid.source}</span>
                <span className="opacity-50">•</span>
                <span>{vid.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
