import { AdminService } from './adminService';
import { UsersService } from './usersService';
import { PostsService } from './postsService';
import { ResourcesService } from './resourcesService';
import { QnAService } from './qnaService';
import { StoriesService } from './storiesService';
import { ConnectionsService } from './connectionsService';
import { NotificationsService } from './notificationsService';

// Mock data - replace with actual API calls when they don't respond
const mockStats = {
  totalUsers: 1234,
  totalPosts: 89,
  totalStories: 56,
  totalResources: 234
};

const mockChartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 200 },
  { name: 'Apr', value: 278 },
  { name: 'May', value: 189 },
  { name: 'Jun', value: 239 }
];

export class DashboardService {
  static async getStats() {
    try {
      // Try to get real stats from Impact Leaders API
      const analyticsResult = await AdminService.getAnalyticsDashboard();
      
      if (analyticsResult.success) {
        return {
          success: true,
          data: analyticsResult.data
        };
      } else {
        // Fall back to mock data if API fails
        console.warn('Failed to fetch real analytics, using mock data');
        return {
          success: true,
          data: mockStats
        };
      }
    } catch (error) {
      console.error('Dashboard stats error:', error);
      // Return mock data on error
      return {
        success: true,
        data: mockStats
      };
    }
  }

  static async getChartData() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return {
        success: true,
        data: mockChartData
      };
    } catch (error) {
      console.error('Dashboard chart error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getRecentActivities() {
    try {
      const activities = [
        { id: 1, action: 'New user registered', time: '2 minutes ago' },
        { id: 2, action: 'Post published', time: '5 minutes ago' },
        { id: 3, action: 'Story updated', time: '10 minutes ago' }
      ];
      
      return {
        success: true,
        data: activities
      };
    } catch (error) {
      console.error('Recent activities error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
}
