import { ExternalApiService } from './externalApiService';
import { ImpactLeadersAuthService } from './impactLeadersAuthService';

export class NotificationsService {

  // Get user notifications
  static async getNotifications(params = {}) {
    try {
      const { 
        page = 1, 
        limit = 20,
        type,
        isRead,
        priority 
      } = params;
      
      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (type) queryParams.append('type', type);
      if (isRead !== undefined) queryParams.append('isRead', isRead.toString());
      if (priority) queryParams.append('priority', priority);

      const endpoint = `/notifications?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get notifications error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get unread notifications count
  static async getUnreadCount() {
    try {
      const response = await ExternalApiService.get('/notifications/unread/count');

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get unread count error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId) {
    try {
      const response = await ExternalApiService.post(`/notifications/${notificationId}/read`, {});

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Mark notification as read error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Mark all notifications as read
  static async markAllAsRead() {
    try {
      const response = await ExternalApiService.post('/notifications/read-all', {});

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Mark all as read error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Delete notification
  static async deleteNotification(notificationId) {
    try {
      const response = await ExternalApiService.delete(`/notifications/${notificationId}`);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Delete notification error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Create announcement (Admin only)
  static async createAnnouncement(announcementData) {
    try {
      const response = await ExternalApiService.post('/notifications/announcement', announcementData);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Create announcement error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Send targeted notification (Admin only)
  static async sendTargetedNotification(notificationData) {
    try {
      const response = await ExternalApiService.post('/admin/notifications/send', notificationData);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Send targeted notification error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get notification templates (Admin only)
  static async getNotificationTemplates() {
    try {
      const response = await ExternalApiService.get('/admin/notifications/templates');

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get notification templates error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Create notification template (Admin only)
  static async createNotificationTemplate(templateData) {
    try {
      const response = await ExternalApiService.post('/admin/notifications/templates', templateData);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Create notification template error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get notification statistics (Admin only)
  static async getNotificationStats(params = {}) {
    try {
      const { startDate, endDate, type } = params;
      
      let queryParams = new URLSearchParams();
      
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      if (type) queryParams.append('type', type);

      const endpoint = `/admin/notifications/stats?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get notification stats error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Update notification preferences
  static async updateNotificationPreferences(preferences) {
    try {
      const response = await ExternalApiService.put('/notifications/preferences', preferences);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Update notification preferences error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get notification preferences
  static async getNotificationPreferences() {
    try {
      const response = await ExternalApiService.get('/notifications/preferences');

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get notification preferences error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get notification types
  static getNotificationTypes() {
    return [
      { value: 'connection_request', label: 'Connection Request', icon: '👥' },
      { value: 'connection_accepted', label: 'Connection Accepted', icon: '✅' },
      { value: 'post_like', label: 'Post Like', icon: '👍' },
      { value: 'post_comment', label: 'Post Comment', icon: '💬' },
      { value: 'question_answered', label: 'Question Answered', icon: '❓' },
      { value: 'answer_accepted', label: 'Answer Accepted', icon: '✅' },
      { value: 'resource_shared', label: 'Resource Shared', icon: '📁' },
      { value: 'story_viewed', label: 'Story Viewed', icon: '👁️' },
      { value: 'message_received', label: 'Message Received', icon: '📨' },
      { value: 'announcement', label: 'Announcement', icon: '📢' },
      { value: 'system', label: 'System', icon: '⚙️' },
      { value: 'reminder', label: 'Reminder', icon: '⏰' }
    ];
  }

  // Get notification priorities
  static getNotificationPriorities() {
    return [
      { value: 'low', label: 'Low', color: '#6b7280' },
      { value: 'medium', label: 'Medium', color: '#f59e0b' },
      { value: 'high', label: 'High', color: '#ef4444' },
      { value: 'urgent', label: 'Urgent', color: '#dc2626' }
    ];
  }

  // Get target user options for admin notifications
  static getTargetUserOptions() {
    return [
      { value: 'all', label: 'All Users' },
      { value: 'active', label: 'Active Users (last 30 days)' },
      { value: 'new', label: 'New Users (last 7 days)' },
      { value: 'admins', label: 'Admins Only' },
      { value: 'moderators', label: 'Moderators Only' },
      { value: 'custom', label: 'Custom Selection' }
    ];
  }

  // Get notification delivery methods
  static getDeliveryMethods() {
    return [
      { value: 'in_app', label: 'In-App Notification' },
      { value: 'email', label: 'Email' },
      { value: 'push', label: 'Push Notification' },
      { value: 'sms', label: 'SMS (Premium)' }
    ];
  }
}
