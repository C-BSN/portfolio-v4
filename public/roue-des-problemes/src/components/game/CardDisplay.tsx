'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { GameCard } from '@/types'
import { getCategoryById } from '@/config/categories'
import { Button } from '../ui/Button'

const LEVEL_LABELS: Record<string, string> = {
  soft: '🌸 Soft',
  spicy: '🌶️ Spicy',
  custom: '🎯 Personnalisée',
}

interface CardDisplayProps {
  card: GameCard | null
  onNext: () => void
  onSkip: () => void
  onReroll: () => void
  noCustomQuestions?: boolean
}

export function CardDisplay({
  card,
  onNext,
  onSkip,
  onReroll,
  noCustomQuestions = false,
}: CardDisplayProps) {
  return (
    <AnimatePresence mode="wait">
      {card ? (
        <motion.div
          key={card.content}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 280, damping: 25 }}
          className="w-full"
        >
          <CardContent card={card} onNext={onNext} onSkip={onSkip} onReroll={onReroll} />
        </motion.div>
      ) : card === null && noCustomQuestions ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
          <EmptyQuestions onNext={onNext} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function CardContent({
  card,
  onNext,
  onSkip,
  onReroll,
}: {
  card: GameCard
  onNext: () => void
  onSkip: () => void
  onReroll: () => void
}) {
  const cfg = getCategoryById(card.category)

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border ${cfg.border} bg-gradient-to-br ${cfg.gradient} backdrop-blur-sm p-6 shadow-glass`}
    >
      {/* Decorative glow blob */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-2xl pointer-events-none"
        style={{ backgroundColor: cfg.wheelColors[0] }}
      />

      {/* Category badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.badge}`}>
          {cfg.emoji} {cfg.label.replace('\n', ' ')}
        </span>
        {card.level && card.level !== 'custom' && (
          <span className="text-white/30 text-xs">{LEVEL_LABELS[card.level]}</span>
        )}
      </div>

      {/* Card text */}
      <p className="text-white text-lg sm:text-xl font-medium leading-relaxed mb-6 min-h-[80px] flex items-center">
        {card.content}
      </p>

      <div className="border-t border-white/8 mb-4" />

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <Button onClick={onNext} size="lg" variant="primary" fullWidth>
          ✅ Joueur suivant
        </Button>
        <div className="flex gap-2">
          <Button onClick={onReroll} size="md" variant="ghost" fullWidth>
            🔄 Relancer
          </Button>
          <Button onClick={onSkip} size="md" variant="ghost" fullWidth>
            ⏭️ Passer
          </Button>
        </div>
      </div>

      <p className="text-center text-white/20 text-xs mt-3">
        Le respect avant tout — passer est toujours une option valide.
      </p>
    </div>
  )
}

function EmptyQuestions({ onNext }: { onNext: () => void }) {
  const cfg = getCategoryById('question')
  return (
    <div className={`rounded-3xl border ${cfg.border} bg-gradient-to-br ${cfg.gradient} p-6 text-center`}>
      <div className="text-4xl mb-3">{cfg.emoji}</div>
      <h3 className="text-white font-semibold mb-2">Aucune question visée</h3>
      <p className="text-white/50 text-sm mb-5">
        Ajoutez des questions personnalisées dans la configuration pour animer cette catégorie.
      </p>
      <Button onClick={onNext} size="md" variant="ghost" fullWidth>
        ⏭️ Passer ce tour
      </Button>
    </div>
  )
}
