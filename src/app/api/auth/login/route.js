import { NextResponse } from 'next/server';
import { AuthService } from '@/services/authService';
import { withAPITracking } from '@/lib/apiTrackingMiddleware';

async function handler(request) {
  try {
    console.log('here')
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await AuthService.login(email, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 }
      );
    }

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: result.user,
      message: 'Login successful'
    });

    response.cookies.set('authToken', result.token, {
      httpOnly: false, // Allow client-side access for now
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Export wrapped handler
export const POST = withAPITracking(handler);
