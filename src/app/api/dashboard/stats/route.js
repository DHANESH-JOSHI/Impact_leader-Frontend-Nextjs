import { NextResponse } from 'next/server';
import { DashboardService } from '@/services/dashboardService';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    // Get token from cookie
    const token = request.cookies.get('authToken');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authen  tication required' },
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

    const result = await DashboardService.getStats();

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
    console.error('Dashboard stats API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
