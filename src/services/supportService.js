import { ExternalApiService } from './externalApiService';

export class SupportService {

  // Get all support tickets with pagination and filters
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

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });

      if (search) queryParams.append('search', search);
      if (category) queryParams.append('category', category);
      if (priority) queryParams.append('priority', priority);
      if (status) queryParams.append('status', status);

      const endpoint = `/support/tickets?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get tickets error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get ticket by ID with replies
  static async getTicketById(ticketId) {
    try {
      const response = await ExternalApiService.get(`/support/tickets/${ticketId}`);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get ticket by ID error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Create a new support ticket
  static async createTicket(ticketData) {
    try {
      const response = await ExternalApiService.post('/support/tickets', ticketData);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Create ticket error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Update ticket
  static async updateTicket(ticketId, updateData) {
    try {
      const response = await ExternalApiService.put(`/support/tickets/${ticketId}`, updateData);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Update ticket error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Delete ticket (admin only)
  static async deleteTicket(ticketId) {
    try {
      const response = await ExternalApiService.delete(`/support/tickets/${ticketId}`);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Delete ticket error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Update ticket status
  static async updateStatus(ticketId, status) {
    try {
      const response = await ExternalApiService.patch(`/support/tickets/${ticketId}/status`, { status });

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Update status error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Update ticket priority
  static async updatePriority(ticketId, priority) {
    try {
      const response = await ExternalApiService.patch(`/support/tickets/${ticketId}/priority`, { priority });

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Update priority error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Assign ticket to support staff
  static async assignTicket(ticketId, assignedTo) {
    try {
      const response = await ExternalApiService.patch(`/support/tickets/${ticketId}/assign`, { assignedTo });

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Assign ticket error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Add reply to ticket
  static async addReply(ticketId, replyData) {
    try {
      const response = await ExternalApiService.post(`/support/tickets/${ticketId}/replies`, replyData);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Add reply error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Update reply
  static async updateReply(ticketId, replyId, updateData) {
    try {
      const response = await ExternalApiService.put(`/support/tickets/${ticketId}/replies/${replyId}`, updateData);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Update reply error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Delete reply
  static async deleteReply(ticketId, replyId) {
    try {
      const response = await ExternalApiService.delete(`/support/tickets/${ticketId}/replies/${replyId}`);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Delete reply error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Escalate ticket
  static async escalateTicket(ticketId) {
    try {
      const response = await ExternalApiService.patch(`/support/tickets/${ticketId}/escalate`, {});

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Escalate ticket error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get support statistics (admin)
  static async getSupportStats() {
    try {
      const response = await ExternalApiService.get('/support/stats');

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get support stats error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get support categories (static list)
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

  // Get priority levels
  static getPriorityLevels() {
    return [
      { value: 'low', label: 'Low', color: 'green' },
      { value: 'medium', label: 'Medium', color: 'yellow' },
      { value: 'high', label: 'High', color: 'orange' },
      { value: 'urgent', label: 'Urgent', color: 'red' }
    ];
  }

  // Get status options
  static getStatusOptions() {
    return [
      { value: 'open', label: 'Open', color: 'blue' },
      { value: 'in-progress', label: 'In Progress', color: 'yellow' },
      { value: 'waiting', label: 'Waiting on Customer', color: 'purple' },
      { value: 'resolved', label: 'Resolved', color: 'green' },
      { value: 'closed', label: 'Closed', color: 'gray' }
    ];
  }

  // Get sort options
  static getSortOptions() {
    return [
      { value: 'createdAt', label: 'Most Recent' },
      { value: 'updatedAt', label: 'Recently Updated' },
      { value: 'priority', label: 'Priority' },
      { value: 'status', label: 'Status' }
    ];
  }
}
