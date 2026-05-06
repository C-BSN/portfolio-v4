'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { HistoryItem } from '@/game/types'

const CATEGORY_EMOJI: Record<string, string> = { verite: '💬', action: '⚡', question: '🎯' }
const CATEGORY_COLOR: Record<string, string> = { verite: 'text-violet-400', action: 'text-orange-400', question: 'text-pink-400' }

export function RdpHistory({ items }: { items: HistoryItem[] }) {
  const [open, setOpen] = useState(false)
  if (items.length === 0) return null
  return (
    <div className="w-full">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/5 border border-white/[0.08] text-white/50 hover:text-white/70 hover:bg-white/[0.08] transition-all cursor-pointer"
      >
        <span className="text-sm font-medium">📜 Historique des tours ({items.length})</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-xs">▼</motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2.5"
                >
                  <span className="text-base flex-shrink-0 mt-0.5">{CATEGORY_EMOJI[item.card.category]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-white/80 text-xs font-semibold truncate">{item.playerName}</span>
                      <span className={`text-xs font-medium ${CATEGORY_COLOR[item.card.category]}`}>Tour {item.turnNumber}</span>
                    </div>
                    <p className="text-white/40 text-xs leading-snug line-clamp-2">{item.card.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
