"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface NeonTitleProps {
  children: React.ReactNode
  as?: "h1" | "h2" | "h3" | "h4"
  className?: string
  style?: React.CSSProperties
  filled?: boolean
  noAnimation?: boolean
}

export function NeonTitle({ 
  children, 
  as: Component = "h1", 
  className = "",
  style = {},
  filled = false,
  noAnimation = false
}: NeonTitleProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const isDark = !mounted || resolvedTheme === 'dark'

  let cssClass: string
  let baseStyle: React.CSSProperties

  if (isDark) {
    cssClass = noAnimation
      ? (filled ? 'title-pink-solid' : '')
      : (filled ? 'neon-title-filled' : 'neon-title')
    baseStyle = noAnimation
      ? (filled ? { color: '#ff0080' } : { color: '#F0F0F0' })
      : {}
  } else {
    // Thème jour : long shadow pour H1, sparkle jour pour filled/H2
    cssClass = noAnimation
      ? (filled ? 'title-orange-solid' : '')
      : (filled ? 'neon-title-filled-day' : 'long-shadow-title')
    baseStyle = noAnimation
      ? (filled ? { color: '#f97316' } : { color: '#1a2f5a' })
      : {}
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Component
        className={`${cssClass} ${className}`}
        style={{
          ...style,
          ...baseStyle,
          fontFamily: "'Oswald', sans-serif",
        }}
      >
        {children}
      </Component>
    </motion.div>
  )
}
