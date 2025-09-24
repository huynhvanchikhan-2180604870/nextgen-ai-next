import { io } from "socket.io-client";
import { API_CONFIG } from "../config/api.js";
import fallbackService from "./fallbackService.js";

// WebSocket Service for AI Planner real-time chat
class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.useFallback = false;
  }

  // Connect to WebSocket server
  async connect(token = null) {
    if (this.socket && this.isConnected) {
      console.log("WebSocket already connected");
      return;
    }

    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      console.log("WebSocket not available in SSR");
      return;
    }

    try {
      console.log("🔌 Connecting to WebSocket server...");

      const options = {
        ...API_CONFIG.WS_CONFIG,
      };

      // Add auth token if provided
      if (token) {
        options.auth = {
          token: token,
        };
      }

      this.socket = io(API_CONFIG.WS_URL, options);

      this.setupEventListeners();

      console.log("🔌 Connecting to WebSocket server...");

      // Manually connect
      this.socket.connect();
    } catch (error) {
      console.error("WebSocket connection error:", error);
      this.handleConnectionError(error);
    }
  }

  // Setup event listeners
  setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on("connect", () => {
      console.log("✅ WebSocket connected");
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit("connection", { status: "connected" });
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ WebSocket disconnected:", reason);
      this.isConnected = false;
      this.emit("connection", { status: "disconnected", reason });

      // Attempt to reconnect if not manually disconnected
      if (reason !== "io client disconnect") {
        this.attemptReconnect();
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      // Don't spam console with errors on Render
      if (error.message && !error.message.includes("websocket")) {
        console.error("WebSocket connection error:", error);
      }
      this.handleConnectionError(error);
    });

    // General error handler
    this.socket.on("error", (error) => {
      console.error("WebSocket error:", error);
      this.emit("error", error);
    });

    // AI Planner events
    this.socket.on("ai_session_joined", (data) => {
      console.log("🔗 AI Session joined:", data);
      this.emit("ai_session_joined", data);
    });

    this.socket.on("ai_message", (data) => {
      console.log("🤖 AI Message received:", data);
      console.log("🤖 Emitting ai_message event to listeners");
      this.emit("ai_message", data);
    });

    this.socket.on("ai_typing", (data) => {
      console.log("🤖 AI Typing:", data);
      this.emit("ai_typing", data);
    });

    this.socket.on("ai_typing_stop", (data) => {
      console.log("🤖 AI Typing stopped:", data);
      this.emit("ai_typing_stop", data);
    });

    this.socket.on("ai_plan_ready", (data) => {
      console.log("📋 AI Plan ready:", data);
      this.emit("ai_plan_ready", data);
    });

    this.socket.on("ai_session_error", (data) => {
      console.error("❌ AI Session error:", data);
      this.emit("ai_session_error", data);
    });

    this.socket.on("session_updated", (data) => {
      console.log("🔄 Session updated:", data);
      this.emit("session_updated", data);
    });

    // Notification events
    this.socket.on("notification", (data) => {
      console.log("🔔 Notification received:", data);
      this.emit("notification", data);
    });

    // Error events
    this.socket.on("error", (error) => {
      console.error("WebSocket error:", error);
      this.emit("error", error);
    });
  }

  // Attempt to reconnect
  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      this.emit("connection", { status: "failed" });
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(
      `🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`
    );

    setTimeout(() => {
      if (!this.isConnected) {
        this.connect();
      }
    }, delay);
  }

  // Handle connection error
  handleConnectionError(error) {
    this.isConnected = false;

    // If we've tried too many times, switch to fallback
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("🔄 Switching to fallback service due to WebSocket errors");
      this.useFallback = true;
      this.switchToFallback();
      return;
    }

    this.emit("connection", { status: "error", error });
  }

  // Switch to fallback service
  switchToFallback() {
    // Copy listeners to fallback service
    for (const [event, callbacks] of this.listeners) {
      callbacks.forEach((callback) => {
        fallbackService.on(event, callback);
      });
    }

    // Use fallback service methods
    this.connect = fallbackService.connect.bind(fallbackService);
    this.disconnect = fallbackService.disconnect.bind(fallbackService);
    this.joinAISession = fallbackService.joinAISession.bind(fallbackService);
    this.leaveAISession = fallbackService.leaveAISession.bind(fallbackService);
    this.sendAIMessage = fallbackService.sendAIMessage.bind(fallbackService);
    this.requestAIPlan = fallbackService.requestAIPlan.bind(fallbackService);
    this.subscribeToNotifications =
      fallbackService.subscribeToNotifications.bind(fallbackService);
    this.unsubscribeFromNotifications =
      fallbackService.unsubscribeFromNotifications.bind(fallbackService);
    this.getConnectionStatus =
      fallbackService.getConnectionStatus.bind(fallbackService);
    this.reconnectWithToken =
      fallbackService.reconnectWithToken.bind(fallbackService);

    // Connect using fallback
    this.connect();
  }

  // Join AI session
  joinAISession(sessionId) {
    if (this.useFallback && this.fallbackService) {
      return this.fallbackService.joinAISession(sessionId);
    }

    if (!this.socket || !this.isConnected) {
      console.error("WebSocket not connected");
      return false;
    }

    this.socket.emit("join_ai_session", { sessionId });
    console.log(`🔗 Joined AI session: ${sessionId}`);
    return true;
  }

  // Leave AI session
  leaveAISession(sessionId) {
    if (this.useFallback && this.fallbackService) {
      return this.fallbackService.leaveAISession(sessionId);
    }

    if (!this.socket || !this.isConnected) {
      return false;
    }

    this.socket.emit("leave_ai_session", { sessionId });
    console.log(`🔌 Left AI session: ${sessionId}`);
    return true;
  }

  // Send chat message to AI
  sendAIMessage(sessionId, message) {
    if (this.useFallback && this.fallbackService) {
      return this.fallbackService.sendAIMessage(sessionId, message);
    }

    if (!this.socket || !this.isConnected) {
      console.error("WebSocket not connected");
      return false;
    }

    this.socket.emit("ai_chat_message", {
      sessionId,
      message,
      timestamp: new Date().toISOString(),
    });

    console.log(`💬 Sent AI message: ${message}`);
    return true;
  }

  // Request AI plan generation
  requestAIPlan(sessionId, projectDetails) {
    if (this.useFallback && this.fallbackService) {
      return this.fallbackService.requestAIPlan(sessionId, projectDetails);
    }

    if (!this.socket || !this.isConnected) {
      console.error("WebSocket not connected");
      return false;
    }

    this.socket.emit("request_ai_plan", {
      sessionId,
      projectDetails,
      timestamp: new Date().toISOString(),
    });

    console.log(`📋 Requested AI plan for session: ${sessionId}`);
    return true;
  }

  // Subscribe to notifications
  subscribeToNotifications() {
    if (this.useFallback && this.fallbackService) {
      return this.fallbackService.subscribeToNotifications();
    }

    if (!this.socket || !this.isConnected) {
      return false;
    }

    this.socket.emit("subscribe_notifications");
    console.log("🔔 Subscribed to notifications");
    return true;
  }

  // Unsubscribe from notifications
  unsubscribeFromNotifications() {
    if (this.useFallback && this.fallbackService) {
      return this.fallbackService.unsubscribeFromNotifications();
    }

    if (!this.socket || !this.isConnected) {
      return false;
    }

    this.socket.emit("unsubscribe_notifications");
    console.log("🔕 Unsubscribed from notifications");
    return true;
  }

  // Add event listener
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Remove event listener
  off(event, callback) {
    if (!this.listeners.has(event)) return;

    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  // Emit event to listeners
  emit(event, data) {
    if (!this.listeners.has(event)) return;

    this.listeners.get(event).forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  // Get connection status
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      socketId: this.socket?.id || null,
      reconnectAttempts: this.reconnectAttempts,
    };
  }

  // Disconnect from WebSocket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
      console.log("🔌 WebSocket disconnected");
    }
  }

  // Reconnect with new token
  reconnectWithToken(token) {
    this.disconnect();
    setTimeout(() => {
      this.connect(token);
    }, 1000);
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;
