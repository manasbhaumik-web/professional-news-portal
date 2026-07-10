import React from 'react';
import { Shield, Lock, Eye, Database } from 'lucide-react';

export default function PrivacyPolicy({ theme }: { theme: 'dark' | 'light' | 'sepia' }) {
  const isDark = theme === 'dark';
  const isSepia = theme === 'sepia';
  const textMutedClass = isDark ? "text-zinc-400" : isSepia ? "text-[#5C4D3E]" : "text-neutral-500";
  const bgSurfaceClass = isDark ? "bg-[#0F1115]" : isSepia ? "bg-[#FAF6EE]" : "bg-white";
  const borderClass = isDark ? "border-white/10" : isSepia ? "border-[#CDBC9D]" : "border-neutral-200";

  return (
    <div className="max-w-4xl mx-auto w-full pb-16 font-sans">
      <div className="mb-8">
        <h1 className={`text-3xl sm:text-4xl font-black tracking-tight mb-4 ${isDark ? 'text-white' : isSepia ? 'text-[#2C2114]' : 'text-neutral-900'}`}>
          Privacy Policy
        </h1>
        <p className={`text-lg ${textMutedClass}`}>
          Last updated: July 2026. Your privacy and data security are our top priorities.
        </p>
      </div>

      <div className={`rounded-2xl border ${borderClass} ${bgSurfaceClass} p-6 sm:p-10 shadow-sm space-y-10`}>
        
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Database size={20} /></div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : isSepia ? 'text-[#2C2114]' : 'text-neutral-900'}`}>1. Information We Collect</h2>
          </div>
          <div className={`space-y-4 text-sm leading-relaxed ${textMutedClass}`}>
            <p>
              <strong>Usage Data:</strong> We automatically collect certain information when you visit, use, or navigate the Portal. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and information about how and when you use our services.
            </p>
            <p>
              <strong>Local Storage:</strong> We use your browser's local storage to save your user preferences (like theme, text size, and bookmarked articles) securely on your own device. This data is not transmitted to our servers.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><Eye size={20} /></div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : isSepia ? 'text-[#2C2114]' : 'text-neutral-900'}`}>2. Third-Party Embeds & Cookies</h2>
          </div>
          <div className={`space-y-4 text-sm leading-relaxed ${textMutedClass}`}>
            <p>
              Because we aggregate news and media, some pages include embedded content (e.g., YouTube videos, external news widgets). 
            </p>
            <p>
              We utilize privacy-enhanced modes (such as <code>youtube-nocookie.com</code>) wherever possible to prevent third-party trackers from loading immediately. However, once you interact with an embedded third-party player, that third party may set cookies and collect usage data according to their own Privacy Policies.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500"><Shield size={20} /></div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : isSepia ? 'text-[#2C2114]' : 'text-neutral-900'}`}>3. How We Use Your Information</h2>
          </div>
          <div className={`space-y-4 text-sm leading-relaxed ${textMutedClass}`}>
            <p>We use the information we collect or receive to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Deliver and facilitate delivery of services to the user.</li>
              <li>Respond to user inquiries and offer support.</li>
              <li>Analyze usage trends and improve our aggregation algorithms.</li>
              <li>Protect our Services (e.g., fraud monitoring and prevention).</li>
            </ul>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><Lock size={20} /></div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : isSepia ? 'text-[#2C2114]' : 'text-neutral-900'}`}>4. GDPR & CCPA Rights</h2>
          </div>
          <div className={`space-y-4 text-sm leading-relaxed ${textMutedClass}`}>
            <p>
              Depending on your location (such as the European Economic Area or California), you have certain rights regarding your personal information, including the right to request access, correction, or deletion of your data.
            </p>
            <p>
              Because our platform operates largely without requiring user accounts and stores preferences locally on your device, you maintain full control over your data by clearing your browser's local storage and cookies.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
