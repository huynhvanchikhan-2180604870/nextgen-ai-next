"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { API_CONFIG } from "../../config/api.js";

export default function IdeasPage() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/ai-project-ideas`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIdeas(data.data.ideas || []);
      } else {
        setError("Không thể tải danh sách ý tưởng");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (ideaId, format = "json") => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/ai-project-ideas/${ideaId}/export`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ format }),
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `idea_${ideaId}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Không thể xuất file");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Có lỗi xảy ra khi xuất file");
    }
  };

  const handleDelete = async (ideaId) => {
    if (!confirm("Bạn có chắc muốn xóa ý tưởng này?")) return;

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/ai-project-ideas/${ideaId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        setIdeas(ideas.filter((idea) => idea._id !== ideaId));
      } else {
        alert("Không thể xóa ý tưởng");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Có lỗi xảy ra khi xóa");
    }
  };

  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || idea.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen tech-universe-bg pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen tech-universe-bg pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchIdeas}
            className="mt-4 px-4 py-2 bg-neon-blue text-white rounded-lg hover:bg-neon-purple transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen tech-universe-bg pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-bold font-display neon-text mb-4">
            💡 Ý Tưởng Dự Án
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Quản lý và xuất các ý tưởng dự án đã được AI tạo ra
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm ý tưởng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="draft">Bản nháp</option>
                <option value="reviewed">Đã xem xét</option>
                <option value="approved">Đã phê duyệt</option>
                <option value="in_progress">Đang thực hiện</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Ideas Grid */}
        {filteredIdeas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-4xl mb-4">💭</div>
            <h3 className="text-xl text-gray-400 mb-2">Chưa có ý tưởng nào</h3>
            <p className="text-gray-500">
              Hãy tạo ý tưởng mới trong AI Planner!
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea, index) => (
              <motion.div
                key={idea._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl p-6 hover:shadow-neon transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {idea.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3">
                      {idea.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        idea.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : idea.status === "in_progress"
                          ? "bg-blue-500/20 text-blue-400"
                          : idea.status === "approved"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {idea.status === "completed"
                        ? "Hoàn thành"
                        : idea.status === "in_progress"
                        ? "Đang thực hiện"
                        : idea.status === "approved"
                        ? "Đã phê duyệt"
                        : idea.status === "reviewed"
                        ? "Đã xem xét"
                        : idea.status === "cancelled"
                        ? "Đã hủy"
                        : "Bản nháp"}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-neon-blue">
                      {idea.budget?.estimated || 0}
                    </div>
                    <div className="text-xs text-gray-400">
                      {idea.budget?.currency || "USD"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-neon-purple">
                      {idea.timeline?.estimated || 0}
                    </div>
                    <div className="text-xs text-gray-400">tuần</div>
                  </div>
                </div>

                {/* Tags */}
                {idea.tags && idea.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {idea.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {idea.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded">
                          +{idea.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleExport(idea._id, "json")}
                    className="flex-1 px-3 py-2 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 transition-colors text-sm"
                  >
                    📄 JSON
                  </button>
                  <button
                    onClick={() => handleExport(idea._id, "markdown")}
                    className="flex-1 px-3 py-2 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 transition-colors text-sm"
                  >
                    📝 MD
                  </button>
                  <button
                    onClick={() => handleDelete(idea._id)}
                    className="px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm"
                  >
                    🗑️
                  </button>
                </div>

                {/* Created Date */}
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <p className="text-xs text-gray-500">
                    Tạo lúc:{" "}
                    {new Date(idea.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
