'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Player, CustomQuestion, GameMode } from '@/game/types'
import { RdpPlayerManager } from './PlayerManager'
import { RdpModeSelector } from './ModeSelector'
import { RdpQuestionManager } from './QuestionManager'
import { RdpButton } from '../ui/Button'

interface SetupScreenProps {
  players: Player[]
  shuffledIds: string[]
  mode: GameMode
  customQuestions: CustomQuestion[]
  onAddPlayer: (name: string) => void
  onRemovePlayer: (id: string) => void
  onShufflePlayers: () => void
  onSetMode: (mode: GameMode) => void
  onAddQuestion: (text: string) => void
  onRemoveQuestion: (id: string) => void
  onEditQuestion: (id: string, text: string) => void
  onStartGame: () => void
  onBack: () => void
}

type Tab = 'players' | 'mode' | 'questions'

export function RdpSetupScreen({ players, shuffledIds, mode, customQuestions, onAddPlayer, onRemovePlayer, onShufflePlayers, onSetMode, onAddQuestion, onRemoveQuestion, onEditQuestion, onStartGame, onBack }: SetupScreenProps) {
  const [tab, setTab] = useState<Tab>('players')
  const canStart = players.length >= 2
  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'players', label: 'Joueurs', emoji: '👥' },
    { id: 'mode', label: 'Mode', emoji: '🎚️' },
    { id: 'questions', label: 'Questions', emoji: '🎯' },
  ]

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-white/40 hover:text-white transition-colors text-sm cursor-pointer">← Retour</button>
        <h1 className="text-xl font-bold text-white flex-1 text-center">Configuration</h1>
        <div className="w-16" />
      </div>
      <div className="flex bg-white/5 rounded-2xl p-1 mb-6 border border-white/[0.08]">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={['flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer', tab === t.id ? 'bg-white/[0.12] text-white border border-white/10' : 'text-white/40 hover:text-white/60'].join(' ')}
          >
            <span className="text-base">{t.emoji}</span>
            {t.label}
            {t.id === 'players' && players.length > 0 && <span className="text-violet-400 font-bold">{players.length}</span>}
            {t.id === 'questions' && customQuestions.length > 0 && <span className="text-pink-400 font-bold">{customQuestions.length}</span>}
          </button>
        ))}
      </div>
      <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="flex-1 rounded-2xl p-5 border border-white/10 bg-white/5 backdrop-blur-sm">
        {tab === 'players' && <RdpPlayerManager players={players} onAdd={onAddPlayer} onRemove={onRemovePlayer} onShuffle={onShufflePlayers} shuffledIds={shuffledIds} />}
        {tab === 'mode' && <RdpModeSelector mode={mode} onChange={onSetMode} />}
        {tab === 'questions' && <RdpQuestionManager questions={customQuestions} onAdd={onAddQuestion} onRemove={onRemoveQuestion} onEdit={onEditQuestion} />}
      </motion.div>
      <div className="mt-6">
        {!canStart && <p className="text-center text-white/30 text-xs mb-3">Ajoutez au moins 2 joueurs pour lancer la partie</p>}
        <RdpButton onClick={onStartGame} disabled={!canStart} size="xl" variant="primary" fullWidth>🎡 Lancer la partie !</RdpButton>
        <p className="text-center text-white/20 text-xs mt-3">
          {players.length} joueur{players.length > 1 ? 's' : ''} · Mode {mode} · {customQuestions.length} question{customQuestions.length > 1 ? 's' : ''} visée{customQuestions.length > 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
