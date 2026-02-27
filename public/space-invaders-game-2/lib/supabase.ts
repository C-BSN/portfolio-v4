import { createClient } from "@supabase/supabase-js"

// Check if Supabase environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create Supabase client if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export interface LeaderboardEntry {
  id?: number
  player_name: string
  score: number
  level_reached: number
  created_at?: string
}

// Fallback functions for localStorage
const getLocalLeaderboard = (): LeaderboardEntry[] => {
  try {
    const saved = localStorage.getItem("stitch-invaders-leaderboard")
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const saveLocalLeaderboard = (data: LeaderboardEntry[]) => {
  try {
    localStorage.setItem("stitch-invaders-leaderboard", JSON.stringify(data))
  } catch (error) {
    console.error("Error saving to localStorage:", error)
  }
}

// Get top scores from leaderboard
export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  // If Supabase is not configured, use localStorage
  if (!supabase) {
    console.log("Supabase not configured, using localStorage")
    const localData = getLocalLeaderboard()
    return localData.sort((a, b) => b.score - a.score).slice(0, limit)
  }

  try {
    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .order("score", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching leaderboard:", error)
      // Fallback to localStorage
      return getLocalLeaderboard()
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
    }

    return data || []
  } catch (error) {
    console.error("Supabase error:", error)
    // Fallback to localStorage
    return getLocalLeaderboard()
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }
}

// Add new score to leaderboard
export async function addScore(playerName: string, score: number, levelReached: number): Promise<boolean> {
  // If Supabase is not configured, use localStorage
  if (!supabase) {
    console.log("Supabase not configured, using localStorage")
    const localData = getLocalLeaderboard()
    const newEntry: LeaderboardEntry = {
      id: Date.now(), // Simple ID for localStorage
      player_name: playerName,
      score: score,
      level_reached: levelReached,
      created_at: new Date().toISOString(),
    }
    const updatedData = [...localData, newEntry].sort((a, b) => b.score - a.score).slice(0, 50) // Keep top 50
    saveLocalLeaderboard(updatedData)
    return true
  }

  try {
    const { error } = await supabase.from("leaderboard").insert([
      {
        player_name: playerName,
        score: score,
        level_reached: levelReached,
      },
    ])

    if (error) {
      console.error("Error adding score:", error)
      // Fallback to localStorage
      const localData = getLocalLeaderboard()
      const newEntry: LeaderboardEntry = {
        id: Date.now(),
        player_name: playerName,
        score: score,
        level_reached: levelReached,
        created_at: new Date().toISOString(),
      }
      const updatedData = [...localData, newEntry].sort((a, b) => b.score - a.score).slice(0, 50)
      saveLocalLeaderboard(updatedData)
      return true
    }

    return true
  } catch (error) {
    console.error("Supabase error:", error)
    // Fallback to localStorage
    const localData = getLocalLeaderboard()
    const newEntry: LeaderboardEntry = {
      id: Date.now(),
      player_name: playerName,
      score: score,
      level_reached: levelReached,
      created_at: new Date().toISOString(),
    }
    const updatedData = [...localData, newEntry].sort((a, b) => b.score - a.score).slice(0, 50)
    saveLocalLeaderboard(updatedData)
    return true
  }
}

// Get player's best score
export async function getPlayerBestScore(playerName: string): Promise<number> {
  if (!supabase) {
    const localData = getLocalLeaderboard()
    const playerScores = localData.filter((entry) => entry.player_name === playerName)
    return playerScores.length > 0 ? Math.max(...playerScores.map((entry) => entry.score)) : 0
  }

  try {
    const { data, error } = await supabase
      .from("leaderboard")
      .select("score")
      .eq("player_name", playerName)
      .order("score", { ascending: false })
      .limit(1)

    if (error) {
      console.error("Error fetching player best score:", error)
      // Fallback to localStorage
      const localData = getLocalLeaderboard()
      const playerScores = localData.filter((entry) => entry.player_name === playerName)
      return playerScores.length > 0 ? Math.max(...playerScores.map((entry) => entry.score)) : 0
    }

    return data?.[0]?.score || 0
  } catch (error) {
    console.error("Supabase error:", error)
    const localData = getLocalLeaderboard()
    const playerScores = localData.filter((entry) => entry.player_name === playerName)
    return playerScores.length > 0 ? Math.max(...playerScores.map((entry) => entry.score)) : 0
  }
}

// Get player's rank for a specific score
export async function getPlayerRank(score: number): Promise<number> {
  if (!supabase) {
    const localData = getLocalLeaderboard()
    const betterScores = localData.filter((entry) => entry.score > score)
    return betterScores.length + 1
  }

  try {
    const { count, error } = await supabase
      .from("leaderboard")
      .select("*", { count: "exact", head: true })
      .gt("score", score)

    if (error) {
      console.error("Error fetching player rank:", error)
      // Fallback to localStorage
      const localData = getLocalLeaderboard()
      const betterScores = localData.filter((entry) => entry.score > score)
      return betterScores.length + 1
    }

    return (count || 0) + 1
  } catch (error) {
    console.error("Supabase error:", error)
    const localData = getLocalLeaderboard()
    const betterScores = localData.filter((entry) => entry.score > score)
    return betterScores.length + 1
  }
}

// Check if Supabase is available
export const isSupabaseAvailable = (): boolean => {
  return supabase !== null
}
