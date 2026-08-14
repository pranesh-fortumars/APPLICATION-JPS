import { AIProvider, AIRecommendation } from './AIProvider';
import { adminDb } from '@/lib/firebase/admin';

export class MockAIProvider implements AIProvider {
  async recommendProducts(request: string): Promise<AIRecommendation> {
    console.log(`[MOCK AI] Analyzing request: "${request}"`);
    
    // Simulate natural language parsing
    const normalized = request.toLowerCase();
    
    // Fetch all products to act as our "context window"
    const snapshot = await adminDb.collection('products').get();
    let products = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })) as any[];
    
    // Basic heuristics to filter products based on user intent
    let matchedProducts = products;
    
    // Budget constraint simulation
    const budgetMatch = normalized.match(/under\s*₹?(\d+,?\d*)/);
    if (budgetMatch) {
      const budget = parseInt(budgetMatch[1].replace(/,/g, ''));
      matchedProducts = matchedProducts.filter(p => p.price <= budget);
    }
    
    // Occasion/Category heuristics
    if (normalized.includes('wedding') || normalized.includes('bridal') || normalized.includes('party')) {
      matchedProducts = matchedProducts.filter(p => 
        (p.category || '').toLowerCase().includes('saree') || 
        (p.category || '').toLowerCase().includes('lehenga') ||
        (p.occasion || '').toLowerCase().includes('wedding')
      );
    } else if (normalized.includes('casual') || normalized.includes('summer')) {
      matchedProducts = matchedProducts.filter(p => 
        (p.fabric || '').toLowerCase().includes('cotton') || 
        (p.category || '').toLowerCase().includes('shirt')
      );
    }
    
    // Color heuristics
    const colors = ['black', 'red', 'white', 'blue', 'green', 'yellow'];
    for (const color of colors) {
      if (normalized.includes(color)) {
        matchedProducts = matchedProducts.filter(p => 
          (p.name || '').toLowerCase().includes(color) || 
          (p.description || '').toLowerCase().includes(color)
        );
      }
    }

    // Limit to top 3 recommendations
    const suggestedIds = matchedProducts.slice(0, 3).map(p => p.id);

    return {
      message: `Based on your request, I've analyzed our catalog and found these beautiful options that match your style and budget perfectly.`,
      suggestedProductIds: suggestedIds
    };
  }

  async generateSizeRecommendation(userProfile: any, productData: any): Promise<string> {
    console.log(`[MOCK AI] Generating size recommendation`);
    return "Based on your previous purchases and standard fit preferences, we recommend a size **M**.";
  }
}
