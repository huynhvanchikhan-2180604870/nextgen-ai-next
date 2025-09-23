"use client";

import { API_ENDPOINTS } from "../config/api.js";
import { api } from "./apiClient.js";

// Authentication Service for Next.js
export const authService = {
  // Register new user with retry logic
  async register(userData, retryCount = 0) {
    try {
      console.log(`🚀 Register attempt ${retryCount + 1} for:`, userData.email);
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);

      // Backend returns: { success: true, data: { userId, email, verificationRequired } }
      console.log("✅ Register response:", response);
      return {
        success: response.success,
        data: response.data,
        requiresVerification: response.data?.verificationRequired || true,
      };
    } catch (error) {
      console.error(`❌ Register error (attempt ${retryCount + 1}):`, error);

      // Retry logic for timeout errors
      if (error.message.includes("Yêu cầu quá thời gian") && retryCount < 2) {
        console.log(
          `🔄 Retrying register in 2 seconds... (${retryCount + 1}/2)`
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return this.register(userData, retryCount + 1);
      }

      throw new Error(
        error.response?.data?.message || error.message || "Đăng ký thất bại"
      );
    }
  },

  // Login user
  async login(credentials) {
    try {
      console.log("🔐 Sending login request:", credentials);
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      console.log("🔐 Login response from backend:", response);

      // Backend returns: { success: true, data: { accessToken, refreshToken, user } }
      const { accessToken, refreshToken, user } = response.data;

      // Transform response to match expected structure
      const transformedResponse = {
        user: user,
        tokens: {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      };

      console.log("🔐 Transformed response:", transformedResponse);

      // Store tokens and user data (only on client side)
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        console.log("🔐 Tokens stored in localStorage");
      }

      return transformedResponse;
    } catch (error) {
      console.error("🔐 Login error:", error);
      throw new Error(error.message || "Đăng nhập thất bại");
    }
  },

  // Logout user
  async logout() {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage (only on client side)
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    }
  },

  // Verify OTP
  async verifyOTP(email, otp) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, {
        email,
        otp,
      });

      // Backend returns: { success: true, data: { accessToken, refreshToken, user } }
      const { accessToken, refreshToken, user } = response.data;

      // Store tokens if verification successful (only on client side)
      if (typeof window !== "undefined" && accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
      }

      return response;
    } catch (error) {
      throw new Error(error.message || "Xác thực OTP thất bại");
    }
  },

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        email,
      });
      return response;
    } catch (error) {
      throw new Error(error.message || "Gửi email đặt lại mật khẩu thất bại");
    }
  },

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        password: newPassword,
      });
      return response;
    } catch (error) {
      throw new Error(error.message || "Đặt lại mật khẩu thất bại");
    }
  },

  // Google login
  async googleLogin(googleToken) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, {
        token: googleToken,
      });

      // Backend returns: { success: true, data: { accessToken, refreshToken, user } }
      const { accessToken, refreshToken, user } = response.data;

      // Store tokens and user data (only on client side)
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
      }

      return response;
    } catch (error) {
      throw new Error(error.message || "Đăng nhập Google thất bại");
    }
  },

  // GitHub login
  async githubLogin(githubToken) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.GITHUB_LOGIN, {
        token: githubToken,
      });

      // Backend returns: { success: true, data: { accessToken, refreshToken, user } }
      const { accessToken, refreshToken, user } = response.data;

      // Store tokens and user data (only on client side)
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
      }

      return response;
    } catch (error) {
      throw new Error(error.message || "Đăng nhập GitHub thất bại");
    }
  },

  // Get current user from localStorage (client-side only)
  getCurrentUser() {
    if (typeof window === "undefined") return null;

    try {
      const userStr = localStorage.getItem("user");
      // Check for null, undefined, or "undefined" string
      if (!userStr || userStr === "undefined" || userStr === "null") {
        return null;
      }
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error parsing user data:", error);
      // Clear invalid data
      localStorage.removeItem("user");
      return null;
    }
  },

  // Get current user profile from backend
  async getCurrentUserProfile() {
    try {
      console.log("👤 Getting user profile from:", API_ENDPOINTS.AUTH.PROFILE);

      if (typeof window !== "undefined") {
        console.log(
          "👤 Current token in localStorage:",
          localStorage.getItem("accessToken")?.substring(0, 50) + "..."
        );
      }

      const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
      console.log("👤 User profile response:", response);

      // Backend returns { success: true, data: { user info } }
      const userData = response.data;

      // Update localStorage with fresh user data (only on client side)
      if (typeof window !== "undefined" && userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("👤 Updated user data in localStorage:", userData);
      }

      return {
        success: true,
        user: userData,
      };
    } catch (error) {
      console.error("❌ Failed to get user profile:", error);
      console.error("❌ Error details:", error.response?.data);
      return {
        success: false,
        error: error.message || "Failed to get user profile",
      };
    }
  },

  // Check if user is authenticated (client-side only)
  isAuthenticated() {
    if (typeof window === "undefined") return false;

    const token = localStorage.getItem("accessToken");
    const user = this.getCurrentUser();
    return !!(token && user);
  },

  // Get access token (client-side only)
  getAccessToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  },

  // Get refresh token (client-side only)
  getRefreshToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refreshToken");
  },

  // Update user data in localStorage (client-side only)
  updateUserData(userData) {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  },

  // Clear all auth data (client-side only)
  clearAuthData() {
    if (typeof window === "undefined") return;

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },
};
