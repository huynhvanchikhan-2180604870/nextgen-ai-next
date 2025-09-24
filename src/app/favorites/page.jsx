"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useFavorites } from "@/hooks/useProjects";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function Favorites() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data: favoritesData, isLoading, error } = useFavorites();

  const projects = favoritesData?.projects || [];

  const categories = [
    { name: "All", icon: "🌟" },
    { name: "React", icon: "⚛️" },
    { name: "Vue", icon: "💚" },
    { name: "Angular", icon: "🅰️" },
    { name: "Node.js", icon: "🟢" },
    { name: "Python", icon: "🐍" },
    { name: "AI", icon: "🤖" },
    { name: "Mobile", icon: "📱" },
    { name: "Web", icon: "🌐" },
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          <h1 className="text-5xl md:text-7xl font-bold font-display neon-text mb-6">
            ❤️ My Favorites
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Bộ sưu tập yêu thích của bạn - Những dự án đã đánh dấu tim
          </p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm trong yêu thích..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 glass rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:ring-opacity-50 transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    selectedCategory === category.name
                      ? "bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-lg"
                      : "glass text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="tech-card text-center p-6">
            <div className="text-3xl font-bold neon-text mb-2">
              {projects.length}
            </div>
            <div className="text-gray-400">Tổng yêu thích</div>
          </div>
          <div className="tech-card text-center p-6">
            <div className="text-3xl font-bold neon-text mb-2">
              {projects.reduce((sum, p) => sum + (p.price || 0), 0)}
            </div>
            <div className="text-gray-400">Tổng giá trị</div>
          </div>
          <div className="tech-card text-center p-6">
            <div className="text-3xl font-bold neon-text mb-2">
              {Math.round(
                projects.reduce(
                  (sum, p) =>
                    sum +
                    (typeof p.rating === "object"
                      ? p.rating?.average || 0
                      : p.rating || 0),
                  0
                ) / projects.length
              ) || 0}
            </div>
            <div className="text-gray-400">Đánh giá TB</div>
          </div>
          <div className="tech-card text-center p-6">
            <div className="text-3xl font-bold neon-text mb-2">
              {new Set(projects.map((p) => p.category)).size}
            </div>
            <div className="text-gray-400">Danh mục</div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚫</div>
            <p className="text-red-400">Không thể tải danh sách yêu thích</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Chưa có yêu thích
            </h3>
            <p className="text-gray-400 mb-6">
              Bạn chưa đánh dấu dự án nào làm yêu thích. Hãy khám phá và thêm
              vào danh sách!
            </p>
            <Link
              href="/explore"
              className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-xl font-semibold hover:shadow-neon transition-all duration-300"
            >
              🛒 Khám phá ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="tech-card group"
              >
                {/* Project Image */}
                <div className="aspect-video bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 relative">
                  <span className="text-4xl">💻</span>
                  <div className="absolute top-2 right-2">
                    <span className="text-red-500 text-2xl">❤️</span>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-neon-blue transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.techStack?.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-neon-blue/20 text-neon-blue rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack?.length > 3 && (
                      <span className="px-2 py-1 bg-gray-600/20 text-gray-400 rounded text-xs">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Rating + Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-sm">
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-400 text-sm">
                        {typeof project.rating === "object"
                          ? project.rating?.average || 4.8
                          : project.rating || 4.8}
                      </span>
                    </div>
                    <div className="text-neon-green font-semibold">
                      ${project.price || 29}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      href={`/project/${project._id}`}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg text-sm font-semibold text-center hover:shadow-neon transition-all duration-300"
                    >
                      📖 Xem
                    </Link>
                    <button className="px-3 py-2 glass text-white rounded-lg text-sm font-semibold hover:shadow-neon transition-all duration-300">
                      🛒 Mua
                    </button>
                    <button className="px-3 py-2 glass text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500/20 transition-all duration-300">
                      💔
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
