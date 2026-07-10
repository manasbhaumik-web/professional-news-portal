import React, { useState, useEffect } from 'react';
import { ShieldAlert, Check, X } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('horizon_cookie_consent');
    if (!consent) {
      // Small delay so it slides in nicely after load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('horizon_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Basic implementation: still stores consent to not bother user, 
    // but in a real app would strictly block optional cookies.
    localStorage.setItem('horizon_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-portal-surface border border-portal-border shadow-2xl rounded-xl p-5 sm:p-6 pointer-events-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transform transition-transform translate-y-0 relative overflow-hidden">
        
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />

        <div className="flex items-start gap-4 flex-1 relative z-10">
          <div className="p-2.5 bg-blue-500/10 rounded-full shrink-0 text-blue-500 mt-0.5">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h3 className="text-portal-text-main font-bold text-lg mb-1">Your Privacy Matters</h3>
            <p className="text-sm text-portal-text-muted leading-relaxed">
              We use cookies and similar tracking technologies to enhance your browsing experience, serve personalized content, and analyze our traffic. Third-party embeds (such as video players) may also set their own cookies. By clicking "Accept All", you consent to our use of cookies.
            </p>
          </div>
        </div>

        <div className="flex flex-row md:flex-col lg:flex-row w-full md:w-auto gap-3 relative z-10 shrink-0">
          <button 
            onClick={handleDecline}
            className="flex-1 md:flex-none px-6 py-2.5 rounded-lg border border-portal-border text-portal-text-muted hover:text-portal-text-main hover:bg-portal-surface-hover text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <X size={16} /> Necessary Only
          </button>
          <button 
            onClick={handleAccept}
            className="flex-1 md:flex-none px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 text-sm font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Check size={16} /> Accept All
          </button>
        </div>

      </div>
    </div>
  );
}
