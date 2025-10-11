# 🚀 Postman Collection Setup Guide

## Overview
This guide explains how to use the Impact Leaders API Postman collection with your Admin Panel's new Next.js API structure.

---

## 📋 API Architecture

Your Admin Panel acts as a **proxy/gateway** between the frontend and the Impact Leaders API:

```
Frontend (React)
    ↓
Next.js API Routes (/api/*)
    ↓
Impact Leaders API (http://13.60.221.160)
```

---

## 🔧 Two Ways to Use the API

### 1. **Direct API Calls** (Postman Collection)
Use this for testing the **Impact Leaders API directly**:

```
Base URL: http://13.60.221.160/api/v1
Example: http://13.60.221.160/api/v1/auth/login
```

### 2. **Through Admin Panel** (Next.js Proxy)
Use this for testing the **Admin Panel integration**:

```
Base URL: http://localhost:3000/api
Example: http://localhost:3000/api/auth/impact-leaders/login
```

---

## 🌐 Postman Environment Setup

Create two environments in Postman:

### Environment 1: **Impact Leaders Direct**
```json
{
  "environment": "Impact Leaders Direct",
  "variables": [
    {
      "key": "baseUrl",
      "value": "http://13.60.221.160",
      "enabled": true
    },
    {
      "key": "accessToken",
      "value": "",
      "enabled": true
    },
    {
      "key": "refreshToken",
      "value": "",
      "enabled": true
    }
  ]
}
```

### Environment 2: **Admin Panel (Local)**
```json
{
  "environment": "Admin Panel Local",
  "variables": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000",
      "enabled": true
    },
    {
      "key": "accessToken",
      "value": "",
      "enabled": true
    },
    {
      "key": "refreshToken",
      "value": "",
      "enabled": true
    }
  ]
}
```

---

## 📚 API Endpoints Mapping

### Authentication

| Postman Collection | Admin Panel Proxy | Impact Leaders Direct |
|-------------------|-------------------|----------------------|
| N/A | `POST /api/auth/impact-leaders/login` | `POST /api/v1/auth/login` |
| N/A | `POST /api/auth/impact-leaders/logout` | `POST /api/v1/auth/logout` |
| Register User | N/A | `POST /api/v1/auth/register` |
| Get Current User | N/A | `GET /api/v1/auth/me` |
| Refresh Token | N/A | `POST /api/v1/auth/refresh` |

### Dashboard

| Feature | Admin Panel Proxy | Impact Leaders Direct |
|---------|-------------------|----------------------|
| Dashboard Stats | `GET /api/dashboard/stats` | Aggregated from multiple endpoints |

### Monitoring

| Feature | Admin Panel Proxy | Impact Leaders Direct |
|---------|-------------------|----------------------|
| System Metrics | `GET /api/monitoring/system` | Custom metrics |
| Real-time Data | `GET /api/monitoring/realtime` | Custom metrics |
| API Metrics | `GET /api/monitoring/api-metrics` | Custom metrics |

### Stories

| Postman Collection | Admin Panel Proxy | Impact Leaders Direct |
|-------------------|-------------------|----------------------|
| Get Stories Feed | `GET /api/stories` | `GET /api/v1/stories/feed` |
| Create Story | `POST /api/stories` | `POST /api/v1/stories` |
| Get Story by ID | `GET /api/stories/:id` | `GET /api/v1/stories/:id` |

### Posts & Social

| Postman Collection | Impact Leaders Direct |
|-------------------|----------------------|
| Get All Posts | `GET /api/v1/posts` |
| Create Post | `POST /api/v1/posts` |
| Create Post with Images | `POST /api/v1/posts/upload` |
| Upvote Post | `POST /api/v1/posts/:id/upvote` |
| Add Comment | `POST /api/v1/posts/:id/comments` |

### Resources

| Postman Collection | Impact Leaders Direct |
|-------------------|----------------------|
| Get All Resources | `GET /api/v1/resources` |
| Upload Resource | `POST /api/v1/resources` |
| Download Resource | `GET /api/v1/resources/:id/download` |

---

## 🔐 Authentication Flow

### Using Admin Panel (Recommended for Frontend)

1. **Login via Admin Panel:**
   ```bash
   POST http://localhost:3000/api/auth/impact-leaders/login

   Body:
   {
     "email": "admin@techwithjoshi.com",
     "password": "12345678"
   }
   ```

2. **Response:**
   ```json
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "refreshToken": "62c45155c82afa5b7346ad01...",
     "user": { ... }
   }
   ```

3. **Token stored in:**
   - localStorage: `impactLeadersAuth`
   - Cookie: `impactLeadersToken`

### Using Impact Leaders Direct (For Testing)

1. **Login Directly:**
   ```bash
   POST http://13.60.221.160/api/v1/auth/login

   Body:
   {
     "email": "admin@techwithjoshi.com",
     "password": "12345678"
   }
   ```

2. **Use accessToken in headers:**
   ```
   Authorization: Bearer <accessToken>
   ```

---

## 🧪 Testing Scenarios

### Scenario 1: Test Admin Panel Integration

1. Start Admin Panel:
   ```bash
   npm run dev
   ```

2. Use Postman with "Admin Panel Local" environment

3. Test login:
   ```
   POST http://localhost:3000/api/auth/impact-leaders/login
   ```

### Scenario 2: Test Impact Leaders API Directly

1. Use Postman with "Impact Leaders Direct" environment

2. Import the provided collection

3. Test endpoints directly:
   ```
   POST http://13.60.221.160/api/v1/auth/login
   ```

---

## 📝 Creating a Postman Collection for Admin Panel

Here's a sample collection structure for Admin Panel endpoints:

### Collection: **Admin Panel API**

#### Folder: **Authentication**
```json
{
  "name": "Login (Admin Panel)",
  "request": {
    "method": "POST",
    "header": [
      {
        "key": "Content-Type",
        "value": "application/json"
      }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\n  \"email\": \"admin@techwithjoshi.com\",\n  \"password\": \"12345678\"\n}"
    },
    "url": {
      "raw": "{{baseUrl}}/api/auth/impact-leaders/login",
      "host": ["{{baseUrl}}"],
      "path": ["api", "auth", "impact-leaders", "login"]
    }
  }
}
```

#### Folder: **Dashboard**
```json
{
  "name": "Get Dashboard Stats",
  "request": {
    "method": "GET",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{accessToken}}"
      }
    ],
    "url": {
      "raw": "{{baseUrl}}/api/dashboard/stats",
      "host": ["{{baseUrl}}"],
      "path": ["api", "dashboard", "stats"]
    }
  }
}
```

#### Folder: **Monitoring**
```json
{
  "name": "Get System Metrics",
  "request": {
    "method": "GET",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{accessToken}}"
      }
    ],
    "url": {
      "raw": "{{baseUrl}}/api/monitoring/system",
      "host": ["{{baseUrl}}"],
      "path": ["api", "monitoring", "system"]
    }
  }
}
```

---

## 🔄 Token Management

### Auto-save Tokens (Test Script)

Add this to your login request's **Tests** tab:

```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();

    // For Impact Leaders Direct
    if (response.accessToken) {
        pm.environment.set('accessToken', response.accessToken);
        pm.environment.set('refreshToken', response.refreshToken);
        pm.environment.set('userId', response.user.id);
    }

    // For Admin Panel
    if (response.token) {
        pm.environment.set('accessToken', response.token);
        pm.environment.set('refreshToken', response.refreshToken);
        pm.environment.set('userId', response.user.id);
    }

    console.log('✅ Tokens saved to environment');
}
```

---

## 🚀 Quick Start

### 1. Import Postman Collection

Import the provided "Impact Leaders API - TechWithJoshi" collection

### 2. Create Environments

Create both "Impact Leaders Direct" and "Admin Panel Local" environments

### 3. Test Authentication

```bash
# Start Admin Panel
npm run dev

# Test in Postman
POST http://localhost:3000/api/auth/impact-leaders/login
```

### 4. Test Other Endpoints

Once authenticated, test other endpoints like:
- Dashboard Stats
- Monitoring Metrics
- Stories CRUD

---

## 📊 Environment Variables Summary

| Variable | Impact Leaders Direct | Admin Panel Local |
|----------|----------------------|-------------------|
| baseUrl | `http://13.60.221.160` | `http://localhost:3000` |
| API Version | `/api/v1` | `/api` |
| Auth Endpoint | `/api/v1/auth/login` | `/api/auth/impact-leaders/login` |

---

## 🔍 Debugging Tips

### 1. Check Admin Panel Logs
```bash
# In terminal where npm run dev is running
# Watch for API request logs
```

### 2. Check Network Tab
- Open Chrome DevTools
- Go to Network tab
- Filter by "api"
- Check request/response

### 3. Check Console Logs
- Login route: `src/app/api/auth/impact-leaders/login/route.js`
- Monitoring routes: `src/app/api/monitoring/*/route.js`

### 4. Verify Token
```bash
# Check localStorage in browser console
localStorage.getItem('impactLeadersAuth')

# Check cookie
document.cookie
```

---

## 📚 Related Documentation

- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) - Complete folder structure
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture patterns
- [README.md](./README.md) - Getting started guide
- [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) - Migration details

---

## 🤝 Support

For issues:
1. Check API route logs
2. Verify environment variables
3. Check token validity
4. Review Postman console logs

---

**Last Updated:** 2025-10-11
**Version:** 2.0
