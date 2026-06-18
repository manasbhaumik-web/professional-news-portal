import React, { useState } from 'react';
import { Menu, Trophy } from 'lucide-react';

interface ChannelsNavProps {
  selectedMenuCategory: string;
  setSelectedMenuCategory: (category: string) => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const REGIONS = ['North America', 'Latin America', 'Europe', 'Arab', 'Sub-Saharan Africa', 'South Asia', 'South East Asia', 'East Asia', 'Oceania'];

const CATEGORIES = [
  { id: 'Politics', tab: 'politics', items: ['Global Politics', 'Local Politics', 'Elections', 'Policy'] },
  { id: 'Business', tab: 'business', items: ['Markets', 'Finance', 'Economy', 'Startups'] },
  { id: 'Sports', tab: 'sports', items: ['Football', 'Tennis', 'Motorsport', 'Cricket', 'Golf', 'Boxing/MMA', 'Rugby', 'Athletics', 'Cycling'] },
  { id: 'Entertainment', tab: 'entertainment', items: ['Movies', 'Music', 'Television', 'Celebrity'] },
  { id: 'Science & Tech', tab: 'scienceTech', items: ['Technology', 'Science', 'Space', 'Computing', 'Cybersecurity'] }
];

export default function ChannelsNav({
  selectedMenuCategory,
  setSelectedMenuCategory,
  activeTab,
  setActiveTab
}: ChannelsNavProps) {
  return (
    <div id="channels-navigation-menu" className="border-b transition-all py-3 px-4 sm:px-8 bg-portal-bg border-portal-border text-portal-text-main shadow-sm sticky top-16 z-30">
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex flex-wrap items-center gap-y-3 gap-x-1 sm:gap-x-2 w-full">

          {/* ── All Channels Mega Menu (Regions) ── */}
          <div className="group/allchannels relative h-full flex items-center">
            <button className="flex items-center space-x-2 mr-3 sm:mr-4 border-r pr-3 sm:pr-4 border-current opacity-70 hover:opacity-100 transition-opacity shrink-0 py-1 cursor-pointer">
              <Menu size={16} />
              <span className="text-[11px] font-sans tracking-widest font-bold uppercase">All Channels</span>
            </button>

            {/* Regions dropdown */}
            <div className="absolute left-0 top-full w-64 bg-portal-bg border border-portal-border rounded-b-xl shadow-2xl transition-all duration-200 origin-top opacity-0 scale-y-95 invisible group-hover/allchannels:opacity-100 group-hover/allchannels:scale-y-100 group-hover/allchannels:visible">
              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-portal-text-muted border-b border-portal-border/50 pb-2 mb-1">Browse by Region</h3>
                <button
                  onClick={() => { setSelectedMenuCategory('All'); setActiveTab('trending'); }}
                  className="text-left text-[11px] font-bold uppercase text-portal-brand hover:underline w-full cursor-pointer"
                >
                  🌐 All Regions (World)
                </button>
                {REGIONS.map(region => (
                  <button
                    key={region}
                    onClick={() => {
                      setSelectedMenuCategory(`Region: ${region}`);
                      if (activeTab !== 'trending' && activeTab !== 'foryou') setActiveTab('trending');
                    }}
                    className={`text-left text-xs uppercase transition-colors w-full cursor-pointer py-0.5 hover:text-portal-brand ${selectedMenuCategory === `Region: ${region}` ? 'text-portal-brand font-bold' : 'text-portal-text-main'}`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Category Buttons, each with its own dropdown ── */}
          <div className="flex flex-wrap items-center gap-1 flex-1">

            {/* Latest */}
            <button
              onClick={() => { setSelectedMenuCategory('All'); setActiveTab('trending'); }}
              className={`px-3 py-1.5 text-xs font-sans font-bold uppercase tracking-wider rounded-lg transition-all ${selectedMenuCategory === 'All' && activeTab === 'trending' ? 'bg-portal-brand/10 text-portal-brand shadow-sm' : 'hover:bg-portal-surface hover:text-portal-text-main text-portal-text-muted'}`}
            >
              Latest
            </button>

            {/* Each category with its own hover dropdown */}
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="group/cat relative">
                <button
                  onClick={() => { setSelectedMenuCategory(cat.id); setActiveTab(cat.tab as any); }}
                  className={`px-3 py-1.5 text-xs font-sans font-bold uppercase tracking-wider rounded-lg transition-all hidden sm:block ${selectedMenuCategory.startsWith(cat.id) ? 'bg-portal-brand/10 text-portal-brand shadow-sm' : 'hover:bg-portal-surface hover:text-portal-text-main text-portal-text-muted'}`}
                >
                  {cat.id}
                </button>

                {/* Category sub-items dropdown */}
                <div className="absolute left-0 top-full mt-1 w-48 bg-portal-bg border border-portal-border rounded-xl shadow-2xl transition-all duration-150 origin-top opacity-0 scale-y-95 invisible group-hover/cat:opacity-100 group-hover/cat:scale-y-100 group-hover/cat:visible z-50">
                  <div className="p-3 flex flex-col gap-1.5">
                    <h3 className="text-[9px] font-black uppercase tracking-widest text-portal-text-muted border-b border-portal-border/50 pb-1.5 mb-0.5">{cat.id}</h3>
                    <button
                      onClick={() => { setSelectedMenuCategory(cat.id); setActiveTab(cat.tab as any); }}
                      className="text-left text-[11px] font-bold uppercase text-portal-brand hover:underline w-full cursor-pointer"
                    >
                      All {cat.id}
                    </button>
                    {cat.items.map(item => (
                      <button
                        key={item}
                        onClick={() => {
                          setSelectedMenuCategory(`${cat.id}: ${item}`);
                          setActiveTab(cat.tab as any);
                        }}
                        className={`text-left text-xs uppercase transition-colors w-full cursor-pointer py-0.5 hover:text-portal-brand ${selectedMenuCategory === `${cat.id}: ${item}` ? 'text-portal-brand font-bold' : 'text-portal-text-main'}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FIFA Link on right side */}
          <button
            onClick={() => { setActiveTab('fifa'); setSelectedMenuCategory('All'); }}
            className={`px-3 py-1.5 text-xs font-sans font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'fifa'
              ? 'bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c] font-black shadow-sm shadow-[#c9a84c]/20'
              : 'hover:bg-portal-surface hover:text-portal-text-main border border-transparent text-portal-text-muted'
              }`}
          >
            <Trophy size={11} />
            FIFA 2026
          </button>
        </div>
      </div>
    </div>
  );
}
