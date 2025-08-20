import { NextRequest, NextResponse } from 'next/server';
import { sendReviewNotificationEmail, ReviewData } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerEmail, rating, review } = body;

    // Validate required fields
    if (!customerName || !rating) {
      return NextResponse.json(
        { error: 'Customer name and rating are required' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Generate unique review ID
    const reviewId = `REV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Prepare review data
    const reviewData: ReviewData = {
      customerName,
      customerPhone: customerPhone || undefined,
      customerEmail: customerEmail || undefined,
      rating,
      review: review || '',
      reviewId,
      timestamp: new Date().toISOString()
    };

    // Send email notification to admin
    const emailSent = await sendReviewNotificationEmail(reviewData);

    if (!emailSent) {
      console.error('Failed to send review notification email');
      // Don't fail the request if email fails, just log it
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      reviewId,
      emailSent
    });

  } catch (error) {
    console.error('Error processing review submission:', error);
    return NextResponse.json(
      { error: 'Failed to submit review. Please try again.' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}