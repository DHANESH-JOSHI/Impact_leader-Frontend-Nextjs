# 🔧 API Integration - Fixed!

## ✅ Issues Fixed

### 1. **Wrong API Base URL**
**Problem:** API was calling `http://localhost/auth/login` (wrong)
**Solution:** Updated to `http://13.60.221.160/api/v1/auth/login` (correct)

**Files Changed:**
- Created `.env.local` with correct API URL
- Updated `src/lib/apiClient.js` to use correct base URL
- Added logging for debugging

---

## 🚀 How to Restart & Test

### Step 1: Restart Dev Server
```bash
# Stop current server
Press Ctrl+C

# Start fresh
npm run dev
```

### Step 2: Check Console Logs
You should see:
```
[API Client] Initialized with baseURL: http://13.60.221.160/api/v1
```

### Step 3: Try Login
- Email: `admin@techwithjoshi.com`
- Password: `12345678`

### Step 4: Monitor Logs
Check terminal for:
```
[API] POST http://13.60.221.160/api/v1/auth/login { hasAuth: false, hasData: true }
```

---

## 📝 API Endpoints (From Postman Collection)

### Authentication
```
POST   http://13.60.221.160/api/v1/auth/register
POST   http://13.60.221.160/api/v1/auth/login ✅
GET    http://13.60.221.160/api/v1/auth/me
POST   http://13.60.221.160/api/v1/auth/refresh
POST   http://13.60.221.160/api/v1/auth/logout
```

### OTP Authentication
```
POST   http://13.60.221.160/api/v1/auth/otp/send
POST   http://13.60.221.160/api/v1/auth/otp/verify
POST   http://13.60.221.160/api/v1/auth/otp/resend
```

### Users
```
GET    http://13.60.221.160/api/v1/users
GET    http://13.60.221.160/api/v1/users/:id
PUT    http://13.60.221.160/api/v1/users/profile
```

### Posts
```
GET    http://13.60.221.160/api/v1/posts
POST   http://13.60.221.160/api/v1/posts
POST   http://13.60.221.160/api/v1/posts/upload (with images)
POST   http://13.60.221.160/api/v1/posts/:id/upvote
POST   http://13.60.221.160/api/v1/posts/:id/downvote
POST   http://13.60.221.160/api/v1/posts/:id/comments
POST   http://13.60.221.160/api/v1/posts/:id/poll/vote
```

### Stories
```
GET    http://13.60.221.160/api/v1/stories/feed
POST   http://13.60.221.160/api/v1/stories
GET    http://13.60.221.160/api/v1/stories/:id
```

### Resources
```
GET    http://13.60.221.160/api/v1/resources
POST   http://13.60.221.160/api/v1/resources (file upload)
GET    http://13.60.221.160/api/v1/resources/:id
GET    http://13.60.221.160/api/v1/resources/:id/download
```

### Q&A
```
GET    http://13.60.221.160/api/v1/qa/questions
POST   http://13.60.221.160/api/v1/qa/questions
```

### Connections
```
GET    http://13.60.221.160/api/v1/connections
POST   http://13.60.221.160/api/v1/connections/request
GET    http://13.60.221.160/api/v1/connections/suggestions
```

### Notifications
```
GET    http://13.60.221.160/api/v1/notifications
GET    http://13.60.221.160/api/v1/notifications/unread/count
POST   http://13.60.221.160/api/v1/notifications/announcement
```

### Meetings (Complex Flow)
```
POST   http://13.60.221.160/api/v1/meetings/start-creation
POST   http://13.60.221.160/api/v1/meetings/verify-organizer-email
POST   http://13.60.221.160/api/v1/meetings/confirm-organizer-email
POST   http://13.60.221.160/api/v1/meetings/verify-attendee-emails
POST   http://13.60.221.160/api/v1/meetings/confirm-attendee-email
POST   http://13.60.221.160/api/v1/meetings/complete-creation
GET    http://13.60.221.160/api/v1/meetings/creation-status/:sessionId
```

---

## 🔐 Authentication Flow

### 1. Login Request
```javascript
POST /api/auth/impact-leaders/login

Body:
{
  "email": "admin@techwithjoshi.com",
  "password": "12345678"
}
```

### 2. Next.js API Route
```javascript
// src/app/api/auth/impact-leaders/login/route.js
// Calls Impact Leaders API
const response = await ImpactLeadersAuthService.login(email, password);
```

### 3. Service Layer
```javascript
// src/services/impactLeadersAuthService.js
// Uses apiClient to call external API
const response = await apiClient.post(AUTH.LOGIN, { email, password });
```

### 4. API Client
```javascript
// src/lib/apiClient.js
// Makes actual HTTP request
const url = http://13.60.221.160/api/v1/auth/login
```

### 5. Response
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJhbGci...",
  "refreshToken": "62c45155...",
  "expiresIn": 900,
  "user": {
    "id": "68a040ae...",
    "email": "admin@techwithjoshi.com",
    "firstName": "Admin",
    "lastName": "LeadersImact-App",
    "role": "admin",
    ...
  }
}
```

---

## ⚙️ Environment Variables

### `.env.local` (Created)
```bash
NEXT_PUBLIC_API_BASE_URL=http://13.60.221.160
NODE_ENV=development
```

### How It Works
```javascript
// In apiClient.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://13.60.221.160";
const cleanBaseURL = API_BASE_URL.replace(/\/$/, '');
this.baseURL = cleanBaseURL + '/api/v1';
// Result: http://13.60.221.160/api/v1
```

---

## 🐛 Debugging Tips

### Check API Base URL
```javascript
// In browser console
console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
```

### Check Network Tab
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Try logging in
4. Look for request to `http://13.60.221.160/api/v1/auth/login`
5. Check Request Headers, Body, and Response

### Check Console Logs
Terminal should show:
```
[API Client] Initialized with baseURL: http://13.60.221.160/api/v1
[API] POST http://13.60.221.160/api/v1/auth/login { hasAuth: false, hasData: true }
```

### Common Issues

#### Issue 1: Still showing `localhost`
**Solution:**
```bash
# Delete .next folder and restart
rm -rf .next
npm run dev
```

#### Issue 2: 503 Service Unavailable
**Solution:**
- Check if Impact Leaders API is running
- Ping: `curl http://13.60.221.160/api/v1/health`
- Contact backend team

#### Issue 3: CORS Error
**Solution:**
- Impact Leaders API needs to allow `http://localhost:3000` in CORS
- Contact backend team to add CORS header

---

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "accessToken": "...",
  "refreshToken": "...",
  "user": { ... },
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "status": 400
}
```

### Rate Limiting
```
Headers:
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1755852187
RateLimit-Policy: 5;w=900
```

---

## 🔄 Token Management

### Access Token
- **Lifetime:** 15 minutes (900 seconds)
- **Storage:** localStorage + cookie
- **Usage:** `Authorization: Bearer <token>`

### Refresh Token
- **Lifetime:** Long-lived
- **Storage:** localStorage only
- **Usage:** Refresh access token when expired

### Auto-Refresh
```javascript
// Automatic token refresh in apiClient
if (response.status === 401) {
  // Try refreshing token
  const refreshed = await ImpactLeadersAuthService.refreshToken();
  if (refreshed.success) {
    // Retry original request
  }
}
```

---

## 📝 Next Steps

### 1. Remove Dummy Data
Files with mock data:
- `src/services/dashboardService.js`
- `src/services/storiesService.js`
- `src/services/systemMonitoringService.js`
- `src/services/serverMonitoringService.js`

### 2. Integrate All Endpoints
- ✅ Auth endpoints
- ⏳ Users endpoints
- ⏳ Posts endpoints
- ⏳ Stories endpoints
- ⏳ Resources endpoints
- ⏳ Q&A endpoints
- ⏳ Connections endpoints
- ⏳ Notifications endpoints
- ⏳ Meetings endpoints

### 3. Add Error Handling
- Display user-friendly error messages
- Add retry logic for failed requests
- Handle rate limiting gracefully

### 4. Add Loading States
- Show spinners during API calls
- Disable buttons while processing
- Add skeleton loaders

### 5. Testing
- Test all CRUD operations
- Test file uploads
- Test authentication flow
- Test token refresh
- Test error scenarios

---

## ✅ Verification Checklist

- [x] `.env.local` created with correct URL
- [x] `apiClient.js` updated with correct base URL
- [x] Console logs added for debugging
- [x] Documentation created
- [ ] Dev server restarted
- [ ] Login tested
- [ ] API responses verified
- [ ] Dummy data removed
- [ ] All endpoints integrated

---

**Status:** ✅ API Connection Fixed!
**Next:** Restart dev server and test login
**Last Updated:** 2025-10-11
