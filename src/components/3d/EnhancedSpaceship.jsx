"use client";

import { Box, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const EnhancedSpaceship = ({ position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const meshRef = useRef();
  const engineRef = useRef();
  const trailRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      // Smooth rotation
      meshRef.current.rotation.x =
        rotation[0] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.y = rotation[1] + state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.z =
        rotation[2] + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;

      // Floating motion
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.4;
      meshRef.current.position.x =
        position[0] + Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
    }

    if (engineRef.current) {
      engineRef.current.rotation.y += 0.05;
    }

    if (trailRef.current) {
      trailRef.current.rotation.y += 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Main Body */}
      <Box args={[3, 0.8, 0.6]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#bf00ff"
          emissive="#bf00ff"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      {/* Cockpit */}
      <Sphere args={[0.4, 16, 16]} position={[1, 0.3, 0]}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
          metalness={0.8}
          roughness={0.1}
        />
      </Sphere>

      {/* Wings */}
      <Box args={[1.5, 0.2, 0.3]} position={[-1, 0, 0]}>
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </Box>
      <Box args={[1.5, 0.2, 0.3]} position={[1, 0, 0]}>
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </Box>

      {/* Main Engine */}
      <group ref={engineRef} position={[-1.8, 0, 0]}>
        <Sphere args={[0.25, 16, 16]}>
          <meshStandardMaterial
            color="#00ff41"
            emissive="#00ff41"
            emissiveIntensity={1.2}
            transparent
            opacity={0.9}
          />
        </Sphere>

        <Box args={[0.15, 0.15, 1.2]} position={[-0.6, 0, 0]}>
          <meshStandardMaterial
            color="#ffaa00"
            emissive="#ffaa00"
            emissiveIntensity={0.8}
            transparent
            opacity={0.7}
          />
        </Box>
      </group>

      {/* Side Engines */}
      <Sphere args={[0.18, 12, 12]} position={[-1.4, 0.4, 0.5]}>
        <meshStandardMaterial
          color="#ff6b6b"
          emissive="#ff6b6b"
          emissiveIntensity={0.8}
          transparent
          opacity={0.8}
        />
      </Sphere>
      <Sphere args={[0.18, 12, 12]} position={[-1.4, 0.4, -0.5]}>
        <meshStandardMaterial
          color="#ff6b6b"
          emissive="#ff6b6b"
          emissiveIntensity={0.8}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Energy Trail */}
      <group ref={trailRef} position={[-2.5, 0, 0]}>
        {[...Array(5)].map((_, i) => (
          <Sphere
            key={i}
            args={[0.05, 8, 8]}
            position={[0, Math.sin(i) * 0.3, Math.cos(i) * 0.3]}
          >
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={0.6}
              transparent
              opacity={0.5}
            />
          </Sphere>
        ))}
      </group>
    </group>
  );
};

export default EnhancedSpaceship;
