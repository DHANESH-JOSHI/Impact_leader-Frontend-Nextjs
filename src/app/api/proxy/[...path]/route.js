import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://103.241.227.37';

export async function GET(request, { params }) {
  try {
    const path = params.path.join('/');
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/${path}${queryString ? `?${queryString}` : ''}`;

    const headers = new Headers();
    // Forward relevant headers
    const authHeader = request.headers.get('authorization');
    if (authHeader) headers.set('Authorization', authHeader);

    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) headers.set('Cookie', cookieHeader);

    headers.set('Content-Type', 'application/json');

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from API', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const path = params.path.join('/');
    const url = `${API_BASE_URL}/${path}`;
    const body = await request.text();

    const headers = new Headers();
    // Forward relevant headers
    const authHeader = request.headers.get('authorization');
    if (authHeader) headers.set('Authorization', authHeader);

    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) headers.set('Cookie', cookieHeader);

    headers.set('Content-Type', 'application/json');

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    const data = await response.json();

    // Forward response headers (like Set-Cookie)
    const responseHeaders = new Headers();
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      responseHeaders.set('Set-Cookie', setCookie);
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: responseHeaders
    });
  } catch (error) {
    console.error('Proxy POST error:', error);
    return NextResponse.json(
      { error: 'Failed to post to API', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const path = params.path.join('/');
    const url = `${API_BASE_URL}/${path}`;
    const body = await request.text();

    const headers = new Headers();
    const authHeader = request.headers.get('authorization');
    if (authHeader) headers.set('Authorization', authHeader);

    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) headers.set('Cookie', cookieHeader);

    headers.set('Content-Type', 'application/json');

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to put to API', details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const path = params.path.join('/');
    const url = `${API_BASE_URL}/${path}`;
    const body = await request.text();

    const headers = new Headers();
    const authHeader = request.headers.get('authorization');
    if (authHeader) headers.set('Authorization', authHeader);

    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) headers.set('Cookie', cookieHeader);

    headers.set('Content-Type', 'application/json');

    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to patch to API', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const path = params.path.join('/');
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/${path}${queryString ? `?${queryString}` : ''}`;

    const headers = new Headers();
    const authHeader = request.headers.get('authorization');
    if (authHeader) headers.set('Authorization', authHeader);

    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) headers.set('Cookie', cookieHeader);

    headers.set('Content-Type', 'application/json');

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete from API', details: error.message },
      { status: 500 }
    );
  }
}
