import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/apiClient';

/**
 * Admin User Update Endpoint
 * PUT /api/admin/users/:id
 *
 * This is a proxy endpoint that forwards admin user updates to the backend
 */
export async function PUT(request, { params }) {
  try {
    // Next.js 15 requires awaiting params
    const { id } = await params;
    const body = await request.json();

    console.log('[Admin API] Update user request:', id, body);

    // Get the auth token from cookies
    const authToken = request.cookies.get('authToken')?.value;

    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Update user via backend API
    // Using PUT /users/:id endpoint (requires admin privileges)
    console.log('[Admin API] Attempting to update user via /users/:id endpoint');

    const updatePayload = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      companyName: body.companyName,
      organizationType: body.organizationType?.toLowerCase(),
      designation: body.designation,
      themes: body.themes,
      role: body.role,
      isActive: body.isActive,
      isEmailVerified: body.isEmailVerified,
      hasAutoApprovePrivilege: body.hasAutoApprovePrivilege,
      isApproved: body.isApproved,
    };

    const response = await apiClient.put(`/users/${id}`, updatePayload, {
      token: authToken
    });

    console.log('[Admin API] Backend response:', response);

    if (response.success) {
      return NextResponse.json({
        success: true,
        data: response.data,
        message: 'User updated successfully'
      }, {
        status: 200
      });
    } else {
      return NextResponse.json({
        success: false,
        message: response.message || 'Failed to update user'
      }, {
        status: 400
      });
    }

  } catch (error) {
    console.error('[Admin API] Error updating user:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update user'
      },
      { status: 500 }
    );
  }
}

/**
 * Get single user details
 * GET /api/admin/users/:id
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const authToken = request.cookies.get('authToken')?.value;

    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const response = await apiClient.get(`/users/${id}`, {
      token: authToken
    });

    return NextResponse.json(response, {
      status: response.success ? 200 : 404
    });

  } catch (error) {
    console.error('[Admin API] Error fetching user:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch user'
      },
      { status: 500 }
    );
  }
}
