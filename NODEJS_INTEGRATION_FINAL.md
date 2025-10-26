# 🎯 Node.js + Next.js Integration - FINAL SETUP

## ✅ Problem Solved!

**Your Setup:**
- **Backend:** Node.js Express API on `localhost:5500`
- **Frontend:** Next.js on `localhost:3000`
- **Solution:** Direct API calls (no Next.js proxy)

---

## 📊 Architecture

### Before (❌ Broken):
```
Frontend → Next.js API Routes (/api/*) → Node.js API
           ↑ (Unnecessary proxy causing conflicts)
```

### After (✅ Fixed):
```
Frontend → http://localhost:5500/api/v1/* (Direct)
           ↑ (Direct connection to Node.js)
```

---

## 🔧 Changes Made

### 1. Environment Configuration
**File:** `.env.local`
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5500
NODE_ENV=development
```

### 2. Removed Next.js API Routes
```bash
# Moved to backup (not used anymore)
src/app/api → src/app/api_backup_not_used
```

### 3. Updated Frontend
**File:** `src/app/page.js`
```javascript
// OLD (Next.js proxy)
const response = await fetch("/api/auth/impact-leaders/login", {...});

// NEW (Direct Node.js call)
const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "api/v1/auth/login", {...});
```

---

## 🚀 Setup Instructions

### Step 1: Start Node.js API Server

```bash
# Terminal 1 - Start your Node.js Express server
cd /path/to/your/node-api
npm start
# or
node server.js

# Verify it's running:
curl http://localhost:5500/api/v1/health
# or open in browser: http://localhost:5500
```

**Expected Output:**
```
✅ Server running on http://localhost:5500
```

### Step 2: Start Next.js Frontend

```bash
# Terminal 2 - Start Next.js
cd /path/to/Admin_Panel

# Clear Next.js cache
rm -rf .next

# Start dev server
npm run dev
```

**Expected Output:**
```
✅ Ready on http://localhost:3000
```

### Step 3: Test Login

1. Open browser: `http://localhost:3000`
2. Enter credentials:
   - Email: `admin@techwithjoshi.com`
   - Password: `12345678`
3. Click "Sign In"

**Check Console Logs:**
- Browser console should show: API call to `http://localhost:5500/api/v1/auth/login`
- Node.js terminal should show: Incoming POST request

---

## ⚙️ Node.js API Requirements

### 1. CORS Configuration (CRITICAL!)

Your Node.js API **MUST** have CORS enabled for `localhost:3000`:

```javascript
// server.js or app.js
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',  // Next.js frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Install CORS if not installed:**
```bash
npm install cors
```

### 2. Response Format

Your Node.js API should return responses in this format:

#### Success Response:
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "62c45155c82afa5b7346ad01...",
  "expiresIn": 900,
  "user": {
    "id": "68a040ae1d4f0db2e88411c6",
    "email": "admin@techwithjoshi.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin",
    ...
  }
}
```

#### Error Response:
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 3. API Endpoints

Make sure these endpoints exist in your Node.js API:

#### Authentication:
```
POST   /api/v1/auth/login
POST   /api/v1/auth/register
GET    /api/v1/auth/me
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
```

#### OTP:
```
POST   /api/v1/auth/otp/send
POST   /api/v1/auth/otp/verify
POST   /api/v1/auth/otp/resend
```

#### Users:
```
GET    /api/v1/users
GET    /api/v1/users/:id
PUT    /api/v1/users/profile
```

#### Posts:
```
GET    /api/v1/posts
POST   /api/v1/posts
POST   /api/v1/posts/upload
GET    /api/v1/posts/:id
PUT    /api/v1/posts/:id
DELETE /api/v1/posts/:id
POST   /api/v1/posts/:id/upvote
POST   /api/v1/posts/:id/comments
```

And more... (based on your Postman collection)

---

## 🐛 Troubleshooting

### Issue 1: CORS Error

**Error in Browser Console:**
```
Access to fetch at 'http://localhost:5500/api/v1/auth/login' from origin 'http://localhost:3000'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present.
```

**Solution:**
Add CORS middleware to your Node.js server (see CORS Configuration above)

### Issue 2: Connection Refused

**Error:**
```
Failed to fetch
net::ERR_CONNECTION_REFUSED
```

**Solution:**
- Check if Node.js server is running on port 5500
- Run: `curl http://localhost:5500/api/v1/health`
- Check if port is available: `lsof -i :5500`

### Issue 3: Wrong Port

**Error:**
```
Cannot connect to localhost:5500
```

**Solution:**
- Verify your Node.js server port in its config
- Update `.env.local` if using different port:
  ```
  NEXT_PUBLIC_API_BASE_URL=http://localhost:YOUR_PORT
  ```

### Issue 4: Token Format Mismatch

**Error:**
```
data.accessToken is undefined
```

**Solution:**
Check your Node.js API response format. It should return:
```json
{
  "success": true,
  "accessToken": "...",  // Not "token"
  "refreshToken": "...",
  "user": {...}
}
```

### Issue 5: Next.js Not Picking Up .env Changes

**Solution:**
```bash
# Stop server (Ctrl+C)
rm -rf .next
npm run dev
```

---

## 📝 Verification Checklist

Before testing, verify:

- [ ] Node.js API server is running on `localhost:5500`
- [ ] CORS is configured in Node.js for `localhost:3000`
- [ ] `.env.local` has `NEXT_PUBLIC_API_BASE_URL=http://localhost:5500`
- [ ] Next.js dev server is running on `localhost:3000`
- [ ] Both terminals show no errors
- [ ] Can access `http://localhost:5500` in browser
- [ ] Can access `http://localhost:3000` in browser

---

## 🔍 Testing Endpoints

### Test 1: Health Check
```bash
curl http://localhost:5500/api/v1/health
# or
curl http://localhost:5500/health
```

### Test 2: Login via cURL
```bash
curl -X POST http://localhost:5500/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@techwithjoshi.com",
    "password": "12345678"
  }'
```

**Expected:** JSON response with `accessToken` and `user`

### Test 3: Frontend Login
1. Open `http://localhost:3000`
2. Fill login form
3. Open Browser DevTools (F12)
4. Go to Network tab
5. Submit login
6. Check request to `localhost:5500/api/v1/auth/login`
7. Verify response has `accessToken`

---

## 📚 File Structure

```
Admin_Panel/
├── .env.local                          # ✅ API URL configuration
├── src/
│   ├── app/
│   │   ├── api_backup_not_used/       # ❌ Old Next.js routes (not used)
│   │   ├── page.js                    # ✅ Updated to call Node.js directly
│   │   └── dashboard/
│   ├── components/
│   ├── services/                       # ✅ Will update these next
│   ├── lib/
│   │   └── apiClient.js               # ✅ Configured for Node.js API
│   └── constants/
│       └── apiEndpoints.js            # ✅ API endpoint definitions
```

---

## 🎯 Next Steps

### 1. Update All Services
Currently only `page.js` is updated. Need to update:
- `src/services/postsService.js`
- `src/services/storiesService.js`
- `src/services/usersService.js`
- `src/services/resourcesService.js`
- etc.

### 2. Remove Dummy Data
Services still have mock/dummy data for fallback. Need to:
- Remove `mockStats`, `mockData` variables
- Make services rely only on real API
- Add proper error handling

### 3. Add Loading States
- Show spinners during API calls
- Disable buttons while processing
- Add skeleton loaders

### 4. Error Handling
- Display user-friendly error messages
- Handle network errors gracefully
- Implement retry logic

---

## 🔐 Security Notes

### 1. Production Setup

For production, update `.env.production`:
```bash
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

### 2. HTTPS

In production, use HTTPS for API:
```bash
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

### 3. CORS

In production, update Node.js CORS to allow your production domain:
```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

---

## 📞 Support

### Common Questions

**Q: Can I use both Next.js API routes AND Node.js API?**
A: Yes, but not recommended. Stick to one for simplicity.

**Q: Why remove Next.js API routes?**
A: You already have a Node.js API. Next.js routes would just add unnecessary complexity as a proxy layer.

**Q: Can I switch back to Next.js API routes?**
A: Yes, just restore from `api_backup_not_used` folder and update `.env.local`

**Q: What if I want to deploy separately?**
A: Perfect! This setup allows independent deployment:
- Deploy Node.js API to Heroku/AWS/etc
- Deploy Next.js frontend to Vercel
- Just update `NEXT_PUBLIC_API_BASE_URL` to point to deployed API

---

## ✅ Summary

### What You Have Now:

1. **✅ Direct Connection:** Frontend → Node.js API (no proxy)
2. **✅ Clean Separation:** Backend and Frontend are independent
3. **✅ Standard Setup:** Follows industry best practices
4. **✅ Easy Deployment:** Can deploy separately
5. **✅ No Conflicts:** No more route clashing

### Current Status:

- ✅ `.env.local` configured
- ✅ Next.js API routes moved to backup
- ✅ Login page updated
- ⏳ Other services need updating
- ⏳ Dummy data needs removal

### Test Now:

1. Start Node.js server (`localhost:5500`)
2. Start Next.js server (`localhost:3000`)
3. Try logging in
4. Check both console logs

---

**Last Updated:** 2025-10-11
**Version:** 3.0 (Direct Node.js Integration)
**Status:** ✅ Ready for Testing
