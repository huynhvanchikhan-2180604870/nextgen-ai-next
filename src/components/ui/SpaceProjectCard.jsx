"use client";
import { motion } from "framer-motion";
import { useState } from "react";

const SpaceProductCard = ({ project, index }) => {
  const [isFav, setIsFav] = useState(false);

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1 }}
      className="tech-card-noneon text-center group rounded-4xl shadow-lg border border-cyan-500/30 bg-white/5 backdrop-blur-xl flex flex-col"
    >
      {/* Hình ảnh */}
      <div className="relative h-56 w-full overflow-hidden rounded-xl">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Favorite */}
        <button
          onClick={() => setIsFav(!isFav)}
          className="absolute top-3 left-3 bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/40 transition"
        >
          {isFav ? "💖" : "🤍"}
        </button>
      </div>

      {/* Nội dung */}
      <div className="flex flex-col flex-1 space-y-3 p-6 md:p-8 ">
        {/* Tên sản phẩm */}
        <h3 className="text-base md:text-lg font-semibold text-white leading-snug line-clamp-2">
          {project.title}
        </h3>

        {/* Rating */}
        <div className="flex justify-center items-center gap-2 text-sm text-gray-300">
          <span className="text-yellow-400">★★★★★</span>
          <span className="font-medium text-white">
            {project.rating?.average || 4.8}
          </span>
          <span className="text-gray-400">
            ({project.rating?.count || 100})
          </span>
        </div>

        {/* Giá */}
        <div className="text-lg md:text-xl font-bold text-cyan-400">
          {project.price
            ? `${(project.price * 24000).toLocaleString("vi-VN")} VND`
            : "Liên hệ"}
        </div>

        {/* Nút MUA NGAY */}
        <div className="pt-4">
          <a className="fancy w-full block text-center cursor-pointer">
            <span className="top-key"></span>
            <span className="text">Mua Ngay</span>
            <span className="bottom-key-1"></span>
            <span className="bottom-key-2"></span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default SpaceProductCard;
