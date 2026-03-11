"use client"

import { useEffect, useState } from "react"

interface CloudConfig {
  scale: number
  opacity: number
  duration: number   // secondes — plus grand = plus lent
  delay: number      // négatif = déjà en cours au chargement
  top: string        // position verticale dans la zone ciel
}

// 8 nuages avec vitesse, taille, opacité et position aléatoires
// Les grands nuages sont lents et opaques (proche), les petits sont rapides et transparents (loin)
const CLOUDS: CloudConfig[] = [
  { scale: 1.25, opacity: 0.84, duration: 36, delay: -4,  top: '5%'  },
  { scale: 0.95, opacity: 0.74, duration: 28, delay: -20, top: '13%' },
  { scale: 1.10, opacity: 0.80, duration: 32, delay: -12, top: '2%'  },
  { scale: 0.80, opacity: 0.65, duration: 24, delay: -7,  top: '19%' },
  { scale: 0.58, opacity: 0.50, duration: 18, delay: -15, top: '8%'  },
  { scale: 0.68, opacity: 0.55, duration: 20, delay: -26, top: '22%' },
  { scale: 0.45, opacity: 0.42, duration: 15, delay: -9,  top: '16%' },
  { scale: 0.88, opacity: 0.70, duration: 30, delay: -22, top: '10%' },
]

interface SkyEffectProps {
  className?: string
}

export function SkyEffect({
  className = "fixed top-20 left-0 right-0 bottom-0 pointer-events-none z-[1] overflow-hidden",
}: SkyEffectProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <div className={className}>
      {CLOUDS.map((cloud, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: cloud.top,
            left: 0,
            right: 0,
            opacity: cloud.opacity,
            transform: `scale(${cloud.scale})`,
            transformOrigin: 'left center',
          }}
        >
          <div
            className="sky-cloud"
            style={{
              animation: `moveclouds ${cloud.duration}s linear infinite`,
              animationDelay: `${cloud.delay}s`,
            }}
          />
        </div>
      ))}
    </div>
  )
}
