import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertTriangle, Send, RefreshCw } from 'lucide-react';

export default function ReportNewsPage() {
  const [formData, setFormData] = useState({
    headline: '',
    category: 'Incident',
    location: '',
    details: '',
    mediaUrl: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/news/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit report.');
      }
      
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto py-24 px-6 text-center">
        <div className="w-20 h-20 bg-portal-brand/20 text-portal-brand rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-portal-brand/10 ring-4 ring-portal-brand/30">
          <CheckCircle2 size={40} className="animate-pulse" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-portal-text-main mb-4 tracking-tight">Transmission Received</h2>
        <p className="text-portal-text-muted font-mono text-sm max-w-xl mx-auto leading-relaxed border-t border-portal-border pt-6">
          Your report has been successfully transmitted to the editorial queue. Our investigative AI layer is actively cross-referencing your submission against verified databases.
        </p>
        <button 
          onClick={() => {
            setIsSuccess(false);
            setFormData({ headline: '', category: 'Incident', location: '', details: '', mediaUrl: '' });
          }}
          className="mt-10 px-6 py-2.5 bg-portal-surface border border-portal-border rounded hover:bg-portal-surface-hover text-xs font-mono uppercase tracking-widest text-portal-text-main transition-all"
        >
          Submit Another Report
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-12 border-b border-portal-border pb-6">
        <h1 className="text-4xl font-serif font-bold text-portal-text-main tracking-tight mb-2">Citizen Reporting Terminal</h1>
        <p className="text-sm font-mono text-portal-text-muted">Direct uplink to the PulseWire editorial desk. Submit verifiable incidents and local events.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-start space-x-3 text-red-400">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <span className="text-sm font-mono">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-portal-text-muted mb-2">Headline</label>
              <input 
                type="text" 
                name="headline"
                required
                value={formData.headline}
                onChange={handleChange}
                className="w-full bg-portal-surface border border-portal-border rounded-lg px-4 py-3 text-portal-text-main focus:outline-none focus:ring-1 focus:ring-portal-brand focus:border-portal-brand transition-all text-sm font-serif"
                placeholder="Brief summary of the incident..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-portal-text-muted mb-2">Category</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-portal-surface border border-portal-border rounded-lg px-4 py-3 text-portal-text-main focus:outline-none focus:ring-1 focus:ring-portal-brand transition-all text-sm font-serif appearance-none cursor-pointer"
                >
                  <option value="Incident">Incident</option>
                  <option value="Local Problem">Local Problem</option>
                  <option value="Community Event">Community Event</option>
                  <option value="Alert">Alert</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-portal-text-muted mb-2">Location</label>
                <input 
                  type="text" 
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-portal-surface border border-portal-border rounded-lg px-4 py-3 text-portal-text-main focus:outline-none focus:ring-1 focus:ring-portal-brand transition-all text-sm font-serif"
                  placeholder="Neighborhood, Street..."
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-portal-text-muted mb-2">Report Details</label>
              <textarea 
                name="details"
                required
                rows={6}
                value={formData.details}
                onChange={handleChange}
                className="w-full bg-portal-surface border border-portal-border rounded-lg px-4 py-3 text-portal-text-main focus:outline-none focus:ring-1 focus:ring-portal-brand transition-all text-sm font-serif resize-none"
                placeholder="Provide objective, verifiable facts regarding the event..."
              ></textarea>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-portal-text-muted mb-2">Media Evidence (Optional)</label>
              <div className="w-full h-40 border-2 border-dashed border-portal-border rounded-xl flex flex-col items-center justify-center text-portal-text-muted bg-portal-surface/50 hover:bg-portal-surface transition-colors group cursor-pointer">
                <UploadCloud size={28} className="mb-3 group-hover:text-portal-brand transition-colors" />
                <span className="text-xs font-mono uppercase tracking-wider font-semibold">Drop secure assets here</span>
                <span className="text-[10px] mt-1 opacity-60">or click to browse local files</span>
              </div>
              
              <div className="mt-4 flex items-center space-x-3">
                <div className="h-px bg-portal-border flex-1" />
                <span className="text-[10px] uppercase font-mono text-portal-text-muted">OR EXTERNAL URL</span>
                <div className="h-px bg-portal-border flex-1" />
              </div>

              <input 
                type="url" 
                name="mediaUrl"
                value={formData.mediaUrl}
                onChange={handleChange}
                className="w-full mt-4 bg-portal-surface border border-portal-border rounded-lg px-4 py-3 text-portal-text-main focus:outline-none focus:ring-1 focus:ring-portal-brand transition-all text-sm font-serif"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-portal-border flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting || !formData.headline || !formData.details || !formData.location}
            className="bg-portal-brand hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg text-xs font-mono font-bold uppercase tracking-widest flex items-center space-x-2 transition-all shadow-lg shadow-portal-brand/20"
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Transmitting...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Submit Report</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
