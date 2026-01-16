"use client"

import { useEffect, useRef } from "react"

type RainDrop = {
  x: number
  y: number
  radius: number
  speed: number
  opacity: number
  life: number
  maxLife: number
  vx: number // horizontal velocity for realistic movement
  vy: number // vertical velocity
  mass: number // for physics simulation
  isMoving: boolean // whether the drop is actively flowing
  trail: Array<{x: number, y: number, opacity: number}> // trail points
}

interface GlassRainEffectProps {
  className?: string
  opacity?: number
  dropCount?: number
  intensity?: number
}

export function GlassRainEffect({ 
  className = "fixed inset-0 pointer-events-none z-20",
  opacity = 0.8,
  dropCount = 80,
  intensity = 1
}: GlassRainEffectProps) {
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

    // Initialize water droplets on glass
    const drops: RainDrop[] = []
    
    // Create initial drops with realistic physics
    const createDrop = (isStatic = false) => {
      const radius = Math.random() * 4 + 1
      const mass = radius * radius // mass proportional to area
      
      return {
        x: Math.random() * canvas.width,
        y: isStatic ? Math.random() * canvas.height : Math.random() * canvas.height * 0.1,
        radius,
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        life: 0,
        maxLife: Math.random() * 500 + 300,
        vx: (Math.random() - 0.5) * 0.5, // slight horizontal movement
        vy: isStatic ? 0 : Math.random() * 0.5 + 0.2,
        mass,
        isMoving: !isStatic && Math.random() > 0.3,
        trail: []
      }
    }

    // Create mix of static and moving drops
    for (let i = 0; i < dropCount; i++) {
      drops.push(createDrop(Math.random() > 0.6)) // 40% static, 60% moving
    }

    let lastTime = 0
    const targetFPS = 24 // Reduced FPS for better performance
    const frameTime = 1000 / targetFPS

    const drawDrop = (drop: RainDrop) => {
      const { x, y, radius, opacity, isMoving } = drop
      
      // Draw trail first (behind the drop)
      if (drop.trail.length > 1) {
        drawTrail(drop)
      }
      
      // Shadow/depth effect
      ctx.beginPath()
      ctx.ellipse(x + 1, y + 1, radius * 0.8, radius, 0, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0, 0, 0, ${opacity * 0.15})`
      ctx.fill()
      
      // Main drop body with realistic water effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 1.5)
      if (isMoving) {
        // Moving drops are more elongated and transparent
        gradient.addColorStop(0, `rgba(180, 200, 255, ${opacity * 0.7})`)
        gradient.addColorStop(0.4, `rgba(120, 160, 255, ${opacity * 0.5})`)
        gradient.addColorStop(0.8, `rgba(80, 120, 200, ${opacity * 0.2})`)
        gradient.addColorStop(1, `rgba(40, 80, 160, 0)`)
      } else {
        // Static drops are more opaque and defined
        gradient.addColorStop(0, `rgba(220, 240, 255, ${opacity * 0.9})`)
        gradient.addColorStop(0.3, `rgba(180, 210, 255, ${opacity * 0.7})`)
        gradient.addColorStop(0.7, `rgba(120, 160, 220, ${opacity * 0.4})`)
        gradient.addColorStop(1, `rgba(60, 100, 180, ${opacity * 0.1})`)
      }
      
      // Draw drop shape (more elongated for moving drops)
      ctx.beginPath()
      if (isMoving && drop.vy > 0.5) {
        // Elongated teardrop shape for fast-moving drops
        ctx.ellipse(x, y, radius * 0.7, radius * 1.3, 0, 0, Math.PI * 2)
      } else {
        ctx.arc(x, y, radius, 0, Math.PI * 2)
      }
      ctx.fillStyle = gradient
      ctx.fill()
      
      // Highlight effect (light reflection) - more realistic positioning
      const highlightSize = radius * 0.3
      const highlightX = x - radius * 0.2
      const highlightY = y - radius * 0.3
      
      const highlightGradient = ctx.createRadialGradient(
        highlightX, highlightY, 0,
        highlightX, highlightY, highlightSize
      )
      highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.9})`)
      highlightGradient.addColorStop(0.6, `rgba(255, 255, 255, ${opacity * 0.3})`)
      highlightGradient.addColorStop(1, `rgba(255, 255, 255, 0)`)
      
      ctx.beginPath()
      ctx.arc(highlightX, highlightY, highlightSize, 0, Math.PI * 2)
      ctx.fillStyle = highlightGradient
      ctx.fill()
      
      // Secondary smaller highlight for more realism
      ctx.beginPath()
      ctx.arc(x + radius * 0.1, y + radius * 0.1, radius * 0.15, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.4})`
      ctx.fill()
    }

    const drawTrail = (drop: RainDrop) => {
      if (drop.trail.length < 2) return
      
      ctx.strokeStyle = 'transparent'
      ctx.fillStyle = 'transparent'
      
      // Draw trail as connected segments
      for (let i = 0; i < drop.trail.length - 1; i++) {
        const current = drop.trail[i]
        const next = drop.trail[i + 1]
        const progress = i / drop.trail.length
        const width = (1 - progress) * drop.radius * 0.6
        const opacity = current.opacity * (1 - progress) * 0.4
        
        if (opacity > 0.05) {
          const gradient = ctx.createLinearGradient(
            current.x, current.y,
            next.x, next.y
          )
          gradient.addColorStop(0, `rgba(150, 180, 255, ${opacity})`)
          gradient.addColorStop(1, `rgba(100, 150, 200, ${opacity * 0.7})`)
          
          ctx.beginPath()
          ctx.moveTo(current.x, current.y)
          ctx.lineTo(next.x, next.y)
          ctx.strokeStyle = gradient
          ctx.lineWidth = width
          ctx.lineCap = 'round'
          ctx.stroke()
        }
      }
    }

    // Function to check if two drops should merge
    const shouldMerge = (drop1: RainDrop, drop2: RainDrop) => {
      const dx = drop1.x - drop2.x
      const dy = drop1.y - drop2.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const minDistance = (drop1.radius + drop2.radius) * 0.8
      return distance < minDistance && Math.abs(dy) < drop1.radius
    }

    // Function to merge two drops
    const mergeDrops = (drop1: RainDrop, drop2: RainDrop) => {
      const totalMass = drop1.mass + drop2.mass
      const newRadius = Math.sqrt(totalMass)
      
      return {
        ...drop1,
        x: (drop1.x * drop1.mass + drop2.x * drop2.mass) / totalMass,
        y: (drop1.y * drop1.mass + drop2.y * drop2.mass) / totalMass,
        radius: Math.min(newRadius, 8), // Max radius limit
        mass: totalMass,
        opacity: Math.min((drop1.opacity + drop2.opacity) / 2, 0.9),
        vy: (drop1.vy * drop1.mass + drop2.vy * drop2.mass) / totalMass,
        vx: (drop1.vx * drop1.mass + drop2.vx * drop2.mass) / totalMass,
        isMoving: drop1.isMoving || drop2.isMoving || newRadius > 4,
        life: Math.min(drop1.life, drop2.life),
        maxLife: Math.max(drop1.maxLife, drop2.maxLife)
      }
    }

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameTime) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Update drops with realistic physics
        for (let i = drops.length - 1; i >= 0; i--) {
          const drop = drops[i]
          drop.life++
          
          // Physics simulation for moving drops
          if (drop.isMoving) {
            // Gravity effect
            drop.vy += 0.02 * drop.mass * intensity
            
            // Surface tension and friction
            drop.vx *= 0.98
            drop.vy *= 0.99
            
            // Wind resistance (larger drops affected more)
            const resistance = 1 - (drop.radius * 0.001)
            drop.vy *= resistance
            
            // Update position
            drop.x += drop.vx
            drop.y += drop.vy
            
            // Add to trail
            if (drop.vy > 0.1) {
              drop.trail.push({
                x: drop.x,
                y: drop.y,
                opacity: drop.opacity
              })
              
              // Limit trail length
              if (drop.trail.length > 15) {
                drop.trail.shift()
              }
            }
            
            // Slow down when reaching certain size or speed
            if (drop.radius > 3 && Math.random() < 0.05) {
              drop.isMoving = false
              drop.vy = 0
              drop.vx = 0
              drop.trail = []
            }
          } else {
            // Static drops grow slowly
            if (drop.life < drop.maxLife * 0.6 && drop.radius < 5) {
              drop.radius += 0.005
              drop.mass = drop.radius * drop.radius
            }
            
            // Chance to start moving if big enough
            if (drop.radius > 2.5 && Math.random() < 0.002) {
              drop.isMoving = true
              drop.vy = 0.1
              drop.vx = (Math.random() - 0.5) * 0.2
            }
          }
          
          // Boundary conditions
          if (drop.x < 0 || drop.x > canvas.width || drop.y > canvas.height + 20) {
            drops[i] = createDrop(Math.random() > 0.7)
            continue
          }
          
          // Check for merging with nearby drops (less frequently for performance)
          if (drop.life % 5 === 0) { // Only check every 5 frames
            for (let j = i + 1; j < drops.length; j++) {
              if (shouldMerge(drop, drops[j])) {
                const merged = mergeDrops(drop, drops[j])
                drops[i] = merged
                drops.splice(j, 1)
                break
              }
            }
          }
        }

        // Draw all drops
        drops.forEach(drop => {
          drawDrop(drop)
        })

        // Randomly create new drops
        if (Math.random() < 0.08 * intensity && drops.length < dropCount * 1.2) {
          drops.push(createDrop(Math.random() > 0.8))
        }

        // Remove old drops occasionally to maintain performance
        if (drops.length > dropCount * 1.5) {
          drops.splice(dropCount, drops.length - dropCount)
        }

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
  }, [dropCount, intensity])

  return (
    <canvas 
      ref={canvasRef} 
      className={className}
      style={{ opacity }}
    />
  )
}
