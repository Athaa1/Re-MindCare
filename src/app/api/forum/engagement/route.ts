import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Get current user ID
    const userId = getCurrentUserId();
    
    // Build URL with user_id parameter
    const url = new URL('http://localhost/Re-MindCare/backendPHP/Forum/engagement-stats.php');
    if (userId) {
      url.searchParams.append('user_id', userId.toString());
    }

    // Forward the request to the PHP backend
    const response = await fetch(url.toString(), {
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
      throw new Error(data.message || 'Failed to fetch engagement stats');
    }

    return NextResponse.json({
      success: true,
      post_count: data.post_count || 0,
      reply_count: data.reply_count || 0,
      total_engagement: data.total_engagement || 0
    });

  } catch (error) {
    console.error('Failed to fetch engagement stats:', error);
    return NextResponse.json({
      success: true, // Return success with default values instead of error
      post_count: 0,
      reply_count: 0,
      total_engagement: 0
    });
  }
}
