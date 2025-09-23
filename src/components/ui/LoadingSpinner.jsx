import React from "react";

const LoadingSpinner = ({ size = "md", color = "blue", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colorClasses = {
    blue: "border-t-neon-blue",
    purple: "border-t-neon-purple",
    green: "border-t-neon-green",
    white: "border-t-white",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Outer glow ring */}
        <div
          className={`${sizeClasses[size]} absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-ping`}
        ></div>

        {/* Main spinner */}
        <div
          className={`
            ${sizeClasses[size]} 
            border-2 border-white/20 
            ${colorClasses[color]} 
            rounded-full 
            animate-spin
            relative z-10
          `}
        />

        {/* Inner pulse */}
        <div
          className={`${sizeClasses[size]} absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 to-purple-400/30 animate-pulse`}
        ></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
