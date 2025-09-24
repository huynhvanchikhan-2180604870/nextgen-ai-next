import { create } from "zustand";
import { aiPlannerService } from "../services/aiPlannerService.js";

// AI Planner Store
export const useAIPlannerStore = create((set, get) => ({
  // State
  sessions: [],
  currentSession: null,
  chatHistory: [],
  aiPlan: null,
  recommendations: [],
  isLoading: false,
  isGenerating: false,
  isTyping: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  // Actions
  // Create new AI session
  createSession: async (sessionData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await aiPlannerService.createSession(sessionData);
      const { session } = response;

      const sessions = get().sessions;
      set({
        sessions: [session, ...sessions],
        currentSession: session,
        isLoading: false,
        error: null,
      });

      return { success: true, session };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  },

  // Get user sessions
  getSessions: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });

    try {
      const response = await aiPlannerService.getUserSessions(page, limit);
      const { sessions, pagination } = response;

      set({
        sessions,
        pagination,
        isLoading: false,
        error: null,
      });

      return { success: true, sessions, pagination };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  },

  // Get session by ID
  getSession: async (sessionId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await aiPlannerService.getSession(sessionId);
      const { session } = response;

      set({
        currentSession: session,
        isLoading: false,
        error: null,
      });

      return { success: true, session };
    } catch (error) {
      set({
        currentSession: null,
        isLoading: false,
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  },

  // Generate AI plan
  generatePlan: async (sessionId, projectDetails) => {
    set({ isGenerating: true, error: null });

    try {
      const response = await aiPlannerService.generatePlan(
        sessionId,
        projectDetails
      );
      const { plan } = response;

      set({
        aiPlan: plan,
        isGenerating: false,
        error: null,
      });

      // Update current session
      const currentSession = get().currentSession;
      if (currentSession && currentSession._id === sessionId) {
        set({
          currentSession: {
            ...currentSession,
            plan: plan,
            status: "completed",
          },
        });
      }

      return { success: true, plan };
    } catch (error) {
      set({
        isGenerating: false,
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  },

  // Send chat message
  sendMessage: async (sessionId, message) => {
    set({ isLoading: true, error: null });

    try {
      // Add user message to chat history immediately
      const userMessage = {
        id: Date.now(),
        type: "user",
        message,
        timestamp: new Date().toISOString(),
      };

      const chatHistory = get().chatHistory;
      set({
        chatHistory: [...chatHistory, userMessage],
      });

      const response = await aiPlannerService.sendChatMessage(
        sessionId,
        message
      );
      const { aiMessage } = response;

      // Add AI response to chat history
      const aiResponse = {
        id: Date.now() + 1,
        type: "ai",
        message: aiMessage.message,
        timestamp: aiMessage.timestamp,
      };

      set({
        chatHistory: [...get().chatHistory, aiResponse],
        isLoading: false,
        error: null,
      });

      return { success: true, aiMessage };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  },

  // Get chat history
  getChatHistory: async (sessionId, page = 1, limit = 50) => {
    try {
      const response = await aiPlannerService.getChatHistory(
        sessionId,
        page,
        limit
      );
      const { messages } = response;

      set({ chatHistory: messages });
      return { success: true, messages };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Get AI recommendations
  getRecommendations: async (preferences = {}) => {
    set({ isLoading: true, error: null });

    try {
      const response = await aiPlannerService.getRecommendations(preferences);
      const { recommendations } = response;

      set({
        recommendations,
        isLoading: false,
        error: null,
      });

      return { success: true, recommendations };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  },

  // Update session
  updateSession: async (sessionId, updateData) => {
    try {
      const response = await aiPlannerService.updateSession(
        sessionId,
        updateData
      );
      const { session } = response;

      // Update in sessions list
      const sessions = get().sessions;
      const updatedSessions = sessions.map((s) =>
        s._id === sessionId ? { ...s, ...session } : s
      );

      set({ sessions: updatedSessions });

      // Update current session if it's the same
      const currentSession = get().currentSession;
      if (currentSession && currentSession._id === sessionId) {
        set({ currentSession: { ...currentSession, ...session } });
      }

      return { success: true, session };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Delete session
  deleteSession: async (sessionId) => {
    set({ isLoading: true, error: null });

    try {
      await aiPlannerService.deleteSession(sessionId);

      // Remove from sessions list
      const sessions = get().sessions;
      const updatedSessions = sessions.filter((s) => s._id !== sessionId);

      set({
        sessions: updatedSessions,
        isLoading: false,
        error: null,
      });

      // Clear current session if it's the same
      const currentSession = get().currentSession;
      if (currentSession && currentSession._id === sessionId) {
        set({ currentSession: null, chatHistory: [], aiPlan: null });
      }

      return { success: true };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  },

  // Export plan as PDF
  exportPlanAsPDF: async (sessionId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await aiPlannerService.exportPlanAsPDF(sessionId);

      // Create download link
      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ai-plan-${sessionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      set({ isLoading: false, error: null });
      return { success: true };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  },

  // Export plan as Markdown
  exportPlanAsMarkdown: async (sessionId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await aiPlannerService.exportPlanAsMarkdown(sessionId);

      // Create download link
      const blob = new Blob([response], { type: "text/markdown" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ai-plan-${sessionId}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      set({ isLoading: false, error: null });
      return { success: true };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  },

  // Save plan as project
  savePlanAsProject: async (sessionId, projectData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await aiPlannerService.savePlanAsProject(
        sessionId,
        projectData
      );

      set({ isLoading: false, error: null });
      return { success: true, project: response.project };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  },

  // Analyze project complexity
  analyzeComplexity: async (projectDetails) => {
    set({ isLoading: true, error: null });

    try {
      const response = await aiPlannerService.analyzeComplexity(projectDetails);
      const { analysis } = response;

      set({ isLoading: false, error: null });
      return { success: true, analysis };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  },

  // WebSocket event handlers
  // Handle AI message from WebSocket
  handleAIMessage: (data) => {
    const aiMessage = {
      id: Date.now(),
      type: "ai",
      message: data.message,
      timestamp: data.timestamp || new Date().toISOString(),
    };

    const chatHistory = get().chatHistory;
    set({ chatHistory: [...chatHistory, aiMessage] });
  },

  // Handle AI typing from WebSocket
  handleAITyping: (data) => {
    set({ isTyping: data.isTyping });
  },

  // Handle AI plan ready from WebSocket
  handleAIPlanReady: (data) => {
    set({
      aiPlan: data.plan,
      isGenerating: false,
    });

    // Update current session
    const currentSession = get().currentSession;
    if (currentSession && currentSession._id === data.sessionId) {
      set({
        currentSession: {
          ...currentSession,
          plan: data.plan,
          status: "completed",
        },
      });
    }
  },

  // Handle session update from WebSocket
  handleSessionUpdate: (data) => {
    const sessions = get().sessions;
    const updatedSessions = sessions.map((s) =>
      s._id === data.sessionId ? { ...s, ...data.updates } : s
    );

    set({ sessions: updatedSessions });

    // Update current session if it's the same
    const currentSession = get().currentSession;
    if (currentSession && currentSession._id === data.sessionId) {
      set({ currentSession: { ...currentSession, ...data.updates } });
    }
  },

  // Clear chat history
  clearChatHistory: () => {
    set({ chatHistory: [] });
  },

  // Clear AI plan
  clearAIPlan: () => {
    set({ aiPlan: null });
  },

  // Clear current session
  clearCurrentSession: () => {
    set({
      currentSession: null,
      chatHistory: [],
      aiPlan: null,
    });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Set loading
  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  // Set generating
  setGenerating: (generating) => {
    set({ isGenerating: generating });
  },

  // Set typing
  setTyping: (typing) => {
    set({ isTyping: typing });
  },
}));
