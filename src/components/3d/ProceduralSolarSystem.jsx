// ProceduralSolarSystem.jsx
import { Environment, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* ================================
   GLSL helpers: value noise + fbm
=================================== */
const NOISE = /* glsl */ `
  float hash(vec3 p){
    return fract(sin(dot(p, vec3(17.1, 23.7, 91.3))) * 43758.5453);
  }
  float noise(vec3 p){
    vec3 i = floor(p);
    vec3 f = fract(p);
    float n = mix(mix(mix(hash(i+vec3(0,0,0)), hash(i+vec3(1,0,0)), f.x),
                       mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
                  mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
                       mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);
    return n;
  }
  float fbm(vec3 p){
    float f = 0.0;
    float a = 0.5;
    for(int i=0;i<6;i++){
      f += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return f;
  }
  vec2 lonlat(vec3 n){
    float lon = atan(n.z, n.x);
    float lat = asin(clamp(n.y, -1.0, 1.0));
    return vec2(lon, lat);
  }
  float fresnel(vec3 n, vec3 v, float powK){
    return pow(1.0 - max(dot(n, v), 0.0), powK);
  }
`;

/* ================================
   Planet core shader (type-driven)
   uType:
   0 Mercury(rocky), 1 Venus(rocky-cloud), 2 Earth, 3 Mars,
   4 Jupiter(gas), 5 Saturn(gas), 6 Uranus(ice), 7 Neptune(ice)
=================================== */
const planetVert = /* glsl */ `
  varying vec3 vN;
  varying vec3 vWP;
  void main(){
    vN = normalize(normalMatrix * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWP = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const planetFrag = /* glsl */ `
  varying vec3 vN;
  varying vec3 vWP;
  uniform float uTime;
  uniform int   uType;
  uniform vec3  uLightDir;

  // color knobs (per type) injected from JS
  uniform vec3  uBase1;
  uniform vec3  uBase2;
  uniform vec3  uAccent;

  uniform float uNoiseScale;
  uniform float uBands;      // for gas giants
  uniform float uCloudAmt;   // clouds/intensity
  uniform float uSpecular;
  uniform float uGamma;      // overall curve

  ${NOISE}

  // cheap bump via normal perturbation
  vec3 perturb(vec3 N, float k){
    float h = fbm(N * uNoiseScale);
    vec3 g = vec3(
      fbm(N + vec3(0.01,0.0,0.0)) - h,
      fbm(N + vec3(0.0,0.01,0.0)) - h,
      fbm(N + vec3(0.0,0.0,0.01)) - h
    );
    return normalize(N + g * k);
  }

  void main(){
    vec3 V = normalize(cameraPosition - vWP);
    vec3 N = normalize(vN);
    vec2 ll = lonlat(N);
    float lon = ll.x, lat = ll.y;

    vec3 col;

    if(uType==0){
      // MERCURY: đá xám + nhiều crater
      vec3 PN = perturb(N, 0.9);
      float h = fbm(PN * uNoiseScale + uTime*0.01);
      col = mix(uBase1, uBase2, smoothstep(0.25, 0.85, h));
      float pits = fbm(PN * (uNoiseScale*3.0) + 7.0);
      col = mix(col, uAccent, smoothstep(0.82, 0.97, pits)*0.45);
      N = PN;
    } else if(uType==1){
      // VENUS: mây dày vàng, bề mặt mờ sau mây
      float m = fbm(N * (uNoiseScale*0.9) + uTime*0.02);
      col = mix(uBase1, uBase2, m);
      float dense = fbm(N * (uNoiseScale*1.6) + vec3(0.0,uTime*0.03,0.0));
      col += uCloudAmt * dense * 0.2;
    } else if(uType==2){
      // EARTH: đại dương + lục địa + mây + băng cực
      vec3 PN = perturb(N, 0.6);
      float h = fbm(PN * (uNoiseScale*0.9));
      float cont = smoothstep(0.48, 0.58, h);        // đất
      vec3 ocean = uBase1;                           // xanh đậm
      vec3 land  = uBase2;                           // xanh lá/đất
      col = mix(ocean, land, cont);
      // băng cực
      float ice = smoothstep(0.72, 0.95, abs(N.y));
      col = mix(col, vec3(1.0), ice*0.35);
      // mây động
      float cloud = fbm(N * 12.0 + vec3(0.0,uTime*0.05,0.0));
      col += uCloudAmt * cloud * 0.12;
      N = PN;
    } else if(uType==3){
      // MARS: đỏ khô + canyons
      vec3 PN = perturb(N, 0.8);
      float h = fbm(PN * uNoiseScale + uTime*0.01);
      col = mix(uBase1, uBase2, smoothstep(0.3, 0.8, h));
      float cany = fbm(PN * (uNoiseScale*2.2) + 4.0);
      col = mix(col, uAccent, smoothstep(0.78, 0.95, cany)*0.35);
      N = PN;
    } else if(uType==4){
      // JUPITER: band theo vĩ độ + swirl + Great Red Spot
      float band = sin(lat * uBands)*0.5 + 0.5;
      vec3 base = mix(uBase1, uBase2, band);
      float swirl = fbm(vec3(lat*3.0, lon*2.0 + uTime*0.2, 0.0) * uNoiseScale);
      col = mix(base, uAccent, swirl*0.22);
      float sLon = -1.1 + sin(uTime*0.07)*0.2;
      float sLat = -0.18 + cos(uTime*0.05)*0.06;
      float d    = distance(vec2(lon,lat), vec2(sLon,sLat));
      float spot = exp(-pow(d*5.0, 2.0));
      col = mix(col, uAccent*1.25, spot*0.7);
    } else if(uType==5){
      // SATURN: band nhẹ + mịn
      float band = sin(lat * uBands)*0.5 + 0.5;
      float swirl = fbm(vec3(lat*2.2, lon*2.0 + uTime*0.15, 0.0) * uNoiseScale);
      vec3 base   = mix(uBase1, uBase2, band);
      col = mix(base, uAccent, swirl*0.18);
    } else if(uType==6){
      // URANUS: mịn xanh ngọc + streak lạnh
      float n = fbm(N * (uNoiseScale*0.7) + uTime*0.03);
      col = mix(uBase1, uBase2, n*0.6 + 0.2);
      float streak = fbm(vec3(lat*3.5 + uTime*0.06, lon*3.5, 0.0));
      col = mix(col, vec3(1.0), smoothstep(0.74, 1.0, streak)*0.12);
    } else {
      // NEPTUNE: xanh đậm + streak khí mạnh hơn
      float n = fbm(N * (uNoiseScale*0.9) + uTime*0.04);
      col = mix(uBase1, uBase2, n*0.7 + 0.15);
      float streak = fbm(vec3(lat*4.2 + uTime*0.08, lon*3.8, 0.0));
      col = mix(col, vec3(0.9,0.95,1.0), smoothstep(0.76, 1.0, streak)*0.18);
    }

    // lighting
    vec3 L = normalize(uLightDir);
    float diff = max(dot(N, L), 0.0);
    float spec = pow(max(dot(reflect(-L,N), V), 0.0), 24.0) * uSpecular;
    vec3 lit = col * (0.22 + 0.95*diff) + spec;

    // gamma-ish curve
    lit = pow(lit, vec3(uGamma));

    gl_FragColor = vec4(lit, 1.0);
  }
`;

/* ================================
   Atmosphere dual-layer shader
=================================== */
const atmoVert = /* glsl */ `
  varying vec3 vN; varying vec3 vWP;
  void main(){
    vN = normalize(normalMatrix * normal);
    vec4 wp = modelMatrix * vec4(position,1.0);
    vWP = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
const atmoFrag = /* glsl */ `
  varying vec3 vN; varying vec3 vWP;
  uniform vec3  uColor;
  uniform float uIntensity;
  ${NOISE}
  void main(){
    vec3 V = normalize(cameraPosition - vWP);
    float rim = fresnel(normalize(vN), V, 3.0);
    // chút nhiễu để quầng "sống"
    float n = fbm(normalize(vN)*3.0);
    vec3 col = uColor * (rim*(uIntensity*(0.85 + 0.15*n)));
    gl_FragColor = vec4(col, rim * uIntensity);
  }
`;

/* ================================
   Saturn ring (procedural bands)
=================================== */
const ringVert = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`;
const ringFrag = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3  uColor;
  void main(){
    vec2 c = vUv - 0.5;
    float r = length(c);
    float inner = 0.38;
    float outer = 0.56;
    float alpha = smoothstep(inner, inner+0.02, r) * (1.0 - smoothstep(outer-0.02, outer, r));
    // bands + shimmer
    float bands = sin(r*160.0 + uTime*0.4)*0.08 + 0.92;
    vec3 col = uColor * bands;
    gl_FragColor = vec4(col, alpha*0.7);
    if(alpha < 0.002) discard;
  }
`;

/* ================================
   Yellow starfield (big, golden)
=================================== */
function YellowStarfield({
  count = 8000,
  radius = 160,
  size = 0.12,
  color = "#ffd166",
}) {
  const pointsRef = useRef();
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius * (0.7 + Math.random() * 0.3);
      const th = Math.acos(2 * Math.random() - 1);
      const ph = Math.random() * Math.PI * 2;
      pos[i * 3 + 0] = r * Math.sin(th) * Math.cos(ph);
      pos[i * 3 + 1] = r * Math.cos(th);
      pos[i * 3 + 2] = r * Math.sin(th) * Math.sin(ph);
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count, radius]);
  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color(color),
        size,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
      }),
    [size, color]
  );
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pointsRef.current) {
      mat.opacity = 0.85 + Math.sin(t * 0.6) * 0.1;
    }
  });
  return <points ref={pointsRef} geometry={geom} material={mat} />;
}

/* ================================
   Planet component (shader-driven)
=================================== */
function Planet({
  typeIndex,
  radius = 1,
  position = [0, 0, 0],
  colors, // {base1, base2, accent, atmo}
  bands = 28,
  noiseScale = 3.0,
  cloudAmt = 0.6,
  specular = 0.35,
  gamma = 1.0,
  ring = false,
  ringColor = "#eeddb3",
}) {
  const meshRef = useRef();
  const ringRef = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uType: { value: typeIndex },
      uLightDir: { value: new THREE.Vector3(1, 0.5, 0.25).normalize() },
      uBase1: { value: new THREE.Color(colors.base1) },
      uBase2: { value: new THREE.Color(colors.base2) },
      uAccent: { value: new THREE.Color(colors.accent) },
      uNoiseScale: { value: noiseScale },
      uBands: { value: bands },
      uCloudAmt: { value: cloudAmt },
      uSpecular: { value: specular },
      uGamma: { value: gamma },
    }),
    [typeIndex, colors, noiseScale, bands, cloudAmt, specular, gamma]
  );

  const atmoIn = useMemo(
    () => ({
      uColor: { value: new THREE.Color(colors.atmo) },
      uIntensity: { value: 0.85 },
    }),
    [colors.atmo]
  );
  const atmoOut = useMemo(
    () => ({
      uColor: { value: new THREE.Color(colors.atmo) },
      uIntensity: { value: 0.45 },
    }),
    [colors.atmo]
  );

  const ringUni = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(ringColor) },
    }),
    [ringColor]
  );

  useFrame((s) => {
    uniforms.uTime.value = s.clock.elapsedTime;
    ringUni.uTime.value = s.clock.elapsedTime;
    if (meshRef.current) meshRef.current.rotation.y += 0.0035;
  });

  return (
    <group position={position}>
      {/* Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 128, 128]} />
        <shaderMaterial
          vertexShader={planetVert}
          fragmentShader={planetFrag}
          uniforms={uniforms}
        />
      </mesh>

      {/* Atmosphere (two shells) */}
      <mesh scale={[1.06, 1.06, 1.06]}>
        <sphereGeometry args={[radius, 96, 96]} />
        <shaderMaterial
          vertexShader={atmoVert}
          fragmentShader={atmoFrag}
          uniforms={atmoIn}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[radius, 96, 96]} />
        <shaderMaterial
          vertexShader={atmoVert}
          fragmentShader={atmoFrag}
          uniforms={atmoOut}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Rings for Saturn */}
      {ring && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 1.6, radius * 2.7, 180, 1]} />
          <shaderMaterial
            vertexShader={ringVert}
            fragmentShader={ringFrag}
            uniforms={ringUni}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

/* ================================
   Presets for real planets
   (sizes & spacing scaled for scene)
=================================== */
// Approx radius scale (Earth=1)
const SCALE = {
  Mercury: 0.38,
  Venus: 0.95,
  Earth: 1.0,
  Mars: 0.53,
  Jupiter: 11.2 / 10,
  Saturn: 9.4 / 10,
  Uranus: 4.0 / 10,
  Neptune: 3.9 / 10,
};
// X positions (in scene units) so chúng không dính nhau
const POS = [-26, -18, -10, -4, 6, 15, 23, 31];

const PALETTE = {
  Mercury: {
    base1: "#7c756d",
    base2: "#bcb6ad",
    accent: "#4a4541",
    atmo: "#cfd2d6",
  },
  Venus: {
    base1: "#c39a57",
    base2: "#efd08a",
    accent: "#996f33",
    atmo: "#ffdcae",
  },
  Earth: {
    base1: "#134b88",
    base2: "#2fa36e",
    accent: "#1a6f3f",
    atmo: "#78c9ff",
  },
  Mars: {
    base1: "#8d3a2b",
    base2: "#d3693a",
    accent: "#4a1f18",
    atmo: "#ff8a64",
  },
  Jupiter: {
    base1: "#caa888",
    base2: "#f3e1cc",
    accent: "#a76e3f",
    atmo: "#ffd2a1",
  },
  Saturn: {
    base1: "#d9c08c",
    base2: "#ffe9b8",
    accent: "#b99458",
    atmo: "#fff2cf",
  },
  Uranus: {
    base1: "#8eeaea",
    base2: "#c3ffff",
    accent: "#6edcdc",
    atmo: "#b8ffff",
  },
  Neptune: {
    base1: "#3557ce",
    base2: "#6a8bff",
    accent: "#2b3fa4",
    atmo: "#77b8ff",
  },
};

/* ================================
   Main scene
=================================== */
export default function ProceduralSolarSystem() {
  const planets = useMemo(
    () => [
      {
        name: "Mercury",
        type: 0,
        radius: SCALE.Mercury,
        x: POS[0],
        bands: 0,
        ns: 6.0,
        cloud: 0.0,
        spec: 0.4,
        gamma: 1.0,
        ring: false,
        colors: PALETTE.Mercury,
      },
      {
        name: "Venus",
        type: 1,
        radius: SCALE.Venus,
        x: POS[1],
        bands: 0,
        ns: 3.4,
        cloud: 0.9,
        spec: 0.25,
        gamma: 1.0,
        ring: false,
        colors: PALETTE.Venus,
      },
      {
        name: "Earth",
        type: 2,
        radius: SCALE.Earth,
        x: POS[2],
        bands: 0,
        ns: 2.6,
        cloud: 0.8,
        spec: 0.45,
        gamma: 1.0,
        ring: false,
        colors: PALETTE.Earth,
      },
      {
        name: "Mars",
        type: 3,
        radius: SCALE.Mars,
        x: POS[3],
        bands: 0,
        ns: 4.2,
        cloud: 0.2,
        spec: 0.35,
        gamma: 1.0,
        ring: false,
        colors: PALETTE.Mars,
      },
      {
        name: "Jupiter",
        type: 4,
        radius: SCALE.Jupiter,
        x: POS[4],
        bands: 34,
        ns: 2.0,
        cloud: 0.55,
        spec: 0.3,
        gamma: 1.0,
        ring: false,
        colors: PALETTE.Jupiter,
      },
      {
        name: "Saturn",
        type: 5,
        radius: SCALE.Saturn,
        x: POS[5],
        bands: 30,
        ns: 1.8,
        cloud: 0.5,
        spec: 0.28,
        gamma: 1.0,
        ring: true,
        colors: PALETTE.Saturn,
      },
      {
        name: "Uranus",
        type: 6,
        radius: SCALE.Uranus,
        x: POS[6],
        bands: 0,
        ns: 2.2,
        cloud: 0.75,
        spec: 0.25,
        gamma: 1.0,
        ring: false,
        colors: PALETTE.Uranus,
      },
      {
        name: "Neptune",
        type: 7,
        radius: SCALE.Neptune,
        x: POS[7],
        bands: 0,
        ns: 2.7,
        cloud: 0.85,
        spec: 0.25,
        gamma: 1.0,
        ring: false,
        colors: PALETTE.Neptune,
      },
    ],
    []
  );

  // group wave to make nhẹ nhàng
  const groupRef = useRef();
  useFrame((s) => {
    if (!groupRef.current) return;
    const t = s.clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      child.position.y = Math.sin(t * 0.4 + i * 0.7) * 0.15;
    });
  });

  return (
    <>
      {/* vàng, to hơn */}
      <YellowStarfield count={9000} radius={170} size={0.14} color="#ffd166" />

      {/* Ánh sáng & môi trường */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[20, 15, 10]} intensity={1.2} />
      <Environment preset="night" />

      {/* Hệ hành tinh: giãn cách theo trục X, không dính nhau */}
      <group ref={groupRef}>
        {planets.map((p, idx) => (
          <Planet
            key={idx}
            typeIndex={p.type}
            radius={p.radius * 1.2} // scale nhẹ cho đã mắt
            position={[p.x, 0, 0]}
            colors={p.colors}
            bands={p.bands}
            noiseScale={p.ns}
            cloudAmt={p.cloud}
            specular={p.spec}
            gamma={p.gamma}
            ring={p.ring}
          />
        ))}
      </group>

      {/* Điều khiển */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.35}
      />
    </>
  );
}
