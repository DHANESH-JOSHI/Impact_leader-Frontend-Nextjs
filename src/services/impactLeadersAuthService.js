import { ExternalApiService } from "./externalApiService";

// Store tokens in localStorage for persistence across page refreshes
// In production, consider using more secure storage
let currentTokens = {
  accessToken: null,
  refreshToken: null,
  user: null,
};
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// Load tokens from localStorage on service initialization
const loadTokensFromStorage = () => {
  if (typeof window !== "undefined") {
    try {
      const storedTokens = localStorage.getItem("impactLeadersAuth");
      console.log(
        "🔧 Auth Service: Loading tokens from localStorage",
        storedTokens
      );
      if (storedTokens) {
        const parsed = JSON.parse(storedTokens);
        currentTokens = { ...parsed };
        console.log("🔧 Auth Service: Loaded tokens from localStorage");
      }
    } catch (error) {
      console.error("Error loading tokens from localStorage:", error);
    }
  }
};

// Save tokens to localStorage
const saveTokensToStorage = (tokens) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("impactLeadersTokens", JSON.stringify(tokens));
      console.log("🔧 Auth Service: Saved tokens to localStorage");
    } catch (error) {
      console.error("Error saving tokens to localStorage:", error);
    }
  }
};

// Clear tokens from localStorage
const clearTokensFromStorage = () => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("impactLeadersTokens");
      console.log("🔧 Auth Service: Cleared tokens from localStorage");
    } catch (error) {
      console.error("Error clearing tokens from localStorage:", error);
    }
  }
};

// Initialize tokens from storage
loadTokensFromStorage();

export class ImpactLeadersAuthService {
  static async login(email, password) {
    try {
      const response = await ExternalApiService.post("/auth/login", {
        email,
        password,
      });

      console.log("🔍 Auth Service: ExternalApiService response:", {
        success: response.success,
        status: response.status,
        message: response.message,
      });

      if (!response.success) {
        // Handle specific error cases
        if (response.status === 429) {
          return {
            success: false,
            message:
              "Too many login attempts. Please wait a moment and try again.",
          };
        }

        return {
          success: false,
          message: response.message || "Login failed",
        };
      }

      console.log(
        "🔍 Auth Service: Full API Response:",
        JSON.stringify(response, null, 2)
      );

      // The actual API response structure is nested: response.data.data
      // ExternalApiService returns: { success: true, data: { success: true, data: { accessToken: "...", user: {...} } } }
      const apiData = response.data.data || response.data;

      currentTokens = {
        accessToken: apiData.accessToken,
        refreshToken: apiData.refreshToken,
        user: apiData.user,
      };

      // Save to localStorage for persistence
      saveTokensToStorage(currentTokens);

      console.log(
        "👤 Auth Service: User from apiData.user:",
        JSON.stringify(apiData.user, null, 2)
      );
      console.log(
        "🔑 Auth Service: Stored accessToken:",
        apiData.accessToken ? "Present" : "Missing"
      );

      return {
        success: true,
        token: apiData.accessToken,
        refreshToken: apiData.refreshToken,
        user: apiData.user,
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async loginWithOTP(email, otp, purpose = "login") {
    try {
      const response = await ExternalApiService.post("/auth/otp/verify", {
        email,
        otp,
        purpose,
      });

      if (!response.success) {
        throw new Error(response.message || "OTP verification failed");
      }

      // Store tokens - handle nested response structure
      const apiData = response.data.data || response.data;

      currentTokens = {
        accessToken: apiData.accessToken,
        refreshToken: apiData.refreshToken,
        user: apiData.user,
      };

      // Save to localStorage for persistence
      saveTokensToStorage(currentTokens);

      return {
        success: true,
        token: apiData.accessToken,
        refreshToken: apiData.refreshToken,
        user: apiData.user,
      };
    } catch (error) {
      console.error("OTP Login error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async sendOTP(email, purpose = "login") {
    try {
      const response = await ExternalApiService.post("/auth/otp/send", {
        email,
        purpose,
      });

      return {
        success: response.success,
        message: response.success ? "OTP sent successfully" : response.message,
      };
    } catch (error) {
      console.error("Send OTP error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async register(userData) {
    try {
      const response = await ExternalApiService.post(
        "/auth/register",
        userData
      );

      if (!response.success) {
        throw new Error(response.message || "Registration failed");
      }

      return {
        success: true,
        message: response.data.message || "User created successfully",
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async getCurrentUser() {
    try {
      if (!currentTokens.accessToken) {
        throw new Error("No access token found");
      }

      const response = await ExternalApiService.get(
        "/auth/me",
        currentTokens.accessToken
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to get current user");
      }

      // Handle nested response structure
      const userData = response.data.data || response.data;
      currentTokens.user = userData;

      return {
        success: true,
        user: userData,
      };
    } catch (error) {
      console.error("Get user error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async refreshToken() {
    try {
      if (!currentTokens.refreshToken) {
        throw new Error("No refresh token found");
      }

      const response = await ExternalApiService.post("/auth/refresh", {
        refreshToken: currentTokens.refreshToken,
      });

      if (!response.success) {
        throw new Error(response.message || "Token refresh failed");
      }

      // Update tokens - handle nested response structure
      const apiData = response.data.data || response.data;

      currentTokens.accessToken = apiData.accessToken;
      if (apiData.refreshToken) {
        currentTokens.refreshToken = apiData.refreshToken;
      }

      // Save updated tokens to localStorage
      saveTokensToStorage(currentTokens);

      return {
        success: true,
        token: apiData.accessToken,
        refreshToken: apiData.refreshToken,
      };
    } catch (error) {
      console.error("Token refresh error:", error);
      // Clear tokens on refresh failure
      currentTokens = { accessToken: null, refreshToken: null, user: null };
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async logout() {
    try {
      if (currentTokens.accessToken && currentTokens.refreshToken) {
        await ExternalApiService.post(
          "/auth/logout",
          {
            refreshToken: currentTokens.refreshToken,
          },
          currentTokens.accessToken
        );
      }

      // Clear tokens
      currentTokens = { accessToken: null, refreshToken: null, user: null };
      clearTokensFromStorage();

      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (error) {
      console.error("Logout error:", error);
      // Clear tokens even if logout request fails
      currentTokens = { accessToken: null, refreshToken: null, user: null };
      clearTokensFromStorage();
      return {
        success: true,
        message: "Logged out successfully",
      };
    }
  }

  static getStoredTokens() {
    return { ...currentTokens };
  }

  static setStoredTokens(tokens) {
    currentTokens = { ...tokens };
    saveTokensToStorage(currentTokens);
  }

  static clearStoredTokens() {
    currentTokens = { accessToken: null, refreshToken: null, user: null };
    clearTokensFromStorage();
  }
}
