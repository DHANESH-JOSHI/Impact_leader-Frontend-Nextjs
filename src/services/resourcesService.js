import { ExternalApiService } from './externalApiService';
import { ImpactLeadersAuthService } from './impactLeadersAuthService';

export class ResourcesService {

  // Get all resources with filters and pagination
  static async getAllResources(params = {}) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search, 
        category, 
        type, 
        themes, 
        sortBy = 'createdAt' 
      } = params;
      
      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy
      });

      if (search) queryParams.append('search', search);
      if (category) queryParams.append('category', category);
      if (type) queryParams.append('type', type);
      if (themes) queryParams.append('themes', themes);

      const endpoint = `/resources?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get resources error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Search resources
  static async searchResources(params = {}) {
    try {
      const { search, themes, sortBy = 'downloads' } = params;
      
      let queryParams = new URLSearchParams({
        sortBy
      });

      if (search) queryParams.append('search', search);
      if (themes) queryParams.append('themes', themes);

      const endpoint = `/resources?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Search resources error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Upload document resource (PDF, DOC, XLS, etc.)
  static async uploadDocumentResource(resourceData, file) {
    try {
      const formData = new FormData();
      
      // Add resource metadata
      Object.keys(resourceData).forEach(key => {
        if (key === 'themes' || key === 'tags') {
          // Handle arrays - convert to JSON string
          formData.append(key, JSON.stringify(resourceData[key]));
        } else {
          formData.append(key, resourceData[key]);
        }
      });

      formData.append('type', 'document');
      
      if (file) {
        formData.append('file', file);
      }

      const response = await ExternalApiService.post('/resources', formData, undefined, true);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Upload document resource error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Upload video resource
  static async uploadVideoResource(resourceData, file) {
    try {
      const formData = new FormData();
      
      // Add resource metadata
      Object.keys(resourceData).forEach(key => {
        if (key === 'themes' || key === 'tags') {
          formData.append(key, JSON.stringify(resourceData[key]));
        } else {
          formData.append(key, resourceData[key]);
        }
      });

      formData.append('type', 'video');
      
      if (file) {
        formData.append('file', file);
      }

      const response = await ExternalApiService.post('/resources', formData, undefined, true);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Upload video resource error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Upload audio resource
  static async uploadAudioResource(resourceData, file) {
    try {
      const formData = new FormData();
      
      // Add resource metadata
      Object.keys(resourceData).forEach(key => {
        if (key === 'themes' || key === 'tags') {
          formData.append(key, JSON.stringify(resourceData[key]));
        } else {
          formData.append(key, resourceData[key]);
        }
      });

      formData.append('type', 'audio');
      
      if (file) {
        formData.append('file', file);
      }

      const response = await ExternalApiService.post('/resources', formData, undefined, true);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Upload audio resource error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Upload image resource
  static async uploadImageResource(resourceData, file) {
    try {
      const formData = new FormData();
      
      // Add resource metadata
      Object.keys(resourceData).forEach(key => {
        if (key === 'themes' || key === 'tags') {
          formData.append(key, JSON.stringify(resourceData[key]));
        } else {
          formData.append(key, resourceData[key]);
        }
      });

      formData.append('type', 'image');
      
      if (file) {
        formData.append('file', file);
      }

      const response = await ExternalApiService.post('/resources', formData, undefined, true);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Upload image resource error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get resource by ID
  static async getResourceById(resourceId) {
    try {
      const response = await ExternalApiService.get(`/resources/${resourceId}`);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get resource by ID error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Download resource (generates download link)
  static async downloadResource(resourceId) {
    try {
      const response = await ExternalApiService.get(`/resources/${resourceId}/download`);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Download resource error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Update resource
  static async updateResource(resourceId, updateData) {
    try {
      const response = await ExternalApiService.put(`/resources/${resourceId}`, updateData);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Update resource error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Delete resource
  static async deleteResource(resourceId) {
    try {
      const response = await ExternalApiService.delete(`/resources/${resourceId}`);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Delete resource error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get resource categories
  static async getResourceCategories() {
    try {
      const response = await ExternalApiService.get('/resources/categories');

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get resource categories error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get resource statistics
  static async getResourceStats() {
    try {
      const response = await ExternalApiService.get('/resources/stats');

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get resource stats error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get resource types
  static getResourceTypes() {
    return [
      { value: 'document', label: 'Document', extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'] },
      { value: 'video', label: 'Video', extensions: ['mp4', 'avi', 'mov', 'wmv', 'flv'] },
      { value: 'audio', label: 'Audio', extensions: ['mp3', 'wav', 'aac', 'ogg'] },
      { value: 'image', label: 'Image', extensions: ['jpg', 'jpeg', 'png', 'svg', 'gif'] }
    ];
  }

  // Get resource categories (static list)
  static getResourceCategoriesStatic() {
    return [
      { value: 'templates', label: 'Templates' },
      { value: 'reports', label: 'Reports' },
      { value: 'training', label: 'Training Materials' },
      { value: 'podcasts', label: 'Podcasts' },
      { value: 'infographics', label: 'Infographics' },
      { value: 'guidelines', label: 'Guidelines' },
      { value: 'case-studies', label: 'Case Studies' },
      { value: 'research', label: 'Research Papers' }
    ];
  }

  // Get resource themes (static list)
  static getResourceThemes() {
    return [
      { value: 'ESG', label: 'ESG' },
      { value: 'sustainability', label: 'Sustainability' },
      { value: 'environment', label: 'Environment' },
      { value: 'social-impact', label: 'Social Impact' },
      { value: 'governance', label: 'Governance' },
      { value: 'education', label: 'Education' },
      { value: 'healthcare', label: 'Healthcare' },
      { value: 'community-development', label: 'Community Development' },
      { value: 'innovation', label: 'Innovation' },
      { value: 'technology', label: 'Technology' }
    ];
  }

  // Get sort options
  static getSortOptions() {
    return [
      { value: 'createdAt', label: 'Date Created' },
      { value: 'downloads', label: 'Download Count' },
      { value: 'views', label: 'View Count' },
      { value: 'title', label: 'Title (A-Z)' },
      { value: 'size', label: 'File Size' }
    ];
  }
}
