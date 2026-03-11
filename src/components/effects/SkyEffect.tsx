"use client"

import { useEffect, useRef } from "react"

interface Cloud {
  x: number
  y: number
  speed: number
  scale: number
  opacity: number
}

interface SkyEffectProps {
  className?: string
}

function drawCloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  opacity: number
) {
  ctx.save()
  ctx.globalAlpha = opacity
  ctx.fillStyle = "rgba(255, 255, 255, 0.92)"

  const s = scale
  ctx.beginPath()
  // Corps principal du nuage : série de cercles qui se chevauchent
  ctx.arc(x, y, 28 * s, 0, Math.PI * 2)
  ctx.arc(x + 32 * s, y - 14 * s, 22 * s, 0, Math.PI * 2)
  ctx.arc(x + 62 * s, y - 8 * s, 26 * s, 0, Math.PI * 2)
  ctx.arc(x + 88 * s, y, 20 * s, 0, Math.PI * 2)
  ctx.arc(x + 44 * s, y + 10 * s, 24 * s, 0, Math.PI * 2)
  ctx.fill()

  // Légère ombre sous le nuage pour la profondeur
  ctx.globalAlpha = opacity * 0.12
  ctx.fillStyle = "rgba(100, 140, 180, 1)"
  ctx.beginPath()
  ctx.ellipse(x + 44 * s, y + 28 * s, 60 * s, 8 * s, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

function drawSunAndRays(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  time: number,
  canvasWidth: number
) {
  const numRays = 14
  const rotation = time * 0.00012
  const rayLength = Math.max(canvasWidth * 0.75, 600)

  // Rayons de soleil
  for (let i = 0; i < numRays; i++) {
    const angle = (i / numRays) * Math.PI * 2 + rotation
    const spread = 0.055

    const endX = cx + Math.cos(angle) * rayLength
    const endY = cy + Math.sin(angle) * rayLength

    const gradient = ctx.createLinearGradient(cx, cy, endX, endY)
    gradient.addColorStop(0, "rgba(255, 228, 100, 0.22)")
    gradient.addColorStop(0.4, "rgba(255, 210, 60, 0.10)")
    gradient.addColorStop(1, "rgba(255, 200, 50, 0)")

    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(
      cx + Math.cos(angle - spread) * rayLength,
      cy + Math.sin(angle - spread) * rayLength
    )
    ctx.lineTo(
      cx + Math.cos(angle + spread) * rayLength,
      cy + Math.sin(angle + spread) * rayLength
    )
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()
  }

  // Disque solaire
  const sunGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 55)
  sunGradient.addColorStop(0, "rgba(255, 248, 180, 0.95)")
  sunGradient.addColorStop(0.5, "rgba(255, 220, 60, 0.80)")
  sunGradient.addColorStop(1, "rgba(255, 180, 20, 0)")

  ctx.beginPath()
  ctx.arc(cx, cy, 55, 0, Math.PI * 2)
  ctx.fillStyle = sunGradient
  ctx.fill()
}

export function SkyEffect({ className = "fixed inset-0 pointer-events-none z-[100]" }: SkyEffectProps) {
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

    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(resizeCanvas, 250)
    }
    window.addEventListener("resize", handleResize, { passive: true })

    // Initialisation des nuages
    const clouds: Cloud[] = [
      { x: canvas.width * 0.05, y: canvas.height * 0.08, speed: 0.18, scale: 1.1, opacity: 0.88 },
      { x: canvas.width * 0.3,  y: canvas.height * 0.04, speed: 0.12, scale: 0.85, opacity: 0.75 },
      { x: canvas.width * 0.55, y: canvas.height * 0.12, speed: 0.22, scale: 1.3, opacity: 0.80 },
      { x: canvas.width * 0.75, y: canvas.height * 0.06, speed: 0.15, scale: 0.9, opacity: 0.70 },
      { x: -180,                 y: canvas.height * 0.18, speed: 0.10, scale: 0.7, opacity: 0.60 },
      { x: canvas.width * 0.45, y: canvas.height * 0.22, speed: 0.08, scale: 0.6, opacity: 0.50 },
    ]

    // Soleil : coin supérieur droit, légèrement hors canvas
    const getSunPos = () => ({
      x: canvas.width * 0.88,
      y: -canvas.height * 0.05,
    })

    let lastTime = 0
    const targetFPS = 30
    const frameTime = 1000 / targetFPS

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameTime) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Rayons de soleil en premier (derrière les nuages)
        const { x: sunX, y: sunY } = getSunPos()
        drawSunAndRays(ctx, sunX, sunY, currentTime, canvas.width)

        // Nuages
        clouds.forEach(cloud => {
          cloud.x += cloud.speed

          // Reset quand le nuage sort par la droite
          if (cloud.x > canvas.width + 200) {
            cloud.x = -220
            cloud.y = Math.random() * canvas.height * 0.28
            cloud.opacity = 0.5 + Math.random() * 0.4
          }

          drawCloud(ctx, cloud.x, cloud.y, cloud.scale, cloud.opacity)
        })

        lastTime = currentTime
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      clearTimeout(resizeTimeout)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} />
}
