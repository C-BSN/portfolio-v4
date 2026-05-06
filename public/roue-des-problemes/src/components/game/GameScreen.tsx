'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Player, GameState, WheelCategory } from '@/types'
import { Wheel } from '../wheel/Wheel'
import { CardDisplay } from './CardDisplay'
import { History } from './History'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

interface GameScreenProps {
  state: GameState
  players: Player[]
  onSpinStart: () => void
  onSpinComplete: (cat: WheelCategory, rot: number) => void
  onNextPlayer: () => void
  onSkipCard: () => void
  onRerollCard: () => void
  onReset: () => void
}

export function GameScreen({
  state,
  players,
  onSpinStart,
  onSpinComplete,
  onNextPlayer,
  onSkipCard,
  onRerollCard,
  onReset,
}: GameScreenProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const currentPlayerId = state.shuffledPlayerIds[state.currentPlayerIndex]
  const currentPlayer = players.find((p) => p.id === currentPlayerId)

  const nextPlayerId =
    state.shuffledPlayerIds[(state.currentPlayerIndex + 1) % state.shuffledPlayerIds.length]
  const nextPlayer = players.find((p) => p.id === nextPlayerId)

  return (
    <div className="min-h-screen flex flex-col px-4 py-4 max-w-lg mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="text-white/40 text-sm font-mono">
            Tour {state.turnCount + 1}
          </div>
          {state.mode !== 'mix' && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/8 text-white/40 border border-white/8">
              {state.mode === 'soft' ? '🌸 Soft' : '🌶️ Spicy'}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="text-white/30 hover:text-white/60 text-sm transition-colors cursor-pointer"
        >
          ⚙️
        </button>
      </div>

      {/* Current player */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPlayer?.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="mb-5"
        >
          <div
            className="relative overflow-hidden rounded-2xl p-4 text-center border"
            style={{
              background: `linear-gradient(135deg, ${currentPlayer?.color}22, ${currentPlayer?.color}11)`,
              borderColor: `${currentPlayer?.color}30`,
            }}
          >
            <div className="text-white/40 text-xs font-medium uppercase tracking-widest mb-1">
              C&apos;est le tour de
            </div>
            <div className="flex items-center justify-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: currentPlayer?.color }}
              />
              <h2 className="text-2xl font-black text-white">{currentPlayer?.name}</h2>
            </div>
            {nextPlayer && nextPlayer.id !== currentPlayer?.id && (
              <div className="mt-2 text-white/25 text-xs">
                Suivant : {nextPlayer.name}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Player order strip */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 no-scrollbar">
        {state.shuffledPlayerIds.map((id, index) => {
          const p = players.find((pl) => pl.id === id)
          if (!p) return null
          const isCurrent = index === state.currentPlayerIndex
          return (
            <motion.div
              key={id}
              animate={isCurrent ? { scale: 1.1 } : { scale: 1 }}
              className={[
                'flex-shrink-0 flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl border transition-all',
                isCurrent ? 'border-white/30 bg-white/12' : 'border-white/8 bg-white/4',
              ].join(' ')}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: p.color, opacity: isCurrent ? 1 : 0.5 }}
              />
              <span
                className={`text-xs font-medium truncate max-w-[52px] ${
                  isCurrent ? 'text-white' : 'text-white/40'
                }`}
              >
                {p.name}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* Wheel */}
      <div className="flex justify-center mb-6">
        <Wheel
          phase={state.wheelPhase}
          initialRotation={state.wheelRotation}
          onSpinStart={onSpinStart}
          onSpinComplete={onSpinComplete}
          disabled={state.wheelPhase !== 'idle'}
        />
      </div>

      {/* Card */}
      <div className="mb-4">
        <CardDisplay
          card={state.currentCard}
          onNext={onNextPlayer}
          onSkip={onSkipCard}
          onReroll={onRerollCard}
          noCustomQuestions={state.wheelPhase === 'result' && state.currentCard === null}
        />
      </div>

      <History items={state.history} />

      {/* Reset modal */}
      <Modal open={showResetConfirm} onClose={() => setShowResetConfirm(false)}>
        <h3 className="text-white font-bold text-lg mb-2 text-center">
          Retour à la config ?
        </h3>
        <p className="text-white/50 text-sm text-center mb-6">
          La partie en cours sera conservée dans l&apos;historique local.
        </p>
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => { setShowResetConfirm(false); onReset() }}
            size="md"
            variant="danger"
            fullWidth
          >
            Retour à la config
          </Button>
          <Button
            onClick={() => setShowResetConfirm(false)}
            size="md"
            variant="ghost"
            fullWidth
          >
            Continuer la partie
          </Button>
        </div>
      </Modal>
    </div>
  )
}
