import { NextResponse } from 'next/server';
import { SystemMonitoringService } from '@/services/systemMonitoringService';
import { verifyToken } from '@/lib/auth';
import { withAPITracking } from '@/lib/apiTrackingMiddleware';

async function handler(request) {
  try {
    // Check authentication
    const token = request.cookies.get('authToken');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      verifyToken(token.value);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get API analytics
    const result = await SystemMonitoringService.getAPIAnalytics();

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('System monitoring API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Export wrapped handler
export const GET = withAPITracking(handler);
