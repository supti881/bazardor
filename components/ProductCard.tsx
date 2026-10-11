import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';

function toBanglaNumber(value: number | string): string {
  const banglaDigits: Record<string, string> = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
  };

  return String(value).replace(/[0-9]/g, (digit) => banglaDigits[digit] || digit);
}

function getBanglaUnit(unit?: string): string {
  if (!unit || unit === 'kg') return 'কেজি';
  if (unit === 'litre') return 'লিটার';
  if (unit === 'dozen') return 'ডজন';
  if (unit === 'piece') return 'পিস';
  return unit;
}

function renderProductIcon(product: Product) {
  const productName = product.nameBn || product.name || '';
  const isDal = product.category === 'dal' || product.slug.includes('dal') || productName.includes('ডাল');
  const isGinger = product.slug === 'ada' || productName.includes('আদা');

  if (isDal) {
    return (
      <Image
        src="/icons8-beans-48.png"
        alt="ডাল"
        width={32}
        height={32}
        className="object-contain"
      />
    );
  }

  if (isGinger) {
    return (
      <Image
        src="/ginger.png"
        alt="আদা"
        width={32}
        height={32}
        className="object-contain"
      />
    );
  }

  return (
    <span className="text-2xl leading-none">
      {product.image || product.categoryIcon || product.emoji || '🛍️'}
    </span>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const isUp = product.change?.dir === 'up';
  const isDown = product.change?.dir === 'down';
  const changePercent = Math.abs(Number(product.change?.pct || product.changePercent || 0));
  const name = product.nameBn || product.name || product.slug;
  const todayPrice = product.today ?? product.price ?? product.todayPrice ?? 0;

  return (
    <Link
      href={`/products/${encodeURIComponent(String(product.id))}`}
      className="group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
    >
      <div className="mb-6 flex items-center gap-3.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100/70 transition-colors group-hover:bg-emerald-50">
          {renderProductIcon(product)}
        </div>
        <div>
          <h3 className="text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#008a45]">
            {name}
          </h3>
          <p className="mt-0.5 text-xs font-medium text-gray-400">
            প্রতি {getBanglaUnit(product.unit)}
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between border-t border-gray-50 pt-3">
        <div>
          <p className="mb-0.5 text-[11px] font-medium text-gray-400">আজকের দাম</p>
          <p className="text-lg font-extrabold leading-none text-gray-900">
            {toBanglaNumber(todayPrice)} টাকা
          </p>
        </div>
        <span
          className={`flex items-center gap-0.5 rounded-md px-2 py-0.5 text-xs font-bold ${
            isUp
              ? 'bg-red-50 text-red-600'
              : isDown
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-gray-100 text-gray-500'
          }`}
        >
          {isUp ? '▲' : isDown ? '▼' : '—'} {toBanglaNumber(changePercent)}%
        </span>
      </div>
    </Link>
  );
}
