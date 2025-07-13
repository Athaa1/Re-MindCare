import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost/Re-MindCare/backendPHP/Doctor/list.php');
    const data = await response.json();
    
    if (data.success) {
      return NextResponse.json({
        success: true,
        data: data.data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch doctors'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
