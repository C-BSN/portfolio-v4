'use client'

import { RainEffect, CursorGlow, LightningEffect } from '@/components/effects'

export function GlobalEffects() {
  return (
    <>
      {/* Rain Effect - Très visible avec opacité augmentée */}
      <RainEffect 
        opacity={0.8}
        dropCount={200}
        className="fixed inset-0 pointer-events-none z-[100]"
      />

      {/* Lightning Effect - Très visible avec intensité augmentée */}
      <LightningEffect 
        frequency={6}
        intensity={0.9}
        className="fixed inset-0 pointer-events-none z-[101]"
      />

      {/* Cursor Glow Effect - Toujours au-dessus */}
      <CursorGlow 
        className="fixed pointer-events-none z-[9999] rounded-full blur-3xl transition-all duration-300 opacity-20"
        size={400}
        colors={["#ffffff", "#F0F0F0"]}
      />
    </>
  )
}
