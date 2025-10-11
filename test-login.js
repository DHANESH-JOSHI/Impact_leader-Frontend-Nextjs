/**
 * Login Test Script
 * Tests the Impact Leaders API login endpoint
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://13.60.221.160';

async function testLogin() {
  console.log('🚀 Starting Login Test...\n');
  console.log('📡 API Base URL:', API_BASE_URL);
  console.log('📧 Email: admin@techwithjoshi.com');
  console.log('🔐 Password: ********\n');

  const loginData = {
    email: 'admin@techwithjoshi.com',
    password: '12345678'
  };

  try {
    const url = `${API_BASE_URL}/api/v1/auth/login`;
    console.log('🌐 Making POST request to:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    console.log('\n📊 Response Status:', response.status, response.statusText);

    const data = await response.json();

    if (response.ok) {
      console.log('\n✅ LOGIN SUCCESSFUL!\n');
      console.log('📦 Response Data:');
      console.log(JSON.stringify(data, null, 2));

      if (data.data) {
        console.log('\n👤 User Info:');
        console.log('   - Name:', data.data.user?.firstName, data.data.user?.lastName);
        console.log('   - Email:', data.data.user?.email);
        console.log('   - Role:', data.data.user?.role);
        console.log('   - ID:', data.data.user?._id);

        console.log('\n🔑 Tokens:');
        console.log('   - Access Token:', data.data.accessToken ? '✅ Present' : '❌ Missing');
        console.log('   - Refresh Token:', data.data.refreshToken ? '✅ Present' : '❌ Missing');

        if (data.data.accessToken) {
          console.log('\n📋 Access Token (first 50 chars):', data.data.accessToken.substring(0, 50) + '...');
        }
      }
    } else {
      console.log('\n❌ LOGIN FAILED!\n');
      console.log('📦 Error Response:');
      console.log(JSON.stringify(data, null, 2));
    }

  } catch (error) {
    console.error('\n💥 ERROR:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testLogin().then(() => {
  console.log('\n✨ Test completed!');
  process.exit(0);
}).catch(error => {
  console.error('\n💥 Test failed:', error);
  process.exit(1);
});
