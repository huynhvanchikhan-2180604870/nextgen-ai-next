"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useWebSocket } from "../../hooks/useWebSocket.js";
import {
  isWebSocketSupported,
  testWebSocketConnection,
} from "../../utils/websocketTest.js";

const WebSocketDebugger = () => {
  const { connectionStatus, error, socketId } = useWebSocket();
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const runConnectionTest = async () => {
    setIsTesting(true);
    try {
      const result = await testWebSocketConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message,
        fallback: true,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "connected":
        return "text-green-400";
      case "disconnected":
        return "text-red-400";
      case "connecting":
        return "text-yellow-400";
      case "error":
        return "text-orange-400";
      case "failed":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "connected":
        return "🟢";
      case "disconnected":
        return "🔴";
      case "connecting":
        return "🟡";
      case "error":
        return "⚠️";
      case "failed":
        return "❌";
      default:
        return "⚪";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-4 z-50 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4 max-w-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">WebSocket Debug</h3>
        <button
          onClick={runConnectionTest}
          disabled={isTesting}
          className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded transition-colors"
        >
          {isTesting ? "Testing..." : "Test"}
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center space-x-2">
          <span>{getStatusIcon(connectionStatus)}</span>
          <span className={`font-medium ${getStatusColor(connectionStatus)}`}>
            Status: {connectionStatus}
          </span>
        </div>

        {socketId && <div className="text-gray-400">Socket ID: {socketId}</div>}

        {error && <div className="text-red-400">Error: {error}</div>}

        {testResult && (
          <div className="mt-2 p-2 bg-gray-800 rounded">
            <div className="font-medium text-white mb-1">Test Result:</div>
            <div
              className={`text-xs ${
                testResult.success ? "text-green-400" : "text-red-400"
              }`}
            >
              {testResult.success ? "✅ Success" : "❌ Failed"}
            </div>
            {testResult.error && (
              <div className="text-red-400 text-xs mt-1">
                {testResult.error}
              </div>
            )}
            {testResult.fallback && (
              <div className="text-yellow-400 text-xs mt-1">
                Using fallback service
              </div>
            )}
          </div>
        )}

        <div className="text-gray-400">
          WebSocket Support: {isWebSocketSupported() ? "✅" : "❌"}
        </div>
      </div>
    </motion.div>
  );
};

export default WebSocketDebugger;
