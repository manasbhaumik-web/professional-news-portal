import React, { useEffect, useState } from 'react';

interface TickerAsset {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

interface MarketTickerProps {
  theme?: 'dark' | 'light' | 'sepia';
}

export default function MarketTicker({ theme = 'dark' }: MarketTickerProps) {
  const [assets, setAssets] = useState<TickerAsset[]>([
    { symbol: "QBIT", name: "Photonic Coherence Index", price: 412.50, change: 8.42 },
    { symbol: "FUSN", name: "Helion Plasma Yield", price: 92.15, change: 4.88 },
    { symbol: "CARB", name: "EU Carbon Border Duty", price: 104.20, change: -1.35 },
    { symbol: "NDX", name: "Silicon Tech Composite", price: 18451.20, change: 1.25 },
    { symbol: "CBDC", name: "USD The Horizon Post", price: 1.0000, change: 0.00 },
    { symbol: "NPR", name: "News Product Registry", price: 302.10, change: -0.45 },
  ]);

  useEffect(() => {
    // Simulate real-time ticking adjustments
    const interval = setInterval(() => {
      setAssets(prev =>
        prev.map(asset => {
          if (asset.symbol === "CBDC") return asset;
          const fluctuationPercent = (Math.random() - 0.48) * 0.4; // slight upward drift
          const prevPrice = asset.price;
          const newPrice = Math.max(0.1, prevPrice + (prevPrice * (fluctuationPercent / 100)));
          const newChange = asset.change + fluctuationPercent;
          return {
            ...asset,
            price: Number(newPrice.toFixed(asset.symbol === "CBDC" ? 4 : 2)),
            change: Number(newChange.toFixed(2))
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="market-ticker" className={`text-xs h-9 border-b flex items-center overflow-hidden font-mono relative select-none ${
      theme === 'dark' ? 'bg-[#18181b] text-zinc-150 border-zinc-850 divide-x divide-zinc-850' :
      theme === 'sepia' ? 'bg-[#E4DAC5] text-[#2E241E] border-[#DFD5C1] divide-x divide-[#DFD5C1]' :
      'bg-neutral-100 text-[#171717] border-neutral-200 divide-x divide-neutral-200/80'
    }`}>
      <div className={`px-4 py-1 flex items-center h-full text-[10px] uppercase font-bold tracking-widest relative z-10 whitespace-nowrap ${
        theme === 'dark' ? 'bg-[#ef4444] text-white' :
        theme === 'sepia' ? 'bg-[#7C5A3E] text-white' :
        'bg-neutral-900 text-white'
      }`}>
        Live Index
      </div>
      <div className="flex items-center space-x-8 px-6 animate-marquee whitespace-nowrap flex-grow overflow-x-auto scrollbar-none py-1">
        {assets.map((asset) => (
          <div key={asset.symbol} id={`ticker-asset-${asset.symbol.toLowerCase()}`} className="inline-flex items-center space-x-2 shrink-0">
            <span className={`text-[10px] tracking-tight ${theme === 'dark' ? 'text-zinc-500' : theme === 'sepia' ? 'text-[#7C6C5E]' : 'text-neutral-500'}`}>{asset.symbol}</span>
            <span className={`font-medium ${theme === 'dark' ? 'text-zinc-300' : theme === 'sepia' ? 'text-[#5C4D3E]' : 'text-neutral-600'}`}>{asset.name}</span>
            <span className="font-semibold">{asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            <span className={`text-[10px] font-bold ${asset.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {asset.change >= 0 ? '+' : ''}{asset.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
