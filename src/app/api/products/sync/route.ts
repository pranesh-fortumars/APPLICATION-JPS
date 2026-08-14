import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { getSearchProvider } from '@/services/search';

export async function POST(req: NextRequest) {
  try {
    const { action, productId } = await req.json();

    if (!action || !productId) {
      return NextResponse.json({ error: 'Action and Product ID are required' }, { status: 400 });
    }

    const searchProvider = getSearchProvider();

    if (action === 'delete') {
      await searchProvider.deleteProduct(productId);
      return NextResponse.json({ success: true, message: `Product ${productId} deleted from search index.` });
    }

    // For index/update, fetch the latest data from Firestore
    const productSnap = await adminDb.collection('products').doc(productId).get();
    
    if (!productSnap.exists) {
      return NextResponse.json({ error: 'Product not found in database' }, { status: 404 });
    }

    const productData = productSnap.data()!;
    
    // Format the payload to ensure sensitive data (like margins) isn't indexed
    const indexPayload = {
      id: productId,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category: productData.category,
      brandId: productData.brandId,
      imageUrl: productData.images?.[0] || null,
      availability: productData.availability,
      colors: productData.colors || [],
    };

    await searchProvider.indexProduct(productId, indexPayload);

    return NextResponse.json({ success: true, message: `Product ${productId} synced to search index.` });
  } catch (error: any) {
    console.error('Search sync error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
