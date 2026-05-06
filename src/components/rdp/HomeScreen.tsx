'use client'

import { motion } from 'framer-motion'
import { RdpButton } from './ui/Button'

interface HomeScreenProps {
  onStart: () => void
  hasSavedGame: boolean
  onResume: () => void
}

export function RdpHomeScreen({ onStart, hasSavedGame, onResume }: HomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl" />
        <motion.div animate={{ scale: [1.2, 1, 1.2], rotate: [45, 0, 45] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-pink-600/20 blur-3xl" />
        <motion.div animate={{ scale: [1, 1.3, 1], x: [0, 30, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="relative z-10 text-center max-w-lg">
        <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="text-7xl mb-6">🎡</motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-5xl sm:text-6xl font-black mb-3 leading-tight">
          <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">Roue des</span>
          <br />
          <span className="text-white">Problèmes</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }} className="text-white/60 text-lg mb-2">Le jeu de soirée qui crée des moments inoubliables</motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }} className="text-white/40 text-sm mb-12">Vérités · Actions · Questions visées</motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }} className="flex flex-wrap justify-center gap-2 mb-10">
          {['2–12 joueurs', 'Mode Soft & Spicy', 'Sans inscription', 'Local & gratuit'].map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-white/[0.08] border border-white/10 text-white/60">{tag}</span>
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }} className="flex flex-col sm:flex-row gap-3 justify-center">
          <RdpButton onClick={onStart} size="xl" variant="primary">🚀 Nouvelle partie</RdpButton>
          {hasSavedGame && <RdpButton onClick={onResume} size="xl" variant="glass">▶ Reprendre</RdpButton>}
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.6 }} className="mt-10 text-white/25 text-xs max-w-xs mx-auto leading-relaxed">
          Le but est de s&apos;amuser. Évitez les questions blessantes ou humiliantes. Le respect avant tout.
        </motion.p>
      </motion.div>
    </div>
  )
}
