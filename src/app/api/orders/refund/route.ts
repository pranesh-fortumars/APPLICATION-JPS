import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { getPaymentProvider } from '@/services/payment';

export async function POST(req: NextRequest) {
  try {
    const { orderId, reason } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    let refundResult: any;

    await adminDb.runTransaction(async (transaction) => {
      const orderRef = adminDb.collection('orders').doc(orderId);
      const orderSnap = await transaction.get(orderRef);

      if (!orderSnap.exists) {
        throw new Error('Order not found');
      }

      const orderData = orderSnap.data()!;

      if (orderData.status === 'REFUNDED') {
        throw new Error('Order is already refunded');
      }
      
      if (orderData.status !== 'PAID' && orderData.status !== 'DELIVERED') {
         throw new Error(`Cannot refund order in status: ${orderData.status}`);
      }

      const paymentId = orderData.paymentId;
      if (!paymentId) {
        throw new Error('No payment ID associated with this order');
      }

      // 1. Process Refund via Payment Provider
      const paymentProvider = getPaymentProvider();
      refundResult = await paymentProvider.refundPayment(paymentId, orderData.totalPrice);

      if (!refundResult.success) {
        throw new Error('Payment gateway rejected the refund');
      }

      // 2. Restore Inventory
      for (const item of orderData.items || []) {
        const sku = item.sku || `${item.product.id}-${item.selectedColor}-${item.selectedSize}`;
        const variantRef = adminDb.collection('variants').doc(sku);
        const variantSnap = await transaction.get(variantRef);
        
        if (variantSnap.exists) {
          transaction.update(variantRef, {
            stock: variantSnap.data()!.stock + item.quantity
          });
        }
      }

      // 3. Update Order Status
      transaction.update(orderRef, {
        status: 'REFUNDED',
        refundId: refundResult.refundId,
        refundedAt: new Date().toISOString(),
        refundReason: reason || 'Customer Request'
      });
      
      // 4. Audit Log
      const auditRef = adminDb.collection('orderStatusHistory').doc();
      transaction.set(auditRef, {
        orderId: orderId,
        oldStatus: orderData.status,
        newStatus: 'REFUNDED',
        changedBy: 'admin',
        reason: reason || 'Customer Request',
        timestamp: new Date().toISOString(),
        gatewayRefundId: refundResult.refundId
      });
    });

    return NextResponse.json({ success: true, message: 'Order successfully refunded and inventory restored.', refundId: refundResult?.refundId });

  } catch (error: any) {
    console.error('Refund processing error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
