'use client';

import { Product } from '@/types';
import { toBengaliNumerals } from '@/lib/utils';

interface PriceTickerProps {
  products: Product[];
}

export default function PriceTicker({ products }: PriceTickerProps) {
  if (!products || products.length === 0) return null;

  // continuous seamless loop-er jonno array duplicate kora hocche
  const tickerItems = [...products, ...products, ...products];

  return (
    <div className="w-full bg-gray-50/90 border-t border-b border-gray-200 overflow-hidden py-2 text-sm select-none">
      <div className="flex animate-marquee whitespace-nowrap">
        {tickerItems.map((item, idx) => {
          const price = item.price || item.todayPrice || 0;
          const change = item.changePercent || 0;
          const isUp = change > 0;
          const isDown = change < 0;

          return (
            <div 
              key={`${item.id}-${idx}`} 
              className="inline-flex items-center gap-2 border-r border-gray-200 px-6 shrink-0"
            >
              <span className="text-base">{item.emoji || '🍚'}</span>
              <span className="font-semibold text-gray-800">{item.name}</span>
              <span className="text-gray-600 font-medium">
                {toBengaliNumerals(price)} টাকা/{item.unit || 'কেজি'}
              </span>
              
              <span className={`text-xs font-bold ${
                isUp ? 'text-red-600' : isDown ? 'text-emerald-600' : 'text-gray-500'
              }`}>
                {isUp ? `▲ ${toBengaliNumerals(Math.abs(change))}%` : isDown ? `▼ ${toBengaliNumerals(Math.abs(change))}%` : `— ০.০%`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}