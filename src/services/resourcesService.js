import { apiClient } from '@/lib/apiClient';
import { RESOURCES } from '@/constants/apiEndpoints';

export class ResourcesService {
  static async getAllResources(params = {}) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        search, 
        category, 
        type, 
        themes, 
        tags,
        isESG,
        isCSR,
        isPublic,
        sort = 'newest'
      } = params;
      
      const queryParams = {
        page,
        limit,
        sort,
        ...(search && { search }),
        ...(category && { category }),
        ...(type && { type }),
        ...(themes && { themes: Array.isArray(themes) ? themes.join(',') : themes }),
        ...(tags && { tags: Array.isArray(tags) ? tags.join(',') : tags }),
        ...(isESG !== undefined && { isESG }),
        ...(isCSR !== undefined && { isCSR }),
        ...(isPublic !== undefined && { isPublic }),
      };

      const response = await apiClient.get(RESOURCES.BASE, { params: queryParams });
      const backendResponse = response.data || {};
      
      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || [],
        pagination: backendResponse.pagination || {},
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Resources] Get resources error:', error);
      return {
        success: false,
        data: [],
        pagination: {},
        message: error.message
      };
    }
  }

  static async searchResources(params = {}) {
    try {
      const { search, themes, sortBy = 'downloads' } = params;
      
      const queryParams = {
        sortBy,
        ...(search && { search }),
        ...(themes && { themes }),
      };

      const response = await apiClient.get(RESOURCES.BASE, { params: queryParams });

      return {
        success: response.success,
        data: response.data || [],
        pagination: response.pagination || {},
        message: response.message
      };
    } catch (error) {
      console.error('[Resources] Search resources error:', error);
      return {
        success: false,
        data: [],
        pagination: {},
        message: error.message
      };
    }
  }

static async createResource(resourceData) {
  try {
      const response = await apiClient.post(RESOURCES.BASE, resourceData);

    return {
      success: response.success,
      data: response.data,
      message: response.message
    };
  } catch (error) {
      console.error('[Resources] Create resource error:', error);
    return {
      success: false,
      message: error.message
    };
  }
}


static async uploadDocumentResource(resourceData, file) {
  try {
    const formData = new FormData();
    
    // Add resource metadata
    Object.keys(resourceData).forEach(key => {
      if (Array.isArray(resourceData[key])) {
        resourceData[key].forEach(item => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, resourceData[key]);
      }
    });
    
    if (file) {
      formData.append('file', file);
    }

      const response = await apiClient.upload(RESOURCES.BASE, formData);

    return {
      success: response.success,
      data: response.data,
      message: response.message
    };
  } catch (error) {
      console.error('[Resources] Upload document resource error:', error);
    return {
      success: false,
      message: error.message
    };
  }
}


  static async uploadVideoResource(resourceData, file) {
    try {
      const formData = new FormData();
      
      Object.keys(resourceData).forEach(key => {
        if (Array.isArray(resourceData[key])) {
          resourceData[key].forEach(item => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, resourceData[key]);
        }
      });
      
      if (file) {
        formData.append('file', file);
      }

      const response = await apiClient.upload(RESOURCES.BASE, formData);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[Resources] Upload video resource error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async uploadAudioResource(resourceData, file) {
    try {
      const formData = new FormData();
      
      Object.keys(resourceData).forEach(key => {
        if (Array.isArray(resourceData[key])) {
          resourceData[key].forEach(item => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, resourceData[key]);
        }
      });
      
      if (file) {
        formData.append('file', file);
      }

      const response = await apiClient.upload(RESOURCES.BASE, formData);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[Resources] Upload audio resource error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async uploadImageResource(resourceData, file) {
    try {
      const formData = new FormData();
      
      Object.keys(resourceData).forEach(key => {
        if (Array.isArray(resourceData[key])) {
          resourceData[key].forEach(item => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, resourceData[key]);
        }
      });
      
      if (file) {
        formData.append('file', file);
      }

      const response = await apiClient.upload(RESOURCES.BASE, formData);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[Resources] Upload image resource error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getResourceById(resourceId) {
    try {
      const response = await apiClient.get(RESOURCES.BY_ID(resourceId));

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[Resources] Get resource by ID error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Download resource (generates download link)
  static async downloadResource(resourceId) {
    try {
      const response = await apiClient.get(RESOURCES.DOWNLOAD(resourceId));

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[Resources] Download resource error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async updateResource(resourceId, updateData) {
    try {
      const response = await apiClient.put(RESOURCES.BY_ID(resourceId), updateData);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[Resources] Update resource error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async deleteResource(resourceId) {
    try {
      const response = await apiClient.delete(RESOURCES.BY_ID(resourceId));

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[Resources] Delete resource error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getResourceCategories() {
    try {
      const response = await apiClient.get(RESOURCES.CATEGORIES);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[Resources] Get resource categories error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getResourceStats() {
    try {
      const response = await apiClient.get(RESOURCES.STATS);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[Resources] Get resource stats error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static getResourceTypes() {
    return [
      { value: 'document', label: 'Document', extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'] },
      { value: 'video', label: 'Video', extensions: ['mp4', 'avi', 'mov', 'wmv', 'flv'] },
      { value: 'audio', label: 'Audio', extensions: ['mp3', 'wav', 'aac', 'ogg'] },
      { value: 'image', label: 'Image', extensions: ['jpg', 'jpeg', 'png', 'svg', 'gif'] },
      { value: 'link', label: 'Link', extensions: [] },
      { value: 'other', label: 'Other', extensions: [] }
    ];
  }

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

  static getSortOptions() {
    return [
      { value: 'newest', label: 'Newest First' },
      { value: 'oldest', label: 'Oldest First' },
      { value: 'downloads', label: 'Most Downloaded' },
      { value: 'name', label: 'Name (A-Z)' }
    ];
  }

}
