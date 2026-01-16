'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface GlitchCardProps {
  children: React.ReactNode
  className?: string
  glitchIntensity?: 'low' | 'medium' | 'high'
  autoGlitch?: boolean
  glitchInterval?: number
}

export function GlitchCard({ 
  children, 
  className = '', 
  glitchIntensity = 'medium',
  autoGlitch = true,
  glitchInterval = 3000
}: GlitchCardProps) {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    if (!autoGlitch) return

    const interval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 500)
    }, glitchInterval)

    return () => clearInterval(interval)
  }, [autoGlitch, glitchInterval])

  const handleMouseEnter = () => {
    if (!autoGlitch) {
      setIsGlitching(true)
    }
  }

  const handleMouseLeave = () => {
    if (!autoGlitch) {
      setIsGlitching(false)
    }
  }

  return (
    <div 
      className={`glitch-container ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card className={`
        glitch-card
        ${isGlitching ? `glitch-active glitch-${glitchIntensity}` : ''}
        bg-black/70 
        border-cyan-400/30 
        backdrop-blur-sm
        relative
        overflow-hidden
        transition-all
        duration-300
        hover:border-cyan-400/60
        hover:shadow-lg
        hover:shadow-cyan-400/20
      `}>
        <CardContent className="p-6 relative z-10">
          {children}
        </CardContent>
        
        {/* Glitch overlay effects */}
        <div className={`
          glitch-overlay-1
          absolute inset-0 
          bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0
          opacity-0
          ${isGlitching ? 'animate-glitch-1' : ''}
        `} />
        
        <div className={`
          glitch-overlay-2
          absolute inset-0 
          bg-gradient-to-l from-pink-500/0 via-pink-500/10 to-pink-500/0
          opacity-0
          ${isGlitching ? 'animate-glitch-2' : ''}
        `} />
        
        <div className={`
          glitch-overlay-3
          absolute inset-0 
          bg-gradient-to-t from-purple-500/0 via-purple-500/5 to-purple-500/0
          opacity-0
          ${isGlitching ? 'animate-glitch-3' : ''}
        `} />
      </Card>
    </div>
  )
}












