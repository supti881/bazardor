export interface Product {
  id: number | string;
  name: string;
  emoji: string;
  unit: string;
  price?: number | string;
  todayPrice?: number | string;
  changePercent: number;
  category: string;
  slug: string;
  description?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  avgPrice?: number | string;
  bazarPrices?: {
    bazarName: string;
    price: number | string;
  }[];
}

export interface Category {
  id: number | string;
  name: string;
  slug: string;
  icon?: string;
}