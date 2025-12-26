import { apiClient } from '@/lib/apiClient';
import { SUPPORT } from '@/constants/apiEndpoints';
import { SUPPORT_CATEGORY_ENUM, SUPPORT_PRIORITY_ENUM, SUPPORT_STATUS_ENUM } from '@/constants/backendEnums';

export class SupportService {
  static async getTickets(params = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        category,
        priority,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;

      const queryParams = {
        page,
        limit,
        sortBy,
        sortOrder,
        ...(search && { search }),
        ...(category && { category }),
        ...(priority && { priority }),
        ...(status && { status }),
      };

      const response = await apiClient.get(SUPPORT.BASE, { params: queryParams });
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || [],
        pagination: backendResponse.pagination || {},
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Get tickets error:', error);
      return {
        success: false,
        data: [],
        pagination: {},
        message: error.message
      };
    }
  }

  static async getTicketById(ticketId) {
    try {
      const response = await apiClient.get(SUPPORT.BY_ID(ticketId));
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Get ticket by ID error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async createTicket(ticketData) {
    try {
      const response = await apiClient.post(SUPPORT.CREATE, ticketData);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Create ticket error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async updateTicket(ticketId, updateData) {
    try {
      const response = await apiClient.put(SUPPORT.BY_ID(ticketId), updateData);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Update ticket error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async deleteTicket(ticketId) {
    try {
      const response = await apiClient.delete(SUPPORT.BY_ID(ticketId));
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Delete ticket error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async updateStatus(ticketId, status) {
    try {
      // Backend uses PUT /support/ticket/:id (singular) to update ticket, including status
      const response = await apiClient.put(SUPPORT.BY_ID(ticketId), { status });
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Update status error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async updatePriority(ticketId, priority) {
    try {
      const response = await apiClient.patch(SUPPORT.PRIORITY(ticketId), { priority });
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Update priority error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  static async assignTicket(ticketId, assignedTo) {
    try {
      const response = await apiClient.patch(SUPPORT.ASSIGN(ticketId), { assignedTo });
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Assign ticket error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  static async addReply(ticketId, replyData) {
    try {
      const response = await apiClient.post(SUPPORT.REPLIES(ticketId), replyData);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Add reply error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async updateReply(ticketId, replyId, updateData) {
    try {
      const response = await apiClient.put(SUPPORT.REPLY_BY_ID(ticketId, replyId), updateData);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Update reply error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async deleteReply(ticketId, replyId) {
    try {
      const response = await apiClient.delete(SUPPORT.REPLY_BY_ID(ticketId, replyId));
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Delete reply error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  static async escalateTicket(ticketId) {
    try {
      const response = await apiClient.patch(SUPPORT.ESCALATE(ticketId), {});
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Escalate ticket error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getSupportStats() {
    try {
      const response = await apiClient.get(SUPPORT.STATS);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Get support stats error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Use backend enums - must match exactly with SUPPORT_CATEGORY_ENUM
  static getSupportCategories() {
    return SUPPORT_CATEGORY_ENUM.map(category => ({
      value: category,
      label: category
    }));
  }

  // Use backend enums - must match exactly with SUPPORT_PRIORITY_ENUM
  static getPriorityLevels() {
    return SUPPORT_PRIORITY_ENUM.map(priority => ({
      value: priority,
      label: priority
    }));
  }

  // Use backend enums - must match exactly with SUPPORT_STATUS_ENUM
  static getStatusOptions() {
    return SUPPORT_STATUS_ENUM.map(status => ({
      value: status,
      label: status
    }));
  }

  static getSortOptions() {
    return [
      { value: 'createdAt', label: 'Most Recent' },
      { value: 'updatedAt', label: 'Recently Updated' },
      { value: 'priority', label: 'Priority' },
      { value: 'status', label: 'Status' }
    ];
  }

}
