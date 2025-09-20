import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = body.phone;
    if (!phone) return NextResponse.json({ success: false, error: 'Phone is required' }, { status: 400 });
    const profile = body.profile || {};
    const user = await createUser(phone, profile);
    // Remove null/undefined fields from user before returning
    const cleaned: any = {};
    Object.keys(user).forEach((k) => {
      const v = (user as any)[k];
      if (v !== null && v !== undefined) cleaned[k] = v;
    });
    return NextResponse.json({ success: true, user: cleaned });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
