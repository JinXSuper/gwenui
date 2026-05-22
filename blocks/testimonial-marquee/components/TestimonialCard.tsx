/**
 * Block: Testimonial Marquee
 * Author: Implemented by JinXSuper
 * License: MIT
 */

import React from "react"

interface Testimonial {
  id: string
  name: string
  handle: string
  avatar: string
  quote: string
  date: string
  verified?: boolean
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const isGwenBrand =
    testimonial.handle === "@lioragwen" || testimonial.handle === "@gwenui"

  return (
    <div className="w-[280px] sm:w-[320px] flex-shrink-0 bg-card border border-border rounded-xl p-4 sm:p-5 shadow-sm transition-colors duration-200 hover:border-primary/30">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center gap-1">
              <p className="text-xs sm:text-sm font-semibold text-foreground leading-none">
                {testimonial.name}
              </p>
              {/* Verified checkmark */}
              {testimonial.verified && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-primary flex-shrink-0 sm:w-4 sm:h-4"
                >
                  <path
                    d="M9 12l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
              {testimonial.handle}
            </p>
          </div>
        </div>

        {/* Brand / Platform Logo */}
        {isGwenBrand ? (
          <img
            src="/gwen-logo.ico"
            alt="GwenUI logo"
            className="w-4 h-4 sm:w-4.5 sm:h-4.5 object-contain flex-shrink-0"
            style={{ width: "16px", height: "16px" }}
          />
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-muted-foreground flex-shrink-0 sm:w-[18px] sm:h-[18px]"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        )}
      </div>

      {/* Quote */}
      <p className="text-xs sm:text-sm text-foreground leading-relaxed mt-2.5 sm:mt-3">
        {testimonial.quote}
      </p>

      {/* Date */}
      <p className="text-[10px] sm:text-xs text-muted-foreground mt-3.5 sm:mt-4">{testimonial.date}</p>
    </div>
  )
}
