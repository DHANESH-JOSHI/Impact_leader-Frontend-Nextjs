import { ExternalApiService } from "./externalApiService";
import { ImpactLeadersAuthService } from "./impactLeadersAuthService";

export class DirectoryService {

  // Browse directory with search and filters
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
        type, // 'people', 'organization', or 'all'
        startsWith, // For alphabetical browsing (A-Z)
      } = params;

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });

      if (search) queryParams.append("search", search);
      if (organizationType) queryParams.append("organizationType", organizationType);
      if (themes) queryParams.append("themes", themes);
      if (location) queryParams.append("location", location);
      if (experience) queryParams.append("experience", experience);
      if (designation) queryParams.append("designation", designation);
      if (companySize) queryParams.append("companySize", companySize);
      if (type) queryParams.append("type", type);
      if (startsWith) queryParams.append("startsWith", startsWith);

      const endpoint = `/directory?${queryParams.toString()}`;
      const response = await ExternalApiService.get(
        endpoint,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Browse directory error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async searchByCompany(companyName, params = {}) {
    try {
      const { page = 1, limit = 20, sortBy = "name" } = params;

      let queryParams = new URLSearchParams({
        search: companyName,
        type: "organization",
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
      });

      const endpoint = `/directory?${queryParams.toString()}`;
      const response = await ExternalApiService.get(
        endpoint,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Search by company error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async searchByPerson(personName, params = {}) {
    try {
      const { page = 1, limit = 20, sortBy = "name" } = params;

      let queryParams = new URLSearchParams({
        search: personName,
        type: "people",
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
      });

      const endpoint = `/directory?${queryParams.toString()}`;
      const response = await ExternalApiService.get(
        endpoint,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Search by person error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Alphabetical browse (A-Z)
  static async alphabeticalBrowse(letter, params = {}) {
    try {
      const { page = 1, limit = 20, type = "all", sortBy = "name" } = params;

      let queryParams = new URLSearchParams({
        startsWith: letter.toUpperCase(),
        type,
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
      });

      const endpoint = `/directory?${queryParams.toString()}`;
      const response = await ExternalApiService.get(
        endpoint,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Alphabetical browse error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Advanced search with multiple filters
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

      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
      });

      if (keywords) queryParams.append("search", keywords);
      if (organizationType) queryParams.append("organizationType", organizationType);
      if (location) queryParams.append("location", location);
      if (experienceRange) queryParams.append("experience", experienceRange);
      if (companySize) queryParams.append("companySize", companySize);
      if (availability) queryParams.append("availability", availability);

      // Handle array parameters
      themes.forEach(theme => queryParams.append("themes", theme));
      designations.forEach(designation => queryParams.append("designation", designation));
      industries.forEach(industry => queryParams.append("industry", industry));
      skills.forEach(skill => queryParams.append("skills", skill));
      certifications.forEach(cert => queryParams.append("certifications", cert));
      languages.forEach(lang => queryParams.append("languages", lang));

      const endpoint = `/directory/advanced-search?${queryParams.toString()}`;
      const response = await ExternalApiService.get(
        endpoint,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Advanced search error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getProfileDetails(profileId) {
    try {
      const response = await ExternalApiService.get(
        `/directory/profile/${profileId}`,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get profile details error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getSimilarProfiles(profileId, params = {}) {
    try {
      const { limit = 10, criteria = "themes" } = params;

      let queryParams = new URLSearchParams({
        limit: limit.toString(),
        criteria,
      });

      const endpoint = `/directory/profile/${profileId}/similar?${queryParams.toString()}`;
      const response = await ExternalApiService.get(
        endpoint,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get similar profiles error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getDirectoryStats() {
    try {
      const response = await ExternalApiService.get(
        "/directory/stats",
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get directory stats error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getFeaturedProfiles(params = {}) {
    try {
      const { limit = 10, category = "all" } = params;

      let queryParams = new URLSearchParams({
        limit: limit.toString(),
        category,
      });

      const endpoint = `/directory/featured?${queryParams.toString()}`;
      const response = await ExternalApiService.get(
        endpoint,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get featured profiles error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Admin: Manage featured profiles
  static async setFeaturedProfile(profileId, featured = true) {
    try {
      const response = await ExternalApiService.post(
        `/admin/directory/featured/${profileId}`,
        { featured },
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Set featured profile error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Admin: Get directory analytics
  static async getDirectoryAnalytics(params = {}) {
    try {
      const { timeframe = "30d", groupBy = "day" } = params;

      let queryParams = new URLSearchParams({
        timeframe,
        groupBy,
      });

      const endpoint = `/admin/directory/analytics?${queryParams.toString()}`;
      const response = await ExternalApiService.get(
        endpoint,
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error("Get directory analytics error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }


  // Static helper methods for UI
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