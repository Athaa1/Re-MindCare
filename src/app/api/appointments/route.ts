import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'user_id parameter required'
      }, { status: 400 });
    }
    
    // Forward request to PHP backend
    const response = await fetch(`http://localhost/Re-MindCare/backendPHP/Appointments/list.php?user_id=${userId}`);
    const data = await response.json();
    
    if (data.success) {
      return NextResponse.json({
        success: true,
        data: data.data,
        count: data.count
      });
    } else {
      return NextResponse.json({
        success: false,
        message: data.message || 'Failed to fetch appointments'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
