import { apiClient } from '@/lib/apiClient';
import { ADMIN } from '@/constants/apiEndpoints';

export class UsersService {
  static async getAllUsers(params = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        organizationType,
        themes,
        location,
        role,
        isActive,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = params;

      const queryParams = {
        page,
        limit,
        sortBy,
        sortOrder,
        ...(search && { search }),
        ...(organizationType && { organizationType }),
        ...(themes && { themes }),
        ...(location && { location }),
        ...(role && { role }),
        ...(isActive !== undefined && { isActive }),
      };

      const response = await apiClient.get(ADMIN.USERS.BASE, { params: queryParams });
      const backendResponse = response.data || {};

      const usersData = Array.isArray(backendResponse.data) ? backendResponse.data : [];
      const filteredUsers = usersData.filter((user) => user.role !== "admin");

      return {
        success: response.success && backendResponse.success !== false,
        data: filteredUsers,
        pagination: backendResponse.pagination || {},
        total: backendResponse.total || filteredUsers.length,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Get all users error:", error);
      return {
        success: false,
        data: [],
        pagination: {},
        message: error.message,
      };
    }
  }

  static async getUserProfile(userId) {
    try {
      const response = await apiClient.get(USERS.BY_ID(userId));
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Get user profile error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async updateUserProfile(userId, profileData) {
    try {
      const endpoint = userId ? USERS.PROFILE(userId) : USERS.BASE + '/profile';
      const response = await apiClient.put(endpoint, profileData);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Update user profile error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async uploadAvatar(avatarFile, userId = null) {
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const endpoint = userId ? USERS.BY_ID(userId) + '/avatar' : USERS.BASE + '/avatar';
      const response = await apiClient.upload(endpoint, formData);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Upload avatar error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async deleteUser(userId) {
    try {
      const response = await apiClient.delete(USERS.BY_ID(userId));
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Delete user error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  static async toggleUserStatus(userId, suspend = true) {
    try {
      const endpoint = suspend
        ? ADMIN.USERS.BAN(userId)
        : ADMIN.USERS.UNBAN(userId);
      const response = await apiClient.post(endpoint, {});
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Toggle user status error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  static async grantUserPrivilege(userId, privilege) {
    try {
      const response = await apiClient.post(ADMIN.USERS.PERMISSIONS(userId) || `/admin/users/${userId}/grant-privilege`, { privilege });
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Grant user privilege error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getUserActivity(userId, params = {}) {
    try {
      const { startDate, endDate, activityType } = params;

      const queryParams = {
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(activityType && { activityType }),
      };

      const response = await apiClient.get(ADMIN.USERS.BY_ID(userId) + '/activity', { params: queryParams });
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Get user activity error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getUserStats(params = {}) {
    try {
      const { timeframe = "30d", groupBy = "day" } = params;

      const queryParams = {
        timeframe,
        groupBy,
      };

      const response = await apiClient.get(ADMIN.USERS.BASE + '/stats', { params: queryParams });
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Get user stats error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  static async bulkUserAction(action, userIds, additionalData = {}) {
    try {
      const response = await apiClient.post(ADMIN.USERS.BULK_ACTION, {
          action,
          userIds,
          ...additionalData,
      });
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Bulk user action error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  static async exportUsers(params = {}) {
    try {
      const { format = "csv", filters = {} } = params;

      const response = await apiClient.post(ADMIN.USERS.BASE + '/export', {
          format,
          filters,
      });
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error("Export users error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static getOrganizationTypes() {
    return [
      { value: "corporate", label: "Corporate" },
      { value: "ngo", label: "NGO" },
      { value: "government", label: "Government" },
      { value: "academic", label: "Academic Institution" },
      { value: "nonprofit", label: "Non-Profit" },
      { value: "social-enterprise", label: "Social Enterprise" },
      { value: "foundation", label: "Foundation" },
      { value: "consulting", label: "Consulting" },
      { value: "individual", label: "Individual" },
    ];
  }

  static getUserRoles() {
    return [
      { value: "user", label: "User" },
      { value: "moderator", label: "Moderator" },
      { value: "admin", label: "Admin" },
      { value: "super-admin", label: "Super Admin" },
    ];
  }

  static getUserThemes() {
    return [
      { value: "environment", label: "Environment" },
      { value: "sustainability", label: "Sustainability" },
      { value: "education", label: "Education" },
      { value: "healthcare", label: "Healthcare" },
      { value: "technology", label: "Technology" },
      { value: "innovation", label: "Innovation" },
      { value: "community-development", label: "Community Development" },
      { value: "social-justice", label: "Social Justice" },
      { value: "poverty-alleviation", label: "Poverty Alleviation" },
      { value: "disaster-relief", label: "Disaster Relief" },
      { value: "governance", label: "Governance" },
      { value: "human-rights", label: "Human Rights" },
    ];
  }

  static getUserPrivileges() {
    return [
      { value: "auto-approve-posts", label: "Auto-approve Posts" },
      { value: "auto-approve-resources", label: "Auto-approve Resources" },
      { value: "create-stories", label: "Create Stories" },
      { value: "moderate-content", label: "Moderate Content" },
      { value: "manage-users", label: "Manage Users" },
      { value: "access-analytics", label: "Access Analytics" },
      { value: "send-notifications", label: "Send Notifications" },
    ];
  }

  static getSortOptions() {
    return [
      { value: "createdAt", label: "Join Date" },
      { value: "lastActive", label: "Last Active" },
      { value: "firstName", label: "First Name" },
      { value: "lastName", label: "Last Name" },
      { value: "email", label: "Email" },
      { value: "postsCount", label: "Posts Count" },
      { value: "connectionsCount", label: "Connections" },
    ];
  }

  static getActivityTypes() {
    return [
      { value: "posts", label: "Posts" },
      { value: "comments", label: "Comments" },
      { value: "connections", label: "Connections" },
      { value: "messages", label: "Messages" },
      { value: "resources", label: "Resources" },
      { value: "questions", label: "Q&A Questions" },
      { value: "answers", label: "Q&A Answers" },
      { value: "login", label: "Login Activity" },
    ];
  }

}
