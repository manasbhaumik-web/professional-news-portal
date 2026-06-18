import React, { useState, useEffect } from 'react';
import { MapPin, Users, CloudRain, AlertTriangle, Calendar, ChevronRight, Activity, Clock, MoreHorizontal, Globe, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';

interface LocalPageProps {
  theme: 'dark' | 'light' | 'sepia';
}

export default function LocalPage({ theme }: LocalPageProps) {
  const isDark = theme === 'dark';
  const isSepia = theme === 'sepia';

  const [citizenReports, setCitizenReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locationName, setLocationName] = useState("San Francisco, CA");

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
          const data = await res.json();
          const country = data.address.country || "Unknown Country";
          const state = data.address.state || "";
          setLocationName(`${state ? `${state}, ` : ''}${country}`);
        } catch (e) {
          console.error("Location fetch failed", e);
        }
      }, () => {
        console.error("Geolocation access denied");
      });
    }

    fetch('/api/news/reports')
      .then(res => res.json())
      .then(data => {
        setCitizenReports(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch citizen reports:", err);
        setIsLoading(false);
      });
  }, []);

  const bgClass = isDark ? 'bg-[#0A0B0D]' : isSepia ? 'bg-[#FAF3E3]' : 'bg-white';
  const borderClass = isDark ? 'border-zinc-800' : isSepia ? 'border-[#CDBC9D]' : 'border-neutral-200';
  const textMutedClass = isDark ? 'text-zinc-400' : isSepia ? 'text-[#5C4D3E]' : 'text-neutral-500';
  const textPrimaryClass = isDark ? 'text-white' : isSepia ? 'text-[#2C2114]' : 'text-neutral-900';
  const cardBgClass = isDark ? 'bg-[#14161B]' : isSepia ? 'bg-[#FAF6EE]' : 'bg-white';

  const localEvents = [
    { title: 'City Council: Zoning Law Revisions', time: 'Today, 6:00 PM', attendees: 120, type: 'Government' },
    { title: 'Downtown Tech Mixer & Startup Pitch', time: 'Tomorrow, 5:30 PM', attendees: 85, type: 'Business' },
    { title: 'Community Park Restoration Drive', time: 'Saturday, 9:00 AM', attendees: 340, type: 'Volunteer' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Top Banner / Metrics */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4`}>
        <div className={`p-5 rounded-2xl border ${borderClass} ${cardBgClass} flex items-center justify-between`}>
          <div>
            <div className={`text-[10px] font-mono tracking-widest font-bold uppercase mb-1 ${textMutedClass}`}>Current Location</div>
            <div className={`text-xl font-serif font-black ${textPrimaryClass}`}>{locationName}</div>
          </div>
          <div className={`p-3 rounded-full ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            <MapPin size={24} />
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${borderClass} ${cardBgClass} flex items-center justify-between`}>
          <div>
            <div className={`text-[10px] font-mono tracking-widest font-bold uppercase mb-1 ${textMutedClass}`}>Weather Conditions</div>
            <div className={`text-xl font-serif font-black ${textPrimaryClass}`}>64°F / Light Rain</div>
          </div>
          <div className={`p-3 rounded-full ${isDark ? 'bg-cyan-900/30 text-cyan-400' : 'bg-cyan-50 text-cyan-600'}`}>
            <CloudRain size={24} />
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${borderClass} ${cardBgClass} flex items-center justify-between`}>
          <div>
            <div className={`text-[10px] font-mono tracking-widest font-bold uppercase mb-1 ${textMutedClass}`}>Active Alerts</div>
            <div className={`text-xl font-serif font-black text-red-500`}>1 Traffic Advisory</div>
          </div>
          <div className="p-3 rounded-full bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Local News Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`p-6 rounded-2xl border-2 border-portal-brand/40 shadow-[0_0_25px_rgba(16,185,129,0.15)] ${cardBgClass} relative overflow-hidden ring-1 ring-portal-brand/20`}>
            <div className="absolute inset-0 bg-gradient-to-br from-portal-brand/5 to-transparent pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between mb-6">
              <h3 className={`font-serif font-black text-2xl flex items-center gap-2 ${textPrimaryClass}`}>
                <Activity className="text-portal-brand" /> Live Citizen Intel
              </h3>
              <span className={`text-[10px] font-mono tracking-widest uppercase font-bold px-2 py-1 rounded bg-portal-brand/10 text-portal-brand border border-portal-brand/20`}>Real-Time Feed</span>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className={`p-8 text-center border border-dashed rounded-xl ${borderClass} ${textMutedClass} font-mono text-xs uppercase tracking-widest`}>
                  Syncing local reports...
                </div>
              ) : citizenReports.length === 0 ? (
                <div className={`p-8 text-center border border-dashed rounded-xl ${borderClass} ${textMutedClass} font-mono text-xs flex flex-col items-center`}>
                  <AlertTriangle size={32} className="mb-4 opacity-50" />
                  <span className="uppercase tracking-widest mb-2 font-bold">No incidents detected</span>
                  <p className="opacity-70 normal-case tracking-normal">The grid is quiet. Be the first to report an event from your sector.</p>
                </div>
              ) : (
                citizenReports.map((report) => (
                  <div key={report.id} className={`relative z-10 flex flex-col p-4 sm:p-5 rounded-xl border border-portal-border shadow-sm transition-all bg-portal-surface`}>
                    {/* Facebook Post Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-portal-brand to-portal-accent p-0.5 shrink-0">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${report.id}`} alt="User Avatar" className="w-full h-full rounded-full bg-white object-cover" />
                        </div>
                        <div>
                          <h4 className={`font-bold text-sm leading-none hover:underline cursor-pointer ${textPrimaryClass}`}>
                            Anonymous Resident
                          </h4>
                          <div className={`flex items-center gap-1 mt-1 text-[11px] ${textMutedClass}`}>
                            <span>{new Date(report.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            <span>·</span>
                            <Globe size={10} />
                            <span>·</span>
                            <span className="font-semibold text-portal-brand">{report.location}</span>
                          </div>
                        </div>
                      </div>
                      <button className={`p-1.5 rounded-full hover:bg-portal-surface-hover transition-colors ${textMutedClass}`}>
                        <MoreHorizontal size={16} />
                      </button>
                    </div>

                    {/* Post Content */}
                    <div className="mb-3">
                      <div className={`text-[10px] font-mono tracking-widest font-bold uppercase mb-2 ${report.category === 'Alert' ? 'text-red-500' : 'text-portal-brand'}`}>
                        {report.category}
                      </div>
                      <h4 className={`font-bold text-base mb-1 ${textPrimaryClass}`}>
                        {report.headline}
                      </h4>
                      <p className={`text-sm whitespace-pre-wrap leading-relaxed ${textPrimaryClass}`}>
                        {report.details}
                      </p>
                    </div>

                    {/* Attached Media (if any) */}
                    {report.mediaUrl && (
                      <div className="mb-3 -mx-4 sm:-mx-5 border-y border-portal-border bg-black">
                        <img src={report.mediaUrl} alt="Report media" className="w-full h-auto object-contain max-h-96 mx-auto" onError={(e) => (e.currentTarget.style.display = 'none')} />
                      </div>
                    )}

                    {/* Engagement Stats */}
                    <div className={`flex items-center justify-between text-[11px] py-2 border-b border-portal-border ${textMutedClass}`}>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-portal-brand flex items-center justify-center">
                          <ThumbsUp size={8} className="text-white fill-current" />
                        </div>
                        <span>12</span>
                      </div>
                      <div className="flex gap-3 hover:underline cursor-pointer">
                        <span>4 Comments</span>
                        <span>2 Shares</span>
                      </div>
                    </div>

                    {/* Facebook Actions */}
                    <div className="flex items-center justify-between pt-1">
                      <button className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md hover:bg-portal-surface-hover transition-colors text-sm font-semibold ${textMutedClass}`}>
                        <ThumbsUp size={18} /> Like
                      </button>
                      <button className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md hover:bg-portal-surface-hover transition-colors text-sm font-semibold ${textMutedClass}`}>
                        <MessageCircle size={18} /> Comment
                      </button>
                      <button className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md hover:bg-portal-surface-hover transition-colors text-sm font-semibold ${textMutedClass}`}>
                        <Share2 size={18} /> Share
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Upcoming Events */}
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${borderClass} ${cardBgClass}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`font-serif font-black text-lg ${textPrimaryClass}`}>Community Events</h3>
              <Calendar size={18} className={textMutedClass} />
            </div>

            <div className="space-y-4">
              {localEvents.map((event, idx) => (
                <div key={idx} className={`pb-4 ${idx !== localEvents.length - 1 ? `border-b ${borderClass}` : ''}`}>
                  <div className={`text-[9px] font-mono tracking-widest font-bold uppercase mb-1 ${textMutedClass}`}>
                    {event.type}
                  </div>
                  <h4 className={`font-bold text-sm leading-snug mb-2 ${textPrimaryClass}`}>
                    {event.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-mono ${textMutedClass}`}>{event.time}</span>
                    <span className="flex items-center gap-1 text-blue-500 font-medium">
                      <Users size={12} /> {event.attendees}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button className={`w-full mt-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-lg border ${borderClass} hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1 ${textPrimaryClass}`}>
              View Full Calendar <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
