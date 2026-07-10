import React, { useState, useEffect, useRef } from 'react';
import { Search, Sun, Moon, Coffee, Menu, X, MapPin, MonitorPlay, Megaphone, Trophy, ChevronDown, Globe2, Landmark, Briefcase, Activity, Film, Rocket } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import { COUNTRIES } from '../utils/countryFeeds';

const REGIONS = ['North America', 'Latin America', 'Europe', 'Arab', 'Sub-Saharan Africa', 'South Asia', 'South East Asia', 'East Asia', 'Oceania'];

const CATEGORIES = [
    { id: 'Politics', icon: Landmark, tab: 'politics', items: ['Global Politics', 'Local Politics', 'Elections', 'Policy'] },
    { id: 'Business', icon: Briefcase, tab: 'business', items: ['Markets', 'Finance', 'Economy', 'Startups'] },
    { id: 'Sports', icon: Activity, tab: 'sports', items: ['Football', 'Tennis', 'Motorsport', 'Cricket', 'Golf', 'Boxing/MMA', 'Rugby', 'Athletics', 'Cycling'] },
    { id: 'Entertainment', icon: Film, tab: 'entertainment', items: ['Movies', 'Music', 'Television', 'Celebrity'] },
    { id: 'Science & Tech', icon: Rocket, tab: 'scienceTech', items: ['Technology', 'Science', 'Space', 'Computing', 'Cybersecurity'] }
];

interface HeaderProps {
    activeTab: string;
    setActiveTab: (tab: any) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    portalTheme: 'dark' | 'light' | 'sepia';
    setPortalTheme: (theme: 'dark' | 'light' | 'sepia') => void;
    selectedCategories: string[];
    handleNotificationRead: (id: string) => void;
    siteTitle?: string;
    /* ChannelsNav props merged in */
    selectedMenuCategory: string;
    setSelectedMenuCategory: (category: string) => void;
    selectedCountry: string;
    setSelectedCountry: (country: string) => void;
    availableRegions?: string[];
    isScrolled: boolean;
}

export default function Header({
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    portalTheme,
    setPortalTheme,
    selectedCategories,
    handleNotificationRead,
    siteTitle,
    selectedMenuCategory,
    setSelectedMenuCategory,
    selectedCountry,
    setSelectedCountry,
    availableRegions = REGIONS,
    isScrolled,
}: HeaderProps) {
    const [isSectionsOpen, setIsSectionsOpen] = useState(false);
    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const sectionsRef = useRef<HTMLDivElement>(null);
    const countryRef = useRef<HTMLDivElement>(null);

    // Format today's date for the dateline
    const formattedDate = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    // Close panels on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (sectionsRef.current && !sectionsRef.current.contains(e.target as Node)) {
                setIsSectionsOpen(false);
            }
            if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
                setIsCountryOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMenuClick = (category: string, tab: any) => {
        setSelectedMenuCategory(category);
        if (tab) setActiveTab(tab);
        setIsSectionsOpen(false);
    };

    const navPills = [
        { id: 'trending', label: 'WORLD', icon: null, tab: 'trending' },
        { id: 'local', label: 'LOCAL', icon: <MapPin size={12} className="text-blue-500" />, tab: 'local' },
        { id: 'globalTv', label: 'TV', icon: <MonitorPlay size={12} className="text-red-500" />, tab: 'globalTv' },
        { id: 'report', label: 'REPORT', icon: <Megaphone size={12} className="text-emerald-500" />, tab: 'report' },
    ];

    return (
        <div id="editorial-header-wrapper" className={isScrolled ? 'header-scrolled' : ''}>
            {/* ─── ROW 1: Dateline bar ─── */}
            <div className="header-dateline px-4 sm:px-8 py-1.5 flex items-center justify-between" style={{ overflow: isCountryOpen ? 'visible' : '' }}>
                <span className="font-mono text-[11px]">
                    {formattedDate}
                </span>
                <div className="flex items-center gap-3">
                    {/* Country selector (in dateline when expanded) */}
                    <div ref={countryRef} className="relative">
                        <button
                            onClick={() => setIsCountryOpen(!isCountryOpen)}
                            aria-haspopup="listbox"
                            aria-expanded={isCountryOpen}
                            aria-label={`Select country, currently ${selectedCountry}`}
                            className="flex items-center gap-1.5 text-[11px] font-normal cursor-pointer hover:text-portal-text-main transition-colors"
                        >
                            <Globe2 size={11} className="text-portal-brand opacity-70" />
                            <span>{selectedCountry}</span>
                            <ChevronDown size={11} className={`transition-transform duration-200 opacity-50 ${isCountryOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isCountryOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsCountryOpen(false)} />
                                <div className="absolute right-0 top-full mt-1 w-max min-w-[140px] max-h-64 overflow-y-auto bg-portal-bg border border-portal-border shadow-lg z-50 py-1 scrollbar-hide flex flex-col">
                                    {COUNTRIES.map(c => (
                                        <button
                                            key={c}
                                            role="option"
                                            aria-selected={selectedCountry === c}
                                            onClick={() => {
                                                setSelectedCountry(c);
                                                setActiveTab('country');
                                                setIsCountryOpen(false);
                                            }}
                                            className={`w-full text-left whitespace-nowrap px-3 py-2 min-h-[36px] text-[12px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-portal-brand focus-visible:ring-inset ${selectedCountry === c ? 'text-portal-brand bg-portal-surface font-medium' : 'text-portal-text-main hover:bg-portal-surface hover:text-portal-brand'}`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    <span className="text-portal-text-muted text-[9px] opacity-40">|</span>
                    <span className="text-[11px] text-portal-text-muted font-mono">{siteTitle || 'The Horizon Post Online'}</span>
                </div>
            </div>

            {/* ─── ROW 2: Centered Masthead (collapses on scroll) ─── */}
            <div className="header-masthead py-4 px-4 sm:px-8">
                <div
                    id="brand-logo-masthead"
                    className="cursor-pointer select-none inline-flex items-center justify-center gap-3"
                    onClick={() => { setActiveTab('trending'); setSearchQuery(''); setSelectedMenuCategory('All'); }}
                >
                    <div className="w-10 h-10 bg-portal-brand text-white flex items-center justify-center shrink-0 shadow-sm">
                        <span className="font-playfair font-normal text-[29px] italic leading-none mt-1">H</span>
                    </div>
                    <span className="text-[19px] sm:text-[29px] font-serif font-bold tracking-tight text-portal-text-main mt-0.5">
                        THE HORIZON <span className="font-playfair text-portal-brand italic ml-1"><span className="font-bold">POS</span><span className="font-normal">T</span></span>
                    </span>
                </div>
            </div>

            {/* ─── ROW 3: Unified Navigation Bar (always visible, sticky) ─── */}
            <nav
                id="primary-editorial-nav"
                className="header-navbar flex items-center justify-between px-4 sm:px-8 text-portal-text-main"
                aria-label="Primary Navigation"
            >
                {/* Left: Compact logo (scroll only) + Sections + Nav pills */}
                <div className="flex items-center h-full">
                    {/* Compact logo — appears on scroll */}
                    <div
                        className="header-compact-logo flex items-center cursor-pointer select-none shrink-0"
                        onClick={() => { setActiveTab('trending'); setSearchQuery(''); setSelectedMenuCategory('All'); }}
                    >
                        <div className="w-7 h-7 bg-portal-brand text-white flex items-center justify-center shrink-0 mr-2 shadow-sm">
                            <span className="font-playfair font-normal text-[19px] italic leading-none mt-0.5">H</span>
                        </div>
                        <span className="hidden md:inline text-[15px] font-serif font-bold tracking-tight text-portal-text-main whitespace-nowrap mt-0.5">
                            HORIZON <span className="font-playfair text-portal-brand italic ml-0.5"><span className="font-bold">POS</span><span className="font-normal">T</span></span>
                        </span>
                    </div>

                    {/* Sections menu button */}
                    <div ref={sectionsRef} className="relative h-full flex items-center">
                        <button
                            onClick={() => setIsSectionsOpen(!isSectionsOpen)}
                            className="flex items-center gap-1.5 mr-4 sm:mr-6 pr-4 sm:pr-6 border-r border-portal-border/50 text-portal-text-muted hover:text-portal-text-main transition-colors h-full cursor-pointer"
                            aria-expanded={isSectionsOpen}
                            aria-label="Open sections menu"
                        >
                            {isSectionsOpen ? <X size={16} className="text-portal-brand" /> : <Menu size={16} className="text-portal-brand" />}
                            <span className="text-[12px] font-medium tracking-wide hidden sm:inline">
                                {selectedMenuCategory === 'All' ? 'Sections' : selectedMenuCategory.replace('Region: ', '')}
                            </span>
                        </button>

                        {/* Mega-menu dropdown */}
                        <div className={`sections-panel ${isSectionsOpen ? 'open' : ''} absolute left-0 top-full w-[1100px] max-w-[95vw] bg-portal-bg/95 backdrop-blur-xl border border-portal-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden z-50`}>
                            <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 xl:gap-6">
                                {/* Regions Column */}
                                <div className="flex flex-col">
                                    <div className="px-1 py-2 text-[10px] font-mono tracking-widest uppercase text-portal-text-muted mb-2 flex items-center gap-2 border-b border-portal-border/30">
                                        <Globe2 size={12} /> Regions
                                    </div>
                                    <button
                                        onClick={() => handleMenuClick('All', 'trending')}
                                        className="text-left px-2 py-1.5 min-h-[36px] text-xs text-portal-brand font-bold hover:bg-portal-brand/10 transition-colors mb-1 cursor-pointer"
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
                                            className={`text-left px-2 py-1 min-h-[36px] text-xs transition-colors cursor-pointer ${selectedMenuCategory === `Region: ${region}` ? 'bg-portal-surface text-portal-brand font-semibold' : 'text-portal-text-main hover:bg-portal-surface hover:text-portal-brand'}`}
                                        >
                                            {region}
                                        </button>
                                    ))}
                                </div>

                                {/* Category Columns */}
                                {CATEGORIES.map(cat => {
                                    const Icon = cat.icon;
                                    return (
                                        <div key={cat.id} className="flex flex-col">
                                            <div className="px-1 py-2 text-[10px] font-mono tracking-widest uppercase text-portal-text-muted mb-2 flex items-center gap-2 border-b border-portal-border/30">
                                                <Icon size={12} /> {cat.id}
                                            </div>
                                            <button
                                                onClick={() => handleMenuClick(cat.id, cat.tab)}
                                                className="text-left px-2 py-1.5 min-h-[36px] text-xs text-portal-brand font-bold hover:bg-portal-brand/10 transition-colors mb-1 cursor-pointer"
                                            >
                                                All {cat.id}
                                            </button>
                                            {cat.items.map(item => (
                                                <button
                                                    key={item}
                                                    onClick={() => handleMenuClick(`${cat.id}: ${item}`, cat.tab)}
                                                    className={`text-left px-2 py-1 min-h-[36px] text-xs transition-colors cursor-pointer ${selectedMenuCategory === `${cat.id}: ${item}` ? 'bg-portal-surface text-portal-brand font-semibold' : 'text-portal-text-main hover:bg-portal-surface hover:text-portal-brand'}`}
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

                    {/* Nav pills */}
                    <div className="hidden md:flex items-center gap-1 h-full">
                        {navPills.map(pill => (
                            <button
                                key={pill.id}
                                id={`nav-pill-${pill.id}`}
                                onClick={() => { setActiveTab(pill.tab); setSearchQuery(''); }}
                                className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors rounded-sm ${activeTab === pill.tab
                                    ? 'text-portal-brand nav-pill-active'
                                    : 'text-portal-text-muted hover:text-portal-text-main'
                                    }`}
                            >
                                {pill.icon}
                                {pill.label}
                            </button>
                        ))}
                        {/* FIFA pill */}
                        <button
                            id="nav-pill-fifa"
                            onClick={() => { setActiveTab('sports'); setSelectedMenuCategory('Sports: Football'); }}
                            className={`flex items-center gap-1 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition-all rounded-sm ${(activeTab === 'sports' && selectedMenuCategory === 'Sports: Football')
                                ? 'bg-gradient-to-r from-[#c9a84c] to-[#e6cf8b] text-black'
                                : 'text-[#c9a84c] hover:bg-[#c9a84c]/10'
                                }`}
                        >
                            <Trophy size={12} />
                            FIFA
                        </button>
                    </div>
                </div>

                {/* Right: Utilities */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Theme switcher */}
                    <div id="theme-preset-selector" className="flex items-center p-0.5 border bg-portal-bg border-portal-border rounded-full">
                        {(['dark', 'light', 'sepia'] as const).map((t) => (
                            <button
                                key={t}
                                id={`theme-btn-${t}`}
                                onClick={() => setPortalTheme(t)}
                                className={`p-1.5 rounded-full transition-all ${portalTheme === t
                                    ? 'bg-portal-brand text-white shadow shadow-portal-brand/20'
                                    : 'text-portal-text-muted hover:text-portal-text-main'
                                    }`}
                                title={`Switch to ${t} theme`}
                            >
                                {t === 'dark' ? <Moon size={13} /> : t === 'light' ? <Sun size={13} /> : <Coffee size={13} />}
                            </button>
                        ))}
                    </div>

                    {/* Notifications */}
                    <NotificationCenter
                        onNotificationClick={handleNotificationRead}
                        activeFeedCategories={selectedCategories}
                        theme={portalTheme}
                    />

                    {/* Profile chip */}
                    <div id="usr-profile-chip" className="flex items-center gap-2 border-l pl-3 sm:pl-4 select-none border-portal-border/50">
                        <div className="w-7 h-7 bg-gradient-to-tr from-blue-700 to-indigo-800 flex items-center justify-center text-[10px] font-bold text-white shadow-inner rounded-sm">
                            AE
                        </div>
                        <span className="hidden lg:inline-block text-[11px] font-medium text-portal-text-main">
                            Aether Editor
                        </span>
                    </div>
                </div>
            </nav>
        </div>
    );
}
