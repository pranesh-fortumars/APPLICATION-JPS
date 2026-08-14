import { SearchProvider } from './SearchProvider';
import { MockSearchProvider } from './MockSearchProvider';
import { AlgoliaProvider } from './AlgoliaProvider';

let searchProviderInstance: SearchProvider | null = null;

export function getSearchProvider(): SearchProvider {
  if (searchProviderInstance) {
    return searchProviderInstance;
  }

  const mode = process.env.EXTERNAL_SERVICES_MODE || 'mock';

  if (mode === 'live') {
    searchProviderInstance = new AlgoliaProvider();
  } else {
    searchProviderInstance = new MockSearchProvider();
  }

  return searchProviderInstance;
}
