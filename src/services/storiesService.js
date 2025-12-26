import { apiClient } from '@/lib/apiClient';
import { STORIES } from '@/constants/apiEndpoints';
import { STORY_TYPE_ENUM, STORY_FONT_FAMILY_ENUM, formatEnumValue } from '@/constants/backendEnums';

export class StoriesService {
  // Get all active stories
  static async getStories(params = {}) {
    try {
      const {
        featured,
        authorId,
        tags,
        // New query parameters
        search,
        type,
        status,
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;

      const queryParams = {};
      // Backward compatibility: Keep old parameters
      if (featured !== undefined) queryParams.featured = featured;
      if (authorId) queryParams.authorId = authorId;
      if (tags) queryParams.tags = Array.isArray(tags) ? tags.join(',') : tags;
      // New parameters
      if (search) queryParams.search = search;
      if (type) queryParams.type = type;
      if (status) queryParams.status = status;
      if (page) queryParams.page = page;
      if (limit) queryParams.limit = limit;
      if (sortBy) queryParams.sortBy = sortBy;
      if (sortOrder) queryParams.sortOrder = sortOrder;

      const response = await apiClient.get(STORIES.ACTIVE, { params: queryParams });
      const backendResponse = response.data || {};
      
      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || [],
        count: backendResponse.count, // Backward compatibility
        pagination: backendResponse.pagination, // New pagination object
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Stories] Get stories error:', error);
      return {
        success: false,
        data: [],
        count: 0,
        pagination: null,
        message: error.message,
      };
    }
  }

  // Get stories for feed (grouped by author)
  static async getStoriesFeed(params = {}) {
    try {
      const response = await apiClient.get(STORIES.FEED);
      const backendResponse = response.data || {};
      
      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || [],
        count: backendResponse.count,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Stories] Get stories feed error:', error);
      return {
        success: false,
        data: [],
        message: error.message,
      };
    }
  }

  // Get user's own stories
  static async getMyStories(params = {}) {
    try {
      const { includeExpired = false } = params;
      const queryParams = {};
      if (includeExpired !== undefined) queryParams.includeExpired = includeExpired;

      const response = await apiClient.get(`${STORIES.BASE}/my`, { params: queryParams });
      const backendResponse = response.data || {};
      
      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || [],
        count: backendResponse.count,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Stories] Get my stories error:', error);
      return {
        success: false,
        data: [],
        message: error.message,
      };
    }
  }

  // Get single story
  static async getStory(storyId) {
    try {
      const response = await apiClient.get(STORIES.BY_ID(storyId));
      const backendResponse = response.data || {};
      
      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Stories] Get story error:', error);
      return {
        success: false,
        data: null,
        message: error.message,
      };
    }
  }

  static async createTextStory(storyData) {
    try {
      const formData = new FormData();
      
      // Add story metadata
      formData.append('type', 'text');
      if (storyData.textContent) formData.append('textContent', storyData.textContent);
      if (storyData.caption) formData.append('caption', storyData.caption);
      if (storyData.duration) formData.append('duration', storyData.duration.toString());
      if (storyData.backgroundColor) formData.append('backgroundColor', storyData.backgroundColor);
      if (storyData.textColor) formData.append('textColor', storyData.textColor);
      if (storyData.fontFamily) formData.append('fontFamily', storyData.fontFamily);
      if (storyData.tags && Array.isArray(storyData.tags) && storyData.tags.length > 0) {
        formData.append('tags', JSON.stringify(storyData.tags));
      }
      if (storyData.isFeatured !== undefined) {
        formData.append('isFeatured', storyData.isFeatured.toString());
      }

      const response = await apiClient.upload(STORIES.BASE, formData);

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

      // Add story metadata (exclude type as it's set explicitly below)
      Object.keys(storyData).forEach((key) => {
        if (key === 'type') return; // Skip type, will be set explicitly
        
        const value = storyData[key];
        
        // Handle arrays - send as JSON string
        if (Array.isArray(value)) {
          if (value.length > 0) {
            formData.append(key, JSON.stringify(value));
          }
        } 
        // Handle booleans - convert to string
        else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        }
        // Handle numbers - convert to string for FormData
        else if (typeof value === 'number') {
          formData.append(key, value.toString());
        }
        // Handle other values
        else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      formData.append("type", "image");
      if (imageFile && imageFile instanceof File) {
        formData.append("media", imageFile);
      }

      const response = await apiClient.upload(STORIES.BASE, formData);

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

      // Add story metadata (exclude type as it's set explicitly below)
      Object.keys(storyData).forEach((key) => {
        if (key === 'type') return; // Skip type, will be set explicitly
        
        const value = storyData[key];
        
        // Handle arrays - send as JSON string
        if (Array.isArray(value)) {
          if (value.length > 0) {
            formData.append(key, JSON.stringify(value));
          }
        } 
        // Handle booleans - convert to string
        else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        }
        // Handle numbers - convert to string for FormData
        else if (typeof value === 'number') {
          formData.append(key, value.toString());
        }
        // Handle other values
        else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      formData.append("type", "video");
      if (videoFile && videoFile instanceof File) {
        formData.append("media", videoFile);
      }

      const response = await apiClient.upload(STORIES.BASE, formData);

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


  // View story (increments view count) - same as getStory
  static async viewStory(storyId) {
    return this.getStory(storyId);
  }

  // Get story views (Admin or owner)
  static async getStoryViews(storyId) {
    try {
      const response = await apiClient.get(`${STORIES.BY_ID(storyId)}/views`);
      const backendResponse = response.data || {};
      
      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Stories] Get story views error:', error);
      return {
        success: false,
        data: null,
        message: error.message,
      };
    }
  }

  // Extend story expiry (Admin only)
  static async extendStoryExpiry(storyId, hours = 24) {
    try {
      const response = await apiClient.put(`${STORIES.BY_ID(storyId)}/extend`, { hours });
      const backendResponse = response.data || {};
      
      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Stories] Extend story expiry error:', error);
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

  static async updateStory(storyId, updateData, mediaFile = null) {
    try {
      // Check if there's a media file to upload
      if (mediaFile && mediaFile instanceof File) {
        const formData = new FormData();
        
        // Add story metadata
        Object.keys(updateData).forEach(key => {
          const value = updateData[key];
          
          // Handle arrays - send as JSON string
          if (Array.isArray(value)) {
            if (value.length > 0) {
              formData.append(key, JSON.stringify(value));
            }
          } 
          // Handle booleans - convert to string
          else if (typeof value === 'boolean') {
            formData.append(key, value.toString());
          }
          // Handle other values
          else if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        });
        
        // Add media file
        formData.append('media', mediaFile);
        
        console.log('[Stories] Updating story with media:', {
          storyId,
          fileName: mediaFile.name,
          fileSize: mediaFile.size
        });
        
        const response = await apiClient.request(STORIES.BY_ID(storyId), {
          method: 'PUT',
          data: formData,
          isFormData: true
        });

        return {
          success: response.success,
          data: response.data,
          message: response.message,
        };
      } else {
        // No file - use regular JSON update
        const response = await apiClient.put(STORIES.BY_ID(storyId), updateData);

        return {
          success: response.success,
          data: response.data,
          message: response.message,
        };
      }
    } catch (error) {
      console.error('[Stories] Update story error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Use backend enum - must match exactly
  static getStoryTypes() {
    return STORY_TYPE_ENUM.map(type => ({
      value: type,
      label: formatEnumValue(type) + ' Story'
    }));
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

  // Use backend enum - must match exactly
  static getFontFamilies() {
    return STORY_FONT_FAMILY_ENUM.map(font => ({
      value: font,
      label: font
    }));
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
