import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { getPaymentProvider } from '@/services/payment';

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-razorpay-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const payloadText = await req.text();
    let payload;
    try {
      payload = JSON.parse(payloadText);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // 1. Verify Signature using our Provider Adapter
    const paymentProvider = getPaymentProvider();
    
    let webhookResult;
    try {
      // In Live mode, this verifies the cryptographic signature
      webhookResult = await paymentProvider.processWebhook(payloadText, signature);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!webhookResult.success) {
      return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 });
    }

    const eventName = webhookResult.event;
    
    // We expect Razorpay to send `payment.captured` or `order.paid`
    // In our Mock Provider, it defaults to `payment.captured`
    if (eventName === 'payment.captured' || eventName === 'order.paid') {
      
      const paymentData = webhookResult.data;
      const gatewayOrderId = paymentData?.order_id || payload.payload?.payment?.entity?.order_id;
      
      if (!gatewayOrderId) {
        return NextResponse.json({ error: 'No order_id in payload' }, { status: 400 });
      }

      // 2. Find the pending order in our database
      const ordersSnap = await adminDb.collection('orders')
        .where('paymentGatewayOrderId', '==', gatewayOrderId)
        .limit(1)
        .get();

      if (ordersSnap.empty) {
        // If order doesn't exist, we must still return 200 so the gateway doesn't infinitely retry
        console.warn(`Webhook received for unknown gateway order ID: ${gatewayOrderId}`);
        return NextResponse.json({ success: true, warning: 'Order not found' });
      }

      const orderDoc = ordersSnap.docs[0];
      const orderData = orderDoc.data();

      // 3. Idempotency Check & State Machine Enforcement
      if (orderData.status !== 'PAYMENT_PENDING') {
        console.log(`Order ${orderDoc.id} already processed. Current status: ${orderData.status}`);
        return NextResponse.json({ success: true, note: 'Already processed' });
      }

      // 4. Update the order status to PAID
      await orderDoc.ref.update({
        status: 'PAID',
        paidAt: new Date().toISOString(),
        paymentId: paymentData?.id || 'mock_payment_id'
      });
      
      // 5. Create an Audit Log for the transition
      await adminDb.collection('orderStatusHistory').add({
        orderId: orderDoc.id,
        oldStatus: 'PAYMENT_PENDING',
        newStatus: 'PAID',
        changedBy: 'system-webhook',
        reason: 'Payment captured successfully',
        timestamp: new Date().toISOString()
      });

      console.log(`Order ${orderDoc.id} successfully marked as PAID`);
    }

    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
