import { NextRequest, NextResponse } from 'next/server';
import { formatContactMessage, ContactData } from '@/lib/whatsapp';

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

      // Format the message for WhatsApp
      const whatsappMessage = formatContactMessage(contactData);
      const adminPhone = '916299367631';

      // Create WhatsApp URL for admin
      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;

      console.log('✅ Contact message formatted for WhatsApp');
      console.log('📱 Admin WhatsApp URL generated');
      console.log('📞 Message will be sent to:', `+91 ${adminPhone}`);
      console.log('📝 Message preview:', whatsappMessage.substring(0, 150) + '...');

      // Log the complete message for admin reference
      console.log('📱 Complete WhatsApp message for admin:');
      console.log('=====================================');
      console.log(whatsappMessage);
      console.log('=====================================');

      return NextResponse.json({
        success: true,
        message: 'Contact message processed and ready for WhatsApp',
        method: 'WhatsApp Direct URL',
        whatsappNumber: '+91 6299367631',
        whatsappUrl: whatsappUrl,
        whatsappMessage: whatsappMessage,
        referenceId: contactData.referenceId,
        adminNotification: {
          phone: '+91 6299367631',
          messagePreview: whatsappMessage.substring(0, 100) + '...',
          timestamp: new Date().toISOString(),
          status: 'Message ready for delivery'
        }
      });
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
