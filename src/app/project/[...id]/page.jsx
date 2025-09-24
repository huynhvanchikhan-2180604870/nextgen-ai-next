"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PriceDisplay from "@/components/ui/PriceDisplay";
import SuggestedProductsGrid from "@/components/ui/SuggestedProductsGrid";
import { useProject } from "@/hooks/useProjects";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isPurchased, setIsPurchased] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [project, setProject] = useState(null);

  // gọi API
  const { data: projectData, isLoading, error } = useProject(id);

  // chỉ set state 1 lần khi API trả về -> tránh call lại
  useEffect(() => {
    if (projectData?.project) {
      setProject(projectData.project);
    }
  }, [projectData]);

  if (isLoading) {
    return (
      <div className="min-h-screen tech-universe-bg flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen tech-universe-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Không tìm thấy dự án
          </h2>
          <p className="text-gray-400 mb-6">
            Dự án này có thể đã bị xóa hoặc không tồn tại
          </p>
          <Link
            href="/explore"
            className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-xl font-semibold hover:shadow-neon transition-all duration-300"
          >
            🛒 Khám phá dự án khác
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen tech-universe-bg pt-16 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-neon-blue/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-neon-purple/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-neon-green/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/explore"
              className="flex items-center gap-2 text-neon-blue hover:text-neon-purple transition-all duration-300 hover:shadow-neon px-4 py-2 rounded-xl border border-neon-blue/30 hover:border-neon-blue/60"
            >
              <span className="text-xl">←</span>
              <span>Quay lại Galaxy</span>
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-300 font-semibold">{project.title}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Main image */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl p-4  transition-all duration-500">
                <img
                  src={
                    project.images?.[selectedImageIndex] || project.thumbnail
                  }
                  alt={project.title}
                  className="w-full h-96 object-cover rounded-2xl border border-gray-700/50 transition-all duration-300"
                />
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {(project.images || [project.thumbnail]).map((image, index) => (
                <motion.div
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`cursor-pointer relative ${
                    selectedImageIndex === index
                      ? "ring-2 ring-neon-blue rounded-xl"
                      : ""
                  }`}
                >
                  <img
                    src={image}
                    alt={`${project.title} ${index + 1}`}
                    className="w-full h-20 object-cover rounded-xl border border-gray-700/50 hover:border-neon-blue/50 transition-all duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Title + Rating */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border  rounded-2xl p-6">
              <h1 className="text-4xl font-bold text-white mb-4">
                {project.title}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="text-white font-semibold text-lg">
                  {project.rating?.average || 4.8}
                </span>
                <span className="text-gray-400">
                  ({project.rating?.count || 0} đánh giá)
                </span>
              </div>
              <p className="text-gray-300 text-lg">{project.description}</p>
            </div>

            {/* Price + Buy */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border rounded-3xl p-6">
              <PriceDisplay
                price={project.price}
                originalPrice={project.originalPrice}
                size="2xl"
                className="mb-6"
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPurchased(!isPurchased)}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  isPurchased
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gradient-to-r from-neon-blue to-neon-purple hover:shadow-neon"
                } text-white`}
              >
                {isPurchased ? "✓ Đã mua" : "⚡ Mua ngay"}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex space-x-2 bg-gray-900/80 backdrop-blur-xl p-2 rounded-2xl border border-neon-blue/30 mb-8">
            {[
              { id: "overview", label: "📊 Tổng quan" },
              { id: "features", label: "⚡ Tính năng" },
              { id: "tech", label: "🔧 Công nghệ" },
              { id: "reviews", label: "⭐ Đánh giá" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-neon-blue to-neon-purple text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-gray-900/80 backdrop-blur-xl border border-neon-blue/30 rounded-3xl p-8">
            {activeTab === "overview" && (
              <p className="text-gray-300">{project.longDescription}</p>
            )}
            {activeTab === "features" && (
              <ul className="space-y-2">
                {project.features?.map((f, i) => (
                  <li key={i} className="text-gray-300">
                    ⚡ {f}
                  </li>
                ))}
              </ul>
            )}
            {activeTab === "tech" && (
              <div className="flex flex-wrap gap-2">
                {project.techStack?.map((t, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-neon-blue/20 text-neon-blue rounded-lg text-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            {activeTab === "reviews" && (
              <p className="text-gray-400">
                {project.reviews?.length > 0
                  ? `${project.reviews.length} đánh giá`
                  : "Chưa có đánh giá nào"}
              </p>
            )}
          </div>
        </div>

        {/* Suggested Products */}
        <div className="mt-12">
          <SuggestedProductsGrid
            projects={project.relatedProjects || []}
            title="Suggested Products"
          />
        </div>
      </div>
    </div>
  );
}
