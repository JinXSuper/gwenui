"use client"

import React, { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TeamMember {
  name: string
  role: string
  about: string
  image: string
  number?: number
  brandMark?: string
}

export interface MeetTheTeamProps {
  members: TeamMember[]
  title?: string
  titleAccent?: string
  brandMark?: string
  className?: string
}

const PHOTO_POSITIONS = [
  { y: -130, rotate: -6 },
  { y: -150, rotate: -12 },
  { y: -140, rotate: 6 },
  { y: -120, rotate: -4 },
  { y: -160, rotate: 10 },
]

const TeamCard: React.FC<{
  member: TeamMember
  featured: boolean
  rotation: number
}> = ({ member, featured, rotation }) => {
  const [isActive, setIsActive] = useState(false)
  const [photoPos, setPhotoPos] = useState(PHOTO_POSITIONS[0])

  // Randomize photo position upon activation
  const handleClick = () => {
    if (!isActive) {
      const nextPos = PHOTO_POSITIONS[Math.floor(Math.random() * PHOTO_POSITIONS.length)]
      setPhotoPos(nextPos)
    }
    setIsActive((prev) => !prev)
  }

  const targetWidth = featured ? 288 : 224  // w-72 = 288px, w-56 = 224px
  const targetHeight = featured ? 380 : 320 // min-h matches card exact size
  const targetY = featured ? photoPos.y : photoPos.y * 0.85

  return (
    <motion.div
      onClick={handleClick}
      className="relative cursor-pointer select-none"
      style={{
        rotate: rotation,
        zIndex: isActive ? 30 : (featured ? 10 : 2),
      }}
      whileHover={{ scale: 1.02, zIndex: 40 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Photo overflow component - Located BEHIND the card, same exact size */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute top-0 left-0 rounded-2xl overflow-hidden pointer-events-auto shadow-2xl border border-border/20 z-0"
            style={{
              width: targetWidth,
              height: targetHeight,
            }}
            initial={{ opacity: 0, y: 0, scale: 0.95, rotate: 0 }}
            animate={{ opacity: 1, y: targetY, scale: 1, rotate: photoPos.rotate }}
            whileHover={{ scale: 1.05, zIndex: 20 }}
            exit={{ opacity: 0, y: 0, scale: 0.95, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover object-top"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card body wrapper - z-10 and bg-card (opaque) keeps the image hidden until active */}
      <div
        className={cn(
          "relative rounded-2xl flex flex-col gap-4 transition-all duration-300 shadow-md z-10",
        )}
        style={{
          width: targetWidth,
          height: targetHeight,
          padding: featured ? "2rem" : "1.5rem",
          background: "var(--card)",
          border: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        {/* Header row: Brand monogram + card position number */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-muted-foreground tracking-widest">
            {member.brandMark ?? "G"}
          </span>
          <span className="text-sm text-muted-foreground tabular-nums">
            {member.number ?? 1} ]
          </span>
        </div>

        {/* Elegant static content placement */}
        <div className="mt-8 flex flex-col gap-1">
          {/* Animated member identity details */}
          <AnimatePresence mode="wait">
            <motion.div key={String(isActive)} className="flex flex-col gap-1">
              <motion.h3
                initial={{ opacity: 0, filter: "blur(8px)", y: 4 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                style={{ fontFamily: "var(--font-lora, Lora, serif)" }}
                className={cn("font-bold text-foreground", featured ? "text-2xl" : "text-lg")}
              >
                {member.name}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, filter: "blur(8px)", y: 4 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                style={{ fontFamily: "var(--font-lora, Lora, serif)" }}
                className="text-sm text-muted-foreground"
              >
                {member.role}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Animated member narrative bio description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`about-${isActive}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.32 }}
            className="mt-auto pt-2"
          >
            <p className="text-[10px] text-muted-foreground/60 tracking-widest uppercase mb-1">
              [ About ]
            </p>
            <p
              className={cn(
                "text-muted-foreground text-right leading-relaxed overflow-hidden",
                featured ? "text-sm line-clamp-4" : "text-xs line-clamp-3"
              )}
            >
              {member.about}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    name: "Liora Gwen",
    role: "Head of Design",
    about: "Crafts interfaces that feel alive — blending motion and clarity into every pixel.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Aria Voss",
    role: "Lead Engineer",
    about: "Turns complex systems into elegant, maintainable code at any scale.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Sena Park",
    role: "Product Strategist",
    about: "Bridges user needs and business goals with sharp product instinct.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Devon Miller",
    role: "Growth Marketer",
    about: "Fosters brand authority and scales visibility via data-driven creative strategies.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  }
]

export const MeetTheTeam: React.FC<MeetTheTeamProps> = ({
  members = DEFAULT_MEMBERS,
  title = "Team",
  titleAccent = "our",
  brandMark = "G",
  className,
}) => {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(members.length / 3)
  const pageMembers = members.slice(page * 3, page * 3 + 3)

  // Rotating layout settings
  const ROTATIONS = [-3, 0, 2]

  const handlePrev = () => {
    setPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1))
  }

  const handleNext = () => {
    setPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0))
  }

  return (
    <section className={cn("w-full py-20 px-6 max-w-6xl mx-auto overflow-visible", className)}>
      {/* Editorial typographic header section */}
      <div className="mb-16 select-none">
        <div className="flex items-end gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <span
                className="text-5xl md:text-6xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-lora, Lora, serif)" }}
              >
                Meet
              </span>
              <span
                className="text-3xl md:text-4xl text-primary italic"
                style={{ fontFamily: "var(--font-lora, Lora, serif)" }}
              >
                {titleAccent}
              </span>
            </div>
            <div className="flex items-center gap-4 -mt-2">
              <div className="w-12 md:w-16 h-px bg-foreground/30" />
              <span
                className="text-5xl md:text-6xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-lora, Lora, serif)" }}
              >
                {title}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Member cards display area */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-12 md:gap-8 mt-10 min-h-[460px] overflow-visible">
        {pageMembers.map((member, i) => (
          <TeamCard
            key={`${page}-${i}`}
            member={{ ...member, brandMark, number: page * 3 + i + 1 }}
            featured={i === 0}
            rotation={ROTATIONS[i]}
          />
        ))}
      </div>

      {/* Bottom navigation panel */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-12 max-w-4xl mx-auto border-t border-border/10 pt-6">
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-foreground" />
            </button>
            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-foreground" />
            </button>
          </div>
          <span className="text-sm text-muted-foreground tabular-nums">
            {page + 1} / {totalPages}
          </span>
        </div>
      )}
    </section>
  )
}
