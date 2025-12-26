import { apiClient } from '@/lib/apiClient';
import { SETTINGS } from '@/constants/apiEndpoints';

class SettingsService {
  /**
   * Get user settings
   */
  static async getSettings() {
    try {
      const response = await apiClient.get(SETTINGS.BASE);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Get settings error:', error);
      return {
        success: false,
        data: null,
        message: error.message || error.response?.data?.message || 'Failed to get settings'
      };
    }
  }

  /**
   * Update user settings
   */
  static async updateSettings(settingsData) {
    try {
      const response = await apiClient.put(SETTINGS.BASE, settingsData);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Update settings error:', error);
      return {
        success: false,
        data: null,
        message: error.message || error.response?.data?.message || 'Failed to update settings'
      };
    }
  }

  /**
   * Update notification settings
   */
  static async updateNotificationSettings(notificationData) {
    try {
      const response = await apiClient.put(SETTINGS.NOTIFICATIONS, notificationData);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Update notification settings error:', error);
      return {
        success: false,
        data: null,
        message: error.message || error.response?.data?.message || 'Failed to update notification settings'
      };
    }
  }

  /**
   * Update privacy settings
   */
  static async updatePrivacySettings(privacyData) {
    try {
      const response = await apiClient.put(SETTINGS.PRIVACY, privacyData);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Update privacy settings error:', error);
      return {
        success: false,
        data: null,
        message: error.message || error.response?.data?.message || 'Failed to update privacy settings'
      };
    }
  }

  /**
   * Update preferences
   */
  static async updatePreferences(preferencesData) {
    try {
      const response = await apiClient.put(SETTINGS.PREFERENCES, preferencesData);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Update preferences error:', error);
      return {
        success: false,
        data: null,
        message: error.message || error.response?.data?.message || 'Failed to update preferences'
      };
    }
  }

  /**
   * Reset settings to default
   */
  static async resetSettings() {
    try {
      const response = await apiClient.post(SETTINGS.RESET);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Reset settings error:', error);
      return {
        success: false,
        data: null,
        message: error.message || error.response?.data?.message || 'Failed to reset settings'
      };
    }
  }

  /**
   * Export settings
   */
  static async exportSettings() {
    try {
      const response = await apiClient.get(SETTINGS.EXPORT);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Export settings error:', error);
      return {
        success: false,
        data: null,
        message: error.message || error.response?.data?.message || 'Failed to export settings'
      };
    }
  }

  /**
   * Import settings
   */
  static async importSettings(settingsData) {
    try {
      const response = await apiClient.post(SETTINGS.IMPORT, settingsData);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Import settings error:', error);
      return {
        success: false,
        data: null,
        message: error.message || error.response?.data?.message || 'Failed to import settings'
      };
    }
  }

  /**
   * Upload company logo (Admin only)
   */
  static async uploadCompanyLogo(file) {
    try {
      const formData = new FormData();
      formData.append('logo', file);

      const response = await apiClient.post(SETTINGS.LOGO.UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Upload company logo error:', error);
      return {
        success: false,
        data: null,
        message: error.message || error.response?.data?.message || 'Failed to upload company logo'
      };
    }
  }

  /**
   * Get company logo (Admin only)
   */
  static async getCompanyLogo() {
    try {
      const response = await apiClient.get(SETTINGS.LOGO.GET);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Get company logo error:', error);
      return {
        success: false,
        data: null,
        message: error.message || error.response?.data?.message || 'Failed to get company logo'
      };
    }
  }

  /**
   * Delete company logo (Admin only)
   */
  static async deleteCompanyLogo() {
    try {
      const response = await apiClient.delete(SETTINGS.LOGO.DELETE);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Delete company logo error:', error);
      return {
        success: false,
        data: null,
        message: error.message || error.response?.data?.message || 'Failed to delete company logo'
      };
    }
  }
}

export default SettingsService;

