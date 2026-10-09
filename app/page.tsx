import { fetchWithFallback } from '@/lib/api';
import { Product } from '@/types';

export default async function HomePage() {
  let products: Product[] = [];

  try {
    products = await fetchWithFallback<Product[]>('/products');
  } catch (error) {
    console.error("Failed to load products:", error);
  }

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8 text-center text-gray-500 font-medium">
      <p>হোম পেজ সফলভাবে লোড হয়েছে।</p>
    </main>
  );
}