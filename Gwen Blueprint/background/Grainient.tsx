'use client'

import React, { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * GwenUI Grainient — High Performance R3F Component
 * Migrated from OGL with full logic parity.
 */
export const GRAINIENT_CONFIG = {
  timeSpeed: 0.25,
  colorBalance: 0.0,
  warpStrength: 1.0,
  warpFrequency: 5.0,
  warpSpeed: 2.0,
  warpAmplitude: 50.0,
  blendAngle: 0.0,
  blendSoftness: 0.05,
  rotationAmount: 500.0,
  noiseScale: 2.0,
  grainAmount: 0.1,
  grainScale: 2.0,
  grainAnimated: false,
  contrast: 1.5,
  gamma: 1.0,
  saturation: 1.0,
  centerX: 0.0,
  centerY: 0.0,
  zoom: 0.9,
  colors: {
    orange: '#FF8C42',
    sunset: '#F9A03F',
    violet: '#3D1472',
  }
}

export interface GrainientProps {
  timeSpeed?: number
  colorBalance?: number
  warpStrength?: number
  warpFrequency?: number
  warpSpeed?: number
  warpAmplitude?: number
  blendAngle?: number
  blendSoftness?: number
  rotationAmount?: number
  noiseScale?: number
  grainAmount?: number
  grainScale?: number
  grainAnimated?: boolean
  contrast?: number
  gamma?: number
  saturation?: number
  centerX?: number
  centerY?: number
  zoom?: number
  color1?: string
  color2?: string
  color3?: string
  className?: string
}

/* ─── Shaders ─── */

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

const fragmentShader = /* glsl */ `
precision highp float;

uniform vec2  iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2  uCenterOffset;
uniform float uZoom;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;

varying vec2 vUv;

#define S(a,b,t) smoothstep(a,b,t)

mat2 Rot(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
}

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(2127.1, 81.17)), dot(p, vec2(1269.5, 283.37)));
  return fract(sin(p) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float n = mix(
    mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)), 
        dot(-1.0 + 2.0 * hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), 
        dot(-1.0 + 2.0 * hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y
  );
  return 0.5 + 0.5 * n;
}

void main() {
  float t = iTime * uTimeSpeed;
  vec2 uv = vUv; // Use vUv for consistency with R3F plane
  float ratio = iResolution.x / max(iResolution.y, 0.001);
  
  vec2 tuv = uv - 0.5 + uCenterOffset;
  tuv /= max(uZoom, 0.001);

  float degree = noise(vec2(t * 0.1, tuv.x * tuv.y) * uNoiseScale);
  tuv.y *= 1.0 / ratio;
  tuv *= Rot(radians((degree - 0.5) * uRotationAmount + 180.0));
  tuv.y *= ratio;

  float frequency = uWarpFrequency;
  float ws = max(uWarpStrength, 0.001);
  float amplitude = uWarpAmplitude / ws;
  float warpTime = t * uWarpSpeed;
  tuv.x += sin(tuv.y * frequency + warpTime) / amplitude;
  tuv.y += sin(tuv.x * (frequency * 1.5) + warpTime) / (amplitude * 0.5);

  vec3 colLav = uColor1;
  vec3 colOrg = uColor2;
  vec3 colDark = uColor3;
  float b = uColorBalance;
  float s = max(uBlendSoftness, 0.0);
  mat2 blendRot = Rot(radians(uBlendAngle));
  float blendX = (tuv * blendRot).x;
  float edge0 = -0.3 - b - s;
  float edge1 = 0.2 - b + s;
  float v0 = 0.5 - b + s;
  float v1 = -0.3 - b - s;
  
  vec3 layer1 = mix(colDark, colOrg, S(edge0, edge1, blendX));
  vec3 layer2 = mix(colOrg, colLav, S(edge0, edge1, blendX));
  vec3 col = mix(layer1, layer2, S(v0, v1, tuv.y));

  vec2 grainUv = uv * max(uGrainScale, 0.001);
  if (uGrainAnimated > 0.5) { grainUv += vec2(iTime * 0.05); } 
  float grain = fract(sin(dot(grainUv, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * uGrainAmount;

  col = (col - 0.5) * uContrast + 0.5;
  float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(luma), col, uSaturation);
  col = pow(max(col, 0.0), vec3(1.0 / max(uGamma, 0.001)));
  
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`

/* ─── R3F Mesh ─── */

function GrainientMesh(props: GrainientProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { gl } = useThree()

  const uniforms = useMemo(() => ({
    iTime:           { value: 0 },
    iResolution:     { value: new THREE.Vector2(1, 1) },
    uTimeSpeed:      { value: props.timeSpeed ?? GRAINIENT_CONFIG.timeSpeed },
    uColorBalance:   { value: props.colorBalance ?? GRAINIENT_CONFIG.colorBalance },
    uWarpStrength:   { value: props.warpStrength ?? GRAINIENT_CONFIG.warpStrength },
    uWarpFrequency:  { value: props.warpFrequency ?? GRAINIENT_CONFIG.warpFrequency },
    uWarpSpeed:      { value: props.warpSpeed ?? GRAINIENT_CONFIG.warpSpeed },
    uWarpAmplitude:  { value: props.warpAmplitude ?? GRAINIENT_CONFIG.warpAmplitude },
    uBlendAngle:     { value: props.blendAngle ?? GRAINIENT_CONFIG.blendAngle },
    uBlendSoftness:  { value: props.blendSoftness ?? GRAINIENT_CONFIG.blendSoftness },
    uRotationAmount: { value: props.rotationAmount ?? GRAINIENT_CONFIG.rotationAmount },
    uNoiseScale:     { value: props.noiseScale ?? GRAINIENT_CONFIG.noiseScale },
    uGrainAmount:    { value: props.grainAmount ?? GRAINIENT_CONFIG.grainAmount },
    uGrainScale:     { value: props.grainScale ?? GRAINIENT_CONFIG.grainScale },
    uGrainAnimated:  { value: props.grainAnimated ? 1.0 : 0.0 },
    uContrast:       { value: props.contrast ?? GRAINIENT_CONFIG.contrast },
    uGamma:          { value: props.gamma ?? GRAINIENT_CONFIG.gamma },
    uSaturation:     { value: props.saturation ?? GRAINIENT_CONFIG.saturation },
    uCenterOffset:   { value: new THREE.Vector2(props.centerX ?? GRAINIENT_CONFIG.centerX, props.centerY ?? GRAINIENT_CONFIG.centerY) },
    uZoom:           { value: props.zoom ?? GRAINIENT_CONFIG.zoom },
    uColor1:         { value: new THREE.Color(props.color1 ?? GRAINIENT_CONFIG.colors.orange) },
    uColor2:         { value: new THREE.Color(props.color2 ?? GRAINIENT_CONFIG.colors.sunset) },
    uColor3:         { value: new THREE.Color(props.color3 ?? GRAINIENT_CONFIG.colors.violet) },
  }), [])

  useFrame((state) => {
    const { clock, size } = state
    const dpr = gl.getPixelRatio()
    uniforms.iTime.value = clock.getElapsedTime()
    uniforms.iResolution.value.set(size.width * dpr, size.height * dpr)
    
    // Sync all props
    uniforms.uTimeSpeed.value = props.timeSpeed ?? GRAINIENT_CONFIG.timeSpeed
    uniforms.uColorBalance.value = props.colorBalance ?? GRAINIENT_CONFIG.colorBalance
    uniforms.uWarpStrength.value = props.warpStrength ?? GRAINIENT_CONFIG.warpStrength
    uniforms.uWarpFrequency.value = props.warpFrequency ?? GRAINIENT_CONFIG.warpFrequency
    uniforms.uWarpSpeed.value = props.warpSpeed ?? GRAINIENT_CONFIG.warpSpeed
    uniforms.uWarpAmplitude.value = props.warpAmplitude ?? GRAINIENT_CONFIG.warpAmplitude
    uniforms.uBlendAngle.value = props.blendAngle ?? GRAINIENT_CONFIG.blendAngle
    uniforms.uBlendSoftness.value = props.blendSoftness ?? GRAINIENT_CONFIG.blendSoftness
    uniforms.uRotationAmount.value = props.rotationAmount ?? GRAINIENT_CONFIG.rotationAmount
    uniforms.uNoiseScale.value = props.noiseScale ?? GRAINIENT_CONFIG.noiseScale
    uniforms.uGrainAmount.value = props.grainAmount ?? GRAINIENT_CONFIG.grainAmount
    uniforms.uGrainScale.value = props.grainScale ?? GRAINIENT_CONFIG.grainScale
    uniforms.uGrainAnimated.value = props.grainAnimated ? 1.0 : 0.0
    uniforms.uContrast.value = props.contrast ?? GRAINIENT_CONFIG.contrast
    uniforms.uGamma.value = props.gamma ?? GRAINIENT_CONFIG.gamma
    uniforms.uSaturation.value = props.saturation ?? GRAINIENT_CONFIG.saturation
    uniforms.uCenterOffset.value.set(props.centerX ?? GRAINIENT_CONFIG.centerX, props.centerY ?? GRAINIENT_CONFIG.centerY)
    uniforms.uZoom.value = props.zoom ?? GRAINIENT_CONFIG.zoom
    uniforms.uColor1.value.set(props.color1 ?? GRAINIENT_CONFIG.colors.orange)
    uniforms.uColor2.value.set(props.color2 ?? GRAINIENT_CONFIG.colors.sunset)
    uniforms.uColor3.value.set(props.color3 ?? GRAINIENT_CONFIG.colors.violet)
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}

const Grainient: React.FC<GrainientProps> = (props) => {
  return (
    <div
      className={props.className}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -10,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1] }}
        gl={{ antialias: false, alpha: false, stencil: false, depth: false }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <GrainientMesh {...props} />
      </Canvas>
    </div>
  )
}

export default Grainient
