/**
 * Detailed Login Test
 */

const API_BASE_URL = 'http://13.60.221.160';

async function testLogin() {
  console.log('🚀 Testing Login with actual credentials...\n');

  const loginData = {
    email: 'admin@techwithjoshi.com',
    password: '12345678'
  };

  try {
    const url = `${API_BASE_URL}/api/v1/auth/login`;
    console.log('URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    console.log('\n✅ LOGIN SUCCESSFUL!');
    console.log('\n📦 Full Response Structure:');
    console.log(JSON.stringify(data, null, 2));

    // Check structure
    console.log('\n🔍 Response Structure Analysis:');
    console.log('   - Has data.data?', !!data.data);
    console.log('   - Has data.accessToken?', !!data.accessToken);
    console.log('   - Has data.user?', !!data.user);

    console.log('\n👤 User Info:');
    const user = data.data?.user || data.user;
    console.log('   - Name:', user?.firstName, user?.lastName);
    console.log('   - Email:', user?.email);
    console.log('   - Role:', user?.role);
    console.log('   - Company:', user?.companyName);

    console.log('\n🔑 Tokens:');
    const accessToken = data.data?.accessToken || data.accessToken;
    const refreshToken = data.data?.refreshToken || data.refreshToken;
    console.log('   - Access Token:', accessToken ? '✅ Present' : '❌ Missing');
    console.log('   - Refresh Token:', refreshToken ? '✅ Present' : '❌ Missing');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLogin();
