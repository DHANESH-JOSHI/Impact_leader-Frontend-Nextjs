import { apiClient } from "@/lib/apiClient";

/**
 * Directory Service - Handles directory management operations
 * Based on /api/v1/directory endpoints
 */
export class DirectoryService {
  /**
   * Get all directory entries with filtering and pagination
   * GET /api/v1/directory
   */
  static async getAllEntries(params = {}) {
    try {
      const response = await apiClient.get('/directory', { params });
      return response;
    } catch (error) {
      console.error('[DirectoryService] Error fetching directory entries:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get single directory entry
   * GET /api/v1/directory/:id
   */
  static async getEntryById(id) {
    try {
      const response = await apiClient.get(`/directory/${id}`);
      return response;
    } catch (error) {
      console.error('[DirectoryService] Error fetching directory entry:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Create new directory entry (with logo upload)
   * POST /api/v1/directory
   */
  static async createEntry(data) {
    try {
      let response;

      // If data contains logo file, use FormData
      if (data.logo || data instanceof FormData) {
        response = await apiClient.upload('/directory', data);
      } else {
        response = await apiClient.post('/directory', data);
      }

      return response;
    } catch (error) {
      console.error('[DirectoryService] Error creating directory entry:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Update directory entry (with logo upload)
   * PUT /api/v1/directory/:id
   */
  static async updateEntry(id, data) {
    try {
      let response;

      // If data contains logo file, use FormData
      if (data.logo || data instanceof FormData) {
        // For PUT with FormData, we need to append _method
        if (data instanceof FormData) {
          data.append('_method', 'PUT');
        }
        response = await apiClient.upload(`/directory/${id}`, data);
      } else {
        response = await apiClient.put(`/directory/${id}`, data);
      }

      return response;
    } catch (error) {
      console.error('[DirectoryService] Error updating directory entry:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Delete directory entry
   * DELETE /api/v1/directory/:id
   */
  static async deleteEntry(id) {
    try {
      const response = await apiClient.delete(`/directory/${id}`);
      return response;
    } catch (error) {
      console.error('[DirectoryService] Error deleting directory entry:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get directory categories
   * GET /api/v1/directory/categories
   */
  static async getCategories() {
    try {
      const response = await apiClient.get('/directory/categories');
      return response;
    } catch (error) {
      console.error('[DirectoryService] Error fetching categories:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get directory statistics
   * GET /api/v1/directory/stats
   */
  static async getStats() {
    try {
      const response = await apiClient.get('/directory/stats');
      return response;
    } catch (error) {
      console.error('[DirectoryService] Error fetching directory stats:', error);
      return { success: false, message: error.message };
    }
  }
}
