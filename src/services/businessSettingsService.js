import { apiClient } from '@/lib/apiClient';
import { BUSINESS_SETTINGS } from '@/constants/apiEndpoints';

class BusinessSettingsService {
  /**
   * Get business settings
   */
  static async getBusinessSettings() {
    try {
      const response = await apiClient.get(BUSINESS_SETTINGS.BASE);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Get business settings error:', error);
      return {
        success: false,
        data: null,
        message: error.message || error.response?.data?.message || 'Failed to get business settings'
      };
    }
  }

  /**
   * Update business settings
   */
  static async updateBusinessSettings(settingsData) {
    try {
      const response = await apiClient.put(BUSINESS_SETTINGS.BASE, settingsData);
      const backendResponse = response.data || {};

      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('Update business settings error:', error);
      return {
        success: false,
        data: null,
        message: error.message || error.response?.data?.message || 'Failed to update business settings'
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

      const response = await apiClient.upload(BUSINESS_SETTINGS.LOGO.UPLOAD, formData);
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
      const response = await apiClient.get(BUSINESS_SETTINGS.LOGO.GET);
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
      const response = await apiClient.delete(BUSINESS_SETTINGS.LOGO.DELETE);
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

export default BusinessSettingsService;

