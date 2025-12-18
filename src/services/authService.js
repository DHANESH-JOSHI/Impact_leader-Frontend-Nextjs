import { apiClient } from "@/lib/apiClient";

export class AuthService {
  static async login(email, password) {
    try {
      // Call backend API for login
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      }, { skipAuth: true }); // Skip auth header for login

      if (!response.success) {
        throw new Error(response.message || "Login failed");
      }

      // Backend returns token and user data
      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.message || "Invalid credentials",
      };
    }
  }

  static async register(userData) {
    try {
      // Call backend API for registration
      const response = await apiClient.post('/auth/register', userData, {
        skipAuth: true
      });

      if (!response.success) {
        throw new Error(response.message || "Registration failed");
      }

      return {
        success: true,
        message: response.data.message || "User created successfully",
        data: response.data,
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.message || "Registration failed",
      };
    }
  }

  static async getCurrentUser() {
    try {
      // Call backend API to get current user
      const response = await apiClient.get('/auth/me');

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch user");
      }

      return {
        success: true,
        user: response.data.user,
      };
    } catch (error) {
      console.error("Get user error:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch user",
      };
    }
  }
}
