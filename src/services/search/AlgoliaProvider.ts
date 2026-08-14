import { SearchProvider, SearchResult, SearchFilters } from './SearchProvider';

export class AlgoliaProvider implements SearchProvider {
  private appId: string;
  private adminKey: string;
  private indexName: string;
  private baseUrl: string;

  constructor() {
    if (!process.env.ALGOLIA_APP_ID || !process.env.ALGOLIA_ADMIN_API_KEY || !process.env.ALGOLIA_INDEX_NAME) {
      throw new Error("Search service is not configured. ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY, and ALGOLIA_INDEX_NAME are required when EXTERNAL_SERVICES_MODE=live");
    }
    this.appId = process.env.ALGOLIA_APP_ID;
    this.adminKey = process.env.ALGOLIA_ADMIN_API_KEY;
    this.indexName = process.env.ALGOLIA_INDEX_NAME;
    this.baseUrl = `https://${this.appId}.algolia.net/1/indexes/${this.indexName}`;
  }

  private get headers() {
    return {
      'X-Algolia-Application-Id': this.appId,
      'X-Algolia-API-Key': this.adminKey,
      'Content-Type': 'application/json'
    };
  }

  async searchProducts(query: string, filters?: SearchFilters, page: number = 1, limit: number = 20): Promise<SearchResult> {
    
    let filterString = '';
    if (filters) {
      const conditions = [];
      if (filters.category) conditions.push(`category:"${filters.category}"`);
      if (filters.brand) conditions.push(`brandId:"${filters.brand}"`);
      if (filters.maxPrice) conditions.push(`price <= ${filters.maxPrice}`);
      filterString = conditions.join(' AND ');
    }

    const requestBody = {
      params: new URLSearchParams({
        query: query,
        filters: filterString,
        page: (page - 1).toString(),
        hitsPerPage: limit.toString()
      }).toString()
    };

    const response = await fetch(`${this.baseUrl}/query`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Algolia search failed: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      hits: data.hits,
      totalHits: data.nbHits,
      page: data.page + 1,
      totalPages: data.nbPages
    };
  }

  async indexProduct(productId: string, data: any): Promise<void> {
    const payload = { ...data, objectID: productId };
    const response = await fetch(`${this.baseUrl}/${productId}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("Failed to index product to Algolia");
  }

  async deleteProduct(productId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${productId}`, {
      method: 'DELETE',
      headers: this.headers
    });
    if (!response.ok) throw new Error("Failed to delete product from Algolia");
  }

  async bulkIndexProducts(products: any[]): Promise<void> {
    const requests = products.map(p => ({
      action: 'updateObject',
      body: { ...p, objectID: p.id }
    }));

    const response = await fetch(`${this.baseUrl}/batch`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ requests })
    });
    if (!response.ok) throw new Error("Failed to bulk index products");
  }
}
