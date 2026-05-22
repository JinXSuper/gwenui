---
name: r3f-patterns
description: React Three Fiber patterns for GwenUI Supreme blocks — scene setup, lighting, geometry, useFrame animation, post-processing, Rapier physics, and performance rules. Use when building any 3D or WebGL block with R3F, Drei, or Rapier.
license: BSL-1.1
metadata:
  version: 1.0.0
  author: JinXSuper
---

# GwenUI — R3F Patterns SKILL

## Overview

Standard guide for using React Three Fiber in GwenUI Supreme blocks —
scene setup, lighting, geometry, animation, post-processing, and performance.
All Supreme blocks that require 3D must follow these patterns.

---

## Stack

```json
{
  "dependencies": {
    "@react-three/fiber": "latest",
    "@react-three/drei": "latest",
    "@react-three/rapier": "latest",
    "three": "latest",
    "gsap": "latest"
  }
}
```

---

## Credit Header (MANDATORY)

```tsx
/**
 * Block: <Block Name>
 * Author: Implemented by JinXSuper
 * License: BSL 1.1 — see LICENSE.md
 */
```

---

## 1. Scene Setup & Canvas

### Standard Canvas Setup

```tsx
"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"

export default function SupremeBlock() {
  return (
    <div className="relative w-full h-screen">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        shadows
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      <div className="absolute inset-0 pointer-events-none">
        {/* HTML overlay — Framer Motion for UI on top of the canvas */}
      </div>
    </div>
  )
}
```

### DPR — Device Pixel Ratio

```tsx
dpr={[1, 2]}    // ✅ responsive
dpr={2}         // ❌ force 2x on all devices — heavy on mobile
dpr={1}         // ❌ blurry on retina display
```

### Responsive Canvas

```tsx
// Canvas automatically fills parent — parent controls the size
<div className="w-full h-[500px] md:h-[700px] lg:h-screen">
  <Canvas>...</Canvas>
</div>
```

---

## 2. Camera Patterns

```tsx
// Perspective (default) — fov guide:
// 30-45 → telephoto, compressed depth, premium
// 60-75 → normal, natural
// 90+   → wide angle, avoid unless intentional
<Canvas camera={{ position: [0, 0, 5], fov: 45 }}>

// Orthographic — flat design, isometric
<Canvas orthographic camera={{ zoom: 100, position: [0, 0, 5] }}>
```

### OrbitControls

```tsx
import { OrbitControls } from "@react-three/drei"

<OrbitControls
  enableZoom={false}
  enablePan={false}
  autoRotate
  autoRotateSpeed={0.5}       // slow = premium
  maxPolarAngle={Math.PI / 2}
/>
```

### GSAP Camera Animation

```tsx
function CameraAnimation() {
  const { camera } = useThree()

  useEffect(() => {
    gsap.fromTo(
      camera.position,
      { z: 10, y: 3 },
      { z: 5, y: 0, duration: 2, ease: "power3.out" }
    )
  }, [camera])

  return null
}
```

---

## 3. Lighting Patterns

### Standard GwenUI Dark Theme Lighting

```tsx
function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
        color="#FF8C42"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-5, 3, -5]} intensity={0.4} color="#6B3FA0" />
      <pointLight position={[0, -3, -5]} intensity={0.6} color="#FF8C42" />
    </>
  )
}
```

### Environment Lighting

```tsx
import { Environment } from "@react-three/drei"

<Environment preset="night" />
<Environment files="/hdr/studio.hdr" />
<Environment preset="city" background blur={0.8} />
```

---

## 4. Geometry & Materials

```tsx
// MeshStandardMaterial — PBR, use for most cases
<meshStandardMaterial color="#FF8C42" roughness={0.3} metalness={0.8} />

// MeshPhysicalMaterial — glass/clearcoat
<meshPhysicalMaterial transmission={0.9} thickness={0.5} clearcoat={1} roughness={0} />

// MeshBasicMaterial — no lighting, flat
<meshBasicMaterial color="#FF8C42" wireframe />
```

### Drei Material Helpers

```tsx
import { MeshReflectorMaterial, MeshDistortMaterial } from "@react-three/drei"

// Reflective floor
<MeshReflectorMaterial blur={[300, 100]} resolution={1024} mixStrength={50} color="#050505" metalness={0.8} />

// Organic/distort
<MeshDistortMaterial color="#FF8C42" distort={0.4} speed={2} roughness={0} />
```

### Geometry Segment Guide

```
Low poly (< 16 seg): background, distant objects
Medium (16-32):      main objects
High (64+):          close-up hero objects — do not overdo it
```

---

## 5. Animation with useFrame

```tsx
import { useFrame } from "@react-three/fiber"

function RotatingMesh() {
  const meshRef = useRef()

  useFrame((state, delta) => {
    // Always use delta — frame-rate independent
    meshRef.current.rotation.y += delta * 0.5
    meshRef.current.rotation.x += delta * 0.2
  })

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      <meshStandardMaterial color="#FF8C42" />
    </mesh>
  )
}
```

### Clock-based Animation

```tsx
useFrame(({ clock }) => {
  const t = clock.getElapsedTime()
  meshRef.current.position.y = Math.sin(t * 2) * 0.5
  meshRef.current.rotation.y = THREE.MathUtils.lerp(
    meshRef.current.rotation.y, targetRotation, 0.05
  )
})
```

### GSAP + R3F

```tsx
useEffect(() => {
  if (!meshRef.current) return
  const tl = gsap.timeline({ repeat: -1, yoyo: true })
  tl.to(meshRef.current.position, { y: 1, duration: 2, ease: "power2.inOut" })
  return () => tl.kill()  // mandatory cleanup
}, [])
```

### useFrame Priority

```tsx
useFrame(() => { /* physics */ }, -1)   // before render
useFrame(() => { /* animation */ }, 0)  // default
useFrame(() => { /* post */ }, 1)       // after render
```

---

## 6. Post-Processing

```tsx
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from "@react-three/postprocessing"

<EffectComposer>
  <Bloom intensity={1.5} luminanceThreshold={0.6} luminanceSmoothing={0.025} mipmapBlur />
  <ChromaticAberration offset={[0.002, 0.002]} />
  <Vignette eskil={false} offset={0.1} darkness={1.1} />
  <Noise premultiply />
</EffectComposer>
```

Post-processing must always be at the **very bottom** of `<Canvas>`.

---

## 7. Drei — Essential Helpers

```tsx
// 3D Text
<Text fontSize={0.5} color="#FF8C42" font="/fonts/PlusJakartaSans-Bold.woff">
  GwenUI
</Text>

// HTML in 3D space
<Html position={[0, 1, 0]} center>
  <div className="bg-card border border-border rounded-lg p-4">HTML in 3D</div>
</Html>

// Floating animation
<Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
  <mesh>...</mesh>
</Float>

// Stars + Sparkles
<Stars radius={100} depth={50} count={5000} fade speed={1} />
<Sparkles count={100} scale={4} size={2} speed={0.4} color="#FF8C42" />

// Load GLTF
const { scene } = useGLTF("/models/model.glb")
useGLTF.preload("/models/model.glb")
```

---

## 8. Physics with Rapier

```tsx
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier"

<Physics gravity={[0, -9.81, 0]}>
  <RigidBody type="dynamic" restitution={0.5} friction={0.7}>
    <mesh castShadow>
      <sphereGeometry args={[0.5]} />
      <meshStandardMaterial color="#FF8C42" />
    </mesh>
  </RigidBody>

  <RigidBody type="fixed">
    <mesh receiveShadow position={[0, -2, 0]}>
      <boxGeometry args={[10, 0.5, 10]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
  </RigidBody>
</Physics>
```

---

## 9. Performance Rules

```
Target: < 50 draw calls per frame for smooth 60fps on mid-range devices

✅ Use dpr={[1, 2]} — do not use fixed high dpr
✅ Instancing for > 10 identical objects
✅ Dispose geometry + material on unmount
✅ useMemo for expensive geometry/position calculations
✅ frameloop="demand" if the scene is mostly static
✅ Shadow map size: 512/1024 for most, 2048 only for hero objects

❌ Do not create new geometries inside useFrame
❌ Do not shadow every object — only important ones
❌ Do not overdo post-processing effects
❌ Do not load high-resolution textures unnecessarily
```

### Instancing

```tsx
// InstancedMesh — same mesh with different transforms
function InstancedBoxes({ count = 100 }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      )
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [count, dummy])

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} castShadow>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial color="#FF8C42" />
    </instancedMesh>
  )
}
```

### Dispose

```tsx
useEffect(() => {
  return () => {
    geometryRef.current?.dispose()
    materialRef.current?.dispose()
  }
}, [])
```

---

## 10. R3F + Framer Motion Integration

Framer Motion is for HTML overlay only — **not** for Three.js objects.
Three.js objects are animated via `useFrame` or GSAP.

```tsx
<div className="relative w-full h-screen">
  {/* 3D canvas */}
  <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
    <Suspense fallback={null}><Scene /></Suspense>
  </Canvas>

  {/* HTML overlay — Framer Motion only */}
  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      className="text-6xl font-bold text-foreground pointer-events-auto"
    >
      GwenUI Supreme
    </motion.h1>
  </div>
</div>
```

---

## Checklist Supreme Block

- [ ] Credit header BSL 1.1 present in all files
- [ ] Canvas setup: `dpr={[1, 2]}`, `powerPreference: "high-performance"`
- [ ] `<Suspense fallback={null}>` wraps all async content
- [ ] Lighting: ambient + directional + optional rim light
- [ ] `useFrame` uses `delta` for frame-rate independent animations
- [ ] GSAP timeline has `return () => tl.kill()` cleanup
- [ ] Geometry + material disposed on unmount
- [ ] No geometry creation inside `useFrame`
- [ ] Instancing for > 10 identical objects
- [ ] Post-processing at the very bottom of the Canvas
- [ ] Framer Motion only for HTML overlay — not Three.js objects
- [ ] Responsive: parent container controls the size, not the Canvas
- [ ] `useGLTF.preload` if a model is loaded
