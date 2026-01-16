"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface LightningEffectProps {
  className?: string
  frequency?: number
  intensity?: number
}

interface Point {
  x: number
  y: number
}

export function LightningEffect({ 
  className = "fixed inset-0 pointer-events-none z-[2]",
  frequency = 8,
  intensity = 0.8
}: LightningEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isFlashing, setIsFlashing] = useState(false)
  const [lightningBolts, setLightningBolts] = useState<Point[][]>([])

  // Générer un éclair en zigzag
  const generateLightning = (startX: number, startY: number, endY: number): Point[] => {
    const points: Point[] = [{ x: startX, y: startY }]
    let currentY = startY
    let currentX = startX
    
    while (currentY < endY) {
      // Avancer verticalement
      currentY += 40 + Math.random() * 60
      // Zigzag horizontal
      currentX += (Math.random() - 0.5) * 100
      
      if (currentY < endY) {
        points.push({ x: currentX, y: currentY })
      }
    }
    
    points.push({ x: currentX, y: endY })
    return points
  }

  // Générer des branches secondaires
  const generateBranches = (mainBolt: Point[]): Point[][] => {
    const branches: Point[][] = []
    const numBranches = Math.floor(Math.random() * 3) + 1
    
    for (let i = 0; i < numBranches; i++) {
      const branchPoint = mainBolt[Math.floor(Math.random() * (mainBolt.length - 2)) + 1]
      const branchLength = Math.random() * 150 + 50
      const direction = Math.random() > 0.5 ? 1 : -1
      
      const branch: Point[] = [branchPoint]
      let x = branchPoint.x
      let y = branchPoint.y
      
      for (let j = 0; j < 3; j++) {
        y += 30 + Math.random() * 40
        x += direction * (20 + Math.random() * 40)
        branch.push({ x, y })
      }
      
      branches.push(branch)
    }
    
    return branches
  }

  // Dessiner un éclair
  const drawLightning = (ctx: CanvasRenderingContext2D, points: Point[], width: number) => {
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y)
    }
    
    ctx.strokeStyle = `rgba(255, 255, 255, ${intensity})`
    ctx.lineWidth = width
    ctx.shadowBlur = 20
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'
    ctx.stroke()
  }

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

    const triggerLightning = () => {
      // Position aléatoire en X
      const startX = Math.random() * canvas.width
      const mainBolt = generateLightning(startX, 0, canvas.height * 0.7)
      const branches = generateBranches(mainBolt)
      
      setLightningBolts([mainBolt, ...branches])
      setIsFlashing(true)

      // Flash rapide
      setTimeout(() => {
        setIsFlashing(false)
        
        // Deuxième flash (optionnel)
        if (Math.random() > 0.5) {
          setTimeout(() => {
            setIsFlashing(true)
            setTimeout(() => {
              setIsFlashing(false)
              setLightningBolts([])
            }, 50)
          }, 100)
        } else {
          setLightningBolts([])
        }
      }, 100)
    }

    const scheduleNextLightning = () => {
      const delay = (frequency + (Math.random() * frequency)) * 1000
      return setTimeout(() => {
        triggerLightning()
        scheduleNextLightning()
      }, delay)
    }

    const timeout = scheduleNextLightning()

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [frequency, intensity])

  // Dessiner les éclairs sur le canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (lightningBolts.length > 0 && isFlashing) {
      // Éclair principal (plus épais)
      drawLightning(ctx, lightningBolts[0], 4)
      
      // Branches (plus fines)
      for (let i = 1; i < lightningBolts.length; i++) {
        drawLightning(ctx, lightningBolts[i], 2)
      }
    }
  }, [lightningBolts, isFlashing, intensity])

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
      
      {/* Flash de lumière en arrière-plan */}
      <AnimatePresence>
        {isFlashing && (
          <motion.div
            key={Math.random()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
            className="absolute inset-0 bg-white pointer-events-none"
            style={{ mixBlendMode: 'screen' }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
