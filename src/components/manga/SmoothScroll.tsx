'use client'

import { useEffect, useRef, ReactNode } from 'react'
import Lenis from 'lenis'

interface SmoothScrollProps {
  children: ReactNode
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    // Initialiser Lenis avec des paramètres optimisés
    const lenis = new Lenis({
      duration: 1.0, // Réduit de 1.2 à 1.0 pour plus de réactivité
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5, // Réduit de 2 à 1.5
      infinite: false,
      autoResize: true, // Active le redimensionnement automatique
    })

    lenisRef.current = lenis

    // Fonction de mise à jour du scroll optimisée
    function raf(time: number) {
      lenis.raf(time)
      rafIdRef.current = requestAnimationFrame(raf)
    }

    rafIdRef.current = requestAnimationFrame(raf)

    // Cleanup
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
