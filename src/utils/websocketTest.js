// WebSocket connection test utility
export const testWebSocketConnection = async () => {
  try {
    console.log("🧪 Testing WebSocket connection...");

    // Test if we can create a socket connection
    const { io } = await import("socket.io-client");
    const API_CONFIG = (await import("../config/api.js")).API_CONFIG;

    const socket = io(API_CONFIG.WS_URL, {
      transports: ["polling"],
      timeout: 5000,
      forceNew: true,
      autoConnect: false,
    });

    return new Promise((resolve) => {
      let resolved = false;

      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          socket.disconnect();
          resolve({
            success: false,
            error: "Connection timeout",
            fallback: true,
          });
        }
      }, 5000);

      socket.on("connect", () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          socket.disconnect();
          resolve({
            success: true,
            connected: true,
          });
        }
      });

      socket.on("connect_error", (error) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          socket.disconnect();
          resolve({
            success: false,
            error: error.message,
            fallback: true,
          });
        }
      });

      // Try to connect
      socket.connect();
    });
  } catch (error) {
    console.error("WebSocket test error:", error);
    return {
      success: false,
      error: error.message,
      fallback: true,
    };
  }
};

// Check if WebSocket is supported
export const isWebSocketSupported = () => {
  if (typeof window === "undefined") return false;
  return typeof WebSocket !== "undefined" || typeof io !== "undefined";
};

// Get connection recommendation
export const getConnectionRecommendation = (testResult) => {
  if (testResult.success) {
    return {
      useWebSocket: true,
      message: "WebSocket connection available",
    };
  } else {
    return {
      useWebSocket: false,
      message: "Using fallback service (no WebSocket)",
      fallback: true,
    };
  }
};
