import type { WheelCategory } from '@/game/types'

export interface CategoryConfig {
  id: WheelCategory
  label: string
  emoji: string
  fraction: number
  wheelColors: [string, string]
  glow: string
  wheelTextColor: string
  gradient: string
  border: string
  badge: string
  textAccent: string
}

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'verite',
    label: 'Vérité',
    emoji: '💬',
    fraction: 0.4,
    wheelColors: ['#7C3AED', '#6D28D9'],
    glow: 'rgba(124,58,237,0.6)',
    wheelTextColor: '#FFFFFF',
    gradient: 'from-violet-900/60 to-purple-900/40',
    border: 'border-violet-500/30',
    badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    textAccent: 'text-violet-300',
  },
  {
    id: 'action',
    label: 'Action',
    emoji: '⚡',
    fraction: 0.4,
    wheelColors: ['#EA580C', '#C2410C'],
    glow: 'rgba(234,88,12,0.6)',
    wheelTextColor: '#FFFFFF',
    gradient: 'from-orange-900/60 to-amber-900/40',
    border: 'border-orange-500/30',
    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    textAccent: 'text-orange-300',
  },
  {
    id: 'question',
    label: 'Question\nVisée',
    emoji: '🎯',
    fraction: 0.2,
    wheelColors: ['#BE185D', '#9D174D'],
    glow: 'rgba(190,24,93,0.6)',
    wheelTextColor: '#FFFFFF',
    gradient: 'from-pink-900/60 to-rose-900/40',
    border: 'border-pink-500/30',
    badge: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    textAccent: 'text-pink-300',
  },
]

export function getCategoryById(id: WheelCategory): CategoryConfig {
  const cat = CATEGORIES.find((c) => c.id === id)
  if (!cat) throw new Error(`Unknown category: ${id}`)
  return cat
}
