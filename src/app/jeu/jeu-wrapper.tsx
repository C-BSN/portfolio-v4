'use client'

import dynamic from 'next/dynamic'

const JeuClient = dynamic(() => import('./jeu-client'), { ssr: false })

export default function JeuWrapper() {
  return <JeuClient />
}
