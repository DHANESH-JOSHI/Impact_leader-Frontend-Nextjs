import { apiClient } from '@/lib/apiClient';
import { POSTS } from '@/constants/apiEndpoints';

export class PostsService {

  // Get all posts with pagination and filters
  static async getAllPosts(params = {}) {
    try {
      const { page = 1, limit = 10, search, type, theme, isPublic } = params;

      const queryParams = {
        page,
        limit,
        ...(search && { search }),
        ...(type && { type }),
        ...(theme && { theme }),
        ...(isPublic !== undefined && { isPublic }),
      };

      const response = await apiClient.get(POSTS.BASE, { params: queryParams });

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[Posts] Get posts error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Create new post (text only)
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

  // Create post with poll
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

  // Get single post by ID
  static async getPost(postId) {
    try {
      const response = await ExternalApiService.get(`/posts/${postId}`);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Update post
  static async updatePost(postId, postData) {
    try {
      const response = await ExternalApiService.put(`/posts/${postId}`, postData);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Update post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Delete post
  static async deletePost(postId) {
    try {
      const response = await ExternalApiService.delete(`/posts/${postId}`);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Delete post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get comments for a post
  static async getPostComments(postId, params = {}) {
    try {
      const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = params;

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });

      const endpoint = `/posts/${postId}/comments?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get post comments error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Update comment
  static async updateComment(postId, commentId, content) {
    try {
      const response = await ExternalApiService.put(`/posts/${postId}/comments/${commentId}`, {
        content
      });

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Update comment error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Delete comment
  static async deleteComment(postId, commentId) {
    try {
      const response = await ExternalApiService.delete(`/posts/${postId}/comments/${commentId}`);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Delete comment error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Like/Unlike comment
  static async toggleCommentLike(postId, commentId) {
    try {
      const response = await ExternalApiService.post(`/posts/${postId}/comments/${commentId}/like`, {});

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Toggle comment like error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Share post
  static async sharePost(postId, shareData = {}) {
    try {
      const response = await ExternalApiService.post(`/posts/${postId}/share`, shareData);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Share post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Save/Bookmark post
  static async savePost(postId) {
    try {
      const response = await ExternalApiService.post(`/posts/${postId}/save`, {});

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Save post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Unsave/Remove bookmark
  static async unsavePost(postId) {
    try {
      const response = await ExternalApiService.delete(`/posts/${postId}/save`);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Unsave post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get saved posts
  static async getSavedPosts(params = {}) {
    try {
      const { page = 1, limit = 10 } = params;

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      const endpoint = `/posts/saved?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get saved posts error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Report post
  static async reportPost(postId, reason, description = '') {
    try {
      const response = await ExternalApiService.post(`/posts/${postId}/report`, {
        reason,
        description
      });

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Report post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Admin: Get reported posts
  static async getReportedPosts(params = {}) {
    try {
      const { page = 1, limit = 10, status = 'pending' } = params;

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status
      });

      const endpoint = `/admin/posts/reported?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get reported posts error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Admin: Handle reported post
  static async handleReportedPost(reportId, action, reason = '') {
    try {
      const response = await ExternalApiService.post(`/admin/posts/reports/${reportId}/${action}`, {
        reason
      });

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Handle reported post error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Admin: Get post analytics
  static async getPostAnalytics(params = {}) {
    try {
      const { timeframe = '30d', groupBy = 'day' } = params;

      let queryParams = new URLSearchParams({
        timeframe,
        groupBy
      });

      const endpoint = `/admin/posts/analytics?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get post analytics error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Admin: Bulk actions on posts
  static async bulkActionPosts(action, postIds, data = {}) {
    try {
      const response = await ExternalApiService.post('/admin/posts/bulk-action', {
        action,
        postIds,
        ...data
      });

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Bulk action posts error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get trending posts
  static async getTrendingPosts(params = {}) {
    try {
      const { limit = 10, timeframe = '24h' } = params;

      let queryParams = new URLSearchParams({
        limit: limit.toString(),
        timeframe
      });

      const endpoint = `/posts/trending?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get trending posts error:', error);
      return {
        success: false,
        message: error.message
      };
    }
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
      { value: 'innovation', label: 'Innovation' },
      { value: 'social-justice', label: 'Social Justice' },
      { value: 'poverty-alleviation', label: 'Poverty Alleviation' },
      { value: 'disaster-relief', label: 'Disaster Relief' },
      { value: 'governance', label: 'Governance' },
      { value: 'human-rights', label: 'Human Rights' }
    ];
  }

  // Get flag reasons
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

  // Get report statuses
  static getReportStatuses() {
    return [
      { value: 'pending', label: 'Pending' },
      { value: 'reviewed', label: 'Reviewed' },
      { value: 'resolved', label: 'Resolved' },
      { value: 'dismissed', label: 'Dismissed' }
    ];
  }

  // Get sort options
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

  // Get bulk action options
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
