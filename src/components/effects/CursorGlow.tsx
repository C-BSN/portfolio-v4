"use client"

import { useEffect, useState, useRef } from "react"

interface CursorGlowProps {
  className?: string
  size?: number
  colors?: string[]
  style?: React.CSSProperties
}

export function CursorGlow({ 
  className = "fixed pointer-events-none z-50 rounded-full opacity-20 blur-3xl transition-all duration-300",
  size = 384, // 96 * 4 = 384px (w-96)
  colors = ["#ff00ff", "#00ffff"],
  style = {}
}: CursorGlowProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const rafIdRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)

  useEffect(() => {
    // Throttle à 30fps pour l'effet cursor (économie de ressources)
    const throttleDelay = 1000 / 30

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      
      if (now - lastTimeRef.current >= throttleDelay) {
        lastTimeRef.current = now
        
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current)
        }
        
        rafIdRef.current = requestAnimationFrame(() => {
          setMousePosition({ x: e.clientX, y: e.clientY })
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  const gradientColors = colors.length >= 2 
    ? `${colors[0]} 0%, ${colors[1]} 50%, transparent 70%`
    : `${colors[0] || '#ff00ff'} 0%, #00ffff 50%, transparent 70%`

  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, ${gradientColors})`,
        left: mousePosition.x - size / 2,
        top: mousePosition.y - size / 2,
        willChange: 'transform',
        ...style
      }}
    />
  )
}
