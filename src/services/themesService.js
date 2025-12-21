import { apiClient } from '@/lib/apiClient';
import { THEMES } from '@/constants/apiEndpoints';

export class ThemesService {
  static async getAllThemes(params = {}) {
    try {
      const { page = 1, limit = 20, search, sortBy = "name", sortOrder = "asc" } = params;

      const queryParams = {
        page,
        limit,
        sortBy,
        sortOrder,
      };

      if (search) queryParams.search = search;

      const response = await apiClient.get(THEMES.BASE, { params: queryParams });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: Array.isArray(backendResponse.data) ? backendResponse.data : (Array.isArray(backendResponse) ? backendResponse : []),
        pagination: backendResponse.pagination || {},
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Themes] Get all themes error:', error);
      return {
        success: false,
        data: [],
        pagination: {},
        message: error.message,
      };
    }
  }

  static async getThemeById(themeId) {
    try {
      const response = await apiClient.get(THEMES.BY_ID(themeId));
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Themes] Get theme by id error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async createTheme(themeData) {
    try {
      const response = await apiClient.post(THEMES.BASE, themeData);
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Themes] Create theme error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async updateTheme(themeId, themeData) {
    try {
      const response = await apiClient.put(THEMES.BY_ID(themeId), themeData);
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Themes] Update theme error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async deleteTheme(themeId) {
    try {
      const response = await apiClient.delete(THEMES.BY_ID(themeId));
      const backendResponse = response.data || {};

      return {
        success: response.success,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Themes] Delete theme error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async bulkCreateThemes(themesArray) {
    try {
      const response = await apiClient.post(THEMES.BULK_CREATE, { themes: themesArray });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Themes] Bulk create themes error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

