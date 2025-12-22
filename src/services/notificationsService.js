import { apiClient } from '@/lib/apiClient';
import { NOTIFICATIONS, ADMIN } from '@/constants/apiEndpoints';

export class NotificationsService {
  static async getNotifications(params = {}) {
    try {
      const { 
        page = 1, 
        limit = 20,
        type,
        isRead,
        priority 
      } = params;
      
      const queryParams = {
        page,
        limit,
        ...(type && { type }),
        ...(isRead !== undefined && { isRead }),
        ...(priority && { priority }),
      };

      const response = await apiClient.get(NOTIFICATIONS.BASE, { params: queryParams });
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || [],
        pagination: backendResponse.pagination || {},
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Get notifications error:', error);
      return {
        success: false,
        data: [],
        pagination: {},
        message: error.message
      };
    }
  }

  static async getUnreadCount() {
    try {
      const response = await apiClient.get(NOTIFICATIONS.UNREAD_COUNT);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse.count || 0,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Get unread count error:', error);
      return {
        success: false,
        data: 0,
        message: error.message
      };
    }
  }


  static async markAsRead(notificationId) {
    try {
      const endpoint = NOTIFICATIONS.MARK_READ ? NOTIFICATIONS.MARK_READ(notificationId) : `/notifications/${notificationId}/mark-read`;
      const response = await apiClient.post(endpoint, {});
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Mark notification as read error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  static async markAllAsRead() {
    try {
      const endpoint = NOTIFICATIONS.MARK_ALL_READ;
      const response = await apiClient.post(endpoint, {});
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Mark all as read error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async deleteNotification(notificationId) {
    try {
      const response = await apiClient.delete(NOTIFICATIONS.BY_ID(notificationId));
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Delete notification error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async createAnnouncement(announcementData) {
    try {
      // Backend route: POST /api/v1/notifications/announcement
      const response = await apiClient.post(`${NOTIFICATIONS.BASE}/announcement`, announcementData);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Create announcement error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  static async sendTargetedNotification(notificationData) {
    try {
      const response = await apiClient.post(ADMIN.SETTINGS.NOTIFICATIONS || '/admin/notifications/send', notificationData);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Send targeted notification error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getNotificationTemplates() {
    try {
      const response = await apiClient.get(ADMIN.SETTINGS.NOTIFICATIONS || '/admin/notifications/templates');
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Get notification templates error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async createNotificationTemplate(templateData) {
    try {
      const response = await apiClient.post(ADMIN.SETTINGS.NOTIFICATIONS || '/admin/notifications/templates', templateData);
      const backendResponse = response.data || {};

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

  static async getNotificationStats(params = {}) {
    try {
      const { startDate, endDate, type } = params;
      
      const queryParams = {
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(type && { type }),
      };

      const response = await apiClient.get(ADMIN.SETTINGS.NOTIFICATIONS || '/admin/notifications/stats', { params: queryParams });
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Get notification stats error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async updateNotificationPreferences(preferences) {
    try {
      const response = await apiClient.put(NOTIFICATIONS.PREFERENCES, preferences);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Update notification preferences error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getNotificationPreferences() {
    try {
      const response = await apiClient.get(NOTIFICATIONS.PREFERENCES);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Get notification preferences error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

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

  static getNotificationPriorities() {
    return [
      { value: 'low', label: 'Low', color: '#6b7280' },
      { value: 'medium', label: 'Medium', color: '#f59e0b' },
      { value: 'high', label: 'High', color: '#ef4444' },
      { value: 'urgent', label: 'Urgent', color: '#dc2626' }
    ];
  }

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

  static getDeliveryMethods() {
    return [
      { value: 'in_app', label: 'In-App Notification' },
      { value: 'email', label: 'Email' },
      { value: 'push', label: 'Push Notification' },
      { value: 'sms', label: 'SMS (Premium)' }
    ];
  }

}
