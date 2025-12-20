import { apiClient } from '@/lib/apiClient';
import { SUPPORT } from '@/constants/apiEndpoints';

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
      const response = await apiClient.post(SUPPORT.BASE, ticketData);
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
      const response = await apiClient.patch(SUPPORT.STATUS(ticketId), { status });
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

  static getSupportCategories() {
    return [
      { value: 'technical', label: 'Technical Issue' },
      { value: 'account', label: 'Account & Billing' },
      { value: 'feature-request', label: 'Feature Request' },
      { value: 'bug-report', label: 'Bug Report' },
      { value: 'general-inquiry', label: 'General Inquiry' },
      { value: 'data-privacy', label: 'Data & Privacy' },
      { value: 'integration', label: 'Integration Support' },
      { value: 'training', label: 'Training & Onboarding' },
      { value: 'other', label: 'Other' }
    ];
  }

  static getPriorityLevels() {
    return [
      { value: 'low', label: 'Low', color: 'green' },
      { value: 'medium', label: 'Medium', color: 'yellow' },
      { value: 'high', label: 'High', color: 'orange' },
      { value: 'urgent', label: 'Urgent', color: 'red' }
    ];
  }

  static getStatusOptions() {
    return [
      { value: 'open', label: 'Open', color: 'blue' },
      { value: 'in-progress', label: 'In Progress', color: 'yellow' },
      { value: 'waiting', label: 'Waiting on Customer', color: 'purple' },
      { value: 'resolved', label: 'Resolved', color: 'green' },
      { value: 'closed', label: 'Closed', color: 'gray' }
    ];
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
