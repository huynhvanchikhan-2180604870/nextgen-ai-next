"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/authService.js";

// Auth Store for Next.js
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      // Login
      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.login(credentials);
          console.log("🔐 Login response:", response);
          const { user, tokens } = response;

          // If we have tokens but no user data, fetch fresh profile from backend
          if (tokens && !user) {
            console.log("🔄 Fetching user profile after login...");
            try {
              const profileResponse = await authService.getCurrentUserProfile();
              if (profileResponse.success && profileResponse.user) {
                set({
                  user: profileResponse.user,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null,
                });
                console.log(
                  "✅ User profile fetched after login:",
                  profileResponse.user
                );
                return { success: true, user: profileResponse.user };
              }
            } catch (profileError) {
              console.error(
                "❌ Failed to fetch profile after login:",
                profileError
              );
            }
          }

          // Ensure user data is properly stored
          if (user && typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(user));
          }

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          console.log("✅ Auth state updated:", {
            user,
            isAuthenticated: true,
          });
          return { success: true, user };
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message,
          });

          return { success: false, error: error.message };
        }
      },

      // Register
      register: async (userData) => {
        // Prevent multiple simultaneous registrations
        if (get().isLoading) {
          console.log("⏳ Registration already in progress, skipping...");
          return { success: false, error: "Registration already in progress" };
        }

        set({ isLoading: true, error: null });

        try {
          console.log(
            "🚀 AuthStore: Starting registration for:",
            userData.email
          );
          const response = await authService.register(userData);
          console.log("✅ AuthStore: Registration response:", response);

          const { user, tokens, requiresVerification } = response;

          // If tokens are provided (email verification not required)
          if (tokens) {
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            console.log("✅ AuthStore: User authenticated immediately");
          } else {
            // Email verification required
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
            console.log("📧 AuthStore: Email verification required");

            // Redirect to verify OTP page with email
            if (typeof window !== "undefined") {
              window.location.href = `/auth/verify-otp?email=${encodeURIComponent(
                userData.email
              )}`;
            }
          }

          return {
            success: true,
            user,
            requiresVerification: requiresVerification || !tokens,
          };
        } catch (error) {
          console.error("❌ AuthStore: Registration error:", error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message,
          });

          return { success: false, error: error.message };
        }
      },

      // Logout
      logout: async () => {
        set({ isLoading: true });

        try {
          await authService.logout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          // Clear all auth data
          authService.clearAuthData();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      // Verify OTP
      verifyOTP: async (email, otp) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.verifyOTP(email, otp);
          const { user, tokens } = response;

          // Store tokens and user data
          if (tokens && typeof window !== "undefined") {
            localStorage.setItem("accessToken", tokens.accessToken);
            localStorage.setItem("refreshToken", tokens.refreshToken);
          }
          if (user && typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(user));
          }

          // If we have tokens but no user data, fetch profile from backend
          if (tokens && !user) {
            console.log("🔄 Fetching user profile after OTP verification...");
            try {
              const profileResponse = await authService.getCurrentUserProfile();
              if (profileResponse.success && profileResponse.user) {
                set({
                  user: profileResponse.user,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null,
                });
                console.log(
                  "✅ User profile fetched after OTP:",
                  profileResponse.user
                );
                return { success: true, user: profileResponse.user };
              }
            } catch (profileError) {
              console.error(
                "❌ Failed to fetch profile after OTP:",
                profileError
              );
            }
          }

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, user };
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message,
          });

          return { success: false, error: error.message };
        }
      },

      // Forgot Password
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });

        try {
          await authService.forgotPassword(email);
          set({ isLoading: false, error: null });
          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Reset Password
      resetPassword: async (token, newPassword) => {
        set({ isLoading: true, error: null });

        try {
          await authService.resetPassword(token, newPassword);
          set({ isLoading: false, error: null });
          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Google Login
      googleLogin: async (googleToken) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.googleLogin(googleToken);
          const { user, tokens } = response;

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, user };
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message,
          });

          return { success: false, error: error.message };
        }
      },

      // GitHub Login
      githubLogin: async (githubToken) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.githubLogin(githubToken);
          const { user, tokens } = response;

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, user };
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message,
          });

          return { success: false, error: error.message };
        }
      },

      // Initialize auth state from localStorage
      initializeAuth: async () => {
        try {
          const token = authService.getAccessToken();
          const user = authService.getCurrentUser();

          console.log("🔄 Initializing auth:", {
            hasToken: !!token,
            hasUser: !!user,
          });

          // If we have a token, always try to fetch fresh user profile from backend
          if (token) {
            console.log(
              "🔄 Token found, fetching fresh user profile from backend..."
            );
            try {
              const response = await authService.getCurrentUserProfile();
              if (response.success && response.user) {
                // Token is valid, user profile fetched successfully
                set({
                  user: response.user,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null,
                });
                console.log("✅ Fresh user profile fetched:", response.user);
                return {
                  success: true,
                  user: response.user,
                  isAuthenticated: true,
                };
              } else {
                // Invalid token or no user data, clear auth
                console.log("❌ Invalid token or no user data, clearing auth");
                authService.clearAuthData();
                set({
                  user: null,
                  isAuthenticated: false,
                  isLoading: false,
                  error: null,
                });
                return { success: false, error: "Invalid token" };
              }
            } catch (error) {
              console.error("❌ Failed to fetch user profile:", error);
              // Token might be expired or invalid, clear auth
              authService.clearAuthData();
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
              });
              return { success: false, error: error.message };
            }
          } else {
            // No token, user is not authenticated
            console.log("❌ No token found, user not authenticated");
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
            return { success: false, error: "No token found" };
          }
        } catch (error) {
          console.error("❌ Auth initialization error:", error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message,
          });
          return { success: false, error: error.message };
        }
      },

      // Update user data
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          authService.updateUserData(updatedUser);
          set({ user: updatedUser });
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Set loading
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // Clear all auth data
      clearAuthData: () => {
        // Clear localStorage (only on client side)
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          // Clear sessionStorage
          sessionStorage.removeItem("auth-storage");
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("refreshToken");

          // Clear all auth-related keys
          Object.keys(localStorage).forEach((key) => {
            if (
              key.includes("auth") ||
              key.includes("token") ||
              key.includes("user")
            ) {
              localStorage.removeItem(key);
            }
          });

          Object.keys(sessionStorage).forEach((key) => {
            if (
              key.includes("auth") ||
              key.includes("token") ||
              key.includes("user")
            ) {
              sessionStorage.removeItem(key);
            }
          });
        }

        // Reset state
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });

        console.log("🧹 Đã xóa tất cả dữ liệu auth cũ");
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      storage: typeof window !== "undefined" ? localStorage : undefined,
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        console.log("🔄 Zustand rehydrating auth state:", state);
      },
    }
  )
);
