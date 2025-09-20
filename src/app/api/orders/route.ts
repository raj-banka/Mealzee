import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrdersByUserId } from '@/lib/db';

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
    if (!body.userId) return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    const order = await createOrder(body);
    return NextResponse.json({ success: true, order });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
