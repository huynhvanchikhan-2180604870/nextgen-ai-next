"use client";

import axios from "axios";
import { API_CONFIG, ERROR_MESSAGES, HTTP_STATUS } from "../config/api.js";

// Create axios instance
console.log("🔧 API Client initialized with BASE_URL:", API_CONFIG.BASE_URL);

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token to headers
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        console.log("🔑 Token found:", token.substring(0, 20) + "...");
        config.headers.Authorization = `Bearer ${token}`;
        console.log(
          "🔑 Authorization header set:",
          `Bearer ${token.substring(0, 20)}...`
        );
      } else {
        console.log("❌ No token found in localStorage");
      }
    }

    // Log request in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
        config.data
      );
      console.log("🔧 Full URL:", config.baseURL + config.url);
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        response.data
      );
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error in development
    if (process.env.NODE_ENV === "development") {
      console.error(
        `❌ API Error: ${error.config?.method?.toUpperCase()} ${
          error.config?.url
        }`,
        error.response?.data || error.message
      );
    }

    // Handle 401 Unauthorized - try to refresh token
    if (
      error.response?.status === HTTP_STATUS.UNAUTHORIZED &&
      !originalRequest._retry &&
      typeof window !== "undefined"
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}/auth/refresh`,
            {
              refreshToken,
            }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/auth/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case HTTP_STATUS.BAD_REQUEST:
          throw new Error(data.message || ERROR_MESSAGES.VALIDATION_ERROR);
        case HTTP_STATUS.UNAUTHORIZED:
          throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
        case HTTP_STATUS.FORBIDDEN:
          throw new Error(ERROR_MESSAGES.FORBIDDEN);
        case HTTP_STATUS.NOT_FOUND:
          throw new Error(ERROR_MESSAGES.NOT_FOUND);
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          throw new Error(ERROR_MESSAGES.SERVER_ERROR);
        default:
          throw new Error(data.message || ERROR_MESSAGES.UNKNOWN_ERROR);
      }
    } else if (error.request) {
      // Network error
      if (error.code === "ECONNABORTED") {
        throw new Error(ERROR_MESSAGES.TIMEOUT_ERROR);
      }
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    } else {
      // Other error
      throw new Error(error.message || ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  }
);

// API methods
export const api = {
  // GET request
  get: async (url, config = {}) => {
    const response = await apiClient.get(url, config);
    return response.data;
  },

  // POST request
  post: async (url, data = {}, config = {}) => {
    const response = await apiClient.post(url, data, config);
    return response.data;
  },

  // PUT request
  put: async (url, data = {}, config = {}) => {
    const response = await apiClient.put(url, data, config);
    return response.data;
  },

  // PATCH request
  patch: async (url, data = {}, config = {}) => {
    const response = await apiClient.patch(url, data, config);
    return response.data;
  },

  // DELETE request
  delete: async (url, config = {}) => {
    const response = await apiClient.delete(url, config);
    return response.data;
  },

  // Upload file
  upload: async (url, file, onProgress = null) => {
    const formData = new FormData();
    formData.append("file", file);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: onProgress,
    };

    const response = await apiClient.post(url, formData, config);
    return response.data;
  },
};

export default apiClient;
