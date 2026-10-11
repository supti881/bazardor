import Link from 'next/link';
import { getAllProducts, getCategories } from '@/lib/api';
import { Category, Product } from '@/types';

function toBanglaNumber(value: number): string {
  const banglaDigits: Record<string, string> = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
  };

  return String(value).replace(/[0-9]/g, (digit) => banglaDigits[digit] || digit);
}

export default async function AllProductsPage() {
  const [categories, products] = await Promise.all([
    getCategories() as Promise<Category[]>,
    getAllProducts() as Promise<Product[]>,
  ]);

  return (
    <main className="min-h-screen bg-[#f3f5f4] pb-12 pt-6 font-sans">
      <div className="container mx-auto px-4 max-w-6xl space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-3xl shrink-0">
            🛒
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              বাজার দর - সকল পণ্য
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              একটি বিভাগ বেছে নিন অথবা সব পণ্যের তালিকা দেখুন
            </p>
          </div>
        </div>

        {/* Categories Section */}
        {categories.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-gray-700">ক্যাটাগরি সমূহ</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {categories.map((category) => {
                const catObj = category as unknown as Record<string, unknown>;
                const slug = String(catObj.slug || category.name || '');
                const icon = String(catObj.icon || '📦');
                const nameBn = String(catObj.nameBn || category.name || slug);

                return (
                  <Link
                    key={category.id || slug}
                    href={`/category/${encodeURIComponent(slug)}`}
                    className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all hover:shadow-md hover:border-emerald-200"
                  >
                    <span className="text-xl leading-none">{icon}</span>
                    <span className="text-xs font-bold text-gray-800 truncate">
                      {nameBn}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter and Count Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="text-xs font-semibold text-gray-500">
            মোট <span className="text-gray-900 font-bold">{toBanglaNumber(products.length)}টি</span> পণ্য দেখানো হচ্ছে
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>সাজান</span>
            <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none font-medium text-gray-700">
              <option value="default">ডিফল্ট</option>
              <option value="low-high">দাম: কম থেকে বেশি</option>
              <option value="high-low">দাম: বেশি থেকে কম</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        {products.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center text-xs font-semibold text-gray-500 shadow-sm border border-gray-100">
            কোনো পণ্য পাওয়া যায়নি।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product, idx) => {
              const prodObj = product as unknown as Record<string, unknown>;
              const price = Number(product.price || prodObj.currentPrice || 0);
              const change = Number(prodObj.change || prodObj.priceChange || 0);
              const isUp = change > 0;
              const isDown = change < 0;
              const productId = String(product.id || prodObj._id || idx);
              const productName = String(prodObj.nameBn || product.name || prodObj.title || 'অজানা পণ্য');
              const icon = String(prodObj.icon || '🍚');

              return (
                <div 
                  key={productId} 
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-xl">
                      {icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">
                        {productName}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        প্রতি কেজি
                      </p>
                      <div className="mt-2">
                        <span className="text-[10px] text-gray-400 block">আজকের দাম</span>
                        <span className="text-lg font-extrabold text-gray-900">
                          {price > 0 ? `${toBanglaNumber(price)} টাকা` : '১৪৮ টাকা'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="self-end pb-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold ${
                      isUp ? 'bg-red-50 text-red-600' : isDown ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {isUp ? `▲ ${toBanglaNumber(change)}%` : isDown ? `▼ ${toBanglaNumber(Math.abs(change))}%` : '— 0.0%'}
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