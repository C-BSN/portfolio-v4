"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { getLeaderboard, addScore, getPlayerRank, type LeaderboardEntry } from "@/lib/stitch-invaders/leaderboard"
import { useAudio } from "@/lib/stitch-invaders/use-audio"
import Link from "next/link"

const IMG = "/images/stitch-invaders"

interface Position { x: number; y: number }

interface Bullet {
  x: number; y: number; direction: "up" | "down"; speed: number
  type: "player" | "enemy_single" | "enemy_spread" | "enemy_rapid"
  velocityX?: number; velocityY?: number
}

interface Enemy {
  x: number; y: number; type: "green" | "purple" | "red"; alive: boolean
  row: number; lastShot: number; shootPattern: "single" | "spread" | "rapid"
}

interface Ship {
  x: number; y: number; width: number; height: number; blocks: boolean[][]
}

interface Explosion {
  x: number; y: number; startTime: number; duration: number; type: "player" | "enemy"
}

const GAME_WIDTH = 800
const GAME_HEIGHT = 600
const PLAYER_SPEED = 6
const BULLET_SPEED = 7
const BASE_ENEMY_SPEED = 0.6
const BASE_ENEMY_SHOOT_INTERVAL = 1000
const BASE_ENEMY_BULLET_SPEED = 4
const MAX_ENEMY_BULLETS = 8
const STARS_COUNT = 50
const MENU_STARS_COUNT = 100
const EXPLOSION_PARTICLES = 8

export default function StitchInvadersGame() {
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">("menu")
  const [player, setPlayer] = useState<Position>({ x: GAME_WIDTH / 2 - 25, y: GAME_HEIGHT - 60 })
  const [enemies, setEnemies] = useState<Enemy[]>([])
  const [bullets, setBullets] = useState<Bullet[]>([])
  const [enemyBullets, setEnemyBullets] = useState<Bullet[]>([])
  const [ships, setShips] = useState<Ship[]>([])
  const [score, setScore] = useState(0)
  const [hiScore, setHiScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [level, setLevel] = useState(1)
  const [keys, setKeys] = useState<Set<string>>(new Set())
  const [enemyDirection, setEnemyDirection] = useState(1)
  const [explosions, setExplosions] = useState<Explosion[]>([])
  const [isPaused, setIsPaused] = useState(false)

  const [playerName, setPlayerName] = useState("")
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [playerRank, setPlayerRank] = useState<number | null>(null)
  const [showInfo, setShowInfo] = useState(false)
  const [showAudioSettings, setShowAudioSettings] = useState(false)
  const [showInGameLeaderboard, setShowInGameLeaderboard] = useState(false)

  const audio = useAudio()

  const menuStars = useRef<Array<{ left: string; top: string; size: number; opacity: number }>>([])
  const gameStars = useRef<Array<{ left: string; top: string; size: number; opacity: number }>>([])

  useEffect(() => {
    if (menuStars.current.length === 0) {
      menuStars.current = Array.from({ length: MENU_STARS_COUNT }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
      }))
    }
    if (gameStars.current.length === 0) {
      gameStars.current = Array.from({ length: STARS_COUNT }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.6 + 0.2,
      }))
    }
  }, [])

  const gameLoopRef = useRef<number | undefined>(undefined)
  const lastShotRef = useRef(0)
  const lastEnemyMoveRef = useRef(0)
  const moveDownRef = useRef(false)

  const enemiesRef = useRef<Enemy[]>([])
  const bulletsRef = useRef<Bullet[]>([])
  const enemyBulletsRef = useRef<Bullet[]>([])
  const playerRef = useRef<Position>({ x: GAME_WIDTH / 2 - 25, y: GAME_HEIGHT - 60 })
  const scoreRef = useRef(0)
  const livesRef = useRef(3)

  useEffect(() => { enemiesRef.current = enemies }, [enemies])
  useEffect(() => { bulletsRef.current = bullets }, [bullets])
  useEffect(() => { enemyBulletsRef.current = enemyBullets }, [enemyBullets])
  useEffect(() => { playerRef.current = player }, [player])
  useEffect(() => { scoreRef.current = score }, [score])
  useEffect(() => { livesRef.current = lives }, [lives])

  const getDifficultySettings = useCallback((lvl: number) => {
    const tier = Math.floor((lvl - 1) / 3)
    const speedMultiplier = 1 + tier * 0.2

    let shootFrequency = 0.5
    if (lvl >= 3) shootFrequency = 0.7
    if (lvl >= 6) shootFrequency = 0.9
    if (lvl >= 9) shootFrequency = 1.1
    if (lvl >= 12) shootFrequency = 1.3

    const enemyCount = Math.min(8 + tier, 13)

    return {
      enemySpeed: BASE_ENEMY_SPEED * speedMultiplier,
      enemyShootInterval: Math.max(300, Math.floor(BASE_ENEMY_SHOOT_INTERVAL / shootFrequency)),
      enemyBulletSpeed: BASE_ENEMY_BULLET_SPEED + tier * 0.3,
      playerShootDelay: Math.max(120, 250 - tier * 10),
      enemyCount,
      shootChance: Math.min(0.0001 + tier * 0.0002, 0.002),
    }
  }, [])

  const initializeShips = useCallback(() => {
    const newShips: Ship[] = []
    const shipWidth = 60
    const shipHeight = 40
    const shipCount = 4
    const spacing = (GAME_WIDTH - shipCount * shipWidth) / (shipCount + 1)

    for (let i = 0; i < shipCount; i++) {
      const x = spacing + i * (shipWidth + spacing)
      const y = GAME_HEIGHT - 200

      const blocks: boolean[][] = []
      for (let row = 0; row < shipHeight; row += 4) {
        const blockRow: boolean[] = []
        for (let col = 0; col < shipWidth; col += 4) {
          const isTopPart = row < shipHeight * 0.6
          const isLeftSide = col < shipWidth * 0.3
          const isRightSide = col >= shipWidth * 0.7

          let hasBlock = false
          if (isTopPart) {
            hasBlock = true
          } else {
            hasBlock = isLeftSide || isRightSide
          }
          blockRow.push(hasBlock)
        }
        blocks.push(blockRow)
      }
      newShips.push({ x, y, width: shipWidth, height: shipHeight, blocks })
    }
    setShips(newShips)
  }, [])

  const getEnemyAttackPattern = (enemyType: string): "single" | "spread" | "rapid" => {
    switch (enemyType) {
      case "green": return "spread"
      case "purple": return "rapid"
      case "red": return "single"
      default: return "single"
    }
  }

  const calculateDirectionToPlayer = (enemyX: number, enemyY: number, playerX: number, playerY: number) => {
    const dx = playerX + 25 - (enemyX + 20)
    const dy = playerY + 25 - (enemyY + 30)
    const distance = Math.sqrt(dx * dx + dy * dy)
    return { velocityX: (dx / distance) * 3, velocityY: (dy / distance) * 3 }
  }

  const createEnemyBullets = useCallback(
    (enemy: Enemy, playerPos: Position) => {
      const newBullets: Bullet[] = []
      const baseX = enemy.x + 20
      const baseY = enemy.y + 30
      const speedFactor = level <= 2 ? 0.7 : level <= 5 ? 0.85 : 1.0

      audio.playEnemyShoot()

      switch (enemy.shootPattern) {
        case "single": {
          const dir = calculateDirectionToPlayer(enemy.x, enemy.y, playerPos.x, playerPos.y)
          newBullets.push({
            x: baseX, y: baseY, direction: "down", speed: 6 * speedFactor,
            type: "enemy_single",
            velocityX: dir.velocityX * speedFactor, velocityY: dir.velocityY * speedFactor,
          })
          break
        }
        case "spread": {
          const dir = calculateDirectionToPlayer(enemy.x, enemy.y, playerPos.x, playerPos.y)
          const spreadCount = level <= 3 ? 2 : 3
          const spreadStep = spreadCount === 2 ? 2 : 1

          for (let i = -1; i <= 1; i += spreadStep) {
            const angle = Math.atan2(dir.velocityY, dir.velocityX) + i * 0.3
            const speed = 4 * speedFactor
            newBullets.push({
              x: baseX + i * 5, y: baseY, direction: "down", speed,
              type: "enemy_spread",
              velocityX: Math.cos(angle) * speed, velocityY: Math.sin(angle) * speed,
            })
          }
          break
        }
        case "rapid": {
          const dir = calculateDirectionToPlayer(enemy.x, enemy.y, playerPos.x, playerPos.y)
          newBullets.push({
            x: baseX, y: baseY, direction: "down", speed: 5 * speedFactor,
            type: "enemy_rapid",
            velocityX: dir.velocityX * speedFactor, velocityY: dir.velocityY * speedFactor,
          })
          break
        }
      }
      return newBullets
    },
    [level, audio],
  )

  const initializeEnemies = useCallback(() => {
    const newEnemies: Enemy[] = []
    const difficulty = getDifficultySettings(level)

    const baseRows = [
      { count: difficulty.enemyCount, type: "green" as const, startY: 120, row: 0 },
      { count: difficulty.enemyCount, type: "purple" as const, startY: 150, row: 1 },
      { count: difficulty.enemyCount, type: "purple" as const, startY: 180, row: 2 },
      { count: Math.max(9, difficulty.enemyCount - 2), type: "red" as const, startY: 210, row: 3 },
      { count: Math.max(8, difficulty.enemyCount - 3), type: "red" as const, startY: 240, row: 4 },
    ]

    baseRows.forEach((rowData) => {
      for (let i = 0; i < rowData.count; i++) {
        newEnemies.push({
          x: 80 + i * 35, y: rowData.startY, type: rowData.type,
          alive: true, row: rowData.row, lastShot: 0,
          shootPattern: getEnemyAttackPattern(rowData.type),
        })
      }
    })

    setEnemies(newEnemies)
    setEnemyDirection(1)
    moveDownRef.current = false
  }, [level, getDifficultySettings])

  const loadLeaderboard = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getLeaderboard(10)
      setLeaderboard(data)
      if (data.length > 0) setHiScore(data[0].score)
    } catch (error) {
      console.error("Error loading leaderboard:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const saveScore = useCallback(
    async (name: string, s: number, levelReached: number) => {
      try {
        const success = await addScore(name, s, levelReached)
        if (success) {
          const rank = await getPlayerRank(s)
          setPlayerRank(rank)
          await loadLeaderboard()
        }
      } catch (error) {
        console.error("Error saving score:", error)
      }
    },
    [loadLeaderboard],
  )

  const startGame = () => {
    if (!playerName.trim()) {
      alert("Entre ton nom d'abord !")
      return
    }
    audio.playMenuSelect()
    setGameState("playing")
    setScore(0)
    setLives(3)
    setLevel(1)
    setPlayerRank(null)
    setPlayer({ x: GAME_WIDTH / 2 - 25, y: GAME_HEIGHT - 60 })
    setBullets([])
    setEnemyBullets([])
    setEnemyDirection(1)
    moveDownRef.current = false
    initializeEnemies()
    initializeShips()
    setIsPaused(false)
  }

  const checkShipCollision = useCallback(
    (bulletX: number, bulletY: number) => {
      for (let shipIndex = 0; shipIndex < ships.length; shipIndex++) {
        const ship = ships[shipIndex]
        const distance = Math.sqrt(
          Math.pow(bulletX - (ship.x + ship.width / 2), 2) + Math.pow(bulletY - (ship.y + ship.height / 2), 2),
        )
        if (distance > 100) continue

        if (bulletX >= ship.x && bulletX <= ship.x + ship.width && bulletY >= ship.y && bulletY <= ship.y + ship.height) {
          const blockX = Math.floor((bulletX - ship.x) / 4)
          const blockY = Math.floor((bulletY - ship.y) / 4)

          if (blockY >= 0 && blockY < ship.blocks.length && blockX >= 0 && blockX < ship.blocks[0].length && ship.blocks[blockY][blockX]) {
            setShips((prevShips) => {
              const newShips = [...prevShips]
              const newBlocks = newShips[shipIndex].blocks.map((row) => [...row])
              for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                  const newY = blockY + dy
                  const newX = blockX + dx
                  if (newY >= 0 && newY < newBlocks.length && newX >= 0 && newX < newBlocks[newY].length) {
                    newBlocks[newY][newX] = false
                  }
                }
              }
              newShips[shipIndex] = { ...newShips[shipIndex], blocks: newBlocks }
              return newShips
            })
            return true
          }
        }
      }
      return false
    },
    [ships],
  )

  const gameKeys = new Set(["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "z", "q", "d"])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (gameState === "playing" && gameKeys.has(key)) {
        e.preventDefault()
      }
      if (key === "escape" && gameState === "playing") {
        setIsPaused((prev) => !prev)
        return
      }
      setKeys((prev) => new Set(prev).add(key))
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (gameState === "playing" && gameKeys.has(key)) {
        e.preventDefault()
      }
      setKeys((prev) => { const n = new Set(prev); n.delete(key); return n })
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => { window.removeEventListener("keydown", handleKeyDown); window.removeEventListener("keyup", handleKeyUp) }
  }, [gameState])

  useEffect(() => { loadLeaderboard() }, [loadLeaderboard])

  const togglePause = useCallback(() => { setIsPaused((prev) => !prev) }, [])

  const toggleInGameLeaderboard = useCallback(() => {
    setShowInGameLeaderboard((prev) => !prev)
    if (!isPaused) setIsPaused(true)
  }, [isPaused])

  // Game loop
  useEffect(() => {
    if (gameState !== "playing" || isPaused) return

    const gameLoop = () => {
      const now = Date.now()
      const difficulty = getDifficultySettings(level)

      setPlayer((prev) => {
        let newX = prev.x
        if (keys.has("arrowleft") || keys.has("q")) newX -= PLAYER_SPEED
        if (keys.has("arrowright") || keys.has("d")) newX += PLAYER_SPEED
        return { ...prev, x: Math.max(0, Math.min(GAME_WIDTH - 50, newX)) }
      })

      if ((keys.has(" ") || keys.has("arrowup") || keys.has("z")) && now - lastShotRef.current > difficulty.playerShootDelay) {
        setBullets((prev) => [...prev, { x: player.x + 25, y: player.y, direction: "up", speed: BULLET_SPEED, type: "player" }])
        audio.playPlayerShoot()
        lastShotRef.current = now
      }

      // Move enemies
      if (now - lastEnemyMoveRef.current > 32) {
        lastEnemyMoveRef.current = now
        setEnemies((prevEnemies) => {
          const alive = prevEnemies.filter((e) => e.alive)
          if (alive.length === 0) return prevEnemies
          const leftMost = Math.min(...alive.map((e) => e.x))
          const rightMost = Math.max(...alive.map((e) => e.x))
          if (rightMost >= GAME_WIDTH - 50 && enemyDirection > 0) { setEnemyDirection(-1); moveDownRef.current = true }
          else if (leftMost <= 10 && enemyDirection < 0) { setEnemyDirection(1); moveDownRef.current = true }
          return prevEnemies.map((e) => ({
            ...e,
            x: e.x + (moveDownRef.current ? 0 : enemyDirection * difficulty.enemySpeed),
            y: e.y + (moveDownRef.current ? 0.5 : 0),
          }))
        })
        if (moveDownRef.current) setTimeout(() => { moveDownRef.current = false }, 500)
      }

      // Enemy shooting
      setEnemies((prevEnemies) => {
        const updated = [...prevEnemies]
        if (enemyBulletsRef.current.length >= MAX_ENEMY_BULLETS) return updated
        const maxShots = Math.min(1 + Math.floor(level / 4), 3)
        let shots = 0
        const alive = updated.filter((e) => e.alive)

        alive.forEach((enemy) => {
          if (shots >= maxShots) return
          const idx = updated.findIndex((e) => e === enemy)
          let interval = difficulty.enemyShootInterval
          if (enemy.shootPattern === "rapid") interval *= 0.8
          else if (enemy.shootPattern === "spread") interval *= 1.5
          else interval *= 1.2

          const baseChance = difficulty.shootChance * (level <= 2 ? 0.5 : 1.0)
          if (now - enemy.lastShot > interval && Math.random() < baseChance) {
            const newBullets = createEnemyBullets(enemy, playerRef.current)
            setEnemyBullets((prev) => [...prev, ...newBullets])
            updated[idx] = { ...enemy, lastShot: now }
            shots++
          }
        })
        return updated
      })

      // Move player bullets + collision with enemies (single functional setState)
      setBullets((prevBullets) => {
        const movedBullets = prevBullets
          .map((b) => ({ ...b, y: b.y - b.speed }))
          .filter((b) => b.y > 0)

        const currentEnemies = enemiesRef.current
        const surviving: Bullet[] = []
        const killedIndices = new Set<number>()
        let pointsEarned = 0

        for (const bullet of movedBullets) {
          let hit = false
          if (checkShipCollision(bullet.x, bullet.y)) {
            hit = true
          } else {
            for (let i = 0; i < currentEnemies.length; i++) {
              if (killedIndices.has(i)) continue
              const e = currentEnemies[i]
              if (e.alive && bullet.x >= e.x && bullet.x <= e.x + 40 && bullet.y >= e.y && bullet.y <= e.y + 30) {
                killedIndices.add(i)
                pointsEarned += e.type === "green" ? 30 : e.type === "purple" ? 20 : 10
                audio.playEnemyHit()
                hit = true
                break
              }
            }
          }
          if (!hit) surviving.push(bullet)
        }

        if (killedIndices.size > 0) {
          setEnemies((prev) => prev.map((e, i) => killedIndices.has(i) ? { ...e, alive: false } : e))
          setScore((prev) => prev + pointsEarned)
        }

        return surviving
      })

      // Move enemy bullets + collision with player (single functional setState)
      setEnemyBullets((prevBullets) => {
        const movedBullets = prevBullets
          .map((b) => ({ ...b, x: b.x + (b.velocityX || 0), y: b.y + (b.velocityY || difficulty.enemyBulletSpeed) }))
          .filter((b) => b.y < GAME_HEIGHT && b.x > -10 && b.x < GAME_WIDTH + 10)

        const p = playerRef.current
        const surviving: Bullet[] = []
        let playerWasHit = false

        for (const bullet of movedBullets) {
          let hit = false
          if (checkShipCollision(bullet.x, bullet.y)) {
            hit = true
          } else if (bullet.x > p.x && bullet.x < p.x + 50 && bullet.y > p.y && bullet.y < p.y + 40) {
            if (!playerWasHit) {
              playerWasHit = true
              hit = true
            }
          }
          if (!hit) surviving.push(bullet)
        }

        if (playerWasHit) {
          setExplosions((pe) => [...pe, { x: p.x + 25, y: p.y + 25, startTime: Date.now(), duration: 1000, type: "player" }])
          audio.playPlayerHit()
          setLives((prev) => {
            const newLives = prev - 1
            if (newLives <= 0) {
              setGameState("gameOver")
              if (scoreRef.current > hiScore) setHiScore(scoreRef.current)
              saveScore(playerName, scoreRef.current, level)
              setTimeout(() => audio.playGameOver(), 500)
            }
            return newLives
          })
        }

        return surviving
      })

      const alive = enemies.filter((e) => e.alive)
      if (alive.length === 0) {
        setLevel((prev) => prev + 1)
        audio.playLevelComplete()
        setTimeout(() => { initializeEnemies(); initializeShips() }, 1000)
      }

      setExplosions((prev) => prev.filter((e) => Date.now() - e.startTime < e.duration))
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current) }
  }, [gameState, player, enemies, keys, enemyDirection, score, hiScore, initializeEnemies, playerName, level, saveScore, getDifficultySettings, checkShipCollision, initializeShips, createEnemyBullets, isPaused, audio, enemyBullets.length])

  const EnemyComponent = ({ enemy }: { enemy: Enemy }) => {
    if (!enemy.alive) return null
    const imageSrc = enemy.type === "green" ? `${IMG}/leroy.png` : enemy.type === "purple" ? `${IMG}/jumba.png` : `${IMG}/pleakley.png`
    const glow = enemy.type === "green" ? "rgba(255,0,0,0.8)" : enemy.type === "purple" ? "rgba(138,43,226,0.8)" : "rgba(124,252,0,0.8)"

    return (
      <div className="absolute" style={{ left: enemy.x, top: enemy.y, width: 40, height: 40, filter: `drop-shadow(0 0 4px ${glow})` }}>
        <img src={imageSrc} alt={`${enemy.type} alien`} className="w-full h-full object-contain absolute inset-0" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
      </div>
    )
  }

  const BulletComponent = ({ bullet }: { bullet: Bullet }) => {
    const styles: Record<string, { bg: string; w: number; h: number }> = {
      player: { bg: "#00FFFF", w: 2, h: 6 },
      enemy_single: { bg: "#FF4444", w: 3, h: 8 },
      enemy_spread: { bg: "#44FF44", w: 2, h: 4 },
      enemy_rapid: { bg: "#FF44FF", w: 2, h: 5 },
    }
    const s = styles[bullet.type] || styles.player
    return <div className="absolute" style={{ left: bullet.x, top: bullet.y, width: s.w, height: s.h, backgroundColor: s.bg, boxShadow: `0 0 4px ${s.bg}` }} />
  }

  const ShipComponent = ({ ship }: { ship: Ship }) => (
    <div className="absolute" style={{ left: ship.x, top: ship.y, width: ship.width, height: ship.height }}>
      {ship.blocks.map((row, ri) => row.map((has, ci) => has ? (
        <div key={`${ri}-${ci}`} className="absolute bg-green-500" style={{ left: ci * 4, top: ri * 4, width: 4, height: 4, boxShadow: "0 0 2px rgba(34,197,94,0.5)" }} />
      ) : null))}
    </div>
  )

  const ExplosionComponent = ({ explosion }: { explosion: Explosion }) => {
    const progress = (Date.now() - explosion.startTime) / explosion.duration
    if (progress >= 1) return null
    const particles = Array.from({ length: EXPLOSION_PARTICLES }, (_, i) => ({ angle: (i * Math.PI) / 4 }))
    const grad = explosion.type === "player"
      ? "radial-gradient(circle, #ff4444 0%, #ff8844 30%, #ffaa44 60%, transparent 100%)"
      : "radial-gradient(circle, #44ff44 0%, #88ff44 30%, #aaff44 60%, transparent 100%)"

    return (
      <div className="absolute pointer-events-none" style={{ left: explosion.x - 30, top: explosion.y - 30, width: 60, height: 60, transform: `scale(${0.5 + progress * 2}) rotate(${progress * 360}deg)`, opacity: 1 - progress, zIndex: 100 }}>
        <div className="absolute inset-0 rounded-full" style={{ background: grad }} />
        {particles.map((p, i) => (
          <div key={i} className="absolute w-1 h-1 bg-white rounded-full" style={{ left: `${50 + Math.cos(p.angle) * progress * 25}%`, top: `${50 + Math.sin(p.angle) * progress * 25}%`, opacity: 1 - progress }} />
        ))}
      </div>
    )
  }

  const renderStars = (stars: Array<{ left: string; top: string; size: number; opacity: number }>) =>
    stars.map((star, i) => (
      <div key={i} className="absolute bg-white rounded-full" style={{ left: star.left, top: star.top, width: `${star.size}px`, height: `${star.size}px`, opacity: star.opacity }} />
    ))

  // --- MENU ---
  if (gameState === "menu") {
    if (showLeaderboard) {
      return (
        <div className="w-full min-h-[80vh] bg-black text-white flex flex-col items-center justify-center relative overflow-hidden pt-8 pb-12">
          <div className="absolute inset-0">{renderStars(menuStars.current)}</div>
          <div className="text-center z-10 max-w-md w-full mx-4">
            <h1 className="text-4xl font-bold mb-4 text-yellow-300 tracking-wider">LEADERBOARD</h1>
            <div className="bg-gray-900/80 rounded-lg p-6 mb-6">
              {isLoading ? (
                <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto" /><p className="text-gray-400 mt-2">Chargement...</p></div>
              ) : leaderboard.length === 0 ? (
                <p className="text-gray-400">Aucun score pour le moment !</p>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((entry, index) => (
                    <div key={entry.id || index} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-bold ${index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-300" : index === 2 ? "text-orange-400" : "text-white"}`}>#{index + 1}</span>
                        <span className="text-white">{entry.player_name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-cyan-400 font-bold">{entry.score}</div>
                        <div className="text-xs text-gray-500">Niveau {entry.level_reached} • {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : "N/A"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => { audio.playMenuSelect(); setShowLeaderboard(false) }} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">RETOUR</button>
          </div>
        </div>
      )
    }

    if (showInfo) {
      return (
        <div className="w-full min-h-[80vh] bg-black text-white flex flex-col items-center justify-center relative overflow-hidden pt-8 pb-12">
          <div className="absolute inset-0">{renderStars(menuStars.current)}</div>
          <div className="text-center z-10 max-w-lg w-full mx-4">
            <h1 className="text-4xl font-bold mb-6 text-cyan-300 tracking-wider">INFORMATIONS</h1>
            <div className="bg-gray-900/80 rounded-lg p-6 mb-6 text-left space-y-4">
              <div><h3 className="text-lg font-bold text-yellow-300 mb-2">Controles</h3><p className="text-sm text-gray-300">Fleches ou ZQSD pour se deplacer</p><p className="text-sm text-gray-300">ESPACE ou FLECHE HAUT pour tirer</p><p className="text-sm text-gray-300">ECHAP pour mettre en pause</p></div>
              <div><h3 className="text-lg font-bold text-yellow-300 mb-2">Ennemis</h3><p className="text-sm text-red-400">Leroy : Tir disperse - 30 points</p><p className="text-sm text-purple-400">Jumba : Tir rapide - 20 points</p><p className="text-sm text-green-400">Pleakley : Tir puissant - 10 points</p></div>
            </div>
            <button onClick={() => { audio.playMenuSelect(); setShowInfo(false) }} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">RETOUR</button>
          </div>
        </div>
      )
    }

    if (showAudioSettings) {
      return (
        <div className="w-full min-h-[80vh] bg-black text-white flex flex-col items-center justify-center relative overflow-hidden pt-8 pb-12">
          <div className="absolute inset-0">{renderStars(menuStars.current)}</div>
          <div className="text-center z-10 max-w-md w-full mx-4">
            <h1 className="text-4xl font-bold mb-6 text-cyan-300 tracking-wider">AUDIO</h1>
            <div className="bg-gray-900/80 rounded-lg p-6 mb-6 space-y-6">
              <div>
                <label className="block text-lg font-bold text-yellow-300 mb-4">Effets sonores</label>
                <button onClick={() => { audio.toggleAudio(); audio.playMenuSelect() }} className={`w-full py-3 px-6 rounded-lg text-lg font-bold transition-colors ${audio.settings.enabled ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} text-white`}>
                  {audio.settings.enabled ? "ACTIVE" : "DESACTIVE"}
                </button>
              </div>
              <div>
                <label className="block text-lg font-bold text-yellow-300 mb-4">Volume : {Math.round(audio.settings.volume * 100)}%</label>
                <input type="range" min="0" max="1" step="0.1" value={audio.settings.volume} onChange={(e) => audio.setVolume(Number.parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" style={{ background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${audio.settings.volume * 100}%, #374151 ${audio.settings.volume * 100}%, #374151 100%)` }} />
              </div>
            </div>
            <button onClick={() => { audio.playMenuSelect(); setShowAudioSettings(false) }} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">RETOUR</button>
          </div>
        </div>
      )
    }

    return (
      <div className="w-full min-h-[80vh] bg-black text-white flex items-center justify-center relative overflow-hidden pt-8 pb-12">
        <div className="absolute inset-0">{renderStars(menuStars.current)}</div>
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl mx-auto px-8 z-10 gap-12">
          <div className="flex-1 text-center max-w-md">
            <h1 className="text-6xl md:text-7xl font-bold mb-2 text-yellow-300 tracking-wider" style={{ textShadow: "0 0 8px rgba(255,255,0,0.4)" }}>STITCH</h1>
            <h1 className="text-6xl md:text-7xl font-bold mb-8 text-yellow-300 tracking-wider" style={{ textShadow: "0 0 8px rgba(255,255,0,0.4)" }}>INVADERS</h1>

            <div className="mb-6">
              <label htmlFor="playerName" className="block text-sm text-gray-400 mb-2">Entre ton nom :</label>
              <input id="playerName" type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Ton nom" maxLength={15} className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-center focus:outline-none focus:border-cyan-400 transition-colors" />
            </div>

            <div className="space-y-3">
              <button onClick={startGame} disabled={!playerName.trim()} className={`w-full font-bold py-4 px-8 rounded-lg text-xl transition-colors ${playerName.trim() ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-600 text-gray-400 cursor-not-allowed"}`}>JOUER</button>
              <button onClick={() => { audio.playMenuSelect(); setShowLeaderboard(true) }} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">CLASSEMENT</button>
              <button onClick={() => { audio.playMenuSelect(); setShowInfo(true) }} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">INFOS</button>
              <button onClick={() => { audio.playMenuSelect(); setShowAudioSettings(true) }} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">AUDIO</button>
            </div>

            <div className="mt-6 text-xs space-y-1">
              <p className="text-red-400">Leroy : Tir disperse</p>
              <p className="text-purple-400">Jumba : Tir rapide</p>
              <p className="text-green-400">Pleakley : Tir puissant</p>
            </div>

            <Link href="/projects/lilo-stitch" className="inline-block mt-6 text-sm text-gray-500 hover:text-cyan-400 transition-colors underline underline-offset-4">
              Retour au projet Lilo &amp; Stitch
            </Link>
          </div>

          <div className="flex-1 flex justify-center items-center">
            <img src={`${IMG}/stitch-warrior.png`} alt="Stitch Warrior" className="w-64 md:w-96 h-auto object-contain" style={{ filter: "drop-shadow(0 0 20px rgba(255,255,0,0.3))", animation: "float 3s ease-in-out infinite" }} />
          </div>
        </div>

        <style jsx>{`@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }`}</style>
      </div>
    )
  }

  // --- GAME OVER ---
  if (gameState === "gameOver") {
    const difficulty = getDifficultySettings(level)
    return (
      <div className="w-full min-h-[80vh] bg-black text-white flex flex-col items-center justify-center pt-8 pb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-red-500" style={{ textShadow: "0 0 8px rgba(255,0,0,0.4)" }}>GAME OVER</h1>
        <p className="text-xl mb-2">Score final : {score}</p>
        <p className="text-lg mb-2">Niveau atteint : {level}</p>
        <p className="text-lg mb-2">Meilleur score : {hiScore}</p>
        <div className="text-sm text-gray-400 mb-4 text-center">
          <p>Vitesse ennemis : {difficulty.enemySpeed.toFixed(1)}x</p>
        </div>
        {playerRank && <p className="text-lg mb-4 text-yellow-400">Classement : #{playerRank}</p>}
        <div className="flex gap-4">
          <button onClick={startGame} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">REJOUER</button>
          <button onClick={() => { audio.playMenuSelect(); setGameState("menu") }} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">MENU</button>
        </div>
        <Link href="/projects/lilo-stitch" className="mt-8 text-sm text-gray-500 hover:text-cyan-400 transition-colors underline underline-offset-4">
          Retour au projet Lilo &amp; Stitch
        </Link>
      </div>
    )
  }

  // --- PLAYING ---
  return (
    <div className="w-full min-h-[80vh] bg-black text-white relative overflow-hidden flex flex-col items-center pt-8 pb-4">
      <div className="absolute inset-0">{renderStars(gameStars.current)}</div>

      <div className="relative bg-black border-2 border-gray-800 overflow-hidden" style={{ width: GAME_WIDTH, height: GAME_HEIGHT, maxWidth: "100vw" }}>
        {/* HUD */}
        <div className="absolute top-4 left-4 text-sm font-mono">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div>HI-SCORE {hiScore}</div>
              <div>SCORE {score}</div>
              <div>LEVEL {level}</div>
            </div>
            <div>
              <div>ALIENS {enemies.filter((e) => e.alive).length}</div>
              <div className="flex items-center gap-2">
                VIES
                {Array.from({ length: Math.max(0, lives) }).map((_, i) => (
                  <div key={i} className="w-6 h-6 relative">
                    <img src={`${IMG}/player-ship.png`} alt="vie" className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button onClick={togglePause} className="absolute top-4 right-1/2 translate-x-1/2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors">{isPaused ? "REPRENDRE" : "PAUSE"}</button>

        <button onClick={() => { audio.toggleAudio(); audio.playMenuSelect() }} className={`absolute top-4 right-4 text-xs font-mono transition-colors ${audio.settings.enabled ? "text-green-400" : "text-red-400"}`}>
          AUDIO: {audio.settings.enabled ? "ON" : "OFF"}
        </button>

        <div className="absolute top-12 right-4 text-xs font-mono text-cyan-400">
          <div>LEVEL {level}</div>
          <div>FIRE: {level < 3 ? "LOW" : level < 6 ? "MED" : level < 9 ? "HIGH" : "MAX"}</div>
        </div>

        {ships.map((ship, i) => <ShipComponent key={i} ship={ship} />)}
        {enemies.map((enemy, i) => <EnemyComponent key={i} enemy={enemy} />)}

        <div className="absolute" style={{ left: player.x, top: player.y, width: 50, height: 50 }}>
          <img src={`${IMG}/player-ship.png`} alt="vaisseau" className="w-full h-full object-contain" />
        </div>

        {bullets.map((b, i) => <BulletComponent key={`pb${i}`} bullet={b} />)}
        {enemyBullets.map((b, i) => <BulletComponent key={`eb${i}`} bullet={b} />)}
        {explosions.map((e, i) => <ExplosionComponent key={i} explosion={e} />)}

        {isPaused && !showInGameLeaderboard && (
          <div className="absolute inset-0 bg-black/75 flex items-center justify-center z-50">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">PAUSE</h2>
              <p className="text-gray-300 mb-6">Appuie sur ECHAP ou REPRENDRE pour continuer</p>
              <button onClick={togglePause} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">REPRENDRE</button>
            </div>
          </div>
        )}

        {isPaused && showInGameLeaderboard && (
          <div className="absolute inset-0 bg-black/75 flex items-center justify-center z-50">
            <div className="text-center max-w-md w-full mx-4">
              <h2 className="text-3xl font-bold text-yellow-300 mb-4">TOP 5</h2>
              <div className="bg-gray-900/90 rounded-lg p-6 mb-6">
                {leaderboard.length === 0 ? <p className="text-gray-400 py-8">Aucun score</p> : (
                  <div className="space-y-3">
                    {leaderboard.slice(0, 5).map((entry, index) => (
                      <div key={entry.id || index} className={`flex justify-between items-center py-3 px-4 rounded-lg border-l-4 ${index === 0 ? "border-yellow-400 bg-yellow-900/30" : index === 1 ? "border-gray-300 bg-gray-700/30" : index === 2 ? "border-orange-400 bg-orange-900/30" : "border-gray-600 bg-gray-800/30"}`}>
                        <div className="flex items-center gap-3">
                          <span className={`text-xl font-bold ${index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-300" : index === 2 ? "text-orange-400" : "text-white"}`}>#{index + 1}</span>
                          <span className="text-white">{entry.player_name}</span>
                        </div>
                        <div className="text-cyan-400 font-bold text-lg">{entry.score.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setShowInGameLeaderboard(false); setIsPaused(false) }} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">REPRENDRE</button>
                <button onClick={toggleInGameLeaderboard} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">FERMER</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500">FLECHES / ZQSD : Deplacer • ESPACE : Tirer • ECHAP : Pause</div>
    </div>
  )
}
