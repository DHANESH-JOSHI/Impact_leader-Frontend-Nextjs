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

export async function GET(request) {
  try {
    checkAuth(request);

    const { searchParams } = new URL(request.url);
    const filters = {
      category: searchParams.get('category'),
      status: searchParams.get('status')
    };

    const result = await StoriesService.getAllStories(filters);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      total: result.total
    });
  } catch (error) {
    console.error('Stories GET API error:', error);
    
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

export async function POST(request) {
  try {
    checkAuth(request);

    const body = await request.json();
    const result = await StoriesService.createStory(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: result.message
    }, { status: 201 });
  } catch (error) {
    console.error('Stories POST API error:', error);
    
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
