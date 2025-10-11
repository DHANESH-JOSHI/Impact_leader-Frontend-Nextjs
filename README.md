# 🎯 Admin Panel - Impact Leaders Dashboard

A modern admin dashboard built with **Next.js 15+** following standard best practices and clean architecture patterns.

## 🚀 Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **UI Library:** React 18+
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **HTTP Client:** Custom API Client with interceptors
- **Authentication:** JWT with Impact Leaders API

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # ✅ API Routes (Standard Next.js)
│   ├── dashboard/         # Dashboard pages
│   └── page.js           # Login page
├── components/            # React components
├── services/             # Business logic layer
├── lib/                  # Core utilities
├── constants/            # Application constants
└── hooks/                # Custom React hooks
```

For detailed structure, see [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)

## 🏗️ Architecture

This project follows a **clean service architecture**:

1. **API Client Layer** - Centralized HTTP client with auto token injection
2. **Service Layer** - Business logic and data operations
3. **Component Layer** - UI components and presentation
4. **Hook Layer** - Reusable React hooks

For detailed architecture, see [ARCHITECTURE.md](./ARCHITECTURE.md)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ installed
- npm/yarn/pnpm package manager
- Access to Impact Leaders API

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Admin_Panel
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   cp .env.example .env.local

   # Add your environment variables
   NEXT_PUBLIC_API_BASE_URL=http://13.60.221.160
   ```

4. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication

The admin panel uses Impact Leaders API for authentication:

- **Login Endpoint:** `/api/auth/impact-leaders/login`
- **Logout Endpoint:** `/api/auth/impact-leaders/logout`
- **Token Storage:** localStorage + httpOnly cookies
- **Role Check:** Admin/Super-admin only access

For more details, see [ADMIN_ROLE_AUTHENTICATION.md](./ADMIN_ROLE_AUTHENTICATION.md)

## 📚 API Routes

All API routes follow Next.js standard structure:

### Authentication
- `POST /api/auth/impact-leaders/login` - Admin login
- `POST /api/auth/impact-leaders/logout` - Admin logout

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics

### Monitoring
- `GET /api/monitoring/system` - System metrics
- `GET /api/monitoring/realtime` - Real-time data
- `GET /api/monitoring/api-metrics` - API metrics

### Stories
- `GET /api/stories` - Get all stories
- `POST /api/stories` - Create story
- `GET /api/stories/:id` - Get story by ID
- `PUT /api/stories/:id` - Update story
- `DELETE /api/stories/:id` - Delete story

## 🎨 Features

### Dashboard
- ✅ Real-time statistics
- ✅ Interactive charts
- ✅ Quick actions
- ✅ System notifications

### Content Management
- ✅ Stories management
- ✅ Posts management
- ✅ Q&A management
- ✅ Resources management

### User Management
- ✅ User directory
- ✅ Impact Leaders users
- ✅ Role-based access

### Monitoring
- ✅ API monitoring
- ✅ Server monitoring
- ✅ System health
- ✅ Real-time metrics

### Settings
- ✅ Approvals management
- ✅ File import
- ✅ Messages
- ✅ Notifications
- ✅ Posts settings

## 🔧 Development

### Project Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Code Quality
npm run format          # Format with Prettier
npm run type-check      # TypeScript check
```

### Code Style

- **Components:** PascalCase (e.g., `Navbar.jsx`)
- **Services:** camelCase (e.g., `authService.js`)
- **Hooks:** useCamelCase (e.g., `useAuth.js`)
- **API Routes:** `route.js` in feature folders

### Import Paths

Use absolute imports with `@/` alias:

```javascript
import { apiClient } from '@/lib/apiClient';
import { POSTS } from '@/constants/apiEndpoints';
import PostsService from '@/services/postsService';
```

## 📖 Documentation

- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) - Complete folder structure
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture & design patterns
- [ADMIN_ROLE_AUTHENTICATION.md](./ADMIN_ROLE_AUTHENTICATION.md) - Authentication guide
- [IMPACT_LEADERS_INTEGRATION.md](./IMPACT_LEADERS_INTEGRATION.md) - API integration
- [AGENTS.md](./AGENTS.md) - Agent configuration

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
# Build
npm run build

# Start production server
npm run start
```

## 🔒 Security

- ✅ JWT token authentication
- ✅ Role-based access control
- ✅ httpOnly cookies for tokens
- ✅ Middleware protection
- ✅ Environment variable protection

## 🐛 Troubleshooting

### Common Issues

1. **API not connecting**
   - Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
   - Verify Impact Leaders API is running

2. **Authentication failing**
   - Clear localStorage and cookies
   - Check admin role in Impact Leaders API

3. **Build errors**
   - Delete `.next` folder and rebuild
   - Clear node_modules and reinstall

## 📝 Migration Notes

This project has been migrated to follow Next.js 15+ standards:

- ❌ Old: `/next_api/...` (non-standard)
- ✅ New: `/api/...` (Next.js standard)

All API endpoints have been updated. See [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is proprietary software for TechWithJoshi.

## 👥 Support

For support and questions:
- Check documentation files
- Contact: support@techwithjo shi.com

---

**Built with ❤️ by TechWithJoshi**

**Version:** 2.0
**Last Updated:** 2025-10-11
**Migration Status:** ✅ Complete
