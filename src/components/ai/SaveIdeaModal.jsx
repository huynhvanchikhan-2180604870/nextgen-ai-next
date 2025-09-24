"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCreateIdea } from "../../hooks/useIdeas.js";

const SaveIdeaModal = ({
  isOpen,
  onClose,
  sessionId,
  messages,
  selectedMessage = null,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    tags: [],
    priority: "medium",
    status: "draft",
  });
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState({});

  const createIdeaMutation = useCreateIdea();

  // Auto-fill form data from AI messages
  useEffect(() => {
    if (isOpen && messages && messages.length > 0) {
      // Use selected message if provided, otherwise use latest AI message
      const targetMessage =
        selectedMessage ||
        messages.filter((msg) => msg.type === "ai").slice(-1)[0];
      const userMessages = messages.filter((msg) => msg.type === "user");

      if (targetMessage) {
        // Extract title from user message that prompted this AI response
        const userMessageIndex =
          messages.findIndex((msg) => msg.id === targetMessage.id) - 1;
        const relatedUserMessage =
          userMessageIndex >= 0 ? messages[userMessageIndex] : userMessages[0];

        let title = "";
        if (relatedUserMessage?.content) {
          // Extract from user input like "Tôi muốn tạo một ứng dụng web bán hàng"
          const titleMatch = relatedUserMessage.content.match(
            /(?:tạo|phát triển|build|develop)\s+(?:một|an?)\s+([^,.\n]+)/i
          );
          if (titleMatch) {
            title = titleMatch[1].trim();
          } else {
            // Fallback: use first 50 characters
            title = relatedUserMessage.content
              .substring(0, 50)
              .replace(/[.!?]$/, "");
          }
        }

        // Extract description from selected AI response
        let description = "";
        if (targetMessage.content) {
          // Take first paragraph or first 300 characters
          const firstParagraph =
            targetMessage.content.split("\n\n")[0] ||
            targetMessage.content.split("\n")[0];
          description = firstParagraph.substring(0, 300);
        }

        // Extract tags from selected AI content
        const allContent = targetMessage.content || "";
        const tags = [];

        // Common tech keywords
        const techKeywords = [
          "react",
          "vue",
          "angular",
          "nextjs",
          "nodejs",
          "express",
          "mongodb",
          "mysql",
          "postgresql",
          "typescript",
          "javascript",
          "python",
          "java",
          "php",
          "laravel",
          "django",
          "flask",
          "mobile",
          "ios",
          "android",
          "flutter",
          "react native",
          "swift",
          "kotlin",
          "ai",
          "machine learning",
          "deep learning",
          "tensorflow",
          "pytorch",
          "opencv",
          "blockchain",
          "smart contract",
          "solidity",
          "web3",
          "defi",
          "nft",
          "ecommerce",
          "shopify",
          "woocommerce",
          "payment",
          "stripe",
          "paypal",
          "api",
          "rest",
          "graphql",
          "microservices",
          "docker",
          "kubernetes",
          "aws",
          "azure",
          "gcp",
          "firebase",
          "vercel",
          "netlify",
        ];

        techKeywords.forEach((keyword) => {
          if (allContent.toLowerCase().includes(keyword.toLowerCase())) {
            tags.push(keyword);
          }
        });

        // Extract category from content
        let category = "general";
        if (
          allContent.toLowerCase().includes("web") ||
          allContent.toLowerCase().includes("website")
        ) {
          category = "web-development";
        } else if (
          allContent.toLowerCase().includes("mobile") ||
          allContent.toLowerCase().includes("app")
        ) {
          category = "mobile-development";
        } else if (
          allContent.toLowerCase().includes("ai") ||
          allContent.toLowerCase().includes("machine learning")
        ) {
          category = "ai-ml";
        } else if (
          allContent.toLowerCase().includes("blockchain") ||
          allContent.toLowerCase().includes("crypto")
        ) {
          category = "blockchain";
        } else if (
          allContent.toLowerCase().includes("data") ||
          allContent.toLowerCase().includes("analytics")
        ) {
          category = "data-science";
        } else if (
          allContent.toLowerCase().includes("game") ||
          allContent.toLowerCase().includes("gaming")
        ) {
          category = "gaming";
        } else if (
          allContent.toLowerCase().includes("ecommerce") ||
          allContent.toLowerCase().includes("shop")
        ) {
          category = "ecommerce";
        }

        // Set priority based on keywords
        let priority = "medium";
        if (
          allContent.toLowerCase().includes("urgent") ||
          allContent.toLowerCase().includes("asap")
        ) {
          priority = "urgent";
        } else if (
          allContent.toLowerCase().includes("important") ||
          allContent.toLowerCase().includes("priority")
        ) {
          priority = "high";
        } else if (
          allContent.toLowerCase().includes("low") ||
          allContent.toLowerCase().includes("later")
        ) {
          priority = "low";
        }

        setFormData({
          title: title || "Ý tưởng từ AI Planner",
          description: description || "Ý tưởng được tạo bởi AI Planner",
          category,
          tags: [...new Set(tags)].slice(0, 10), // Remove duplicates and limit to 10
          priority,
          status: "draft",
        });
      }
    }
  }, [isOpen, messages, selectedMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const ideaData = {
        ...formData,
        sessionId,
        aiMessages: messages,
        source: "ai-planner",
        metadata: {
          messageCount: messages.length,
          lastMessage: messages[messages.length - 1]?.content || "",
          createdAt: new Date().toISOString(),
        },
      };

      const result = await createIdeaMutation.mutateAsync(ideaData);

      if (result.success) {
        onClose();
        setFormData({
          title: "",
          description: "",
          category: "general",
          tags: [],
          priority: "medium",
          status: "draft",
        });
      }
    } catch (error) {
      console.error("Error saving idea:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="glass-card p-6 rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                💡 Lưu ý tưởng AI
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                ✨ Thông tin đã được tự động điền từ cuộc trò chuyện
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
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

          {/* Form */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Tiêu đề ý tưởng *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-black/40 text-white border transition-all focus:outline-none focus:ring-2 focus:ring-neon-blue ${
                  errors.title ? "border-red-500" : "border-white/20"
                }`}
                placeholder="Nhập tiêu đề cho ý tưởng..."
                disabled={createIdeaMutation.isPending}
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Mô tả ý tưởng *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg bg-black/40 text-white border transition-all focus:outline-none focus:ring-2 focus:ring-neon-blue resize-none ${
                  errors.description ? "border-red-500" : "border-white/20"
                }`}
                placeholder="Mô tả chi tiết về ý tưởng..."
                disabled={createIdeaMutation.isPending}
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Danh mục
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-black/40 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  disabled={createIdeaMutation.isPending}
                >
                  <option value="general">Tổng quát</option>
                  <option value="web-development">Phát triển Web</option>
                  <option value="mobile-development">Phát triển Mobile</option>
                  <option value="ai-ml">AI & Machine Learning</option>
                  <option value="data-science">Data Science</option>
                  <option value="blockchain">Blockchain</option>
                  <option value="iot">IoT</option>
                  <option value="gaming">Gaming</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Độ ưu tiên
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-black/40 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  disabled={createIdeaMutation.isPending}
                >
                  <option value="low">Thấp</option>
                  <option value="medium">Trung bình</option>
                  <option value="high">Cao</option>
                  <option value="urgent">Khẩn cấp</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-neon-blue/20 text-neon-blue rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-neon-blue hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  className="flex-1 px-4 py-3 rounded-lg bg-black/40 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  placeholder="Thêm tag..."
                  disabled={createIdeaMutation.isPending}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-3 bg-neon-blue text-white rounded-lg hover:bg-neon-blue/80 transition-colors"
                  disabled={createIdeaMutation.isPending}
                >
                  Thêm
                </button>
              </div>
            </div>

            {/* AI Messages Preview */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm text-gray-300">
                  {selectedMessage
                    ? "Nội dung AI đã chọn"
                    : `Nội dung AI đã tạo (${messages.length} tin nhắn)`}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    // Reset to auto-filled data
                    const targetMessage =
                      selectedMessage ||
                      messages.filter((msg) => msg.type === "ai").slice(-1)[0];
                    const userMessages = messages.filter(
                      (msg) => msg.type === "user"
                    );

                    if (targetMessage) {
                      const userMessageIndex =
                        messages.findIndex(
                          (msg) => msg.id === targetMessage.id
                        ) - 1;
                      const relatedUserMessage =
                        userMessageIndex >= 0
                          ? messages[userMessageIndex]
                          : userMessages[0];

                      let title = "";
                      if (relatedUserMessage?.content) {
                        const titleMatch = relatedUserMessage.content.match(
                          /(?:tạo|phát triển|build|develop)\s+(?:một|an?)\s+([^,.\n]+)/i
                        );
                        if (titleMatch) {
                          title = titleMatch[1].trim();
                        } else {
                          title = relatedUserMessage.content
                            .substring(0, 50)
                            .replace(/[.!?]$/, "");
                        }
                      }

                      let description = "";
                      if (targetMessage.content) {
                        const firstParagraph =
                          targetMessage.content.split("\n\n")[0] ||
                          targetMessage.content.split("\n")[0];
                        description = firstParagraph.substring(0, 300);
                      }

                      setFormData({
                        title: title || "Ý tưởng từ AI Planner",
                        description:
                          description || "Ý tưởng được tạo bởi AI Planner",
                        category: "general",
                        tags: [],
                        priority: "medium",
                        status: "draft",
                      });
                    }
                  }}
                  className="text-xs text-neon-blue hover:text-neon-purple transition-colors"
                >
                  🔄 Tự động điền lại
                </button>
              </div>
              <div className="max-h-32 overflow-y-auto bg-black/20 rounded-lg p-3 border border-white/10">
                {selectedMessage ? (
                  <div className="text-sm text-gray-300">
                    <span className="text-neon-blue">🤖 AI:</span>{" "}
                    {selectedMessage.content.substring(0, 200)}
                    {selectedMessage.content.length > 200 && "..."}
                  </div>
                ) : (
                  messages.slice(-3).map((message, index) => (
                    <div key={index} className="text-sm text-gray-300 mb-1">
                      <span className="text-neon-blue">
                        {message.type === "user" ? "👤 Bạn" : "🤖 AI"}:
                      </span>{" "}
                      {message.content.substring(0, 100)}
                      {message.content.length > 100 && "..."}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 glass text-white rounded-lg font-semibold hover:bg-white/10 transition-all"
              disabled={createIdeaMutation.isPending}
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={createIdeaMutation.isPending}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {createIdeaMutation.isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang lưu...</span>
                </div>
              ) : (
                "💾 Lưu ý tưởng"
              )}
            </button>
          </div>

          {/* Error Display */}
          {createIdeaMutation.error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg"
            >
              <p className="text-red-400 text-sm text-center">
                {createIdeaMutation.error.message}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SaveIdeaModal;
