import { apiClient } from "@/lib/apiClient";

/**
 * Settings Service - Handles user settings and preferences
 * Based on /api/v1/settings endpoints
 */
export class SettingsService {
  /**
   * Get user settings
   * GET /api/v1/settings
   */
  static async getSettings() {
    try {
      const response = await apiClient.get('/settings');
      return response;
    } catch (error) {
      console.error('[SettingsService] Error fetching settings:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Update user settings
   * PUT /api/v1/settings
   */
  static async updateSettings(data) {
    try {
      const response = await apiClient.put('/settings', data);
      return response;
    } catch (error) {
      console.error('[SettingsService] Error updating settings:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Update notification settings
   * PUT /api/v1/settings/notifications
   */
  static async updateNotifications(data) {
    try {
      const response = await apiClient.put('/settings/notifications', data);
      return response;
    } catch (error) {
      console.error('[SettingsService] Error updating notifications:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Update privacy settings
   * PUT /api/v1/settings/privacy
   */
  static async updatePrivacy(data) {
    try {
      const response = await apiClient.put('/settings/privacy', data);
      return response;
    } catch (error) {
      console.error('[SettingsService] Error updating privacy:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Update user preferences
   * PUT /api/v1/settings/preferences
   */
  static async updatePreferences(data) {
    try {
      const response = await apiClient.put('/settings/preferences', data);
      return response;
    } catch (error) {
      console.error('[SettingsService] Error updating preferences:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Reset settings to default
   * POST /api/v1/settings/reset
   */
  static async resetSettings() {
    try {
      const response = await apiClient.post('/settings/reset');
      return response;
    } catch (error) {
      console.error('[SettingsService] Error resetting settings:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Export user settings
   * GET /api/v1/settings/export
   */
  static async exportSettings() {
    try {
      const response = await apiClient.get('/settings/export');
      return response;
    } catch (error) {
      console.error('[SettingsService] Error exporting settings:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Import user settings
   * POST /api/v1/settings/import
   */
  static async importSettings(data) {
    try {
      const response = await apiClient.post('/settings/import', data);
      return response;
    } catch (error) {
      console.error('[SettingsService] Error importing settings:', error);
      return { success: false, message: error.message };
    }
  }
}
