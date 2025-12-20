import { ExternalApiService } from "./externalApiService";
import { AuthService } from "./authService";

export class MessagesService {
  static async getConversations(params = {}) {
    try {
      const { page = 1, limit = 20, search, status } = params;

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) queryParams.append("search", search);
      if (status) queryParams.append("status", status);

      const endpoint = `/messages/conversations?${queryParams.toString()}`;
      const response = await ExternalApiService.get(
        endpoint,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get conversations error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getConversationMessages(conversationId, params = {}) {
    try {
      const { page = 1, limit = 50, before, after } = params;

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (before) queryParams.append("before", before);
      if (after) queryParams.append("after", after);

      const endpoint = `/messages/conversations/${conversationId}/messages?${queryParams.toString()}`;
      const response = await ExternalApiService.get(
        endpoint,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get conversation messages error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Send a new message
  static async sendMessage(messageData) {
    try {
      const response = await ExternalApiService.post(
        "/messages",
        messageData,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Send message error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Send message with attachment
  static async sendMessageWithAttachment(messageData, attachmentFile) {
    try {
      const formData = new FormData();
      formData.append("recipientId", messageData.recipientId);
      formData.append("content", messageData.content);
      formData.append("messageType", messageData.messageType || "text");
      if (attachmentFile) {
        formData.append("attachment", attachmentFile);
      }

      const response = await ExternalApiService.post(
        "/messages/upload",
        formData,
        undefined,
        true // isFormData
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Send message with attachment error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Mark message as read
  static async markMessageAsRead(messageId) {
    try {
      const response = await ExternalApiService.post(
        `/messages/${messageId}/read`,
        {},
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Mark message as read error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Mark conversation as read
  static async markConversationAsRead(conversationId) {
    try {
      const response = await ExternalApiService.post(
        `/messages/conversations/${conversationId}/read`,
        {},
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Mark conversation as read error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async deleteMessage(messageId) {
    try {
      const response = await ExternalApiService.delete(
        `/messages/${messageId}`,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Delete message error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async deleteConversation(conversationId) {
    try {
      const response = await ExternalApiService.delete(
        `/messages/conversations/${conversationId}`,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Delete conversation error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Archive conversation
  static async archiveConversation(conversationId) {
    try {
      const response = await ExternalApiService.post(
        `/messages/conversations/${conversationId}/archive`,
        {},
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Archive conversation error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Unarchive conversation
  static async unarchiveConversation(conversationId) {
    try {
      const response = await ExternalApiService.post(
        `/messages/conversations/${conversationId}/unarchive`,
        {},
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Unarchive conversation error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Block user
  static async blockUser(userId) {
    try {
      const response = await ExternalApiService.post(
        `/messages/users/${userId}/block`,
        {},
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Block user error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Unblock user
  static async unblockUser(userId) {
    try {
      const response = await ExternalApiService.post(
        `/messages/users/${userId}/unblock`,
        {},
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Unblock user error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getBlockedUsers(params = {}) {
    try {
      const { page = 1, limit = 20 } = params;

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const endpoint = `/messages/blocked-users?${queryParams.toString()}`;
      const response = await ExternalApiService.get(
        endpoint,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get blocked users error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getUnreadCount() {
    try {
      const response = await ExternalApiService.get(
        "/messages/unread/count",
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get unread count error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Admin: Get all messages (admin only)
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

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) queryParams.append("search", search);
      if (messageType) queryParams.append("messageType", messageType);
      if (status) queryParams.append("status", status);
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);
      if (senderId) queryParams.append("senderId", senderId);
      if (recipientId) queryParams.append("recipientId", recipientId);

      const endpoint = `/admin/messages?${queryParams.toString()}`;
      const response = await ExternalApiService.get(
        endpoint,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get all messages (admin) error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Admin: Get message analytics
  static async getMessageAnalytics(params = {}) {
    try {
      const { timeframe = "30d", groupBy = "day" } = params;

      let queryParams = new URLSearchParams({
        timeframe,
        groupBy,
      });

      const endpoint = `/admin/messages/analytics?${queryParams.toString()}`;
      const response = await ExternalApiService.get(
        endpoint,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get message analytics error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Admin: Delete message (admin action)
  static async adminDeleteMessage(messageId, reason = "") {
    try {
      const response = await ExternalApiService.delete(
        `/admin/messages/${messageId}`,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Admin delete message error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Message types
  static getMessageTypes() {
    return [
      { value: "text", label: "Text" },
      { value: "image", label: "Image" },
      { value: "file", label: "File" },
      { value: "link", label: "Link" },
      { value: "location", label: "Location" },
    ];
  }


  // Message status options
  static getMessageStatuses() {
    return [
      { value: "sent", label: "Sent" },
      { value: "delivered", label: "Delivered" },
      { value: "read", label: "Read" },
      { value: "failed", label: "Failed" },
    ];
  }


  // Conversation status options
  static getConversationStatuses() {
    return [
      { value: "active", label: "Active" },
      { value: "archived", label: "Archived" },
      { value: "blocked", label: "Blocked" },
      { value: "deleted", label: "Deleted" },
    ];
  }


  // ==================== 1-to-1 Chat Functions ====================
  static async getChatHistory(userId, params = {}) {
    try {
      const { page = 1, limit = 50 } = params;

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const endpoint = `/messages/${userId}?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get chat history error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Send 1-to-1 message (text or file)
  static async send1to1Message(messageData, attachmentFile = null) {
    try {
      const formData = new FormData();
      formData.append("recipientId", messageData.recipientId);
      formData.append("content", messageData.content);
      formData.append("type", messageData.type || "text");

      if (attachmentFile) {
        formData.append("attachment", attachmentFile);
      }

      const response = await ExternalApiService.post(
        "/messages",
        formData,
        undefined,
        true // isFormData
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Send 1-to-1 message error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async searchMessages(params = {}) {
    try {
      const { query, userId } = params;

      let queryParams = new URLSearchParams({
        query: query || "",
      });

      if (userId) queryParams.append("userId", userId);

      const endpoint = `/messages/search?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Search messages error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // ==================== Group Management Functions ====================
  static async createGroup(groupData, groupImageFile = null) {
    try {
      const formData = new FormData();
      formData.append("groupName", groupData.groupName);
      formData.append("groupDescription", groupData.groupDescription || "");
      formData.append("memberIds", JSON.stringify(groupData.memberIds || []));

      if (groupImageFile) {
        formData.append("groupImage", groupImageFile);
      }

      const response = await ExternalApiService.post(
        "/messages/groups",
        formData,
        undefined,
        true // isFormData
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Create group error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getGroupDetails(groupId) {
    try {
      const endpoint = `/messages/groups/${groupId}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get group details error:", error);
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

      const response = await ExternalApiService.put(
        `/messages/groups/${groupId}`,
        formData,
        undefined,
        true // isFormData
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Update group error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Add members to group (Creator only)
  static async addGroupMembers(groupId, memberIds) {
    try {
      const response = await ExternalApiService.post(
        `/messages/groups/${groupId}/members`,
        { memberIds }
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Add group members error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Remove member from group (Creator only)
  static async removeGroupMember(groupId, userId) {
    try {
      const response = await ExternalApiService.delete(
        `/messages/groups/${groupId}/members/${userId}`
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Remove group member error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Leave group
  static async leaveGroup(groupId) {
    try {
      const response = await ExternalApiService.post(
        `/messages/groups/${groupId}/leave`,
        {}
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Leave group error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async deleteGroup(groupId) {
    try {
      const response = await ExternalApiService.delete(
        `/messages/groups/${groupId}`
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Delete group error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // ==================== Group Chat Functions ====================
  static async getGroupMessages(groupId, params = {}) {
    try {
      const { page = 1, limit = 50 } = params;

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const endpoint = `/messages/groups/${groupId}/messages?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get group messages error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Send group message (text or file)
  static async sendGroupMessage(groupId, messageData, attachmentFile = null) {
    try {
      const formData = new FormData();
      formData.append("groupId", groupId);
      formData.append("content", messageData.content);
      formData.append("type", messageData.type || "text");

      if (attachmentFile) {
        formData.append("attachment", attachmentFile);
      }

      const response = await ExternalApiService.post(
        "/messages",
        formData,
        undefined,
        true // isFormData
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Send group message error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

}