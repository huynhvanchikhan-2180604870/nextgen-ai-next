"use client";

import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import PlanetMarketplace from "../../components/3d/PlanetMarketplace.jsx";
import ErrorMessage from "../../components/ui/ErrorMessage.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import PriceDisplay from "../../components/ui/PriceDisplay";
import { useCategories } from "../../hooks/useCategories.js";
import { useProjects } from "../../hooks/useProjects.js";

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectSelect = useCallback((project) => {
    console.log("Project selected:", project.title); // Debug log
    setSelectedProject(project);
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);
  const [searchQuery, setSearchQuery] = useState("");

  // Load categories from API
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const {
    data: projectsData,
    isLoading,
    error,
  } = useProjects({
    category: selectedCategory === "All" ? "" : selectedCategory,
    search: searchQuery,
  });

  // Process categories data
  const categories = useMemo(() => {
    if (categoriesData?.success && categoriesData.data) {
      // Add "All" category at the beginning, filter out any existing "All" from API
      const apiCategories = categoriesData.data.filter(
        (cat) => cat.name !== "All"
      );
      return [
        {
          name: "All",
          icon: "🌟",
          color: "from-neon-blue to-neon-purple",
          _id: "all",
        },
        ...apiCategories.map((cat) => ({
          name: cat.name,
          icon: cat.icon || "📁",
          color: `from-${cat.color?.replace("#", "") || "blue"}-400 to-${
            cat.color?.replace("#", "") || "blue"
          }-600`,
          _id: cat._id,
        })),
      ];
    }

    // Fallback to default categories
    return [
      {
        name: "All",
        icon: "🌟",
        color: "from-neon-blue to-neon-purple",
        _id: "all",
      },
      {
        name: "React",
        icon: "⚛️",
        color: "from-blue-400 to-blue-600",
        _id: "react",
      },
      {
        name: "Vue",
        icon: "💚",
        color: "from-green-400 to-green-600",
        _id: "vue",
      },
      {
        name: "Angular",
        icon: "🅰️",
        color: "from-red-400 to-red-600",
        _id: "angular",
      },
      {
        name: "Node.js",
        icon: "🟢",
        color: "from-green-500 to-green-700",
        _id: "nodejs",
      },
      {
        name: "Python",
        icon: "🐍",
        color: "from-yellow-400 to-yellow-600",
        _id: "python",
      },
      {
        name: "AI",
        icon: "🤖",
        color: "from-purple-400 to-purple-600",
        _id: "ai",
      },
      {
        name: "Mobile",
        icon: "📱",
        color: "from-pink-400 to-pink-600",
        _id: "mobile",
      },
      {
        name: "Web",
        icon: "🌐",
        color: "from-cyan-400 to-cyan-600",
        _id: "web",
      },
    ];
  }, [categoriesData]);

  // Sử dụng đúng path từ API response với memoization
  const projects = useMemo(() => {
    const data = projectsData?.projects || [];
    // Debug log với điều kiện để tránh spam
    if (data.length > 0) {
      console.log("Projects data loaded:", data.length, "items");
    }
    return data;
  }, [projectsData]);

  return (
    <div className="min-h-screen tech-universe-bg pt-16">
      {/* Header */}
      <div className="relative z-10 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold font-display mb-6">
              🪐 Code Marketplace
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Khám phá vũ trụ code với hàng nghìn dự án như những hành tinh đang
              chờ bạn khám phá
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm trong vũ trụ code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 glass rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:ring-opacity-50 transition-all duration-300"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <span className="text-neon-blue text-xl">🚀</span>
              </div>
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            {categories.map((category, index) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.name
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : "glass text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 3D Planet Marketplace */}
      <div className="h-[70vh] relative">
        {isLoading || categoriesLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner size="lg" />
          </div>
        ) : error || categoriesError ? (
          <div className="flex items-center justify-center h-full">
            <ErrorMessage
              title="Không thể tải vũ trụ code"
              message={
                error?.message ||
                categoriesError?.message ||
                "Vui lòng kiểm tra kết nối internet và thử lại"
              }
              icon="🚫"
              onRetry={() => window.location.reload()}
              retryText="Tải lại trang"
            />
          </div>
        ) : (
          <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
            <PlanetMarketplace
              projects={projects}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              onProjectSelect={handleProjectSelect}
            />
          </Canvas>
        )}
      </div>

      {/* Project Details Panel */}
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-20 glass-card border-t border-white/10"
        >
          <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white">
                {selectedProject.title}
              </h3>
              <button
                onClick={() => setSelectedProject(null)}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <p className="text-gray-300 mb-4">
                  {selectedProject.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedProject.techStack?.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-neon-blue/20 text-neon-blue rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-sm">
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm">
                      {typeof selectedProject.rating === "object"
                        ? selectedProject.rating?.average || 4.8
                        : selectedProject.rating || 4.8}
                    </span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400 text-sm">
                    {selectedProject.downloads || 0} lượt tải
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <PriceDisplay
                    price={selectedProject.price || 0}
                    size="2xl"
                    className="mb-2"
                  />
                  <p className="text-gray-400 text-sm">Giá dự án</p>
                </div>

                <div className="space-y-3">
                  <Link
                    href={`/project/${selectedProject._id}`}
                    className="w-full px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-xl font-semibold text-center block hover:shadow-neon transition-all duration-300 transform hover:scale-105"
                  >
                    📖 Xem chi tiết
                  </Link>
                  <button className="w-full px-6 py-3 glass text-white rounded-xl font-semibold hover:shadow-neon transition-all duration-300 transform hover:scale-105">
                    🛒 Mua ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="fixed top-1/2 right-4 transform -translate-y-1/2 z-10"
      >
        <div className="glass-card p-4 max-w-xs">
          <h4 className="text-white font-semibold mb-2">🎮 Hướng dẫn</h4>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Xoay chuột để khám phá</li>
            <li>• Click vào hành tinh để xem chi tiết</li>
            <li>• Zoom để phóng to</li>
            <li>• Click chòm sao để lọc</li>
          </ul>
        </div>
      </motion.div> */}
    </div>
  );
};

export default Explore;
