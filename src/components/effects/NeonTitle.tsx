"use client"

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
  const cssClass = noAnimation
    ? (filled ? 'title-pink-solid' : '')
    : (filled ? 'neon-title-filled' : 'neon-title')

  const baseStyle = noAnimation
    ? (filled ? { color: '#ff0080' } : { color: '#F0F0F0' })
    : {}

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
