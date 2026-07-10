import React from 'react';
import { Scale, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function TermsOfService({ theme }: { theme: 'dark' | 'light' | 'sepia' }) {
  const isDark = theme === 'dark';
  const isSepia = theme === 'sepia';
  const textMutedClass = isDark ? "text-zinc-400" : isSepia ? "text-[#5C4D3E]" : "text-neutral-500";
  const bgSurfaceClass = isDark ? "bg-[#0F1115]" : isSepia ? "bg-[#FAF6EE]" : "bg-white";
  const borderClass = isDark ? "border-white/10" : isSepia ? "border-[#CDBC9D]" : "border-neutral-200";

  return (
    <div className="max-w-4xl mx-auto w-full pb-16 font-sans">
      <div className="mb-8">
        <h1 className={`text-3xl sm:text-4xl font-black tracking-tight mb-4 ${isDark ? 'text-white' : isSepia ? 'text-[#2C2114]' : 'text-neutral-900'}`}>
          Terms of Service
        </h1>
        <p className={`text-lg ${textMutedClass}`}>
          Last updated: July 2026. Please read these terms carefully before using our platform.
        </p>
      </div>

      <div className={`rounded-2xl border ${borderClass} ${bgSurfaceClass} p-6 sm:p-10 shadow-sm space-y-10`}>
        
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><FileText size={20} /></div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : isSepia ? 'text-[#2C2114]' : 'text-neutral-900'}`}>1. Acceptance of Terms</h2>
          </div>
          <div className={`space-y-4 text-sm leading-relaxed ${textMutedClass}`}>
            <p>
              By accessing or using The Horizon Post Online (the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the Service.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><Scale size={20} /></div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : isSepia ? 'text-[#2C2114]' : 'text-neutral-900'}`}>2. Content Aggregation & Fair Use</h2>
          </div>
          <div className={`space-y-4 text-sm leading-relaxed ${textMutedClass}`}>
            <p>
              The Service acts as a digital media aggregator. We collect, index, and link to publicly available news feeds, articles, and media from various third-party publishers (e.g., Al Jazeera, Sky News, NBC).
            </p>
            <p>
              We do not claim ownership of any third-party content displayed on this Service. All trademarks, logos, and copyrights are the property of their respective owners. Content is displayed under the principles of Fair Use for commentary, criticism, and news reporting. If you follow a link to a third-party site, their terms and conditions apply.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-500"><AlertTriangle size={20} /></div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : isSepia ? 'text-[#2C2114]' : 'text-neutral-900'}`}>3. DMCA & Copyright Takedown Policy</h2>
          </div>
          <div className={`space-y-4 text-sm leading-relaxed ${textMutedClass}`}>
            <p>
              We respect the intellectual property rights of others. If you are a copyright owner or an agent thereof and believe that any content aggregated on the Service infringes upon your copyrights, you may submit a notification pursuant to the Digital Millennium Copyright Act ("DMCA") by providing our Copyright Agent with the following information in writing:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed;</li>
              <li>Identification of the copyrighted work claimed to have been infringed;</li>
              <li>Identification of the material that is claimed to be infringing and information reasonably sufficient to permit us to locate the material (e.g., the URL);</li>
              <li>Your contact information, including address, telephone number, and email address;</li>
              <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law; and</li>
              <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the copyright owner.</li>
            </ul>
            <p>
              Takedown requests should be directed to our designated legal contact email. Upon receipt of a valid request, we will expeditiously remove or disable access to the infringing content.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500"><ShieldCheck size={20} /></div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : isSepia ? 'text-[#2C2114]' : 'text-neutral-900'}`}>4. Disclaimer of Warranties and Limitation of Liability</h2>
          </div>
          <div className={`space-y-4 text-sm leading-relaxed ${textMutedClass}`}>
            <p>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no representations or warranties of any kind, express or implied, regarding the accuracy, reliability, or availability of the aggregated content.
            </p>
            <p>
              In no event shall The Horizon Post Online, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
