import { apiClient } from '@/lib/apiClient';
import { POSTS, ADMIN } from '@/constants/apiEndpoints';

export class PostsService {

  static async getAllPosts(params = {}) {
    try {
      const { page = 1, limit = 10, search, type, themes, theme, isPublic, sortBy, sortOrder } = params;

      const queryParams = {
        page,
        limit,
        ...(search && { search }),
        ...(type && { type }),
        ...(themes && { themes: Array.isArray(themes) ? themes.join(',') : themes }),
        ...(theme && { themes: theme }), // Support legacy 'theme' param
        ...(isPublic !== undefined && { isPublic }),
        ...(sortBy && { sortBy }),
        ...(sortOrder && { sortOrder }),
      };

      const response = await apiClient.get(POSTS.BASE, { params: queryParams });
      const backendResponse = response.data || {};
      
      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || [],
        pagination: backendResponse.pagination || {},
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Posts] Get posts error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  static async createPost(postData) {
    try {
      const response = await apiClient.post(POSTS.BASE, postData);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[Posts] Create post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  static async createPostWithImages(postData, images = []) {
    try {
      const formData = new FormData();

      // Add post metadata
      Object.keys(postData).forEach(key => {
        const value = postData[key];
        
        // Handle arrays - send as JSON string (backend can parse it)
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

      // Add images (backend expects 'media' field for multiple files)
      images.forEach(image => {
        if (image instanceof File) {
          formData.append('media', image);
        }
      });

      console.log('[Posts] Uploading post with images:', {
        imageCount: images.length,
        formDataKeys: Array.from(formData.keys())
      });

      const response = await apiClient.upload(POSTS.UPLOAD, formData);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[Posts] Create post with images error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  static async createPollPost(postData, pollData) {
    try {
      const payload = {
        ...postData,
        type: 'poll',
        poll: pollData
      };

      const response = await apiClient.post(POSTS.BASE, payload);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[Posts] Create poll post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Upvote a post
  static async upvotePost(postId) {
    try {
      const response = await apiClient.post(POSTS.UPVOTE(postId), {});

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[Posts] Upvote post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Downvote a post
  static async downvotePost(postId) {
    try {
      const response = await apiClient.post(POSTS.DOWNVOTE(postId), {});

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[Posts] Downvote post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Vote on poll
  static async voteOnPoll(postId, optionIndex) {
    try {
      const response = await apiClient.post(POSTS.POLL_VOTE(postId), {
        optionIndex
      });

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[Posts] Vote on poll error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Add comment to post
  static async addComment(postId, content) {
    try {
      const response = await apiClient.post(POSTS.COMMENTS(postId), {
        content
      });

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[Posts] Add comment error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Flag post (Admin function)
  static async flagPost(postId, reason) {
    try {
      const response = await apiClient.post(POSTS.FLAG(postId), {
        reason
      });

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[Posts] Flag post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Pin/Unpin post (Admin function)
  static async pinPost(postId) {
    try {
      const response = await apiClient.post(`/admin/posts/${postId}/pin`, {});

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[Posts] Pin post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static getPostTypes() {
    return [
      { value: 'announcement', label: 'Announcement' },
      { value: 'project_update', label: 'Project Update' },
      { value: 'poll', label: 'Poll' },
      { value: 'discussion', label: 'Discussion' },
      { value: 'resource_share', label: 'Resource Share' }
    ];
  }

  static async getPost(postId) {
    try {
      const response = await apiClient.get(POSTS.BY_ID(postId));
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Posts] Get post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async updatePost(postId, postData, mediaFiles = []) {
    try {
      // Check if there are media files to upload
      const hasFiles = mediaFiles && mediaFiles.length > 0 && mediaFiles.every(f => f instanceof File);
      
      if (hasFiles) {
        // Use FormData for file uploads
        const formData = new FormData();
        
        // Add post metadata
        Object.keys(postData).forEach(key => {
          const value = postData[key];
          
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
        
        // Add media files
        mediaFiles.forEach(file => {
          if (file instanceof File) {
            formData.append('media', file);
          }
        });
        
        console.log('[Posts] Updating post with media:', {
          postId,
          fileCount: mediaFiles.length
        });
        
        const response = await apiClient.request(POSTS.BY_ID(postId), {
          method: 'PUT',
          data: formData,
          isFormData: true
        });

        return {
          success: response.success,
          data: response.data || response.data?.data || response.data,
          message: response.message || response.data?.message
        };
      } else {
        // No files - use regular JSON update
        const response = await apiClient.put(POSTS.BY_ID(postId), postData);
        const backendResponse = response.data || {};

        return {
          success: response.success,
          data: backendResponse.data || backendResponse,
          message: backendResponse.message || response.message
        };
      }
    } catch (error) {
      console.error('[Posts] Update post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async deletePost(postId) {
    try {
      const response = await apiClient.delete(POSTS.BY_ID(postId));
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Posts] Delete post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getPostComments(postId, params = {}) {
    try {
      const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = params;

      const response = await apiClient.get(POSTS.COMMENTS(postId), {
        params: { page, limit, sortBy, sortOrder }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        pagination: backendResponse.pagination,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Posts] Get post comments error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async updateComment(postId, commentId, content) {
    try {
      const response = await apiClient.put(POSTS.COMMENT_BY_ID(postId, commentId), {
        content
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Posts] Update comment error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async deleteComment(postId, commentId) {
    try {
      const response = await apiClient.delete(POSTS.COMMENT_BY_ID(postId, commentId));
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Posts] Delete comment error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async toggleCommentLike(postId, commentId) {
    try {
      const response = await apiClient.post(POSTS.COMMENT_LIKE(postId, commentId), {});
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Posts] Toggle comment like error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async sharePost(postId, shareData = {}) {
    try {
      const response = await apiClient.post(POSTS.SHARE(postId), shareData);
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Posts] Share post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async savePost(postId) {
    try {
      const response = await apiClient.post(POSTS.SAVE(postId), {});
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Posts] Save post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async unsavePost(postId) {
    try {
      const response = await apiClient.delete(POSTS.SAVE(postId));
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Posts] Unsave post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getSavedPosts(params = {}) {
    try {
      const { page = 1, limit = 10 } = params;

      const response = await apiClient.get(POSTS.SAVED, {
        params: { page, limit }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        pagination: backendResponse.pagination,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Posts] Get saved posts error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async reportPost(postId, reason, description = '') {
    try {
      const response = await apiClient.post(POSTS.REPORT(postId), {
        reason,
        description
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Posts] Report post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getReportedPosts(params = {}) {
    try {
      const { page = 1, limit = 10, status = 'pending' } = params;

      const response = await apiClient.get(ADMIN.POSTS.REPORTED, {
        params: { page, limit, status }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        pagination: backendResponse.pagination,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Posts] Get reported posts error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async handleReportedPost(reportId, action, reason = '') {
    try {
      const response = await apiClient.post(`/admin/posts/reports/${reportId}/${action}`, {
        reason
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Posts] Handle reported post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getPostAnalytics(params = {}) {
    try {
      const { timeframe = '30d', groupBy = 'day' } = params;

      const response = await apiClient.get(ADMIN.POSTS.ANALYTICS, {
        params: { timeframe, groupBy }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Posts] Get post analytics error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async bulkActionPosts(action, postIds, data = {}) {
    try {
      const response = await apiClient.post(ADMIN.POSTS.BULK_ACTION, {
        action,
        postIds,
        ...data
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Posts] Bulk action posts error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getTrendingPosts(params = {}) {
    try {
      const { limit = 10, timeframe = '24h' } = params;

      const response = await apiClient.get(POSTS.TRENDING, {
        params: { limit, timeframe }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[Posts] Get trending posts error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static getPostThemes() {
    return [
      { value: 'environment', label: 'Environment' },
      { value: 'sustainability', label: 'Sustainability' },
      { value: 'education', label: 'Education' },
      { value: 'healthcare', label: 'Healthcare' },
      { value: 'community-development', label: 'Community Development' },
      { value: 'technology', label: 'Technology' },
      { value: 'innovation', label: 'Innovation' },
      { value: 'social-justice', label: 'Social Justice' },
      { value: 'poverty-alleviation', label: 'Poverty Alleviation' },
      { value: 'disaster-relief', label: 'Disaster Relief' },
      { value: 'governance', label: 'Governance' },
      { value: 'human-rights', label: 'Human Rights' }
    ];
  }

  static getFlagReasons() {
    return [
      { value: 'inappropriate', label: 'Inappropriate Content' },
      { value: 'spam', label: 'Spam' },
      { value: 'harassment', label: 'Harassment' },
      { value: 'misinformation', label: 'Misinformation' },
      { value: 'copyright', label: 'Copyright Violation' },
      { value: 'off-topic', label: 'Off-topic' },
      { value: 'duplicate', label: 'Duplicate Content' },
      { value: 'other', label: 'Other' }
    ];
  }

  static getReportStatuses() {
    return [
      { value: 'pending', label: 'Pending' },
      { value: 'reviewed', label: 'Reviewed' },
      { value: 'resolved', label: 'Resolved' },
      { value: 'dismissed', label: 'Dismissed' }
    ];
  }

  static getSortOptions() {
    return [
      { value: 'createdAt', label: 'Date Created' },
      { value: 'updatedAt', label: 'Date Updated' },
      { value: 'upvotes', label: 'Upvotes' },
      { value: 'comments', label: 'Comments' },
      { value: 'views', label: 'Views' },
      { value: 'shares', label: 'Shares' }
    ];
  }

  static getBulkActions() {
    return [
      { value: 'approve', label: 'Approve' },
      { value: 'reject', label: 'Reject' },
      { value: 'pin', label: 'Pin' },
      { value: 'unpin', label: 'Unpin' },
      { value: 'delete', label: 'Delete' },
      { value: 'flag', label: 'Flag' },
      { value: 'unflag', label: 'Unflag' }
    ];
  }

}
