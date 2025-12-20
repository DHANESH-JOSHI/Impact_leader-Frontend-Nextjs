import { apiClient } from '@/lib/apiClient';
import { STORIES } from '@/constants/apiEndpoints';

export class StoriesService {
  static async getStoriesFeed(params = {}) {
    try {
      const { page = 1, limit = 20 } = params;

      const queryParams = {
        page,
        limit,
      };

      const response = await apiClient.get(STORIES.FEED, { params: queryParams });
      const backendResponse = response.data || {};
      
      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || [],
        pagination: backendResponse.pagination || {},
        count: backendResponse.count,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Stories] Get stories feed error:', error);
      return {
        success: false,
        data: [],
        pagination: {},
        message: error.message,
      };
    }
  }

  static async createTextStory(storyData) {
    try {
      const payload = {
        type: "text",
        ...storyData,
      };

      const response = await apiClient.post(STORIES.BASE, payload);

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error('[Stories] Create text story error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async createImageStory(storyData, imageFile) {
    try {
      const formData = new FormData();

      Object.keys(storyData).forEach((key) => {
        if (Array.isArray(storyData[key])) {
          storyData[key].forEach((value) => {
            formData.append(key, value);
          });
        } else {
          formData.append(key, storyData[key]);
        }
      });

      formData.append("type", "image");
      if (imageFile) {
        formData.append("media", imageFile);
      }

      const response = await apiClient.upload(STORIES.UPLOAD, formData);

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error('[Stories] Create image story error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async createVideoStory(storyData, videoFile) {
    try {
      const formData = new FormData();

      Object.keys(storyData).forEach((key) => {
        if (Array.isArray(storyData[key])) {
          storyData[key].forEach((value) => {
            formData.append(key, value);
          });
        } else {
          formData.append(key, storyData[key]);
        }
      });

      formData.append("type", "video");
      if (videoFile) {
        formData.append("media", videoFile);
      }

      const response = await apiClient.upload(STORIES.UPLOAD, formData);

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error('[Stories] Create video story error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // View story (increments view count)
  static async viewStory(storyId) {
    try {
      const response = await apiClient.get(STORIES.VIEW(storyId));

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error('[Stories] View story error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getStoryAnalytics() {
    try {
      const response = await apiClient.get(STORIES.ANALYTICS);

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error('[Stories] Get story analytics error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async deleteStory(storyId) {
    try {
      const response = await apiClient.delete(STORIES.BY_ID(storyId));

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error('[Stories] Delete story error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async updateStory(storyId, updateData) {
    try {
      const response = await apiClient.put(STORIES.BY_ID(storyId), updateData);

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error('[Stories] Update story error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static getStoryTypes() {
    return [
      { value: "text", label: "Text Story" },
      { value: "image", label: "Image Story" },
      { value: "video", label: "Video Story" },
    ];
  }

  static getBackgroundColors() {
    return [
      { value: "#2c3e50", label: "Dark Blue", color: "#2c3e50" },
      { value: "#e74c3c", label: "Red", color: "#e74c3c" },
      { value: "#f39c12", label: "Orange", color: "#f39c12" },
      { value: "#27ae60", label: "Green", color: "#27ae60" },
      { value: "#8e44ad", label: "Purple", color: "#8e44ad" },
      { value: "#34495e", label: "Gray", color: "#34495e" },
      { value: "#16a085", label: "Teal", color: "#16a085" },
    ];
  }

  static getFontFamilies() {
    return [
      { value: "Arial", label: "Arial" },
      { value: "Helvetica", label: "Helvetica" },
      { value: "Georgia", label: "Georgia" },
      { value: "Times New Roman", label: "Times New Roman" },
      { value: "Courier New", label: "Courier New" },
      { value: "Verdana", label: "Verdana" },
    ];
  }

  static getStoryDurations() {
    return [
      { value: 86400000, label: "24 Hours" }, // 24 * 60 * 60 * 1000
      { value: 172800000, label: "48 Hours" }, // 48 * 60 * 60 * 1000
      { value: 604800000, label: "7 Days" }, // 7 * 24 * 60 * 60 * 1000
      { value: 2592000000, label: "30 Days" }, // 30 * 24 * 60 * 60 * 1000
    ];
  }

}
