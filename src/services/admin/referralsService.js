import { apiClient } from "@/lib/apiClient";

/**
 * Referrals Service - Handles referral management operations
 * Based on /api/v1/referrals endpoints
 */
export class ReferralsService {
  /**
   * Validate referral code (Public)
   * GET /api/v1/referrals/validate/:code
   */
  static async validateCode(code) {
    try {
      const response = await apiClient.get(`/referrals/validate/${code}`, { skipAuth: true });
      return response;
    } catch (error) {
      console.error('[ReferralsService] Error validating referral code:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Generate referral code for user
   * POST /api/v1/referrals/generate
   */
  static async generateCode(data = {}) {
    try {
      const response = await apiClient.post('/referrals/generate', data);
      return response;
    } catch (error) {
      console.error('[ReferralsService] Error generating referral code:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get user's referral statistics
   * GET /api/v1/referrals/stats
   */
  static async getStats() {
    try {
      const response = await apiClient.get('/referrals/stats');
      return response;
    } catch (error) {
      console.error('[ReferralsService] Error fetching referral stats:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get all pending referral requests (Admin/Moderator)
   * GET /api/v1/referrals/admin/pending
   */
  static async getPendingRequests() {
    try {
      const response = await apiClient.get('/referrals/admin/pending');
      return response;
    } catch (error) {
      console.error('[ReferralsService] Error fetching pending referrals:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get all referral requests with filters (Admin/Moderator)
   * GET /api/v1/referrals/admin/all
   */
  static async getAllRequests(params = {}) {
    try {
      const response = await apiClient.get('/referrals/admin/all', { params });
      return response;
    } catch (error) {
      console.error('[ReferralsService] Error fetching all referrals:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Approve referral request (Admin)
   * PUT /api/v1/referrals/admin/approve/:requestId
   */
  static async approveRequest(requestId, data = {}) {
    try {
      const response = await apiClient.put(`/referrals/admin/approve/${requestId}`, data);
      return response;
    } catch (error) {
      console.error('[ReferralsService] Error approving referral:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Reject referral request (Admin)
   * PUT /api/v1/referrals/admin/reject/:requestId
   */
  static async rejectRequest(requestId, data = {}) {
    try {
      const response = await apiClient.put(`/referrals/admin/reject/${requestId}`, data);
      return response;
    } catch (error) {
      console.error('[ReferralsService] Error rejecting referral:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Create admin invitation (Admin)
   * POST /api/v1/referrals/admin/invite
   */
  static async createInvitation(data) {
    try {
      const response = await apiClient.post('/referrals/admin/invite', data);
      return response;
    } catch (error) {
      console.error('[ReferralsService] Error creating invitation:', error);
      return { success: false, message: error.message };
    }
  }
}
