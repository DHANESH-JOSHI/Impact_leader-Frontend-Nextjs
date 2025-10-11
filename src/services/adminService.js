import { ExternalApiService } from "./externalApiService";
import { ImpactLeadersAuthService } from "./impactLeadersAuthService";

export class AdminService {

  // Get analytics dashboard data from Impact Leaders API
  static async getAnalyticsDashboard() {
    try {
      const response = await ExternalApiService.get(
        "/admin/analytics",
      );

      // Extract overview data from the actual API response structure
      if (response.success && response.data) {
        const overview = response.data.data.overview;
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
          recentUsers: response.data.recentUsers || [],
          topPosts: response.data.topPosts || [],
          topResources: response.data.topResources || [],
          analytics: response.data.analytics || {},
          charts: response.data.charts || {},
        };

        return {
          success: true,
          data: formattedData,
          message: response.message || "Analytics data retrieved successfully",
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

  // Get individual counts for dashboard from Impact Leaders API
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
        ExternalApiService.get("/users?page=1&limit=1"),
        ExternalApiService.get("/posts?page=1&limit=1"),
        ExternalApiService.get("/stories/feed"),
        ExternalApiService.get(
          "/resources?page=1&limit=1",
          ),
        ExternalApiService.get(
          "/notifications/unread/count",
          ),
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
        counts.totalUsers =
          usersResponse.value.pagination?.total ||
          usersResponse.value.data?.length ||
          usersResponse.value.total ||
          0;
        console.log("Users API response:", usersResponse.value);
      }

      // Extract posts count from pagination or data
      if (postsResponse.status === "fulfilled" && postsResponse.value.success) {
        counts.totalPosts =
          postsResponse.value.pagination?.total ||
          postsResponse.value.data?.length ||
          postsResponse.value.total ||
          0;
        console.log("Posts API response:", postsResponse.value);
      }

      // Extract stories count from feed or analytics
      if (
        storiesResponse.status === "fulfilled" &&
        storiesResponse.value.success
      ) {
        counts.totalStories =
          storiesResponse.value.data?.length ||
          storiesResponse.value.total ||
          storiesResponse.value.pagination?.total ||
          0;
        console.log("Stories API response:", storiesResponse.value);
      }

      // Extract resources count from pagination or stats
      if (
        resourcesResponse.status === "fulfilled" &&
        resourcesResponse.value.success
      ) {
        counts.totalResources =
          resourcesResponse.value.pagination?.total ||
          resourcesResponse.value.data?.totalResources ||
          resourcesResponse.value.data?.length ||
          0;
        console.log("Resources API response:", resourcesResponse.value);
      }

      // Extract notifications count
      if (
        notificationsResponse.status === "fulfilled" &&
        notificationsResponse.value.success
      ) {
        counts.totalNotifications =
          notificationsResponse.value.data?.count ||
          notificationsResponse.value.count ||
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

  // Get pending approvals
  static async getPendingApprovals() {
    try {
      const response = await ExternalApiService.get(
        "/admin/approvals/pending",
      );

      console.log("Get pending approvals response:", response);

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get pending approvals error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Approve content (post, resource, etc.)
  static async approveContent(contentType, contentId, approvalData = {}) {
    try {
      const response = await ExternalApiService.post(
        `/admin/approvals/${contentType}/${contentId}/approve`,
        approvalData,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
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
      const response = await ExternalApiService.post(
        `/admin/approvals/${contentType}/${contentId}/reject`,
        rejectionData,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Reject content error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get flagged content
  static async getFlaggedContent(params = {}) {
    try {
      const { page = 1, limit = 10, contentType, status } = params;

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (contentType) queryParams.append("contentType", contentType);
      if (status) queryParams.append("status", status);

      const endpoint = `/admin/flagged-content?${queryParams.toString()}`;
      const response = await ExternalApiService.get(
        endpoint,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
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
      const response = await ExternalApiService.post(
        `/admin/flagged-content/${flagId}/${action}`,
        data,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Handle flagged content error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get system health status
  static async getSystemHealth() {
    try {
      const response = await ExternalApiService.get(
        "/admin/system/health",
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get system health error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get audit logs
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

      const endpoint = `/admin/audit-logs?${queryParams.toString()}`;
      const response = await ExternalApiService.get(
        endpoint,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
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
      const response = await ExternalApiService.post(
        `/admin/export/${exportType}`,
        params,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Export data error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get system configuration
  static async getSystemConfig() {
    try {
      const response = await ExternalApiService.get(
        "/admin/system/config",
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get system config error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Update system configuration
  static async updateSystemConfig(configData) {
    try {
      const response = await ExternalApiService.put(
        "/admin/system/config",
        configData,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Update system config error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get user activity analytics
  static async getUserActivityAnalytics(params = {}) {
    try {
      const { timeframe = "30d", groupBy = "day" } = params;

      let queryParams = new URLSearchParams({
        timeframe,
        groupBy,
      });

      const endpoint = `/admin/analytics/user-activity?${queryParams.toString()}`;
      const response = await ExternalApiService.get(
        endpoint,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get user activity analytics error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get content analytics
  static async getContentAnalytics(params = {}) {
    try {
      const { timeframe = "30d", contentType } = params;

      let queryParams = new URLSearchParams({
        timeframe,
      });

      if (contentType) queryParams.append("contentType", contentType);

      const endpoint = `/admin/analytics/content?${queryParams.toString()}`;
      const response = await ExternalApiService.get(
        endpoint,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
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
      const response = await ExternalApiService.post(
        "/admin/maintenance/notify",
        maintenanceData,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Send maintenance notification error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get content approval types
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

  // Get flagged content reasons
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

  // Get audit log actions
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

  // Get export types
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

  // Get time frame options
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

  // Get pending users (awaiting approval)
  static async getPendingUsers(params = {}) {
    try {
      const { page = 1, limit = 20 } = params;

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const endpoint = `/admin/pending-users?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message,
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
      const response = await ExternalApiService.put(
        `/admin/approve-user/${userId}`,
        {
          isApproved: true,
          ...approvalData,
        }
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Approve user error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Reject user registration
  static async rejectUser(userId, reason = "") {
    try {
      const response = await ExternalApiService.put(
        `/admin/reject-user/${userId}`,
        {
          reason,
        }
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Reject user error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get all users (Admin only)
  static async getAllUsersAdmin(params = {}) {
    try {
      const { page = 1, limit = 50 } = params;

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const endpoint = `/admin/users?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get all users (admin) error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
