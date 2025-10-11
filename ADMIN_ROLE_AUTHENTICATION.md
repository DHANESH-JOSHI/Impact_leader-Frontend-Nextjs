# Admin Role Authentication Guide

## 🔒 Overview

The admin dashboard now has **strict role-based access control**. Only users with admin privileges can login and access the dashboard.

## ✅ Allowed Admin Roles

The system accepts users with any of these criteria:

1. **Role-based Access**:
   - `role: "admin"`
   - `role: "super-admin"`
   - `isAdmin: true`

2. **Permission-based Access**:
   - `permissions` array contains `"admin_access"`

## 🚫 Access Restrictions

- **Regular users** with valid credentials will be **denied access**
- **Non-admin users** receive "Access denied" error message
- Only admin-level users can proceed to the dashboard

## 🔐 Authentication Flow

### 1. User Login Attempt
```
User enters email/password → Impact Leaders API authentication
```

### 2. Role Verification
```javascript
// Role check logic
const isAdmin = user.role === 'admin' || 
                user.role === 'super-admin' || 
                user.isAdmin === true ||
                (user.permissions && user.permissions.includes('admin_access'));
```

### 3. Access Decision
- ✅ **Admin User**: Login successful → Redirect to dashboard
- ❌ **Regular User**: Access denied (HTTP 403) → Remain on login page

## 🛡️ Security Layers

### Layer 1: API Route Protection
**File**: `/src/app/api/auth/impact-leaders/login/route.js`
- Validates user role after successful authentication
- Returns 403 error for non-admin users

### Layer 2: Middleware Protection
**File**: `/src/middleware.js`
- Intercepts all dashboard route requests
- Verifies token validity with Impact Leaders API
- Checks admin role on every dashboard access
- Redirects non-admin users to login page

### Layer 3: Client-Side Protection
**File**: `/src/app/page.js`
- Handles error messages from middleware redirects
- Provides clear feedback for access denied scenarios

## 📱 User Experience

### For Admin Users
1. Enter credentials → Login successful
2. Welcome message with user name
3. Full dashboard access
4. Proper user info display in navbar
5. Clean logout functionality

### For Regular Users
1. Enter credentials → Authentication successful
2. **But** → "Access denied. Admin privileges required."
3. Remain on login page
4. No dashboard access

## 🔧 Error Handling

### Error Types
- `access_denied`: Non-admin user attempted login
- `login_required`: Unauthenticated dashboard access
- `session_expired`: Invalid/expired token

### Error Messages
```javascript
// URL parameters trigger appropriate messages
?error=access_denied → "Access denied. Admin privileges required."
?error=login_required → "Please login to access the dashboard"
?error=session_expired → "Your session has expired. Please login again."
```

## 💾 Token Management

### Storage
- **Cookie**: `impactLeadersToken` (for server-side middleware)
- **LocalStorage**: `impactLeadersAuth` (for client-side operations)

### Security
- Tokens validated on every request
- Automatic cleanup on logout
- Proper expiration handling

## 🧪 Testing Scenarios

### Test Case 1: Admin User Login
```
Email: admin@techwithjoshi.in (with admin role)
Password: valid_password
Expected: Success → Dashboard access
```

### Test Case 2: Regular User Login
```
Email: user@example.com (regular user)
Password: valid_password
Expected: "Access denied" error message
```

### Test Case 3: Invalid Credentials
```
Email: any@email.com
Password: wrong_password
Expected: "Login failed" error message
```

## 🔄 Logout Process

### Complete Cleanup
1. Call Impact Leaders logout API
2. Clear localStorage data
3. Remove all cookies
4. Redirect to login page
5. Show success message

### Logout Button Location
- **Navbar** → Profile dropdown → "Logout" (red button)

## 👤 User Information Display

### Navbar Profile Section
- **Avatar**: User initials (first name + last name initials)
- **Name**: Full name or email if name not available
- **Role**: Displays "Administrator", "Super Administrator", or "Admin"

### Dynamic Updates
- User info loaded from localStorage on page load
- Automatically updates after login

## 🚨 Security Considerations

### Token Verification
- **Server-side**: Middleware calls Impact Leaders API to verify token
- **Client-side**: LocalStorage maintains user session info
- **Dual-layer**: Both cookie and localStorage for redundancy

### Role Changes
- If user role changes on Impact Leaders API, middleware will catch it
- User will be logged out on next request if no longer admin

## 📋 Implementation Files

### Core Files Modified
1. **Login API**: `/src/app/api/auth/impact-leaders/login/route.js`
2. **Logout API**: `/src/app/api/auth/impact-leaders/logout/route.js`
3. **Middleware**: `/src/middleware.js`
4. **Login Page**: `/src/app/page.js`
5. **Navbar**: `/src/components/core/Navbar.jsx`

### Environment Configuration
```env
NEXT_PUBLIC_API_BASE_URL=http://13.60.221.160
```

## 🎯 Result

✅ **Perfect Admin-Only Access Control**
- Only admin users can login
- Regular users are properly blocked
- Clean error handling
- Secure token management
- Proper user experience

---

**Status**: ✅ **Production Ready**  
**Security Level**: 🔒 **High** (Multi-layer protection)  
**User Experience**: 📱 **Optimized** (Clear feedback and error handling)
