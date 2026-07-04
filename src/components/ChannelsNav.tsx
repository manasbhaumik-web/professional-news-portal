import React, { useState } from 'react';
import { Menu, Trophy, Landmark, Briefcase, Activity, Film, Rocket, Globe2, ChevronDown } from 'lucide-react';
import { COUNTRIES } from '../utils/countryFeeds';

interface ChannelsNavProps {
    selectedMenuCategory: string;
    setSelectedMenuCategory: (category: string) => void;
    activeTab: string;
    setActiveTab: (tab: any) => void;
    selectedCountry: string;
    setSelectedCountry: (country: string) => void;
    availableRegions?: string[];
}

const REGIONS = ['North America', 'Latin America', 'Europe', 'Arab', 'Sub-Saharan Africa', 'South Asia', 'South East Asia', 'East Asia', 'Oceania'];

const CATEGORIES = [
    { id: 'Politics', icon: Landmark, tab: 'politics', items: ['Global Politics', 'Local Politics', 'Elections', 'Policy'] },
    { id: 'Business', icon: Briefcase, tab: 'business', items: ['Markets', 'Finance', 'Economy', 'Startups'] },
    { id: 'Sports', icon: Activity, tab: 'sports', items: ['Football', 'Tennis', 'Motorsport', 'Cricket', 'Golf', 'Boxing/MMA', 'Rugby', 'Athletics', 'Cycling'] },
    { id: 'Entertainment', icon: Film, tab: 'entertainment', items: ['Movies', 'Music', 'Television', 'Celebrity'] },
    { id: 'Science & Tech', icon: Rocket, tab: 'scienceTech', items: ['Technology', 'Science', 'Space', 'Computing', 'Cybersecurity'] }
];

export default function ChannelsNav({
    selectedMenuCategory,
    setSelectedMenuCategory,
    activeTab,
    setActiveTab,
    selectedCountry,
    setSelectedCountry,
    availableRegions = REGIONS
}: ChannelsNavProps) {
    const [forceClose, setForceClose] = useState(false);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

    const handleMenuClick = (category: string, tab: any) => {
        setSelectedMenuCategory(category);
        if (tab) setActiveTab(tab);
        setForceClose(true);
    };

    return (
        <nav id="channels-navigation-menu" className="border-b transition-all py-2.5 px-4 sm:px-8 bg-portal-bg/95 border-portal-border/50 text-portal-text-main" aria-label="Main Channel Navigation">
            <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
                <div className="flex flex-wrap items-center gap-y-3 gap-x-2 w-full">

                    {/* ── All Channels Mega Menu ── */}
                    <div className="group/allchannels relative h-full flex items-center" onMouseLeave={() => setForceClose(false)}>
                        <button className="flex items-center space-x-2 mr-2 sm:mr-4 pr-3 sm:pr-4 border-r border-portal-border/50 text-portal-text-muted hover:text-portal-text-main transition-colors shrink-0 py-1.5 cursor-pointer">
                            <Menu size={18} className="text-portal-brand" />
                            <span className="text-[13px] font-normal tracking-wide">
                                {selectedMenuCategory === 'All' ? 'All Channels' : selectedMenuCategory.replace('Region: ', '')}
                            </span>
                            <ChevronDown size={14} className="opacity-50 group-hover/allchannels:rotate-180 transition-transform duration-300" />
                        </button>

                        {/* Mega Dropdown */}
                        <div className={`absolute left-0 top-[120%] w-[1100px] max-w-[95vw] bg-portal-bg/95 backdrop-blur-xl border border-portal-border/50 rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 origin-top-left overflow-hidden z-50 ${!forceClose ? 'opacity-0 scale-95 invisible group-hover/allchannels:opacity-100 group-hover/allchannels:scale-100 group-hover/allchannels:visible' : 'opacity-0 scale-95 invisible'}`}>
                            <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 xl:gap-6">

                                {/* Regions Column */}
                                <div className="flex flex-col">
                                    <div className="px-1 py-2 text-[10px] font-mono tracking-widest uppercase text-portal-text-muted mb-2 flex items-center gap-2 border-b border-portal-border/30">
                                        <Globe2 size={12} /> Regions
                                    </div>
                                    <button
                                        onClick={() => handleMenuClick('All', 'trending')}
                                        className="text-left px-2 py-1.5 text-xs text-portal-brand font-bold rounded-none hover:bg-portal-brand/10 transition-colors mb-1 cursor-pointer"
                                    >
                                        🌐 All Regions (World)
                                    </button>
                                    {REGIONS.filter(r => availableRegions.includes(r)).map(region => (
                                        <button
                                            key={region}
                                            onClick={() => {
                                                const tab = (activeTab !== 'trending' && activeTab !== 'foryou') ? 'trending' : activeTab;
                                                handleMenuClick(`Region: ${region}`, tab);
                                            }}
                                            className={`text-left px-2 py-1 text-xs rounded-none transition-colors cursor-pointer ${selectedMenuCategory === `Region: ${region}` ? 'bg-portal-surface text-portal-brand font-semibold' : 'text-portal-text-main hover:bg-portal-surface hover:text-portal-brand'}`}
                                        >
                                            {region}
                                        </button>
                                    ))}
                                </div>

                                {/* Categories Columns */}
                                {CATEGORIES.map(cat => {
                                    const Icon = cat.icon;
                                    return (
                                        <div key={cat.id} className="flex flex-col">
                                            <div className="px-1 py-2 text-[10px] font-mono tracking-widest uppercase text-portal-text-muted mb-2 flex items-center gap-2 border-b border-portal-border/30">
                                                <Icon size={12} /> {cat.id}
                                            </div>
                                            <button
                                                onClick={() => handleMenuClick(cat.id, cat.tab)}
                                                className="text-left px-2 py-1.5 text-xs text-portal-brand font-bold rounded-none hover:bg-portal-brand/10 transition-colors mb-1 cursor-pointer"
                                            >
                                                All {cat.id}
                                            </button>
                                            {cat.items.map(item => (
                                                <button
                                                    key={item}
                                                    onClick={() => handleMenuClick(`${cat.id}: ${item}`, cat.tab)}
                                                    className={`text-left px-2 py-1 text-xs rounded-none transition-colors cursor-pointer ${selectedMenuCategory === `${cat.id}: ${item}` ? 'bg-portal-surface text-portal-brand font-semibold' : 'text-portal-text-main hover:bg-portal-surface hover:text-portal-brand'}`}
                                                >
                                                    {item}
                                                </button>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ── Top Level Buttons (FIFA) ── */}
                    <div className="flex flex-wrap items-center gap-1.5 flex-1">
                    </div>

                    {/* FIFA Link on right side (Promotional Shortcut) */}
                    <button
                        onClick={() => { setActiveTab('sports'); setSelectedMenuCategory('Sports: Football'); }}
                        className={`px-4 py-1.5 text-[13px] font-normal rounded-none transition-all duration-300 flex items-center gap-2 cursor-pointer ${(activeTab === 'sports' && selectedMenuCategory === 'Sports: Football') || activeTab === 'fifa'
                            ? 'bg-gradient-to-r from-[#c9a84c] to-[#e6cf8b] text-black transform scale-105'
                            : 'bg-portal-surface hover:bg-[#c9a84c]/10 text-portal-text-main hover:text-[#c9a84c] border border-portal-border hover:border-[#c9a84c]/50'
                            }`}
                    >
                        <Trophy size={14} className={((activeTab === 'sports' && selectedMenuCategory === 'Sports: Football') || activeTab === 'fifa') ? 'text-black' : 'text-[#c9a84c]'} />
                        FIFA 2026
                    </button>

                    {/* Country Selection */}
                    <div className="relative">
                        <button
                            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                            className="flex items-center justify-between gap-2 px-3 py-1.5 border border-portal-border bg-portal-bg text-portal-text-main hover:border-portal-brand transition-colors text-[13px] font-normal cursor-pointer w-[140px]"
                        >
                            <span className="truncate">{selectedCountry}</span>
                            <ChevronDown size={14} className={`transition-transform duration-200 opacity-50 ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isCountryDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsCountryDropdownOpen(false)} />
                                <div className="absolute right-0 top-full mt-1 w-max min-w-[140px] max-h-64 overflow-y-auto bg-portal-bg border border-portal-border shadow-lg z-50 py-1 scrollbar-hide">
                                    {COUNTRIES.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => {
                                                setSelectedCountry(c);
                                                setActiveTab('country');
                                                setIsCountryDropdownOpen(false);
                                            }}
                                            className={`w-full text-left whitespace-nowrap px-3 py-1.5 text-[13px] transition-colors cursor-pointer ${selectedCountry === c ? 'text-portal-brand bg-portal-surface font-medium' : 'text-portal-text-main hover:bg-portal-surface hover:text-portal-brand'}`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
