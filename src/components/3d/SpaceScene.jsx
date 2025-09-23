// SpaceScene.jsx
import {
  Box,
  Environment,
  Html,
  OrbitControls,
  Sphere,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* =======================
   GLSL NOISE + HELPERS
   ======================= */
const planetVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec2 vUv;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const NOISE_LIB = /* glsl */ `
  vec3 hash3(vec3 p){
    p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
              dot(p,vec3(269.5,183.3,246.1)),
              dot(p,vec3(113.5,271.9,124.6)));
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
  }

  float noise3D(vec3 p){
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f*f*(3.0-2.0*f);
    return mix( mix( mix( dot( hash3(i+vec3(0.0,0.0,0.0)), f-vec3(0.0,0.0,0.0) ),
                          dot( hash3(i+vec3(1.0,0.0,0.0)), f-vec3(1.0,0.0,0.0) ), u.x),
                     mix( dot( hash3(i+vec3(0.0,1.0,0.0)), f-vec3(0.0,1.0,0.0) ),
                          dot( hash3(i+vec3(1.0,1.0,0.0)), f-vec3(1.0,1.0,0.0) ), u.x), u.y),
                mix( mix( dot( hash3(i+vec3(0.0,0.0,1.0)), f-vec3(0.0,0.0,1.0) ),
                          dot( hash3(i+vec3(1.0,0.0,1.0)), f-vec3(1.0,0.0,1.0) ), u.x),
                     mix( dot( hash3(i+vec3(0.0,1.0,1.0)), f-vec3(0.0,1.0,1.0) ),
                          dot( hash3(i+vec3(1.0,1.0,1.0)), f-vec3(1.0,1.0,1.0) ), u.x), u.y), u.z);
  }

  float fbm(vec3 p){
    float f = 0.0;
    float amp = 0.5;
    for(int i=0;i<5;i++){
      f += amp * noise3D(p);
      p *= 2.02;
      amp *= 0.5;
    }
    return f;
  }
`;

const planetFragment = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec2 vUv;

  uniform float uTime;
  uniform int   uType;         // 0: rocky, 1: gas, 2: ice/water
  uniform vec3  uBase1;
  uniform vec3  uBase2;
  uniform vec3  uAccent;
  uniform float uNoiseScale;
  uniform float uBandFreq;
  uniform float uCloudiness;   // for gas/ice clouds
  uniform vec3  uLightDir;     // scene light
  uniform float uSpecular;
  uniform float uGlow;

  ${NOISE_LIB}

  float fresnel(vec3 n, vec3 v){ return pow(1.0 - max(dot(n, v), 0.0), 2.5); }

  // cylindrical coords (lon/lat) from normal
  vec2 lonlat(vec3 n){
    float lon = atan(n.z, n.x);        // -PI..PI
    float lat = asin(clamp(n.y, -1.0, 1.0)); // -PI/2..PI/2
    return vec2(lon, lat);
  }

  // small normal perturbation to fake bumps (cheap "bump mapping")
  vec3 perturbNormal(vec3 N){
    float h = fbm(N * (uNoiseScale*1.2));
    vec3 grad = vec3(
      fbm(N + vec3(0.01,0.0,0.0)) - h,
      fbm(N + vec3(0.0,0.01,0.0)) - h,
      fbm(N + vec3(0.0,0.0,0.01)) - h
    );
    return normalize(N + grad*0.6); // tweak strength
  }

  void main(){
    vec3 V = normalize(cameraPosition - vWorldPos);
    vec3 N = normalize(vNormal);
    vec2 ll = lonlat(N);
    float lon = ll.x; // -PI..PI
    float lat = ll.y; // -PI/2..PI/2

    // base color by type
    vec3 col;

    if(uType == 0){
      // ROCKY: height map + accent veins
      vec3 PN = perturbNormal(N);
      float h = fbm(PN * uNoiseScale + uTime*0.02);
      float cont = smoothstep(0.35, 0.85, h);
      col = mix(uBase1, uBase2, cont);
      float veins = fbm(PN * (uNoiseScale*2.2) + 3.0);
      col = mix(col, uAccent, smoothstep(0.8, 0.97, veins)*0.35);
      N = PN;
    } else if(uType == 1){
      // GAS GIANT: latitudinal bands with noise perturbation + a cyclonic "spot"
      float band = sin(lat * uBandFreq) * 0.5 + 0.5;
      // swirl over time
      float swirl = fbm(vec3(lat*3.0, lon*2.0 + uTime*0.2, 0.0) * uNoiseScale);
      vec3 bandCol = mix(uBase1, uBase2, band);
      col = mix(bandCol, uAccent, swirl*0.25);

      // Great Red Spot–like feature: gaussian blob drifting
      float spotLon = -1.1 + sin(uTime*0.07)*0.2;
      float spotLat = -0.15 + cos(uTime*0.05)*0.05;
      float d = distance(vec2(lon, lat), vec2(spotLon, spotLat));
      float spot = exp(-pow(d*5.0, 2.0)); // gaussian
      col = mix(col, uAccent*1.2, spot*0.6);
    } else {
      // ICE/WATER: cool gradient + glints + flowing streaks
      float n = fbm(N * (uNoiseScale*0.9) + uTime*0.04);
      col = mix(uBase1, uBase2, n);
      float streak = fbm(vec3(lat*3.5 + uTime*0.1, lon*3.5, 0.0));
      col = mix(col, vec3(1.0), smoothstep(0.7, 1.0, streak)*0.15);
    }

    // moving high clouds overlay (for gas/ice)
    if(uType != 0){
      float clouds = fbm(N * (uNoiseScale*0.7) + vec3(0.0, uTime*0.05, 0.0));
      col += uCloudiness * clouds * 0.12;
    }

    // lighting
    float NdotL = max(dot(N, normalize(uLightDir)), 0.0);
    float spec = pow(max(dot(reflect(-normalize(uLightDir), N), V), 0.0), 24.0) * uSpecular;
    vec3 lit = col * (0.22 + 0.95*NdotL) + spec;

    // rim glow (subtle)
    float rim = fresnel(N, V);
    lit += uGlow * rim * 0.25;

    gl_FragColor = vec4(lit, 1.0);
  }
`;

/* =======================
   ATMOSPHERE (dual layer)
   ======================= */
const atmoVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main(){
    vNormal = normalize(normalMatrix * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const atmoFragment = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  uniform vec3  uColor;
  uniform float uIntensity;

  float fresnel(vec3 n, vec3 v){ return pow(1.0 - max(dot(n, v), 0.0), 3.0); }

  void main(){
    vec3 V = normalize(cameraPosition - vWorldPos);
    float rim = fresnel(normalize(vNormal), V);
    vec3 col = uColor * rim * uIntensity;
    gl_FragColor = vec4(col, rim * uIntensity);
  }
`;

/* =======================
   RING shader (Saturn)
   ======================= */
const ringVertex = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ringFragment = /* glsl */ `
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uTime;
  void main(){
    vec2 c = vUv - 0.5;
    float r = length(c);
    float inner = 0.36;
    float outer = 0.52;
    float alpha = smoothstep(inner, inner+0.02, r) * (1.0 - smoothstep(outer-0.02, outer, r));
    float bands = sin(r * 160.0 + uTime*0.5)*0.1 + 0.9;
    vec3 col = uColor * bands;
    gl_FragColor = vec4(col, alpha * 0.65);
    if(alpha < 0.001) discard;
  }
`;

/* =======================
   Custom Yellow Starfield
   ======================= */
function YellowStars({ count = 6000, radius = 120, size = 0.075 }) {
  const pointsRef = useRef();
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // distribute roughly on a sphere shell
      const r = radius * (0.6 + Math.random() * 0.4);
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      positions[i * 3 + 0] = r * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.cos(theta);
      positions[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi);
    }
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count, radius]);

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color("#ffd166"), // vàng ấm
        size,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      }),
    [size]
  );

  // subtle twinkle
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pointsRef.current) {
      mat.opacity = 0.85 + Math.sin(t * 0.8) * 0.1;
    }
  });

  return <points ref={pointsRef} geometry={geom} material={mat} />;
}

/* =======================
   AI Typing Loader (giữ)
   ======================= */
const AITypingLoader = ({ position, text, isTyping }) => {
  const meshRef = useRef();
  const particlesRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, i) => {
        particle.position.y = Math.sin(state.clock.elapsedTime * 2 + i) * 0.2;
      });
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <Sphere args={[0.6, 32, 32]}>
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.9}
        />
      </Sphere>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.2, 32]} />
        <meshBasicMaterial
          color="#00f5ff"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
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

      {/* HUD giữ nguyên — nếu không cần, bạn có thể tắt phần Html này */}
      <Html distanceFactor={8} position={[0, -1.2, 0]} center>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-neon-blue/20 via-transparent to-neon-purple/20 rounded-2xl"></div>
          <div className="relative bg-black/40 backdrop-blur-md border border-neon-blue/30 rounded-2xl p-6 min-w-[350px] text-center shadow-neon">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 via-neon-purple/10 to-neon-green/10 rounded-2xl blur-sm"></div>
            <div className="relative z-10">
              <div className="text-neon-blue text-xl font-bold mb-3 tracking-wide">
                {isTyping ? `${text}|` : text}
              </div>
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

/* =======================
   Spaceship (giữ)
   ======================= */
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
      <Box args={[2, 0.5, 0.3]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#bf00ff"
          emissive="#bf00ff"
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </Box>
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

/* =======================
   ProceduralPlanet (thật hơn + luôn có atmosphere)
   ======================= */
function ProceduralPlanet({
  type = "rocky", // 'rocky' | 'gas' | 'ice'
  radius = 0.5,
  base1 = "#6e604b",
  base2 = "#c0a080",
  accent = "#3b2f2f",
  noiseScale = 4.0,
  bandFreq = 24.0,
  cloudiness = 0.6,
  atmosphereColor = "#6cc6ff",
  atmosphereIntensity = 0.85, // tăng quầng
  ring = false,
  ringColor = "#e6d7a8",
  position = [0, 0, 0],
}) {
  const planetRef = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uType: { value: type === "rocky" ? 0 : type === "gas" ? 1 : 2 },
      uBase1: { value: new THREE.Color(base1) },
      uBase2: { value: new THREE.Color(base2) },
      uAccent: { value: new THREE.Color(accent) },
      uNoiseScale: { value: noiseScale },
      uBandFreq: { value: bandFreq },
      uCloudiness: { value: cloudiness },
      uLightDir: { value: new THREE.Vector3(1, 0.6, 0.2).normalize() },
      uSpecular: { value: type === "rocky" ? 0.5 : 0.3 },
      uGlow: { value: 0.9 }, // tăng glow ở viền
    }),
    [type, base1, base2, accent, noiseScale, bandFreq, cloudiness]
  );

  const atmoUniformsInner = useMemo(
    () => ({
      uColor: { value: new THREE.Color(atmosphereColor) },
      uIntensity: { value: atmosphereIntensity },
    }),
    [atmosphereColor, atmosphereIntensity]
  );

  const atmoUniformsOuter = useMemo(
    () => ({
      uColor: { value: new THREE.Color(atmosphereColor) },
      uIntensity: { value: atmosphereIntensity * 0.5 },
    }),
    [atmosphereColor, atmosphereIntensity]
  );

  const ringUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(ringColor) },
      uTime: { value: 0 },
    }),
    [ringColor]
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    ringUniforms.uTime.value = state.clock.elapsedTime;
    if (planetRef.current) planetRef.current.rotation.y += 0.005;
  });

  return (
    <group position={position}>
      {/* Planet core */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[radius, 128, 128]} />
        <shaderMaterial
          vertexShader={planetVertex}
          fragmentShader={planetFragment}
          uniforms={uniforms}
          transparent={false}
        />
      </mesh>

      {/* Atmosphere inner (BackSide) */}
      <mesh scale={[1.04, 1.04, 1.04]}>
        <sphereGeometry args={[radius, 96, 96]} />
        <shaderMaterial
          vertexShader={atmoVertex}
          fragmentShader={atmoFragment}
          uniforms={atmoUniformsInner}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Atmosphere outer (FrontSide) – tán xạ xa hơn */}
      <mesh scale={[1.08, 1.08, 1.08]}>
        <sphereGeometry args={[radius, 96, 96]} />
        <shaderMaterial
          vertexShader={atmoVertex}
          fragmentShader={atmoFragment}
          uniforms={atmoUniformsOuter}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Rings (for Saturn-like) */}
      {ring && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 1.5, radius * 2.4, 160, 1]} />
          <shaderMaterial
            vertexShader={ringVertex}
            fragmentShader={ringFragment}
            uniforms={ringUniforms}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.NormalBlending}
          />
        </mesh>
      )}
    </group>
  );
}

/* =======================
   Presets
   ======================= */
const PRESETS = [
  // Mercury
  {
    type: "rocky",
    radius: 0.42,
    base1: "#7c756d",
    base2: "#b8b2ab",
    accent: "#4b4641",
    noiseScale: 6.2,
  },
  // Venus (mây dày + vàng)
  {
    type: "rocky",
    radius: 0.5,
    base1: "#b98d4d",
    base2: "#e8c885",
    accent: "#8a5f2b",
    noiseScale: 3.2,
  },
  // Earth-like (xanh + mây)
  {
    type: "ice",
    radius: 0.56,
    base1: "#2066a8",
    base2: "#6fc3ff",
    accent: "#2fa36e",
    noiseScale: 2.4,
  },
  // Mars (đỏ)
  {
    type: "rocky",
    radius: 0.48,
    base1: "#8d3a2b",
    base2: "#d3693a",
    accent: "#4a1f18",
    noiseScale: 4.5,
  },
  // Jupiter (gas bands + spot)
  {
    type: "gas",
    radius: 1.05,
    base1: "#caa888",
    base2: "#f3e1cc",
    accent: "#a76e3f",
    noiseScale: 2.0,
    bandFreq: 32.0,
  },
  // Saturn (gas + ring)
  {
    type: "gas",
    radius: 0.95,
    base1: "#d9c08c",
    base2: "#ffe9b8",
    accent: "#b99458",
    noiseScale: 1.8,
    bandFreq: 28.0,
    ring: true,
  },
  // Uranus (ice/turquoise)
  {
    type: "ice",
    radius: 0.66,
    base1: "#86f0f0",
    base2: "#bffefe",
    accent: "#6cdede",
    noiseScale: 2.2,
  },
  // Neptune (blue ice)
  {
    type: "ice",
    radius: 0.64,
    base1: "#3a59d1",
    base2: "#6a8bff",
    accent: "#2b3fa4",
    noiseScale: 2.8,
  },
];

/* =======================
   Main Scene
   ======================= */
const SpaceScene = ({ phase, typingText }) => {
  // build floating planets
  const planets = useMemo(() => {
    const items = [];
    for (let i = 0; i < 12; i++) {
      const p = PRESETS[Math.floor(Math.random() * PRESETS.length)];
      items.push({
        id: i,
        preset: p,
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 20,
        ],
      });
    }
    return items;
  }, []);

  const groupRef = useRef();
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, idx) => {
      child.position.y +=
        Math.sin(state.clock.elapsedTime * 0.6 + idx) * 0.0018;
      child.rotation.y += 0.0008;
    });
  });

  return (
    <>
      {/* Yellow Starfield (to & vàng) */}
      <YellowStars count={6500} radius={140} size={0.11} />

      {/* soft HDRI */}
      <Environment preset="night" />

      {/* AI Typing */}
      {phase === "typing" && (
        <AITypingLoader
          position={[0, 0, 0]}
          text={typingText}
          isTyping={true}
        />
      )}

      {/* Spaceship */}
      {phase === "spaceship" && (
        <Spaceship position={[0, 0, 0]} rotation={[0, 0, 0]} />
      )}

      {/* Procedural Planets (no label, all with atmosphere) */}
      {phase === "particles" && (
        <group ref={groupRef}>
          {planets.map(({ id, preset, position }) => (
            <ProceduralPlanet
              key={id}
              type={preset.type}
              radius={preset.radius}
              base1={preset.base1}
              base2={preset.base2}
              accent={preset.accent}
              noiseScale={preset.noiseScale}
              bandFreq={preset.bandFreq ?? 24.0}
              cloudiness={
                preset.type === "gas" || preset.type === "ice" ? 0.85 : 0.45
              }
              atmosphereColor={
                preset.type === "ice"
                  ? "#8ad6ff"
                  : preset.type === "gas"
                  ? "#ffd2a1"
                  : "#6cc6ff"
              }
              atmosphereIntensity={0.95}
              ring={preset.ring ?? false}
              ringColor={preset.type === "gas" ? "#eeddb3" : "#cfd9ff"}
              position={position}
            />
          ))}
        </group>
      )}

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
