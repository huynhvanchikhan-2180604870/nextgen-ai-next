"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";

// ✅ Main Auth Hook (để lấy state nhanh)
export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    verifyOTP,
    forgotPassword,
    resetPassword,
    googleLogin,
    githubLogin,
    initializeAuth,
    updateUser,
    clearError,
    clearAuthData,
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    verifyOTP,
    forgotPassword,
    resetPassword,
    googleLogin,
    githubLogin,
    initializeAuth,
    updateUser,
    clearError,
    clearAuthData,
  };
};

// 🔑 Login mutation
export const useLogin = () => {
  const { login } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      console.log("🔐 useLogin called with:", credentials);
      return await login(credentials);
    },
    onSuccess: (data) => {
      if (data.success) {
        console.log("✅ Login successful:", data.user);
        // Invalidate auth queries
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      }
    },
    onError: (err) => console.error("❌ Login error:", err),
  });
};

// 🔑 Register mutation
export const useRegister = () => {
  const { register } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      if (data.success) {
        console.log("✅ Registration successful:", data.user);
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      }
    },
    onError: (err) => console.error("❌ Register error:", err),
  });
};

// 🔑 Logout mutation
export const useLogout = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      console.log("✅ Logout successful");
      // Clear all cache
      queryClient.clear();
    },
    onError: (err) => console.error("❌ Logout error:", err),
  });
};

// 🔑 Verify OTP
export const useVerifyOTP = () => {
  const { verifyOTP } = useAuthStore();

  return useMutation({
    mutationFn: ({ email, otp }) => verifyOTP(email, otp),
    onSuccess: (data) =>
      data.success && console.log("✅ OTP verification successful:", data.user),
    onError: (err) => console.error("❌ Verify OTP error:", err),
  });
};

// 🔑 Forgot Password
export const useForgotPassword = () => {
  const { forgotPassword } = useAuthStore();

  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) =>
      data.success && console.log("📩 Forgot password email sent"),
    onError: (err) => console.error("❌ Forgot password error:", err),
  });
};

// 🔑 Reset Password
export const useResetPassword = () => {
  const { resetPassword } = useAuthStore();

  return useMutation({
    mutationFn: ({ token, newPassword }) => resetPassword(token, newPassword),
    onSuccess: (data) =>
      data.success && console.log("✅ Password reset successful"),
    onError: (err) => console.error("❌ Reset password error:", err),
  });
};

// 🔑 Google login
export const useGoogleLogin = () => {
  const { googleLogin } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: googleLogin,
    onSuccess: (data) => {
      if (data.success) {
        console.log("✅ Google login successful:", data.user);
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      }
    },
    onError: (err) => console.error("❌ Google login error:", err),
  });
};

// 🔑 GitHub login
export const useGitHubLogin = () => {
  const { githubLogin } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: githubLogin,
    onSuccess: (data) => {
      if (data.success) {
        console.log("✅ GitHub login successful:", data.user);
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      }
    },
    onError: (err) => console.error("❌ GitHub login error:", err),
  });
};

// 🔑 Initialize auth (chạy khi app start)
export const useInitializeAuth = () => {
  const { initializeAuth } = useAuthStore();

  return useQuery({
    queryKey: ["auth", "initialize"],
    queryFn: initializeAuth,
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: false,
  });
};
