"use client"

import { motion } from "framer-motion"
import { useEffect, useState, useMemo, useCallback } from "react"

interface NeonTitleProps {
  children: React.ReactNode
  as?: "h1" | "h2" | "h3" | "h4"
  className?: string
  style?: React.CSSProperties
  filled?: boolean // Pour les petits titres - remplis au lieu de outline
  noAnimation?: boolean // Pour désactiver l'animation (rose uni)
}

export function NeonTitle({ 
  children, 
  as: Component = "h1", 
  className = "",
  style = {},
  filled = false,
  noAnimation = false
}: NeonTitleProps) {
  const [isGlowing, setIsGlowing] = useState(false)
  const [currentColor, setCurrentColor] = useState<'pink' | 'cyan'>('pink')

  useEffect(() => {
    if (noAnimation) return // Pas d'animation si noAnimation est true
    
    // Intervalle plus espacé pour réduire les re-renders
    const interval = setInterval(() => {
      // Probabilité réduite de scintillement (de 0.3 à 0.15)
      if (Math.random() > 0.85) {
        setIsGlowing(true)
        // Alterner entre rose et cyan
        setCurrentColor(prev => prev === 'pink' ? 'cyan' : 'pink')
        
        setTimeout(() => {
          setIsGlowing(false)
        }, 150)
      }
    }, 800) // Fréquence fixe et plus espacée

    return () => clearInterval(interval)
  }, [noAnimation])

  // Mémoïser les styles pour éviter les recalculs
  const styles = useMemo(() => {
    // Styles pour contours (grands titres)
    const pinkOutlineStyle = {
      color: 'transparent',
      WebkitTextStroke: '3px #ff0080',
      textStroke: '3px #ff0080',
    }

    const cyanOutlineStyle = {
      color: 'transparent',
      WebkitTextStroke: '3px #00f3ff',
      textStroke: '3px #00f3ff',
    }

    const baseOutlineStyle = {
      color: 'transparent',
      WebkitTextStroke: '3px #ff0080',
      textStroke: '3px #ff0080',
    }

    // Styles pour remplis (petits titres)
    const pinkFilledStyle = {
      color: '#ff0080',
    }

    const cyanFilledStyle = {
      color: '#00f3ff',
    }

    const baseFilledStyle = {
      color: '#ff0080',
    }

    return {
      pinkOutlineStyle,
      cyanOutlineStyle,
      baseOutlineStyle,
      pinkFilledStyle,
      cyanFilledStyle,
      baseFilledStyle
    }
  }, [])

  // Calculer le style actif
  const activeStyle = useMemo(() => {
    if (noAnimation) {
      return filled ? styles.baseFilledStyle : styles.baseOutlineStyle
    }

    if (!isGlowing) {
      return filled ? styles.baseFilledStyle : styles.baseOutlineStyle
    }

    const glowStyle = filled 
      ? (currentColor === 'pink' ? styles.pinkFilledStyle : styles.cyanFilledStyle)
      : (currentColor === 'pink' ? styles.pinkOutlineStyle : styles.cyanOutlineStyle)
    
    return glowStyle
  }, [noAnimation, filled, isGlowing, currentColor, styles])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Component
        className={className}
        style={{
          ...style,
          ...activeStyle,
          transition: noAnimation ? 'none' : 'all 0.1s ease-in-out',
          fontFamily: "'Oswald', sans-serif",
        }}
      >
        {children}
      </Component>
    </motion.div>
  )
}
