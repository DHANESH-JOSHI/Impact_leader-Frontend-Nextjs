/**
 * External API Service for Impact Leaders API Integration
 * Base service class for all external API communications
 */

import { authStorage } from '@/lib/storage';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5500";

// Function to get current token from localStorage using authStorage utility
const getCurrentToken = () => {
  try {
    // Use the centralized authStorage utility
    const token = authStorage.getAccessToken();

    if (!token) {
      console.warn('[ExternalApiService] No token found in storage');
    }

    return token;
  } catch (error) {
    console.error('[ExternalApiService] Error getting token:', error);
    return null;
  }
};

export class ExternalApiService {
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

      // Clean up base URL and endpoint
      const cleanBaseURL = API_BASE_URL.replace(/\/$/, '');
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
      const url = cleanBaseURL + '/api/v1' + cleanEndpoint;

      // Auto-inject token if not provided and not skipped
      const authToken = token || (!skipAuth ? getCurrentToken() : null);

      const requestOptions = {
        method,
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...(authToken && { Authorization: "Bearer " + authToken }),
          ...headers,
        },
      };

      if (data && method !== "GET") {
        requestOptions.body = isFormData ? data : JSON.stringify(data);
      }

      console.log('[ExternalApiService]', method, url);
      console.log('[ExternalApiService] 🔑 Token:', authToken ? 'Present (' + authToken.substring(0, 20) + '...)' : 'None');

      const response = await fetch(url, requestOptions);
      let responseData;

      try {
        responseData = await response.json();
      } catch (parseError) {
        responseData = { message: "Invalid response format" };
      }

      // 🚨 ADD THIS - Log the full error response for debugging
      if (!response.ok) {
        console.error(
          '[ExternalApiService] API Error', response.status + ':',
          responseData.message || ('HTTP error! status: ' + response.status)
        );
        console.error('[ExternalApiService] 🔍 Full error response:', responseData); // ← ADD THIS LINE
        console.error('[ExternalApiService] 🔍 Validation errors:', responseData.errors); // ← ADD THIS LINE
        
        return {
          success: false,
          message: responseData.message || ('HTTP error! status: ' + response.status),
          status: response.status,
          data: responseData,
          errors: responseData.errors, // ← ADD THIS TOO
        };
      }

      return {
        success: true,
        data: responseData,
        status: response.status,
      };
    } catch (error) {
      console.error("[ExternalApiService] Request failed:", error);
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
      const cleanBaseURL = API_BASE_URL.replace(/\/$/, '');
      const response = await fetch(cleanBaseURL + '/health');
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
