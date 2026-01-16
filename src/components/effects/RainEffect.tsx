"use client"

import { useEffect, useRef } from "react"

type RainDrop = {
  id: number
  x: number
  y: number
  speed: number
  length: number
  opacity: number
}

interface RainEffectProps {
  className?: string
  opacity?: number
  dropCount?: number
}

export function RainEffect({ 
  className = "fixed inset-0 pointer-events-none z-[1] opacity-60",
  opacity = 0.6,
  dropCount = 150
}: RainEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize rain drops
    const drops: RainDrop[] = []
    for (let i = 0; i < dropCount; i++) {
      drops.push({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        speed: Math.random() * 8 + 4,
        length: Math.random() * 30 + 10,
        opacity: Math.random() * 0.6 + 0.2
      })
    }

    let lastTime = 0
    const targetFPS = 60
    const frameTime = 1000 / targetFPS

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameTime) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        drops.forEach(drop => {
          drop.y += drop.speed

          // Reset drop when it goes off screen
          if (drop.y > canvas.height + drop.length) {
            drop.y = -drop.length
            drop.x = Math.random() * canvas.width
            drop.speed = Math.random() * 8 + 4
          }

          // Draw rain drop with neon effect
          const gradient = ctx.createLinearGradient(drop.x, drop.y, drop.x, drop.y + drop.length)
          gradient.addColorStop(0, `rgba(0, 255, 255, 0)`)
          gradient.addColorStop(0.5, `rgba(0, 255, 255, ${drop.opacity})`)
          gradient.addColorStop(1, `rgba(255, 0, 255, ${drop.opacity * 0.7})`)

          ctx.strokeStyle = gradient
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(drop.x, drop.y)
          ctx.lineTo(drop.x, drop.y + drop.length)
          ctx.stroke()

          // Add glow effect
          ctx.shadowColor = '#00ffff'
          ctx.shadowBlur = 3
          ctx.strokeStyle = `rgba(0, 255, 255, ${drop.opacity * 0.3})`
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(drop.x, drop.y)
          ctx.lineTo(drop.x, drop.y + drop.length)
          ctx.stroke()
          ctx.shadowBlur = 0
        })

        lastTime = currentTime
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [dropCount])

  return (
    <canvas 
      ref={canvasRef} 
      className={className}
      style={{ opacity }}
    />
  )
}
