export type GameMode = 'soft' | 'spicy' | 'mix'

export type WheelCategory = 'action' | 'verite' | 'question'

export type AppScreen = 'home' | 'setup' | 'game'

export type WheelPhase = 'idle' | 'spinning' | 'result'

export interface Player {
  id: string
  name: string
  color: string
}

export interface CustomQuestion {
  id: string
  text: string
}

export interface ContentItem {
  id: string
  text: string
  level: 'soft' | 'spicy'
}

export interface GameCard {
  category: WheelCategory
  content: string
  level?: 'soft' | 'spicy' | 'custom'
}

export interface HistoryItem {
  id: string
  playerName: string
  card: GameCard
  turnNumber: number
}

export interface GameState {
  screen: AppScreen
  players: Player[]
  shuffledPlayerIds: string[]
  currentPlayerIndex: number
  mode: GameMode
  customQuestions: CustomQuestion[]
  turnCount: number
  currentCard: GameCard | null
  wheelPhase: WheelPhase
  history: HistoryItem[]
  recentTruthIds: string[]
  recentActionIds: string[]
  recentQuestionIndexes: number[]
  wheelRotation: number
}
