import { API_ENDPOINTS } from "../config/api.js";
import { api } from "./apiClient.js";

// AI Planner Service
export const aiPlannerService = {
  // Create new AI session
  async createSession(sessionData) {
    try {
      const response = await api.post(
        API_ENDPOINTS.AI_PLANNER.SESSIONS,
        sessionData
      );
      return response;
    } catch (error) {
      throw new Error(error.message || "Tạo phiên AI thất bại");
    }
  },

  // Get AI session by ID
  async getSession(sessionId) {
    try {
      const url = API_ENDPOINTS.AI_PLANNER.SESSION_DETAIL.replace(
        ":id",
        sessionId
      );
      const response = await api.get(url);
      return response;
    } catch (error) {
      throw new Error(error.message || "Lấy thông tin phiên AI thất bại");
    }
  },

  // Get user's AI sessions
  async getUserSessions(page = 1, limit = 10) {
    try {
      const response = await api.get(
        `${API_ENDPOINTS.AI_PLANNER.SESSIONS}?page=${page}&limit=${limit}`
      );
      return response;
    } catch (error) {
      throw new Error(error.message || "Lấy danh sách phiên AI thất bại");
    }
  },

  // Generate AI project plan
  async generatePlan(sessionId, projectDetails) {
    try {
      const url = API_ENDPOINTS.AI_PLANNER.GENERATE_PLAN.replace(
        ":id",
        sessionId
      );
      const response = await api.post(url, projectDetails);
      return response;
    } catch (error) {
      throw new Error(error.message || "Tạo kế hoạch dự án thất bại");
    }
  },

  // Send chat message to AI
  async sendChatMessage(sessionId, message) {
    try {
      const url = API_ENDPOINTS.AI_PLANNER.CHAT.replace(":id", sessionId);
      const response = await api.post(url, { message });
      return response;
    } catch (error) {
      throw new Error(error.message || "Gửi tin nhắn AI thất bại");
    }
  },

  // Get chat history
  async getChatHistory(sessionId, page = 1, limit = 50) {
    try {
      const response = await api.get(
        `${API_ENDPOINTS.AI_PLANNER.CHAT.replace(
          ":id",
          sessionId
        )}?page=${page}&limit=${limit}`
      );
      return response;
    } catch (error) {
      throw new Error(error.message || "Lấy lịch sử chat thất bại");
    }
  },

  // Get AI recommendations
  async getRecommendations(preferences = {}) {
    try {
      const response = await api.post(
        API_ENDPOINTS.AI_PLANNER.RECOMMENDATIONS,
        preferences
      );
      return response;
    } catch (error) {
      throw new Error(error.message || "Lấy gợi ý AI thất bại");
    }
  },

  // Update session
  async updateSession(sessionId, updateData) {
    try {
      const url = API_ENDPOINTS.AI_PLANNER.SESSION_DETAIL.replace(
        ":id",
        sessionId
      );
      const response = await api.put(url, updateData);
      return response;
    } catch (error) {
      throw new Error(error.message || "Cập nhật phiên AI thất bại");
    }
  },

  // Delete session
  async deleteSession(sessionId) {
    try {
      const url = API_ENDPOINTS.AI_PLANNER.SESSION_DETAIL.replace(
        ":id",
        sessionId
      );
      const response = await api.delete(url);
      return response;
    } catch (error) {
      throw new Error(error.message || "Xóa phiên AI thất bại");
    }
  },

  // Export plan as PDF
  async exportPlanAsPDF(sessionId) {
    try {
      const response = await api.get(
        `/ai-planner/sessions/${sessionId}/export/pdf`,
        {
          responseType: "blob",
        }
      );
      return response;
    } catch (error) {
      throw new Error(error.message || "Xuất kế hoạch PDF thất bại");
    }
  },

  // Export plan as Markdown
  async exportPlanAsMarkdown(sessionId) {
    try {
      const response = await api.get(
        `/ai-planner/sessions/${sessionId}/export/markdown`,
        {
          responseType: "blob",
        }
      );
      return response;
    } catch (error) {
      throw new Error(error.message || "Xuất kế hoạch Markdown thất bại");
    }
  },

  // Save plan as project
  async savePlanAsProject(sessionId, projectData) {
    try {
      const response = await api.post(
        `/ai-planner/sessions/${sessionId}/save-project`,
        projectData
      );
      return response;
    } catch (error) {
      throw new Error(error.message || "Lưu kế hoạch thành dự án thất bại");
    }
  },

  // Get session statistics
  async getSessionStats(sessionId) {
    try {
      const response = await api.get(`/ai-planner/sessions/${sessionId}/stats`);
      return response;
    } catch (error) {
      throw new Error(error.message || "Lấy thống kê phiên AI thất bại");
    }
  },

  // Analyze project complexity
  async analyzeComplexity(projectDetails) {
    try {
      const response = await api.post(
        "/ai-planner/analyze-complexity",
        projectDetails
      );
      return response;
    } catch (error) {
      throw new Error(error.message || "Phân tích độ phức tạp dự án thất bại");
    }
  },
};
