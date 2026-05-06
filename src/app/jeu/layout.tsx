import type { Metadata, Viewport } from 'next'
import './game.css'

export const metadata: Metadata = {
  title: 'Roue des Problèmes',
  description: 'Le jeu de soirée entre amis — Vérités, Actions, Questions Visées',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0B0718',
}

export default function JeuLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rdp-bg fixed inset-0 top-20 overflow-y-auto z-40">
      {children}
    </div>
  )
}
