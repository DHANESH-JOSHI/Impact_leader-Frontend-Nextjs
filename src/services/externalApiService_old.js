/**
 * External API Service for Impact Leaders API Integration
 * Base service class for all external API communications
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5500/";

// Function to get current token - will be set by auth service
let getCurrentToken = () => null;

export class ExternalApiService {
  // Method to set the token getter function
  static setTokenGetter(tokenGetter) {
    getCurrentToken = tokenGetter;
  }

  static async makeRequest(endpoint, options = {}) {
    try {
      const {
        method = "GET",
        data,
        headers = {},
        token,
        isFormData = false,
        skipAuth = false,
      } = options;

      // Add delay for rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const url = `${API_BASE_URL}/api/v1${endpoint}`;

      // Auto-inject token if not provided and not skipped
      const authToken = token || (!skipAuth ? getCurrentToken() : null);

      const requestOptions = {
        method,
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
          ...headers,
        },
      };

      if (data && method !== "GET") {
        requestOptions.body = isFormData ? data : JSON.stringify(data);
      }

      console.log(`Making ${method} request to:`, url);
      console.log(`🔑 Using token:`, authToken ? "Present" : "None");

      const response = await fetch(url, requestOptions);
      let responseData;

      try {
        responseData = await response.json();
      } catch (parseError) {
        responseData = { message: "Invalid response format" };
      }

      if (!response.ok) {
        // Don't throw error, return structured response
        console.error(
          `API Error ${response.status}:`,
          responseData.message || `HTTP error! status: ${response.status}`
        );
        return {
          success: false,
          message:
            responseData.message || `HTTP error! status: ${response.status}`,
          status: response.status,
          data: responseData,
        };
      }

      return {
        success: true,
        data: responseData,
        status: response.status,
      };
    } catch (error) {
      console.error("External API request failed:", error);
      return {
        success: false,
        message: error.message || "Network error",
        status: error.status || 500,
      };
    }
  }

  static async get(endpoint, token = null, skipAuth = false) {
    return this.makeRequest(endpoint, { method: "GET", token, skipAuth });
  }

  static async post(
    endpoint,
    data,
    token = null,
    isFormData = false,
    skipAuth = false
  ) {
    return this.makeRequest(endpoint, {
      method: "POST",
      data,
      token,
      isFormData,
      skipAuth,
    });
  }

  static async put(
    endpoint,
    data,
    token = null,
    isFormData = false,
    skipAuth = false
  ) {
    return this.makeRequest(endpoint, {
      method: "PUT",
      data,
      token,
      isFormData,
      skipAuth,
    });
  }

  static async delete(endpoint, token = null, skipAuth = false) {
    return this.makeRequest(endpoint, { method: "DELETE", token, skipAuth });
  }

  // Health check
  static async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return {
        success: response.ok,
        status: response.status,
        data: await response.json(),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
