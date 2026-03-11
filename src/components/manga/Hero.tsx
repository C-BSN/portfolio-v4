'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

interface HeroData {
  title: string
  subtitle: string
  location: string
  status: string
}

interface HeroProps {
  data: HeroData
}

export default function Hero({ data }: HeroProps) {
  const containerRef = useRef(null)
  const [isGlowing, setIsGlowing] = useState(false)
  const [currentColor, setCurrentColor] = useState<'pink' | 'cyan'>('pink')
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => { setMounted(true) }, [])

  const { scrollY } = useScroll()
  const titleScale = useTransform(scrollY, [0, 500], [1, 1.5])
  const titleOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const letterSpacing = useTransform(scrollY, [0, 500], [0, 50])

  const isDark = !mounted || resolvedTheme === 'dark'

  // Neon flicker effect — only active in dark mode
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  }
  const wordVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95] as const } }
  }
  const subtitleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.8, ease: [0.6, 0.01, 0.05, 0.95] as const } }
  }

  const titleWords = data.title.split(' ')

  // Dark mode: neon text-stroke styles
  const pinkStyle = { color: 'transparent', WebkitTextStroke: '3px #ff0080', textStroke: '3px #ff0080' }
  const cyanStyle = { color: 'transparent', WebkitTextStroke: '3px #00f3ff', textStroke: '3px #00f3ff' }
  const darkBaseStyle = { color: 'transparent', WebkitTextStroke: '3px #ff0080', textStroke: '3px #ff0080' }
  const glowStyle = currentColor === 'pink' ? pinkStyle : cyanStyle

  // Light mode: solid navy + long shadow (via CSS class)
  const lightTitleStyle = { color: '#1a2f5a' }

  const getTitleStyle = () => {
    if (!isDark) return lightTitleStyle
    return isGlowing ? glowStyle : darkBaseStyle
  }

  const getTitleClass = () => {
    if (!isDark) return 'long-shadow-title'
    return ''
  }

  return (
    <section
      ref={containerRef}
      className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Main Title */}
      <motion.div
        className="flex flex-wrap items-center justify-center gap-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ scale: titleScale, opacity: titleOpacity }}
      >
        {titleWords.map((word, index) => (
          <motion.h1
            key={index}
            variants={wordVariants}
            className={`text-[12vw] font-bold uppercase leading-none ${getTitleClass()}`}
            style={{
              ...(isDark ? getTitleStyle() : lightTitleStyle),
              transition: 'all 0.1s ease-in-out',
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 700,
              letterSpacing: `${index === 0 ? 0 : letterSpacing}px`
            }}
          >
            {word}
          </motion.h1>
        ))}
      </motion.div>

      {/* Subtitle */}
      <motion.div
        variants={subtitleVariants}
        initial="hidden"
        animate="visible"
        className={`px-6 py-3 relative border ${isDark ? 'border-[#F0F0F0]' : 'border-[#1a2f5a] bg-white/40 backdrop-blur-sm'}`}
      >
        <motion.p
          className="text-sm md:text-base tracking-[0.3em] font-normal uppercase"
          style={{ letterSpacing: '0.3em' }}
        >
          {data.subtitle}
        </motion.p>
        {/* Corner decorations */}
        <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 -translate-x-[2px] -translate-y-[2px] ${isDark ? 'border-[#F0F0F0]' : 'border-[#1a2f5a]'}`} />
        <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 translate-x-[2px] -translate-y-[2px] ${isDark ? 'border-[#F0F0F0]' : 'border-[#1a2f5a]'}`} />
        <div className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 -translate-x-[2px] translate-y-[2px] ${isDark ? 'border-[#F0F0F0]' : 'border-[#1a2f5a]'}`} />
        <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 translate-x-[2px] translate-y-[2px] ${isDark ? 'border-[#F0F0F0]' : 'border-[#1a2f5a]'}`} />
      </motion.div>

      {/* Location & Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className={`absolute bottom-12 flex items-center gap-4 text-xs md:text-sm tracking-wider opacity-70 ${!isDark ? 'bg-white/40 backdrop-blur-sm px-4 py-1' : ''}`}
      >
        <span>{data.location}</span>
        <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-[#F0F0F0]' : 'bg-[#1a2f5a]'}`} />
        <span>{data.status}</span>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6, repeat: Infinity, repeatType: "reverse", repeatDelay: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className={`w-[1px] h-12 bg-gradient-to-b from-transparent to-transparent ${isDark ? 'via-[#F0F0F0]' : 'via-[#1a2f5a]'}`} />
      </motion.div>
    </section>
  )
}
