export interface LeaderboardEntry {
  id?: number
  player_name: string
  score: number
  level_reached: number
  created_at?: string
}

const STORAGE_KEY = "stitch-invaders-leaderboard"

function getLocalLeaderboard(): LeaderboardEntry[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function saveLocalLeaderboard(data: LeaderboardEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("Error saving to localStorage:", error)
  }
}

export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  return getLocalLeaderboard()
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export async function addScore(playerName: string, score: number, levelReached: number): Promise<boolean> {
  const localData = getLocalLeaderboard()
  const newEntry: LeaderboardEntry = {
    id: Date.now(),
    player_name: playerName,
    score,
    level_reached: levelReached,
    created_at: new Date().toISOString(),
  }
  const updatedData = [...localData, newEntry].sort((a, b) => b.score - a.score).slice(0, 50)
  saveLocalLeaderboard(updatedData)
  return true
}

export async function getPlayerRank(score: number): Promise<number> {
  const localData = getLocalLeaderboard()
  return localData.filter((entry) => entry.score > score).length + 1
}
