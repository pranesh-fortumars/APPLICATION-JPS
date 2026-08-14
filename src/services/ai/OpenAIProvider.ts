import { AIProvider, AIRecommendation } from './AIProvider';

export class OpenAIProvider implements AIProvider {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1/chat/completions';

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("AI service is not configured. OPENAI_API_KEY is required when EXTERNAL_SERVICES_MODE=live");
    }
    this.apiKey = process.env.OPENAI_API_KEY;
  }

  async recommendProducts(request: string): Promise<AIRecommendation> {
    // In a real implementation, we would pass our entire active product catalog (or a subset via vector search)
    // to the OpenAI function calling API so it can pick exact product IDs.
    // For this boilerplate, we'll demonstrate the network call structure.
    
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an AI Fashion Stylist. You must only recommend product IDs provided in the tool context.' },
          { role: 'user', content: request }
        ],
        // function calling would go here
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      message: data.choices[0].message.content || "Here are some recommendations.",
      suggestedProductIds: [] // This would be populated by parsed tool calls
    };
  }

  async generateSizeRecommendation(userProfile: any, productData: any): Promise<string> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an expert tailor. Recommend a size based on measurements.' },
          { role: 'user', content: `User Profile: ${JSON.stringify(userProfile)}, Product: ${JSON.stringify(productData)}` }
        ]
      })
    });

    if (!response.ok) {
      throw new Error("OpenAI size recommendation failed.");
    }

    const data = await response.json();
    return data.choices[0].message.content || "Size M recommended based on standard fit.";
  }
}
