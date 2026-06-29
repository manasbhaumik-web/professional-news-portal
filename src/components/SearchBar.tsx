import React, { useState } from 'react';
import { Search, SlidersHorizontal, Calendar, ArrowDownUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    filterDate: string;
    setFilterDate: (d: string) => void;
    sortOption: string;
    setSortOption: (s: string) => void;
}

export default function SearchBar({
    searchQuery,
    setSearchQuery,
    filterDate,
    setFilterDate,
    sortOption,
    setSortOption
}: SearchBarProps) {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="w-full bg-portal-surface border border-portal-border shadow-sm mb-6 rounded-md">
            <div className="flex items-center px-4 py-3 border-b border-transparent transition-colors focus-within:border-portal-brand/30 focus-within:bg-portal-surface-hover">
                <Search size={18} className="text-portal-text-muted mr-3 shrink-0" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles by title, summary, category, or source..."
                    className="flex-1 bg-transparent border-none outline-none text-portal-text-main text-sm placeholder-portal-text-muted/60"
                />
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`ml-3 p-1.5 rounded transition-colors ${showFilters ? 'bg-portal-brand/10 text-portal-brand' : 'text-portal-text-muted hover:text-portal-text-main hover:bg-portal-border/30'}`}
                    aria-label="Toggle advanced filters"
                    title="Advanced Filters"
                >
                    <SlidersHorizontal size={16} />
                </button>
            </div>

            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-portal-border/30 bg-portal-bg/30"
                    >
                        <div className="flex flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
                            
                            {/* Date Filter */}
                            <div className="flex items-center space-x-2">
                                <Calendar size={14} className="text-portal-text-muted" />
                                <span className="text-xs font-mono uppercase text-portal-text-muted tracking-wider">Date</span>
                                <select
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className="text-xs bg-portal-surface border border-portal-border text-portal-text-main p-1 rounded outline-none focus:border-portal-brand cursor-pointer"
                                >
                                    <option value="all">All Time</option>
                                    <option value="24h">Last 24 Hours</option>
                                    <option value="week">Past Week</option>
                                </select>
                            </div>

                            <div className="w-px h-5 bg-portal-border hidden sm:block" />

                            {/* Sort Option */}
                            <div className="flex items-center space-x-2">
                                <ArrowDownUp size={14} className="text-portal-text-muted" />
                                <span className="text-xs font-mono uppercase text-portal-text-muted tracking-wider">Sort By</span>
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="text-xs bg-portal-surface border border-portal-border text-portal-text-main p-1 rounded outline-none focus:border-portal-brand cursor-pointer"
                                >
                                    <option value="latest">Latest First</option>
                                    <option value="importance">Highest Importance</option>
                                    <option value="category">Category (A-Z)</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
