import { apiClient } from '@/lib/apiClient';
import { RESOURCES } from '@/constants/apiEndpoints';
import { authStorage } from '@/lib/storage';
import { RESOURCE_TYPE_ENUM, formatEnumValue } from '@/constants/backendEnums';

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
        isPublic,
        sort = 'newest'
      } = params;
      
      const queryParams = {
        page,
        limit,
        sort, // Backend now supports 'sort' parameter
        ...(search && { search }),
        ...(category && { category }),
        ...(type && { type }),
        ...(themes && { themes: Array.isArray(themes) ? themes.join(',') : themes }),
        ...(tags && { tags: Array.isArray(tags) ? tags.join(',') : tags }),
        // Convert booleans to strings for query params
        ...(isPublic !== undefined && { isPublic: isPublic === true || isPublic === "true" ? "true" : "false" }),
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
      // Skip file field - it will be added separately
      if (key === 'file' || key === 'fileUrl') {
        return;
      }
      
      const value = resourceData[key];
      
      // Handle arrays - send as JSON string (backend can parse it)
      if (Array.isArray(value)) {
        if (value.length > 0) {
          formData.append(key, JSON.stringify(value));
        }
      } 
      // Handle booleans - convert to string (backend toBoolean() will handle it)
      else if (typeof value === 'boolean') {
        formData.append(key, value.toString());
      }
      // Handle other values
      else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    
    // Add file if provided
    if (file) {
      formData.append('file', file);
    }

    console.log('[Resources] Uploading with FormData:', {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      formDataKeys: Array.from(formData.keys())
    });

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
        if (key === 'file' || key === 'fileUrl') {
          return;
        }
        
        const value = resourceData[key];
        
        if (Array.isArray(value)) {
          if (value.length > 0) {
            formData.append(key, JSON.stringify(value));
          }
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
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
        if (key === 'file' || key === 'fileUrl') {
          return;
        }
        
        const value = resourceData[key];
        
        if (Array.isArray(value)) {
          if (value.length > 0) {
            formData.append(key, JSON.stringify(value));
          }
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
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
        if (key === 'file' || key === 'fileUrl') {
          return;
        }
        
        const value = resourceData[key];
        
        if (Array.isArray(value)) {
          if (value.length > 0) {
            formData.append(key, JSON.stringify(value));
          }
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
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


  // Download resource file
  static async downloadResource(resourceId, fileName) {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const endpoint = `/api/v1${RESOURCES.DOWNLOAD(resourceId)}`;
      const url = `${baseURL}${endpoint}`;
      
      // Get auth token using authStorage helper
      const token = typeof window !== 'undefined' ? authStorage.getAccessToken() : null;
      
      // Fetch the file as blob
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Download failed' }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Get the blob
      const blob = await response.blob();
      
      // Create download link
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName || 'resource';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      return {
        success: true,
        message: 'Download started'
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
      // Check if there's a file to upload
      const hasFile = updateData.file && updateData.file instanceof File;
      
      if (hasFile) {
        // Use FormData for file uploads
        const formData = new FormData();
        const file = updateData.file;
        
        // Remove file from updateData before adding other fields
        const { file: _, fileUrl, ...dataWithoutFile } = updateData;
        
        // Add resource metadata
        Object.keys(dataWithoutFile).forEach(key => {
          if (key === 'id') return; // Skip id field
          
          const value = dataWithoutFile[key];
          
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
        
        // Add file
        formData.append('file', file);
        
        console.log('[Resources] Updating resource with file:', {
          resourceId,
          fileName: file.name,
          fileSize: file.size
        });
        
        const response = await apiClient.request(RESOURCES.BY_ID(resourceId), {
          method: 'PUT',
          data: formData,
          isFormData: true
        });
        
        return {
          success: response.success,
          data: response.data,
          message: response.message
        };
      } else {
        // No file - use regular JSON update
        const { file, fileUrl, id, ...dataWithoutFile } = updateData;
        
        const response = await apiClient.put(RESOURCES.BY_ID(resourceId), dataWithoutFile);

        return {
          success: response.success,
          data: response.data,
          message: response.message
        };
      }
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

  // Use backend enum - must match exactly with RESOURCE_TYPE_ENUM
  static getResourceTypes() {
    return RESOURCE_TYPE_ENUM.map(type => ({
      value: type,
      label: formatEnumValue(type)
    }));
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
