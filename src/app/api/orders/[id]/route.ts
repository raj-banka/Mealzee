import { NextResponse } from 'next/server';
import { getOrderById, updateOrder } from '@/lib/db';

export async function GET(request: Request, { params }: any) {
  try {
    const id: string = params?.id;
    const order = await getOrderById(id);
    if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ success: true, order });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: any) {
  try {
    const id: string = params?.id;
    const body = await (request as Request).json();
    const updated = await updateOrder(id, body);
    if (!updated) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ success: true, order: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
