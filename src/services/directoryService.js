import { apiClient } from '@/lib/apiClient';
import { DIRECTORY, ADMIN } from '@/constants/apiEndpoints';

export class DirectoryService {
  static async browseDirectory(params = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        organizationType,
        themes,
        location,
        experience,
        designation,
        companySize,
        sortBy = "relevance",
        sortOrder = "desc",
        type,
        startsWith,
      } = params;

      const queryParams = {
        page,
        limit,
        sortBy,
        sortOrder,
      };

      if (search) queryParams.search = search;
      if (organizationType) queryParams.organizationType = organizationType;
      if (themes) queryParams.themes = themes;
      if (location) queryParams.location = location;
      if (experience) queryParams.experience = experience;
      if (designation) queryParams.designation = designation;
      if (companySize) queryParams.companySize = companySize;
      if (type) queryParams.type = type;
      if (startsWith) queryParams.startsWith = startsWith;

      const response = await apiClient.get(DIRECTORY.BASE, { params: queryParams });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        pagination: backendResponse.pagination,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Directory] Browse directory error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async searchByCompany(companyName, params = {}) {
    try {
      const { page = 1, limit = 20, sortBy = "name" } = params;

      const response = await apiClient.get(DIRECTORY.BASE, {
        params: {
          search: companyName,
          type: "organization",
          page,
          limit,
          sortBy,
        }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        pagination: backendResponse.pagination,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Directory] Search by company error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async searchByPerson(personName, params = {}) {
    try {
      const { page = 1, limit = 20, sortBy = "name" } = params;

      const response = await apiClient.get(DIRECTORY.BASE, {
        params: {
          search: personName,
          type: "people",
          page,
          limit,
          sortBy,
        }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        pagination: backendResponse.pagination,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Directory] Search by person error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async alphabeticalBrowse(letter, params = {}) {
    try {
      const { page = 1, limit = 20, type = "all", sortBy = "name" } = params;

      const response = await apiClient.get(DIRECTORY.BASE, {
        params: {
          startsWith: letter.toUpperCase(),
          type,
          page,
          limit,
          sortBy,
        }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        pagination: backendResponse.pagination,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Directory] Alphabetical browse error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async advancedSearch(filters) {
    try {
      const {
        keywords,
        organizationType,
        themes = [],
        location,
        experienceRange,
        designations = [],
        companySize,
        industries = [],
        skills = [],
        certifications = [],
        languages = [],
        availability,
        page = 1,
        limit = 20,
        sortBy = "relevance",
      } = filters;

      const queryParams = {
        page,
        limit,
        sortBy,
      };

      if (keywords) queryParams.search = keywords;
      if (organizationType) queryParams.organizationType = organizationType;
      if (location) queryParams.location = location;
      if (experienceRange) queryParams.experience = experienceRange;
      if (companySize) queryParams.companySize = companySize;
      if (availability) queryParams.availability = availability;

      if (themes.length > 0) queryParams.themes = themes;
      if (designations.length > 0) queryParams.designation = designations;
      if (industries.length > 0) queryParams.industry = industries;
      if (skills.length > 0) queryParams.skills = skills;
      if (certifications.length > 0) queryParams.certifications = certifications;
      if (languages.length > 0) queryParams.languages = languages;

      const response = await apiClient.get(DIRECTORY.SEARCH, { params: queryParams });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        pagination: backendResponse.pagination,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Directory] Advanced search error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getProfileDetails(profileId) {
    try {
      const response = await apiClient.get(DIRECTORY.BY_ID(profileId));
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Directory] Get profile details error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getSimilarProfiles(profileId, params = {}) {
    try {
      const { limit = 10, criteria = "themes" } = params;

      const response = await apiClient.get(`/directory/profile/${profileId}/similar`, {
        params: { limit, criteria }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Directory] Get similar profiles error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getDirectoryStats() {
    try {
      const response = await apiClient.get(DIRECTORY.STATS);
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Directory] Get directory stats error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getFeaturedProfiles(params = {}) {
    try {
      const { limit = 10, category = "all" } = params;

      const response = await apiClient.get(DIRECTORY.FEATURED, {
        params: { limit, category }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Directory] Get featured profiles error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async setFeaturedProfile(profileId, featured = true) {
    try {
      const response = await apiClient.post(DIRECTORY.SET_FEATURED(profileId), {
        featured
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Directory] Set featured profile error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getDirectoryAnalytics(params = {}) {
    try {
      const { timeframe = "30d", groupBy = "day" } = params;

      const response = await apiClient.get(ADMIN.DIRECTORY.ANALYTICS, {
        params: { timeframe, groupBy }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
      };
    } catch (error) {
      console.error('[Directory] Get directory analytics error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static getSearchTypes() {
    return [
      { value: "all", label: "All Results" },
      { value: "people", label: "People" },
      { value: "organization", label: "Organizations" },
    ];
  }

  static getSortOptions() {
    return [
      { value: "relevance", label: "Relevance" },
      { value: "name", label: "Name" },
      { value: "experience", label: "Experience" },
      { value: "location", label: "Location" },
      { value: "joinDate", label: "Join Date" },
      { value: "lastActive", label: "Last Active" },
      { value: "connections", label: "Connections" },
    ];
  }

  static getExperienceRanges() {
    return [
      { value: "0-2", label: "0-2 years" },
      { value: "3-5", label: "3-5 years" },
      { value: "6-10", label: "6-10 years" },
      { value: "11-15", label: "11-15 years" },
      { value: "16-20", label: "16-20 years" },
      { value: "20+", label: "20+ years" },
    ];
  }

  static getCompanySizes() {
    return [
      { value: "startup", label: "Startup (1-10)" },
      { value: "small", label: "Small (11-50)" },
      { value: "medium", label: "Medium (51-200)" },
      { value: "large", label: "Large (201-1000)" },
      { value: "enterprise", label: "Enterprise (1000+)" },
    ];
  }

  static getIndustries() {
    return [
      { value: "technology", label: "Technology" },
      { value: "healthcare", label: "Healthcare" },
      { value: "finance", label: "Finance" },
      { value: "education", label: "Education" },
      { value: "nonprofit", label: "Non-Profit" },
      { value: "government", label: "Government" },
      { value: "consulting", label: "Consulting" },
      { value: "manufacturing", label: "Manufacturing" },
      { value: "retail", label: "Retail" },
      { value: "energy", label: "Energy" },
      { value: "agriculture", label: "Agriculture" },
      { value: "transportation", label: "Transportation" },
    ];
  }

  static getAlphabetLetters() {
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(letter => ({
      value: letter,
      label: letter,
    }));
  }

  static getFeaturedCategories() {
    return [
      { value: "all", label: "All Categories" },
      { value: "csr-leaders", label: "CSR Leaders" },
      { value: "sustainability-experts", label: "Sustainability Experts" },
      { value: "social-entrepreneurs", label: "Social Entrepreneurs" },
      { value: "impact-investors", label: "Impact Investors" },
      { value: "nonprofit-directors", label: "Nonprofit Directors" },
    ];
  }
}
