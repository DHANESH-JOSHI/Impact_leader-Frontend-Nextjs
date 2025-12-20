import { apiClient } from '@/lib/apiClient';
import { CONNECTIONS, ADMIN } from '@/constants/apiEndpoints';

export class ConnectionsService {
  static async getMyConnections(params = {}) {
    try {
      const { 
        status = 'accepted', 
        page = 1, 
        limit = 10,
        search 
      } = params;
      
      const queryParams = {
        status,
        page,
        limit
      };

      if (search) queryParams.search = search;

      const response = await apiClient.get(CONNECTIONS.BASE, { params: queryParams });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        pagination: backendResponse.pagination,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Connections] Get my connections error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async sendConnectionRequest(requestData) {
    try {
      const response = await apiClient.post(CONNECTIONS.REQUEST, requestData);
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Connections] Send connection request error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async acceptConnectionRequest(connectionId) {
    try {
      const response = await apiClient.put(CONNECTIONS.ACCEPT(connectionId), {});
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Connections] Accept connection request error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async rejectConnectionRequest(connectionId, reason = '') {
    try {
      const response = await apiClient.put(CONNECTIONS.REJECT(connectionId), {
        reason
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Connections] Reject connection request error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getConnectionSuggestions(limit = 5) {
    try {
      const response = await apiClient.get(CONNECTIONS.SUGGESTIONS, {
        params: { limit }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Connections] Get connection suggestions error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async removeConnection(connectionId) {
    try {
      const response = await apiClient.delete(CONNECTIONS.BY_ID(connectionId));
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Connections] Remove connection error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getPendingRequests(params = {}) {
    try {
      const { page = 1, limit = 10, type = 'received' } = params;

      const response = await apiClient.get(CONNECTIONS.REQUESTS, {
        params: { type, page, limit }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        pagination: backendResponse.pagination,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Connections] Get pending requests error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getSentRequests(params = {}) {
    try {
      const { page = 1, limit = 10 } = params;

      const response = await apiClient.get(CONNECTIONS.REQUESTS, {
        params: { type: 'sent', page, limit }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        pagination: backendResponse.pagination,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Connections] Get sent requests error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getConnectionStats(userId = null) {
    try {
      const endpoint = userId ? `/users/${userId}/connections/stats` : CONNECTIONS.STATS;
      const response = await apiClient.get(endpoint);
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Connections] Get connection stats error:', error);
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

  static async blockConnection(connectionId) {
    try {
      const response = await apiClient.post(CONNECTIONS.BLOCK(connectionId), {});
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Connections] Block connection error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async unblockConnection(connectionId) {
    try {
      const response = await apiClient.post(CONNECTIONS.UNBLOCK(connectionId), {});
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Connections] Unblock connection error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getMutualConnections(userId, params = {}) {
    try {
      const { page = 1, limit = 10 } = params;

      const response = await apiClient.get(CONNECTIONS.MUTUAL(userId), {
        params: { page, limit }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        pagination: backendResponse.pagination,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Connections] Get mutual connections error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async cancelConnectionRequest(connectionId) {
    try {
      const response = await apiClient.delete(`/connections/request/${connectionId}`);
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Connections] Cancel connection request error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async updateConnectionPreferences(preferences) {
    try {
      const response = await apiClient.put(CONNECTIONS.PREFERENCES, preferences);
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Connections] Update connection preferences error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getConnectionPreferences() {
    try {
      const response = await apiClient.get(CONNECTIONS.PREFERENCES);
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Connections] Get connection preferences error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

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

      const queryParams = {
        page,
        limit
      };

      if (status) queryParams.status = status;
      if (connectionType) queryParams.connectionType = connectionType;
      if (search) queryParams.search = search;
      if (startDate) queryParams.startDate = startDate;
      if (endDate) queryParams.endDate = endDate;

      const response = await apiClient.get('/admin/connections', {
        params: queryParams
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        pagination: backendResponse.pagination,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Connections] Get all connections (admin) error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getConnectionAnalytics(params = {}) {
    try {
      const { timeframe = '30d', groupBy = 'day' } = params;

      const response = await apiClient.get('/admin/connections/analytics', {
        params: { timeframe, groupBy }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Connections] Get connection analytics error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async adminDeleteConnection(connectionId, reason = '') {
    try {
      const response = await apiClient.delete(`/admin/connections/${connectionId}`);
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Connections] Admin delete connection error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async forceConnection(requesterId, recipientId, connectionData) {
    try {
      const response = await apiClient.post('/admin/connections/force', {
        requesterId,
        recipientId,
        ...connectionData
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Connections] Force connection error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async exportConnections(params = {}) {
    try {
      const { format = 'csv', filters = {} } = params;

      const response = await apiClient.post('/admin/connections/export', {
        format,
        filters
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Connections] Export connections error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getAISuggestions(params = {}) {
    try {
      const { limit = 10, criteria = 'mixed' } = params;

      const response = await apiClient.get('/connections/ai-suggestions', {
        params: { limit, criteria }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Connections] Get AI suggestions error:', error);
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
