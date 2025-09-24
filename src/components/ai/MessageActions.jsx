"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const MessageActions = ({ message, onSelectIdea, isSelected = false }) => {
  const [showActions, setShowActions] = useState(false);

  if (message.type !== "ai") return null;

  return (
    <div
      className="relative group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Message content */}
      <div className="relative">
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute -left-2 top-0 bottom-0 w-1 bg-neon-blue rounded-full" />
        )}

        {/* Action buttons */}
        {showActions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-2 -right-2 flex gap-2 z-10"
          >
            <button
              onClick={() => onSelectIdea(message)}
              className="px-3 py-1 bg-neon-blue text-white text-xs rounded-full hover:bg-neon-purple transition-all duration-200 shadow-lg"
              title="Chọn ý tưởng này"
            >
              💾 Chọn ý tưởng
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MessageActions;
