"use client";

import { useState } from "react";
import Grainient from "@/components/ui/Grainient";
import { Eye, Code2, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToolbarDocs } from "@/components/docs/ToolbarDocs";

const usageCode = `"use client";

import { Grainient } from "@/components/ui/Grainient";

export default function Demo() {
  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-2xl border border-white/10">
      <Grainient
        color1="#FF59FF"
        color2="#5227FF"
        color3="#FF31D2"
        grainAmount={0.12}
        grainAnimated={true}
        grainScale={2.0}
        timeSpeed={0.25}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Grainient
        </h2>
      </div>
    </div>
  );
}`;

const componentCode = `import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

interface GrainientProps {
  timeSpeed?: number;
  colorBalance?: number;
  warpStrength?: number;
  warpFrequency?: number;
  warpSpeed?: number;
  warpAmplitude?: number;
  blendAngle?: number;
  blendSoftness?: number;
  rotationAmount?: number;
  noiseScale?: number;
  grainAmount?: number;
  grainScale?: number;
  grainAnimated?: boolean;
  contrast?: number;
  gamma?: number;
  saturation?: number;
  centerX?: number;
  centerY?: number;
  zoom?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  className?: string;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\\\\d]{2})([a-f\\\\d]{2})([a-f\\\\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

const vertex = \`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
\`;

const fragment = \`#version 300 es
precision highp float;
uniform vec2 iResolution;
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
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;
#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);} 
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);} 
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);return 0.5+0.5*n;}
void mainImage(out vec4 o, vec2 C){
  float t=iTime*uTimeSpeed;
  vec2 uv=C/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=uv-0.5+uCenterOffset;
  tuv/=max(uZoom,0.001);

  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y*=1.0/ratio;
  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y*=ratio;

  float frequency=uWarpFrequency;
  float ws=max(uWarpStrength,0.001);
  float amplitude=uWarpAmplitude/ws;
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);

  vec3 colLav=uColor1;
  vec3 colOrg=uColor2;
  vec3 colDark=uColor3;
  float b=uColorBalance;
  float s=max(uBlendSoftness,0.0);
  mat2 blendRot=Rot(radians(uBlendAngle));
  float blendX=(tuv*blendRot).x;
  float edge0=-0.3-b-s;
  float edge1=0.2-b+s;
  float v0=0.5-b+s;
  float v1=-0.3-b-s;
  vec3 layer1=mix(colDark,colOrg,S(edge0,edge1,blendX));
  vec3 layer2=mix(colOrg,colLav,S(edge0,edge1,blendX));
  vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));

  vec2 grainUv=uv*max(uGrainScale,0.001);
  if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);} 
  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;

  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));
  col=clamp(col,0.0,1.0);

  o=vec4(col,1.0);
}
void main(){
  vec4 o=vec4(0.0);
  mainImage(o,gl_FragCoord.xy);
  fragColor=o;
}
\`;

type GrainientCtx = {
  renderer: InstanceType<typeof Renderer>;
  program: InstanceType<typeof Program>;
  mesh: InstanceType<typeof Mesh>;
};
const ctxMap = new WeakMap<HTMLDivElement, GrainientCtx>();

const Grainient: React.FC<GrainientProps> = ({
  timeSpeed = 0.25,
  colorBalance = 0.0,
  warpStrength = 1.0,
  warpFrequency = 5.0,
  warpSpeed = 2.0,
  warpAmplitude = 50.0,
  blendAngle = 0.0,
  blendSoftness = 0.05,
  rotationAmount = 500.0,
  noiseScale = 2.0,
  grainAmount = 0.1,
  grainScale = 2.0,
  grainAnimated = false,
  contrast = 1.5,
  gamma = 1.0,
  saturation = 1.0,
  centerX = 0.0,
  centerY = 0.0,
  zoom = 0.9,
  color1 = 'var(--default-grain-color-1)',
  color2 = 'var(--default-grain-color-2)',
  color3 = 'var(--default-grain-color-3)',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });

    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime:           { value: 0 },
        iResolution:     { value: new Float32Array([1, 1]) },
        uTimeSpeed:      { value: 0.25 },
        uColorBalance:   { value: 0.0 },
        uWarpStrength:   { value: 1.0 },
        uWarpFrequency:  { value: 5.0 },
        uWarpSpeed:      { value: 2.0 },
        uWarpAmplitude:  { value: 50.0 },
        uBlendAngle:     { value: 0.0 },
        uBlendSoftness:  { value: 0.05 },
        uRotationAmount: { value: 500.0 },
        uNoiseScale:     { value: 2.0 },
        uGrainAmount:    { value: 0.1 },
        uGrainScale:     { value: 2.0 },
        uGrainAnimated:  { value: 0.0 },
        uContrast:       { value: 1.5 },
        uGamma:          { value: 1.0 },
        uSaturation:     { value: 1.0 },
        uCenterOffset:   { value: new Float32Array([0, 0]) },
        uZoom:           { value: 0.9 },
        uColor1:         { value: new Float32Array([1, 1, 1]) },
        uColor2:         { value: new Float32Array([1, 1, 1]) },
        uColor3:         { value: new Float32Array([1, 1, 1]) }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctxMap.set(container, { renderer, program, mesh });

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      renderer.setSize(w, h);
      const res = (program.uniforms.iResolution as { value: Float32Array }).value;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
      renderer.render({ scene: mesh });
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    let raf = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const t0 = performance.now();

    const loop = (t: number) => {
      (program.uniforms.iTime as { value: number }).value = (t - t0) * 0.001;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };

    const tryStart = () => {
      if (isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(loop);
    };
    const tryStop = () => {
      if (raf !== 0) { cancelAnimationFrame(raf); raf = 0; }
    };

    const io = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; isVisible ? tryStart() : tryStop(); },
      { threshold: 0 }
    );
    io.observe(container);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      isPageVisible ? tryStart() : tryStop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    tryStart();

    return () => {
      tryStop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      ctxMap.delete(container);
      try { container.removeChild(canvas); } catch { /* ignore */ }
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ctx = ctxMap.get(container);
    if (!ctx) return;
    const { program } = ctx;
    const u = program.uniforms as Record<string, { value: any }>;

    u.uTimeSpeed.value      = timeSpeed;
    u.uColorBalance.value   = colorBalance;
    u.uWarpStrength.value   = warpStrength;
    u.uWarpFrequency.value  = warpFrequency;
    u.uWarpSpeed.value      = warpSpeed;
    u.uWarpAmplitude.value  = warpAmplitude;
    u.uBlendAngle.value     = blendAngle;
    u.uBlendSoftness.value  = blendSoftness;
    u.uRotationAmount.value = rotationAmount;
    u.uNoiseScale.value     = noiseScale;
    u.uGrainAmount.value    = grainAmount;
    u.uGrainScale.value     = grainScale;
    u.uGrainAnimated.value  = grainAnimated ? 1.0 : 0.0;
    u.uContrast.value       = contrast;
    u.uGamma.value          = gamma;
    u.uSaturation.value     = saturation;
    u.uCenterOffset.value   = new Float32Array([centerX, centerY]);
    u.uZoom.value           = zoom;
    u.uColor1.value         = new Float32Array(hexToRgb(color1));
    u.uColor2.value         = new Float32Array(hexToRgb(color2));
    u.uColor3.value         = new Float32Array(hexToRgb(color3));
  }, [
    timeSpeed, colorBalance, warpStrength, warpFrequency, warpSpeed,
    warpAmplitude, blendAngle, blendSoftness, rotationAmount, noiseScale,
    grainAmount, grainScale, grainAnimated, contrast, gamma, saturation,
    centerX, centerY, zoom, color1, color2, color3
  ]);

  return <div ref={containerRef} className={\`relative h-full w-full overflow-hidden \${className}\`.trim()} />;
};

export default Grainient;`;

export function GrainientPreview({ blockName = "grainient" }: { blockName?: string }) {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isLandscape, setIsLandscape] = useState(false);
  const [activeVariant, setActiveVariant] = useState("Default");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [codeTab, setCodeTab] = useState<"usage" | "component">("usage");
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`npx @gwenui/cli add ${blockName}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    const container = document.getElementById("preview-mockup");
    if (container) {
      container.style.opacity = "0.5";
      setTimeout(() => {
        container.style.opacity = "1";
      }, 150);
    }
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const copyCodeToClipboard = () => {
    const code = codeTab === "usage" ? usageCode : componentCode;
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div className="w-full h-full relative">
      {/* Floating Controls Layer */}
      <div className="absolute inset-0 pointer-events-none z-20 p-8">
        
        {/* Top Spacer/Layout Toolbar Container */}
        <ToolbarDocs
          view={activeTab}
          setView={setActiveTab}
          deviceMode={deviceMode}
          setDeviceMode={setDeviceMode}
          isLandscape={isLandscape}
          setIsLandscape={setIsLandscape}
          isRefreshing={isRefreshing}
          handleRefresh={handleRefresh}
          blockName={blockName}
          copiedCommand={copied}
          handleCopyCommand={handleCopy}
          layoutIdPrefix="grainient_"
        />

        {/* Bottom Left Variant Controls */}
        <div className="absolute bottom-8 left-8 pointer-events-auto flex items-center gap-2 z-30">
          {["Default", "Coarse Grain", "Static Noise"].map((variant) => (
            <button
              key={variant}
              onClick={() => setActiveVariant(variant)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-[12px] font-medium transition-all ${
                activeVariant === variant
                  ? "bg-[var(--docs-text-heading)] text-black scale-100 font-extrabold"
                  : "bg-[var(--docs-card-bg)]/60 text-[var(--docs-text-body)] hover:text-[var(--docs-text-heading)] hover:bg-[var(--docs-card-bg)]/80 backdrop-blur-xl border border-[var(--docs-border-strong)] scale-[0.98] hover:scale-100"
              }`}
            >
              <div
                className={`w-[5px] h-[5px] rounded-full transition-colors ${
                  activeVariant === variant ? "bg-black" : "bg-[var(--docs-text-faint)]"
                }`}
              />
              {variant}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Area (Mockup or Code) */}
      <div className="w-full h-full flex items-center justify-center p-8 relative z-10 pt-24">
        <AnimatePresence mode="wait">
          {activeTab === "preview" ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              id="preview-mockup"
              className={`relative overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_50px_var(--grainient-preview-shadow)] flex-shrink-0 ${
                deviceMode === "desktop"
                  ? "w-full h-full rounded-3xl border border-[var(--docs-border-faint)]"
                  : deviceMode === "tablet"
                  ? isLandscape
                    ? "w-[640px] h-[480px] max-w-[90%] max-h-[90%] rounded-[2rem] border-[12px] border-[var(--docs-card-bg)] ring-1 ring-[var(--docs-border)] shadow-2xl"
                    : "w-[480px] h-[640px] max-w-[90%] max-h-[90%] rounded-[2rem] border-[12px] border-[var(--docs-card-bg)] ring-1 ring-[var(--docs-border)] shadow-2xl"
                  : isLandscape
                  ? "w-[650px] h-[320px] max-w-[90%] max-h-[90%] rounded-[3rem] border-[12px] border-[var(--docs-card-bg)] ring-1 ring-[var(--docs-border)] shadow-2xl"
                  : "w-[320px] h-[650px] max-w-[90%] max-h-[90%] rounded-[3rem] border-[12px] border-[var(--docs-card-bg)] ring-1 ring-[var(--docs-border)] shadow-2xl"
              }`}
            >
              {/* Background Gradient component */}
              <div className="absolute inset-0 z-0">
                <Grainient
                  color1="var(--grain-purple-pink)"
                  color2="var(--grain-purple-blue)"
                  color3="var(--grain-pink-sunset)"
                  grainAmount={activeVariant === "Coarse Grain" ? 0.3 : activeVariant === "Static Noise" ? 0.15 : 0.12}
                  grainAnimated={activeVariant !== "Static Noise"}
                  grainScale={activeVariant === "Coarse Grain" ? 1.0 : 2.0}
                  timeSpeed={activeVariant === "Static Noise" ? 0 : 0.25}
                  warpSpeed={1.0}
                  warpFrequency={3.0}
                  zoom={1.2}
                />
              </div>

              {/* Centered Text */}
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <h2
                  className={`font-bold text-[var(--docs-text-heading)] tracking-tight drop-shadow-[0_0_15px_var(--grainient-text-shadow)] transition-all duration-500 ${
                    deviceMode === "mobile" ? "text-xl" : "text-[22px]"
                  }`}
                >
                  Grainient
                </h2>
              </div>
            </motion.div>
          ) : (
            /* Premium Code Viewer Pane */
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full max-w-4xl rounded-3xl border border-[var(--docs-border-strong)] bg-[var(--docs-card-bg)]/80 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header Tab Bar */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--docs-border-faint)] bg-black/40 shrink-0">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {(["usage", "component"] as const).map((tab) => {
                    const isActive = codeTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setCodeTab(tab)}
                        className={`px-4 py-1.5 rounded-full text-[11px] font-mono transition-all duration-150 flex items-center gap-2 select-none relative shrink-0 ${
                          isActive
                            ? "text-[var(--primary)] bg-black/45 font-extrabold border-b border-[var(--primary)] shadow-inner"
                            : "text-[var(--docs-text-muted)] hover:text-[var(--docs-text-heading)] hover:bg-[var(--docs-elem-hover)]"
                        }`}
                      >
                        <span>{tab === "usage" ? "usage.tsx" : "Grainient.tsx"}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={copyCodeToClipboard}
                    className="text-[11px] font-bold uppercase tracking-wider text-[var(--docs-text-body)] hover:text-[var(--docs-text-heading)] transition-colors flex items-center gap-1.5"
                  >
                    {codeCopied ? (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 opacity-60" />
                    )}
                    <span>{codeCopied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Scrollable code container */}
              <div className="flex-1 p-6 overflow-auto font-mono text-[12px] leading-[1.7] text-[var(--docs-text-body)] relative bg-black/30">
                <pre className="whitespace-pre tab-size-2 custom-scrollbar">
                  <code>{codeTab === "usage" ? usageCode : componentCode}</code>
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
