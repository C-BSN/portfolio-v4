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

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true })
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    
    // Debounce du resize pour éviter trop de recalculs
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(resizeCanvas, 250)
    }
    
    window.addEventListener('resize', handleResize, { passive: true })

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
    const targetFPS = 30
    const frameTime = 1000 / targetFPS

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameTime) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.shadowBlur = 0

        drops.forEach(drop => {
          drop.y += drop.speed

          if (drop.y > canvas.height + drop.length) {
            drop.y = -drop.length
            drop.x = Math.random() * canvas.width
            drop.speed = Math.random() * 6 + 3
          }

          ctx.strokeStyle = `rgba(200, 220, 255, ${drop.opacity * 0.6})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(drop.x, drop.y)
          ctx.lineTo(drop.x, drop.y + drop.length)
          ctx.stroke()
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
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', handleResize)
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
