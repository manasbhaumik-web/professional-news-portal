import React, { useState, useEffect } from 'react';
import { Settings, LogOut, Edit, Trash2, Plus, RefreshCw, Eye, Rss, FileText, Monitor, CheckCircle, XCircle } from 'lucide-react';
import { NewsArticle } from '../types';

interface CmsPageProps {
  theme: 'dark' | 'light' | 'sepia';
  token: string;
  onLogout: () => void;
  handleOpenArticle: (art: NewsArticle) => void;
}

export default function CmsPage({ theme, token, onLogout, handleOpenArticle }: CmsPageProps) {
  const [activeTab, setActiveTab] = useState<'articles' | 'feeds' | 'settings'>('articles');
  
  // Articles State
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isArticlesLoading, setIsArticlesLoading] = useState(true);
  const [isEditingArticle, setIsEditingArticle] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<NewsArticle>>({});

  // Feeds State
  const [feeds, setFeeds] = useState<any[]>([]);
  const [isFeedsLoading, setIsFeedsLoading] = useState(true);
  const [isEditingFeed, setIsEditingFeed] = useState(false);
  const [editingFeed, setEditingFeed] = useState<any>({});

  // Settings State
  const [config, setConfig] = useState<any>({});
  const [isConfigLoading, setIsConfigLoading] = useState(true);

  const fetchArticles = async () => {
    setIsArticlesLoading(true);
    try {
      const res = await fetch('/api/cms/articles', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setArticles(await res.json());
    } catch (err) { console.error(err); } finally { setIsArticlesLoading(false); }
  };

  const fetchFeeds = async () => {
    setIsFeedsLoading(true);
    try {
      const res = await fetch('/api/cms/feeds', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setFeeds(await res.json());
    } catch (err) { console.error(err); } finally { setIsFeedsLoading(false); }
  };

  const fetchConfig = async () => {
    setIsConfigLoading(true);
    try {
      const res = await fetch('/api/config');
      if (res.ok) setConfig(await res.json());
    } catch (err) { console.error(err); } finally { setIsConfigLoading(false); }
  };

  useEffect(() => {
    if (activeTab === 'articles') fetchArticles();
    if (activeTab === 'feeds') fetchFeeds();
    if (activeTab === 'settings') fetchConfig();
  }, [activeTab]);

  // --- Handlers ---
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingArticle.id ? `/api/cms/articles/${editingArticle.id}` : '/api/cms/articles';
      const method = editingArticle.id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editingArticle)
      });
      if (res.ok) { setIsEditingArticle(false); fetchArticles(); }
    } catch (err) { console.error(err); }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Delete article?')) return;
    try {
      const res = await fetch(`/api/cms/articles/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) fetchArticles();
    } catch (err) { console.error(err); }
  };

  const handleSaveFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingFeed.id ? `/api/cms/feeds/${editingFeed.id}` : '/api/cms/feeds';
      const method = editingFeed.id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editingFeed)
      });
      if (res.ok) { setIsEditingFeed(false); fetchFeeds(); }
    } catch (err) { console.error(err); }
  };

  const handleDeleteFeed = async (id: string) => {
    if (!confirm('Delete feed?')) return;
    try {
      const res = await fetch(`/api/cms/feeds/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) fetchFeeds();
    } catch (err) { console.error(err); }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/cms/config', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(config)
      });
      if (res.ok) { alert('Settings saved successfully!'); window.location.reload(); }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-6">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 space-y-2">
        <div className="flex items-center gap-3 mb-8 px-4">
          <div className="w-10 h-10 bg-portal-brand flex items-center justify-center rounded">
            <Settings className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-serif font-black text-portal-text-main">CMS</h1>
            <p className="text-xs font-mono text-portal-text-muted">Admin Dashboard</p>
          </div>
        </div>
        
        <button onClick={() => setActiveTab('articles')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold tracking-wider uppercase transition-colors ${activeTab === 'articles' ? 'bg-portal-brand text-white' : 'text-portal-text-muted hover:bg-portal-surface-hover hover:text-portal-text-main'}`}>
          <FileText size={18} /> Articles
        </button>
        <button onClick={() => setActiveTab('feeds')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold tracking-wider uppercase transition-colors ${activeTab === 'feeds' ? 'bg-portal-brand text-white' : 'text-portal-text-muted hover:bg-portal-surface-hover hover:text-portal-text-main'}`}>
          <Rss size={18} /> RSS Feeds
        </button>
        <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold tracking-wider uppercase transition-colors ${activeTab === 'settings' ? 'bg-portal-brand text-white' : 'text-portal-text-muted hover:bg-portal-surface-hover hover:text-portal-text-main'}`}>
          <Monitor size={18} /> Settings
        </button>
        
        <div className="pt-8 px-4">
          <button onClick={onLogout} className="w-full border border-portal-border/50 hover:bg-portal-surface-hover px-4 py-2 text-sm text-portal-text-muted hover:text-red-500 font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow min-w-0">
        
        {/* ARTICLES TAB */}
        {activeTab === 'articles' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-black text-portal-text-main">Articles</h2>
              <button onClick={() => {
                setEditingArticle({ title: '', summary: '', content: '', category: 'Global', source: 'News Portal', imageUrl: '', date: 'Just now', isPinned: false, isDraft: false });
                setIsEditingArticle(true);
              }} className="bg-portal-brand hover:bg-portal-brand/90 text-white px-4 py-2 text-sm font-bold tracking-wider uppercase transition-colors flex items-center gap-2">
                <Plus size={16} /> New Article
              </button>
            </div>
            
            {isEditingArticle ? (
              <div className="bg-portal-surface border border-portal-border/50 p-6 rounded shadow-lg">
                <form onSubmit={handleSaveArticle} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-mono text-portal-text-muted mb-1 uppercase tracking-wider">Title</label>
                      <input required type="text" value={editingArticle.title || ''} onChange={e => setEditingArticle({...editingArticle, title: e.target.value})} className="w-full bg-portal-bg border border-portal-border/50 px-3 py-2 text-sm text-portal-text-main focus:outline-none focus:border-portal-brand" />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs font-mono text-portal-text-muted mb-1 uppercase tracking-wider">Category</label>
                      <input required type="text" value={editingArticle.category || ''} onChange={e => setEditingArticle({...editingArticle, category: e.target.value})} className="w-full bg-portal-bg border border-portal-border/50 px-3 py-2 text-sm text-portal-text-main focus:outline-none focus:border-portal-brand" />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs font-mono text-portal-text-muted mb-1 uppercase tracking-wider">Source</label>
                      <input required type="text" value={editingArticle.source || ''} onChange={e => setEditingArticle({...editingArticle, source: e.target.value})} className="w-full bg-portal-bg border border-portal-border/50 px-3 py-2 text-sm text-portal-text-main focus:outline-none focus:border-portal-brand" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-mono text-portal-text-muted mb-1 uppercase tracking-wider">Image URL</label>
                      <input type="url" value={editingArticle.imageUrl || ''} onChange={e => setEditingArticle({...editingArticle, imageUrl: e.target.value})} className="w-full bg-portal-bg border border-portal-border/50 px-3 py-2 text-sm text-portal-text-main focus:outline-none focus:border-portal-brand" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-mono text-portal-text-muted mb-1 uppercase tracking-wider">Summary</label>
                      <textarea required rows={2} value={editingArticle.summary || ''} onChange={e => setEditingArticle({...editingArticle, summary: e.target.value})} className="w-full bg-portal-bg border border-portal-border/50 px-3 py-2 text-sm text-portal-text-main focus:outline-none focus:border-portal-brand" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-mono text-portal-text-muted mb-1 uppercase tracking-wider">Content (Markdown supported)</label>
                      <textarea required rows={10} value={editingArticle.content || ''} onChange={e => setEditingArticle({...editingArticle, content: e.target.value})} className="w-full bg-portal-bg border border-portal-border/50 px-3 py-2 text-sm font-mono text-portal-text-main focus:outline-none focus:border-portal-brand" />
                    </div>
                    
                    <div className="col-span-2 flex gap-6 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!editingArticle.isPinned} onChange={e => setEditingArticle({...editingArticle, isPinned: e.target.checked})} className="accent-portal-brand" />
                        <span className="text-sm font-bold uppercase tracking-wider text-portal-text-main">Pin to top</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!editingArticle.isDraft} onChange={e => setEditingArticle({...editingArticle, isDraft: e.target.checked})} className="accent-portal-brand" />
                        <span className="text-sm font-bold uppercase tracking-wider text-portal-text-main">Save as Draft</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-portal-border/50 mt-4">
                    <button type="button" onClick={() => setIsEditingArticle(false)} className="px-4 py-2 text-sm text-portal-text-muted hover:text-portal-text-main transition-colors font-bold uppercase tracking-wider">Cancel</button>
                    <button type="submit" className="bg-portal-brand hover:bg-portal-brand/90 text-white px-6 py-2 text-sm font-bold tracking-wider uppercase transition-colors">Save Article</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-portal-surface border border-portal-border/50 rounded shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] font-mono uppercase tracking-widest text-portal-text-muted bg-portal-bg border-b border-portal-border/50">
                    <tr>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-portal-border/30">
                    {isArticlesLoading ? (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-portal-text-muted animate-pulse">Loading articles...</td></tr>
                    ) : articles.map(art => (
                      <tr key={art.id} className="hover:bg-portal-surface-hover/50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-portal-text-main line-clamp-1 max-w-md">{art.title}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {art.isPinned && <span className="text-[9px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-600 border border-yellow-500/30 uppercase tracking-widest font-bold">Pinned</span>}
                            {art.isDraft ? 
                              <span className="text-[9px] px-1.5 py-0.5 bg-gray-500/20 text-gray-400 border border-gray-500/30 uppercase tracking-widest font-bold">Draft</span> :
                              <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 uppercase tracking-widest font-bold">Published</span>
                            }
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs uppercase tracking-widest font-mono text-portal-text-muted">{art.category}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleOpenArticle(art)} className="p-1 text-portal-text-muted hover:text-portal-brand transition-colors"><Eye size={16} /></button>
                            <button onClick={() => { setEditingArticle(art); setIsEditingArticle(true); }} className="p-1 text-portal-text-muted hover:text-blue-500 transition-colors"><Edit size={16} /></button>
                            <button onClick={() => handleDeleteArticle(art.id)} className="p-1 text-portal-text-muted hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* FEEDS TAB */}
        {activeTab === 'feeds' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-black text-portal-text-main">RSS Feeds</h2>
              <button onClick={() => {
                setEditingFeed({ url: '', category: 'Global', enabled: true, sportName: '' });
                setIsEditingFeed(true);
              }} className="bg-portal-brand hover:bg-portal-brand/90 text-white px-4 py-2 text-sm font-bold tracking-wider uppercase transition-colors flex items-center gap-2">
                <Plus size={16} /> Add Feed
              </button>
            </div>

            {isEditingFeed ? (
              <div className="bg-portal-surface border border-portal-border/50 p-6 rounded shadow-lg">
                <form onSubmit={handleSaveFeed} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-mono text-portal-text-muted mb-1 uppercase tracking-wider">Feed URL</label>
                      <input required type="url" value={editingFeed.url || ''} onChange={e => setEditingFeed({...editingFeed, url: e.target.value})} className="w-full bg-portal-bg border border-portal-border/50 px-3 py-2 text-sm text-portal-text-main focus:outline-none focus:border-portal-brand" />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs font-mono text-portal-text-muted mb-1 uppercase tracking-wider">Category</label>
                      <input required type="text" value={editingFeed.category || ''} onChange={e => setEditingFeed({...editingFeed, category: e.target.value})} className="w-full bg-portal-bg border border-portal-border/50 px-3 py-2 text-sm text-portal-text-main focus:outline-none focus:border-portal-brand" />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs font-mono text-portal-text-muted mb-1 uppercase tracking-wider">Sport Name (Optional)</label>
                      <input type="text" value={editingFeed.sportName || ''} onChange={e => setEditingFeed({...editingFeed, sportName: e.target.value})} className="w-full bg-portal-bg border border-portal-border/50 px-3 py-2 text-sm text-portal-text-main focus:outline-none focus:border-portal-brand" />
                    </div>
                    <div className="col-span-2 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!editingFeed.enabled} onChange={e => setEditingFeed({...editingFeed, enabled: e.target.checked})} className="accent-portal-brand" />
                        <span className="text-sm font-bold uppercase tracking-wider text-portal-text-main">Enable this feed</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-portal-border/50 mt-4">
                    <button type="button" onClick={() => setIsEditingFeed(false)} className="px-4 py-2 text-sm text-portal-text-muted hover:text-portal-text-main transition-colors font-bold uppercase tracking-wider">Cancel</button>
                    <button type="submit" className="bg-portal-brand hover:bg-portal-brand/90 text-white px-6 py-2 text-sm font-bold tracking-wider uppercase transition-colors">Save Feed</button>
                  </div>
                </form>
              </div>
            ) : (
               <div className="bg-portal-surface border border-portal-border/50 rounded shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] font-mono uppercase tracking-widest text-portal-text-muted bg-portal-bg border-b border-portal-border/50">
                    <tr>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">URL</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-portal-border/30">
                    {isFeedsLoading ? (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-portal-text-muted animate-pulse">Loading feeds...</td></tr>
                    ) : feeds.map(feed => (
                      <tr key={feed.id} className="hover:bg-portal-surface-hover/50 transition-colors">
                        <td className="px-4 py-3">
                          {feed.enabled ? 
                            <CheckCircle size={16} className="text-emerald-500" /> : 
                            <XCircle size={16} className="text-red-500" />
                          }
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-portal-text-muted truncate max-w-[200px] sm:max-w-sm">{feed.url}</td>
                        <td className="px-4 py-3 text-xs uppercase tracking-widest font-bold text-portal-text-main">
                          {feed.category} {feed.sportName && `(${feed.sportName})`}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => { setEditingFeed(feed); setIsEditingFeed(true); }} className="p-1 text-portal-text-muted hover:text-blue-500 transition-colors"><Edit size={16} /></button>
                            <button onClick={() => handleDeleteFeed(feed.id)} className="p-1 text-portal-text-muted hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-black text-portal-text-main">Global Settings</h2>
            </div>
            
            {isConfigLoading ? (
              <div className="text-portal-text-muted animate-pulse font-mono">Loading config...</div>
            ) : (
              <div className="bg-portal-surface border border-portal-border/50 p-6 rounded shadow-lg">
                <form onSubmit={handleSaveConfig} className="space-y-6">
                  <div>
                    <label className="block text-xs font-mono text-portal-text-muted mb-1 uppercase tracking-wider">Site Title</label>
                    <input type="text" value={config.siteTitle || ''} onChange={e => setConfig({...config, siteTitle: e.target.value})} className="w-full max-w-md bg-portal-bg border border-portal-border/50 px-3 py-2 text-sm text-portal-text-main focus:outline-none focus:border-portal-brand" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-mono text-portal-text-muted mb-1 uppercase tracking-wider">Footer Text</label>
                    <input type="text" value={config.footerText || ''} onChange={e => setConfig({...config, footerText: e.target.value})} className="w-full max-w-md bg-portal-bg border border-portal-border/50 px-3 py-2 text-sm text-portal-text-main focus:outline-none focus:border-portal-brand" />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-portal-text-muted mb-1 uppercase tracking-wider">Default Theme</label>
                    <select value={config.defaultTheme || 'dark'} onChange={e => setConfig({...config, defaultTheme: e.target.value})} className="w-full max-w-md bg-portal-bg border border-portal-border/50 px-3 py-2 text-sm text-portal-text-main focus:outline-none focus:border-portal-brand">
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="sepia">Sepia</option>
                    </select>
                  </div>
                  
                  <div className="pt-6 border-t border-portal-border/50">
                    <button type="submit" className="bg-portal-brand hover:bg-portal-brand/90 text-white px-6 py-2 text-sm font-bold tracking-wider uppercase transition-colors">Save Settings</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
