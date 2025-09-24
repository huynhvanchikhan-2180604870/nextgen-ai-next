"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { API_CONFIG } from "../../config/api.js";

const SaveIdeaModal = ({ isOpen, onClose, sessionId, messages }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    features: [],
    techStack: [],
    budget: {
      estimated: 0,
      currency: "USD",
      breakdown: [],
    },
    timeline: {
      estimated: 0,
      phases: [],
    },
    complexity: {
      level: "intermediate",
      score: 5,
      factors: [],
    },
    marketAnalysis: {
      targetAudience: "",
      competitors: [],
      opportunities: [],
      challenges: [],
    },
    resources: {
      teamSize: 1,
      roles: [],
      tools: [],
      externalServices: [],
    },
    tags: [],
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert("Vui lòng nhập tiêu đề dự án");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/ai-project-ideas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          sessionId,
          ...formData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Ý tưởng đã được lưu thành công!");
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Lỗi: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error saving idea:", error);
      alert("Có lỗi xảy ra khi lưu ý tưởng");
    } finally {
      setIsLoading(false);
    }
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { name: "", description: "", priority: "medium", estimatedHours: 0 }],
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const updateFeature = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      ),
    }));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Lưu Ý Tưởng Dự Án</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Thông Tin Cơ Bản</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tiêu đề dự án *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tiêu đề dự án..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mô tả dự án *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mô tả chi tiết về dự án..."
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Tính Năng</h3>
              <button
                onClick={addFeature}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thêm tính năng
              </button>
            </div>

            {formData.features.map((feature, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-medium">Tính năng {index + 1}</h4>
                  <button
                    onClick={() => removeFeature(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Xóa
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Tên tính năng</label>
                    <input
                      type="text"
                      value={feature.name}
                      onChange={(e) => updateFeature(index, "name", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Tên tính năng..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Độ ưu tiên</label>
                    <select
                      value={feature.priority}
                      onChange={(e) => updateFeature(index, "priority", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="high">Cao</option>
                      <option value="medium">Trung bình</option>
                      <option value="low">Thấp</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Mô tả</label>
                    <textarea
                      value={feature.description}
                      onChange={(e) => updateFeature(index, "description", e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Mô tả tính năng..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Giờ ước tính</label>
                    <input
                      type="number"
                      value={feature.estimatedHours}
                      onChange={(e) => updateFeature(index, "estimatedHours", parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Budget */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Ngân Sách</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Tổng ngân sách ước tính</label>
                <input
                  type="number"
                  value={formData.budget.estimated}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    budget: { ...prev.budget, estimated: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-1">Đơn vị tiền tệ</label>
                <select
                  value={formData.budget.currency}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    budget: { ...prev.budget, currency: e.target.value }
                  }))}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="VND">VND</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Thời Gian</h3>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">Thời gian ước tính (tuần)</label>
              <input
                type="number"
                value={formData.timeline.estimated}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  timeline: { ...prev.timeline, estimated: parseInt(e.target.value) || 0 }
                }))}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          {/* Complexity */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Độ Phức Tạp</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Mức độ</label>
                <select
                  value={formData.complexity.level}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    complexity: { ...prev.complexity, level: e.target.value }
                  }))}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="beginner">Người mới</option>
                  <option value="intermediate">Trung bình</option>
                  <option value="advanced">Nâng cao</option>
                  <option value="expert">Chuyên gia</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-1">Điểm số (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.complexity.score}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    complexity: { ...prev.complexity, score: parseInt(e.target.value) || 5 }
                  }))}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Tags</h3>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">Thẻ (cách nhau bằng dấu phẩy)</label>
              <input
                type="text"
                value={formData.tags.join(", ")}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  tags: e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag)
                }))}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="web, mobile, ai, blockchain..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Đang lưu..." : "Lưu ý tưởng"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SaveIdeaModal;
