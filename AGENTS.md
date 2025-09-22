# Admin Dashboard - MVC Architecture Guide

## Project Overview
A secure Next.js 15 Admin Dashboard with JWT authentication, MVC architecture, and complete CRUD operations for Stories, Resources, Q&A, and Posts management.

## Commands
- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Start**: `npm run start`
- **Lint**: `npm run lint`

## Architecture

### MVC Structure
```
src/
├── services/           # Business Logic Layer (Model)
├── app/api/           # API Routes (Controller)
├── app/               # Pages (View)
├── components/        # Reusable UI Components
├── hooks/            # Custom React Hooks
├── lib/              # Utilities & Auth
└── middleware.js     # Route Protection
```

### Services (Business Logic)
- `src/services/authService.js` - Authentication & user management
- `src/services/dashboardService.js` - Dashboard stats & analytics
- `src/services/storiesService.js` - Stories CRUD operations
- `src/services/resourcesService.js` - Resources management
- `src/services/qnaService.js` - Q&A management

### API Controllers
- `src/app/api/auth/` - Authentication endpoints
- `src/app/api/dashboard/` - Dashboard data endpoints
- `src/app/api/stories/` - Stories CRUD endpoints

### Authentication System
- **JWT Token**: Stored in HTTP-only cookies
- **Middleware**: `/src/middleware.js` protects all dashboard routes
- **Demo Login**: admin@demo.com / demo123

## Security Features

### Route Protection
- All `/dashboard/*` routes require authentication
- JWT verification via middleware
- Automatic redirect to login on unauthorized access
- Token expiration handling

### API Security
- JWT verification on all protected endpoints
- Consistent error handling
- Input validation
- Secure cookie management

## Pages & Routes

| Route | Protection | Description |
|-------|------------|-------------|
| `/` | Public | Login page |
| `/dashboard` | Protected | Main dashboard |
| `/dashboard/stories` | Protected | Stories management |
| `/dashboard/resources` | Protected | Resources management |
| `/dashboard/qna` | Protected | Q&A management |
| `/dashboard/posts` | Protected | Posts management |
| `/dashboard/settings/*` | Protected | Various settings |

## Hooks & Utilities

### Custom Hooks
- `useAuth()` - Authentication state management
- `useApi()` - API calls with loading/error states
- `useStoriesApi()` - Stories-specific API methods
- `useDashboardApi()` - Dashboard data fetching

### Auth Utilities
- `generateToken()` - JWT token creation
- `verifyToken()` - JWT token validation
- `isAuthenticated()` - Check auth status
- `setAuthCookie()` / `removeAuthCookie()` - Cookie management

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics

### Stories
- `GET /api/stories` - List all stories
- `POST /api/stories` - Create story
- `GET /api/stories/[id]` - Get story by ID
- `PUT /api/stories/[id]` - Update story
- `DELETE /api/stories/[id]` - Delete story

## Development Guidelines

### Code Conventions
- Use async/await for all API calls
- Implement proper error handling in all services
- Follow RESTful API patterns
- Use TypeScript-style JSDoc comments
- Implement loading states for all API operations

### Testing Authentication
1. Navigate to `http://localhost:3000`
2. Use credentials: `admin@demo.com` / `demo123`
3. Should redirect to `/dashboard` on success
4. Try accessing `/dashboard` without login - should redirect to `/`

### Adding New Features
1. Create service in `src/services/`
2. Create API routes in `src/app/api/`
3. Add custom hook in `src/hooks/`
4. Update pages to use the hook
5. Add route protection if needed

## Environment Variables
```
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

## Tech Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS, Framer Motion
- **Authentication**: JWT, bcryptjs, js-cookie
- **UI Components**: Radix UI, Lucide React
- **Development**: Turbopack, ESLint

## Security Notes
- Change JWT_SECRET in production
- Use HTTPS in production
- Consider implementing refresh tokens for long-term sessions
- Add rate limiting for API endpoints
- Implement proper CORS policies
