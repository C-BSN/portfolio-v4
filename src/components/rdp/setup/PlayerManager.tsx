'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Player } from '@/game/types'
import { MAX_PLAYERS } from '@/game/hooks/useGameState'
import { RdpButton } from '../ui/Button'

interface PlayerManagerProps {
  players: Player[]
  onAdd: (name: string) => void
  onRemove: (id: string) => void
  onShuffle: () => void
  shuffledIds: string[]
}

export function RdpPlayerManager({ players, onAdd, onRemove, onShuffle, shuffledIds }: PlayerManagerProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAdd = () => {
    if (input.trim() && players.length < MAX_PLAYERS) {
      onAdd(input.trim())
      setInput('')
      inputRef.current?.focus()
    }
  }

  const displayOrder = shuffledIds.length > 0
    ? shuffledIds.map((id) => players.find((p) => p.id === id)).filter(Boolean) as Player[]
    : players

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white/70 text-sm font-medium uppercase tracking-wider">
          Joueurs <span className="text-white/30 normal-case font-normal tracking-normal">({players.length}/{MAX_PLAYERS})</span>
        </h3>
        {players.length >= 2 && <RdpButton onClick={onShuffle} size="sm" variant="ghost">🔀 Mélanger</RdpButton>}
      </div>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Nom du joueur…"
          maxLength={20}
          disabled={players.length >= MAX_PLAYERS}
          className="flex-1 bg-slate-800 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 text-sm focus:outline-none focus:border-violet-400/80 transition-all"
        />
        <RdpButton onClick={handleAdd} disabled={!input.trim() || players.length >= MAX_PLAYERS} size="md" variant="primary">+ Ajouter</RdpButton>
      </div>
      {players.length === 1 && <p className="text-amber-400/70 text-xs">⚠️ Ajoutez au moins un autre joueur pour commencer.</p>}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        <AnimatePresence>
          {displayOrder.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex items-center gap-3 bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-2.5"
            >
              {shuffledIds.length > 0 && <span className="text-white/30 text-xs w-5 text-center font-mono">{index + 1}</span>}
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: player.color }} />
              <span className="flex-1 text-white text-sm font-medium truncate">{player.name}</span>
              <button onClick={() => onRemove(player.id)} className="text-white/30 hover:text-red-400 transition-colors text-lg leading-none p-1 cursor-pointer" title="Supprimer">×</button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {players.length === 0 && (
        <div className="text-center py-8 text-white/25 text-sm">
          <div className="text-3xl mb-2">👥</div>
          Ajoutez 2 à {MAX_PLAYERS} joueurs pour commencer
        </div>
      )}
    </div>
  )
}
