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

// AI Typing Loader Component
const AITypingLoader = ({ position, text, isTyping }) => {
  const meshRef = useRef();
  const particlesRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }

    // Update particles
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, i) => {
        particle.position.y = Math.sin(state.clock.elapsedTime * 2 + i) * 0.2;
      });
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Main AI Core */}
      <Sphere args={[0.6, 32, 32]}>
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Outer Glow Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.2, 32]} />
        <meshBasicMaterial
          color="#00f5ff"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Energy Particles */}
      <group ref={particlesRef}>
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <Sphere
              key={i}
              args={[0.05, 8, 8]}
              position={[Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5]}
            >
              <meshStandardMaterial
                color="#bf00ff"
                emissive="#bf00ff"
                emissiveIntensity={0.8}
                transparent
                opacity={0.7}
              />
            </Sphere>
          );
        })}
      </group>

      <Html distanceFactor={8} position={[0, -1.2, 0]} center>
        <div className="relative">
          {/* Liquid Glass Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl"></div>

          {/* Glass Overlay Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-neon-blue/20 via-transparent to-neon-purple/20 rounded-2xl"></div>

          {/* Main Content */}
          <div className="relative bg-black/40 backdrop-blur-md border border-neon-blue/30 rounded-2xl p-6 min-w-[350px] text-center shadow-neon">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 via-neon-purple/10 to-neon-green/10 rounded-2xl blur-sm"></div>

            {/* Content */}
            <div className="relative z-10">
              <div className="text-neon-blue text-xl font-bold mb-3 tracking-wide">
                {isTyping ? `${text}|` : text}
              </div>

              {/* Enhanced Progress Bar */}
              <div className="w-full h-3 bg-gray-900/50 rounded-full overflow-hidden mb-3 border border-white/10">
                <div className="h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green rounded-full animate-pulse relative">
                  <div className="absolute inset-0 bg-white/20 animate-ping"></div>
                </div>
              </div>

              <div className="text-gray-300 text-sm font-light">
                Đang khởi tạo hệ thống...
              </div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};

// 3D Spaceship Component
const Spaceship = ({ position, rotation }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x =
        rotation[0] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.y = rotation[1] + state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.z =
        rotation[2] + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Main Body */}
      <Box args={[2, 0.5, 0.3]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#bf00ff"
          emissive="#bf00ff"
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </Box>

      {/* Wings */}
      <Box args={[0.8, 0.1, 0.1]} position={[-0.6, 0, 0]}>
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.3}
        />
      </Box>
      <Box args={[0.8, 0.1, 0.1]} position={[0.6, 0, 0]}>
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.3}
        />
      </Box>

      {/* Engine Glow */}
      <Sphere args={[0.1, 16, 16]} position={[-1, 0, 0]}>
        <meshStandardMaterial
          color="#00ff41"
          emissive="#00ff41"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </Sphere>
      <Sphere args={[0.1, 16, 16]} position={[1, 0, 0]}>
        <meshStandardMaterial
          color="#00ff41"
          emissive="#00ff41"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </Sphere>
    </group>
  );
};

// Floating Code Particles
const CodeParticle = ({ position, code }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y +=
        Math.sin(state.clock.elapsedTime + position[0]) * 0.001;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <Box args={[0.1, 0.1, 0.1]}>
        <meshStandardMaterial
          color="#ffff00"
          emissive="#ffff00"
          emissiveIntensity={0.2}
        />
      </Box>
      <Html distanceFactor={20} position={[0, 0.2, 0]}>
        <div className="text-yellow-400 text-xs font-mono">{code}</div>
      </Html>
    </group>
  );
};

// Main Space Scene
const SpaceScene = ({ phase, typingText }) => {
  const codeParticles = useMemo(() => {
    const particles = [];
    const codes = [
      "div",
      "span",
      "import",
      "export",
      "const",
      "function",
      "class",
      "return",
      "if",
      "else",
      "for",
      "while",
      "var",
      "let",
      "async",
      "await",
    ];

    for (let i = 0; i < 20; i++) {
      particles.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 20,
        ],
        code: codes[Math.floor(Math.random() * codes.length)],
      });
    }
    return particles;
  }, []);

  return (
    <>
      {/* Stars Background */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Environment */}
      <Environment preset="night" />

      {/* AI Typing Loader (Phase 1) */}
      {phase === "typing" && (
        <AITypingLoader
          position={[0, 0, 0]}
          text={typingText}
          isTyping={true}
        />
      )}

      {/* 3D Spaceship (Phase 2) */}
      {phase === "spaceship" && (
        <Spaceship position={[0, 0, 0]} rotation={[0, 0, 0]} />
      )}

      {/* Code Particles (Phase 3) */}
      {phase === "particles" && (
        <>
          {codeParticles.map((particle) => (
            <CodeParticle
              key={particle.id}
              position={particle.position}
              code={particle.code}
            />
          ))}
        </>
      )}

      {/* Orbit Controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
};

export default SpaceScene;
