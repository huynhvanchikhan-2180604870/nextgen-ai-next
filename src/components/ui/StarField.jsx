"use client";

import { useEffect, useRef } from "react";

const StarField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initialize stars
    const stars = [];
    const numStars = 200;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        speed: Math.random() * 0.5 + 0.1,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
      });
    }

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star, index) => {
        // Move stars
        star.z -= star.speed;

        // Reset star if it goes too far
        if (star.z <= 0) {
          star.x = Math.random() * canvas.width;
          star.y = Math.random() * canvas.height;
          star.z = 1000;
        }

        // Calculate 2D position
        const x =
          (star.x - canvas.width / 2) * (200 / star.z) + canvas.width / 2;
        const y =
          (star.y - canvas.height / 2) * (200 / star.z) + canvas.height / 2;

        // Calculate size and opacity based on distance
        const size = star.size * (200 / star.z);
        const opacity = star.opacity * (1 - star.z / 1000);

        // Draw star
        if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fill();

          // Add glow effect for closer stars
          if (star.z < 500) {
            ctx.beginPath();
            ctx.arc(x, y, size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
            ctx.fill();
          }
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    // Initialize
    resizeCanvas();
    animate();

    // Handle resize
    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: "transparent",
      }}
    />
  );
};

export default StarField;
