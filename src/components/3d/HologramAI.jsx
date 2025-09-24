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
import { useMemo, useRef } from "react";
import * as THREE from "three";

// Hologram Card Component
const HologramCard = ({ position, message, type, isVisible }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current && isVisible) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;

      // Hologram flicker effect
      const flicker = Math.sin(state.clock.elapsedTime * 10) * 0.1 + 0.9;
      if (meshRef.current.material) {
        meshRef.current.material.opacity = flicker;
      }
    }
  });

  const getCardColor = (type) => {
    const colors = {
      user: "#00f5ff",
      ai: "#bf00ff",
      analysis: "#00ff41",
      recommendation: "#ffff00",
    };
    return colors[type] || "#00f5ff";
  };

  return (
    <group ref={meshRef} position={position}>
      <Box args={[3, 2, 0.1]}>
        <meshStandardMaterial
          color={getCardColor(type)}
          emissive={getCardColor(type)}
          emissiveIntensity={0.3}
          transparent
          opacity={isVisible ? 0.8 : 0}
          side={THREE.DoubleSide}
        />
      </Box>

      {isVisible && (
        <Html distanceFactor={10}>
          <div className="glass-card p-4 min-w-[300px] max-w-[400px]">
            <div className="flex items-center space-x-2 mb-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  type === "user"
                    ? "bg-neon-blue"
                    : type === "ai"
                    ? "bg-neon-purple"
                    : type === "analysis"
                    ? "bg-neon-green"
                    : "bg-neon-yellow"
                }`}
              ></div>
              <span className="text-white font-semibold capitalize">
                {type}
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
          </div>
        </Html>
      )}
    </group>
  );
};

// AI Brain Core
const AIBrain = ({ isActive }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.02;
      meshRef.current.rotation.z += 0.005;

      if (isActive) {
        meshRef.current.scale.setScalar(
          1 + Math.sin(state.clock.elapsedTime * 3) * 0.1
        );
      }
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial
          color="#bf00ff"
          emissive="#bf00ff"
          emissiveIntensity={isActive ? 0.5 : 0.2}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Neural Network Lines */}
      {isActive &&
        [...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <Box
              key={i}
              args={[0.05, 0.05, 2]}
              position={[Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0]}
              rotation={[0, 0, angle]}
            >
              <meshStandardMaterial
                color="#00f5ff"
                emissive="#00f5ff"
                emissiveIntensity={0.3}
              />
            </Box>
          );
        })}
    </group>
  );
};

// Analysis Grid
const AnalysisGrid = ({ analysis, isVisible }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current && isVisible) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={meshRef} position={[0, -3, 0]}>
      {isVisible && analysis && (
        <>
          {/* Grid Lines */}
          {[...Array(5)].map((_, i) => (
            <Box
              key={`h-${i}`}
              args={[4, 0.02, 0.02]}
              position={[0, (i - 2) * 0.5, 0]}
            >
              <meshStandardMaterial
                color="#00ff41"
                emissive="#00ff41"
                emissiveIntensity={0.2}
              />
            </Box>
          ))}
          {[...Array(5)].map((_, i) => (
            <Box
              key={`v-${i}`}
              args={[0.02, 2, 0.02]}
              position={[(i - 2) * 0.5, 0, 0]}
            >
              <meshStandardMaterial
                color="#00ff41"
                emissive="#00ff41"
                emissiveIntensity={0.2}
              />
            </Box>
          ))}

          {/* Data Points */}
          {analysis.complexity && (
            <Sphere args={[0.1, 16, 16]} position={[0, 0, 0]}>
              <meshStandardMaterial
                color="#ffff00"
                emissive="#ffff00"
                emissiveIntensity={0.5}
              />
            </Sphere>
          )}
        </>
      )}
    </group>
  );
};

// Main Hologram AI Scene
const HologramAI = ({ messages, currentAnalysis, isTyping }) => {
  const messagePositions = useMemo(() => {
    return messages.map((_, index) => {
      const angle = (index / Math.max(messages.length, 1)) * Math.PI * 2;
      const radius = 5;
      return [
        Math.cos(angle) * radius,
        Math.sin(index * 0.5) * 2,
        Math.sin(angle) * radius,
      ];
    });
  }, [messages]);

  return (
    <>
      {/* Environment */}
      <Environment preset="night" />

      {/* Stars */}
      <Stars
        radius={30}
        depth={15}
        count={1000}
        factor={1}
        saturation={0}
        fade
        speed={0.3}
      />

      {/* AI Brain Core */}
      <AIBrain isActive={isTyping || messages.length > 0} />

      {/* Hologram Messages */}
      {messages.map((message, index) => (
        <HologramCard
          key={index}
          position={messagePositions[index]}
          message={message.content}
          type={message.type}
          isVisible={true}
        />
      ))}

      {/* Analysis Grid */}
      <AnalysisGrid analysis={currentAnalysis} isVisible={!!currentAnalysis} />

      {/* Orbit Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        autoRotate
        autoRotateSpeed={0.2}
      />
    </>
  );
};

export default HologramAI;
