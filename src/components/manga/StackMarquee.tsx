'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

interface StackMarqueeProps {
  stack: string[]
}

export default function StackMarquee({ stack }: StackMarqueeProps) {
  const [isGlowing, setIsGlowing] = useState(false)
  const [currentColor, setCurrentColor] = useState<'pink' | 'cyan'>('pink')
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => { setMounted(true) }, [])

  const isDark = !mounted || resolvedTheme === 'dark'

  // Neon flicker — dark mode only
  useEffect(() => {
    if (!isDark) return
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsGlowing(true)
        setCurrentColor(prev => prev === 'pink' ? 'cyan' : 'pink')
        setTimeout(() => setIsGlowing(false), 150 + Math.random() * 200)
      }
    }, 300 + Math.random() * 700)
    return () => clearInterval(interval)
  }, [isDark])

  // Dark mode: neon pink/cyan
  const darkPinkStyle = { color: '#ff0080', textShadow: '0 0 10px #ff0080, 0 0 20px #ff0080, 0 0 30px #ff0080' }
  const darkCyanStyle = { color: '#00f3ff', textShadow: '0 0 10px #00f3ff, 0 0 20px #00f3ff, 0 0 30px #00f3ff' }
  const darkBaseStyle = { color: '#ff0080', textShadow: '0 0 5px #ff0080, 0 0 10px #ff0080' }
  const darkGlowStyle = currentColor === 'pink' ? darkPinkStyle : darkCyanStyle

  // Light mode: rose, no glow
  const lightBaseStyle = { color: '#c45880' }
  const lightGlowStyle = currentColor === 'pink' ? { color: '#c45880' } : { color: '#f4acc6' }

  const getAsteriskStyle = () => {
    if (isDark) return isGlowing ? darkGlowStyle : darkBaseStyle
    return isGlowing ? lightGlowStyle : lightBaseStyle
  }

  const repeatedStack = [...stack, ...stack, ...stack, ...stack]

  const marqueeText = repeatedStack.map((tech, index) => (
    <span key={index} className="inline-flex items-center">
      <span className="uppercase">{tech}</span>
      <span
        className="mx-6"
        style={{ ...getAsteriskStyle(), transition: 'all 0.1s ease-in-out' }}
      >
        *
      </span>
    </span>
  ))

  return (
    <section className={`relative w-full overflow-hidden py-6 border-y transition-colors duration-300 ${
      isDark
        ? 'bg-[#050505] border-white/20'
        : 'bg-white/50 backdrop-blur-sm border-[#1a2f5a]/20'
    }`}>
      <div className="flex">
        <motion.div
          className="flex whitespace-nowrap text-4xl font-bold"
          animate={{ x: [0, -1920] }}
          transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 30, ease: "linear" } }}
        >
          {marqueeText}
        </motion.div>
        <motion.div
          className="flex whitespace-nowrap text-4xl font-bold"
          animate={{ x: [0, -1920] }}
          transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 30, ease: "linear" } }}
        >
          {marqueeText}
        </motion.div>
      </div>
    </section>
  )
}
