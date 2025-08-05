import { NextRequest, NextResponse } from 'next/server';
import { sendContactNotificationEmail, ContactData } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { contactData } = await request.json();

    console.log('📧 Contact email notification request received');
    console.log('📧 Reference ID:', contactData.referenceId);
    console.log('📧 Admin email:', process.env.ADMIN_EMAIL || 'mealzeeindia@gmail.com');

    // Send actual email using nodemailer
    const emailSent = await sendContactNotificationEmail(contactData as ContactData);

    if (emailSent) {
      console.log('✅ Contact notification email sent successfully');
      return NextResponse.json({
        success: true,
        method: 'email',
        message: 'Contact notification email sent successfully',
        adminEmail: process.env.ADMIN_EMAIL || 'mealzeeindia@gmail.com',
        referenceId: contactData.referenceId,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('❌ Failed to send contact email notification');
      return NextResponse.json({
        success: false,
        error: 'Failed to send contact email notification'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Contact email notification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send contact email notification'
    }, { status: 500 });
  }
}
