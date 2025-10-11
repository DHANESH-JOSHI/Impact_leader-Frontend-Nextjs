import { apiClient } from '@/lib/apiClient';
import { authStorage } from '@/lib/storage';
import { AUTH } from '@/constants/apiEndpoints';

// Initialize API client with token getter
apiClient.setTokenGetter(() => authStorage.getAccessToken());

export class ImpactLeadersAuthService {
  static async login(email, password) {
    try {
      const response = await apiClient.post(AUTH.LOGIN,
        { email, password },
        { skipAuth: true }
      );

      if (!response.success) {
        if (response.status === 429) {
          return {
            success: false,
            message: "Too many login attempts. Please wait a moment and try again.",
          };
        }

        return {
          success: false,
          message: response.message || "Login failed",
        };
      }

      // Extract auth data from nested response
      const apiData = response.data.data || response.data;

      const tokens = {
        accessToken: apiData.accessToken,
        refreshToken: apiData.refreshToken,
        user: apiData.user,
      };

      // Save to storage
      authStorage.saveTokens(tokens);

      return {
        success: true,
        token: apiData.accessToken,
        refreshToken: apiData.refreshToken,
        user: apiData.user,
      };
    } catch (error) {
      console.error("[Auth] Login error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async loginWithOTP(email, otp, purpose = "login") {
    try {
      const response = await apiClient.post(AUTH.OTP.VERIFY,
        { email, otp, purpose },
        { skipAuth: true }
      );

      if (!response.success) {
        return {
          success: false,
          message: response.message || "OTP verification failed",
        };
      }

      const apiData = response.data.data || response.data;

      const tokens = {
        accessToken: apiData.accessToken,
        refreshToken: apiData.refreshToken,
        user: apiData.user,
      };

      authStorage.saveTokens(tokens);

      return {
        success: true,
        token: apiData.accessToken,
        refreshToken: apiData.refreshToken,
        user: apiData.user,
      };
    } catch (error) {
      console.error("[Auth] OTP Login error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async sendOTP(email, purpose = "login") {
    try {
      const response = await apiClient.post(AUTH.OTP.SEND,
        { email, purpose },
        { skipAuth: true }
      );

      return {
        success: response.success,
        message: response.success ? "OTP sent successfully" : response.message,
      };
    } catch (error) {
      console.error("[Auth] Send OTP error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async register(userData) {
    try {
      const response = await apiClient.post(AUTH.REGISTER,
        userData,
        { skipAuth: true }
      );

      if (!response.success) {
        return {
          success: false,
          message: response.message || "Registration failed",
        };
      }

      return {
        success: true,
        message: response.data.message || "User created successfully",
      };
    } catch (error) {
      console.error("[Auth] Registration error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getCurrentUser() {
    try {
      const accessToken = authStorage.getAccessToken();
      if (!accessToken) {
        return {
          success: false,
          message: "No access token found",
        };
      }

      const response = await apiClient.get(AUTH.ME);

      if (!response.success) {
        return {
          success: false,
          message: response.message || "Failed to get current user",
        };
      }

      const userData = response.data.data || response.data;

      // Update user in storage
      const tokens = authStorage.getTokens();
      tokens.user = userData;
      authStorage.saveTokens(tokens);

      return {
        success: true,
        user: userData,
      };
    } catch (error) {
      console.error("[Auth] Get user error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async refreshToken() {
    try {
      const tokens = authStorage.getTokens();
      if (!tokens.refreshToken) {
        return {
          success: false,
          message: "No refresh token found",
        };
      }

      const response = await apiClient.post(AUTH.REFRESH,
        { refreshToken: tokens.refreshToken },
        { skipAuth: true }
      );

      if (!response.success) {
        authStorage.clearTokens();
        return {
          success: false,
          message: response.message || "Token refresh failed",
        };
      }

      const apiData = response.data.data || response.data;

      const newTokens = {
        accessToken: apiData.accessToken,
        refreshToken: apiData.refreshToken || tokens.refreshToken,
        user: tokens.user,
      };

      authStorage.saveTokens(newTokens);

      return {
        success: true,
        token: apiData.accessToken,
        refreshToken: newTokens.refreshToken,
      };
    } catch (error) {
      console.error("[Auth] Token refresh error:", error);
      authStorage.clearTokens();
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async logout() {
    try {
      const tokens = authStorage.getTokens();

      if (tokens.accessToken && tokens.refreshToken) {
        await apiClient.post(AUTH.LOGOUT, {
          refreshToken: tokens.refreshToken,
        });
      }

      authStorage.clearTokens();

      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (error) {
      console.error("[Auth] Logout error:", error);
      authStorage.clearTokens();
      return {
        success: true,
        message: "Logged out successfully",
      };
    }
  }

  static getStoredTokens() {
    return authStorage.getTokens();
  }

  static setStoredTokens(tokens) {
    authStorage.saveTokens(tokens);
  }

  static clearStoredTokens() {
    authStorage.clearTokens();
  }

  static getCurrentToken() {
    return authStorage.getAccessToken();
  }

  static isAuthenticated() {
    return authStorage.isAuthenticated();
  }
}
