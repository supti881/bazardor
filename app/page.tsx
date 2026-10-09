import Image from 'next/image';
import Link from 'next/link';
import { getAllProducts } from '@/lib/api';

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
        width={32} 
        height={32} 
        className="object-contain shrink-0" 
      />
    );
  }

  if (isAda) {
    return (
      <Image 
        src="/ginger.png" 
        alt="আদা" 
        width={32} 
        height={32} 
        className="object-contain shrink-0" 
      />
    );
  }

  const iconStr = (product.image || product.categoryIcon || '🛍️') as string;
  return <span className="text-2xl leading-none">{String(iconStr)}</span>;
}

export default async function HomePage() {
  let products: Record<string, unknown>[] = [];
  
  try {
    const rawData = await getAllProducts();
    products = Array.isArray(rawData) ? rawData : [];
  } catch (error) {
    console.error('Products fetch error:', error);
  }

  const priceUpProducts = products.filter((p) => {
    const change = (p.change || {}) as Record<string, unknown>;
    return change.dir === 'up';
  });

  const priceDownProducts = products.filter((p) => {
    const change = (p.change || {}) as Record<string, unknown>;
    return change.dir === 'down';
  });

  const todayBanglaDate = new Date().toLocaleDateString('bn-BD', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <main className="min-h-screen bg-[#f8faf9] py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-8 space-y-10">
        
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-block px-3 py-1 bg-emerald-50 text-[#008a45] font-bold text-xs rounded-full">
              {todayBanglaDate}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              আজকের বাজারের দাম এক নজরে
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
            </p>
            <div>
              <Link 
                href="#all-products" 
                className="inline-flex items-center gap-2 bg-[#008a45] hover:bg-[#00763a] text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all"
              >
                সব পণ্য দেখুন
              </Link>
            </div>
          </div>

          <div className="relative w-48 h-48 sm:w-64 sm:h-64 shrink-0 flex items-center justify-center">
            <Image 
              src="/bazar-hero.png" 
              alt="বাজার দর" 
              width={240} 
              height={240} 
              className="object-contain"
              priority
            />
          </div>
        </div>

        {priceUpProducts.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-red-600 text-sm font-bold">▲</span>
              <h2 className="text-lg font-bold text-gray-900">আজ দাম বেড়েছে</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {priceUpProducts.map((product, idx) => (
                <ProductCard key={String(product.id || idx)} product={product} />
              ))}
            </div>
          </section>
        )}

        {priceDownProducts.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 text-sm font-bold">▼</span>
              <h2 className="text-lg font-bold text-gray-900">আজ দাম কমেছে</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {priceDownProducts.map((product, idx) => (
                <ProductCard key={String(product.id || idx)} product={product} />
              ))}
            </div>
          </section>
        )}

        <section id="all-products" className="space-y-4 pt-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-lg font-bold text-gray-900">সব পণ্য</h2>
            <p className="text-xs text-gray-500 font-medium">
              মোট {toBanglaNumber(products.length)}টি পণ্য দেখানো হচ্ছে
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product, idx) => (
              <ProductCard key={String(product.id || idx)} product={product} />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

function ProductCard({ product }: { product: Record<string, unknown> }) {
  const changeObj = (product.change || {}) as Record<string, unknown>;
  const isUp = changeObj.dir === 'up';
  const isDown = changeObj.dir === 'down';
  const pctVal = Math.abs(Number(changeObj.pct || 0));

  const nameDisplay = String(product.nameBn || product.name || product.slug || '');
  const todayPrice = Number(product.today ?? product.price ?? 0);
  const unitDisplay = String(product.unit || 'kg');

  return (
    <Link 
      href={`/products/${product.id || product.slug}`}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
    >
      <div className="flex items-center gap-3.5 mb-6">
        <div className="w-12 h-12 bg-gray-100/70 rounded-full flex items-center justify-center shrink-0 group-hover:bg-emerald-50 transition-colors">
          {renderProductIcon(product)}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-[#008a45] transition-colors">
            {nameDisplay}
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            প্রতি {getBanglaUnit(unitDisplay)}
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between pt-2">
        <div>
          <p className="text-[11px] text-gray-400 font-medium mb-0.5">আজকের দাম</p>
          <p className="text-lg font-extrabold text-gray-900 leading-none">
            {toBanglaNumber(todayPrice)} টাকা
          </p>
        </div>

        <div
          className={`px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-0.5 ${
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
        </div>
      </div>
    </Link>
  );
}