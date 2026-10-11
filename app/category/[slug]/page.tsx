'use client';

import { useEffect, useState, use } from 'react';
import { getProductsByCategory } from '@/lib/api';
import { Product } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// English/Romanized category to Bangla mapping lookup
const categoryBanglaMap: Record<string, string> = {
  chal: 'চাল',
  dal: 'ডাল',
  tel: 'তেল',
  sobji: 'সবজি',
  mach: 'মাছ',
  mangso: 'মাংস',
  egg: 'ডিম-দুধ',
  'egg-milk': 'ডিম-দুধ',
  masala: 'মসলা',
};

function toBanglaNumber(value: number | string): string {
  const banglaDigits: Record<string, string> = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
  };

  return String(value).replace(/[0-9]/g, (digit) => banglaDigits[digit] || digit);
}

function extractProductDetails(prodObj: Record<string, unknown>) {
  let price = 0;
  let change = 0;

  if (typeof prodObj.price === 'number') price = prodObj.price;
  else if (typeof prodObj.currentPrice === 'number') price = prodObj.currentPrice;
  else if (typeof prodObj.price_bdt === 'number') price = prodObj.price_bdt;

  if (typeof prodObj.change === 'number') change = prodObj.change;
  else if (typeof prodObj.priceChange === 'number') change = prodObj.priceChange;

  if (price === 0) {
    for (const [key, value] of Object.entries(prodObj)) {
      if (typeof value === 'number' && key.toLowerCase() !== 'id' && key.toLowerCase() !== '_id') {
        if (value > 10) price = value;
        else if (change === 0) change = value;
      }
    }
  }

  return { price, change };
}

export default function CategoryDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const categorySlug = decodeURIComponent(resolvedParams.slug).toLowerCase();

  const [products, setProducts] = useState<Product[]>([]);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState<string>('default');
  const [loading, setLoading] = useState<boolean>(true);
  const [displayCategoryName, setDisplayCategoryName] = useState<string>('');

  useEffect(() => {
    async function loadCategoryProducts() {
      setLoading(true);
      try {
        const rawData = await getProductsByCategory(categorySlug);
        const fetchedProducts = Array.isArray(rawData)
          ? (rawData as Product[])
          : (((rawData as Record<string, unknown>)?.products || (rawData as Record<string, unknown>)?.data || []) as Product[]);
        
        setProducts(fetchedProducts);
        setSortedProducts(fetchedProducts);

        // API Data theke bangla category name khuja
        let foundBanglaName = '';
        if (fetchedProducts.length > 0) {
          const firstItem = fetchedProducts[0] as unknown as Record<string, unknown>;
          foundBanglaName = String(firstItem.categoryBn || firstItem.category_bn || firstItem.categoryName || '');
        }

        // Bangla name na pele dictionary lookup
        if (!foundBanglaName || foundBanglaName.toLowerCase() === categorySlug) {
          foundBanglaName = categoryBanglaMap[categorySlug] || decodeURIComponent(resolvedParams.slug);
        }

        setDisplayCategoryName(foundBanglaName);
      } catch (error) {
        console.error("Failed to fetch category products:", error);
        setDisplayCategoryName(categoryBanglaMap[categorySlug] || decodeURIComponent(resolvedParams.slug));
      } finally {
        setLoading(false);
      }
    }
    loadCategoryProducts();
  }, [categorySlug, resolvedParams.slug]);

  const handleSortChange = (option: string) => {
    setSortOption(option);
    const productList = [...products];

    if (option === 'low-high') {
      productList.sort((a, b) => {
        const pA = extractProductDetails(a as unknown as Record<string, unknown>).price;
        const pB = extractProductDetails(b as unknown as Record<string, unknown>).price;
        return pA - pB;
      });
    } else if (option === 'high-low') {
      productList.sort((a, b) => {
        const pA = extractProductDetails(a as unknown as Record<string, unknown>).price;
        const pB = extractProductDetails(b as unknown as Record<string, unknown>).price;
        return pB - pA;
      });
    }

    setSortedProducts(productList);
  };

  return (
    <main className="min-h-screen bg-[#f1f3f2] py-6 font-sans">
      <div className="container mx-auto px-4 max-w-6xl space-y-4">
        
        {/* Category Header Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/60 flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-100/80 rounded-full flex items-center justify-center text-2xl shrink-0">
            🍚
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
              {displayCategoryName || categoryBanglaMap[categorySlug] || categorySlug}
            </h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              প্রতি কেজির আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>

        {/* Sorting Dropdown Bar */}
        <div className="bg-white rounded-2xl px-6 py-3.5 shadow-sm border border-gray-100/60 flex items-center justify-end">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span>সাজান</span>
            <select 
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none font-medium text-gray-700 text-xs cursor-pointer"
            >
              <option value="default">ডিফল্ট</option>
              <option value="low-high">দাম: কম থেকে বেশি</option>
              <option value="high-low">দাম: বেশি থেকে কম</option>
            </select>
          </div>
        </div>

        {/* Total Products Count */}
        <div className="text-xs font-semibold text-gray-500 px-1 pt-1">
          মোট {toBanglaNumber(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center text-xs font-semibold text-gray-400 shadow-sm border border-gray-100/60">
            পণ্য লোড হচ্ছে...
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center text-xs font-semibold text-gray-400 shadow-sm border border-gray-100/60">
            এই বিভাগে কোনো পণ্য পাওয়া যায়নি।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedProducts.map((product, idx) => {
              const prodObj = product as unknown as Record<string, unknown>;
              const { price, change } = extractProductDetails(prodObj);

              const isUp = change > 0;
              const isDown = change < 0;
              const productId = String(product.id || prodObj._id || idx);
              const productName = String(prodObj.nameBn || product.name || prodObj.title || 'অজানা পণ্য');
              const icon = String(prodObj.icon || '🍚');

              return (
                <div 
                  key={productId} 
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/60 flex flex-col justify-between relative hover:shadow-md transition-shadow min-h-[135px]"
                >
                  {/* Top: Icon & Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-base shrink-0 border border-gray-100">
                      {icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm leading-tight">
                        {productName}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
                        প্রতি কেজি
                      </p>
                    </div>
                  </div>

                  {/* Bottom: Price & Percentage Badge */}
                  <div className="flex items-end justify-between pt-4 mt-1">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-medium">
                        আজকের দাম
                      </span>
                      <span className="text-lg font-extrabold text-gray-900 mt-0.5 block leading-none">
                        {price > 0 ? `${toBanglaNumber(price)} টাকা` : '—'}
                      </span>
                    </div>

                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      isUp 
                        ? 'bg-red-50 text-red-600' 
                        : isDown 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {isUp 
                        ? `▲ ${toBanglaNumber(change)}%` 
                        : isDown 
                        ? `▼ ${toBanglaNumber(Math.abs(change))}%` 
                        : '— 0.0%'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}