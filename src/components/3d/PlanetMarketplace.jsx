"use client";
import {
  Box,
  Environment,
  Html,
  OrbitControls,
  Sphere,
  Stars,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { memo, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import EnhancedPlanet from "./EnhancedPlanet.jsx";

// Individual Planet Component
const Planet = ({ position, project, onClick, isHovered }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.rotation.x += 0.01;
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3;

      // Enhanced glow effect when hovered
      if (hovered || isHovered) {
        meshRef.current.scale.setScalar(1.3);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  const getPlanetColor = (category) => {
    const colors = {
      React: "#00f5ff",
      Vue: "#00ff41",
      Angular: "#ff0080",
      "Node.js": "#ffff00",
      Python: "#bf00ff",
      AI: "#ff6b35",
      Mobile: "#4ecdc4",
      Web: "#45b7d1",
    };
    return colors[category] || "#00f5ff";
  };

  const getPlanetShape = (type) => {
    return type === "cube" ? "cube" : "sphere";
  };

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {getPlanetShape(project.type) === "sphere" ? (
        <Sphere args={[1, 32, 32]}>
          <meshStandardMaterial
            color={getPlanetColor(project.category)}
            emissive={getPlanetColor(project.category)}
            emissiveIntensity={hovered || isHovered ? 0.5 : 0.2}
            metalness={0.8}
            roughness={0.2}
          />
        </Sphere>
      ) : (
        <Box args={[1.5, 1.5, 1.5]}>
          <meshStandardMaterial
            color={getPlanetColor(project.category)}
            emissive={getPlanetColor(project.category)}
            emissiveIntensity={hovered || isHovered ? 0.5 : 0.2}
            metalness={0.8}
            roughness={0.2}
          />
        </Box>
      )}

      {/* Project Info Hover */}
      {(hovered || isHovered) && (
        <Html distanceFactor={10}>
          <div className="glass-card p-4 min-w-[200px]">
            <h3 className="text-white font-semibold mb-2">{project.title}</h3>
            <p className="text-gray-300 text-sm mb-2">{project.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-neon-blue text-sm">{project.category}</span>
              <span className="text-neon-green font-semibold">
                ${project.price}
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Constellation Filter System
const Constellation = ({ position, tag, isActive, onClick }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.005;
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position} onClick={onClick}>
      <Sphere args={[0.3, 16, 16]}>
        <meshStandardMaterial
          color={isActive ? "#00f5ff" : "#666"}
          emissive={isActive ? "#00f5ff" : "#333"}
          emissiveIntensity={isActive ? 0.4 : 0.1}
          transparent
          opacity={isActive ? 1 : 0.5}
        />
      </Sphere>
      <Html distanceFactor={15} position={[0, -0.5, 0]}>
        <div
          className={`text-xs font-mono ${
            isActive ? "text-neon-blue" : "text-gray-400"
          }`}
        >
          {tag}
        </div>
      </Html>
    </group>
  );
};

// Main Planet Marketplace Scene
const PlanetMarketplace = ({
  projects,
  selectedCategory,
  onCategoryChange,
  onProjectSelect,
}) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showControls, setShowControls] = useState(false);

  // Debug log với điều kiện để tránh spam
  if (projects.length > 0) {
    console.log(
      "PlanetMarketplace received projects:",
      projects.length,
      "items"
    );
  }

  const categories = [
    "All",
    "React",
    "Vue",
    "Angular",
    "Node.js",
    "Python",
    "AI",
    "Mobile",
    "Web",
  ];

  const planetPositions = useMemo(() => {
    return projects.map((_, index) => {
      const angle = (index / projects.length) * Math.PI * 2;
      const radius = 12 + Math.random() * 8; // Tăng khoảng cách
      return [
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 8, // Tăng chiều cao
        Math.sin(angle) * radius,
      ];
    });
  }, [projects]);

  const handlePlanetClick = (project) => {
    setSelectedProject(project);
    onProjectSelect(project);

    // Focus camera on selected planet
    const planetIndex = projects.findIndex((p) => p._id === project._id);
    if (planetIndex !== -1) {
      const position = planetPositions[planetIndex];
      // You can add camera animation here if needed
    }
  };

  const constellationPositions = useMemo(() => {
    return categories.map((_, index) => {
      const angle = (index / categories.length) * Math.PI * 2;
      const radius = 12;
      return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
    });
  }, [categories]);

  return (
    <>
      {/* Environment */}
      <Environment preset="night" />

      {/* Stars */}
      <Stars
        radius={50}
        depth={25}
        count={2000}
        factor={2}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Enhanced Planets */}
      {projects && projects.length > 0 ? (
        projects.map((project, index) => (
          <EnhancedPlanet
            key={project._id}
            position={planetPositions[index]}
            project={project}
            onClick={() => handlePlanetClick(project)}
            isHovered={selectedProject?._id === project._id}
            isSelected={selectedProject?._id === project._id}
          />
        ))
      ) : (
        <Html position={[0, 0, 0]} center>
          <div className="text-white text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-2">Không có dự án nào</h3>
            <p className="text-gray-400">
              Hãy thử lại sau hoặc kiểm tra kết nối
            </p>
          </div>
        </Html>
      )}

      {/* Constellations (Category Filters) */}
      {categories.map((category, index) => (
        <Constellation
          key={category}
          position={constellationPositions[index]}
          tag={category}
          isActive={selectedCategory === category}
          onClick={() => onCategoryChange(category)}
        />
      ))}

      {/* Optimized Stars */}
      <Stars
        radius={80}
        depth={30}
        count={2000}
        factor={3}
        saturation={0}
        fade={true}
        speed={0.5}
      />

      {/* UI Controls Overlay */}
      {showControls && (
        <Html position={[0, 0, 0]} center>
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm border border-white/20 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-bold text-sm">🎮 Controls</h3>
              <button
                onClick={() => setShowControls(false)}
                className="text-gray-400 hover:text-white transition-colors ml-2"
              >
                ✕
              </button>
            </div>
            <div className="text-white text-xs space-y-1">
              <div>🖱️ Click: Select Planet</div>
              <div>🔄 Drag: Rotate View</div>
              <div>🔍 Scroll: Zoom In/Out</div>
              <div>⌨️ Right Click: Pan</div>
            </div>
          </div>
        </Html>
      )}

      

      {/* Optimized Orbit Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={-Math.PI / 1.8}
        maxDistance={25}
        minDistance={5}
        enableDamping={true}
        dampingFactor={0.08}
        rotateSpeed={0.4}
        zoomSpeed={0.6}
        panSpeed={0.4}
      />
    </>
  );
};

export default memo(PlanetMarketplace);
