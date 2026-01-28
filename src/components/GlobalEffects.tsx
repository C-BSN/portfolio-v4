'use client'

import { RainEffect, CursorGlow, LightningEffect } from '@/components/effects'

export function GlobalEffects() {
  return (
    <>
      {/* Rain Effect - Optimisé pour les performances */}
      <RainEffect 
        opacity={0.5}
        dropCount={80}
        className="fixed inset-0 pointer-events-none z-[100]"
      />

      {/* Lightning Effect - Optimisé avec fréquence réduite */}
      <LightningEffect 
        frequency={10}
        intensity={0.7}
        className="fixed inset-0 pointer-events-none z-[101]"
      />

      {/* Cursor Glow Effect - Toujours au-dessus */}
      <CursorGlow 
        className="fixed pointer-events-none z-[9999] rounded-full blur-3xl transition-all duration-100 opacity-20"
        size={300}
        colors={["#ffffff", "#F0F0F0"]}
      />
    </>
  )
}
