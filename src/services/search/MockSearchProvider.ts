import { SearchProvider, SearchResult, SearchFilters } from './SearchProvider';
import { adminDb } from '@/lib/firebase/admin';

export class MockSearchProvider implements SearchProvider {
  async searchProducts(query: string, filters?: SearchFilters, page: number = 1, limit: number = 20): Promise<SearchResult> {
    console.log(`[MOCK SEARCH] Searching for: "${query}" with filters:`, filters);
    
    // In Mock mode, we simulate Algolia by fetching all active products from Firestore
    // and filtering them in-memory to simulate complex matching.
    const snapshot = await adminDb.collection('products').get();
    let hits = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })) as any[];

    // 1. Keyword search (simulating fuzzy match)
    const normalizedQuery = query.toLowerCase().trim();
    if (normalizedQuery) {
      hits = hits.filter(hit => {
        const title = (hit.name || '').toLowerCase();
        const desc = (hit.description || '').toLowerCase();
        const category = (hit.category || '').toLowerCase();
        return title.includes(normalizedQuery) || desc.includes(normalizedQuery) || category.includes(normalizedQuery);
      });
    }

    // 2. Filters
    if (filters) {
      if (filters.category) hits = hits.filter(h => h.category === filters.category);
      if (filters.brand) hits = hits.filter(h => h.brandId === filters.brand);
      if (filters.maxPrice) hits = hits.filter(h => h.price <= (filters.maxPrice as number));
    }

    // 3. Pagination
    const totalHits = hits.length;
    const totalPages = Math.ceil(totalHits / limit);
    const startIdx = (page - 1) * limit;
    const paginatedHits = hits.slice(startIdx, startIdx + limit);

    return {
      hits: paginatedHits,
      totalHits,
      page,
      totalPages
    };
  }

  async indexProduct(productId: string, data: any): Promise<void> {
    console.log(`[MOCK SEARCH] Indexing product ${productId}`);
  }

  async deleteProduct(productId: string): Promise<void> {
    console.log(`[MOCK SEARCH] Deleting product ${productId} from index`);
  }

  async bulkIndexProducts(products: any[]): Promise<void> {
    console.log(`[MOCK SEARCH] Bulk indexing ${products.length} products`);
  }
}
