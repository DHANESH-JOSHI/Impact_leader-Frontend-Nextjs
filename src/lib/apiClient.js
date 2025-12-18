/**
 * Centralized API Client Configuration
 * Handles all HTTP requests with automatic token injection, error handling, and retry logic
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://leader.techwithjoshi.in/";

class ApiClient {
  constructor() {
    // Remove trailing slash from base URL if present
    const cleanBaseURL = API_BASE_URL.replace(/\/$/, "");
    this.baseURL = cleanBaseURL + "/api/v1";
    this.tokenGetter = null;
    this.defaultTimeout = 30000; // 30 seconds
    console.log("[API Client] Initialized with baseURL:", this.baseURL);
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
    const cleanEndpoint = endpoint.startsWith("/")
      ? endpoint.slice(1)
      : endpoint;
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
    const authToken = token || (!skipAuth && this.tokenGetter?.());
    if (authToken) {
      headers["Authorization"] = "Bearer " + authToken;
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

      const requestOptions = {
        method,
        headers,
        signal: timeout ? AbortSignal.timeout(timeout) : undefined,
      };

      // Add body for non-GET requests
      if (data && method !== "GET") {
        requestOptions.body = isFormData ? data : JSON.stringify(data);
      }

      console.log("[API]", method, url, {
        hasAuth: !!headers["Authorization"],
        hasData: !!data,
      });

      const response = await fetch(url, requestOptions);

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
            responseData.message ||
            "HTTP " + response.status + ": " + response.statusText,
          data: responseData,
        };

        console.error("[API Error]", method, url, ":", error);

        // Handle 401 Unauthorized - try to refresh token
        if (response.status === 401 && !skipAuth && !options._isRetryAfterRefresh) {
          console.log('[API] 401 Unauthorized - attempting token refresh');

          // Try to get refresh token from cookie
          if (typeof document !== 'undefined') {
            const refreshToken = document.cookie
              .split('; ')
              .find(row => row.startsWith('refreshToken='))
              ?.split('=')[1];

            if (refreshToken) {
              try {
                // Attempt to refresh the token
                const refreshResponse = await this.post('/auth/refresh', { refreshToken }, { skipAuth: true });

                if (refreshResponse.success && refreshResponse.data?.token) {
                  // Update the token in cookie
                  document.cookie = `authToken=${refreshResponse.data.token}; path=/; max-age=86400; SameSite=Strict`;

                  // Retry the original request with new token
                  console.log('[API] Token refreshed, retrying original request');
                  return this.request(endpoint, {
                    ...options,
                    token: refreshResponse.data.token,
                    _isRetryAfterRefresh: true
                  });
                }
              } catch (refreshError) {
                console.error('[API] Token refresh failed:', refreshError);
                // Clear tokens and redirect to login
                if (typeof window !== 'undefined') {
                  document.cookie = 'authToken=; path=/; max-age=0';
                  document.cookie = 'refreshToken=; path=/; max-age=0';
                  window.location.href = '/?error=session_expired';
                }
              }
            }
          }
        }

        // Retry logic for specific status codes
        if (
          retries > 0 &&
          [408, 429, 500, 502, 503, 504].includes(response.status)
        ) {
          console.log("[API] Retrying... (" + retries + " attempts left)");
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
      console.error("[API Exception]", method, endpoint, ":", error);

      // Retry on network errors
      if (retries > 0 && error.name === "AbortError") {
        console.log(
          "[API] Retrying after timeout... (" + retries + " attempts left)"
        );
        await this.delay(1000);
        return this.request(endpoint, { ...options, retries: retries - 1 });
      }

      return {
        success: false,
        status: 0,
        message: error.message || "Network request failed",
        error: error.name,
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
      const baseUrl = this.baseURL.substring(
        0,
        this.baseURL.indexOf("/api/v1")
      );
      const response = await fetch(baseUrl + "/health");
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
