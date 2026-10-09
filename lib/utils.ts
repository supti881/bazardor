import { Product } from '@/types';

// english to bangla
const enToBnMap: Record<string, string> = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

// bangla to english
const bnToEnMap: Record<string, string> = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
};

// converting english 
export function toBengaliNumerals(num: number | string): string {
  if (num === null || num === undefined) return '';
  return num.toString().replace(/\d/g, (digit) => enToBnMap[digit] || digit);
}

//  JavaScript to neumeri value 
export function parseBengaliNumber(bnStr: string | number): number {
  if (typeof bnStr === 'number') return bnStr;
  if (!bnStr) return 0;
  
  const englishStr = bnStr.toString().replace(/[০-৯]/g, (digit) => bnToEnMap[digit] || digit);
  return parseFloat(englishStr.replace(/[^0-9.-]/g, '')) || 0;
}

// product setting function
export function sortProducts(products: Product[], sortBy: string): Product[] {
  if (!products) return [];
  if (sortBy === 'default') return products;

  return [...products].sort((a, b) => {
    const priceA = parseBengaliNumber(a.price || a.todayPrice || 0);
    const priceB = parseBengaliNumber(b.price || b.todayPrice || 0);

    if (sortBy === 'low-to-high') return priceA - priceB;
    if (sortBy === 'high-to-low') return priceB - priceA;
    return 0;
  });
}