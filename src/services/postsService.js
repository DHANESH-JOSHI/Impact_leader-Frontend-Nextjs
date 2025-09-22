import { ExternalApiService } from './externalApiService';
import { ImpactLeadersAuthService } from './impactLeadersAuthService';

export class PostsService {
  static getAuthToken() {
    const tokens = ImpactLeadersAuthService.getStoredTokens();
    return tokens.accessToken;
  }

  // Get all posts with pagination and filters
  static async getAllPosts(params = {}) {
    try {
      const { page = 1, limit = 10, search, type, theme, isPublic } = params;
      
      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (search) queryParams.append('search', search);
      if (type) queryParams.append('type', type);
      if (theme) queryParams.append('theme', theme);
      if (isPublic !== undefined) queryParams.append('isPublic', isPublic.toString());

      const endpoint = `/posts?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint, this.getAuthToken());

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get posts error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Create new post (text only)
  static async createPost(postData) {
    try {
      const response = await ExternalApiService.post('/posts', postData, this.getAuthToken());

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Create post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Create post with images using FormData
  static async createPostWithImages(postData, images = []) {
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.keys(postData).forEach(key => {
        if (Array.isArray(postData[key])) {
          postData[key].forEach(value => {
            formData.append(key, value);
          });
        } else {
          formData.append(key, postData[key]);
        }
      });

      // Add image files
      images.forEach(image => {
        formData.append('images', image);
      });

      const response = await ExternalApiService.post('/posts/upload', formData, this.getAuthToken(), true);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Create post with images error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Create post with poll
  static async createPollPost(postData, pollData) {
    try {
      const payload = {
        ...postData,
        type: 'poll',
        poll: pollData
      };

      const response = await ExternalApiService.post('/posts', payload, this.getAuthToken());

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Create poll post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Upvote a post
  static async upvotePost(postId) {
    try {
      const response = await ExternalApiService.post(`/posts/${postId}/upvote`, {}, this.getAuthToken());

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Upvote post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Downvote a post
  static async downvotePost(postId) {
    try {
      const response = await ExternalApiService.post(`/posts/${postId}/downvote`, {}, this.getAuthToken());

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Downvote post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Vote on poll
  static async voteOnPoll(postId, optionIndex) {
    try {
      const response = await ExternalApiService.post(`/posts/${postId}/poll/vote`, {
        optionIndex
      }, this.getAuthToken());

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Vote on poll error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Add comment to post
  static async addComment(postId, content) {
    try {
      const response = await ExternalApiService.post(`/posts/${postId}/comments`, {
        content
      }, this.getAuthToken());

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Add comment error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Flag post (Admin function)
  static async flagPost(postId, reason) {
    try {
      const response = await ExternalApiService.post(`/posts/${postId}/flag`, {
        reason
      }, this.getAuthToken());

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Flag post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Pin/Unpin post (Admin function)
  static async pinPost(postId) {
    try {
      const response = await ExternalApiService.post(`/admin/posts/${postId}/pin`, {}, this.getAuthToken());

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Pin post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get post types for dropdown
  static getPostTypes() {
    return [
      { value: 'announcement', label: 'Announcement' },
      { value: 'project_update', label: 'Project Update' },
      { value: 'poll', label: 'Poll' },
      { value: 'discussion', label: 'Discussion' },
      { value: 'resource_share', label: 'Resource Share' }
    ];
  }

  // Get post themes
  static getPostThemes() {
    return [
      { value: 'environment', label: 'Environment' },
      { value: 'sustainability', label: 'Sustainability' },
      { value: 'education', label: 'Education' },
      { value: 'healthcare', label: 'Healthcare' },
      { value: 'community-development', label: 'Community Development' },
      { value: 'technology', label: 'Technology' },
      { value: 'innovation', label: 'Innovation' }
    ];
  }
}
