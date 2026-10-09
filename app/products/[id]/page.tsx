import Image from 'next/image';
import Link from 'next/link';
import { getProductById } from '@/lib/api';

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
        width={40} 
        height={40} 
        className="object-contain shrink-0" 
      />
    );
  }

  if (isAda) {
    return (
      <Image 
        src="/ginger.png" 
        alt="আদা" 
        width={40} 
        height={40} 
        className="object-contain shrink-0" 
      />
    );
  }

  const iconStr = (product.image || product.categoryIcon || '🛍️') as string;
  return <span className="text-3xl leading-none">{String(iconStr)}</span>;
}

interface ProductDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
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
      <main className="min-h-screen bg-[#f8faf9] py-16 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold text-gray-800">পণ্যটি পাওয়া যায়নি</h1>
        <p className="text-gray-500 mt-2 text-sm">দুঃখিত, অনুরোধকৃত পণ্যের ডাটা লোড করা সম্ভব হয়নি।</p>
        <Link 
          href="/" 
          className="mt-6 px-5 py-2.5 bg-[#008a45] text-white text-sm font-bold rounded-xl shadow-sm hover:bg-[#00763a] transition-all"
        >
          হোম পেজে ফিরে যান
        </Link>
      </main>
    );
  }

  const nameDisplay = String(product.nameBn || product.name || product.slug || '');
  const todayPrice = Number(product.today ?? product.price ?? 0);
  const unitDisplay = String(product.unit || 'kg');

  const changeObj = (product.change || {}) as Record<string, unknown>;
  const isUp = changeObj.dir === 'up';
  const isDown = changeObj.dir === 'down';
  const pctVal = Math.abs(Number(changeObj.pct || 0));

  const markets = (Array.isArray(product.markets) ? product.markets : []) as Record<string, unknown>[];

  let minPrice = todayPrice;
  let maxPrice = todayPrice;

  if (markets.length > 0) {
    const allMins = markets.map((m) => Number(m.min || todayPrice));
    const allMaxs = markets.map((m) => Number(m.max || todayPrice));
    minPrice = Math.min(...allMins);
    maxPrice = Math.max(...allMaxs);
  }

  return (
    <main className="min-h-screen bg-[#f8faf9] py-8">
      <div className="container mx-auto max-w-5xl px-4 sm:px-8 space-y-8">
        
        <div>
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#008a45] transition-colors"
          >
            ← সব পণ্যে ফিরে যান
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100/80 rounded-2xl flex items-center justify-center shrink-0">
              {renderProductIcon(product)}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{nameDisplay}</h1>
              <p className="text-xs text-gray-400 font-medium mt-1">
                প্রতি {getBanglaUnit(unitDisplay)}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end">
            <span className="text-xs text-gray-400 font-medium mb-1">আজকের গড় দাম</span>
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-black text-gray-900">
                {toBanglaNumber(todayPrice)} টাকা
              </span>
              <span 
                className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-0.5 ${
                  isUp 
                    ? 'bg-red-50 text-red-600' 
                    : isDown 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {isUp && '▲'}
                {isDown && '▼'}
                {!isUp && !isDown && '—'}
                {toBanglaNumber(pctVal)}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-medium mb-1">সর্বনিম্ন দাম</p>
            <p className="text-xl font-extrabold text-emerald-600">
              {toBanglaNumber(minPrice)} টাকা
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-medium mb-1">গড় দাম</p>
            <p className="text-xl font-extrabold text-gray-900">
              {toBanglaNumber(todayPrice)} টাকা
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-medium mb-1">সর্বোচ্চ দাম</p>
            <p className="text-xl font-extrabold text-red-600">
              {toBanglaNumber(maxPrice)} টাকা
            </p>
          </div>
        </div>

        {markets.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">বিভিন্ন বাজারের আজকের দাম</h2>
              <span className="text-xs text-gray-400 font-medium">
                মোট {toBanglaNumber(markets.length)}টি বাজার
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold">
                    <th className="py-3 px-2">বাজারের নাম</th>
                    <th className="py-3 px-2">বিভাগ</th>
                    <th className="py-3 px-2 text-right">সর্বনিম্ন (টাকা)</th>
                    <th className="py-3 px-2 text-right">সর্বোচ্চ (টাকা)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-800">
                  {markets.map((m, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-2 font-bold text-gray-900">{String(m.market || '—')}</td>
                      <td className="py-3.5 px-2 text-gray-500">{String(m.division || '—')}</td>
                      <td className="py-3.5 px-2 text-right font-semibold text-emerald-600">
                        {toBanglaNumber(Number(m.min || 0))}
                      </td>
                      <td className="py-3.5 px-2 text-right font-semibold text-red-600">
                        {toBanglaNumber(Number(m.max || 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}