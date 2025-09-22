import { ExternalApiService } from './externalApiService';
import { ImpactLeadersAuthService } from './impactLeadersAuthService';

export class ConnectionsService {
  static getAuthToken() {
    const tokens = ImpactLeadersAuthService.getStoredTokens();
    return tokens.accessToken;
  }

  // Get user's connections
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
      const response = await ExternalApiService.get(endpoint, this.getAuthToken());

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
      const response = await ExternalApiService.post('/connections/request', requestData, this.getAuthToken());

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

  // Accept connection request
  static async acceptConnectionRequest(connectionId) {
    try {
      const response = await ExternalApiService.post(`/connections/${connectionId}/accept`, {}, this.getAuthToken());

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

  // Reject connection request
  static async rejectConnectionRequest(connectionId, reason = '') {
    try {
      const response = await ExternalApiService.post(`/connections/${connectionId}/reject`, {
        reason
      }, this.getAuthToken());

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

  // Get connection suggestions
  static async getConnectionSuggestions(limit = 5) {
    try {
      const endpoint = `/connections/suggestions?limit=${limit}`;
      const response = await ExternalApiService.get(endpoint, this.getAuthToken());

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
      const response = await ExternalApiService.delete(`/connections/${connectionId}`, this.getAuthToken());

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

  // Get pending connection requests (received)
  static async getPendingRequests(params = {}) {
    try {
      const { page = 1, limit = 10 } = params;
      
      let queryParams = new URLSearchParams({
        status: 'pending',
        type: 'received',
        page: page.toString(),
        limit: limit.toString()
      });

      const endpoint = `/connections?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint, this.getAuthToken());

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

  // Get sent connection requests
  static async getSentRequests(params = {}) {
    try {
      const { page = 1, limit = 10 } = params;
      
      let queryParams = new URLSearchParams({
        status: 'pending',
        type: 'sent',
        page: page.toString(),
        limit: limit.toString()
      });

      const endpoint = `/connections?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint, this.getAuthToken());

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

  // Get connection statistics
  static async getConnectionStats(userId = null) {
    try {
      const endpoint = userId ? `/users/${userId}/connections/stats` : '/connections/stats';
      const response = await ExternalApiService.get(endpoint, this.getAuthToken());

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

  // Get connection types
  static getConnectionTypes() {
    return [
      { value: 'professional', label: 'Professional' },
      { value: 'collaboration', label: 'Collaboration' },
      { value: 'mentorship', label: 'Mentorship' },
      { value: 'networking', label: 'Networking' },
      { value: 'partnership', label: 'Partnership' }
    ];
  }

  // Get connection sources
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

  // Get connection status types
  static getConnectionStatuses() {
    return [
      { value: 'pending', label: 'Pending' },
      { value: 'accepted', label: 'Accepted' },
      { value: 'rejected', label: 'Rejected' },
      { value: 'blocked', label: 'Blocked' }
    ];
  }
}
