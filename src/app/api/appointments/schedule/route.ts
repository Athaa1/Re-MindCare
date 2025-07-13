import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward request to PHP backend
    const response = await fetch('http://localhost/Re-MindCare/backendPHP/Appointments/schedule.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    
    if (data.success) {
      return NextResponse.json({
        success: true,
        message: data.message,
        data: data.data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: data.message || 'Failed to schedule appointment'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error scheduling appointment:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
