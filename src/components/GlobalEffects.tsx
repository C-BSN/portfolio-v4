'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { RainEffect, CursorGlow, LightningEffect, SkyEffect } from '@/components/effects'

export function GlobalEffects() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [hideWeather, setHideWeather] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const check = () => setHideWeather(document.body.classList.contains('no-global-effects'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  if (reducedMotion) return null

  const isDark = !mounted || resolvedTheme === 'dark'

  const cursorColors = isDark
    ? ["#ffffff", "#F0F0F0"]
    : ["#fbbf24", "#f97316"]

  return (
    <>
      {!hideWeather && (
        <>
          {isDark ? (
            <>
              <RainEffect
                opacity={0.35}
                dropCount={40}
                className="fixed inset-0 pointer-events-none z-[100]"
              />
              <LightningEffect
                frequency={15}
                intensity={0.5}
                className="fixed inset-0 pointer-events-none z-[101]"
              />
            </>
          ) : (
            <SkyEffect className="fixed inset-0 pointer-events-none z-[100]" />
          )}
        </>
      )}

      <CursorGlow
        className="fixed pointer-events-none z-[9999] rounded-full blur-3xl transition-all duration-150 opacity-15"
        size={250}
        colors={cursorColors}
      />
    </>
  )
}
