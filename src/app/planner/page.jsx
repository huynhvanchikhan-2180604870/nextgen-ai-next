"use client";

import MessageActions from "@/components/ai/MessageActions";
import SaveIdeaModal from "@/components/ai/SaveIdeaModal";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import { API_CONFIG } from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import websocketService from "@/services/websocketService";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function AIPlanner() {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
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
        const savedSessionId = localStorage.getItem("aiChatSessionId");

        if (savedSessionId) {
          setSessionId(savedSessionId);
          try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(
              `${API_CONFIG.BASE_URL}/ai-chat/sessions/${savedSessionId}`,
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

      return () => {
        websocketService.disconnect();
      };
    } else {
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
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/ai-chat/sessions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({}),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const newSessionId = data.data.sessionId;
          setSessionId(newSessionId);
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

  const handleSelectIdea = (message) => {
    setSelectedMessage(message);
    setShowSaveModal(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white dark:bg-gray-800 p-12 max-w-md mx-auto rounded-lg shadow-lg"
        >
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Cần đăng nhập
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Bạn cần đăng nhập để sử dụng AI Planner
          </p>
          <a
            href="/auth/login"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
          >
            Đăng nhập ngay
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  mt-[100px] ms-3 me-3 glass-card">
      {/* Messenger Style Layout */}
      <div className="flex h-screen">
        {/* Left Sidebar - Chat History */}
        <div className="hidden glass-card me-3 rounded-lg md:flex w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Đoạn chat
            </h2>
          </div>

          {/* Chat Tabs */}
          <div className="px-4 py-2  border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-4">
              <button className="text-sm font-medium text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-1">
                Tất cả
              </button>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {/* Current Chat */}
              <div className="flex items-center rounded-lg glass-card hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer bg-blue-50 dark:bg-blue-900/20">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  AI
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    AI Planner
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {messages.length > 0
                      ? messages[messages.length - 1]?.content?.substring(
                          0,
                          50
                        ) + "..."
                      : "Bắt đầu cuộc trò chuyện"}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {messages.length > 0
                    ? new Date(
                        messages[messages.length - 1]?.timestamp
                      ).toLocaleTimeString()
                    : ""}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Main Chat */}
        <div className="flex-1 flex flex-col glass-card">
          {/* Mobile Header */}
          <div className="md:hidden glass-card p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 glass-card">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  AI
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    AI Planner
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Hoạt động bây giờ
                  </p>
                </div>
              </div>
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                ⚙️
              </button>
            </div>
          </div>

          {/* Chat Header */}
          <div className="hidden glass-card mb-2 md:block p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  AI
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    AI Planner
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Hoạt động bây giờ
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div
            className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          >
            {messages.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <div className="text-4xl mb-4">🤖</div>
                <p className="text-lg font-medium mb-2">
                  Chào mừng đến với AI Planner!
                </p>
                <p className="text-sm">Hãy mô tả dự án của bạn để bắt đầu.</p>
              </div>
            )}

            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                } mb-4`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[70%] ${
                    message.type === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                      message.type === "user" ? "bg-blue-500" : "bg-gray-500"
                    }`}
                  >
                    {message.type === "user" ? "👤" : "🤖"}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.type === "user"
                        ? "bg-blue-500 text-white rounded-br-md"
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md border border-gray-200 dark:border-gray-700 shadow-sm"
                    }`}
                  >
                    {message.type === "ai" ? (
                      <div className="max-w-none">
                        <MarkdownRenderer
                          content={message.content}
                          className="text-sm leading-relaxed"
                        />
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    )}
                    <p
                      className={`text-xs opacity-70 mt-2 ${
                        message.type === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {/* Message Actions for AI messages */}
                <MessageActions
                  message={message}
                  onSelectIdea={handleSelectIdea}
                  isSelected={selectedMessage?.id === message.id}
                />
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start mb-4"
              >
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-sm flex-shrink-0">
                    🤖
                  </div>
                  <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl rounded-bl-md border border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 glass-card border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Aa"
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Save Idea Button */}
              {messages.length > 0 && (
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors"
                  title="Lưu ý tưởng"
                >
                  💾
                </button>
              )}

              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isTyping}
                className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTyping ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>📤</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Idea Modal */}
      <SaveIdeaModal
        isOpen={showSaveModal}
        onClose={() => {
          setShowSaveModal(false);
          setSelectedMessage(null);
        }}
        sessionId={sessionId}
        messages={messages}
        selectedMessage={selectedMessage}
      />
    </div>
  );
}
