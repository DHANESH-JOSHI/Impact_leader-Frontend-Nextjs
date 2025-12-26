import { apiClient } from '@/lib/apiClient';
import { ADMIN, USERS, POSTS, STORIES, RESOURCES, NOTIFICATIONS } from '@/constants/apiEndpoints';

export class AdminService {
  static async getAnalyticsDashboard() {
    try {
      const response = await apiClient.get(ADMIN.DASHBOARD_ANALYTICS);
      const backendResponse = response.data || {};

      // Extract overview data from the actual API response structure
      if (response.success && backendResponse) {
        const overview = backendResponse.data?.overview || backendResponse.overview || {};
        const formattedData = {
          totalUsers: overview.totalUsers || 0,
          totalPosts: overview.totalPosts || 0,
          totalStories: overview.totalStories || 0,
          totalResources: overview.totalResources || 0,
          totalQuestions: overview.totalQuestions || 0,
          totalConnections: overview.totalConnections || 0,
          totalMessages: overview.totalMessages || 0,
          flaggedContent: overview.flaggedContent || 0,
          totalApiEndpoints: 66, // From Postman collection
          // Additional data from API response
          recentUsers: backendResponse.recentUsers || backendResponse.data?.recentUsers || [],
          topPosts: backendResponse.topPosts || backendResponse.data?.topPosts || [],
          topResources: backendResponse.topResources || backendResponse.data?.topResources || [],
          analytics: backendResponse.analytics || backendResponse.data?.analytics || {},
          charts: backendResponse.charts || backendResponse.data?.charts || {},
        };

        return {
          success: true,
          data: formattedData,
          message: backendResponse.message || response.message || "Analytics data retrieved successfully",
        };
      }

      return {
        success: false,
        message: "Invalid API response structure",
      };
    } catch (error) {
      console.error("Get analytics dashboard error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getDashboardCounts() {
    try {
      console.log("Fetching dashboard counts from Impact Leaders API...");

      // Make concurrent API calls for better performance
      const [
        usersResponse,
        postsResponse,
        storiesResponse,
        resourcesResponse,
        notificationsResponse,
      ] = await Promise.allSettled([
        apiClient.get(USERS.BASE, { params: { page: 1, limit: 1 } }),
        apiClient.get(POSTS.BASE, { params: { page: 1, limit: 1 } }),
        apiClient.get(STORIES.FEED),
        apiClient.get(RESOURCES.BASE, { params: { page: 1, limit: 1 } }),
        apiClient.get(NOTIFICATIONS.UNREAD_COUNT),
      ]);

      const counts = {
        totalUsers: 0,
        totalPosts: 0,
        totalStories: 0,
        totalResources: 0,
        totalNotifications: 0,
        totalApiEndpoints: 66, // Total endpoints from your Postman collection
      };

      // Extract user count from pagination or data
      if (usersResponse.status === "fulfilled" && usersResponse.value.success) {
        const userData = usersResponse.value.data || {};
        counts.totalUsers =
          userData.pagination?.total ||
          (Array.isArray(userData.data) ? userData.data.length : 0) ||
          userData.total ||
          0;
        console.log("Users API response:", usersResponse.value);
      }

      // Extract posts count from pagination or data
      if (postsResponse.status === "fulfilled" && postsResponse.value.success) {
        const postData = postsResponse.value.data || {};
        counts.totalPosts =
          postData.pagination?.total ||
          (Array.isArray(postData.data) ? postData.data.length : 0) ||
          postData.total ||
          0;
        console.log("Posts API response:", postsResponse.value);
      }

      // Extract stories count from feed or analytics
      if (
        storiesResponse.status === "fulfilled" &&
        storiesResponse.value.success
      ) {
        const storyData = storiesResponse.value.data || {};
        counts.totalStories =
          (Array.isArray(storyData.data) ? storyData.data.length : 0) ||
          storyData.total ||
          storyData.pagination?.total ||
          0;
        console.log("Stories API response:", storiesResponse.value);
      }

      // Extract resources count from pagination or stats
      if (
        resourcesResponse.status === "fulfilled" &&
        resourcesResponse.value.success
      ) {
        const resourceData = resourcesResponse.value.data || {};
        counts.totalResources =
          resourceData.pagination?.total ||
          resourceData.totalResources ||
          (Array.isArray(resourceData.data) ? resourceData.data.length : 0) ||
          0;
        console.log("Resources API response:", resourcesResponse.value);
      }

      // Extract notifications count
      if (
        notificationsResponse.status === "fulfilled" &&
        notificationsResponse.value.success
      ) {
        const notifData = notificationsResponse.value.data || {};
        counts.totalNotifications =
          notifData.count ||
          notifData.data?.count ||
          0;
        console.log("Notifications API response:", notificationsResponse.value);
      }

      console.log("Final Dashboard Counts:", counts);

      return {
        success: true,
        data: counts,
        message:
          "Dashboard counts retrieved successfully from Impact Leaders API",
      };
    } catch (error) {
      console.error("Get dashboard counts error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getPendingApprovals(params = {}) {
    try {
      const response = await apiClient.get(ADMIN.PENDING_APPROVALS, { params });
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
        pagination: backendResponse.pagination,
      };
    } catch (error) {
      console.error("Get pending approvals error:", error);
      return {
        success: false,
        message: error.message || error.response?.data?.message || "Failed to load pending approvals",
        data: { approvals: [], inactiveUsers: [] },
      };
    }
  }


  // Approve content (post, resource, etc.)
  static async approveContent(contentType, contentId, approvalData = {}) {
    try {
      const response = await apiClient.post(
        ADMIN.APPROVE_CONTENT(contentType, contentId),
        approvalData,
      );
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Approve content error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Reject content
  static async rejectContent(contentType, contentId, rejectionData) {
    try {
      const response = await apiClient.post(
        ADMIN.REJECT_CONTENT(contentType, contentId),
        rejectionData,
      );
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Reject content error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getFlaggedContent(params = {}) {
    try {
      const { page = 1, limit = 10, contentType, status } = params;

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (contentType) queryParams.append("contentType", contentType);
      if (status) queryParams.append("status", status);

      const queryParamsObj = {
        page,
        limit,
        ...(contentType && { contentType }),
        ...(status && { status }),
      };
      const response = await apiClient.get(ADMIN.FLAGGED_CONTENT, { params: queryParamsObj });
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Get flagged content error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Handle flagged content
  static async handleFlaggedContent(flagId, action, data = {}) {
    try {
      const response = await apiClient.post(ADMIN.FLAGGED_CONTENT_HANDLE(flagId, action), data);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Handle flagged content error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getSystemHealth() {
    try {
      const response = await apiClient.get(ADMIN.SYSTEM_HEALTH);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Get system health error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getAuditLogs(params = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        action,
        userId,
        startDate,
        endDate,
      } = params;

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (action) queryParams.append("action", action);
      if (userId) queryParams.append("userId", userId);
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);

      const queryParamsObj = {
        page,
        limit,
        ...(action && { action }),
        ...(userId && { userId }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      };
      const response = await apiClient.get(ADMIN.AUDIT_LOGS, { params: queryParamsObj });
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Get audit logs error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Export data
  static async exportData(exportType, params = {}) {
    try {
      const response = await apiClient.post(ADMIN.EXPORT(exportType), params);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Export data error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getSystemConfig() {
    try {
      const response = await apiClient.get(ADMIN.SYSTEM_CONFIG);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Get system config error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async updateSystemConfig(configData) {
    try {
      const response = await apiClient.put(ADMIN.SYSTEM_CONFIG, configData);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Update system config error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getUserActivityAnalytics(params = {}) {
    try {
      const { timeframe = "30d", groupBy = "day" } = params;

      let queryParams = new URLSearchParams({
        timeframe,
        groupBy,
      });

      const response = await apiClient.get(ADMIN.USER_ACTIVITY_ANALYTICS, { params: { timeframe, groupBy } });
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Get user activity analytics error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getContentAnalytics(params = {}) {
    try {
      const { timeframe = "30d", contentType } = params;

      let queryParams = new URLSearchParams({
        timeframe,
      });

      if (contentType) queryParams.append("contentType", contentType);

      const queryParamsObj = {
        timeframe,
        ...(contentType && { contentType }),
      };
      const response = await apiClient.get(ADMIN.CONTENT_ANALYTICS, { params: queryParamsObj });
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Get content analytics error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Send system maintenance notification
  static async sendMaintenanceNotification(maintenanceData) {
    try {
      const response = await apiClient.post(ADMIN.MAINTENANCE_NOTIFY, maintenanceData);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Send maintenance notification error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static getApprovalTypes() {
    return [
      { value: "posts", label: "Posts" },
      { value: "resources", label: "Resources" },
      { value: "stories", label: "Stories" },
      { value: "questions", label: "Q&A Questions" },
      { value: "answers", label: "Q&A Answers" },
      { value: "users", label: "User Registrations" },
    ];
  }

  static getFlagReasons() {
    return [
      { value: "inappropriate", label: "Inappropriate Content" },
      { value: "spam", label: "Spam" },
      { value: "harassment", label: "Harassment" },
      { value: "misinformation", label: "Misinformation" },
      { value: "copyright", label: "Copyright Violation" },
      { value: "off-topic", label: "Off-topic" },
      { value: "duplicate", label: "Duplicate Content" },
      { value: "other", label: "Other" },
    ];
  }

  static getAuditActions() {
    return [
      { value: "user_created", label: "User Created" },
      { value: "user_updated", label: "User Updated" },
      { value: "user_deleted", label: "User Deleted" },
      { value: "content_approved", label: "Content Approved" },
      { value: "content_rejected", label: "Content Rejected" },
      { value: "content_flagged", label: "Content Flagged" },
      { value: "notification_sent", label: "Notification Sent" },
      { value: "system_config_changed", label: "System Config Changed" },
      { value: "data_exported", label: "Data Exported" },
      { value: "login", label: "Login" },
      { value: "logout", label: "Logout" },
    ];
  }

  static getExportTypes() {
    return [
      { value: "users", label: "Users Data" },
      { value: "posts", label: "Posts Data" },
      { value: "resources", label: "Resources Data" },
      { value: "qna", label: "Q&A Data" },
      { value: "connections", label: "Connections Data" },
      { value: "analytics", label: "Analytics Report" },
      { value: "audit-logs", label: "Audit Logs" },
    ];
  }

  static getTimeFrameOptions() {
    return [
      { value: "7d", label: "Last 7 days" },
      { value: "30d", label: "Last 30 days" },
      { value: "90d", label: "Last 90 days" },
      { value: "6m", label: "Last 6 months" },
      { value: "1y", label: "Last year" },
      { value: "custom", label: "Custom range" },
    ];
  }


  // ==================== User Management (From Postman Collection) ====================
  static async getPendingUsers(params = {}) {
    try {
      const { page = 1, limit = 20 } = params;

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await apiClient.get(ADMIN.PENDING_USERS, { params: { page, limit } });
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Get pending users error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Approve user registration
  static async approveUser(userId, approvalData = {}) {
    try {
      const response = await apiClient.post(
        ADMIN.APPROVE_USER(userId),
        {
          notes: approvalData.notes || approvalData.approvedBy || '',
          ...approvalData,
        }
      );
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Approve user error:", error);
      return {
        success: false,
        message: error.message || error.response?.data?.message || "Failed to approve user",
      };
    }
  }


  // Reject user registration
  static async rejectUser(userId, reason = "") {
    try {
      const response = await apiClient.post(
        ADMIN.REJECT_USER(userId),
        {
          reason: reason || "Rejected by admin",
          notes: reason || "",
        }
      );
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Reject user error:", error);
      return {
        success: false,
        message: error.message || error.response?.data?.message || "Failed to reject user",
      };
    }
  }

  static async getAllUsersAdmin(params = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        role,
        isActive,
        organizationType,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = params;

      const queryParams = {
        page,
        limit,
        sortBy,
        sortOrder,
        ...(search && { search }),
        ...(role && { role }),
        // Convert boolean to string for query params (URL params are always strings)
        ...(isActive !== undefined && { isActive: isActive === true || isActive === "true" ? "true" : "false" }),
        ...(organizationType && { organizationType }),
      };

      const response = await apiClient.get(ADMIN.USERS.BASE, { params: queryParams });
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        pagination: backendResponse.pagination,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Get all users (admin) error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Update user (Admin only)
  static async updateUser(userId, userData) {
    try {
      const response = await apiClient.put(
        ADMIN.USERS.BY_ID(userId),
        userData
      );
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Update user (admin) error:", error);
      return {
        success: false,
        message: error.message || error.response?.data?.message || "Failed to update user",
      };
    }
  }

  // Delete user (Admin only)
  static async deleteUser(userId) {
    try {
      const response = await apiClient.delete(ADMIN.USERS.BY_ID(userId));
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Delete user (admin) error:", error);
      return {
        success: false,
        message: error.message || error.response?.data?.message || "Failed to delete user",
      };
    }
  }

}
