import React, { useEffect, useState, useRef } from 'react';

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
    { symbol: "FUSN", name: "Helion Plasma Yield",      price: 92.15,  change: 4.88 },
    { symbol: "CARB", name: "EU Carbon Border Duty",    price: 104.20, change: -1.35 },
    { symbol: "NDX",  name: "Silicon Tech Composite",   price: 18451.20, change: 1.25 },
    { symbol: "CBDC", name: "USD The Horizon Post",     price: 1.0000,  change: 0.00 },
    { symbol: "NPR",  name: "News Product Registry",    price: 302.10, change: -0.45 },
  ]);

  // Track which symbols had a price flash and direction
  const [flashing, setFlashing] = useState<Record<string, 'up' | 'down' | null>>({});
  const prevPricesRef = useRef<Record<string, number>>({});

  // Blinking dot state
  const [dotVisible, setDotVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setDotVisible(v => !v), 900);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => {
        const newAssets = prev.map(asset => {
          if (asset.symbol === "CBDC") return asset;
          const fluctuationPercent = (Math.random() - 0.48) * 0.4;
          const prevPrice = asset.price;
          const newPrice = Math.max(0.1, prevPrice + (prevPrice * (fluctuationPercent / 100)));
          const newChange = asset.change + fluctuationPercent;
          return {
            ...asset,
            price: Number(newPrice.toFixed(asset.symbol === "CBDC" ? 4 : 2)),
            change: Number(newChange.toFixed(2))
          };
        });

        // Determine which symbols changed direction
        const newFlashing: Record<string, 'up' | 'down' | null> = {};
        newAssets.forEach(a => {
          const prev = prevPricesRef.current[a.symbol];
          if (prev !== undefined && prev !== a.price) {
            newFlashing[a.symbol] = a.price > prev ? 'up' : 'down';
          }
        });
        prevPricesRef.current = Object.fromEntries(newAssets.map(a => [a.symbol, a.price]));

        if (Object.keys(newFlashing).length > 0) {
          setFlashing(newFlashing);
          setTimeout(() => setFlashing({}), 1100);
        }

        return newAssets;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const isDark = theme === 'dark';
  const isSepia = theme === 'sepia';

  return (
    <div
      id="market-ticker"
      className={`text-xs h-9 border-b flex items-center overflow-hidden font-mono relative select-none ticker-scanlines ${
        isDark  ? 'bg-[#0d1117] text-zinc-300 border-zinc-800/80' :
        isSepia ? 'bg-[#E4DAC5] text-[#2E241E] border-[#DFD5C1]' :
                  'bg-neutral-50  text-[#171717] border-neutral-200'
      }`}
    >
      {/* LIVE INDEX label with blinking dot */}
      <div className={`px-3 sm:px-4 py-1 flex items-center gap-2 h-full text-[10px] uppercase font-bold tracking-widest relative z-10 whitespace-nowrap shrink-0 ${
        isDark  ? 'bg-[#0f172a] text-white border-r border-zinc-800' :
        isSepia ? 'bg-[#7C5A3E] text-white border-r border-[#A08060]' :
                  'bg-neutral-900 text-white border-r border-neutral-300'
      }`}>
        <span
          className={`w-1.5 h-1.5 rounded-full transition-opacity duration-300 ${dotVisible ? 'opacity-100' : 'opacity-0'} ${isDark ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]' : 'bg-emerald-400'}`}
        />
        Live Index
      </div>

      {/* Scrolling asset chips */}
      <div className="flex items-center animate-marquee whitespace-nowrap flex-grow overflow-x-auto scrollbar-none">
        {[...assets, ...assets].map((asset, i) => {
          const flash = flashing[asset.symbol];
          return (
            <div
              key={`${asset.symbol}-${i}`}
              id={i < assets.length ? `ticker-asset-${asset.symbol.toLowerCase()}` : undefined}
              className={`inline-flex items-center gap-2 px-4 sm:px-5 shrink-0 border-r ${
                isDark ? 'border-zinc-800/60' : isSepia ? 'border-[#DFD5C1]' : 'border-neutral-200'
              }`}
            >
              {/* Symbol */}
              <span className={`text-[9px] tracking-widest font-black ${
                isDark ? 'text-cyan-400' : isSepia ? 'text-[#7C5A3E]' : 'text-blue-600'
              }`}>
                {asset.symbol}
              </span>

              {/* Name */}
              <span className={`text-[10px] hidden sm:inline ${
                isDark ? 'text-zinc-500' : isSepia ? 'text-[#7C6C5E]' : 'text-neutral-500'
              }`}>
                {asset.name}
              </span>

              {/* Price with flash */}
              <span className={`font-semibold tabular-nums text-[11px] transition-colors ${
                flash === 'up'   ? 'price-flash-up'   :
                flash === 'down' ? 'price-flash-down'  : ''
              } ${isDark ? 'text-white' : isSepia ? 'text-[#2C2114]' : 'text-neutral-900'}`}>
                {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>

              {/* Change with direction arrow */}
              <span className={`text-[10px] font-bold flex items-center gap-0.5 ${
                asset.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {asset.change >= 0 ? '▲' : '▼'}
                {Math.abs(asset.change).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
