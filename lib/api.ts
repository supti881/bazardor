const BASE_URLS = [
  'https://api.api-store.workers.dev/api/bazardor',
  'https://api.abcz.workers.dev/api/bazardor'
];

export async function fetchWithFallback<T>(endpoint: string): Promise<T> {
  for (const baseUrl of BASE_URLS) {
    try {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        next: { revalidate: 60 }
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (error) {
      console.warn(`Failed fetching from ${baseUrl}${endpoint}, trying fallback...`);
    }
  }
  throw new Error(`Unable to fetch data from both API sources for endpoint: ${endpoint}`);
}