import { ExternalApiService } from './externalApiService';
import { AuthService } from './authService';

export class ConnectionsService {
  static async getMyConnections(params = {}) {
    try {
      const { 
        status = 'accepted', 
        page = 1, 
        limit = 10,
        search 
      } = params;
      
      let queryParams = new URLSearchParams({
        status,
        page: page.toString(),
        limit: limit.toString()
      });

      if (search) queryParams.append('search', search);

      const endpoint = `/connections?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get my connections error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Send connection request
  static async sendConnectionRequest(requestData) {
    try {
      const response = await ExternalApiService.post('/connections/request', requestData);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Send connection request error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Accept connection request - Using PUT method as per Postman
  static async acceptConnectionRequest(connectionId) {
    try {
      const response = await ExternalApiService.put(`/connections/${connectionId}/accept`, {});

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Accept connection request error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Reject connection request - Using PUT method as per Postman
  static async rejectConnectionRequest(connectionId, reason = '') {
    try {
      const response = await ExternalApiService.put(`/connections/${connectionId}/reject`, {
        reason
      });

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Reject connection request error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getConnectionSuggestions(limit = 5) {
    try {
      const endpoint = `/connections/suggestions?limit=${limit}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get connection suggestions error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Remove connection
  static async removeConnection(connectionId) {
    try {
      const response = await ExternalApiService.delete(`/connections/${connectionId}`);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Remove connection error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getPendingRequests(params = {}) {
    try {
      const { page = 1, limit = 10, type = 'received' } = params;

      let queryParams = new URLSearchParams({
        type,
        page: page.toString(),
        limit: limit.toString()
      });

      const endpoint = `/connections/requests?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get pending requests error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getSentRequests(params = {}) {
    try {
      const { page = 1, limit = 10 } = params;

      let queryParams = new URLSearchParams({
        type: 'sent',
        page: page.toString(),
        limit: limit.toString()
      });

      const endpoint = `/connections/requests?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get sent requests error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getConnectionStats(userId = null) {
    try {
      const endpoint = userId ? `/users/${userId}/connections/stats` : '/connections/stats';
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get connection stats error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static getConnectionTypes() {
    return [
      { value: 'professional', label: 'Professional' },
      { value: 'collaboration', label: 'Collaboration' },
      { value: 'mentorship', label: 'Mentorship' },
      { value: 'networking', label: 'Networking' },
      { value: 'partnership', label: 'Partnership' }
    ];
  }

  static getConnectionSources() {
    return [
      { value: 'directory', label: 'Directory Search' },
      { value: 'suggestions', label: 'Suggestions' },
      { value: 'post', label: 'From Post' },
      { value: 'qna', label: 'From Q&A' },
      { value: 'event', label: 'From Event' },
      { value: 'mutual', label: 'Mutual Connection' }
    ];
  }


  // Block user connection
  static async blockConnection(connectionId) {
    try {
      const response = await ExternalApiService.post(`/connections/${connectionId}/block`, {});

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Block connection error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Unblock user connection
  static async unblockConnection(connectionId) {
    try {
      const response = await ExternalApiService.post(`/connections/${connectionId}/unblock`, {});

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Unblock connection error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getMutualConnections(userId, params = {}) {
    try {
      const { page = 1, limit = 10 } = params;

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      const endpoint = `/connections/mutual/${userId}?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get mutual connections error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Cancel sent connection request
  static async cancelConnectionRequest(connectionId) {
    try {
      const response = await ExternalApiService.delete(`/connections/request/${connectionId}`);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Cancel connection request error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async updateConnectionPreferences(preferences) {
    try {
      const response = await ExternalApiService.put('/connections/preferences', preferences);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Update connection preferences error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getConnectionPreferences() {
    try {
      const response = await ExternalApiService.get('/connections/preferences');

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get connection preferences error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Admin: Get all connections
  static async getAllConnections(params = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        connectionType,
        search,
        startDate,
        endDate
      } = params;

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (status) queryParams.append('status', status);
      if (connectionType) queryParams.append('connectionType', connectionType);
      if (search) queryParams.append('search', search);
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const endpoint = `/admin/connections?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get all connections (admin) error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Admin: Get connection analytics
  static async getConnectionAnalytics(params = {}) {
    try {
      const { timeframe = '30d', groupBy = 'day' } = params;

      let queryParams = new URLSearchParams({
        timeframe,
        groupBy
      });

      const endpoint = `/admin/connections/analytics?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get connection analytics error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Admin: Delete connection
  static async adminDeleteConnection(connectionId, reason = '') {
    try {
      const response = await ExternalApiService.delete(`/admin/connections/${connectionId}`);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Admin delete connection error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Admin: Force connection between users
  static async forceConnection(requesterId, recipientId, connectionData) {
    try {
      const response = await ExternalApiService.post('/admin/connections/force', {
        requesterId,
        recipientId,
        ...connectionData
      });

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Force connection error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Export connections data
  static async exportConnections(params = {}) {
    try {
      const { format = 'csv', filters = {} } = params;

      const response = await ExternalApiService.post('/admin/connections/export', {
        format,
        filters
      });

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Export connections error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getAISuggestions(params = {}) {
    try {
      const { limit = 10, criteria = 'mixed' } = params;

      let queryParams = new URLSearchParams({
        limit: limit.toString(),
        criteria
      });

      const endpoint = `/connections/ai-suggestions?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get AI suggestions error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static getConnectionStatuses() {
    return [
      { value: 'pending', label: 'Pending' },
      { value: 'accepted', label: 'Accepted' },
      { value: 'rejected', label: 'Rejected' },
      { value: 'blocked', label: 'Blocked' }
    ];
  }

  static getAISuggestionCriteria() {
    return [
      { value: 'mixed', label: 'Mixed (Recommended)' },
      { value: 'similar_interests', label: 'Similar Interests' },
      { value: 'complementary_skills', label: 'Complementary Skills' },
      { value: 'geographic_proximity', label: 'Geographic Proximity' },
      { value: 'mutual_connections', label: 'Mutual Connections' },
      { value: 'same_industry', label: 'Same Industry' },
      { value: 'career_level', label: 'Similar Career Level' }
    ];
  }

  static getRejectionReasons() {
    return [
      { value: 'not_relevant', label: 'Not Relevant' },
      { value: 'dont_know', label: "Don't Know This Person" },
      { value: 'already_connected', label: 'Already Connected Elsewhere' },
      { value: 'spam', label: 'Spam Request' },
      { value: 'inappropriate', label: 'Inappropriate Request' },
      { value: 'other', label: 'Other' }
    ];
  }

}
