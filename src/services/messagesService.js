import { apiClient } from '@/lib/apiClient';
import { MESSAGES, ADMIN } from '@/constants/apiEndpoints';

export class MessagesService {
  static async getConversations(params = {}) {
    try {
      const { page = 1, limit = 20, search, status } = params;

      const queryParams = {
        page,
        limit,
      };

      if (search) queryParams.search = search;
      if (status) queryParams.status = status;

      const response = await apiClient.get(MESSAGES.CONVERSATIONS, {
        params: queryParams
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        pagination: backendResponse.pagination,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Get conversations error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getConversationMessages(conversationId, params = {}) {
    try {
      const { page = 1, limit = 50, before, after } = params;

      const queryParams = {
        page,
        limit,
      };

      if (before) queryParams.before = before;
      if (after) queryParams.after = after;

      const response = await apiClient.get(`${MESSAGES.CONVERSATION_BY_ID(conversationId)}/messages`, {
        params: queryParams
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        otherUser: backendResponse.otherUser,
        pagination: backendResponse.pagination,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Get conversation messages error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async sendMessage(messageData) {
    try {
      const response = await apiClient.post(MESSAGES.BASE, messageData);
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Send message error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async sendMessageWithAttachment(messageData, attachmentFile) {
    try {
      const formData = new FormData();
      formData.append("recipientId", messageData.recipientId);
      formData.append("content", messageData.content);
      formData.append("messageType", messageData.messageType || "text");
      if (attachmentFile) {
        formData.append("attachment", attachmentFile);
      }

      const response = await apiClient.upload(MESSAGES.UPLOAD, formData);
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Send message with attachment error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async markMessageAsRead(messageId) {
    try {
      const response = await apiClient.put(MESSAGES.READ(messageId), {});
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Mark message as read error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async markConversationAsRead(conversationId) {
    try {
      const response = await apiClient.post(`${MESSAGES.CONVERSATION_BY_ID(conversationId)}/read`, {});
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Mark conversation as read error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async deleteMessage(messageId) {
    try {
      const response = await apiClient.delete(MESSAGES.DELETE(messageId));
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Delete message error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async deleteConversation(conversationId, secondUserId = null) {
    try {
      const params = {};
      if (secondUserId) {
        params.secondUserId = secondUserId;
      }
      
      const response = await apiClient.delete(MESSAGES.CONVERSATION_BY_ID(conversationId), {
        params
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Delete conversation error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async archiveConversation(conversationId) {
    try {
      const response = await apiClient.post(`${MESSAGES.CONVERSATION_BY_ID(conversationId)}/archive`, {});
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Archive conversation error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async unarchiveConversation(conversationId) {
    try {
      const response = await apiClient.post(`${MESSAGES.CONVERSATION_BY_ID(conversationId)}/unarchive`, {});
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Unarchive conversation error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async blockUser(userId) {
    try {
      const response = await apiClient.post(MESSAGES.BLOCK_USER(userId), {});
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Block user error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async unblockUser(userId) {
    try {
      const response = await apiClient.post(MESSAGES.UNBLOCK_USER(userId), {});
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Unblock user error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getBlockedUsers(params = {}) {
    try {
      const { page = 1, limit = 20 } = params;

      const response = await apiClient.get(MESSAGES.BLOCKED_USERS, {
        params: { page, limit }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        pagination: backendResponse.pagination,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Get blocked users error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getUnreadCount() {
    try {
      const response = await apiClient.get(MESSAGES.UNREAD_COUNT);
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Get unread count error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getAllMessages(params = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        messageType,
        status,
        startDate,
        endDate,
        senderId,
        recipientId,
      } = params;

      const queryParams = {
        page,
        limit,
      };

      if (search) queryParams.search = search;
      if (messageType) queryParams.messageType = messageType;
      if (status) queryParams.status = status;
      if (startDate) queryParams.startDate = startDate;
      if (endDate) queryParams.endDate = endDate;
      if (senderId) queryParams.senderId = senderId;
      if (recipientId) queryParams.recipientId = recipientId;

      const response = await apiClient.get(ADMIN.MESSAGES.BASE, {
        params: queryParams
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        pagination: backendResponse.pagination,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Get all messages (admin) error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getMessageAnalytics(params = {}) {
    try {
      const { timeframe = "30d", groupBy = "day" } = params;

      const response = await apiClient.get(ADMIN.MESSAGES.ANALYTICS, {
        params: { timeframe, groupBy }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Get message analytics error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async adminDeleteMessage(messageId, reason = "") {
    try {
      const response = await apiClient.delete(ADMIN.MESSAGES.BY_ID(messageId));
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Admin delete message error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static getMessageTypes() {
    return [
      { value: "text", label: "Text" },
      { value: "image", label: "Image" },
      { value: "file", label: "File" },
      { value: "link", label: "Link" },
      { value: "location", label: "Location" },
    ];
  }

  static getMessageStatuses() {
    return [
      { value: "sent", label: "Sent" },
      { value: "delivered", label: "Delivered" },
      { value: "read", label: "Read" },
      { value: "failed", label: "Failed" },
    ];
  }

  static getConversationStatuses() {
    return [
      { value: "active", label: "Active" },
      { value: "archived", label: "Archived" },
      { value: "blocked", label: "Blocked" },
      { value: "deleted", label: "Deleted" },
    ];
  }

  static async getChatHistory(userId, params = {}) {
    try {
      const { page = 1, limit = 50 } = params;

      const response = await apiClient.get(MESSAGES.BY_USER_ID(userId), {
        params: { page, limit }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        pagination: backendResponse.pagination,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Get chat history error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async send1to1Message(messageData, attachmentFile = null) {
    try {
      const formData = new FormData();
      formData.append("recipientId", messageData.recipientId);
      formData.append("content", messageData.content);
      formData.append("type", messageData.type || "text");

      if (attachmentFile) {
        formData.append("attachment", attachmentFile);
      }

      const response = await apiClient.upload(MESSAGES.BASE, formData);
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Send 1-to-1 message error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async searchMessages(params = {}) {
    try {
      const { query, userId } = params;

      const queryParams = {
        query: query || "",
      };

      if (userId) queryParams.userId = userId;

      const response = await apiClient.get(MESSAGES.SEARCH, {
        params: queryParams
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Search messages error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async createGroup(groupData, groupImageFile = null) {
    try {
      const formData = new FormData();
      formData.append("groupName", groupData.groupName);
      formData.append("groupDescription", groupData.groupDescription || "");
      formData.append("memberIds", JSON.stringify(groupData.memberIds || []));

      if (groupImageFile) {
        formData.append("groupImage", groupImageFile);
      }

      const response = await apiClient.post(MESSAGES.GROUPS, formData, {
        isFormData: true
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Create group error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getGroupDetails(groupId) {
    try {
      const response = await apiClient.get(MESSAGES.GROUP_BY_ID(groupId));
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Get group details error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async updateGroup(groupId, groupData, groupImageFile = null) {
    try {
      const formData = new FormData();
      if (groupData.groupName) formData.append("groupName", groupData.groupName);
      if (groupData.groupDescription) formData.append("groupDescription", groupData.groupDescription);

      if (groupImageFile) {
        formData.append("groupImage", groupImageFile);
      }

      const response = await apiClient.put(MESSAGES.GROUP_BY_ID(groupId), formData, {
        isFormData: true
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Update group error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async addGroupMembers(groupId, memberIds) {
    try {
      const response = await apiClient.post(MESSAGES.GROUP_MEMBERS(groupId), {
        memberIds
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Add group members error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async removeGroupMember(groupId, userId) {
    try {
      const response = await apiClient.delete(MESSAGES.GROUP_MEMBER_BY_ID(groupId, userId));
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Remove group member error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async leaveGroup(groupId) {
    try {
      const response = await apiClient.post(MESSAGES.GROUP_LEAVE(groupId), {});
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Leave group error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async deleteGroup(groupId) {
    try {
      const response = await apiClient.delete(MESSAGES.GROUP_BY_ID(groupId));
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Delete group error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getGroupMessages(groupId, params = {}) {
    try {
      const { page = 1, limit = 50 } = params;

      const response = await apiClient.get(MESSAGES.GROUP_MESSAGES(groupId), {
        params: { page, limit }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        pagination: backendResponse.pagination,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Get group messages error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async sendGroupMessage(groupId, messageData, attachmentFile = null) {
    try {
      const formData = new FormData();
      formData.append("groupId", groupId);
      formData.append("content", messageData.content);
      formData.append("type", messageData.type || "text");

      if (attachmentFile) {
        formData.append("attachment", attachmentFile);
      }

      const response = await apiClient.upload(MESSAGES.BASE, formData);
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Messages] Send group message error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
