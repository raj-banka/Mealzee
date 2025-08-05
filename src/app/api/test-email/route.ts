import { NextRequest, NextResponse } from 'next/server';
import { testEmailConfiguration, sendOrderNotificationEmail } from '@/lib/email';

export async function GET() {
  try {
    console.log('🧪 Testing email configuration...');
    
    // Test email configuration
    const isConfigValid = await testEmailConfiguration();
    
    if (!isConfigValid) {
      return NextResponse.json({
        success: false,
        error: 'Email configuration is invalid'
      }, { status: 500 });
    }

    // Test both meal plan and individual dish orders
    const testOrderType = Math.random() > 0.5 ? 'meal-plan' : 'individual-dish';

    const testOrderData = {
      orderId: 'TEST-' + Date.now(),
      customerName: 'Test Customer',
      customerPhone: '9876543210',
      customerEmail: 'rajbanka80@gmail.com',
      address: 'Sector 4, Bokaro Steel City, Jharkhand',
      orderType: testOrderType,
      startDate: testOrderType === 'meal-plan' ? new Date().toLocaleDateString('en-IN') : undefined,
      preferences: 'No spicy food',
      timestamp: new Date().toISOString(),
      totalAmount: testOrderType === 'meal-plan' ? 2999 : 299,
      // Additional fields to match template
      dob: '1990-01-01',
      dietaryPreference: 'non-vegetarian' as const,
      referralCode: 'MEAL123',
      referralName: 'Test Referrer',
      // Meal plan data
      ...(testOrderType === 'meal-plan' && {
        mealPlan: {
          title: 'Premium Lunch Plan',
          duration: '1 Month',
          price: 2999,
          originalPrice: 3999
        }
      }),
      // Individual dish data
      ...(testOrderType === 'individual-dish' && {
        dish: {
          name: 'Crispy Chicken Wings',
          price: 299,
          description: 'Juicy wings tossed in our signature spicy glaze, served with cooling ranch dip',
          spiceLevel: 'Hot',
          calories: 450,
          rating: 4.8,
          preparationTime: '15 mins',
          isVeg: false
        }
      })
    };

    const emailSent = await sendOrderNotificationEmail(testOrderData);

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        testOrderId: testOrderData.orderId,
        adminEmail: process.env.ADMIN_EMAIL || 'mealzeeindia@gmail.com',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to send test email'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Test email error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test email failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { orderData } = await request.json();
    
    console.log('🧪 Testing email with custom order data...');
    
    const emailSent = await sendOrderNotificationEmail(orderData);
    
    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'Custom test email sent successfully',
        orderId: orderData.orderId,
        adminEmail: process.env.ADMIN_EMAIL || 'mealzeeindia@gmail.com',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to send custom test email'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Custom test email error:', error);
    return NextResponse.json({
      success: false,
      error: 'Custom test email failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
