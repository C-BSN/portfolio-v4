'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CustomQuestion } from '@/game/types'
import { RdpButton } from '../ui/Button'

const EXAMPLES = [
  "Qui serait le plus capable de ghoster quelqu'un ici ?",
  "Qui a le plus de chances de mentir pour éviter un date ?",
  "Qui pourrait le plus facilement voler ton crush ?",
  "Qui dans la pièce cache le mieux ses émotions ?",
]

interface QuestionManagerProps {
  questions: CustomQuestion[]
  onAdd: (text: string) => void
  onRemove: (id: string) => void
  onEdit: (id: string, text: string) => void
}

export function RdpQuestionManager({ questions, onAdd, onRemove, onEdit }: QuestionManagerProps) {
  const [input, setInput] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  const handleAdd = () => { if (input.trim()) { onAdd(input.trim()); setInput('') } }
  const startEdit = (q: CustomQuestion) => { setEditingId(q.id); setEditText(q.text) }
  const saveEdit = () => { if (editingId && editText.trim()) onEdit(editingId, editText.trim()); setEditingId(null) }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-white/70 text-sm font-medium uppercase tracking-wider mb-1">Questions visées</h3>
        <p className="text-white/30 text-xs">💬 Ajoutez des questions drôles, pas blessantes. Le groupe répond oralement.</p>
      </div>
      <div className="space-y-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdd() } }}
          placeholder="Qui dans ce groupe serait le plus…"
          rows={2}
          className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 text-sm focus:outline-none focus:border-violet-400/80 transition-all resize-none"
        />
        <RdpButton onClick={handleAdd} disabled={!input.trim()} size="md" variant="secondary" fullWidth>+ Ajouter la question</RdpButton>
      </div>
      {questions.length === 0 && (
        <div className="space-y-2">
          <p className="text-white/25 text-xs">Exemples :</p>
          {EXAMPLES.map((ex, i) => (
            <button key={i} onClick={() => setInput(ex)} className="w-full text-left text-xs text-white/40 hover:text-white/70 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg px-3 py-2 transition-all cursor-pointer">{ex}</button>
          ))}
        </div>
      )}
      {questions.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          <AnimatePresence>
            {questions.map((q) => (
              <motion.div key={q.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="bg-white/[0.06] border border-white/[0.08] rounded-xl p-3">
                {editingId === q.id ? (
                  <div className="flex gap-2">
                    <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={2} autoFocus className="flex-1 bg-slate-800 border border-violet-400/60 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none resize-none" />
                    <div className="flex flex-col gap-1">
                      <button onClick={saveEdit} className="text-xs text-violet-400 hover:text-violet-300 font-medium cursor-pointer">✓</button>
                      <button onClick={() => setEditingId(null)} className="text-xs text-white/30 hover:text-white/60 cursor-pointer">✕</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <span className="flex-1 text-white/80 text-sm leading-snug">{q.text}</span>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => startEdit(q)} className="text-white/25 hover:text-violet-400 transition-colors text-sm cursor-pointer" title="Modifier">✏️</button>
                      <button onClick={() => onRemove(q.id)} className="text-white/25 hover:text-red-400 transition-colors text-lg leading-none cursor-pointer" title="Supprimer">×</button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      {questions.length > 0 && <p className="text-white/30 text-xs text-center">{questions.length} question{questions.length > 1 ? 's' : ''} ajoutée{questions.length > 1 ? 's' : ''}</p>}
    </div>
  )
}
