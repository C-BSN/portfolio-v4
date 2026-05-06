'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import type { WheelCategory, WheelPhase } from '@/types'
import { CATEGORIES } from '@/config/categories'
import {
  SPIN_DURATION_BASE,
  SPIN_DURATION_EXTRA,
  SPIN_MIN_ROTATIONS,
  WHEEL_GAP_RADIANS,
  WHEEL_SIZE_MIN,
  WHEEL_SIZE_MAX,
} from '@/config/constants'
import { Button } from '../ui/Button'

// ─── Segment list (derived from CATEGORIES) ───────────────────────────────────
// Order: V / A / Q / V / A / Q  (same-type never adjacent)
interface WheelSegment {
  id: WheelCategory
  label: string
  emoji: string
  fraction: number
  color: string
  glow: string
  textColor: string
}

function buildSegments(): WheelSegment[] {
  const half = CATEGORIES.map((cat, i) => ({
    id: cat.id,
    label: cat.label,
    emoji: cat.emoji,
    fraction: cat.fraction / 2,
    color: cat.wheelColors[i % 2],
    glow: cat.glow,
    textColor: cat.wheelTextColor,
  }))
  // Interleave: first-half of each cat, then second-half of each cat
  const second = CATEGORIES.map((cat, i) => ({
    id: cat.id,
    label: cat.label,
    emoji: cat.emoji,
    fraction: cat.fraction / 2,
    color: cat.wheelColors[(i + 1) % 2],
    glow: cat.glow,
    textColor: cat.wheelTextColor,
  }))
  return [...half, ...second]
}

const SEGMENTS = buildSegments()

// ─── Category detection (data-driven) ────────────────────────────────────────
function getCategory(rotationDeg: number): WheelCategory {
  const r = ((rotationDeg % 360) + 360) % 360
  const w = r === 0 ? 0 : (360 - r) % 360
  let cumulative = 0
  for (const seg of SEGMENTS) {
    cumulative += seg.fraction * 360
    if (w < cumulative) return seg.id
  }
  return SEGMENTS[SEGMENTS.length - 1].id
}

// ─── Canvas drawing ───────────────────────────────────────────────────────────
function drawWheel(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  rotation: number
) {
  ctx.clearRect(0, 0, cx * 2, cy * 2)

  // Outer glow ring
  const outerGrad = ctx.createRadialGradient(cx, cy, r * 0.7, cx, cy, r + 8)
  outerGrad.addColorStop(0, 'transparent')
  outerGrad.addColorStop(1, 'rgba(139,92,246,0.15)')
  ctx.beginPath()
  ctx.arc(cx, cy, r + 4, 0, Math.PI * 2)
  ctx.fillStyle = outerGrad
  ctx.fill()

  let startAngle = rotation - Math.PI / 2

  SEGMENTS.forEach((seg) => {
    const segAngle = seg.fraction * Math.PI * 2
    const endAngle = startAngle + segAngle
    const drawStart = startAngle + WHEEL_GAP_RADIANS / 2
    const drawEnd = endAngle - WHEEL_GAP_RADIANS / 2
    const midAngle = (drawStart + drawEnd) / 2

    // Segment fill
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, r, drawStart, drawEnd)
    ctx.closePath()

    const gx = cx + r * 0.4 * Math.cos(midAngle)
    const gy = cy + r * 0.4 * Math.sin(midAngle)
    const grad = ctx.createRadialGradient(gx, gy, 0, cx, cy, r)
    grad.addColorStop(0, lightenHex(seg.color, 30))
    grad.addColorStop(0.6, seg.color)
    grad.addColorStop(1, darkenHex(seg.color, 20))
    ctx.fillStyle = grad
    ctx.fill()

    ctx.strokeStyle = 'rgba(0,0,0,0.25)'
    ctx.lineWidth = 1
    ctx.stroke()

    // Label
    const textRadius = r * 0.62
    const tx = cx + textRadius * Math.cos(midAngle)
    const ty = cy + textRadius * Math.sin(midAngle)

    ctx.save()
    ctx.translate(tx, ty)
    ctx.rotate(midAngle + Math.PI / 2)

    const emojiSize = r > 150 ? 26 : 20
    ctx.font = `${emojiSize}px serif`
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0,0,0,0.8)'
    ctx.shadowBlur = 6
    ctx.fillText(seg.emoji, 0, -emojiSize * 0.6)

    const fontSize = r > 150 ? 15 : 13
    ctx.font = `800 ${fontSize}px Inter, system-ui, sans-serif`
    ctx.fillStyle = '#FFFFFF'
    ctx.shadowColor = 'rgba(0,0,0,0.9)'
    ctx.shadowBlur = 8

    const lines = seg.label.split('\n')
    lines.forEach((line, i) => {
      ctx.fillText(line, 0, emojiSize * 0.6 + i * (fontSize + 2))
    })

    ctx.restore()
    startAngle = endAngle
  })

  // Center hub
  const hubR = r * 0.12
  const hubGrad = ctx.createRadialGradient(
    cx - hubR * 0.3, cy - hubR * 0.3, 0,
    cx, cy, hubR
  )
  hubGrad.addColorStop(0, '#4C1D95')
  hubGrad.addColorStop(1, '#0F0A1E')
  ctx.beginPath()
  ctx.arc(cx, cy, hubR, 0, Math.PI * 2)
  ctx.fillStyle = hubGrad
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'
  ctx.lineWidth = 2
  ctx.stroke()
}

function drawPointer(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number
) {
  const pH = 28
  const pW = 14

  ctx.save()
  ctx.translate(cx, cy - r - 2)
  ctx.shadowColor = 'rgba(139,92,246,0.8)'
  ctx.shadowBlur = 15

  ctx.beginPath()
  ctx.moveTo(0, pH)
  ctx.lineTo(-pW / 2, 0)
  ctx.lineTo(pW / 2, 0)
  ctx.closePath()

  const pGrad = ctx.createLinearGradient(0, 0, 0, pH)
  pGrad.addColorStop(0, '#F5F3FF')
  pGrad.addColorStop(1, '#DDD6FE')
  ctx.fillStyle = pGrad
  ctx.fill()
  ctx.strokeStyle = 'rgba(139,92,246,0.6)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  ctx.restore()
}

// ─── Color helpers ────────────────────────────────────────────────────────────
function lightenHex(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${Math.min(255, r + amount)},${Math.min(255, g + amount)},${Math.min(255, b + amount)})`
}

function darkenHex(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${Math.max(0, r - amount)},${Math.max(0, g - amount)},${Math.max(0, b - amount)})`
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

// ─── Component ────────────────────────────────────────────────────────────────
interface WheelProps {
  phase: WheelPhase
  initialRotation: number
  onSpinStart: () => void
  onSpinComplete: (category: WheelCategory, finalRotation: number) => void
  disabled?: boolean
}

export function Wheel({
  phase,
  initialRotation,
  onSpinStart,
  onSpinComplete,
  disabled = false,
}: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rotationRef = useRef(initialRotation)
  const animFrameRef = useRef<number>(0)
  const [size, setSize] = useState(WHEEL_SIZE_MAX)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winningSegment, setWinningSegment] = useState<WheelCategory | null>(null)

  useEffect(() => {
    const updateSize = () => {
      const s = Math.min(WHEEL_SIZE_MAX, Math.max(WHEEL_SIZE_MIN, window.innerWidth - 80))
      setSize(s)
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const redraw = useCallback(
    (rot: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const dpr = window.devicePixelRatio || 1
      const cx = (size * dpr) / 2
      const cy = (size * dpr) / 2
      const r = (size * dpr) / 2 - 20 * dpr
      drawWheel(ctx, cx, cy, r, rot)
      drawPointer(ctx, cx, cy, r)
    },
    [size]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    redraw(rotationRef.current)
  }, [size, redraw])

  const spin = useCallback(() => {
    if (isSpinning || disabled) return
    cancelAnimationFrame(animFrameRef.current)
    setIsSpinning(true)
    setWinningSegment(null)
    onSpinStart()

    const extraAngle = Math.random() * Math.PI * 2
    const totalRotation = SPIN_MIN_ROTATIONS * Math.PI * 2 + extraAngle
    const startRotation = rotationRef.current
    const duration = SPIN_DURATION_BASE + Math.random() * SPIN_DURATION_EXTRA

    let startTime: number | null = null

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const currentRotation = startRotation + totalRotation * easeOutQuart(progress)

      rotationRef.current = currentRotation
      redraw(currentRotation)

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate)
      } else {
        const finalDeg = (currentRotation * 180) / Math.PI
        const category = getCategory(finalDeg)
        setIsSpinning(false)
        setWinningSegment(category)
        if ('vibrate' in navigator) navigator.vibrate([50, 30, 80])
        onSpinComplete(category, currentRotation)
      }
    }

    animFrameRef.current = requestAnimationFrame(animate)
  }, [isSpinning, disabled, onSpinStart, onSpinComplete, redraw])

  useEffect(() => () => cancelAnimationFrame(animFrameRef.current), [])

  const winCat = winningSegment
    ? CATEGORIES.find((c) => c.id === winningSegment)
    : null

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <motion.div
          animate={
            isSpinning
              ? { scale: [1, 1.08, 1], opacity: [0.4, 0.8, 0.4] }
              : { scale: 1, opacity: 0.3 }
          }
          transition={isSpinning ? { duration: 0.8, repeat: Infinity } : { duration: 0.3 }}
          className="absolute inset-0 rounded-full blur-2xl"
          style={{
            background: winCat
              ? `radial-gradient(circle, ${winCat.glow} 0%, transparent 70%)`
              : 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
          }}
        />

        <canvas
          ref={canvasRef}
          className="relative z-10 drop-shadow-2xl cursor-pointer"
          onClick={phase === 'idle' ? spin : undefined}
          title={phase === 'idle' ? 'Cliquer pour lancer !' : undefined}
        />

        {phase === 'result' && winCat && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <div className="text-5xl">{winCat.emoji}</div>
          </motion.div>
        )}
      </div>

      {phase === 'idle' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Button onClick={spin} disabled={isSpinning || disabled} size="xl" variant="primary">
            🎡 Lancer la roue !
          </Button>
        </motion.div>
      )}

      {phase === 'spinning' && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-white/60 text-sm font-medium"
        >
          La roue tourne…
        </motion.div>
      )}

      {phase === 'result' && winCat && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="px-5 py-2.5 rounded-2xl text-sm font-bold"
          style={{
            background: `${winCat.wheelColors[0]}33`,
            border: `2px solid ${winCat.wheelColors[0]}66`,
            color: winCat.wheelTextColor,
          }}
        >
          {winCat.emoji} {winCat.label.replace('\n', ' ')}
        </motion.div>
      )}
    </div>
  )
}
