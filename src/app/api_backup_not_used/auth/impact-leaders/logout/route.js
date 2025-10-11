import { NextResponse } from 'next/server';
import { ImpactLeadersAuthService } from '@/services/impactLeadersAuthService';

export async function POST(request) {
  try {
    // Call logout on Impact Leaders API
    const result = await ImpactLeadersAuthService.logout();

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear the cookie
    response.cookies.set('impactLeadersToken', '', {
      expires: new Date(0),
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Impact Leaders logout API error:', error);
    
    // Even if logout fails, clear local cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    response.cookies.set('impactLeadersToken', '', {
      expires: new Date(0),
      path: '/'
    });

    return response;
  }
}
