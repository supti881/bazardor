export interface Product {
  id: number | string;
  name?: string;
  nameBn?: string;
  emoji?: string;
  image?: string;
  categoryIcon?: string;
  unit?: string;
  price?: number | string;
  today?: number | string;
  todayPrice?: number | string;
  changePercent?: number;
  change?: {
    dir?: string;
    pct?: number | string;
  };
  category: string;
  categoryNameBn?: string;
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
  name?: string;
  nameBn?: string;
  slug: string;
  icon?: string;
}