export interface SearchResult {
  hits: any[];
  totalHits: number;
  page: number;
  totalPages: number;
}

export interface SearchFilters {
  category?: string;
  brand?: string;
  color?: string;
  size?: string;
  maxPrice?: number;
}

export interface SearchProvider {
  /**
   * Search for products matching a query and optional filters.
   */
  searchProducts(query: string, filters?: SearchFilters, page?: number, limit?: number): Promise<SearchResult>;
  
  /**
   * Index a single product into the search engine.
   */
  indexProduct(productId: string, data: any): Promise<void>;
  
  /**
   * Remove a product from the search index.
   */
  deleteProduct(productId: string): Promise<void>;
  
  /**
   * Bulk index multiple products at once.
   */
  bulkIndexProducts(products: any[]): Promise<void>;
}
