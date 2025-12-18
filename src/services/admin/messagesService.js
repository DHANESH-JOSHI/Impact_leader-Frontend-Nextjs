import { apiClient } from "@/lib/apiClient";

/**
 * Messages Service - Handles messaging and chat functionality
 * Based on /api/v1/messages endpoints
 */
export class MessagesService {
  /**
   * Get user conversations
   * GET /api/v1/messages/conversations
   */
  static async getConversations(params = {}) {
    try {
      const response = await apiClient.get('/messages/conversations', { params });
      return response;
    } catch (error) {
      console.error('[MessagesService] Error fetching conversations:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get messages between two users
   * GET /api/v1/messages/:userId
   */
  static async getMessages(userId, params = {}) {
    try {
      const response = await apiClient.get(`/messages/${userId}`, { params });
      return response;
    } catch (error) {
      console.error('[MessagesService] Error fetching messages:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Send message (with media upload support)
   * POST /api/v1/messages
   */
  static async sendMessage(data) {
    try {
      let response;

      // If sending with media, use FormData
      if (data.media || data instanceof FormData) {
        response = await apiClient.upload('/messages', data);
      } else {
        response = await apiClient.post('/messages', data);
      }

      return response;
    } catch (error) {
      console.error('[MessagesService] Error sending message:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Mark message as read
   * PUT /api/v1/messages/:id/read
   */
  static async markAsRead(messageId) {
    try {
      const response = await apiClient.put(`/messages/${messageId}/read`);
      return response;
    } catch (error) {
      console.error('[MessagesService] Error marking message as read:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Delete message
   * DELETE /api/v1/messages/:id
   */
  static async deleteMessage(messageId) {
    try {
      const response = await apiClient.delete(`/messages/${messageId}`);
      return response;
    } catch (error) {
      console.error('[MessagesService] Error deleting message:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get unread message count
   * GET /api/v1/messages/unread/count
   */
  static async getUnreadCount() {
    try {
      const response = await apiClient.get('/messages/unread/count');
      return response;
    } catch (error) {
      console.error('[MessagesService] Error fetching unread count:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Search messages
   * GET /api/v1/messages/search
   */
  static async searchMessages(params = {}) {
    try {
      const response = await apiClient.get('/messages/search', { params });
      return response;
    } catch (error) {
      console.error('[MessagesService] Error searching messages:', error);
      return { success: false, message: error.message };
    }
  }
}
