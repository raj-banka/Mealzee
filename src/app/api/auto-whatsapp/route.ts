import { NextRequest, NextResponse } from 'next/server';
import { sendContactToWhatsApp, ContactData } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();

    console.log('📱 Auto WhatsApp request received:', { type });

    if (type === 'contact') {
      // Handle contact form submission
      const contactData: ContactData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        referenceId: data.referenceId
      };

      console.log('📞 Processing contact form submission:', contactData.name);

      // Send to WhatsApp using the standardized service
      const success = sendContactToWhatsApp(contactData);

      if (success) {
        console.log('✅ Contact message sent to WhatsApp successfully');
        return NextResponse.json({
          success: true,
          message: 'Contact message sent to admin WhatsApp',
          method: 'WhatsApp Web API',
          whatsappNumber: '+91 6299367631',
          referenceId: contactData.referenceId
        });
      } else {
        console.warn('⚠️ Failed to send contact message to WhatsApp');
        return NextResponse.json({
          success: false,
          error: 'Failed to send message to WhatsApp'
        }, { status: 500 });
      }
    }

    // Handle other types (orders, etc.) in the future
    return NextResponse.json({
      success: false,
      error: 'Unsupported message type'
    }, { status: 400 });

  } catch (error) {
    console.error('❌ Auto WhatsApp API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
