import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export async function GET(request, { params }) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'GET');
}

export async function POST(request, { params }) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'POST');
}

export async function PUT(request, { params }) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'PUT');
}

export async function PATCH(request, { params }) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'PATCH');
}

export async function DELETE(request, { params }) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'DELETE');
}

async function handleRequest(request, params, method) {
  try {
    const path = params.path.join('/');
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    const queryString = searchParams ? `?${searchParams}` : '';

    const backendUrl = `${BACKEND_URL}/api/v1/${path}${queryString}`;

    let body = null;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        const contentType = request.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          body = await request.json();
        } else if (contentType?.includes('multipart/form-data')) {
          body = await request.formData();
        } else {
          body = await request.text();
        }
      } catch (error) {
        // No body or error reading body
        body = null;
      }
    }

    // Get headers from request
    const headers = {
      'Content-Type': request.headers.get('content-type') || 'application/json',
    };

    // Forward authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Forward other important headers
    const forwardedHeaders = ['x-requested-with', 'x-forwarded-for', 'user-agent'];
    forwardedHeaders.forEach((headerName) => {
      const headerValue = request.headers.get(headerName);
      if (headerValue) {
        headers[headerName] = headerValue;
      }
    });

    // Make request to backend
    const fetchOptions = {
      method,
      headers,
    };

    if (body) {
      if (body instanceof FormData) {
        // Don't set Content-Type for FormData, browser will set it with boundary
        delete headers['Content-Type'];
        fetchOptions.body = body;
      } else if (typeof body === 'string') {
        fetchOptions.body = body;
      } else {
        fetchOptions.body = JSON.stringify(body);
      }
    }

    const response = await fetch(backendUrl, fetchOptions);

    // Get response data
    const contentType = response.headers.get('content-type');
    let responseData;

    if (contentType?.includes('application/json')) {
      responseData = await response.json();
    } else if (contentType?.includes('text/')) {
      responseData = await response.text();
    } else {
      responseData = await response.arrayBuffer();
    }

    // Create response with same status and headers
    const nextResponse = NextResponse.json(responseData, {
      status: response.status,
      statusText: response.statusText,
    });

    // Forward important response headers
    const responseHeadersToForward = [
      'content-type',
      'content-disposition',
      'cache-control',
      'etag',
    ];

    responseHeadersToForward.forEach((headerName) => {
      const headerValue = response.headers.get(headerName);
      if (headerValue) {
        nextResponse.headers.set(headerName, headerValue);
      }
    });

    return nextResponse;
  } catch (error) {
    const pathStr = Array.isArray(params?.path) ? params.path.join('/') : 'unknown';
    console.error('[Proxy Error]', method, pathStr, error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Proxy request failed',
        error: 'PROXY_ERROR',
      },
      { status: 500 }
    );
  }
}

