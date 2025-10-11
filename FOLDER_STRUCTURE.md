# 📁 Admin Panel - Folder Structure Documentation

## Overview
This document describes the complete folder structure of the Admin Panel following Next.js 15+ standard conventions and best practices.

---

## 🏗️ Project Structure

```
Admin_Panel/
├── src/
│   ├── app/                    # Next.js App Router (Pages & API Routes)
│   ├── components/            # React Components
│   ├── services/              # Business Logic Layer
│   ├── lib/                   # Core Utilities
│   ├── constants/             # Application Constants
│   ├── hooks/                 # Custom React Hooks
│   └── middleware.js          # Next.js Middleware
├── public/                    # Static Assets
└── Configuration Files
```

---

## 📂 Detailed Structure

### 1. **`src/app/` - Next.js App Router** ✅

#### **Pages (UI Routes)**
```
src/app/
├── page.js                    # Login Page (/)
├── layout.js                  # Root Layout
├── globals.css                # Global Styles
├── not-found.js              # 404 Page
└── dashboard/                 # Dashboard Routes
    ├── layout.jsx             # Dashboard Layout
    ├── page.jsx               # Dashboard Home (/dashboard)
    ├── posts/
    │   └── page.jsx          # Posts Management
    ├── qna/
    │   └── page.jsx          # Q&A Management
    ├── resources/
    │   └── page.jsx          # Resources Management
    ├── stories/
    │   └── page.jsx          # Stories Management
    ├── users/
    │   └── page.jsx          # User Directory
    ├── impact-leaders/        # Impact Leaders Section
    │   ├── page.js
    │   ├── api-status/
    │   └── users/
    └── settings/              # Settings Pages
        ├── approvals/
        ├── file-import/
        ├── messages/
        ├── notifications/
        └── posts/
```

#### **API Routes (Backend)** ✅
```
src/app/api/                   # Standard Next.js API Routes
├── auth/                      # Authentication APIs
│   ├── login/
│   │   └── route.js          # POST /api/auth/login
│   ├── logout/
│   │   └── route.js          # POST /api/auth/logout
│   └── impact-leaders/
│       ├── login/
│       │   └── route.js      # POST /api/auth/impact-leaders/login
│       └── logout/
│           └── route.js      # POST /api/auth/impact-leaders/logout
├── dashboard/                 # Dashboard APIs
│   └── stats/
│       └── route.js          # GET /api/dashboard/stats
├── monitoring/                # Monitoring APIs
│   ├── system/
│   │   └── route.js          # GET /api/monitoring/system
│   ├── realtime/
│   │   └── route.js          # GET /api/monitoring/realtime
│   ├── api-metrics/
│   │   └── route.js          # GET /api/monitoring/api-metrics
│   └── server-analytics/
│       └── route.js          # GET /api/monitoring/server-analytics
└── stories/                   # Stories APIs
    ├── route.js              # GET/POST /api/stories
    └── [id]/
        └── route.js          # GET/PUT/DELETE /api/stories/:id
```

---

### 2. **`src/components/` - React Components** ✅

```
src/components/
├── core/                      # Core Layout Components
│   ├── Navbar.jsx            # Top Navigation Bar
│   └── Sidebar.jsx           # Sidebar Navigation
├── dashboard/                 # Dashboard Components
│   ├── charts/
│   │   ├── PostsChart.jsx
│   │   ├── ResourcesBreakdown.jsx
│   │   ├── StoriesChart.jsx
│   │   └── UsersChart.jsx
│   ├── QuickActions.jsx
│   ├── StatsOverview.jsx
│   └── SystemNotifications.jsx
├── posts/                     # Posts Components
│   ├── AddPostModal.jsx
│   ├── DeleteConfirmModal.jsx
│   ├── PostsCardView.jsx
│   ├── PostsHeader.jsx
│   ├── PostsTableView.jsx
│   └── ViewPostModal.jsx
├── qna/                      # Q&A Components
│   ├── AddQuestionModal.jsx
│   ├── DeleteConfirmModal.jsx
│   ├── QnaCardView.jsx
│   ├── QnaHeader.jsx
│   ├── QnaTableView.jsx
│   └── ViewQnaModal.jsx
├── resources/                # Resources Components
│   ├── AddResourceModal.jsx
│   ├── DeleteConfirmModal.jsx
│   ├── ResourcesCardView.jsx
│   ├── ResourcesHeader.jsx
│   ├── ResourcesTableView.jsx
│   └── ViewResourceModal.jsx
├── stories/                  # Stories Components
│   ├── AddStoryModal.jsx
│   ├── EditStoryModal.jsx
│   ├── StoryCard.jsx
│   ├── StoryTable.jsx
│   └── ViewStoryModal.jsx
├── impact-leaders/           # Impact Leaders Components
│   └── users/
│       ├── AddUserModal.jsx
│       ├── DeleteConfirmModal.jsx
│       └── ViewUserModal.jsx
├── monitoring/               # Monitoring Components
│   ├── APIMonitoring.jsx
│   ├── ServerMonitoring.jsx
│   └── ServerMonitoringAnalytics.jsx
├── ui/                       # Shadcn UI Components
│   ├── alert.jsx
│   ├── badge.jsx
│   ├── button.jsx
│   ├── card.jsx
│   ├── checkbox.jsx
│   ├── input.jsx
│   ├── label.jsx
│   ├── select.jsx
│   └── switch.jsx
└── ProtectedRoute.jsx        # Route Protection Component
```

---

### 3. **`src/services/` - Business Logic Layer** ✅

```
src/services/
├── adminService.js            # Admin Operations
├── authService.js             # Authentication Service
├── impactLeadersAuthService.js # Impact Leaders Auth
├── connectionsService.js      # Connection Management
├── dashboardService.js        # Dashboard Data
├── directoryService.js        # Directory Management
├── externalApiService.js      # External API Client
├── meetingsService.js         # Meetings Management
├── messagesService.js         # Messages Management
├── notificationsService.js    # Notifications
├── postsService.js            # Posts CRUD
├── qnaService.js              # Q&A CRUD
├── resourcesService.js        # Resources CRUD
├── storiesService.js          # Stories CRUD
├── usersService.js            # User Management
├── serverMonitoringService.js # Server Monitoring
├── systemHealthService.js     # System Health
└── systemMonitoringService.js # System Monitoring
```

---

### 4. **`src/lib/` - Core Utilities** ✅

```
src/lib/
├── apiClient.js               # Centralized API Client
│   ├── Automatic token injection
│   ├── Request/Response interceptors
│   ├── Error handling
│   ├── Retry logic
│   └── FormData support
├── storage.js                 # Storage Management
│   ├── localStorage wrapper
│   ├── sessionStorage wrapper
│   ├── Auth token storage
│   └── Cache storage
├── auth.js                    # Auth Utilities
│   ├── Token verification
│   ├── Cookie management
│   └── Session handling
├── apiTrackingMiddleware.js   # API Tracking
└── utils.js                   # Helper Functions
```

---

### 5. **`src/constants/` - Application Constants** ✅

```
src/constants/
└── apiEndpoints.js            # API Endpoint Definitions
    ├── AUTH endpoints
    ├── POSTS endpoints
    ├── USERS endpoints
    ├── STORIES endpoints
    ├── RESOURCES endpoints
    ├── QNA endpoints
    └── ADMIN endpoints
```

---

### 6. **`src/hooks/` - Custom React Hooks** ✅

```
src/hooks/
├── useApi.js                  # API Hook
│   ├── useApi()              # Generic API hook
│   ├── useStoriesApi()       # Stories API
│   └── useDashboardApi()     # Dashboard API
└── useAuth.js                 # Authentication Hook
    ├── login()
    ├── logout()
    └── isAuthenticated()
```

---

## 🔄 API Routes Structure

### Standard Next.js API Routes Pattern:
```
/api/[resource]/[action]/route.js
```

### Examples:
```
✅ /api/auth/login                  → POST login
✅ /api/auth/logout                 → POST logout
✅ /api/auth/impact-leaders/login   → POST Impact Leaders login
✅ /api/dashboard/stats             → GET dashboard stats
✅ /api/monitoring/system           → GET system metrics
✅ /api/monitoring/realtime         → GET realtime data
✅ /api/stories                     → GET/POST stories
✅ /api/stories/:id                 → GET/PUT/DELETE story by ID
```

---

## 📝 Service Architecture Pattern

### Service Layer Structure:
```javascript
// Example: postsService.js
import { apiClient } from '@/lib/apiClient';
import { POSTS } from '@/constants/apiEndpoints';

export class PostsService {
  static async getAllPosts(params = {}) {
    try {
      const response = await apiClient.get(POSTS.BASE, { params });
      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[Posts] Get posts error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Other methods...
}
```

---

## 🔐 Authentication Flow

```
Login Page (page.js)
    ↓
POST /api/auth/impact-leaders/login
    ↓
impactLeadersAuthService.login()
    ↓
External Impact Leaders API
    ↓
Store tokens in localStorage
    ↓
Set cookies for middleware
    ↓
Redirect to /dashboard
```

---

## 📊 Data Flow

```
Component
    ↓
Custom Hook (useApi, useAuth)
    ↓
Service Layer (postsService, authService)
    ↓
API Client (lib/apiClient.js)
    ↓
Next.js API Route (/api/...)
    ↓
External API / Database
```

---

## 🚀 Migration Completed

### ✅ Changes Made:

1. **API Routes Migration**
   - ❌ Old: `/next_api/...` (non-standard)
   - ✅ New: `/api/...` (Next.js standard)

2. **Updated Files:**
   - ✅ `src/app/page.js` - Updated login API endpoint
   - ✅ `src/hooks/useAuth.js` - Updated auth endpoints
   - ✅ `src/hooks/useApi.js` - Updated API hooks
   - ✅ `src/middleware.js` - Updated middleware paths
   - ✅ `src/components/core/Navbar.jsx` - Updated logout endpoint
   - ✅ `src/components/core/Sidebar.jsx` - Updated logout endpoint
   - ✅ `src/components/monitoring/APIMonitoring.jsx` - Updated monitoring endpoints
   - ✅ `src/components/monitoring/ServerMonitoring.jsx` - Updated monitoring endpoints

3. **Removed:**
   - ❌ `src/app/next_api/` folder (deprecated)

---

## 🎯 Best Practices

### 1. **File Naming Conventions**
- Pages: `page.jsx` or `page.js`
- Layouts: `layout.jsx` or `layout.js`
- API Routes: `route.js`
- Components: `PascalCase.jsx` (e.g., `Navbar.jsx`)
- Services: `camelCase.js` (e.g., `authService.js`)
- Hooks: `useCamelCase.js` (e.g., `useAuth.js`)

### 2. **Import Paths**
```javascript
// Use absolute imports with @/ alias
import { apiClient } from '@/lib/apiClient';
import { POSTS } from '@/constants/apiEndpoints';
import PostsService from '@/services/postsService';
```

### 3. **API Route Usage**
```javascript
// ✅ Correct
const response = await fetch('/api/auth/login', {...});

// ❌ Wrong
const response = await fetch('http://localhost:5500/api/...', {...});
const response = await fetch('/next_api/auth/login', {...});
```

### 4. **Service Layer Usage**
```javascript
// ✅ Correct
const result = await PostsService.getAllPosts({ page: 1 });
if (result.success) {
  setPosts(result.data);
}

// ❌ Wrong
const posts = await fetch('/api/posts').then(r => r.json());
```

---

## 📚 Key Documentation Files

- `ARCHITECTURE.md` - Architecture & design patterns
- `FOLDER_STRUCTURE.md` - This file (folder structure)
- `README.md` - Getting started guide
- `ADMIN_ROLE_AUTHENTICATION.md` - Authentication guide
- `IMPACT_LEADERS_INTEGRATION.md` - Impact Leaders integration
- `AGENTS.md` - Agent configuration

---

## 🔧 Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://13.60.221.160
```

---

## 🎨 Component Organization

### Component Structure:
```
Feature/
├── Header.jsx           # Feature header with filters/search
├── CardView.jsx        # Card view display
├── TableView.jsx       # Table view display
├── AddModal.jsx        # Create modal
├── EditModal.jsx       # Edit modal
├── ViewModal.jsx       # View details modal
└── DeleteConfirmModal.jsx  # Delete confirmation
```

---

## ✨ Summary

This admin panel now follows **Next.js 15+ standard practices** with:

- ✅ **Standard API Routes** in `/api/` folder
- ✅ **Clean Service Architecture** with separation of concerns
- ✅ **Centralized API Client** with interceptors
- ✅ **Type-safe Storage Management**
- ✅ **Reusable Custom Hooks**
- ✅ **Component Organization** by feature
- ✅ **Consistent Naming Conventions**
- ✅ **Proper Error Handling**
- ✅ **Token Management** with auto-injection

---

**Last Updated:** 2025-10-11
**Version:** 2.0
**Migration Status:** ✅ Complete
