"use client";

import { API_ENDPOINTS } from "../config/api.js";
import { api } from "./apiClient.js";

// Project Service for Next.js
export const projectService = {
  // Get all projects with pagination and filters
  async getProjects(params = {}) {
    try {
      console.log("📁 Fetching projects with params:", params);

      const queryParams = new URLSearchParams();

      // Add pagination
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);

      // Add filters
      if (params.category) queryParams.append("category", params.category);
      if (params.search) queryParams.append("search", params.search);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
      if (params.minPrice) queryParams.append("minPrice", params.minPrice);
      if (params.maxPrice) queryParams.append("maxPrice", params.maxPrice);
      if (params.featured) queryParams.append("featured", params.featured);

      const url = `${API_ENDPOINTS.PROJECTS.LIST}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      const response = await api.get(url);

      console.log("✅ Projects fetched successfully:", response);
      return response;
    } catch (error) {
      console.error("❌ Error fetching projects:", error);
      throw new Error(error.message || "Không thể tải danh sách dự án");
    }
  },

  // Get project by ID
  async getProjectById(id) {
    try {
      console.log("📁 Fetching project by ID:", id);
      const url = API_ENDPOINTS.PROJECTS.DETAIL.replace(":id", id);
      const response = await api.get(url);

      console.log("✅ Project fetched successfully:", response);
      return response;
    } catch (error) {
      console.error("❌ Error fetching project:", error);
      throw new Error(error.message || "Không thể tải thông tin dự án");
    }
  },

  // Get featured projects
  async getFeaturedProjects() {
    try {
      console.log("⭐ Fetching featured projects");
      const response = await api.get(API_ENDPOINTS.PROJECTS.FEATURED);

      console.log("✅ Featured projects fetched successfully:", response);
      return response;
    } catch (error) {
      console.error("❌ Error fetching featured projects:", error);
      throw new Error(error.message || "Không thể tải dự án nổi bật");
    }
  },

  // Search projects
  async searchProjects(query, filters = {}) {
    try {
      console.log(
        "🔍 Searching projects with query:",
        query,
        "filters:",
        filters
      );

      const queryParams = new URLSearchParams({ q: query });

      // Add filters
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
      if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
      if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
      if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);

      const url = `${API_ENDPOINTS.PROJECTS.SEARCH}?${queryParams.toString()}`;
      const response = await api.get(url);

      console.log("✅ Search results:", response);
      return response;
    } catch (error) {
      console.error("❌ Error searching projects:", error);
      throw new Error(error.message || "Không thể tìm kiếm dự án");
    }
  },

  // Get filter options
  async getFilterOptions() {
    try {
      console.log("🔍 Fetching filter options");
      const response = await api.get(API_ENDPOINTS.PROJECTS.FILTER_OPTIONS);

      console.log("✅ Filter options fetched successfully:", response);
      return response;
    } catch (error) {
      console.error("❌ Error fetching filter options:", error);
      throw new Error(error.message || "Không thể tải tùy chọn lọc");
    }
  },

  // Create new project (authenticated users only)
  async createProject(projectData) {
    try {
      console.log("📝 Creating new project:", projectData);
      const response = await api.post(
        API_ENDPOINTS.PROJECTS.CREATE,
        projectData
      );

      console.log("✅ Project created successfully:", response);
      return response;
    } catch (error) {
      console.error("❌ Error creating project:", error);
      throw new Error(error.message || "Không thể tạo dự án mới");
    }
  },

  // Update project (authenticated users only)
  async updateProject(id, projectData) {
    try {
      console.log("📝 Updating project:", id, projectData);
      const url = API_ENDPOINTS.PROJECTS.UPDATE.replace(":id", id);
      const response = await api.put(url, projectData);

      console.log("✅ Project updated successfully:", response);
      return response;
    } catch (error) {
      console.error("❌ Error updating project:", error);
      throw new Error(error.message || "Không thể cập nhật dự án");
    }
  },

  // Delete project (authenticated users only)
  async deleteProject(id) {
    try {
      console.log("🗑️ Deleting project:", id);
      const url = API_ENDPOINTS.PROJECTS.DELETE.replace(":id", id);
      const response = await api.delete(url);

      console.log("✅ Project deleted successfully:", response);
      return response;
    } catch (error) {
      console.error("❌ Error deleting project:", error);
      throw new Error(error.message || "Không thể xóa dự án");
    }
  },

  // Get user's projects (authenticated users only)
  async getUserProjects() {
    try {
      console.log("👤 Fetching user's projects");
      const response = await api.get(API_ENDPOINTS.USER.VAULT);

      console.log("✅ User projects fetched successfully:", response);
      return response;
    } catch (error) {
      console.error("❌ Error fetching user projects:", error);
      throw new Error(error.message || "Không thể tải dự án của bạn");
    }
  },

  // Add project to favorites (authenticated users only)
  async addToFavorites(projectId) {
    try {
      console.log("❤️ Adding project to favorites:", projectId);
      const response = await api.post(`${API_ENDPOINTS.USER.FAVORITES}`, {
        projectId,
      });

      console.log("✅ Project added to favorites:", response);
      return response;
    } catch (error) {
      console.error("❌ Error adding to favorites:", error);
      throw new Error(error.message || "Không thể thêm vào yêu thích");
    }
  },

  // Remove project from favorites (authenticated users only)
  async removeFromFavorites(projectId) {
    try {
      console.log("💔 Removing project from favorites:", projectId);
      const response = await api.delete(
        `${API_ENDPOINTS.USER.FAVORITES}/${projectId}`
      );

      console.log("✅ Project removed from favorites:", response);
      return response;
    } catch (error) {
      console.error("❌ Error removing from favorites:", error);
      throw new Error(error.message || "Không thể xóa khỏi yêu thích");
    }
  },

  // Get user's favorite projects (authenticated users only)
  async getFavoriteProjects() {
    try {
      console.log("❤️ Fetching favorite projects");
      const response = await api.get(API_ENDPOINTS.USER.FAVORITES);

      console.log("✅ Favorite projects fetched successfully:", response);
      return response;
    } catch (error) {
      console.error("❌ Error fetching favorite projects:", error);
      throw new Error(error.message || "Không thể tải danh sách yêu thích");
    }
  },

  // Get project reviews
  async getProjectReviews(projectId, params = {}) {
    try {
      console.log("⭐ Fetching project reviews:", projectId);

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);

      const url = `/projects/${projectId}/reviews${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      const response = await api.get(url);

      console.log("✅ Reviews fetched successfully:", response);
      return response;
    } catch (error) {
      console.error("❌ Error fetching reviews:", error);
      throw new Error(error.message || "Không thể tải đánh giá");
    }
  },

  // Add project review (authenticated users only)
  async addProjectReview(projectId, reviewData) {
    try {
      console.log("⭐ Adding project review:", projectId, reviewData);
      const response = await api.post(
        `/projects/${projectId}/reviews`,
        reviewData
      );

      console.log("✅ Review added successfully:", response);
      return response;
    } catch (error) {
      console.error("❌ Error adding review:", error);
      throw new Error(error.message || "Không thể thêm đánh giá");
    }
  },
};
