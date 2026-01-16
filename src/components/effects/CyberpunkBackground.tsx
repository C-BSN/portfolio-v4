"use client"

import { ReactNode } from "react"
import { RainEffect } from "./RainEffect"
import { ParticleBackground } from "./ParticleBackground"
import { CursorGlow } from "./CursorGlow"

interface CyberpunkBackgroundProps {
  children: ReactNode
  backgroundImage?: string
  showRain?: boolean
  showParticles?: boolean
  showCursor?: boolean
  rainOpacity?: number
  particleOpacity?: number
  cursorOpacity?: number
}

export function CyberpunkBackground({
  children,
  backgroundImage,
  showRain = true,
  showParticles = true,
  showCursor = true,
  rainOpacity = 0.6,
  particleOpacity = 0.4,
  cursorOpacity = 0.30
}: CyberpunkBackgroundProps) {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Background Particles */}
      {showParticles && (
        <ParticleBackground 
          opacity={particleOpacity}
          className="fixed inset-0 pointer-events-none z-0"
        />
      )}
      
      {/* Rain Effect */}
      {showRain && (
        <RainEffect 
          opacity={rainOpacity}
          className="fixed inset-0 pointer-events-none z-[1]"
        />
      )}

      {/* Background Image with Overlay */}
      {backgroundImage && (
        <>
          <div
            className="fixed inset-0 z-0 opacity-20 transition-all duration-1000"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          />
          <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-purple-900/20 to-black/90 z-0" />
        </>
      )}

      {/* Cursor Glow Effect */}
      {showCursor && (
        <CursorGlow 
          className="fixed pointer-events-none z-50 rounded-full blur-3xl transition-all duration-300"
          style={{ opacity: cursorOpacity }}
          size={384}
          colors={["#ff00ff", "#00ffff"]}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
