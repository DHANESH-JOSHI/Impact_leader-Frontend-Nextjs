/**
 * Centralized API Endpoints Constants
 * All API endpoints in one place for easy maintenance
 */

export const API_ENDPOINTS = {
  // ==================== AUTH ====================
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    OTP: {
      SEND: '/auth/otp/send',
      VERIFY: '/auth/otp/verify',
    },
    PASSWORD: {
      FORGOT: '/auth/password/forgot',
      RESET: '/auth/password/reset',
      CHANGE: '/auth/password/change',
    },
  },

  // ==================== USERS ====================
  USERS: {
    BASE: '/users',
    BY_ID: (id) => `/users/${id}`,
    PROFILE: (id) => `/users/${id}/profile`,
    SETTINGS: (id) => `/users/${id}/settings`,
    FOLLOWERS: (id) => `/users/${id}/followers`,
    FOLLOWING: (id) => `/users/${id}/following`,
    FOLLOW: (id) => `/users/${id}/follow`,
    UNFOLLOW: (id) => `/users/${id}/unfollow`,
    BLOCK: (id) => `/users/${id}/block`,
    UNBLOCK: (id) => `/users/${id}/unblock`,
    CONNECTIONS: (id) => `/users/${id}/connections`,
  },

  // ==================== POSTS ====================
  POSTS: {
    BASE: '/posts',
    BY_ID: (id) => `/posts/${id}`,
    UPLOAD: '/posts/upload',
    TRENDING: '/posts/trending',
    SAVED: '/posts/saved',
    FEED: '/posts/feed',

    // Post actions
    UPVOTE: (id) => `/posts/${id}/upvote`,
    DOWNVOTE: (id) => `/posts/${id}/downvote`,
    SAVE: (id) => `/posts/${id}/save`,
    SHARE: (id) => `/posts/${id}/share`,
    REPORT: (id) => `/posts/${id}/report`,
    FLAG: (id) => `/posts/${id}/flag`,

    // Comments
    COMMENTS: (id) => `/posts/${id}/comments`,
    COMMENT_BY_ID: (postId, commentId) => `/posts/${postId}/comments/${commentId}`,
    COMMENT_LIKE: (postId, commentId) => `/posts/${postId}/comments/${commentId}/like`,

    // Poll
    POLL_VOTE: (id) => `/posts/${id}/poll/vote`,
  },

  // ==================== STORIES ====================
  STORIES: {
    BASE: '/stories',
    BY_ID: (id) => `/stories/${id}`,
    ACTIVE: '/stories/active',
    ARCHIVE: '/stories/archive',
    VIEW: (id) => `/stories/${id}/view`,
    LIKE: (id) => `/stories/${id}/like`,
    SHARE: (id) => `/stories/${id}/share`,
  },

  // ==================== RESOURCES ====================
  RESOURCES: {
    BASE: '/resources',
    BY_ID: (id) => `/resources/${id}`,
    CATEGORIES: '/resources/categories',
    BY_CATEGORY: (category) => `/resources/category/${category}`,
    DOWNLOAD: (id) => `/resources/${id}/download`,
    BOOKMARK: (id) => `/resources/${id}/bookmark`,
  },

  // ==================== QNA ====================
  QNA: {
    BASE: '/qna',
    BY_ID: (id) => `/qna/${id}`,
    TRENDING: '/qna/trending',
    UNANSWERED: '/qna/unanswered',

    // Actions
    UPVOTE: (id) => `/qna/${id}/upvote`,
    DOWNVOTE: (id) => `/qna/${id}/downvote`,

    // Answers
    ANSWERS: (id) => `/qna/${id}/answers`,
    ANSWER_BY_ID: (questionId, answerId) => `/qna/${questionId}/answers/${answerId}`,
    ACCEPT_ANSWER: (questionId, answerId) => `/qna/${questionId}/answers/${answerId}/accept`,
    ANSWER_UPVOTE: (questionId, answerId) => `/qna/${questionId}/answers/${answerId}/upvote`,
    ANSWER_DOWNVOTE: (questionId, answerId) => `/qna/${questionId}/answers/${answerId}/downvote`,
  },

  // ==================== MEETINGS ====================
  MEETINGS: {
    BASE: '/meetings',
    BY_ID: (id) => `/meetings/${id}`,
    UPCOMING: '/meetings/upcoming',
    PAST: '/meetings/past',
    JOIN: (id) => `/meetings/${id}/join`,
    LEAVE: (id) => `/meetings/${id}/leave`,
    ATTENDEES: (id) => `/meetings/${id}/attendees`,
  },

  // ==================== MESSAGES ====================
  MESSAGES: {
    BASE: '/messages',
    CONVERSATIONS: '/messages/conversations',
    CONVERSATION_BY_ID: (id) => `/messages/conversations/${id}`,
    SEND: '/messages/send',
    READ: (id) => `/messages/${id}/read`,
    DELETE: (id) => `/messages/${id}/delete`,
  },

  // ==================== DIRECTORY ====================
  DIRECTORY: {
    BASE: '/directory',
    SEARCH: '/directory/search',
    FILTER: '/directory/filter',
    BY_ID: (id) => `/directory/${id}`,
  },

  // ==================== NOTIFICATIONS ====================
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (id) => `/notifications/${id}`,
    UNREAD: '/notifications/unread',
    READ: (id) => `/notifications/${id}/read`,
    READ_ALL: '/notifications/read-all',
    DELETE: (id) => `/notifications/${id}`,
    DELETE_ALL: '/notifications/delete-all',
    PREFERENCES: '/notifications/preferences',
  },

  // ==================== ADMIN ====================
  ADMIN: {
    // Dashboard
    DASHBOARD: {
      STATS: '/admin/dashboard/stats',
      ANALYTICS: '/admin/dashboard/analytics',
    },

    // Posts Management
    POSTS: {
      BASE: '/admin/posts',
      PIN: (id) => `/admin/posts/${id}/pin`,
      UNPIN: (id) => `/admin/posts/${id}/unpin`,
      REPORTED: '/admin/posts/reported',
      REPORTS: (id) => `/admin/posts/reports/${id}`,
      BULK_ACTION: '/admin/posts/bulk-action',
      ANALYTICS: '/admin/posts/analytics',
    },

    // Users Management
    USERS: {
      BASE: '/admin/users',
      BY_ID: (id) => `/admin/users/${id}`,
      BAN: (id) => `/admin/users/${id}/ban`,
      UNBAN: (id) => `/admin/users/${id}/unban`,
      ROLE: (id) => `/admin/users/${id}/role`,
      PERMISSIONS: (id) => `/admin/users/${id}/permissions`,
      BULK_ACTION: '/admin/users/bulk-action',
    },

    // Content Moderation
    MODERATION: {
      FLAGGED: '/admin/moderation/flagged',
      REPORTED: '/admin/moderation/reported',
      REVIEW: (id) => `/admin/moderation/${id}/review`,
      APPROVE: (id) => `/admin/moderation/${id}/approve`,
      REJECT: (id) => `/admin/moderation/${id}/reject`,
    },

    // Settings
    SETTINGS: {
      BASE: '/admin/settings',
      GENERAL: '/admin/settings/general',
      SECURITY: '/admin/settings/security',
      EMAIL: '/admin/settings/email',
      NOTIFICATIONS: '/admin/settings/notifications',
    },
  },

  // ==================== MONITORING ====================
  MONITORING: {
    SYSTEM: {
      HEALTH: '/monitoring/system/health',
      METRICS: '/monitoring/system/metrics',
      LOGS: '/monitoring/system/logs',
    },
    API: {
      METRICS: '/monitoring/api/metrics',
      REALTIME: '/monitoring/api/realtime',
      ANALYTICS: '/monitoring/api/analytics',
    },
    SERVER: {
      STATUS: '/monitoring/server/status',
      PERFORMANCE: '/monitoring/server/performance',
      RESOURCES: '/monitoring/server/resources',
    },
  },

  // ==================== HEALTH ====================
  HEALTH: {
    CHECK: '/health',
    PING: '/health/ping',
    STATUS: '/health/status',
  },
};

// Helper function to build URLs with query parameters
export const buildURL = (endpoint, params = {}) => {
  const url = new URL(endpoint, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });
  return url.pathname + url.search;
};

// Export individual categories for easier imports
export const { AUTH, USERS, POSTS, STORIES, RESOURCES, QNA, MEETINGS, MESSAGES, DIRECTORY, NOTIFICATIONS, ADMIN, MONITORING, HEALTH } = API_ENDPOINTS;
