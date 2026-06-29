import React, { useState } from 'react';
import { Lock, X, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  onClose: () => void;
  onSuccess: (token: string) => void;
}

export default function AdminLoginModal({ onClose, onSuccess }: AdminLoginModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/cms/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      
      if (res.ok && data.token) {
        onSuccess(data.token);
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-portal-surface border border-portal-border/50 shadow-2xl p-6 w-full max-w-sm rounded relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-portal-text-muted hover:text-portal-text-main transition-colors">
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-portal-brand/10 flex items-center justify-center mb-3">
            <Lock className="text-portal-brand" size={24} />
          </div>
          <h2 className="text-xl font-bold font-serif text-portal-text-main">Admin CMS Access</h2>
          <p className="text-xs text-portal-text-muted mt-1 text-center">Restricted area. Please enter the master password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-portal-bg border border-portal-border/50 px-4 py-2.5 text-sm text-portal-text-main focus:outline-none focus:border-portal-brand transition-colors font-mono"
              autoFocus
            />
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-xs bg-red-500/10 p-2 rounded">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-portal-brand hover:bg-portal-brand/90 text-white font-bold py-2.5 text-sm tracking-wider uppercase transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Unlock CMS'}
          </button>
        </form>
      </div>
    </div>
  );
}
