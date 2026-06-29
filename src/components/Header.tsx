import React from 'react';
import { Search, Sparkles, MonitorPlay, Megaphone, MapPin, Sun, Moon, Coffee } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

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
    siteTitle
}: HeaderProps) {
    return (
        <header id="primary-editorial-nav" className="flex items-center justify-between px-4 sm:px-8 border-b border-portal-border transition-colors shrink-0 backdrop-blur-md bg-opacity-95 bg-portal-surface text-portal-text-main h-16">
            <div className="flex items-center space-x-4 sm:space-x-8">
                <div id="brand-logo" className="text-lg sm:text-xl font-bold tracking-tighter flex items-center cursor-pointer select-none transition-colors text-portal-text-main" onClick={() => setActiveTab('trending')}>
                    <div className="w-8 h-8 flex items-center justify-center mr-2 shadow-lg transition-all bg-portal-brand">
                        <span className="text-xs font-mono font-black text-white">THP</span>
                    </div>
                    <>THE HORIZON<span className="text-portal-brand font-serif italic ml-0.5"> POST</span></>
                </div>

                <div id="nav-topic-pills" className="hidden lg:flex space-x-6 text-xs font-semibold uppercase tracking-wider">
                    <button
                        id="nav-pill-home"
                        onClick={() => { setActiveTab('trending'); setSearchQuery(''); }}
                        className={`transition-colors py-1 hover:text-portal-text-main ${activeTab === 'trending' ? 'text-portal-brand border-b-2 border-portal-brand font-bold' : 'text-portal-text-muted'}`}
                    >
                        WORLD
                    </button>

                    <button
                        id="nav-pill-local"
                        onClick={() => { setActiveTab('local'); setSearchQuery(''); }}
                        className={`transition-colors py-1 flex items-center space-x-1 hover:text-portal-text-main ${activeTab === 'local' ? 'text-portal-brand border-b-2 border-portal-brand font-bold' : 'text-portal-text-muted'}`}
                    >
                        <MapPin size={12} className={activeTab === 'local' ? 'text-blue-500' : 'text-blue-500 hover:text-blue-400'} />
                        <span>LOCAL</span>
                    </button>

                    <button
                        id="nav-pill-global-tv"
                        onClick={() => { setActiveTab('globalTv'); setSearchQuery(''); }}
                        className={`transition-colors py-1 flex items-center space-x-1 hover:text-portal-text-main ${activeTab === 'globalTv' ? 'text-portal-brand border-b-2 border-portal-brand font-bold' : 'text-portal-text-muted'}`}
                    >
                        <MonitorPlay size={12} className={activeTab === 'globalTv' ? 'text-red-500' : 'text-red-500 hover:text-red-400'} />
                        <span>TV</span>
                    </button>

                    <button
                        id="nav-pill-report"
                        onClick={() => { setActiveTab('report'); setSearchQuery(''); }}
                        className={`transition-colors py-1 flex items-center space-x-1 hover:text-portal-text-main ${activeTab === 'report' ? 'text-portal-brand border-b-2 border-portal-brand font-bold' : 'text-portal-text-muted'}`}
                    >
                        <Megaphone size={12} className={activeTab === 'report' ? 'text-emerald-500' : 'text-emerald-500 hover:text-emerald-400'} />
                        <span>REPORT</span>
                    </button>
                </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
                <div id="theme-preset-selector" className="flex items-center p-1 border bg-portal-bg border-portal-border rounded-full">
                    {(['dark', 'light', 'sepia'] as const).map((t) => (
                        <button
                            key={t}
                            id={`theme-btn-${t}`}
                            onClick={() => setPortalTheme(t)}
                            className={`p-1.5 rounded-full transition-all ${portalTheme === t
                                ? 'bg-portal-brand text-white shadow shadow-portal-brand/20'
                                : 'text-portal-text-muted hover:text-portal-text-main'
                                }`}
                            title={`Switch Portal Design layout to ${t}`}
                        >
                            {t === 'dark' ? <Moon size={14} /> : t === 'light' ? <Sun size={14} /> : <Coffee size={14} />}
                        </button>
                    ))}
                </div>

                <NotificationCenter
                    onNotificationClick={handleNotificationRead}
                    activeFeedCategories={selectedCategories}
                    theme={portalTheme}
                />

                <div id="usr-profile-chip" className="flex items-center space-x-2 border-l pl-4 sm:pl-6 select-none border-portal-border">
                    <div className="w-8 h-8 bg-gradient-to-tr from-blue-700 to-indigo-800 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                        AE
                    </div>
                    <span className="hidden lg:inline-block text-xs font-semibold text-portal-text-main">
                        Aether Editor
                    </span>
                </div>
            </div>
        </header>
    );
}
