import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrdersByUserId } from '@/lib/db';
import { sendOrderNotificationEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    let orders;
    if (userId) {
      orders = await getOrdersByUserId(userId);
    } else {
      // No userId provided: return all orders (for admin/debug). Frontend should pass userId.
      const { listAllOrders } = await import('@/lib/db');
      orders = await listAllOrders();
    }
    return NextResponse.json({ success: true, orders });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📦 /api/orders POST received with body:', JSON.stringify(body));
    if (!body.userId) return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });

    // Verify user exists and keep it for later fallbacks when building email data
    let user: any = null;
    try {
      const db = await import('@/lib/db');
      const { getUserById, createUser } = db;
      if (body.userId) user = await getUserById(body.userId);

      // If user does not exist but phone is provided, create a minimal user record
      if (!user && body.phone) {
        try {
          console.log('ℹ️ User not found, creating new user with phone from order payload');
          const newUser = await createUser(String(body.phone), { name: body.customerName || 'Customer' });
          body.userId = newUser.id;
          user = newUser as any;
        } catch (err) {
          console.warn('⚠️ Failed to auto-create user for order:', err);
        }
      }

      if (!user && body.userId) {
        // If userId was supplied but still not found after attempted auto-create, return a clear error
        return NextResponse.json({ success: false, error: 'User not found for provided userId' }, { status: 400 });
      }

    } catch (err) {
      // If db helpers fail unexpectedly, log and continue — createOrder will surface errors
      console.warn('Warning: user existence check failed, continuing to create order:', err);
    }

    const order = await createOrder(body);

    // Attempt to notify admin by email synchronously to avoid serverless termination
    try {
      const items = Array.isArray(order.items) ? order.items : (order.items ? JSON.parse(JSON.stringify(order.items)) : []);
      const first = items && items.length > 0 ? items[0] : null;

      const derivedOrderType = first && first.plan ? 'meal-plan' : (first && first.dish ? 'individual-dish' : (order as any).orderType || body.orderType || 'unknown');

      const mailData = {
        orderId: order.id,
        customerName: (order as any).customerName || (body.customerName as string) || user?.name || 'Customer',
        customerPhone: (order as any).customerPhone || (body.phone as string) || user?.phone || '',
        address: order.deliveryAddress?.address || body.deliveryAddress?.address || (user?.addresses && user.addresses[0]) || '',
        orderType: derivedOrderType,
        timestamp: order.createdAt || new Date().toISOString(),
        totalAmount: order.total ?? body.total ?? 0,
        preferences: order.specialInstructions ?? body.specialInstructions ?? body.preferences ?? user?.preferences ?? '',
        dob: (order as any).dob || body.dob || user?.dob || '',
        dietaryPreference: (order as any).dietaryPreference || body.dietaryPreference || user?.dietaryPreference || 'vegetarian',
        mealPlan: first && first.plan ? {
          title: first.plan.title,
          duration: first.plan.duration,
          price: first.plan.discountedPrice ?? first.plan.price ?? 0,
        } : undefined,
        dish: first && (first.dish || first.name || first.price) ? {
          name: first.dish?.name || first.name,
          price: first.dish?.price ?? first.price ?? 0,
          quantity: first.qty ?? first.dish?.quantity ?? 1,
          description: first.dish?.description || first.description || '',
          isVeg: first.dish?.isVeg ?? first.isVeg,
        } : undefined,
      };

      const mailCopy = JSON.parse(JSON.stringify(mailData));
      console.log('📧 Preparing to send email for order (from persisted order):', { orderId: mailCopy.orderId, customerName: mailCopy.customerName, totalAmount: mailCopy.totalAmount, timestamp: mailCopy.timestamp });

      // Retry send up to 3 times with small backoff
      let emailSent = false;
      let attempts = 0;
      let lastErr: any = null;
      while (!emailSent && attempts < 3) {
        attempts++;
        try {
          emailSent = await sendOrderNotificationEmail(mailCopy as any);
          console.log(`📧 Attempt ${attempts} sendOrderNotificationEmail result:`, emailSent);
          if (!emailSent) {
            lastErr = 'sendOrderNotificationEmail returned false';
          }
        } catch (err) {
          lastErr = err;
          console.error(`❌ Attempt ${attempts} to send email failed:`, err);
        }
        if (!emailSent) await new Promise(r => setTimeout(r, 800 * attempts));
      }

      // Persist email job result locally for later inspection/retry
      try {
        const { pushEmailJob } = await import('@/lib/emailQueue');
        await pushEmailJob({
          orderId: mailCopy.orderId,
          customerName: mailCopy.customerName,
          totalAmount: mailCopy.totalAmount,
          attempts,
          success: emailSent,
          error: emailSent ? null : String(lastErr),
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.warn('⚠️ Failed to persist email job result:', err);
      }
    } catch (err) {
      console.error('❌ Failed to send admin notification after order creation:', err);
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error('❌ /api/orders POST error:', err);
    const message = (err as Error)?.message || 'Unknown server error';
    const stack = (err as any)?.stack || undefined;
    return NextResponse.json({ success: false, error: message, stack }, { status: 500 });
  }
}
