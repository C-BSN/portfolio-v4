'use client'

import { motion } from 'framer-motion'
import type { GameMode } from '@/game/types'

const MODES: { id: GameMode; label: string; emoji: string; desc: string; color: string }[] = [
  { id: 'soft', label: 'Soft', emoji: '🌸', desc: 'Questions légères, défis fun, ambiance détendue', color: 'from-sky-500/20 to-blue-600/20 border-sky-500/30' },
  { id: 'mix', label: 'Mix', emoji: '🌀', desc: 'Un mix parfait entre douceur et frisson', color: 'from-violet-500/20 to-pink-600/20 border-violet-500/30' },
  { id: 'spicy', label: 'Spicy', emoji: '🌶️', desc: 'Osé, piquant, moments gênants garantis', color: 'from-orange-500/20 to-red-600/20 border-orange-500/30' },
]

export function RdpModeSelector({ mode, onChange }: { mode: GameMode; onChange: (mode: GameMode) => void }) {
  return (
    <div className="space-y-3">
      <h3 className="text-white/70 text-sm font-medium uppercase tracking-wider">Niveau de jeu</h3>
      <div className="grid grid-cols-3 gap-3">
        {MODES.map((m) => {
          const isActive = mode === m.id
          return (
            <motion.button
              key={m.id}
              onClick={() => onChange(m.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={['relative flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-center', isActive ? `bg-gradient-to-br ${m.color} ${m.color.split(' ')[2]}` : 'bg-white/5 border-white/10 hover:border-white/20'].join(' ')}
            >
              {isActive && (
                <motion.div layoutId="mode-active" className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${m.color} opacity-60`} transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
              )}
              <span className="relative text-2xl">{m.emoji}</span>
              <span className={`relative text-sm font-bold ${isActive ? 'text-white' : 'text-white/60'}`}>{m.label}</span>
              <span className={`relative text-xs leading-tight ${isActive ? 'text-white/70' : 'text-white/30'}`}>{m.desc}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
