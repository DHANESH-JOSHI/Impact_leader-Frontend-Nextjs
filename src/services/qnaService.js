import { ExternalApiService } from './externalApiService';
import { ImpactLeadersAuthService } from './impactLeadersAuthService';

export class QnAService {
  static getAuthToken() {
    const tokens = ImpactLeadersAuthService.getStoredTokens();
    return tokens.accessToken;
  }

  // Get all questions with pagination and filters
  static async getQuestions(params = {}) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search, 
        category, 
        tags,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;
      
      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });

      if (search) queryParams.append('search', search);
      if (category) queryParams.append('category', category);
      if (tags) queryParams.append('tags', tags);

      const endpoint = `/qa/questions?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint, this.getAuthToken());

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get questions error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get question by ID with answers
  static async getQuestionById(questionId) {
    try {
      const response = await ExternalApiService.get(`/qa/questions/${questionId}`, this.getAuthToken());

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get question by ID error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Ask a new question
  static async askQuestion(questionData) {
    try {
      const response = await ExternalApiService.post('/qa/questions', questionData, this.getAuthToken());

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Ask question error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Update question (only by question author or admin)
  static async updateQuestion(questionId, updateData) {
    try {
      const response = await ExternalApiService.put(`/qa/questions/${questionId}`, updateData, this.getAuthToken());

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Update question error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Delete question (admin only)
  static async deleteQuestion(questionId) {
    try {
      const response = await ExternalApiService.delete(`/qa/questions/${questionId}`, this.getAuthToken());

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Delete question error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Answer a question
  static async answerQuestion(questionId, answerData) {
    try {
      const response = await ExternalApiService.post(`/qa/questions/${questionId}/answers`, answerData, this.getAuthToken());

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Answer question error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Update answer
  static async updateAnswer(questionId, answerId, updateData) {
    try {
      const response = await ExternalApiService.put(`/qa/questions/${questionId}/answers/${answerId}`, updateData, this.getAuthToken());

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Update answer error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Delete answer
  static async deleteAnswer(questionId, answerId) {
    try {
      const response = await ExternalApiService.delete(`/qa/questions/${questionId}/answers/${answerId}`, this.getAuthToken());

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Delete answer error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Upvote question
  static async upvoteQuestion(questionId) {
    try {
      const response = await ExternalApiService.post(`/qa/questions/${questionId}/upvote`, {}, this.getAuthToken());

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Upvote question error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Upvote answer
  static async upvoteAnswer(questionId, answerId) {
    try {
      const response = await ExternalApiService.post(`/qa/questions/${questionId}/answers/${answerId}/upvote`, {}, this.getAuthToken());

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Upvote answer error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Mark answer as accepted (question author or admin)
  static async acceptAnswer(questionId, answerId) {
    try {
      const response = await ExternalApiService.post(`/qa/questions/${questionId}/answers/${answerId}/accept`, {}, this.getAuthToken());

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Accept answer error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get Q&A statistics (admin)
  static async getQnAStats() {
    try {
      const response = await ExternalApiService.get('/qa/stats', this.getAuthToken());

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get Q&A stats error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get trending questions
  static async getTrendingQuestions(limit = 10) {
    try {
      const response = await ExternalApiService.get(`/qa/questions/trending?limit=${limit}`, this.getAuthToken());

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get trending questions error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get unanswered questions
  static async getUnansweredQuestions(params = {}) {
    try {
      const { page = 1, limit = 10 } = params;
      
      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        answered: 'false'
      });

      const endpoint = `/qa/questions?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint, this.getAuthToken());

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Get unanswered questions error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get Q&A categories (static list)
  static getQnACategories() {
    return [
      { value: 'program-management', label: 'Program Management' },
      { value: 'sustainability', label: 'Sustainability' },
      { value: 'impact-measurement', label: 'Impact Measurement' },
      { value: 'stakeholder-engagement', label: 'Stakeholder Engagement' },
      { value: 'reporting', label: 'Reporting & Compliance' },
      { value: 'partnerships', label: 'Partnerships' },
      { value: 'funding', label: 'Funding & Budgets' },
      { value: 'governance', label: 'Governance' },
      { value: 'community-outreach', label: 'Community Outreach' },
      { value: 'employee-engagement', label: 'Employee Engagement' },
      { value: 'esg', label: 'ESG' },
      { value: 'technology', label: 'Technology Solutions' },
      { value: 'best-practices', label: 'Best Practices' },
      { value: 'legal-compliance', label: 'Legal & Compliance' }
    ];
  }

  // Get question tags (commonly used)
  static getCommonTags() {
    return [
      'CSR', 'sustainability', 'impact', 'ESG', 'volunteering', 
      'community', 'environment', 'social-responsibility', 'governance',
      'reporting', 'measurement', 'partnerships', 'engagement',
      'best-practices', 'compliance', 'funding', 'strategy'
    ];
  }

  // Get sort options
  static getSortOptions() {
    return [
      { value: 'createdAt', label: 'Most Recent' },
      { value: 'updatedAt', label: 'Recently Active' },
      { value: 'votes', label: 'Most Upvoted' },
      { value: 'answers', label: 'Most Answers' },
      { value: 'views', label: 'Most Viewed' }
    ];
  }
}
