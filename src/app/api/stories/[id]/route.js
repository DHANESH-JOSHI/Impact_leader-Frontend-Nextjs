import { NextResponse } from 'next/server';
import { StoriesService } from '@/services/storiesService';
import { verifyToken } from '@/lib/auth';

// Middleware to check authentication
function checkAuth(request) {
  const token = request.cookies.get('authToken');
  
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    verifyToken(token.value);
  } catch {
    throw new Error('Invalid token');
  }
}

export async function GET(request, { params }) {
  try {
    checkAuth(request);

    const { id } = params;
    const result = await StoriesService.getStoryById(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Story GET API error:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Invalid token') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    checkAuth(request);

    const { id } = params;
    const body = await request.json();
    const result = await StoriesService.updateStory(id, body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: result.message
    });
  } catch (error) {
    console.error('Story PUT API error:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Invalid token') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    checkAuth(request);

    const { id } = params;
    const result = await StoriesService.deleteStory(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Story DELETE API error:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Invalid token') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
