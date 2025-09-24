"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  useDeleteIdea,
  useExportIdea,
  useIdeas,
} from "../../hooks/useIdeas.js";

export default function IdeasPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const {
    data: ideasData,
    isLoading,
    error,
  } = useIdeas({
    search: searchQuery,
    category: selectedCategory === "all" ? "" : selectedCategory,
    status: selectedStatus === "all" ? "" : selectedStatus,
  });

  const deleteIdeaMutation = useDeleteIdea();
  const exportIdeaMutation = useExportIdea();

  const ideas = ideasData?.data?.ideas || [];

  const categories = [
    { value: "all", label: "Tất cả", icon: "🌟" },
    { value: "general", label: "Tổng quát", icon: "💡" },
    { value: "web-development", label: "Web Development", icon: "🌐" },
    { value: "mobile-development", label: "Mobile", icon: "📱" },
    { value: "ai-ml", label: "AI & ML", icon: "🤖" },
    { value: "data-science", label: "Data Science", icon: "📊" },
    { value: "blockchain", label: "Blockchain", icon: "⛓️" },
    { value: "iot", label: "IoT", icon: "🔗" },
    { value: "gaming", label: "Gaming", icon: "🎮" },
    { value: "ecommerce", label: "E-commerce", icon: "🛒" },
  ];

  const statuses = [
    { value: "all", label: "Tất cả", color: "text-gray-400" },
    { value: "draft", label: "Bản nháp", color: "text-yellow-400" },
    { value: "active", label: "Đang phát triển", color: "text-blue-400" },
    { value: "completed", label: "Hoàn thành", color: "text-green-400" },
    { value: "archived", label: "Lưu trữ", color: "text-gray-400" },
  ];

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa ý tưởng này?")) {
      try {
        await deleteIdeaMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting idea:", error);
      }
    }
  };

  const handleExport = async (id, format = "json") => {
    try {
      const result = await exportIdeaMutation.mutateAsync({ id, format });
      if (result.success) {
        // Tạo link download
        const blob = new Blob([result.data], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `idea-${id}.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error exporting idea:", error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "text-red-400 bg-red-500/20";
      case "high":
        return "text-orange-400 bg-orange-500/20";
      case "medium":
        return "text-yellow-400 bg-yellow-500/20";
      case "low":
        return "text-green-400 bg-green-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "urgent":
        return "Khẩn cấp";
      case "high":
        return "Cao";
      case "medium":
        return "Trung bình";
      case "low":
        return "Thấp";
      default:
        return "Không xác định";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen tech-universe-bg pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải ý tưởng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen tech-universe-bg pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Lỗi tải dữ liệu
          </h2>
          <p className="text-gray-400 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-neon-blue text-white rounded-lg hover:opacity-90 transition-all"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen tech-universe-bg pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold font-display mb-6">
            💡 Ý tưởng AI
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Quản lý và phát triển những ý tưởng tuyệt vời từ AI Planner
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Tìm kiếm
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/40 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-neon-blue"
                placeholder="Tìm kiếm ý tưởng..."
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Danh mục
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/40 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-neon-blue"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Trạng thái
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/40 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-neon-blue"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Ideas Grid */}
        {ideas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">💡</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Chưa có ý tưởng nào
            </h3>
            <p className="text-gray-400 mb-6">
              Hãy tạo ý tưởng đầu tiên với AI Planner
            </p>
            <Link
              href="/planner"
              className="px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-xl font-semibold hover:shadow-neon transition-all duration-300 transform hover:scale-105"
            >
              🤖 Tạo ý tưởng với AI
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea, index) => (
              <motion.div
                key={idea._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="glass-card p-6 hover:shadow-neon transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {idea.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-400">
                        {
                          categories.find((cat) => cat.value === idea.category)
                            ?.icon
                        }
                      </span>
                      <span className="text-sm text-gray-400">
                        {
                          categories.find((cat) => cat.value === idea.category)
                            ?.label
                        }
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExport(idea._id, "json")}
                      className="p-2 text-gray-400 hover:text-neon-blue transition-colors"
                      title="Xuất ý tưởng"
                    >
                      📥
                    </button>
                    <button
                      onClick={() => handleDelete(idea._id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      title="Xóa ý tưởng"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {idea.description}
                </p>

                {/* Tags */}
                {idea.tags && idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {idea.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-neon-blue/20 text-neon-blue rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {idea.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
                        +{idea.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        idea.priority
                      )}`}
                    >
                      {getPriorityLabel(idea.priority)}
                    </span>
                    <span
                      className={`text-xs ${
                        statuses.find((s) => s.value === idea.status)?.color
                      }`}
                    >
                      {statuses.find((s) => s.value === idea.status)?.label}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(idea.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
