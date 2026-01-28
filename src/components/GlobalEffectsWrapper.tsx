'use client'

import dynamic from 'next/dynamic'

// Lazy load les effets visuels pour améliorer les performances initiales
const GlobalEffects = dynamic(
  () => import('@/components/GlobalEffects').then(mod => ({ default: mod.GlobalEffects })),
  {
    ssr: false,
    loading: () => null
  }
)

export function GlobalEffectsWrapper() {
  return <GlobalEffects />
}
