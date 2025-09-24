"use client";

import HologramAI from "@/components/3d/HologramAI";
import SaveIdeaModal from "@/components/ai/SaveIdeaModal";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import { API_CONFIG } from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import websocketService from "@/services/websocketService";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function AIPlanner() {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history when component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      if (isAuthenticated) {
        // Try to get existing sessionId from localStorage
        const savedSessionId = localStorage.getItem("aiChatSessionId");

        if (savedSessionId) {
          setSessionId(savedSessionId);
          try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(
              `${API_CONFIG.BASE_URL}/api/v1/ai-chat/sessions/${savedSessionId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              if (data.success && data.data.messages) {
                const formattedMessages = data.data.messages.map(
                  (msg, index) => ({
                    id: Date.now() + index,
                    type: msg.role,
                    content: msg.content,
                    timestamp: msg.timestamp,
                  })
                );
                setMessages(formattedMessages);
                console.log(
                  "📚 Loaded chat history:",
                  formattedMessages.length,
                  "messages"
                );
              }
            } else {
              // Session not found, clear localStorage and create new session
              localStorage.removeItem("aiChatSessionId");
              setSessionId(null);
            }
          } catch (error) {
            console.error("❌ Failed to load chat history:", error);
            localStorage.removeItem("aiChatSessionId");
            setSessionId(null);
          }
        }
      }
    };

    loadChatHistory();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem("accessToken");
      websocketService.connect(token);

      websocketService.on("ai_message", (data) => {
        console.log("🤖 Frontend received AI message:", data);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "ai",
            content: data.message,
            timestamp: data.timestamp,
          },
        ]);
        setIsTyping(false);
      });

      websocketService.on("ai_typing", (data) => {
        setIsTyping(data.isTyping);
      });

      websocketService.on("ai_plan_ready", (data) => {
        setCurrentAnalysis(data.plan);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "analysis",
            content: "Kế hoạch dự án đã sẵn sàng!",
            timestamp: new Date().toISOString(),
          },
        ]);
      });

      return () => {
        websocketService.disconnect();
      };
    } else {
      // Clear session when not authenticated
      localStorage.removeItem("aiChatSessionId");
      setSessionId(null);
      setMessages([]);
    }
  }, [isAuthenticated]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: currentMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setIsTyping(true);

    if (sessionId) {
      websocketService.sendAIMessage(sessionId, currentMessage);
    } else {
      // Create session on backend first
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/ai-chat/sessions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({
              // AI Chat session không cần body data phức tạp
              // Chỉ cần tạo session đơn giản
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const newSessionId = data.data.sessionId;
          setSessionId(newSessionId);
          // Save sessionId to localStorage for persistence
          localStorage.setItem("aiChatSessionId", newSessionId);
          websocketService.joinAISession(newSessionId);
          websocketService.sendAIMessage(newSessionId, currentMessage);
        } else {
          const errorData = await response.json();
          console.error("Failed to create AI session:", errorData);
          setIsTyping(false);
        }
      } catch (error) {
        console.error("Error creating AI session:", error);
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "Tạo kế hoạch cho ứng dụng React",
    "Phân tích độ phức tạp dự án Node.js",
    "Gợi ý kiến trúc cho ứng dụng AI",
    "Lập timeline cho dự án mobile",
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen tech-universe-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center glass-card p-12 max-w-md mx-auto"
        >
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-4">Cần đăng nhập</h2>
          <p className="text-gray-400 mb-6">
            Bạn cần đăng nhập để sử dụng AI Planner
          </p>
          <a
            href="/auth/login"
            className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-xl font-semibold hover:shadow-neon transition-all duration-300"
          >
            Đăng nhập ngay
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen tech-universe-bg pt-16">
      {/* Header */}
      <div className="relative z-10 px-4 py-4 md:py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-4 md:mb-8"
          >
            <div className="flex items-center justify-center mb-4 md:mb-6">
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold font-display neon-text">
                🤖 AI Planner Hub
              </h1>
              {messages.length > 0 && (
                <button
                  onClick={() => {
                    setMessages([]);
                    localStorage.removeItem("aiChatSessionId");
                    setSessionId(null);
                  }}
                  className="ml-4 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  title="Xóa lịch sử chat"
                >
                  🗑️
                </button>
              )}
            </div>
            <p className="text-sm md:text-xl text-gray-400 max-w-3xl mx-auto px-4">
              Phòng AI hologram - Nơi trí tuệ nhân tạo giúp bạn lập kế hoạch dự
              án
            </p>
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] md:h-[calc(100vh-200px)]">
        {/* 3D Scene - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:flex flex-1 relative">
          <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
            <HologramAI
              messages={messages}
              currentAnalysis={currentAnalysis}
              isTyping={isTyping}
            />
          </Canvas>
        </div>

        {/* Chat Interface */}
        <div className="w-full lg:w-96 glass-card border-l-0 lg:border-l border-white/10 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white font-semibold">💬 AI Chat</h3>
            <p className="text-gray-400 text-sm">Trò chuyện với AI Planner</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 py-4 md:py-8">
                <div className="text-2xl md:text-4xl mb-2 md:mb-4">🤖</div>
                <p className="text-sm md:text-base">
                  Chào mừng đến với AI Planner!
                </p>
                <p className="text-xs md:text-sm mt-1 md:mt-2">
                  Hãy mô tả dự án của bạn để bắt đầu.
                </p>
              </div>
            )}

            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl px-3 md:px-4 py-2 md:py-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-neon-blue to-neon-purple text-white"
                      : message.type === "ai"
                      ? "glass text-white"
                      : "bg-gradient-to-r from-neon-green to-neon-blue text-white"
                  }`}
                >
                  {message.type === "ai" ? (
                    <MarkdownRenderer
                      content={message.content}
                      className="text-sm md:text-base"
                    />
                  ) : (
                    <p className="text-sm md:text-base whitespace-pre-wrap">
                      {message.content}
                    </p>
                  )}
                  <p className="text-xs opacity-70 mt-2">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="glass px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-neon-blue rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-neon-blue rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length === 0 && (
            <div className="p-3 md:p-4 border-t border-white/10">
              <p className="text-gray-400 text-xs md:text-sm mb-2 md:mb-3">
                💡 Gợi ý nhanh:
              </p>
              <div className="space-y-1 md:space-y-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMessage(prompt)}
                    className="w-full text-left px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm glass rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 md:p-4 border-t border-white/10">
            <div className="flex space-x-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Mô tả dự án của bạn..."
                className="flex-1 px-3 md:px-4 py-2 md:py-3 glass rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:ring-opacity-50 text-sm md:text-base min-h-[40px] md:min-h-[44px]"
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isTyping}
                className="px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg font-semibold hover:shadow-neon transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base min-h-[40px] md:min-h-[44px] flex items-center justify-center"
              >
                <span className="hidden sm:inline">🚀</span>
                <span className="sm:hidden">📤</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Panel */}
      {currentAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-20 glass-card border-t border-white/10"
        >
          <div className="max-w-6xl mx-auto p-4 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="text-lg md:text-2xl font-bold text-white">
                📋 Kế hoạch dự án
              </h3>
              <button
                onClick={() => setCurrentAnalysis(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">
                      🎯 Mục tiêu dự án
                    </h4>
                    <p className="text-gray-300">
                      {currentAnalysis.goals || "Đang phân tích..."}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">
                      🏗️ Kiến trúc đề xuất
                    </h4>
                    <p className="text-gray-300">
                      {currentAnalysis.architecture || "Đang phân tích..."}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">
                      ⏱️ Timeline
                    </h4>
                    <p className="text-gray-300">
                      {currentAnalysis.timeline || "Đang phân tích..."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-neon-green mb-2">
                    {currentAnalysis.complexity || "Medium"}
                  </div>
                  <p className="text-gray-400 text-sm">Độ phức tạp</p>
                </div>

                <div className="space-y-3">
                  <button className="w-full px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-xl font-semibold hover:shadow-neon transition-all duration-300 text-sm md:text-base">
                    📄 Xuất PDF
                  </button>
                  <button
                    onClick={() => setShowSaveModal(true)}
                    className="w-full px-4 md:px-6 py-2 md:py-3 glass text-white rounded-xl font-semibold hover:shadow-neon transition-all duration-300 text-sm md:text-base"
                  >
                    💾 Lưu ý tưởng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Save Idea Modal */}
      <SaveIdeaModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        sessionId={sessionId}
        messages={messages}
      />
    </div>
  );
}
