# Impact Leaders API Integration

This document explains the comprehensive integration of the Impact Leaders API with the Admin Dashboard.

## 🚀 Overview

The admin dashboard now fully integrates with the Impact Leaders mobile app backend API, allowing you to manage all aspects of the mobile application from a centralized web interface.

## 🔧 Services Created

### Core Services

1. **ExternalApiService** - Base service for all API communications
2. **ImpactLeadersAuthService** - Authentication with the Impact Leaders API
3. **PostsService** - Manage posts, comments, polls, and social interactions
4. **StoriesService** - Create and manage stories (text, image, video)
5. **ResourcesService** - Upload and manage resources (documents, videos, audio, images)
6. **QnAService** - Manage Q&A forum questions and answers
7. **UsersService** - User management, profiles, and permissions
8. **ConnectionsService** - Manage user connections and networking
9. **NotificationsService** - Send notifications and manage alerts
10. **AdminService** - Administrative functions and analytics

## 🎯 Features Integrated

### ✅ Authentication System
- Login with email/password
- OTP authentication support
- Token management and refresh
- Secure session handling

### ✅ User Management
- View all users with filtering
- User profile management
- Role and permission management
- User activity tracking
- Bulk user operations

### ✅ Content Management

#### Posts & Social
- Create text posts
- Create posts with images
- Create poll posts
- Manage comments and interactions
- Content moderation
- Post analytics

#### Stories
- Create text stories with custom backgrounds
- Upload image stories
- Upload video stories
- Story analytics and management
- Featured story management

#### Resources
- Upload documents (PDF, DOC, XLS, etc.)
- Upload videos (MP4, AVI, MOV, etc.)
- Upload audio files (MP3, WAV, AAC, etc.)
- Upload images (JPG, PNG, SVG, etc.)
- Resource categorization and tagging
- Download tracking

### ✅ Community Features

#### Q&A Forum
- Question and answer management
- Category organization
- Answer approval system
- Community moderation

#### Connections
- Connection request management
- User networking analytics
- Connection suggestions

### ✅ Communication

#### Notifications
- Send announcements to all users
- Targeted notifications by theme/location
- Notification templates
- Delivery tracking

### ✅ Administrative Features
- Real-time analytics dashboard
- Content approval system
- Flagged content management
- System health monitoring
- Audit logs
- Data export capabilities

## 🔗 API Endpoints Integrated

All major Impact Leaders API endpoints are now integrated:

- **Authentication**: `/api/v1/auth/*`
- **Users**: `/api/v1/users/*`
- **Posts**: `/api/v1/posts/*`
- **Stories**: `/api/v1/stories/*`
- **Resources**: `/api/v1/resources/*`
- **Q&A**: `/api/v1/qa/*`
- **Connections**: `/api/v1/connections/*`
- **Notifications**: `/api/v1/notifications/*`
- **Admin Functions**: `/api/v1/admin/*`

## 🎨 Dashboard Pages

### Main Dashboard
- **URL**: `/dashboard/impact-leaders`
- **Features**: Overview of all services, quick actions, recent activity

### API Status Monitor
- **URL**: `/dashboard/impact-leaders/api-status`
- **Features**: Real-time API health monitoring, endpoint status, response times

### User Management
- **URL**: `/dashboard/impact-leaders/users` (to be created)
- **Features**: User listing, profiles, permissions, bulk operations

### Content Management
- **Posts**: `/dashboard/impact-leaders/posts`
- **Stories**: `/dashboard/impact-leaders/stories`
- **Resources**: `/dashboard/impact-leaders/resources`
- **Q&A**: `/dashboard/impact-leaders/qna`

### Communication
- **Notifications**: `/dashboard/impact-leaders/notifications`

## 🚀 Getting Started

### 1. Environment Setup
Create/update your `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=http://13.60.221.160
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

### 2. Authentication (Admin Only)
1. Go to `/` (login page)
2. Enter Impact Leaders API credentials **with admin privileges**
3. System will authenticate with the external API
4. **Role Verification**: Only users with `admin`, `super-admin` roles or `admin_access` permission can login
5. Upon successful admin authentication, you'll be redirected to the dashboard

**Note**: Non-admin users will receive "Access denied" error even with valid credentials.

### 3. API Management
1. Visit `/dashboard/impact-leaders` for the main admin panel
2. Use `/dashboard/impact-leaders/api-status` to monitor API health
3. Navigate to specific management sections as needed

## 🔒 Security Features

- JWT token management with automatic refresh
- Secure cookie storage
- API request authentication
- Role-based access control
- Input validation and sanitization
- Error handling and logging

## 📊 Analytics & Monitoring

- Real-time API health monitoring
- Response time tracking
- User activity analytics
- Content engagement metrics
- System performance monitoring
- Error rate tracking

## 🛠️ Development Features

- Hot reload during development
- Comprehensive error handling
- Loading states and user feedback
- Responsive design for all screen sizes
- Accessibility support
- TypeScript-ready (JSDoc annotations)

## 🔄 API Testing

The system includes built-in API testing capabilities:
- Health check endpoint validation
- Authentication flow testing
- Service availability monitoring
- Response time measurement
- Error handling validation

## 📝 Usage Examples

### Creating a New Post
```javascript
import { PostsService } from '@/services/postsService';

const postData = {
  title: "New CSR Initiative",
  content: "Description of the initiative...",
  type: "announcement",
  themes: ["sustainability", "community"],
  tags: ["csr", "announcement"],
  isPublic: true
};

const result = await PostsService.createPost(postData);
```

### Uploading a Resource
```javascript
import { ResourcesService } from '@/services/resourcesService';

const resourceData = {
  title: "CSR Report 2024",
  description: "Annual CSR impact report",
  category: "reports",
  themes: ["sustainability", "impact"],
  tags: ["report", "2024", "csr"]
};

const result = await ResourcesService.uploadDocumentResource(resourceData, file);
```

### Sending a Notification
```javascript
import { NotificationsService } from '@/services/notificationsService';

const notificationData = {
  title: "System Maintenance",
  message: "Scheduled maintenance tonight from 2-4 AM",
  targetUsers: "all",
  priority: "high"
};

const result = await NotificationsService.createAnnouncement(notificationData);
```

## 🎯 Next Steps

1. **Complete UI Implementation**: Create remaining management interfaces
2. **Advanced Analytics**: Add more detailed reporting and charts
3. **Real-time Features**: Implement WebSocket connections for live updates
4. **Mobile Optimization**: Enhance mobile admin experience
5. **Advanced Permissions**: Implement granular role-based permissions
6. **Data Visualization**: Add charts and graphs for better insights
7. **Automated Testing**: Add comprehensive test suites
8. **Performance Optimization**: Implement caching and optimization strategies

## 🐛 Troubleshooting

### Common Issues:

1. **API Connection Fails**: Check the `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
2. **Authentication Issues**: Verify the Impact Leaders API credentials
3. **CORS Errors**: Ensure the API server allows requests from your domain
4. **Token Expiration**: The system handles token refresh automatically

### Debug Tools:

- Check browser console for API request details
- Use the API Status Monitor at `/dashboard/impact-leaders/api-status`
- Monitor network tab for request/response details
- Check server logs for backend issues

## 📞 Support

For issues or questions regarding this integration:
1. Check the API Status Monitor first
2. Review browser console for errors
3. Verify environment configuration
4. Check network connectivity to the API server

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**API Compatibility**: Impact Leaders API v1.0
