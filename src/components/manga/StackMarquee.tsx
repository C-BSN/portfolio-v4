'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface StackMarqueeProps {
  stack: string[]
}

export default function StackMarquee({ stack }: StackMarqueeProps) {
  const [isGlowing, setIsGlowing] = useState(false)
  const [currentColor, setCurrentColor] = useState<'pink' | 'cyan'>('pink')

  // Effet néon scintillant
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsGlowing(true)
        setCurrentColor(prev => prev === 'pink' ? 'cyan' : 'pink')
        
        setTimeout(() => {
          setIsGlowing(false)
        }, 150 + Math.random() * 200)
      }
    }, 300 + Math.random() * 700)

    return () => clearInterval(interval)
  }, [])

  // Styles néon pour les astérisques
  const pinkStyle = {
    color: '#ff0080',
    textShadow: `
      0 0 10px #ff0080,
      0 0 20px #ff0080,
      0 0 30px #ff0080
    `,
  }

  const cyanStyle = {
    color: '#00f3ff',
    textShadow: `
      0 0 10px #00f3ff,
      0 0 20px #00f3ff,
      0 0 30px #00f3ff
    `,
  }

  const baseStyle = {
    color: '#ff0080',
    textShadow: `
      0 0 5px #ff0080,
      0 0 10px #ff0080
    `,
  }

  const glowStyle = currentColor === 'pink' ? pinkStyle : cyanStyle

  // Repeat the stack list multiple times to ensure no gaps
  const repeatedStack = [
    ...stack,
    ...stack,
    ...stack,
    ...stack,
  ]

  // Create the marquee text with separators
  const marqueeText = repeatedStack.map((tech, index) => (
    <span key={index} className="inline-flex items-center">
      <span className="uppercase">{tech}</span>
      <span 
        className="mx-6" 
        style={{
          ...(isGlowing ? glowStyle : baseStyle),
          transition: 'all 0.1s ease-in-out',
        }}
      >
        *
      </span>
    </span>
  ))

  return (
    <section className="relative w-full overflow-hidden border-y border-white/20 py-6 bg-[#050505]">
      <div className="flex">
        {/* First marquee line */}
        <motion.div
          className="flex whitespace-nowrap text-4xl font-bold"
          animate={{
            x: [0, -1920], // Adjust based on content width
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {marqueeText}
        </motion.div>

        {/* Duplicate for seamless loop */}
        <motion.div
          className="flex whitespace-nowrap text-4xl font-bold"
          animate={{
            x: [0, -1920],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {marqueeText}
        </motion.div>
      </div>
    </section>
  )
}
