// Fallback service for when WebSocket is not available
class FallbackService {
  constructor() {
    this.isConnected = false;
    this.listeners = new Map();
  }

  // Mock connection
  connect(token = null) {
    console.log("🔌 Using fallback service (no WebSocket)");
    this.isConnected = true;
    this.emit("connection", { status: "connected", fallback: true });
  }

  // Mock disconnect
  disconnect() {
    this.isConnected = false;
    this.listeners.clear();
    console.log("🔌 Fallback service disconnected");
  }

  // Mock AI session join
  joinAISession(sessionId) {
    console.log(`🔗 Mock joined AI session: ${sessionId}`);
    return true;
  }

  // Mock AI session leave
  leaveAISession(sessionId) {
    console.log(`🔌 Mock left AI session: ${sessionId}`);
    return true;
  }

  // Mock AI message
  sendAIMessage(sessionId, message) {
    console.log(`💬 Mock sent AI message: ${message}`);
    return true;
  }

  // Mock AI plan request
  requestAIPlan(sessionId, projectDetails) {
    console.log(`📋 Mock requested AI plan for session: ${sessionId}`);
    return true;
  }

  // Mock notification subscription
  subscribeToNotifications() {
    console.log("🔔 Mock subscribed to notifications");
    return true;
  }

  // Mock notification unsubscription
  unsubscribeFromNotifications() {
    console.log("🔕 Mock unsubscribed from notifications");
    return true;
  }

  // Event listeners (same as WebSocket service)
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;

    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  emit(event, data) {
    if (!this.listeners.has(event)) return;

    this.listeners.get(event).forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in fallback event listener for ${event}:`, error);
      }
    });
  }

  getConnectionStatus() {
    return {
      connected: this.isConnected,
      socketId: "fallback",
      reconnectAttempts: 0,
      fallback: true,
    };
  }

  reconnectWithToken(token) {
    this.disconnect();
    setTimeout(() => {
      this.connect(token);
    }, 1000);
  }
}

export default new FallbackService();
