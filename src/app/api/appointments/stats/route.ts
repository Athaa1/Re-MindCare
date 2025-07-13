import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost/Re-MindCare/backendPHP/Doctor/appointments-stats.php', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Disable caching for real-time data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch appointment statistics');
    }

    return NextResponse.json({
      success: true,
      data: data.data
    });

  } catch (error) {
    console.error('Error fetching appointment statistics:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}
