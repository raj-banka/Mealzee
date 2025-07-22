import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { orderData, message, adminPhone } = await request.json();

    console.log('📱 WhatsApp Business API request received');
    console.log('📱 Admin phone:', adminPhone);
    console.log('📱 Order ID:', orderData.orderId);

    // Check if WhatsApp Business API credentials are configured
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    
    if (!accessToken || !phoneNumberId) {
      console.log('📱 WhatsApp Business API credentials not configured');
      return NextResponse.json({
        success: false,
        error: 'WhatsApp Business API not configured',
        instructions: [
          'Add WHATSAPP_ACCESS_TOKEN to .env.local',
          'Add WHATSAPP_PHONE_NUMBER_ID to .env.local',
          'Get credentials from Meta Developer Console'
        ]
      }, { status: 400 });
    }

    console.log('📱 Sending via WhatsApp Business API...');

    // WhatsApp Business API endpoint
    const whatsappApiUrl = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;

    const response = await fetch(whatsappApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: adminPhone,
        type: 'text',
        text: {
          body: message
        }
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ WhatsApp Business API: Message sent successfully!');
      console.log('📱 Message ID:', result.messages?.[0]?.id);
      
      return NextResponse.json({
        success: true,
        method: 'whatsapp_business_api',
        message: 'Order sent via WhatsApp Business API',
        messageId: result.messages?.[0]?.id,
        adminPhone: adminPhone,
        orderId: orderData.orderId,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('❌ WhatsApp Business API error:', result);
      return NextResponse.json({
        success: false,
        error: 'WhatsApp Business API failed',
        details: result
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ WhatsApp Business API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send via WhatsApp Business API'
    }, { status: 500 });
  }
}
