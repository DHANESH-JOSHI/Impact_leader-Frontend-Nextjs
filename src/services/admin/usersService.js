import { apiClient } from "@/lib/apiClient";

/**
 * Users Service - Handles user management operations
 * Based on /api/v1/users endpoints
 */
export class UsersService {
  /**
   * Get all users with filtering and pagination
   * GET /api/v1/users
   */
  static async getAllUsers(params = {}) {
    try {
      const response = await apiClient.get('/users', { params });
      return response;
    } catch (error) {
      console.error('[UsersService] Error fetching users:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get single user profile
   * GET /api/v1/users/:id
   */
  static async getUserById(id) {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response;
    } catch (error) {
      console.error('[UsersService] Error fetching user:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Update user by ID (Admin)
   * PUT /api/v1/users/:id
   */
  static async updateUser(id, data) {
    try {
      const response = await apiClient.put(`/users/${id}`, data);
      return response;
    } catch (error) {
      console.error('[UsersService] Error updating user:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Update user profile
   * PUT /api/v1/users/profile
   */
  static async updateProfile(data) {
    try {
      const response = await apiClient.put('/users/profile', data);
      return response;
    } catch (error) {
      console.error('[UsersService] Error updating profile:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Upload profile image
   * POST /api/v1/users/profile/image
   */
  static async uploadProfileImage(formData) {
    try {
      const response = await apiClient.upload('/users/profile/image', formData);
      return response;
    } catch (error) {
      console.error('[UsersService] Error uploading profile image:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Delete user account
   * DELETE /api/v1/users/account
   */
  static async deleteAccount() {
    try {
      const response = await apiClient.delete('/users/account');
      return response;
    } catch (error) {
      console.error('[UsersService] Error deleting account:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get user statistics (Admin only)
   * GET /api/v1/users/stats
   */
  static async getUserStats() {
    try {
      const response = await apiClient.get('/users/stats');
      return response;
    } catch (error) {
      console.error('[UsersService] Error fetching user stats:', error);
      return { success: false, message: error.message };
    }
  }
}
