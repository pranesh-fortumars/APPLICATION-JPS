export interface AIRecommendation {
  message: string;
  suggestedProductIds: string[];
}

export interface AIProvider {
  /**
   * Recommends products based on a natural language fashion request.
   */
  recommendProducts(request: string): Promise<AIRecommendation>;
  
  /**
   * Generates a size recommendation based on user measurements and product fit.
   */
  generateSizeRecommendation(userProfile: any, productData: any): Promise<string>;
}
