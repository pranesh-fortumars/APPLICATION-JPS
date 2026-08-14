import { Metadata } from 'next';
import { adminDb } from '@/lib/firebase/admin';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  
  try {
    const docSnap = await adminDb.collection('products').doc(id).get();
    
    if (!docSnap.exists) {
      return { title: 'Product Not Found' };
    }
    
    const product = docSnap.data();
    
    return {
      title: `${product?.name} | JPS Fabrics`,
      description: product?.description?.substring(0, 160) || 'Premium luxury fabrics by JPS Fabrics.',
      openGraph: {
        title: product?.name,
        description: product?.description?.substring(0, 160),
        images: product?.images?.length ? [product.images[0]] : [],
        type: 'website',
      },
      alternates: {
        canonical: `https://jpsfabrics.com/collections/${id}`,
      }
    };
  } catch (error) {
    return { title: 'JPS Fabrics' };
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
