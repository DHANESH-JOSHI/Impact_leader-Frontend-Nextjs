import { apiClient } from '@/lib/apiClient';
import { QNA } from '@/constants/apiEndpoints';

export class QnAService {
  
  static async getQuestions(params = {}) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search, 
        category, 
        tags,
        themes,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;
      
      const queryParams = {
        page,
        limit,
        sortBy,
        sortOrder,
        ...(search && { search }),
        ...(category && { category }),
        ...(tags && { tags }),
        ...(themes && { themes }),
        ...(status && { status }),
      };

      const response = await apiClient.get(QNA.BASE, { params: queryParams });
      const backendResponse = response.data || {};
      
      return {
        success: response.success && backendResponse.success !== false,
        data: backendResponse.data || [],
        pagination: backendResponse.pagination || {},
        message: backendResponse.message || response.message
      };
    } catch (error) {
      console.error('[QnA] Get questions error:', error);
      return {
        success: false,
        data: [],
        pagination: {},
        message: error.message
      };
    }
  }

  static async getQuestionById(questionId) {
    try {
      const response = await apiClient.get(QNA.BY_ID(questionId));

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[QnA] Get question by ID error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Ask a new question
  static async askQuestion(questionData) {
    try {
      const response = await apiClient.post(QNA.BASE, questionData);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[QnA] Ask question error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async updateQuestion(questionId, updateData) {
    try {
      const response = await apiClient.put(QNA.BY_ID(questionId), updateData);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[QnA] Update question error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async deleteQuestion(questionId) {
    try {
      const response = await apiClient.delete(QNA.BY_ID(questionId));

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[QnA] Delete question error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Answer a question
  static async answerQuestion(questionId, answerData) {
    try {
      const response = await apiClient.post(QNA.ANSWERS(questionId), answerData);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[QnA] Answer question error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async updateAnswer(questionId, answerId, updateData) {
    try {
      const response = await apiClient.put(QNA.ANSWER_BY_ID(questionId, answerId), updateData);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[QnA] Update answer error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async deleteAnswer(questionId, answerId) {
    try {
      const response = await apiClient.delete(QNA.ANSWER_BY_ID(questionId, answerId));

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[QnA] Delete answer error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Upvote question
  static async upvoteQuestion(questionId) {
    try {
      const response = await apiClient.post(QNA.UPVOTE(questionId), { voteType: 'up' });

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[QnA] Upvote question error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Upvote answer
  static async upvoteAnswer(questionId, answerId) {
    try {
      const response = await apiClient.post(QNA.ANSWER_UPVOTE(questionId, answerId), { voteType: 'up' });

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[QnA] Upvote answer error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Mark answer as accepted (question author or admin)
  static async acceptAnswer(questionId, answerId) {
    try {
      const response = await apiClient.post(QNA.ACCEPT_ANSWER(questionId, answerId), {});

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[QnA] Accept answer error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getQnAStats() {
    try {
      const response = await apiClient.get(QNA.STATS);

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[QnA] Get Q&A stats error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getTrendingQuestions(limit = 10) {
    try {
      const response = await apiClient.get(QNA.TRENDING, { params: { limit } });

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('[QnA] Get trending questions error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getUnansweredQuestions(params = {}) {
    try {
      const { page = 1, limit = 10 } = params;
      
      const queryParams = {
        page,
        limit,
        status: 'open'
      };

      const response = await apiClient.get(QNA.BASE, { params: queryParams });

      return {
        success: response.success,
        data: response.data || [],
        pagination: response.pagination || {},
        message: response.message
      };
    } catch (error) {
      console.error('[QnA] Get unanswered questions error:', error);
      return {
        success: false,
        data: [],
        pagination: {},
        message: error.message
      };
    }
  }

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

  static getCommonTags() {
    return [
      'CSR', 'sustainability', 'impact', 'ESG', 'volunteering', 
      'community', 'environment', 'social-responsibility', 'governance',
      'reporting', 'measurement', 'partnerships', 'engagement',
      'best-practices', 'compliance', 'funding', 'strategy'
    ];
  }

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
