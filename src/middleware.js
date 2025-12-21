import { NextResponse } from 'next/server';

/**
 * Verify Impact Leaders authentication token
 * @param {string} token - JWT token to verify
 * @returns {Promise<{valid: boolean, isAdmin: boolean, user: object|null}>}
 */
async function verifyImpactLeadersToken(token) {
  if (!token) {
    return { valid: false, isAdmin: false, user: null };
  }

  let timeoutId;
  try {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    const apiUrl = `${backendUrl}/api/v1/auth/me`;
    
    // Create AbortController for timeout (Edge Runtime compatible)
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return { valid: false, isAdmin: false, user: null };
    }
    
    const userData = await response.json();
    const user = userData.data || userData.user || userData;
    
    // Check if user has admin privileges
    const isAdmin = 
      user.role === 'admin' || 
      user.role === 'super-admin' || 
      user.isAdmin === true ||
      (user.permissions && Array.isArray(user.permissions) && user.permissions.includes('admin_access'));
    
    return { valid: true, isAdmin, user };
  } catch (error) {
    // Clear timeout if still pending
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // Silently fail in production, log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Middleware] Token verification error:', error.message);
    }
    return { valid: false, isAdmin: false, user: null };
  }
}

/**
 * Next.js middleware to protect routes
 * @param {Request} request - Incoming request
 * @returns {NextResponse} Response with redirect or next
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/_vercel') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Handle login page
  if (pathname === '/') {
    const token = request.cookies.get('impactLeadersToken')?.value;

    // If authenticated and trying to access login page, redirect to dashboard
    if (token) {
      const { valid, isAdmin } = await verifyImpactLeadersToken(token);
      if (valid && isAdmin) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      // Invalid token, clear cookie and allow login
      const response = NextResponse.next();
      response.cookies.delete('impactLeadersToken');
      return response;
    }
    
    return NextResponse.next();
  }

  // Protect all dashboard routes - only for admin users
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('impactLeadersToken')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/?error=login_required', request.url));
    }

    const { valid, isAdmin, user } = await verifyImpactLeadersToken(token);

    if (!valid) {
      // Clear invalid token and redirect to login
      const response = NextResponse.redirect(new URL('/?error=session_expired', request.url));
      response.cookies.delete('impactLeadersToken');
      return response;
    }

    if (!isAdmin) {
      // User is valid but not admin
      return NextResponse.redirect(new URL('/?error=access_denied', request.url));
    }

    // Valid admin user, allow access
    return NextResponse.next();
  }

  // Allow all other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)).*)',
  ],
};
