import { AdminService } from './adminService';
import { NotificationsService } from './notificationsService';

export class DashboardService {
  /**
   * Get dashboard statistics
   * Fetches real-time stats from Impact Leaders API
   */
  static async getStats() {
    try {
      const analyticsResult = await AdminService.getAnalyticsDashboard();

      if (analyticsResult.success) {
        return {
          success: true,
          data: analyticsResult.data
        };
      } else {
        console.error('[DashboardService] Failed to fetch analytics:', analyticsResult.message);
        return {
          success: false,
          message: analyticsResult.message || 'Failed to fetch dashboard stats',
          data: null
        };
      }
    } catch (error) {
      console.error('[DashboardService] Stats error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch dashboard stats',
        data: null
      };
    }
  }

  /**
   * Get chart data for dashboard visualizations
   * This should call the appropriate analytics endpoint when available
   */
  static async getChartData(params = {}) {
    try {
      const { timeframe = '30d', groupBy = 'day' } = params;

      // Try to get analytics data from the API
      const analyticsResult = await AdminService.getAnalyticsDashboard();

      if (analyticsResult.success && analyticsResult.data) {
        // Transform the data for chart display if needed
        return {
          success: true,
          data: analyticsResult.data
        };
      } else {
        console.error('[DashboardService] Failed to fetch chart data');
        return {
          success: false,
          message: 'Failed to fetch chart data',
          data: []
        };
      }
    } catch (error) {
      console.error('[DashboardService] Chart data error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch chart data',
        data: []
      };
    }
  }

  /**
   * Get recent activities/notifications
   * This should call a dedicated activity feed endpoint when available
   */
  static async getRecentActivities(params = {}) {
    try {
      const { page = 1, limit = 10 } = params;

      // Try to get recent notifications or activities
      const notificationsResult = await NotificationsService.getAllNotifications({
        page,
        limit
      });

      if (notificationsResult.success) {
        return {
          success: true,
          data: notificationsResult.data
        };
      } else {
        console.error('[DashboardService] Failed to fetch activities');
        return {
          success: false,
          message: 'Failed to fetch recent activities',
          data: []
        };
      }
    } catch (error) {
      console.error('[DashboardService] Recent activities error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch recent activities',
        data: []
      };
    }
  }

  /**
   * Get system health status
   */
  static async getSystemHealth() {
    try {
      // This would call a system health endpoint if available
      return {
        success: true,
        data: {
          status: 'operational',
          uptime: '99.9%',
          lastChecked: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('[DashboardService] System health error:', error);
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
  }
}
