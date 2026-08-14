import { MetadataRoute } from 'next';
import { adminDb } from '@/lib/firebase/admin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://jpsfabrics.com';
  
  // Static Routes
  const staticRoutes = [
    '',
    '/collections',
    '/about',
    '/contact',
    '/faq',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic Product Routes
  try {
    const productsSnap = await adminDb.collection('products').get();
    const productRoutes = productsSnap.docs.map((doc) => ({
      url: `${baseUrl}/collections/${doc.id}`,
      lastModified: new Date(doc.data().createdAt || new Date()),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
    
    return [...staticRoutes, ...productRoutes];
  } catch (error) {
    return staticRoutes;
  }
}
