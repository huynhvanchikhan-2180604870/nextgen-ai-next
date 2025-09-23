import { Box, Html, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { memo, useRef, useState } from "react";
import * as THREE from "three";

const EnhancedPlanet = ({
  position,
  project,
  onClick,
  isHovered,
  isSelected,
  cameraDistance = 20,
}) => {
  const meshRef = useRef();
  const glowRef = useRef();
  const ringRef = useRef();
  const thumbnailRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(false);

  useFrame((state) => {
    // Calculate distance from camera (optimized)
    const cameraPosition = state.camera.position;
    const dx = cameraPosition.x - position[0];
    const dy = cameraPosition.y - position[1];
    const dz = cameraPosition.z - position[2];
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // Show thumbnail when camera is close
    const shouldShowThumbnail = distance < 8;
    if (shouldShowThumbnail !== showThumbnail) {
      setShowThumbnail(shouldShowThumbnail);
    }

    if (meshRef.current) {
      // Optimized rotation
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;

      // Optimized floating motion
      const time = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y =
        position[1] + Math.sin(time + position[0]) * 0.3;
      meshRef.current.position.x =
        position[0] + Math.sin(time * 0.5 + position[2]) * 0.15;
      meshRef.current.position.z =
        position[2] + Math.cos(time * 0.3 + position[1]) * 0.1;

      // Scale effect
      if (hovered || isHovered || isSelected) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.08);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.08);
      }
    }

    if (glowRef.current) {
      glowRef.current.rotation.y += 0.005;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      glowRef.current.scale.setScalar(scale);
    }

    if (ringRef.current) {
      ringRef.current.rotation.y += 0.003;
    }
  });

  const getPlanetColor = (category) => {
    const colors = {
      React: "#61dafb",
      Vue: "#4fc08d",
      Angular: "#dd0031",
      "Node.js": "#68a063",
      Python: "#3776ab",
      AI: "#ff6b6b",
      Mobile: "#f39c12",
      Web: "#45b7d1",
      "React Native": "#61dafb",
      "E-commerce": "#00ff88",
      "Admin Dashboard": "#6366f1",
      Default: "#8b5cf6",
    };
    return colors[category] || colors.Default;
  };

  const getPlanetType = (type) => {
    return type === "cube" ? "cube" : "sphere";
  };

  // Handle different data structures from API
  const category = project.category || project.productType || "Default";
  const planetColor = getPlanetColor(category);
  const isPlanet = getPlanetType(project.type) === "sphere";

  const handleClick = (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    console.log("Planet clicked:", project.title);
    onClick(project);
  };

  return (
    <group
      position={position}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Outer Glow Ring */}
      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.8, 2.2, 32]} />
          <meshBasicMaterial
            color={planetColor}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Glow Effect */}
      <group ref={glowRef}>
        {isPlanet ? (
          <Sphere args={[1.2, 32, 32]}>
            <meshBasicMaterial color={planetColor} transparent opacity={0.2} />
          </Sphere>
        ) : (
          <Box args={[1.5, 1.5, 1.5]}>
            <meshBasicMaterial color={planetColor} transparent opacity={0.2} />
          </Box>
        )}
      </group>

      {/* Main Planet */}
      <group ref={meshRef}>
        {isPlanet ? (
          <Sphere args={[1, 32, 32]}>
            <meshStandardMaterial
              color={planetColor}
              emissive={planetColor}
              emissiveIntensity={0.3}
              metalness={0.8}
              roughness={0.2}
            />
          </Sphere>
        ) : (
          <Box args={[1.2, 1.2, 1.2]}>
            <meshStandardMaterial
              color={planetColor}
              emissive={planetColor}
              emissiveIntensity={0.3}
              metalness={0.8}
              roughness={0.2}
            />
          </Box>
        )}

        {/* Surface Details */}
        {isPlanet && (
          <>
            {/* Craters */}
            <Sphere args={[0.1, 8, 8]} position={[0.7, 0.3, 0.5]}>
              <meshStandardMaterial
                color="#000000"
                emissive="#000000"
                emissiveIntensity={0.1}
              />
            </Sphere>
            <Sphere args={[0.05, 8, 8]} position={[-0.5, -0.2, 0.8]}>
              <meshStandardMaterial
                color="#000000"
                emissive="#000000"
                emissiveIntensity={0.1}
              />
            </Sphere>

            {/* Tech Lines */}
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <ringGeometry args={[0.8, 1.0, 16]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={0.2}
                transparent
                opacity={0.6}
                side={THREE.DoubleSide}
              />
            </mesh>
          </>
        )}

        {/* Cube Details */}
        {!isPlanet && (
          <>
            {/* Corner Lights */}
            <Box args={[0.1, 0.1, 0.1]} position={[0.6, 0.6, 0.6]}>
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={0.8}
              />
            </Box>
            <Box args={[0.1, 0.1, 0.1]} position={[-0.6, 0.6, 0.6]}>
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={0.8}
              />
            </Box>
            <Box args={[0.1, 0.1, 0.1]} position={[0.6, -0.6, 0.6]}>
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={0.8}
              />
            </Box>
            <Box args={[0.1, 0.1, 0.1]} position={[-0.6, -0.6, 0.6]}>
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={0.8}
              />
            </Box>
          </>
        )}
      </group>

      {/* Thumbnail Overlay when close */}
      {showThumbnail && (
        <Html position={[0, 0, 0]} center distanceFactor={3} occlude>
          <div className="bg-black/90 backdrop-blur-md border border-neon-blue/50 rounded-xl p-4 w-64 shadow-2xl">
            <div className="aspect-video bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-lg mb-3 flex items-center justify-center">
              <div className="text-4xl">🚀</div>
            </div>
            <h3 className="text-neon-blue font-bold text-lg mb-2">
              {project.title}
            </h3>
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
              {project.description}
            </p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-neon-green font-bold text-xl">
                ${project.price}
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">★</span>
                <span className="text-white">
                  {typeof project.rating === "object"
                    ? project.rating?.average || 0
                    : project.rating || 0}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {project.techStack?.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-neon-blue/20 text-neon-blue text-xs rounded-full border border-neon-blue/30"
                >
                  {tech}
                </span>
              ))}
            </div>
            <button
              onClick={handleClick}
              className="w-full bg-neon-blue text-black font-bold py-2 px-4 rounded-lg hover:bg-neon-blue/80 transition-colors"
            >
              View Details
            </button>
          </div>
        </Html>
      )}

      {/* Project Info Overlay - only when not showing thumbnail */}
      {!showThumbnail && (hovered || isHovered || isSelected) && (
        <Html position={[0, 2, 0]} center distanceFactor={8} occlude>
          <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3 min-w-[200px]">
            <h3 className="text-white font-bold text-sm mb-1">
              {project.title}
            </h3>
            <p className="text-gray-300 text-xs mb-2 line-clamp-2">
              {project.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-neon-blue font-bold">${project.price}</span>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">★</span>
                <span className="text-white text-xs">
                  {typeof project.rating === "object"
                    ? project.rating?.average || 0
                    : project.rating || 0}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {project.techStack?.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white/10 text-white text-xs rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </Html>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <Html position={[0, -1.5, 0]} center>
          <div className="text-neon-blue font-bold text-sm animate-pulse">
            ✓ Selected
          </div>
        </Html>
      )}
    </group>
  );
};

export default memo(EnhancedPlanet);
