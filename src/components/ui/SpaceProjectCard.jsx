"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { memo, useState } from "react";
import PriceDisplay from "./PriceDisplay";

const SpaceProjectCard = ({ project }) => {
  const [isFav, setIsFav] = useState(false);
  const [selectedImage, setSelectedImage] = useState(project.thumbnail);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.01 }}
      className="tech-card-noneon flex flex-col md:flex-row gap-6 hover:shadow-lg transition"
    >
      {/* LEFT: IMAGE */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative rounded-xl">
        {/* Controls */}
        <div className="absolute top-3 left-3 flex gap-2">
          <button
            onClick={() => navigator.share?.({ url: window.location.href })}
            className="w-8 h-8 flex items-center justify-center rounded-full glass-button text-sm"
          >
            🔗
          </button>
        </div>
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setIsFav(!isFav)}
            className="w-8 h-8 flex items-center justify-center rounded-full glass-button text-sm"
          >
            {isFav ? "💖" : "🤍"}
          </button>
        </div>

        {/* Main image */}
        <div className="w-full flex justify-center items-center">
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt={project.title}
              width={500}
              height={350}
              quality={60}
              placeholder="blur"
              blurDataURL={selectedImage}
              className="rounded-[15px] shadow-md object-contain max-h-72 transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <img
              src={selectedImage}
              alt={project.title}
              loading="lazy"
              className="rounded-[15px] shadow-md object-contain max-h-72 transition-transform duration-300 hover:scale-105"
            />
          )}
        </div>

        {/* Album */}
        {project.images?.length > 1 && (
          <div className="flex gap-2 mt-3">
            {project.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`w-12 h-12 rounded-md overflow-hidden border ${
                  selectedImage === img ? "border-cyan-400" : "border-gray-600"
                }`}
              >
                <img
                  src={img}
                  alt={`thumb-${i}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: INFO */}
      <div className="flex-1 p-4 flex flex-col justify-between card-info-glass">
        <h1 className="text-2xl font-bold text-white mb-2">{project.title}</h1>
        <span className="text-xs text-gray-400 mb-3">CODE: {project.id}</span>

        {/* Price */}
        <div className="mb-4">
          <PriceDisplay
            price={project.price}
            originalPrice={project.originalPrice}
            size="lg"
          />
        </div>

        {/* Features */}
        {project.features?.length > 0 && (
          <ul className="list-disc pl-5 text-gray-300 text-sm space-y-1">
            {project.features.slice(0, 3).map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        )}

        {/* Buy button */}
        <button className="mt-6 fancy w-full">Mua Ngay</button>
      </div>
    </motion.div>
  );
};

export default memo(SpaceProjectCard);
