import { motion } from "framer-motion";
import { useState } from "react";
import SpaceProjectCard from "./SpaceProjectCard.jsx";

const SuggestedProductsGrid = ({ projects, title = "Suggested Products" }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!projects?.length) return null;

  return (
    <div className="relative w-full">
      {/* Header */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 rounded-3xl blur-2xl" />
        <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-neon-purple/30 rounded-3xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="text-neon-purple text-3xl sm:text-4xl"
                >
                  🌌
                </motion.span>
                <span className="bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
                  {title}
                </span>
              </h3>
              <p className="text-gray-400 mt-2 text-sm sm:text-base">
                Khám phá các dự án gợi ý trong vũ trụ công nghệ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project._id || index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              type: "spring",
              stiffness: 100,
            }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            className="h-full"
          >
            <SpaceProjectCard
              project={project}
              index={index}
              isHovered={hoveredIndex === index}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedProductsGrid;
