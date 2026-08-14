import { AIProvider } from './AIProvider';
import { MockAIProvider } from './MockAIProvider';
import { OpenAIProvider } from './OpenAIProvider';

let aiProviderInstance: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (aiProviderInstance) {
    return aiProviderInstance;
  }

  const mode = process.env.EXTERNAL_SERVICES_MODE || 'mock';

  if (mode === 'live') {
    aiProviderInstance = new OpenAIProvider();
  } else {
    aiProviderInstance = new MockAIProvider();
  }

  return aiProviderInstance;
}
