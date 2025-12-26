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
    FEED: '/stories/feed',
    ACTIVE: '/stories',
    ARCHIVE: '/stories/archive',
    VIEW: (id) => `/stories/${id}/view`,
    LIKE: (id) => `/stories/${id}/like`,
    SHARE: (id) => `/stories/${id}/share`,
    UPLOAD: '/stories/upload',
    ANALYTICS: '/stories/analytics',
  },

  // ==================== RESOURCES ====================
  RESOURCES: {
    BASE: '/resources',
    BY_ID: (id) => `/resources/${id}`,
    CATEGORIES: '/resources/categories',
    STATS: '/resources/stats',
    BY_CATEGORY: (category) => `/resources/category/${category}`,
    DOWNLOAD: (id) => `/resources/${id}/download`,
    BOOKMARK: (id) => `/resources/${id}/bookmark`,
  },

  // ==================== QNA ====================
  QNA: {
    BASE: '/qa/questions',
    BY_ID: (id) => `/qa/questions/${id}`,
    TRENDING: '/qa/questions/trending',
    UNANSWERED: '/qa/questions/unanswered',
    STATS: '/qa/stats',

    // Actions
    UPVOTE: (id) => `/qa/questions/${id}/vote`,
    DOWNVOTE: (id) => `/qa/questions/${id}/vote`,

    // Answers
    ANSWERS: (id) => `/qa/questions/${id}/answers`,
    ANSWER_BY_ID: (questionId, answerId) => `/qa/questions/${questionId}/answers/${answerId}`,
    ACCEPT_ANSWER: (questionId, answerId) => `/qa/questions/${questionId}/answers/${answerId}/accept`,
    ANSWER_UPVOTE: (questionId, answerId) => `/qa/questions/${questionId}/answers/${answerId}/vote`,
    ANSWER_DOWNVOTE: (questionId, answerId) => `/qa/questions/${questionId}/answers/${answerId}/vote`,
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
    START_CREATION: '/meetings/start-creation',
    VERIFY_ORGANIZER_EMAIL: '/meetings/verify-organizer-email',
    CONFIRM_ORGANIZER_EMAIL: '/meetings/confirm-organizer-email',
    VERIFY_ATTENDEE_EMAILS: '/meetings/verify-attendee-emails',
    CONFIRM_ATTENDEE_EMAIL: '/meetings/confirm-attendee-email',
    COMPLETE_CREATION: '/meetings/complete-creation',
    CREATION_STATUS: (sessionId) => `/meetings/creation-status/${sessionId}`,
  },

  // ==================== SUPPORT ====================
  SUPPORT: {
    BASE: '/support/tickets',
    BY_ID: (id) => `/support/tickets/${id}`,
    STATS: '/support/stats',

    // Ticket actions
    STATUS: (id) => `/support/tickets/${id}/status`,
    PRIORITY: (id) => `/support/tickets/${id}/priority`,
    ASSIGN: (id) => `/support/tickets/${id}/assign`,
    ESCALATE: (id) => `/support/tickets/${id}/escalate`,

    // Replies
    REPLIES: (id) => `/support/tickets/${id}/replies`,
    REPLY_BY_ID: (ticketId, replyId) => `/support/tickets/${ticketId}/replies/${replyId}`,

    // Attachments
    ATTACHMENTS: (id) => `/support/tickets/${id}/attachments`,
    ATTACHMENT_BY_ID: (ticketId, attachmentId) => `/support/tickets/${ticketId}/attachments/${attachmentId}`,
  },

  // ==================== MESSAGES ====================
  MESSAGES: {
    BASE: '/messages',
    CONVERSATIONS: '/messages/conversations',
    CONVERSATION_BY_ID: (id) => `/messages/conversations/${id}`,
    SEND: '/messages/send',
    READ: (id) => `/messages/${id}/read`,
    DELETE: (id) => `/messages/${id}/delete`,
    UPLOAD: '/messages/upload',
    BLOCKED_USERS: '/messages/blocked-users',
    UNREAD_COUNT: '/messages/unread/count',
    SEARCH: '/messages/search',
    BY_USER_ID: (userId) => `/messages/${userId}`,
    BLOCK_USER: (userId) => `/messages/users/${userId}/block`,
    UNBLOCK_USER: (userId) => `/messages/users/${userId}/unblock`,
    GROUPS: '/messages/groups',
    GROUP_BY_ID: (groupId) => `/messages/groups/${groupId}`,
    GROUP_MESSAGES: (groupId) => `/messages/groups/${groupId}/messages`,
    GROUP_MEMBERS: (groupId) => `/messages/groups/${groupId}/members`,
    GROUP_MEMBER_BY_ID: (groupId, userId) => `/messages/groups/${groupId}/members/${userId}`,
    GROUP_LEAVE: (groupId) => `/messages/groups/${groupId}/leave`,
  },

  // ==================== CONNECTIONS ====================
  CONNECTIONS: {
    BASE: '/connections',
    STATS: '/connections/stats',
    REQUESTS: '/connections/requests',
    SUGGESTIONS: '/connections/suggestions',
    MUTUAL: (userId) => `/connections/mutual/${userId}`,
    REQUEST: '/connections/request',
    BY_ID: (id) => `/connections/${id}`,
    ACCEPT: (id) => `/connections/${id}/accept`,
    REJECT: (id) => `/connections/${id}/reject`,
    BLOCK: (id) => `/connections/${id}/block`,
    UNBLOCK: (id) => `/connections/${id}/unblock`,
    STAR: (id) => `/connections/${id}/star`,
    NOTE: (id) => `/connections/${id}/note`,
    PREFERENCES: '/connections/preferences',
    AI_SUGGESTIONS: '/connections/ai-suggestions',
  },

  // ==================== DIRECTORY ====================
  DIRECTORY: {
    BASE: '/directory',
    SEARCH: '/directory/search',
    FILTER: '/directory/filter',
    BY_ID: (id) => `/directory/${id}`,
    STATS: '/directory/stats',
    FEATURED: '/directory/featured',
    SET_FEATURED: (profileId) => `/admin/directory/featured/${profileId}`,
  },

  // ==================== NOTIFICATIONS ====================
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (id) => `/notifications/${id}`,
    UNREAD_COUNT: '/notifications/unread-count',
    UNREAD: '/notifications/unread',
    MARK_READ: (id) => `/notifications/${id}/mark-read`,
    READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
    READ_ALL: '/notifications/read-all',
    DELETE: (id) => `/notifications/${id}`,
    DELETE_ALL: '/notifications/delete-all',
    PREFERENCES: '/notifications/preferences',
  },

  // ==================== THEMES ====================
  THEMES: {
    BASE: '/themes',
    BY_ID: (id) => `/themes/${id}`,
    BULK_CREATE: '/themes/bulk',
  },

  // ==================== ADMIN ====================
  ADMIN: {
    // Dashboard
    DASHBOARD_ANALYTICS: '/admin/analytics',
    DASHBOARD: {
      STATS: '/admin/dashboard/stats',
      ANALYTICS: '/admin/analytics',
    },
    
    // Approvals
    PENDING_APPROVALS: '/admin/approvals/pending',
    APPROVAL_STATS: '/admin/approvals/stats',
    APPROVAL_DETAILS: (id) => `/admin/approvals/${id}`,
    APPROVE_USER: (id) => `/admin/approvals/${id}/approve`,
    REJECT_USER: (id) => `/admin/approvals/${id}/reject`,
    APPROVE_CONTENT: (type, id) => `/admin/approvals/content/${type}/${id}/approve`,
    REJECT_CONTENT: (type, id) => `/admin/approvals/content/${type}/${id}/reject`,
    
    // Flagged Content
    FLAGGED_CONTENT: '/admin/flagged-content',
    FLAGGED_CONTENT_HANDLE: (flagId, action) => `/admin/flagged-content/${flagId}/${action}`,
    
    // Audit Logs
    AUDIT_LOGS: '/admin/audit-logs',
    
    // System
    SYSTEM_HEALTH: '/admin/system/health',
    SYSTEM_CONFIG: '/admin/system/config',
    SYSTEM_DIAGNOSTICS: '/admin/system/diagnostics',
    SYSTEM_DATABASE_HEALTH: '/admin/system/database/health',
    SYSTEM_REDIS_HEALTH: '/admin/system/redis/health',
    SYSTEM_EMAIL_HEALTH: '/admin/system/email/health',
    SYSTEM_STORAGE_HEALTH: '/admin/system/storage/health',
    SYSTEM_METRICS: '/admin/system/metrics',
    SYSTEM_API_STATS: '/admin/system/api-stats',
    SYSTEM_CACHE_CLEAR: '/admin/system/cache/clear',
    SYSTEM_SERVICE_RESTART: '/admin/system/service/restart',
    SYSTEM_LOGS: '/admin/system/logs',
    SYSTEM_PERFORMANCE_TEST: '/admin/system/performance-test',
    
    // Analytics
    USER_ACTIVITY_ANALYTICS: '/admin/analytics/user-activity',
    CONTENT_ANALYTICS: '/admin/analytics/content',
    
    // Maintenance
    MAINTENANCE_NOTIFY: '/admin/maintenance/notify',
    
    // Pending Users
    PENDING_USERS: '/admin/pending-users',
    
    // Export
    EXPORT: (type) => `/admin/export/${type}`,
    
    // Notifications
    NOTIFICATIONS_SEND: '/admin/notifications/send',

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

    // Messages Management
    MESSAGES: {
      BASE: '/admin/messages',
      BY_ID: (id) => `/admin/messages/${id}`,
      ANALYTICS: '/admin/messages/analytics',
    },

    // Meetings Management
    MEETINGS: {
      BASE: '/admin/meetings',
      ANALYTICS: '/admin/meetings/analytics',
    },

    // Directory Management
    DIRECTORY: {
      ANALYTICS: '/admin/directory/analytics',
    },

    // Connections Management
    CONNECTIONS: {
      BASE: '/admin/connections',
      BY_ID: (id) => `/admin/connections/${id}`,
      ANALYTICS: '/admin/connections/analytics',
      FORCE: '/admin/connections/force',
      EXPORT: '/admin/connections/export',
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
export const { AUTH, USERS, POSTS, STORIES, RESOURCES, QNA, MEETINGS, SUPPORT, MESSAGES, CONNECTIONS, DIRECTORY, NOTIFICATIONS, THEMES, ADMIN, MONITORING, HEALTH } = API_ENDPOINTS;