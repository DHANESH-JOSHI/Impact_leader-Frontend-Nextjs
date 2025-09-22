import { ExternalApiService } from "./externalApiService";
import { ImpactLeadersAuthService } from "./impactLeadersAuthService";

export class UsersService {
  static getAuthToken() {
    const tokens = ImpactLeadersAuthService.getStoredTokens();
    return tokens.token;
  }

  // Get all users with pagination and filters
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

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });

      if (search) queryParams.append("search", search);
      if (organizationType)
        queryParams.append("organizationType", organizationType);
      if (themes) queryParams.append("themes", themes);
      if (location) queryParams.append("location", location);
      if (role) queryParams.append("role", role);
      if (isActive !== undefined)
        queryParams.append("isActive", isActive.toString());

      const endpoint = `/admin/users?${queryParams.toString()}`;
      const response = await ExternalApiService.get(
        endpoint,
        this.getAuthToken()
      );

      // filter out "admin" role users
      const filteredUsers = response?.data?.data?.filter(
        (user) => user.role !== "admin"
      );

      return {
        success: response.success,
        data: filteredUsers,
        message: response.message,
      };
    } catch (error) {
      console.error("Get all users error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get user profile by ID
  static async getUserProfile(userId) {
    try {
      const response = await ExternalApiService.get(
        `/users/${userId}`,
        this.getAuthToken()
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get user profile error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Update user profile (user's own profile or admin)
  static async updateUserProfile(userId, profileData) {
    try {
      const endpoint = userId ? `/users/${userId}/profile` : "/users/profile";
      const response = await ExternalApiService.put(
        endpoint,
        profileData,
        this.getAuthToken()
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Update user profile error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Upload user avatar
  static async uploadAvatar(avatarFile, userId = null) {
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const endpoint = userId ? `/users/${userId}/avatar` : "/users/avatar";
      const response = await ExternalApiService.post(
        endpoint,
        formData,
        this.getAuthToken(),
        true
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Upload avatar error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Delete user (admin only)
  static async deleteUser(userId) {
    try {
      const response = await ExternalApiService.delete(
        `/users/${userId}`,
        this.getAuthToken()
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Delete user error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Suspend/Unsuspend user (admin only)
  static async toggleUserStatus(userId, suspend = true) {
    try {
      const endpoint = suspend
        ? `/admin/users/${userId}/suspend`
        : `/admin/users/${userId}/unsuspend`;
      const response = await ExternalApiService.post(
        endpoint,
        {},
        this.getAuthToken()
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Toggle user status error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Grant privileges to user (admin only)
  static async grantUserPrivilege(userId, privilege) {
    try {
      const response = await ExternalApiService.post(
        `/admin/users/${userId}/grant-privilege`,
        {
          privilege,
        },
        this.getAuthToken()
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Grant user privilege error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get user activity/statistics (admin only)
  static async getUserActivity(userId, params = {}) {
    try {
      const { startDate, endDate, activityType } = params;

      let queryParams = new URLSearchParams();

      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);
      if (activityType) queryParams.append("activityType", activityType);

      const endpoint = `/admin/users/${userId}/activity?${queryParams.toString()}`;
      const response = await ExternalApiService.get(
        endpoint,
        this.getAuthToken()
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get user activity error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get user statistics (admin dashboard)
  static async getUserStats(params = {}) {
    try {
      const { timeframe = "30d", groupBy = "day" } = params;

      let queryParams = new URLSearchParams({
        timeframe,
        groupBy,
      });

      const endpoint = `/admin/users/stats?${queryParams.toString()}`;
      const response = await ExternalApiService.get(
        endpoint,
        this.getAuthToken()
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get user stats error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Bulk actions (admin only)
  static async bulkUserAction(action, userIds, additionalData = {}) {
    try {
      const response = await ExternalApiService.post(
        "/admin/users/bulk-action",
        {
          action,
          userIds,
          ...additionalData,
        },
        this.getAuthToken()
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Bulk user action error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Export users data (admin only)
  static async exportUsers(params = {}) {
    try {
      const { format = "csv", filters = {} } = params;

      const response = await ExternalApiService.post(
        "/admin/users/export",
        {
          format,
          filters,
        },
        this.getAuthToken()
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Export users error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get organization types
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

  // Get user roles
  static getUserRoles() {
    return [
      { value: "user", label: "User" },
      { value: "moderator", label: "Moderator" },
      { value: "admin", label: "Admin" },
      { value: "super-admin", label: "Super Admin" },
    ];
  }

  // Get user themes/interests
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

  // Get user privileges
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

  // Get sort options
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

  // Get activity types
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
