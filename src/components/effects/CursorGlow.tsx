"use client"

import { useEffect, useState } from "react"

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
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
        ...style
      }}
    />
  )
}
