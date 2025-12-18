import { apiClient } from "@/lib/apiClient";

/**
 * Admin Service - Handles all admin-specific operations
 * Based on /api/v1/admin endpoints
 */
export class AdminService {
  /**
   * Get all pending user approvals
   * GET /api/v1/admin/approvals/pending
   */
  static async getPendingApprovals() {
    try {
      const response = await apiClient.get('/admin/approvals/pending');
      return response;
    } catch (error) {
      console.error('[AdminService] Error fetching pending approvals:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get approval statistics
   * GET /api/v1/admin/approvals/stats
   */
  static async getApprovalStats() {
    try {
      const response = await apiClient.get('/admin/approvals/stats');
      return response;
    } catch (error) {
      console.error('[AdminService] Error fetching approval stats:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get single approval request details
   * GET /api/v1/admin/approvals/:id
   */
  static async getApprovalById(id) {
    try {
      const response = await apiClient.get(`/admin/approvals/${id}`);
      return response;
    } catch (error) {
      console.error('[AdminService] Error fetching approval:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Approve user registration
   * POST /api/v1/admin/approvals/:id/approve
   */
  static async approveUser(id, data = {}) {
    try {
      const response = await apiClient.post(`/admin/approvals/${id}/approve`, data);
      return response;
    } catch (error) {
      console.error('[AdminService] Error approving user:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Reject user registration
   * POST /api/v1/admin/approvals/:id/reject
   */
  static async rejectUser(id, data = {}) {
    try {
      const response = await apiClient.post(`/admin/approvals/${id}/reject`, data);
      return response;
    } catch (error) {
      console.error('[AdminService] Error rejecting user:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get all users with approval status
   * GET /api/v1/admin/users
   */
  static async getAllUsers(params = {}) {
    try {
      const response = await apiClient.get('/admin/users', { params });
      return response;
    } catch (error) {
      console.error('[AdminService] Error fetching users:', error);
      return { success: false, message: error.message };
    }
  }
}
