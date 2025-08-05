import { NextRequest, NextResponse } from 'next/server';
import { sendOrderNotificationEmail, OrderData } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { orderData } = await request.json();

    console.log('📧 Email notification request received');
    console.log('📧 Order ID:', orderData.orderId);
    console.log('📧 Admin email:', process.env.ADMIN_EMAIL || 'mealzeeindia@gmail.com');

    // Send actual email using nodemailer
    const emailSent = await sendOrderNotificationEmail(orderData as OrderData);

    if (emailSent) {
      console.log('✅ Order notification email sent successfully');
      return NextResponse.json({
        success: true,
        method: 'email',
        message: 'Order notification email sent successfully',
        adminEmail: process.env.ADMIN_EMAIL || 'mealzeeindia@gmail.com',
        orderId: orderData.orderId,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('❌ Failed to send email notification');
      return NextResponse.json({
        success: false,
        error: 'Failed to send email notification'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Email notification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send email notification'
    }, { status: 500 });
  }
}
