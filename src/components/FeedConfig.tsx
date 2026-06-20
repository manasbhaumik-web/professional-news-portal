import React from 'react';
import { Sparkles, Check, Plus, X, RefreshCw } from 'lucide-react';
import { UserPreferences } from '../types';

interface FeedConfigProps {
  activeTab: string;
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  tempKeyword: string;
  setTempKeyword: (val: string) => void;
  isGeneratingBriefing: boolean;
  handleGeneratePersonalFeed: () => void;
  CATEGORY_PRESETS: string[];
}

export default function FeedConfig({
  activeTab,
  preferences,
  setPreferences,
  tempKeyword,
  setTempKeyword,
  isGeneratingBriefing,
  handleGeneratePersonalFeed,
  CATEGORY_PRESETS
}: FeedConfigProps) {
  const toggleCategory = (cat: string) => {
    setPreferences(prev => {
      const current = prev.selectedCategories;
      const isSelected = current.includes(cat);
      const updated = isSelected 
        ? current.filter(c => c !== cat) 
        : [...current, cat];
      return { ...prev, selectedCategories: updated };
    });
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempKeyword.trim()) return;
    const kw = tempKeyword.trim();
    if (!preferences.selectedKeywords.includes(kw)) {
      setPreferences(prev => ({
        ...prev,
        selectedKeywords: [...prev.selectedKeywords, kw]
      }));
    }
    setTempKeyword('');
  };

  const handleRemoveKeyword = (kw: string) => {
    setPreferences(prev => ({
      ...prev,
      selectedKeywords: prev.selectedKeywords.filter(k => k !== kw)
    }));
  };

  return (
    <section 
      id="personal-dispatch-config" 
      className={`border p-6 rounded-xl transition-all bg-portal-surface border-portal-border ${activeTab === 'foryou' ? 'ring-2 ring-portal-brand shadow-sm' : 'opacity-95'}`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-portal-border pb-4 mb-4">
        <div>
          <h3 className="text-md flex items-center space-x-2 font-bold">
            <Sparkles size={18} className="text-portal-accent animate-pulse" />
            <span className="text-portal-text-main font-semibold">Personalized Feed Setup</span>
          </h3>
          <p className="text-xs text-portal-text-muted">Toggle categories and feed custom keywords to generate real-time analytical briefs.</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono text-portal-text-muted uppercase">Engine Status:</span>
          <span className="px-2 py-0.5 text-[10px] rounded-full border bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
            The Horizon Post Engine Online
          </span>
        </div>
      </div>

      <div id="subject-category-picker" className="mb-4">
        <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-portal-text-muted block mb-2">
          1. TARGET SUBJECT DOMAINS
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_PRESETS.map((catString) => {
            const isSelected = preferences.selectedCategories.includes(catString);
            return (
              <button
                key={catString}
                onClick={() => toggleCategory(catString)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 border ${
                  isSelected 
                    ? 'bg-portal-brand/20 border-portal-brand text-portal-brand shadow-sm'
                    : 'bg-portal-bg hover:bg-portal-surface-hover border-portal-border text-portal-text-muted hover:text-portal-text-main'
                }`}
              >
                {isSelected && <Check size={12} />}
                <span>{catString}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div id="tag-keyword-frame" className="mb-6">
        <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-portal-text-muted block mb-2">
          2. FOCUS ON RELEVANT KEYWORDS
        </label>
        
        <form onSubmit={handleAddKeyword} className="flex gap-2 max-w-md mb-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="e.g., Superposition, Solitons..."
              value={tempKeyword}
              onChange={(e) => setTempKeyword(e.target.value)}
              className="py-2 pl-3 pr-10 text-xs w-full focus:outline-none border rounded-lg transition-colors bg-portal-bg border-portal-border text-portal-text-main focus:border-portal-brand"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-portal-text-muted font-mono">KW</span>
          </div>
          <button
            type="submit"
            className="px-4 rounded-lg text-xs font-semibold flex items-center space-x-1 border transition-colors bg-portal-surface hover:bg-portal-surface-hover text-portal-text-main border-portal-border"
          >
            <Plus size={14} />
            <span>Include</span>
          </button>
        </form>

        <div className="flex flex-wrap gap-1.5">
          {preferences.selectedKeywords.length === 0 ? (
            <span className="text-[11px] italic text-portal-text-muted">No specific keyword focus.</span>
          ) : (
            preferences.selectedKeywords.map((kw) => (
              <span 
                key={kw} 
                className="rounded-md py-1 px-2.5 text-xs font-mono inline-flex items-center space-x-1.5 border transition-colors bg-portal-bg border-portal-border text-portal-text-main"
              >
                <span>#{kw}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemoveKeyword(kw)} 
                  className="hover:text-red-400 transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-portal-border">
        <div className="flex items-center space-x-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-portal-text-muted block">SPEED FORMAT</span>
            <div className="flex space-x-1 mt-1">
              {(['normal', 'fast', 'digest'] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPreferences(prev => ({ ...prev, readingSpeed: spd }))}
                  className={`px-2 py-0.5 text-[10px] rounded uppercase font-mono border transition-all ${
                    preferences.readingSpeed === spd 
                      ? 'bg-portal-text-main border-portal-text-main text-portal-bg'
                      : 'bg-transparent border-portal-border text-portal-text-muted hover:text-portal-text-main'
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleGeneratePersonalFeed}
          disabled={isGeneratingBriefing}
          className="w-full sm:w-auto text-white font-semibold text-xs px-6 py-3 rounded-lg flex items-center justify-center space-x-2 shadow-lg transition-all transform hover:-translate-y-0.5 bg-portal-brand hover:bg-portal-brand-hover"
        >
          {isGeneratingBriefing ? (
            <>
              <RefreshCw size={14} className="animate-spin text-white" />
              <span>Formulating Strategic Feed...</span>
            </>
          ) : (
            <>
              <Sparkles size={14} className="text-white animate-pulse" />
              <span>Generate My Personalized Intelligence Feed</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
