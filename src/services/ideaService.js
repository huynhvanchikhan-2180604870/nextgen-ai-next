import { API_ENDPOINTS } from "../config/api.js";
import api from "./apiClient.js";

// Idea Service for managing AI-generated ideas
export const ideaService = {
  // Get all user's ideas
  async getIdeas(params = {}) {
    try {
      console.log("💡 Fetching ideas with params:", params);

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.status) queryParams.append("status", params.status);
      if (params.category) queryParams.append("category", params.category);
      if (params.search) queryParams.append("search", params.search);

      const url = `${API_ENDPOINTS.IDEAS.LIST}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      const response = await api.get(url);

      console.log("✅ Ideas fetched successfully:", response);
      return response;
    } catch (error) {
      console.error("❌ Error fetching ideas:", error);
      throw new Error(error.message || "Không thể tải danh sách ý tưởng");
    }
  },

  // Get idea by ID
  async getIdeaById(id) {
    try {
      console.log("💡 Fetching idea by ID:", id);
      const url = API_ENDPOINTS.IDEAS.DETAIL.replace(":id", id);
      const response = await api.get(url);

      console.log("✅ Idea fetched successfully:", response);
      return response;
    } catch (error) {
      console.error("❌ Error fetching idea:", error);
      throw new Error(error.message || "Không thể tải thông tin ý tưởng");
    }
  },

  // Create new idea
  async createIdea(ideaData) {
    try {
      console.log("💡 Creating new idea:", ideaData);
      const response = await api.post(API_ENDPOINTS.IDEAS.CREATE, ideaData);

      console.log("✅ Idea created successfully:", response);
      return response;
    } catch (error) {
      console.error("❌ Error creating idea:", error);
      throw new Error(error.message || "Không thể tạo ý tưởng mới");
    }
  },

  // Update idea
  async updateIdea(id, ideaData) {
    try {
      console.log("💡 Updating idea:", id, ideaData);
      const url = API_ENDPOINTS.IDEAS.UPDATE.replace(":id", id);
      const response = await api.put(url, ideaData);

      console.log("✅ Idea updated successfully:", response);
      return response;
    } catch (error) {
      console.error("❌ Error updating idea:", error);
      throw new Error(error.message || "Không thể cập nhật ý tưởng");
    }
  },

  // Delete idea
  async deleteIdea(id) {
    try {
      console.log("💡 Deleting idea:", id);
      const url = API_ENDPOINTS.IDEAS.DELETE.replace(":id", id);
      const response = await api.delete(url);

      console.log("✅ Idea deleted successfully:", response);
      return response;
    } catch (error) {
      console.error("❌ Error deleting idea:", error);
      throw new Error(error.message || "Không thể xóa ý tưởng");
    }
  },

  // Export idea
  async exportIdea(id, format = "json") {
    try {
      console.log("💡 Exporting idea:", id, format);
      const url = `${API_ENDPOINTS.IDEAS.EXPORT.replace(
        ":id",
        id
      )}?format=${format}`;
      const response = await api.get(url);

      console.log("✅ Idea exported successfully:", response);
      return response;
    } catch (error) {
      console.error("❌ Error exporting idea:", error);
      throw new Error(error.message || "Không thể xuất ý tưởng");
    }
  },

  // Get idea statistics
  async getIdeaStats() {
    try {
      console.log("💡 Fetching idea statistics");
      const response = await api.get(API_ENDPOINTS.IDEAS.STATS);

      console.log("✅ Idea stats fetched successfully:", response);
      return response;
    } catch (error) {
      console.error("❌ Error fetching idea stats:", error);
      throw new Error(error.message || "Không thể tải thống kê ý tưởng");
    }
  },

  // Search ideas
  async searchIdeas(query, filters = {}) {
    try {
      console.log("💡 Searching ideas:", query, filters);

      const queryParams = new URLSearchParams({ q: query });
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.dateFrom) queryParams.append("dateFrom", filters.dateFrom);
      if (filters.dateTo) queryParams.append("dateTo", filters.dateTo);

      const url = `${API_ENDPOINTS.IDEAS.SEARCH}?${queryParams.toString()}`;
      const response = await api.get(url);

      console.log("✅ Ideas search results:", response);
      return response;
    } catch (error) {
      console.error("❌ Error searching ideas:", error);
      throw new Error(error.message || "Không thể tìm kiếm ý tưởng");
    }
  },

  // Duplicate idea
  async duplicateIdea(id) {
    try {
      console.log("💡 Duplicating idea:", id);
      const url = API_ENDPOINTS.IDEAS.DUPLICATE.replace(":id", id);
      const response = await api.post(url);

      console.log("✅ Idea duplicated successfully:", response);
      return response;
    } catch (error) {
      console.error("❌ Error duplicating idea:", error);
      throw new Error(error.message || "Không thể sao chép ý tưởng");
    }
  },

  // Share idea
  async shareIdea(id, shareData) {
    try {
      console.log("💡 Sharing idea:", id, shareData);
      const url = API_ENDPOINTS.IDEAS.SHARE.replace(":id", id);
      const response = await api.post(url, shareData);

      console.log("✅ Idea shared successfully:", response);
      return response;
    } catch (error) {
      console.error("❌ Error sharing idea:", error);
      throw new Error(error.message || "Không thể chia sẻ ý tưởng");
    }
  },
};
