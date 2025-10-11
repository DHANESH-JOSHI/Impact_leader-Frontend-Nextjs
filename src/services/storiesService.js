import { ExternalApiService } from "./externalApiService";
import { ImpactLeadersAuthService } from "./impactLeadersAuthService";

export class StoriesService {

  // Get stories feed
  static async getStoriesFeed(params = {}) {
    try {
      const { page = 1, limit = 20 } = params;

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const endpoint = `/stories/feed?${queryParams.toString()}`;

      console.log("🔧 StoriesService: Making API call to:", endpoint);

      const response = await ExternalApiService.get(endpoint);

      console.log("🔧 StoriesService: API Response:", {
        success: response.success,
        status: response.status,
        message: response.message,
        hasData: !!response.data,
      });

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get stories feed error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Create text story (Admin)
  static async createTextStory(storyData) {
    try {
      const payload = {
        type: "text",
        ...storyData,
      };

      const response = await ExternalApiService.post(
        "/stories",
        payload
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Create text story error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Create image story with upload
  static async createImageStory(storyData, imageFile) {
    try {
      const formData = new FormData();

      // Add story data
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

      const response = await ExternalApiService.post(
        "/stories/upload",
        formData,
        undefined,
        true
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Create image story error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Create video story with upload
  static async createVideoStory(storyData, videoFile) {
    try {
      const formData = new FormData();

      // Add story data
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

      const response = await ExternalApiService.post(
        "/stories/upload",
        formData,
        undefined,
        true
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Create video story error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // View story (increments view count)
  static async viewStory(storyId) {
    try {
      const response = await ExternalApiService.get(
        `/stories/${storyId}`
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("View story error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get story analytics (Admin)
  static async getStoryAnalytics() {
    try {
      const response = await ExternalApiService.get(
        "/stories/analytics"
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get story analytics error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Delete story (Admin)
  static async deleteStory(storyId) {
    try {
      const response = await ExternalApiService.delete(
        `/stories/${storyId}`
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Delete story error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Update story (Admin)
  static async updateStory(storyId, updateData) {
    try {
      const response = await ExternalApiService.put(
        `/stories/${storyId}`,
        updateData
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Update story error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get story types
  static getStoryTypes() {
    return [
      { value: "text", label: "Text Story" },
      { value: "image", label: "Image Story" },
      { value: "video", label: "Video Story" },
    ];
  }

  // Get background colors for text stories
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

  // Get font families
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

  // Get default story duration options (in milliseconds)
  static getStoryDurations() {
    return [
      { value: 86400000, label: "24 Hours" }, // 24 * 60 * 60 * 1000
      { value: 172800000, label: "48 Hours" }, // 48 * 60 * 60 * 1000
      { value: 604800000, label: "7 Days" }, // 7 * 24 * 60 * 60 * 1000
      { value: 2592000000, label: "30 Days" }, // 30 * 24 * 60 * 60 * 1000
    ];
  }
}
