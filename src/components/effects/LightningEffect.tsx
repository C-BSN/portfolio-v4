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
  const [currentColor, setCurrentColor] = useState<'white' | 'pink'>('white')

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

  // Générer des branches secondaires - Optimisé
  const generateBranches = (mainBolt: Point[]): Point[][] => {
    const branches: Point[][] = []
    // Réduire le nombre de branches (1-2 au lieu de 2-4)
    const numBranches = Math.floor(Math.random() * 2) + 1
    
    for (let i = 0; i < numBranches; i++) {
      const branchPoint = mainBolt[Math.floor(Math.random() * (mainBolt.length - 2)) + 1]
      const direction = Math.random() > 0.5 ? 1 : -1
      
      const branch: Point[] = [branchPoint]
      let x = branchPoint.x
      let y = branchPoint.y
      
      // Réduire les segments de branche (2 au lieu de 3)
      for (let j = 0; j < 2; j++) {
        y += 35 + Math.random() * 35
        x += direction * (25 + Math.random() * 35)
        branch.push({ x, y })
      }
      
      branches.push(branch)
    }
    
    return branches
  }

  const drawLightning = (ctx: CanvasRenderingContext2D, points: Point[], width: number, color: 'white' | 'pink') => {
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y)
    }
    
    const colorRgb = color === 'white' ? '255, 255, 255' : '255, 0, 255'
    ctx.strokeStyle = `rgba(${colorRgb}, ${intensity * 0.7})`
    ctx.lineWidth = width
    ctx.shadowBlur = 15
    ctx.shadowColor = `rgba(${colorRgb}, 0.6)`
    ctx.stroke()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
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
    
    window.addEventListener('resize', handleResize)

    const triggerLightning = () => {
      // Position aléatoire en X
      const startX = Math.random() * canvas.width
      const mainBolt = generateLightning(startX, 0, canvas.height * 0.7)
      
      // Réduire le nombre de branches pour les performances
      const branches = Math.random() > 0.5 ? generateBranches(mainBolt) : []
      
      // Alterner la couleur à chaque éclair
      setCurrentColor(prev => prev === 'white' ? 'pink' : 'white')
      
      setLightningBolts([mainBolt, ...branches])
      setIsFlashing(true)

      // Flash rapide simplifié (pas de double flash)
      setTimeout(() => {
        setIsFlashing(false)
        setLightningBolts([])
      }, 80)
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
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', handleResize)
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
      drawLightning(ctx, lightningBolts[0], 4, currentColor)
      
      // Branches (plus fines)
      for (let i = 1; i < lightningBolts.length; i++) {
        drawLightning(ctx, lightningBolts[i], 2, currentColor)
      }
    }
  }, [lightningBolts, isFlashing, intensity, currentColor])

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
            animate={{ opacity: currentColor === 'white' ? 0.2 : 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
            className="absolute inset-0 pointer-events-none"
            style={{ 
              mixBlendMode: 'screen',
              backgroundColor: currentColor === 'white' ? '#ffffff' : '#ff00ff'
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
