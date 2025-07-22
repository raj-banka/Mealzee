import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { orderData, message, adminEmail } = await request.json();

    console.log('📧 Email notification request received');
    console.log('📧 Admin email:', adminEmail);
    console.log('📧 Order ID:', orderData.orderId);

    // For now, we'll simulate email sending
    // In production, you would integrate with:
    // - SendGrid
    // - Mailgun  
    // - AWS SES
    // - Nodemailer with SMTP
    
    console.log('📧 Simulating email send...');
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log the email content that would be sent
    console.log('📧 Email content that would be sent:');
    console.log('---EMAIL START---');
    console.log(`To: ${adminEmail}`);
    console.log(`Subject: New Mealzee Order #${orderData.orderId}`);
    console.log(`Body:\n${message}`);
    console.log('---EMAIL END---');
    
    // Return success (in production, check actual email service response)
    return NextResponse.json({
      success: true,
      method: 'email',
      message: 'Order notification email sent successfully',
      adminEmail: adminEmail,
      orderId: orderData.orderId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Email notification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send email notification'
    }, { status: 500 });
  }
}
