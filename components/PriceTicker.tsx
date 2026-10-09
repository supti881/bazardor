'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/types';

interface PriceTickerProps {
  products?: Product[];
}

function toBanglaNumber(strNum: string | number): string {
  const banglaDigits: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯', '.': '.'
  };
  return String(strNum).replace(/[0-9]/g, (digit) => banglaDigits[digit] || digit);
}

function getBanglaUnit(unit?: string): string {
  if (!unit) return 'কেজি';
  if (unit === 'kg') return 'কেজি';
  if (unit === 'litre') return 'লিটার';
  if (unit === 'dozen') return 'ডজন';
  if (unit === 'piece') return 'পিস';
  return unit;
}

function renderProductIcon(product: Record<string, unknown>) {
  const categoryKey = String(product.category || '');
  const slugStr = String(product.slug || '');
  const nameStr = String(product.nameBn || product.name || '');

  const isDal = categoryKey === 'dal' || slugStr.includes('dal') || nameStr.includes('ডাল');
  const isAda = slugStr === 'ada' || nameStr.includes('আদা');

  if (isDal) {
    return (
      <Image 
        src="/icons8-beans-48.png" 
        alt="ডাল" 
        width={18} 
        height={18} 
        className="object-contain shrink-0" 
      />
    );
  }

  if (isAda) {
    return (
      <Image 
        src="/ginger.png" 
        alt="আদা" 
        width={18} 
        height={18} 
        className="object-contain shrink-0" 
      />
    );
  }

  const iconStr = (product.categoryIcon || product.image || '🛢️') as string;
  return <span className="text-base leading-none">{String(iconStr)}</span>;
}

export default function PriceTicker({ products = [] }: PriceTickerProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="w-full bg-white border-y border-gray-100 overflow-hidden py-2 shadow-inner">
      <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
        {[...products, ...products].map((item, index) => {
          const product = (item as unknown) as Record<string, unknown>;
          
          const changeObj = (product.change || {}) as Record<string, unknown>;
          const isUp = changeObj.dir === 'up';
          const isDown = changeObj.dir === 'down';
          const pctVal = Math.abs(Number(changeObj.pct || 0));

          const nameDisplay = String(product.nameBn || product.name || product.slug || '');
          const todayPrice = Number(product.today ?? product.price ?? 0);
          const unitDisplay = String(product.unit || 'kg');

          return (
            <div 
              key={`${String(product.id || index)}-${index}`} 
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium px-3 py-1 bg-gray-50/50 rounded-lg border border-gray-100 shrink-0"
            >
              {renderProductIcon(product)}

              <span className="font-bold text-gray-800">{nameDisplay}</span>

              <span className="text-gray-600">
                {toBanglaNumber(todayPrice)} টাকা/{getBanglaUnit(unitDisplay)}
              </span>

              <span 
                className={`font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
                  isUp 
                    ? 'text-red-600 bg-red-50' 
                    : isDown 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-gray-500 bg-gray-100'
                }`}
              >
                {isUp && '▲'}
                {isDown && '▼'}
                {!isUp && !isDown && '—'}
                {toBanglaNumber(pctVal)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}