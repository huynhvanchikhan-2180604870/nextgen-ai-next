import { useCallback, useEffect, useState } from "react";
import websocketService from "../services/websocketService.js";

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleConnection = (data) => {
      setIsConnected(data.status === "connected");
      setConnectionStatus(data.status);
      if (data.status === "connected") {
        setError(null);
      }
    };

    const handleError = (error) => {
      setError(error);
      setConnectionStatus("error");
      setIsConnected(false);
    };

    websocketService.on("connection", handleConnection);
    websocketService.on("error", handleError);

    // Check initial status
    const status = websocketService.getConnectionStatus();
    setIsConnected(status.connected);
    setConnectionStatus(status.connected ? "connected" : "disconnected");

    return () => {
      websocketService.off("connection", handleConnection);
      websocketService.off("error", handleError);
    };
  }, []);

  const connect = useCallback((token = null) => {
    try {
      websocketService.connect(token);
    } catch (error) {
      setError(error);
    }
  }, []);

  const disconnect = useCallback(() => {
    try {
      websocketService.disconnect();
    } catch (error) {
      setError(error);
    }
  }, []);

  const joinAISession = useCallback((sessionId) => {
    return websocketService.joinAISession(sessionId);
  }, []);

  const leaveAISession = useCallback((sessionId) => {
    return websocketService.leaveAISession(sessionId);
  }, []);

  const sendAIMessage = useCallback((sessionId, message) => {
    return websocketService.sendAIMessage(sessionId, message);
  }, []);

  const requestAIPlan = useCallback((sessionId, projectDetails) => {
    return websocketService.requestAIPlan(sessionId, projectDetails);
  }, []);

  const subscribeToNotifications = useCallback(() => {
    return websocketService.subscribeToNotifications();
  }, []);

  const unsubscribeFromNotifications = useCallback(() => {
    return websocketService.unsubscribeFromNotifications();
  }, []);

  return {
    isConnected,
    connectionStatus,
    error,
    connect,
    disconnect,
    joinAISession,
    leaveAISession,
    sendAIMessage,
    requestAIPlan,
    subscribeToNotifications,
    unsubscribeFromNotifications,
  };
};
