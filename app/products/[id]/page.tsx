import Image from 'next/image';
import Link from 'next/link';
import { getProductById } from '@/lib/api';
import { Suspense } from 'react';

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
        width={36} 
        height={36} 
        className="object-contain shrink-0" 
      />
    );
  }

  if (isAda) {
    return (
      <Image 
        src="/ginger.png" 
        alt="আদা" 
        width={36} 
        height={36} 
        className="object-contain shrink-0" 
      />
    );
  }

  const iconStr = (product.image || product.categoryIcon || '🍚') as string;
  return <span className="text-3xl leading-none">{String(iconStr)}</span>;
}

interface ProductDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f1f5f2] py-8">
          <div className="container mx-auto max-w-5xl px-4 sm:px-8">
            <p className="text-center text-gray-500 py-8 text-xs font-semibold">পণ্যের তথ্য লোড হচ্ছে...</p>
          </div>
        </main>
      }
    >
      <ProductDetails params={params} />
    </Suspense>
  );
}

async function ProductDetails({ params }: ProductDetailsPageProps) {
  const { id } = await params;
  let product: Record<string, unknown> | null = null;

  try {
    const rawProduct = await getProductById(id);
    product = (rawProduct as unknown) as Record<string, unknown>;
  } catch (error) {
    console.error('Failed to fetch product details:', error);
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f1f5f2] py-16 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold text-gray-800">পণ্যটি পাওয়া যায়নি</h1>
        <p className="text-gray-500 mt-2 text-xs">দুঃখিত, অনুরোধকৃত পণ্যের ডাটা লোড করা সম্ভব হয়নি।</p>
        <Link 
          href="/" 
          className="mt-6 px-5 py-2.5 bg-[#008a45] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#00763a] transition-all"
        >
          হোম পেজে ফিরে যান
        </Link>
      </main>
    );
  }

  const nameDisplay = String(product.nameBn || product.name || product.slug || '');
  const categoryDisplay = String(product.categoryName || product.category || 'পণ্য');
  const todayPrice = Number(product.today ?? product.price ?? 0);
  const unitDisplay = String(product.unit || 'kg');

  const changeObj = (product.change || {}) as Record<string, unknown>;
  const isUp = changeObj.dir === 'up';
  const isDown = changeObj.dir === 'down';
  const pctVal = Math.abs(Number(changeObj.pct || 0));

  const markets = (Array.isArray(product.markets) ? product.markets : []) as Record<string, unknown>[];

  let minPrice = todayPrice;
  let maxPrice = todayPrice;
  let minMarketName = 'সবচেয়ে কম পাওয়া বাজার';
  let maxMarketName = 'সবচেয়ে বেশি দামের বাজার';

  if (markets.length > 0) {
    const allMins = markets.map((m) => Number(m.min || todayPrice));
    const allMaxs = markets.map((m) => Number(m.max || todayPrice));
    minPrice = Math.min(...allMins);
    maxPrice = Math.max(...allMaxs);

    const minObj = markets.find((m) => Number(m.min) === minPrice);
    if (minObj?.market) minMarketName = String(minObj.market);

    const maxObj = markets.find((m) => Number(m.max) === maxPrice);
    if (maxObj?.market) maxMarketName = String(maxObj.market);
  }

  return (
    <main className="min-h-screen bg-[#f1f5f2] py-8 px-4 font-sans text-gray-800">
      <div className="container mx-auto max-w-5xl space-y-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 px-1">
          <Link href="/" className="hover:text-gray-800">হোম</Link>
          <span>›</span>
          <span className="text-gray-500">{categoryDisplay}</span>
          <span>›</span>
          <span className="text-gray-800 font-bold">{nameDisplay}</span>
        </nav>

        {/* Top Product Hero Card */}
        <div className="bg-[#fcfdfe] rounded-2xl p-6 shadow-sm border border-gray-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
              {renderProductIcon(product)}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {nameDisplay}
              </h1>
              <p className="text-xs text-gray-400 font-medium">
                প্রতি {getBanglaUnit(unitDisplay)} - {categoryDisplay}
              </p>
              <p className="text-xs text-gray-500 font-semibold pt-1">
                {isDown && `গতকালকের তুলনায় আজ দাম কমেছে - ${toBanglaNumber(Math.abs(Number(changeObj.val || 0)))} টাকা`}
                {isUp && `গতকালকের তুলনায় আজ দাম বেড়েছে + ${toBanglaNumber(Math.abs(Number(changeObj.val || 0)))} টাকা`}
                {!isUp && !isDown && 'গতকালকের তুলনায় আজ দামে কোনো পরিবর্তন হয়নি'}
              </p>
            </div>
          </div>

          <div className="bg-[#f4f7f5] rounded-2xl p-4 text-center border border-gray-100 min-w-[150px] shrink-0 self-stretch sm:self-auto flex flex-col justify-center">
            <p className="text-[11px] font-bold text-gray-500 mb-1">আজকের গড় দাম</p>
            <div className="text-3xl font-extrabold text-gray-900 leading-none mb-1">
              {toBanglaNumber(todayPrice)}
            </div>
            <p className="text-[10px] font-semibold text-gray-400 mb-1.5">
              টাকা / {getBanglaUnit(unitDisplay)}
            </p>
            <span 
              className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md mx-auto ${
                isUp 
                  ? 'bg-red-50 text-red-600' 
                  : isDown 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {isUp && '▲ '}
              {isDown && '▼ '}
              {!isUp && !isDown && '— '}
              {toBanglaNumber(pctVal)}%
            </span>
          </div>
        </div>

        {/* Analytics & Table Card */}
        <div className="bg-[#fcfdfe] rounded-2xl p-6 shadow-sm border border-gray-200/60 space-y-6">
          
          {/* Price Summary Grid */}
          <div>
            <h2 className="text-sm font-extrabold text-gray-900 mb-3">
              দামের সারসংক্ষেপ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Lowest Price Card */}
              <div className="bg-[#fcfdfe] border border-gray-200/80 rounded-2xl p-4 space-y-1">
                <p className="text-[11px] font-bold text-gray-500">সর্বনিম্ন দাম</p>
                <div className="text-2xl font-extrabold text-[#008a45]">
                  {toBanglaNumber(minPrice)} <span className="text-xs font-bold">টাকা</span>
                </div>
                <p className="text-[10px] font-medium text-gray-400 truncate">{minMarketName}</p>
              </div>

              {/* Highest Price Card */}
              <div className="bg-[#fcfdfe] border border-gray-200/80 rounded-2xl p-4 space-y-1">
                <p className="text-[11px] font-bold text-gray-500">সর্বাধিক দাম</p>
                <div className="text-2xl font-extrabold text-red-600">
                  {toBanglaNumber(maxPrice)} <span className="text-xs font-bold">টাকা</span>
                </div>
                <p className="text-[10px] font-medium text-gray-400 truncate">{maxMarketName}</p>
              </div>

              {/* Average Price Card */}
              <div className="bg-[#fcfdfe] border border-gray-200/80 rounded-2xl p-4 space-y-1">
                <p className="text-[11px] font-bold text-gray-500">গড় দাম</p>
                <div className="text-2xl font-extrabold text-gray-900">
                  {toBanglaNumber(todayPrice)} <span className="text-xs font-bold">টাকা</span>
                </div>
                <p className="text-[10px] font-medium text-gray-400">প্রতি {getBanglaUnit(unitDisplay)}-এর হিসাব</p>
              </div>

            </div>
          </div>

          {/* Market Price Table */}
          {markets.length > 0 && (
            <div className="space-y-3 pt-2">
              <h2 className="text-sm font-extrabold text-gray-900">
                বাজারভিত্তিক আজকের দাম
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-bold">
                      <th className="py-3 px-3 font-bold">বাজার</th>
                      <th className="py-3 px-3 font-bold">বিভাগ</th>
                      <th className="py-3 px-3 font-bold text-right">সর্বনিম্ন</th>
                      <th className="py-3 px-3 font-bold text-right">সর্বাধিক</th>
                      <th className="py-3 px-3 font-bold text-right">গড়</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-bold text-gray-800">
                    {markets.map((m, idx) => {
                      const minVal = Number(m.min || todayPrice);
                      const maxVal = Number(m.max || todayPrice);
                      const avgVal = ((minVal + maxVal) / 2).toFixed(2).replace('.00', '');

                      return (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 px-3 font-bold text-gray-900">{String(m.market || '—')}</td>
                          <td className="py-3 px-3 text-gray-500 font-semibold">{String(m.division || '—')}</td>
                          <td className="py-3 px-3 text-right font-extrabold">{toBanglaNumber(minVal)} টাকা</td>
                          <td className="py-3 px-3 text-right font-extrabold">{toBanglaNumber(maxVal)} টাকা</td>
                          <td className="py-3 px-3 text-right font-extrabold">{toBanglaNumber(avgVal)} টাকা</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </main>
  );
}