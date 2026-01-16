"use client"

import { useEffect, useState } from "react"

interface TypewriterTextProps {
  text: string
  delay?: number
  speed?: number
  showCursor?: boolean
  className?: string
}

export function TypewriterText({ 
  text, 
  delay = 0, 
  speed = 50,
  showCursor = true,
  className = ""
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(delayTimer)
  }, [delay])

  useEffect(() => {
    if (!isVisible) return

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, speed)

      return () => clearTimeout(timer)
    }
  }, [currentIndex, text, isVisible, speed])

  return (
    <span className={className}>
      {displayText}
      {showCursor && <span className="animate-pulse">|</span>}
    </span>
  )
}

interface NeonTextProps {
  children: React.ReactNode
  className?: string
  color?: string
  glowIntensity?: 'low' | 'medium' | 'high'
}

export function NeonText({ 
  children, 
  className = "", 
  color = "#00ffff",
  glowIntensity = "medium"
}: NeonTextProps) {
  const glowStyles = {
    low: `0 0 5px ${color}, 0 0 10px ${color}`,
    medium: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`,
    high: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}, 0 0 40px ${color}`
  }

  return (
    <span 
      className={`neon-text ${className}`}
      style={{
        textShadow: glowStyles[glowIntensity],
        animation: "neon-flicker 3s infinite alternate ease-in-out"
      }}
    >
      {children}
    </span>
  )
}

interface GlitchTextProps {
  children: React.ReactNode
  className?: string
  intensity?: 'low' | 'medium' | 'high'
}

export function GlitchText({ 
  children, 
  className = "",
  intensity = "medium"
}: GlitchTextProps) {
  const animationDurations = {
    low: "6s",
    medium: "4s", 
    high: "2s"
  }

  return (
    <span 
      className={`glitch-text relative ${className}`}
      style={{
        animation: `glitch ${animationDurations[intensity]} infinite ease-in-out`
      }}
    >
      {children}
    </span>
  )
}
