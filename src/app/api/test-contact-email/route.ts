import { NextRequest, NextResponse } from 'next/server';
import { testEmailConfiguration, sendContactNotificationEmail } from '@/lib/email';

export async function GET() {
  try {
    console.log('🧪 Testing contact email configuration...');
    
    // Test email configuration
    const isConfigValid = await testEmailConfiguration();
    
    if (!isConfigValid) {
      return NextResponse.json({
        success: false,
        error: 'Email configuration is invalid'
      }, { status: 500 });
    }

    // Test contact email
    const testContactData = {
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '+91 98765 43210',
      subject: 'Test Contact Message',
      message: 'This is a test contact message to verify the email integration is working properly.',
      referenceId: `TEST-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString()
    };

    console.log('📧 Sending test contact email...');
    const emailSent = await sendContactNotificationEmail(testContactData);

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'Test contact email sent successfully',
        testContactId: testContactData.referenceId,
        adminEmail: process.env.ADMIN_EMAIL || 'mealzeeindia@gmail.com',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to send test contact email'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Test contact email error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test contact email failed'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { contactData } = await request.json();
    
    console.log('🧪 Testing contact email with custom data...');
    
    const emailSent = await sendContactNotificationEmail(contactData);
    
    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'Custom test contact email sent successfully',
        referenceId: contactData.referenceId,
        adminEmail: process.env.ADMIN_EMAIL || 'mealzeeindia@gmail.com',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to send custom test contact email'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Custom test contact email error:', error);
    return NextResponse.json({
      success: false,
      error: 'Custom test contact email failed'
    }, { status: 500 });
  }
}
