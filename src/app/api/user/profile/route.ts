import { NextRequest, NextResponse } from 'next/server';
import { getUserByPhone, createUser } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const phone = request.nextUrl.searchParams.get('phone') || '';
    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone query required' }, { status: 400 });
    }

    const user = await getUserByPhone(phone);
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = body.phone;
    if (!phone) return NextResponse.json({ success: false, error: 'Phone is required' }, { status: 400 });

    const profile = body.profile || {};
    // Accept address as string or addresses as array
    const normalizedProfile: any = {
      ...profile,
      addresses: profile.addresses ?? (profile.address ? [profile.address] : undefined),
    };
    const user = await createUser(phone, normalizedProfile);
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
