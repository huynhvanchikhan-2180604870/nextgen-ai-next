"use client";

import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
// Components
import SpaceScene from "../components/3d/SpaceScene";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import SpaceProjectCard from "../components/ui/SpaceProjectCard";
import { useFeaturedProjects } from "../hooks/useProjects";
import { TypeAnimation } from "react-type-animation";
// // 3D Scene (Canvas nằm bên trong, ssr: false)
// const SpaceScene = dynamic(() => import("../components/3d/SpaceScene"), {
//   ssr: false,
//   loading: () => (
//     <div className="h-96 flex items-center justify-center">
//       <LoadingSpinner size="lg" />
//     </div>
//   ),
// });

export default function HomePage() {
  const [currentPhase, setCurrentPhase] = useState("typing");
  const [typingText, setTypingText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const { data: featuredData, isLoading, error } = useFeaturedProjects();

  const typingTexts = useMemo(
    () => [
      "Khởi tạo hệ thống AI...",
      "Kết nối với Code Galaxy...",
      "Xây dựng vũ trụ công nghệ...",
      "Sẵn sàng khám phá! 🚀",
    ],
    []
  );
  const features = [
    {
      icon: "💻",
      title: "Build",
      description: "Tạo dự án với AI Planner thông minh",
      color: "from-neon-blue to-neon-purple",
    },
    {
      icon: "🛒",
      title: "Buy",
      description: "Mua source code chất lượng cao",
      color: "from-neon-purple to-neon-green",
    },
    {
      icon: "🤖",
      title: "Imagine",
      description: "Tưởng tượng với AI và công nghệ",
      color: "from-neon-green to-neon-blue",
    },
  ];

  const stats = [
    { number: "10K+", label: "Dự án có sẵn", icon: "💻" },
    { number: "5K+", label: "Developer", icon: "👥" },
    { number: "50K+", label: "Lượt tải", icon: "📥" },
    { number: "99%", label: "Hài lòng", icon: "⭐" },
  ];
  // Typing animation
  useEffect(() => {
    if (currentPhase === "typing") {
      const currentText = typingTexts[currentTextIndex];
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex <= currentText.length) {
          setTypingText(currentText.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            if (currentTextIndex < typingTexts.length - 1) {
              setCurrentTextIndex((prev) => prev + 1);
            } else {
              setCurrentPhase("spaceship");
            }
          }, 1500);
        }
      }, 80);
      return () => clearInterval(typeInterval);
    }
  }, [currentPhase, currentTextIndex, typingTexts]);

  useEffect(() => {
    if (currentPhase === "spaceship") {
      const timer = setTimeout(() => setCurrentPhase("particles"), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentPhase]);

  return (
    <div className="min-h-screen tech-universe-bg">
      {/* 🚀 Launch Zone - Space Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Space Scene */}
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <SpaceScene phase={currentPhase} typingText={typingText} />
          </Canvas>
        </div>

        {/* Subtle Glass Overlay - không chặn tương tác */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/2 via-transparent to-white/5 pointer-events-none"></div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            {/* Main Title */}
            <motion.h1
              className="text-6xl md:text-8xl font-bold font-display"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green bg-clip-text text-transparent drop-shadow-lg">
                NextGenAI
              </span>
            </motion.h1>

            {/* Subtitle with typewriter */}
            <motion.h2
              className="text-2xl md:text-4xl text-gray-200 font-light min-h-[48px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <TypeAnimation
                sequence={[
                  "Build with AI ✨",
                  2000,
                  "Buy Smart Source 🚀",
                  2000,
                  "Imagine the Future 🌌",
                  2000,
                ]}
                speed={50}
                repeat={Infinity}
              />
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              Hành tinh Code & AI – Nơi kết nối{" "}
              <span className="text-cyan-400 font-semibold">
                ý tưởng sáng tạo
              </span>{" "}
              với{" "}
              <span className="text-purple-400 font-semibold">
                công nghệ tiên tiến
              </span>
              .
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2 }}
            >
              <Link
                href="/explore"
                className="group relative px-8 py-4 text-white rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                {/* Liquid Glass Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 backdrop-blur-xl border border-white/20 rounded-2xl"></div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

                {/* Content */}
                <span className="relative z-10 flex items-center gap-2">
                  🪐 Khám phá Code Galaxy
                </span>
              </Link>

              <Link
                href="/planner"
                className="group relative px-8 py-4 text-white rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                {/* Liquid Glass Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 to-neon-green/20 backdrop-blur-xl border border-white/20 rounded-2xl"></div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-green rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

                {/* Content */}
                <span className="relative z-10 flex items-center gap-2">
                  🤖 AI Planner Hub
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3 }}
        >
          <div className="relative">
            {/* Liquid Glass Background */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full"></div>

            {/* Main Scroll Indicator */}
            <div className="relative w-8 h-12 border-2 border-neon-blue/50 rounded-full flex justify-center items-center animate-bounce backdrop-blur-sm">
              <div className="w-1.5 h-4 bg-gradient-to-b from-neon-blue to-neon-purple rounded-full animate-pulse"></div>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-neon-blue/20 rounded-full blur-sm animate-pulse"></div>
          </div>
        </motion.div>
      </section>

      {/* Build, Buy, Imagine Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display  mb-6">
              Build • Buy • Imagine
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Ba trụ cột của vũ trụ phát triển phần mềm
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card-info-glass text-center p-8 group"
              >
                <div className="text-6xl mb-6 group-hover:animate-bounce">
                  {feature.icon}
                </div>
                <h3
                  className={`text-3xl font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent mb-4`}
                >
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center card-info-glass"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-bold  mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-6 neon-text">
              🌟 Dự án nổi bật từ Code Galaxy
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Những viên ngọc quý được khai thác từ vũ trụ code
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center text-red-400">
              Không thể tải dự án nổi bật
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-10">
              {(featuredData?.projects || [])
                .slice(0, 6)
                .map((project, index) => (
                  <SpaceProjectCard
                    key={project._id}
                    project={project}
                    index={index}
                  />
                ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/explore"
              className="px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-xl font-semibold text-lg hover:shadow-neon transition-all duration-200 transform hover:scale-102"
            >
              🚀 Khám phá toàn bộ Galaxy
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-card p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display  mb-6">
              🚀 Sẵn sàng khởi động?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Tham gia cuộc hành trình khám phá vũ trụ code và AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-xl font-semibold text-lg hover:shadow-neon transition-all duration-300 transform hover:scale-105"
              >
                🎯 Đăng ký miễn phí
              </Link>
              <Link
                href="/planner"
                className="px-8 py-4 glass text-white rounded-xl font-semibold text-lg hover:shadow-neon transition-all duration-300 transform hover:scale-105"
              >
                🤖 Thử AI Planner
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
