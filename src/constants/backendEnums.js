// Backend Enums - These should match exactly with backend models and validators
// DO NOT modify these values - they must match backend

// Story enums
export const STORY_TYPE_ENUM = ['image', 'video', 'text'];
export const STORY_MODERATION_STATUS_ENUM = ['pending', 'approved', 'rejected'];
export const STORY_FONT_FAMILY_ENUM = ['Arial', 'Helvetica', 'Times', 'Courier', 'Georgia'];

// Post enums
export const POST_STATUS_ENUM = ['draft', 'published', 'archived'];
export const POST_MEDIA_TYPE_ENUM = ['image', 'video', 'document'];

// Resource enums
export const RESOURCE_TYPE_ENUM = ['document', 'video', 'audio', 'image', 'link', 'other'];

// Question/QnA enums
export const QUESTION_STATUS_ENUM = ['open', 'answered', 'closed'];
export const QA_PRIORITY_ENUM = ['low', 'medium', 'high', 'urgent'];
export const QUESTION_THEMES_ENUM = [
  // CSR/ESG Core Themes
  'sustainability', 'environment', 'social-responsibility', 'governance', 
  'corporate-social-responsibility', 'environmental-social-governance',
  'climate-change', 'renewable-energy', 'waste-management', 'water-conservation',
  'community-development', 'education', 'healthcare', 'poverty-alleviation',
  'diversity-inclusion', 'human-rights', 'labor-practices', 'supply-chain',
  'ethical-business', 'transparency', 'compliance', 'risk-management',
  // Business Themes
  'technology', 'leadership', 'innovation', 'entrepreneurship', 'management', 
  'strategy', 'marketing', 'finance', 'hr', 'operations'
];

// Support Ticket enums
export const SUPPORT_CATEGORY_ENUM = [
  'General Inquiry',
  'Account & Billing',
  'Feature Request',
  'Bug Report',
  'Technical issue',
  'Data & Privacy',
  'Integration Support',
  'Training & Onboarding',
  'Other'
];
export const SUPPORT_PRIORITY_ENUM = ['Low', 'Medium', 'High', 'Urgent'];
export const SUPPORT_STATUS_ENUM = ['Open', 'In Progress', 'Resolved', 'Closed', 'Waiting'];

// Directory/Organization enums
export const ORGANIZATION_TYPE_ENUM = ['startup', 'corporate', 'nonprofit', 'government', 'freelance', 'other'];

// User enums
export const USER_ROLE_ENUM = ['user', 'admin', 'moderator'];

// Helper functions to format enum values for display
export const formatEnumValue = (value) => {
  if (!value) return '';
  return value
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getEnumLabel = (value, enumArray) => {
  if (!value || !enumArray) return value;
  const index = enumArray.indexOf(value);
  if (index === -1) return value;
  return formatEnumValue(value);
};

