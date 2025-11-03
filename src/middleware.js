import { NextResponse } from 'next/server';

// Helper function to verify Impact Leaders token
async function verifyImpactLeadersToken(token) {
  try {
    console.log('🔍 Middleware: Verifying token...', token.substring(0, 20) + '...');
    
    // Since we can't verify external JWT without the secret, 
    // we'll make a simple request to check if token is valid
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://13.60.221.160'}/api/v1/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('🌐 Middleware: API response status:', response.status);
    
    if (response.ok) {
      const userData = await response.json();
      console.log('👤 Middleware: User data received:', JSON.stringify(userData, null, 2));
      
      // Check if user has admin privileges
      const user = userData.data || userData.user || userData;
      console.log('🔍 Middleware: Extracted user:', JSON.stringify(user, null, 2));
      
      const isAdmin = user.role === 'admin' || 
                     user.role === 'super-admin' || 
                     user.isAdmin === true ||
                     (user.permissions && user.permissions.includes('admin_access'));
      
      console.log('🔒 Middleware: Admin check result:', isAdmin, 'Role:', user.role);
      
      return { valid: true, isAdmin, user };
    }
    
    console.log('❌ Middleware: API response not ok');
    return { valid: false, isAdmin: false, user: null };
  } catch (error) {
    console.error('❌ Middleware: Token verification error:', error);
    return { valid: false, isAdmin: false, user: null };
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes (except protected ones)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  // Temporarily disable middleware for debugging - remove this later
  console.log('🔧 Middleware: Temporarily disabled for debugging');
  return NextResponse.next();

  // Allow access to login page
  if (pathname === '/') {
    const token = request.cookies.get('impactLeadersToken');

    // If authenticated and trying to access login page, redirect to dashboard
    if (token) {
      const { valid, isAdmin } = await verifyImpactLeadersToken(token.value);
      if (valid && isAdmin) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } else {
        // Invalid token or not admin, clear cookie and allow login
        const response = NextResponse.next();
        response.cookies.delete('impactLeadersToken');
        return response;
      }
    }
    return NextResponse.next();
  }

  // Protect all dashboard routes - only for admin users
  if (pathname.startsWith('/dashboard')) {
    console.log('🛡️ Middleware: Protecting dashboard route:', pathname);

    const token = request.cookies.get('impactLeadersToken');
    console.log('🍪 Middleware: Token from cookie:', token ? 'Present' : 'Missing');

    if (!token) {
      console.log('❌ Middleware: No token, redirecting to login_required');
      return NextResponse.redirect(new URL('/?error=login_required', request.url));
    }

    const { valid, isAdmin, user } = await verifyImpactLeadersToken(token.value);

    console.log('📝 Middleware: Verification result - Valid:', valid, 'IsAdmin:', isAdmin);

    if (!valid) {
      // Clear invalid token and redirect to login
      console.log('❌ Middleware: Invalid token, redirecting to session_expired');
      const response = NextResponse.redirect(new URL('/?error=session_expired', request.url));
      response.cookies.delete('impactLeadersToken');
      return response;
    }

    if (!isAdmin) {
      // User is valid but not admin
      console.log('❌ Middleware: Valid user but not admin, redirecting to access_denied');
      console.log('👤 Middleware: User role was:', user?.role);
      const response = NextResponse.redirect(new URL('/?error=access_denied', request.url));
      return response;
    }

    // Valid admin user, allow access
    console.log('✅ Middleware: Valid admin user, allowing access');
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
