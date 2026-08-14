import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { getPaymentProvider } from '@/services/payment';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, items, contact, shipping, couponCode } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Generate a secure, server-side Order ID for our database
    const orderRef = adminDb.collection('orders').doc();
    const orderId = orderRef.id;
    const readableOrderId = `JPS-${orderId.substring(0, 8).toUpperCase()}`;

    // Calculate totals securely
    let subtotal = 0;
    
    // We must run the inventory deduction in a Firestore Transaction to prevent overselling
    await adminDb.runTransaction(async (transaction) => {
      // 1. Read all variants to ensure they exist and have stock
      const variantDocs = await Promise.all(
        items.map(async (item: any) => {
          // Enforce strict Variant usage
          const sku = item.selectedVariant?.sku;
          if (!sku) {
            throw new Error(`Item ${item.product.name} is missing a selected variant SKU.`);
          }
          
          const variantRef = adminDb.collection('variants').doc(sku);
          const variantSnap = await transaction.get(variantRef);
          
          if (!variantSnap.exists) {
            throw new Error(`Variant ${sku} does not exist.`);
          }
          
          const variantData = variantSnap.data()!;
          if (variantData.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${variantData.color} ${variantData.size}`);
          }
          
          return { ref: variantRef, data: variantData, quantity: item.quantity };
        })
      );

      // 2. Calculate secure subtotal
      for (const v of variantDocs) {
        subtotal += v.data.price * v.quantity;
        
        // 3. Deduct stock transactionally
        transaction.update(v.ref, {
          stock: v.data.stock - v.quantity
        });
      }

      // 4. Secure Coupon Validation
      let discountAmount = 0;
      if (couponCode) {
        const couponRef = adminDb.collection('coupons').doc(couponCode);
        const couponSnap = await transaction.get(couponRef);
        
        if (couponSnap.exists) {
          const couponData = couponSnap.data()!;
          if (couponData.active && new Date() < new Date(couponData.expiryDate)) {
            // Apply percentage discount as an example
            discountAmount = Math.floor(subtotal * couponData.value);
            if (couponData.maximumDiscount) {
              discountAmount = Math.min(discountAmount, couponData.maximumDiscount);
            }
          }
        }
      }

      // 5. Formal GST Architecture (e.g., 5% total tax for fabrics: 2.5% CGST, 2.5% SGST)
      const discountedSubtotal = subtotal - discountAmount;
      const gstRate = 0.05; // 5% GST
      const totalGST = discountedSubtotal * gstRate;
      const cgst = totalGST / 2;
      const sgst = totalGST / 2;
      const shipping = discountedSubtotal > 2000 ? 0 : 150; // Free shipping over 2000
      
      const finalAmount = discountedSubtotal + totalGST + shipping;

      // 6. Create Order Document in pending state
      transaction.set(orderRef, {
        orderId: readableOrderId,
        userId: userId || null,
        contact,
        shipping,
        items, // store requested items snapshot
        subtotal,
        discount: discountAmount,
        taxableAmount: discountedSubtotal,
        gstRate: "5%",
        cgst,
        sgst,
        totalTax: totalGST,
        shippingFee: shipping,
        totalPrice: finalAmount,
        status: 'PAYMENT_PENDING', // Wait for webhook
        createdAt: new Date().toISOString()
      });
    }); // End Transaction

    // Fetch the newly created order to get the final price for the gateway
    const newOrderSnap = await orderRef.get();
    const orderData = newOrderSnap.data()!;

    // 6. Call the Payment Provider (Live or Mock) to get a Gateway Order ID
    const paymentProvider = getPaymentProvider();
    const paymentOrder = await paymentProvider.createOrder(orderData.totalPrice, readableOrderId);

    // 7. Update order with gateway ID
    await orderRef.update({
      paymentGatewayOrderId: paymentOrder.id
    });

    return NextResponse.json({ 
      success: true, 
      orderId: readableOrderId,
      paymentOrderId: paymentOrder.id,
      amount: orderData.totalPrice
    });

  } catch (error: any) {
    console.error('Secure checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
