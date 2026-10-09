const BASE_URL = 'https://api.abcz.workers.dev/api/bazardor';


export async function fetchWithFallback<T = unknown>(endpoint: string): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch from ${url}`);
  }
  return res.json();
}

export async function getCategories() {
  return fetchWithFallback('/categories');
}

export async function getAllProducts() {
  return fetchWithFallback('/products');
}

export async function getProductsByCategory(categorySlug: string) {
  return fetchWithFallback(`/products?category=${categorySlug}`);
}

export async function getProductById(id: string | number) {
  return fetchWithFallback(`/products/${id}`);
}