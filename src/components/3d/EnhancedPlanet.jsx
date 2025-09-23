import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { memo, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* =======================
   PRESETS (8 hành tinh)
   ======================= */
const PLANET_PRESETS = [
  {
    name: "Mercury",
    type: "rocky",
    base1: "#7c756d",
    base2: "#b8b2ab",
    accent: "#4b4641",
    atmo: "#888888",
    noiseScale: 6.0,
  },
  {
    name: "Venus",
    type: "rocky",
    base1: "#b98d4d",
    base2: "#e8c885",
    accent: "#8a5f2b",
    atmo: "#f0c878",
    noiseScale: 3.2,
  },
  {
    name: "Earth",
    type: "ice",
    base1: "#2066a8",
    base2: "#6fc3ff",
    accent: "#2fa36e",
    atmo: "#6cc6ff",
    noiseScale: 2.4,
  },
  {
    name: "Mars",
    type: "rocky",
    base1: "#8d3a2b",
    base2: "#d3693a",
    accent: "#4a1f18",
    atmo: "#ff7744",
    noiseScale: 4.5,
  },
  {
    name: "Jupiter",
    type: "gas",
    base1: "#caa888",
    base2: "#f3e1cc",
    accent: "#a76e3f",
    atmo: "#ffcc88",
    noiseScale: 2.0,
    bandFreq: 32,
  },
  {
    name: "Saturn",
    type: "gas",
    base1: "#d9c08c",
    base2: "#ffe9b8",
    accent: "#b99458",
    atmo: "#ffd2a1",
    noiseScale: 1.8,
    bandFreq: 28,
    ring: true,
  },
  {
    name: "Uranus",
    type: "ice",
    base1: "#86f0f0",
    base2: "#bffefe",
    accent: "#6cdede",
    atmo: "#aefbff",
    noiseScale: 2.2,
  },
  {
    name: "Neptune",
    type: "ice",
    base1: "#3a59d1",
    base2: "#6a8bff",
    accent: "#2b3fa4",
    atmo: "#88aaff",
    noiseScale: 2.8,
  },
];

/* =======================
   SHADERS
   ======================= */
const planetVertex = /* glsl */ `
  varying vec3 vNormal; varying vec3 vWorldPos;
  void main(){
    vNormal = normalize(normalMatrix * normal);
    vec4 wp = modelMatrix * vec4(position,1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
const NOISE = /* glsl */ `
  float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
  float noise(vec3 p){
    vec3 i=floor(p); vec3 f=fract(p);
    vec3 u=f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(i+vec3(0,0,0)),hash(i+vec3(1,0,0)),u.x),
                   mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),u.x),u.y),
               mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),u.x),
                   mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),u.x),u.y),u.z);
  }
  float fbm(vec3 p){
    float f=0.0,a=0.5;
    for(int i=0;i<5;i++){f+=a*noise(p);p*=2.02;a*=0.5;}
    return f;
  }
`;
const planetFragment = /* glsl */ `
  varying vec3 vNormal; varying vec3 vWorldPos;
  uniform float uTime; uniform int uType;
  uniform vec3 uBase1,uBase2,uAccent;
  uniform float uNoiseScale,uBandFreq,uCloudiness;
  uniform vec3 uLightDir;
  ${NOISE}
  void main(){
    vec3 V=normalize(cameraPosition-vWorldPos);
    vec3 N=normalize(vNormal);
    vec3 col;
    if(uType==0){
      float h=fbm(N*uNoiseScale+uTime*0.02);
      col=mix(uBase1,uBase2,smoothstep(0.35,0.85,h));
      col=mix(col,uAccent,fbm(N*uNoiseScale*2.2)*0.3);
    } else if(uType==1){
      float lat=asin(N.y);
      float band=sin(lat*uBandFreq)*0.5+0.5;
      vec3 bandCol=mix(uBase1,uBase2,band);
      float swirl=fbm(vec3(lat*3.0,uTime*0.2,0.0)*uNoiseScale);
      col=mix(bandCol,uAccent,swirl*0.25);
    } else {
      float n=fbm(N*uNoiseScale+uTime*0.04);
      col=mix(uBase1,uBase2,n);
    }
    if(uType!=0){
      float clouds=fbm(N*uNoiseScale*0.7+vec3(0,uTime*0.05,0));
      col+=uCloudiness*clouds*0.12;
    }
    float NdotL=max(dot(N,normalize(uLightDir)),0.0);
    col*=0.25+0.9*NdotL;
    gl_FragColor=vec4(col,1.0);
  }
`;
const atmoFragment = /* glsl */ `
  varying vec3 vNormal; varying vec3 vWorldPos;
  uniform vec3 uColor; uniform float uIntensity;
  float fresnel(vec3 n,vec3 v){return pow(1.0-max(dot(n,v),0.0),3.0);}
  void main(){
    vec3 V=normalize(cameraPosition-vWorldPos);
    float rim=fresnel(normalize(vNormal),V);
    gl_FragColor=vec4(uColor*rim*uIntensity,rim*uIntensity);
  }
`;
const ringVertex = /* glsl */ `
  varying vec2 vUv; void main(){vUv=uv;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}
`;
const ringFragment = /* glsl */ `
  varying vec2 vUv; uniform vec3 uColor; uniform float uTime;
  void main(){
    vec2 c=vUv-0.5; float r=length(c);
    float inner=0.36,outer=0.52;
    float alpha=smoothstep(inner,inner+0.02,r)*(1.0-smoothstep(outer-0.02,outer,r));
    float bands=sin(r*160.0+uTime*0.5)*0.1+0.9;
    vec3 col=uColor*bands;
    gl_FragColor=vec4(col,alpha*0.65);
    if(alpha<0.001)discard;
  }
`;

/* =======================
   ENHANCED PLANET
   ======================= */
const EnhancedPlanet = ({
  position,
  project,
  onClick,
  isHovered,
  isSelected,
}) => {
  const planetRef = useRef();
  const [hovered, setHovered] = useState(false);

  // random preset (ổn định theo project id)
  const preset = useMemo(
    () => PLANET_PRESETS[Math.floor(Math.random() * PLANET_PRESETS.length)],
    [project.id || project.title]
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uType: {
        value: preset.type === "rocky" ? 0 : preset.type === "gas" ? 1 : 2,
      },
      uBase1: { value: new THREE.Color(preset.base1) },
      uBase2: { value: new THREE.Color(preset.base2) },
      uAccent: { value: new THREE.Color(preset.accent) },
      uNoiseScale: { value: preset.noiseScale },
      uBandFreq: { value: preset.bandFreq || 24 },
      uCloudiness: { value: preset.type === "rocky" ? 0.4 : 0.85 },
      uLightDir: { value: new THREE.Vector3(1, 0.6, 0.2) },
    }),
    [preset]
  );

  const atmoUniformsInner = useMemo(
    () => ({
      uColor: { value: new THREE.Color(preset.atmo) },
      uIntensity: { value: 0.9 },
    }),
    [preset]
  );
  const atmoUniformsOuter = useMemo(
    () => ({
      uColor: { value: new THREE.Color(preset.atmo) },
      uIntensity: { value: 0.5 },
    }),
    [preset]
  );

  const ringUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#eeddb3") },
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    ringUniforms.uTime.value = state.clock.elapsedTime;
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.002;
      if (hovered || isHovered || isSelected) {
        planetRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.05);
      } else {
        planetRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
      }
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    onClick?.(project);
  };

  return (
    <group
      position={position}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Planet core */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[1, 128, 128]} />
        <shaderMaterial
          vertexShader={planetVertex}
          fragmentShader={planetFragment}
          uniforms={uniforms}
        />
      </mesh>

      {/* Atmosphere layers */}
      <mesh scale={[1.05, 1.05, 1.05]}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={planetVertex}
          fragmentShader={atmoFragment}
          uniforms={atmoUniformsInner}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={[1.08, 1.08, 1.08]}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={planetVertex}
          fragmentShader={atmoFragment}
          uniforms={atmoUniformsOuter}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
          depthWrite={false}
        />
      </mesh>

      {/* Ring (Saturn) */}
      {preset.ring && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 2.3, 160, 1]} />
          <shaderMaterial
            vertexShader={ringVertex}
            fragmentShader={ringFragment}
            uniforms={ringUniforms}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Info overlay */}
      {(hovered || isHovered || isSelected) && (
        <Html position={[0, 2, 0]} center distanceFactor={8}>
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
          </div>
        </Html>
      )}
    </group>
  );
};

export default memo(EnhancedPlanet);
