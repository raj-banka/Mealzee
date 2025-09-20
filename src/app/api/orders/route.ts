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

    // Verify user exists when using Prisma to avoid foreign key errors
    try {
      const db = await import('@/lib/db');
      const { getUserById, createUser } = db;
      let user = null;
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

    // Attempt to notify admin by email (best-effort, do not block response on failure)
    (async () => {
      try {
        const mailData = {
          orderId: order.id,
          customerName: (body.customerName as string) || 'Customer',
          customerPhone: (body.phone as string) || '',
          address: order.deliveryAddress?.address || body.deliveryAddress?.address || '',
          orderType: body.orderType || 'unknown',
          timestamp: new Date().toISOString(),
          totalAmount: order.total ?? body.total ?? 0,
          preferences: body.specialInstructions || body.preferences || '',
          dob: body.dob || '',
          dietaryPreference: body.dietaryPreference || 'vegetarian',
          mealPlan: body.items && body.items[0] && body.items[0].plan ? {
            title: body.items[0].plan.title,
            duration: body.items[0].plan.duration,
            price: body.items[0].plan.discountedPrice || body.items[0].plan.price || 0,
          } : undefined,
          dish: body.items && body.items[0] && body.items[0].dish ? {
            name: body.items[0].dish.name,
            price: body.items[0].dish.price,
            quantity: body.items[0].qty || body.items[0].dish.quantity || 1,
            description: body.items[0].dish.description,
            isVeg: body.items[0].dish.isVeg,
          } : undefined,
        };

        const emailSent = await sendOrderNotificationEmail(mailData as any);
        console.log('📧 sendOrderNotificationEmail result:', emailSent);
      } catch (err) {
        console.error('❌ Failed to send admin notification after order creation:', err);
      }
    })();

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error('❌ /api/orders POST error:', err);
    const message = (err as Error)?.message || 'Unknown server error';
    const stack = (err as any)?.stack || undefined;
    return NextResponse.json({ success: false, error: message, stack }, { status: 500 });
  }
}
