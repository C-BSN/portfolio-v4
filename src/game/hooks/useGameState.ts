'use client'

import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type {
  GameState, Player, CustomQuestion, GameMode,
  WheelCategory, GameCard, HistoryItem,
} from '@/game/types'
import { TRUTHS } from '@/game/data/truths'
import { ACTIONS } from '@/game/data/actions'
import {
  MAX_RECENT_TRUTHS, MAX_RECENT_ACTIONS, MAX_RECENT_QUESTIONS,
  MAX_HISTORY, MAX_PLAYERS,
} from '@/game/config/constants'

export { MAX_PLAYERS }

const PLAYER_COLORS = [
  '#8B5CF6', '#EC4899', '#F97316', '#06B6D4',
  '#10B981', '#F59E0B', '#3B82F6', '#EF4444',
  '#8EC5FC', '#A78BFA', '#34D399', '#FB923C',
]

const INITIAL_STATE: GameState = {
  screen: 'home',
  players: [],
  shuffledPlayerIds: [],
  currentPlayerIndex: 0,
  mode: 'mix',
  customQuestions: [],
  turnCount: 0,
  currentCard: null,
  wheelPhase: 'idle',
  history: [],
  recentTruthIds: [],
  recentActionIds: [],
  recentQuestionIndexes: [],
  wheelRotation: 0,
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function pickRandom<T extends { id: string }>(items: T[], recentIds: string[]): T {
  const available = items.filter((item) => !recentIds.includes(item.id))
  const pool = available.length > 0 ? available : items
  return pool[Math.floor(Math.random() * pool.length)]
}

export function useGameState() {
  const { value: state, setValue: setState } = useLocalStorage<GameState>(
    'roue-des-problemes-state',
    INITIAL_STATE
  )

  const update = useCallback(
    (partial: Partial<GameState>) => setState((prev) => ({ ...prev, ...partial })),
    [setState]
  )

  const goToSetup = useCallback(() => update({ screen: 'setup' }), [update])
  const goToHome = useCallback(() => update({ screen: 'home' }), [update])

  const addPlayer = useCallback(
    (name: string) => {
      if (!name.trim()) return
      const id = `player-${Date.now()}-${Math.random()}`
      const color = PLAYER_COLORS[state.players.length % PLAYER_COLORS.length]
      const newPlayer: Player = { id, name: name.trim(), color }
      update({ players: [...state.players, newPlayer] })
    },
    [state.players, update]
  )

  const removePlayer = useCallback(
    (id: string) => update({ players: state.players.filter((p) => p.id !== id) }),
    [state.players, update]
  )

  const shufflePlayers = useCallback(() => {
    update({ shuffledPlayerIds: shuffleArray(state.players.map((p) => p.id)) })
  }, [state.players, update])

  const setMode = useCallback((mode: GameMode) => update({ mode }), [update])

  const addQuestion = useCallback(
    (text: string) => {
      if (!text.trim()) return
      const question: CustomQuestion = { id: `q-${Date.now()}`, text: text.trim() }
      update({ customQuestions: [...state.customQuestions, question] })
    },
    [state.customQuestions, update]
  )

  const removeQuestion = useCallback(
    (id: string) => update({ customQuestions: state.customQuestions.filter((q) => q.id !== id) }),
    [state.customQuestions, update]
  )

  const editQuestion = useCallback(
    (id: string, text: string) => update({
      customQuestions: state.customQuestions.map((q) => q.id === id ? { ...q, text } : q),
    }),
    [state.customQuestions, update]
  )

  const startGame = useCallback(() => {
    if (state.players.length < 2) return
    update({
      screen: 'game',
      shuffledPlayerIds: shuffleArray(state.players.map((p) => p.id)),
      currentPlayerIndex: 0,
      turnCount: 0,
      currentCard: null,
      wheelPhase: 'idle',
      history: [],
      recentTruthIds: [],
      recentActionIds: [],
      recentQuestionIndexes: [],
      wheelRotation: 0,
    })
  }, [state.players, update])

  const drawCard = useCallback(
    (category: WheelCategory): GameCard | null => {
      if (category === 'question') {
        if (state.customQuestions.length === 0) return null
        const available = state.customQuestions.filter((_, i) => !state.recentQuestionIndexes.includes(i))
        const pool = available.length > 0 ? available : state.customQuestions
        const idx = state.customQuestions.indexOf(pool[Math.floor(Math.random() * pool.length)])
        update({ recentQuestionIndexes: [...state.recentQuestionIndexes, idx].slice(-MAX_RECENT_QUESTIONS) })
        return { category: 'question', content: state.customQuestions[idx].text, level: 'custom' }
      }
      if (category === 'verite') {
        const pool = state.mode === 'mix' ? TRUTHS : TRUTHS.filter((t) => t.level === state.mode)
        const item = pickRandom(pool, state.recentTruthIds)
        update({ recentTruthIds: [...state.recentTruthIds, item.id].slice(-MAX_RECENT_TRUTHS) })
        return { category: 'verite', content: item.text, level: item.level }
      }
      if (category === 'action') {
        const pool = state.mode === 'mix' ? ACTIONS : ACTIONS.filter((a) => a.level === state.mode)
        const item = pickRandom(pool, state.recentActionIds)
        update({ recentActionIds: [...state.recentActionIds, item.id].slice(-MAX_RECENT_ACTIONS) })
        return { category: 'action', content: item.text, level: item.level }
      }
      return null
    },
    [state, update]
  )

  const onSpinComplete = useCallback(
    (category: WheelCategory, finalRotation: number) => {
      const card = drawCard(category)
      update({ wheelPhase: 'result', currentCard: card, wheelRotation: finalRotation })
    },
    [drawCard, update]
  )

  const setWheelSpinning = useCallback(
    () => update({ wheelPhase: 'spinning', currentCard: null }),
    [update]
  )

  const nextPlayer = useCallback(() => {
    const currentPlayerId = state.shuffledPlayerIds[state.currentPlayerIndex]
    const currentPlayer = state.players.find((p) => p.id === currentPlayerId)
    if (state.currentCard && currentPlayer) {
      const historyItem: HistoryItem = {
        id: `h-${Date.now()}`,
        playerName: currentPlayer.name,
        card: state.currentCard,
        turnNumber: state.turnCount + 1,
      }
      update({
        currentPlayerIndex: (state.currentPlayerIndex + 1) % state.shuffledPlayerIds.length,
        turnCount: state.turnCount + 1,
        currentCard: null,
        wheelPhase: 'idle',
        history: [historyItem, ...state.history].slice(0, MAX_HISTORY),
      })
    } else {
      update({
        currentPlayerIndex: (state.currentPlayerIndex + 1) % state.shuffledPlayerIds.length,
        wheelPhase: 'idle',
        currentCard: null,
      })
    }
  }, [state, update])

  const skipCard = useCallback(() => update({ currentCard: null, wheelPhase: 'idle' }), [update])

  const rerollCard = useCallback(() => {
    if (!state.currentCard) return
    update({ currentCard: drawCard(state.currentCard.category) })
  }, [state.currentCard, drawCard, update])

  const resetGame = useCallback(() => update({
    screen: 'setup',
    shuffledPlayerIds: [],
    currentPlayerIndex: 0,
    turnCount: 0,
    currentCard: null,
    wheelPhase: 'idle',
    history: [],
    recentTruthIds: [],
    recentActionIds: [],
    recentQuestionIndexes: [],
    wheelRotation: 0,
  }), [update])

  const fullReset = useCallback(() => setState(INITIAL_STATE), [setState])

  return {
    state, goToSetup, goToHome, addPlayer, removePlayer, shufflePlayers,
    setMode, addQuestion, removeQuestion, editQuestion, startGame,
    onSpinComplete, setWheelSpinning, nextPlayer, skipCard, rerollCard,
    resetGame, fullReset,
  }
}

export function getPlayerById(players: Player[], id: string): Player | undefined {
  return players.find((p) => p.id === id)
}
