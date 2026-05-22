/**
 * Block: Parallax Hero
 * Author: Implemented by JinXSuper
 * License: BSL 1.1 — see LICENSE.md
 */
"use client";

import * as React from "react";
import { motion, useSpring, useTransform, type MotionValue } from "framer-motion";
import type { ParallaxImageLayer } from "../index";

interface FloatingImageProps {
  layer: ParallaxImageLayer;
  mouseX: MotionValue<number>;  // -1 → 1 normalized
  mouseY: MotionValue<number>;
}

export function FloatingImage({ layer, mouseX, mouseY }: FloatingImageProps) {
  const depth = layer.depth;

  // Parallax transform based on depth and mouse position
  const rawX = useTransform(mouseX, [-1, 1], [-24 * depth, 24 * depth]);
  const rawY = useTransform(mouseY, [-1, 1], [-16 * depth, 16 * depth]);

  // Spring-ify motion values for smooth lag/inertia effect
  const springX = useSpring(rawX, { stiffness: 80, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 80, damping: 20 });

  // Support general horizontal centering when left is 50%
  const isCenterLayer = layer.id === "layer-5" || layer.id === "l5" || layer.left === "50%";
  
  return (
    <motion.div
      style={{
        position: "absolute",
        top: layer.top,
        left: layer.left,
        right: layer.right,
        bottom: layer.bottom,
        width: layer.width,
        height: layer.height,
        rotate: layer.rotation ?? 0,
        x: springX,
        y: springY,
        borderRadius: layer.borderRadius ?? "1rem",
        overflow: "hidden",
        zIndex: Math.round(layer.depth * 10) + 4, // floating image z-index around 5 as specified
        ...(isCenterLayer ? { transform: "translateX(-50%)" } : {}),
      }}
      initial={{ opacity: 0, filter: "blur(12px)", scale: 0.95 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      transition={{
        duration: 0.8,
        delay: layer.delay ?? 0,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="pointer-events-none select-none shadow-2xl hidden md:block"
    >
      <img
        src={layer.src}
        alt={layer.alt ?? "Parallax Image"}
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
    </motion.div>
  );
}
