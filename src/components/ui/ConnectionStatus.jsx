"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useWebSocket } from "../../hooks/useWebSocket.js";

const ConnectionStatus = () => {
  const { connectionStatus, error } = useWebSocket();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show status indicator when there's an error or when disconnected
    setIsVisible(
      connectionStatus === "error" || connectionStatus === "disconnected"
    );
  }, [connectionStatus, error]);

  if (!isVisible) return null;

  const getStatusInfo = () => {
    switch (connectionStatus) {
      case "connected":
        return {
          icon: "🟢",
          text: "Kết nối thành công",
          color: "text-green-400",
          bgColor: "bg-green-500/20",
        };
      case "disconnected":
        return {
          icon: "🟡",
          text: "Đang kết nối...",
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/20",
        };
      case "error":
        return {
          icon: "🔴",
          text: "Lỗi kết nối",
          color: "text-red-400",
          bgColor: "bg-red-500/20",
        };
      default:
        return {
          icon: "⚪",
          text: "Không xác định",
          color: "text-gray-400",
          bgColor: "bg-gray-500/20",
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-4 right-4 z-50 px-4 py-2 rounded-lg ${statusInfo.bgColor} ${statusInfo.color} backdrop-blur-sm border border-white/10`}
    >
      <div className="flex items-center space-x-2">
        <span className="text-lg">{statusInfo.icon}</span>
        <span className="text-sm font-medium">{statusInfo.text}</span>
      </div>
    </motion.div>
  );
};

export default ConnectionStatus;
