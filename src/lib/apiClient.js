/**
 * Centralized API Client Configuration
 * Handles all HTTP requests with automatic token injection, error handling, and retry logic
 */

import { authStorage } from './storage';

// Use direct backend URL (no proxying)
const getBaseURL = () => {
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  const cleanBaseURL = backendUrl.replace(/\/$/, '');
  return cleanBaseURL + '/api/v1';
};

class ApiClient {
  constructor() {
    this.baseURL = getBaseURL();
    this.defaultTimeout = 30000; // 30 seconds
    
    // Initialize token getter to retrieve token from storage
    // Only works on client-side (browser)
    this.tokenGetter = () => {
      if (typeof window === 'undefined') {
        return null;
      }
      try {
        const token = authStorage.getAccessToken();
        if (!token) {
          console.warn('[API Client] No token found in storage');
        }
        return token;
      } catch (error) {
        console.error('[API Client] Error getting token:', error);
        return null;
      }
    };
    
    console.log('[API Client] Initialized with baseURL:', this.baseURL);
  }

  /**
   * Set token getter function
   * @param {Function} getter - Function that returns the current auth token
   */
  setTokenGetter(getter) {
    this.tokenGetter = getter;
  }

  /**
   * Build complete URL with query parameters
   */
  buildURL(endpoint, params = {}) {
    // Remove leading slash from endpoint
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    
    // Use direct backend URL
    const fullURL = `${this.baseURL}/${cleanEndpoint}`;
    const url = new URL(fullURL);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    return url.toString();
  }

  /**
   * Build request headers
   */
  buildHeaders(options = {}) {
    const { token, skipAuth, isFormData, customHeaders = {} } = options;

    const headers = {
      ...(!isFormData && { "Content-Type": "application/json" }),
      ...customHeaders,
    };

    // Auto-inject token if available and not skipped
    if (!skipAuth) {
      const authToken = token || (this.tokenGetter ? this.tokenGetter() : null);
    if (authToken) {
      headers["Authorization"] = "Bearer " + authToken;
      } else {
        if (typeof window !== 'undefined') {
          try {
            const raw = window.localStorage?.getItem('onePurposAuth');
            const parsed = raw ? JSON.parse(raw) : null;
            console.warn('[API Client] No token available for request', {
              hasTokenGetter: !!this.tokenGetter,
              hasRawStorage: !!raw,
              storageValue: parsed ? (parsed.value ? 'wrapped' : 'direct') : 'none',
              accessToken: parsed?.value?.accessToken ? 'present' : parsed?.accessToken ? 'present (direct)' : 'missing'
            });
          } catch (e) {
            console.warn('[API Client] No token available - could not check storage:', e);
          }
        }
      }
    }

    return headers;
  }

  /**
   * Make HTTP request
   */
  async request(endpoint, options = {}) {
    const {
      method = "GET",
      data,
      params,
      token,
      skipAuth = false,
      isFormData = false,
      customHeaders = {},
      timeout = this.defaultTimeout,
      retries = 0,
    } = options;

    try {
      const url = this.buildURL(endpoint, params);
      const headers = this.buildHeaders({
        token,
        skipAuth,
        isFormData,
        customHeaders,
      });

      // Create abort controller for timeout (fallback for browsers that don't support AbortSignal.timeout)
      let abortController;
      let timeoutId;
      if (timeout) {
        abortController = new AbortController();
        timeoutId = setTimeout(() => {
          abortController.abort();
        }, timeout);
      }

      const requestOptions = {
        method,
        headers,
        signal: abortController?.signal,
      };

      // Add body for non-GET requests
      if (data && method !== "GET") {
        requestOptions.body = isFormData ? data : JSON.stringify(data);
      }

      let response;
      try {
        response = await fetch(url, requestOptions);
      } finally {
        // Clear timeout if request completed
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }

      // Parse response
      let responseData;
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = { message: await response.text() };
      }

      // Handle errors
      if (!response.ok) {
        const error = {
          success: false,
          status: response.status,
          message:
            responseData?.message ||
            responseData?.error ||
            ("HTTP " + response.status + ": " + response.statusText),
          data: responseData,
        };

        console.error('[API Error]', method, url, {
          status: response.status,
          statusText: response.statusText,
          message: error.message,
          data: responseData,
        });

        // Handle 401/403 errors - user might be inactive, unauthorized, or pending approval
        if ([401, 403].includes(response.status)) {
          const errorMessage = responseData?.message || responseData?.error || '';
          const isInactive = errorMessage.toLowerCase().includes('inactive') || 
                           errorMessage.toLowerCase().includes('deactivated') ||
                           errorMessage.toLowerCase().includes('account disabled');
          const isPendingApproval = errorMessage.toLowerCase().includes('pending') ||
                                  errorMessage.toLowerCase().includes('approval') ||
                                  responseData?.isPendingApproval === true;
          
          // Only auto-redirect for inactive accounts, not pending approval
          // Pending approval should show error message on login page
          if (isInactive && !isPendingApproval && typeof window !== 'undefined') {
            // Clear auth tokens for inactive users
            try {
              const { authStorage } = require('./storage');
              authStorage.clearTokens();
              document.cookie = "authToken=; path=/; max-age=0; SameSite=Lax";
              
              // Redirect to appropriate login page
              const currentPath = window.location.pathname;
              if (currentPath.startsWith('/user')) {
                window.location.href = '/user/login?error=account_inactive';
              } else {
                window.location.href = '/?error=account_inactive';
              }
            } catch (storageError) {
              console.error('[API] Failed to clear tokens:', storageError);
            }
          }
        }

        // Retry logic for specific status codes
        if (
          retries > 0 &&
          [408, 429, 500, 502, 503, 504].includes(response.status)
        ) {
          console.log('[API] Retrying... (' + retries + ' attempts left)');
          await this.delay(1000);
          return this.request(endpoint, { ...options, retries: retries - 1 });
        }

        return error;
      }

      return {
        success: true,
        status: response.status,
        data: responseData,
      };
    } catch (error) {
      const url = this.buildURL(endpoint, options.params);
      console.error('[API Exception]', method, endpoint, ':', {
        error: error.message,
        name: error.name,
        url: url,
        cause: error.cause,
        stack: error.stack
      });

      // Retry on network errors (but not CORS errors)
      if (retries > 0 && (error.name === "AbortError" || error.name === "TypeError")) {
        // Don't retry CORS errors
        if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
          console.warn('[API] CORS or network error detected, not retrying');
        } else {
          console.log(
            '[API] Retrying after error... (' + retries + ' attempts left)'
          );
          await this.delay(1000);
          return this.request(endpoint, { ...options, retries: retries - 1 });
        }
      }

      // Provide more helpful error messages
      let errorMessage = error.message || "Network request failed";
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        errorMessage = "Unable to connect to server. Please check your network connection and ensure the backend server is running.";
      } else if (error.message?.includes('CORS')) {
        errorMessage = "CORS error: The server is blocking this request. Please check server CORS configuration.";
      }

      return {
        success: false,
        status: 0,
        message: errorMessage,
        error: error.name,
        url: url,
      };
    }
  }

  /**
   * Delay helper for retries
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  /**
   * POST request
   */
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: "POST", data });
  }

  /**
   * PUT request
   */
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: "PUT", data });
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: "PATCH", data });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }

  /**
   * Upload file(s)
   */
  async upload(endpoint, formData, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      data: formData,
      isFormData: true,
    });
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const baseUrl = this.baseURL.substring(0, this.baseURL.indexOf('/api/v1'));
      const response = await fetch(baseUrl + '/health');
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

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for creating new instances if needed
export { ApiClient };
