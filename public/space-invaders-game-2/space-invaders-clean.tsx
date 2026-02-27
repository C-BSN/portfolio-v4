"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { getLeaderboard, addScore, getPlayerRank, isSupabaseAvailable, type LeaderboardEntry } from "./lib/supabase"
import { useAudio } from "./hooks/useAudio"

interface Position {
  x: number
  y: number
}

interface Bullet {
  x: number
  y: number
  direction: "up" | "down"
  speed: number
  type: "player" | "enemy_single" | "enemy_spread" | "enemy_rapid"
  velocityX?: number // Pour les tirs dirigés
  velocityY?: number // Pour les tirs dirigés
}

interface Enemy {
  x: number
  y: number
  type: "green" | "purple" | "red"
  alive: boolean
  row: number
  lastShot: number
  shootPattern: "single" | "spread" | "rapid"
}

interface Ship {
  x: number
  y: number
  width: number
  height: number
  blocks: boolean[][] // Grille de blocs destructibles
}

interface Explosion {
  x: number
  y: number
  startTime: number
  duration: number
  type: "player" | "enemy"
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

export default function SpaceInvaders() {
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
  const [isOnline, setIsOnline] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [showAudioSettings, setShowAudioSettings] = useState(false)
  const [showInGameLeaderboard, setShowInGameLeaderboard] = useState(false)

  // Audio hook
  const audio = useAudio()

  // Générer des étoiles statiques pour éviter les recréations
  const menuStars = useRef<Array<{ left: string; top: string; size: number; opacity: number }>>([])
  const gameStars = useRef<Array<{ left: string; top: string; size: number; opacity: number }>>([])

  // Initialiser les étoiles une seule fois
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

  const gameLoopRef = useRef<number>()
  const lastShotRef = useRef(0)
  const enemyLastShotRef = useRef(0)
  const lastEnemyMoveRef = useRef(0)
  const moveDownRef = useRef(false)

  // Difficulty scaling based on level
  const getDifficultySettings = useCallback((level: number) => {
    // Progression beaucoup plus douce
    const difficultyTier = Math.floor((level - 1) / 3) // 0, 1, 2, 3...

    // Vitesse des ennemis très progressive
    const speedMultiplier = 1 + difficultyTier * 0.2 // +20% tous les 3 niveaux (au lieu de 30%)

    // Fréquence de tir beaucoup plus progressive
    let shootFrequency = 0.5 // Commencer avec seulement 50% de la fréquence normale
    if (level >= 3) shootFrequency = 0.7 // 70% à partir du niveau 3
    if (level >= 6) shootFrequency = 0.9 // 90% à partir du niveau 6
    if (level >= 9) shootFrequency = 1.1 // 110% à partir du niveau 9
    if (level >= 12) shootFrequency = 1.3 // 130% à partir du niveau 12

    // Nombre d'ennemis réduit au début
    const enemyCount = Math.min(8 + difficultyTier, 13) // Commencer avec moins d'ennemis

    return {
      enemySpeed: BASE_ENEMY_SPEED * speedMultiplier,
      enemyShootInterval: Math.max(300, Math.floor(BASE_ENEMY_SHOOT_INTERVAL / shootFrequency)),
      enemyBulletSpeed: BASE_ENEMY_BULLET_SPEED + difficultyTier * 0.3, // Vitesse des balles plus lente
      playerShootDelay: Math.max(120, 250 - difficultyTier * 10),
      enemyCount: enemyCount,
      // Probabilité de tir BEAUCOUP plus faible
      shootChance: Math.min(0.0001 + difficultyTier * 0.0002, 0.002), // 3x moins de tirs qu'avant
    }
  }, [])

  // Check if we're using Supabase or localStorage
  useEffect(() => {
    setIsOnline(isSupabaseAvailable())
  }, [])

  // Initialize ships (bunkers)
  const initializeShips = useCallback(() => {
    const newShips: Ship[] = []
    const shipWidth = 60
    const shipHeight = 40
    const shipCount = 4
    const spacing = (GAME_WIDTH - shipCount * shipWidth) / (shipCount + 1)

    for (let i = 0; i < shipCount; i++) {
      const x = spacing + i * (shipWidth + spacing)
      const y = GAME_HEIGHT - 200

      // Create destructible blocks pattern (bunker shape)
      const blocks: boolean[][] = []
      for (let row = 0; row < shipHeight; row += 4) {
        const blockRow: boolean[] = []
        for (let col = 0; col < shipWidth; col += 4) {
          // Create bunker shape
          const isTopPart = row < shipHeight * 0.6
          const isMiddlePart = row >= shipHeight * 0.6 && row < shipHeight * 0.8
          const isBottomPart = row >= shipHeight * 0.8

          const isLeftSide = col < shipWidth * 0.3
          const isCenter = col >= shipWidth * 0.3 && col < shipWidth * 0.7
          const isRightSide = col >= shipWidth * 0.7

          let hasBlock = false

          if (isTopPart) {
            hasBlock = true // Solid top
          } else if (isMiddlePart) {
            hasBlock = isLeftSide || isRightSide // Sides only
          } else if (isBottomPart) {
            hasBlock = isLeftSide || isRightSide // Sides only, creating entrance
          }

          blockRow.push(hasBlock)
        }
        blocks.push(blockRow)
      }

      newShips.push({
        x,
        y,
        width: shipWidth,
        height: shipHeight,
        blocks,
      })
    }

    setShips(newShips)
  }, [])

  const getEnemyAttackPattern = (enemyType: string): "single" | "spread" | "rapid" => {
    switch (enemyType) {
      case "green":
        return "spread" // Green aliens shoot spread bullets
      case "purple":
        return "rapid" // Purple aliens shoot rapidly
      case "red":
        return "single" // Red aliens shoot single powerful bullets
      default:
        return "single"
    }
  }

  // Calculate direction from enemy to player
  const calculateDirectionToPlayer = (enemyX: number, enemyY: number, playerX: number, playerY: number) => {
    const dx = playerX + 25 - (enemyX + 20) // Center to center
    const dy = playerY + 25 - (enemyY + 30)
    const distance = Math.sqrt(dx * dx + dy * dy)

    return {
      velocityX: (dx / distance) * 3, // Normalized direction * speed
      velocityY: (dy / distance) * 3,
    }
  }

  const createEnemyBullets = useCallback(
    (enemy: Enemy, playerPos: Position) => {
      const newBullets: Bullet[] = []
      const baseX = enemy.x + 20
      const baseY = enemy.y + 30

      // Facteur de réduction de vitesse pour les premiers niveaux
      const speedFactor = level <= 2 ? 0.7 : level <= 5 ? 0.85 : 1.0

      // Play enemy shoot sound
      audio.playEnemyShoot()

      switch (enemy.shootPattern) {
        case "single":
          // Red enemies: Single aimed bullet
          const singleDirection = calculateDirectionToPlayer(enemy.x, enemy.y, playerPos.x, playerPos.y)
          newBullets.push({
            x: baseX,
            y: baseY,
            direction: "down",
            speed: 6 * speedFactor, // Vitesse réduite pour les premiers niveaux
            type: "enemy_single",
            velocityX: singleDirection.velocityX * speedFactor,
            velocityY: singleDirection.velocityY * speedFactor,
          })
          break

        case "spread":
          // Green enemies: 3-bullet spread aimed at player
          const spreadDirection = calculateDirectionToPlayer(enemy.x, enemy.y, playerPos.x, playerPos.y)
          // Réduire à 2 balles au lieu de 3 pour les premiers niveaux
          const spreadCount = level <= 3 ? 2 : 3
          const spreadStep = spreadCount === 2 ? 2 : 1

          for (let i = -1; i <= 1; i += spreadStep) {
            const angle = Math.atan2(spreadDirection.velocityY, spreadDirection.velocityX) + i * 0.3
            const speed = 4 * speedFactor
            newBullets.push({
              x: baseX + i * 5,
              y: baseY,
              direction: "down",
              speed: speed,
              type: "enemy_spread",
              velocityX: Math.cos(angle) * speed,
              velocityY: Math.sin(angle) * speed,
            })
          }
          break

        case "rapid":
          // Purple enemies: Rapid aimed bullets
          const rapidDirection = calculateDirectionToPlayer(enemy.x, enemy.y, playerPos.x, playerPos.y)
          newBullets.push({
            x: baseX,
            y: baseY,
            direction: "down",
            speed: 5 * speedFactor,
            type: "enemy_rapid",
            velocityX: rapidDirection.velocityX * speedFactor,
            velocityY: rapidDirection.velocityY * speedFactor,
          })
          break
      }

      return newBullets
    },
    [level, audio],
  )

  // Initialize enemies
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
          x: 80 + i * 35, // Tighter spacing
          y: rowData.startY,
          type: rowData.type,
          alive: true,
          row: rowData.row,
          lastShot: 0,
          shootPattern: getEnemyAttackPattern(rowData.type),
        })
      }
    })

    setEnemies(newEnemies)
    setEnemyDirection(1)
    moveDownRef.current = false
  }, [level, getDifficultySettings])

  // Load leaderboard
  const loadLeaderboard = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getLeaderboard(10)
      setLeaderboard(data)

      // Set hi-score from leaderboard
      if (data.length > 0) {
        setHiScore(data[0].score)
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save score
  const saveScore = useCallback(
    async (name: string, score: number, levelReached: number) => {
      try {
        const success = await addScore(name, score, levelReached)
        if (success) {
          // Get player's rank
          const rank = await getPlayerRank(score)
          setPlayerRank(rank)

          // Reload leaderboard
          await loadLeaderboard()
        }
      } catch (error) {
        console.error("Error saving score:", error)
      }
    },
    [loadLeaderboard],
  )

  // Start game
  const startGame = () => {
    if (!playerName.trim()) {
      alert("Please enter your name first!")
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

  // Check collision with ships
  const checkShipCollision = useCallback(
    (bulletX: number, bulletY: number, bulletWidth = 2, bulletHeight = 4) => {
      for (let shipIndex = 0; shipIndex < ships.length; shipIndex++) {
        const ship = ships[shipIndex]

        const distance = Math.sqrt(
          Math.pow(bulletX - (ship.x + ship.width / 2), 2) + Math.pow(bulletY - (ship.y + ship.height / 2), 2),
        )

        if (distance > 100) continue

        // Check if bullet is within ship bounds
        if (
          bulletX >= ship.x &&
          bulletX <= ship.x + ship.width &&
          bulletY >= ship.y &&
          bulletY <= ship.y + ship.height
        ) {
          // Calculate which block is hit
          const blockX = Math.floor((bulletX - ship.x) / 4)
          const blockY = Math.floor((bulletY - ship.y) / 4)

          if (
            blockY >= 0 &&
            blockY < ship.blocks.length &&
            blockX >= 0 &&
            blockX < ship.blocks[0].length &&
            ship.blocks[blockY][blockX]
          ) {
            // Destroy the block and surrounding blocks for realistic damage
            setShips((prevShips) => {
              const newShips = [...prevShips]
              const newBlocks = newShips[shipIndex].blocks.map((row) => [...row])

              // Destroy hit block and adjacent blocks
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

            return true // Collision detected
          }
        }
      }
      return false // No collision
    },
    [ships],
  )

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "escape" && gameState === "playing") {
        setIsPaused((prev) => !prev)
        return
      }
      setKeys((prev) => new Set(prev).add(e.key.toLowerCase()))
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys((prev) => {
        const newKeys = new Set(prev)
        newKeys.delete(e.key.toLowerCase())
        return newKeys
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [gameState])

  // Load leaderboard on component mount
  useEffect(() => {
    loadLeaderboard()
  }, [loadLeaderboard])

  // Modifier la fonction de pause pour prendre en compte le menu déroulant
  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev)
  }, [])

  // Ajouter une fonction pour afficher le classement en jeu
  const toggleInGameLeaderboard = useCallback(() => {
    setShowInGameLeaderboard((prev) => !prev)
    if (!isPaused) {
      setIsPaused(true)
    }
  }, [isPaused])

  // Game loop
  useEffect(() => {
    if (gameState !== "playing" || isPaused) return

    const gameLoop = () => {
      const now = Date.now()
      const difficulty = getDifficultySettings(level)

      // Player movement
      setPlayer((prev) => {
        let newX = prev.x
        if (keys.has("arrowleft") || keys.has("q")) newX -= PLAYER_SPEED
        if (keys.has("arrowright") || keys.has("d")) newX += PLAYER_SPEED
        return {
          ...prev,
          x: Math.max(0, Math.min(GAME_WIDTH - 50, newX)),
        }
      })

      // Player shooting (with difficulty-based delay)
      if (
        (keys.has(" ") || keys.has("arrowup") || keys.has("z")) &&
        now - lastShotRef.current > difficulty.playerShootDelay
      ) {
        setBullets((prev) => [
          ...prev,
          { x: player.x + 25, y: player.y, direction: "up", speed: BULLET_SPEED, type: "player" },
        ])
        audio.playPlayerShoot()
        lastShotRef.current = now
      }

      // Move bullets
      setBullets((prev) =>
        prev.map((bullet) => ({ ...bullet, y: bullet.y - bullet.speed })).filter((bullet) => bullet.y > 0),
      )

      // Move enemy bullets with directional movement
      setEnemyBullets((prev) =>
        prev
          .map((bullet) => ({
            ...bullet,
            x: bullet.x + (bullet.velocityX || 0),
            y: bullet.y + (bullet.velocityY || difficulty.enemyBulletSpeed),
          }))
          .filter((bullet) => bullet.y < GAME_HEIGHT && bullet.x > -10 && bullet.x < GAME_WIDTH + 10),
      )

      // Move enemies (with difficulty-based speed)
      if (now - lastEnemyMoveRef.current > 32) {
        lastEnemyMoveRef.current = now

        setEnemies((prevEnemies) => {
          const aliveEnemies = prevEnemies.filter((enemy) => enemy.alive)
          if (aliveEnemies.length === 0) return prevEnemies

          const leftMost = Math.min(...aliveEnemies.map((e) => e.x))
          const rightMost = Math.max(...aliveEnemies.map((e) => e.x))

          if (rightMost >= GAME_WIDTH - 50 && enemyDirection > 0) {
            setEnemyDirection(-1)
            moveDownRef.current = true
          } else if (leftMost <= 10 && enemyDirection < 0) {
            setEnemyDirection(1)
            moveDownRef.current = true
          }

          return prevEnemies.map((enemy) => ({
            ...enemy,
            x: enemy.x + (moveDownRef.current ? 0 : enemyDirection * difficulty.enemySpeed),
            y: enemy.y + (moveDownRef.current ? 0.5 : 0),
          }))
        })

        if (moveDownRef.current) {
          setTimeout(() => {
            moveDownRef.current = false
          }, 500)
        }
      }

      // Enemy shooting with different patterns aimed at player
      setEnemies((prevEnemies) => {
        const updatedEnemies = [...prevEnemies]
        const aliveEnemies = updatedEnemies.filter((enemy) => enemy.alive)

        // Limiter le nombre de balles ennemies pour la fluidité
        if (enemyBullets.length >= MAX_ENEMY_BULLETS) return updatedEnemies

        // Limiter le nombre maximum de tirs simultanés en fonction du niveau
        const maxSimultaneousShots = Math.min(1 + Math.floor(level / 4), 3) // Max 1 tir au début, jusqu'à 3 max
        let shotsThisFrame = 0

        aliveEnemies.forEach((enemy, index) => {
          // Ne pas continuer si on a atteint le nombre max de tirs pour cette frame
          if (shotsThisFrame >= maxSimultaneousShots) return

          const actualIndex = updatedEnemies.findIndex((e) => e === enemy)
          let shootInterval = difficulty.enemyShootInterval

          // Different shooting frequencies for different types
          switch (enemy.shootPattern) {
            case "rapid":
              shootInterval *= 0.8 // Purple enemies shoot 20% faster (réduit de 30% à 20%)
              break
            case "spread":
              shootInterval *= 1.5 // Green enemies shoot 50% slower (augmenté de 30% à 50%)
              break
            case "single":
              shootInterval *= 1.2 // Red enemies 20% slower (ajouté un délai)
              break
          }

          // Réduire encore la probabilité de tir et ajouter une condition sur le niveau
          const baseChance = difficulty.shootChance * (level <= 2 ? 0.5 : 1.0) // 50% de chance en moins pour niveaux 1-2

          if (now - enemy.lastShot > shootInterval && Math.random() < baseChance) {
            const newBullets = createEnemyBullets(enemy, player)
            setEnemyBullets((prev) => [...prev, ...newBullets])
            updatedEnemies[actualIndex] = { ...enemy, lastShot: now }
            shotsThisFrame++
          }
        })

        return updatedEnemies
      })

      // Collision detection - bullets vs enemies
      setBullets((prevBullets) => {
        const remainingBullets: Bullet[] = []

        setEnemies((prevEnemies) => {
          const updatedEnemies = [...prevEnemies]

          for (const bullet of prevBullets) {
            let bulletHit = false

            // Check collision with ships first
            if (checkShipCollision(bullet.x, bullet.y)) {
              bulletHit = true
            } else {
              // Check collision with enemies
              for (let i = 0; i < updatedEnemies.length; i++) {
                const enemy = updatedEnemies[i]

                if (
                  enemy.alive &&
                  bullet.x >= enemy.x &&
                  bullet.x <= enemy.x + 40 &&
                  bullet.y >= enemy.y &&
                  bullet.y <= enemy.y + 30
                ) {
                  updatedEnemies[i] = { ...enemy, alive: false }
                  const points =
                    enemy.type === "green" ? 30 : enemy.type === "purple" ? 20 : enemy.type === "red" ? 10 : 0
                  setScore((prev) => prev + points)
                  audio.playEnemyHit()
                  bulletHit = true
                  break
                }
              }
            }

            if (!bulletHit) {
              remainingBullets.push(bullet)
            }
          }

          return updatedEnemies
        })

        return remainingBullets
      })

      // Collision detection - enemy bullets vs player and ships
      setEnemyBullets((prevBullets) => {
        const remainingBullets: Bullet[] = []

        prevBullets.forEach((bullet) => {
          let bulletHit = false

          // Check collision with ships first
          if (checkShipCollision(bullet.x, bullet.y)) {
            bulletHit = true
          } else if (
            bullet.x > player.x &&
            bullet.x < player.x + 50 &&
            bullet.y > player.y &&
            bullet.y < player.y + 40
          ) {
            // Check collision with player
            setLives((prev) => {
              const newLives = prev - 1

              // Add explosion effect
              setExplosions((prevExplosions) => [
                ...prevExplosions,
                {
                  x: player.x + 25,
                  y: player.y + 25,
                  startTime: Date.now(),
                  duration: 1000,
                  type: "player",
                },
              ])

              // Play player hit sound
              audio.playPlayerHit()

              if (newLives <= 0) {
                setGameState("gameOver")
                if (score > hiScore) setHiScore(score)
                // Save score
                saveScore(playerName, score, level)
                // Play game over sound
                setTimeout(() => audio.playGameOver(), 500)
              }
              return newLives
            })
            bulletHit = true
          }

          if (!bulletHit) {
            remainingBullets.push(bullet)
          }
        })

        return remainingBullets
      })

      // Check win condition
      const aliveEnemies = enemies.filter((enemy) => enemy.alive)
      if (aliveEnemies.length === 0) {
        setLevel((prev) => prev + 1)
        audio.playLevelComplete()
        setTimeout(() => {
          initializeEnemies()
          initializeShips() // Reset ships for new level
        }, 1000)
      }

      // Clean up expired explosions
      setExplosions((prev) => prev.filter((explosion) => Date.now() - explosion.startTime < explosion.duration))

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [
    gameState,
    player,
    enemies,
    keys,
    enemyDirection,
    score,
    hiScore,
    initializeEnemies,
    playerName,
    level,
    saveScore,
    getDifficultySettings,
    checkShipCollision,
    initializeShips,
    createEnemyBullets,
    isPaused,
    audio,
  ])

  const getEnemyEffect = (enemy: Enemy) => {
    switch (enemy.shootPattern) {
      case "spread":
        return "drop-shadow(0 0 4px rgba(144, 238, 144, 0.8))" // Green glow for spread
      case "rapid":
        return "drop-shadow(0 0 4px rgba(147, 112, 219, 0.8))" // Purple glow for rapid
      case "single":
        return "drop-shadow(0 0 4px rgba(255, 107, 107, 0.8))" // Red glow for single
      default:
        return ""
    }
  }

  // Explosion component
  const ExplosionComponent = ({ explosion }: { explosion: Explosion }) => {
    const elapsed = Date.now() - explosion.startTime
    const progress = elapsed / explosion.duration

    if (progress >= 1) return null

    const scale = 0.5 + progress * 2 // Grows from 0.5 to 2.5
    const opacity = 1 - progress // Fades out
    const rotation = progress * 360 // Rotates

    // Générer des particules d'explosion de manière sécurisée
    const particles = Array.from({ length: EXPLOSION_PARTICLES }, (_, i) => ({
      angle: (i * Math.PI) / 4,
      progress: progress,
    }))

    return (
      <div
        className="absolute pointer-events-none"
        style={{
          left: explosion.x - 30,
          top: explosion.y - 30,
          width: 60,
          height: 60,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          opacity: opacity,
          zIndex: 100,
        }}
      >
        {/* Outer explosion ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              explosion.type === "player"
                ? "radial-gradient(circle, #ff4444 0%, #ff8844 30%, #ffaa44 60%, transparent 100%)"
                : "radial-gradient(circle, #44ff44 0%, #88ff44 30%, #aaff44 60%, transparent 100%)",
            animation: `pulse ${explosion.duration}ms ease-out`,
          }}
        />

        {/* Inner explosion core */}
        <div
          className="absolute inset-2 rounded-full"
          style={{
            background:
              explosion.type === "player"
                ? "radial-gradient(circle, #ffffff 0%, #ffff44 50%, transparent 100%)"
                : "radial-gradient(circle, #ffffff 0%, #44ffff 50%, transparent 100%)",
            transform: `scale(${2 - progress})`,
          }}
        />

        {/* Explosion particles */}
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${50 + Math.cos(particle.angle) * particle.progress * 25}%`,
              top: `${50 + Math.sin(particle.angle) * particle.progress * 25}%`,
              opacity: 1 - progress,
              transform: `scale(${1 + progress})`,
            }}
          />
        ))}
      </div>
    )
  }

  // Modifier la fonction EnemyComponent pour utiliser l'image de Pleakley pour les ennemis rouges
  const EnemyComponent = ({ enemy }: { enemy: Enemy }) => {
    if (!enemy.alive) return null

    let imageSrc = ""
    if (enemy.type === "green") {
      imageSrc = "/images/leroy.png" // Utiliser la nouvelle image de Leroy
    } else if (enemy.type === "purple") {
      imageSrc = "/images/jumba.png" // Utiliser la nouvelle image de Jumba
    } else {
      imageSrc = "/images/pleakley.png" // Utiliser la nouvelle image de Pleakley
    }

    return (
      <div
        className="absolute"
        style={{
          left: enemy.x,
          top: enemy.y,
          width: 40,
          height: 40,
          transition: "transform 0.1s ease-in-out",
          transform: `scale(${1 + Math.sin(Date.now() * 0.002) * 0.05})`,
          filter:
            enemy.type === "green"
              ? "drop-shadow(0 0 4px rgba(255, 0, 0, 0.8))" // Rouge pour Leroy
              : enemy.type === "purple"
                ? "drop-shadow(0 0 4px rgba(138, 43, 226, 0.8))" // Violet plus intense pour Jumba
                : "drop-shadow(0 0 4px rgba(124, 252, 0, 0.8))", // Vert lime pour Pleakley
        }}
      >
        <img
          src={imageSrc || "/placeholder.svg"}
          alt={`${enemy.type} alien`}
          style={{
            objectFit: "contain",
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
          onError={(e) => {
            console.error(`Failed to load image: ${imageSrc}`)
            ;(e.target as HTMLImageElement).style.display = "none"
          }}
        />
      </div>
    )
  }

  const BulletComponent = ({ bullet, index }: { bullet: Bullet; index: number }) => {
    const getBulletStyle = () => {
      switch (bullet.type) {
        case "player":
          return { backgroundColor: "#00FFFF", width: 2, height: 6 } // Cyan player bullets
        case "enemy_single":
          return { backgroundColor: "#FF4444", width: 3, height: 8 } // Red powerful bullets
        case "enemy_spread":
          return { backgroundColor: "#44FF44", width: 2, height: 4 } // Green spread bullets
        case "enemy_rapid":
          return { backgroundColor: "#FF44FF", width: 2, height: 5 } // Purple rapid bullets
        default:
          return { backgroundColor: "#FFFF44", width: 2, height: 4 }
      }
    }

    const style = getBulletStyle()

    return (
      <div
        key={index}
        className="absolute"
        style={{
          left: bullet.x,
          top: bullet.y,
          width: style.width,
          height: style.height,
          backgroundColor: style.backgroundColor,
          boxShadow: `0 0 4px ${style.backgroundColor}`,
        }}
      />
    )
  }

  // Ship component
  const ShipComponent = ({ ship }: { ship: Ship }) => {
    return (
      <div
        className="absolute"
        style={{
          left: ship.x,
          top: ship.y,
          width: ship.width,
          height: ship.height,
        }}
      >
        {ship.blocks.map((row, rowIndex) =>
          row.map((hasBlock, colIndex) => {
            if (!hasBlock) return null
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="absolute bg-green-500"
                style={{
                  left: colIndex * 4,
                  top: rowIndex * 4,
                  width: 4,
                  height: 4,
                  boxShadow: "0 0 2px rgba(34, 197, 94, 0.5)",
                }}
              />
            )
          }),
        )}
      </div>
    )
  }

  // Rendu des étoiles en arrière-plan
  const renderStars = (stars: Array<{ left: string; top: string; size: number; opacity: number }>) => {
    return stars.map((star, i) => (
      <div
        key={i}
        className="absolute bg-white rounded-full"
        style={{
          left: star.left,
          top: star.top,
          width: `${star.size}px`,
          height: `${star.size}px`,
          opacity: star.opacity,
        }}
      />
    ))
  }

  if (gameState === "menu") {
    if (showLeaderboard) {
      return (
        <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
          {/* Stars background */}
          <div className="absolute inset-0">{renderStars(menuStars.current)}</div>

          <div className="text-center z-10 max-w-md w-full mx-4">
            <h1 className="text-4xl font-bold mb-4 text-yellow-300 tracking-wider buka-bird-font">
              {isOnline ? "GLOBAL" : ""} LEADERBOARD
            </h1>
            {!isOnline && (
              <p className="text-sm text-gray-400 mb-4">
                Scores are saved locally. Configure Supabase for global leaderboard.
              </p>
            )}

            <div className="bg-gray-900 bg-opacity-80 rounded-lg p-6 mb-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
                  <p className="text-gray-400 mt-2">Loading scores...</p>
                </div>
              ) : leaderboard.length === 0 ? (
                <p className="text-gray-400">No scores yet!</p>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.id || index}
                      className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-lg font-bold ${index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-300" : index === 2 ? "text-orange-400" : "text-white"}`}
                        >
                          #{index + 1}
                        </span>
                        <span className="text-white">{entry.player_name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-cyan-400 font-bold">{entry.score}</div>
                        <div className="text-xs text-gray-500">
                          Level {entry.level_reached} •{" "}
                          {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : "N/A"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                audio.playMenuSelect()
                setShowLeaderboard(false)
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
            >
              BACK TO MENU
            </button>
          </div>
        </div>
      )
    }

    if (showInfo) {
      return (
        <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
          {/* Stars background */}
          <div className="absolute inset-0">{renderStars(menuStars.current)}</div>

          <div className="text-center z-10 max-w-lg w-full mx-4">
            <h1 className="text-4xl font-bold mb-6 text-cyan-300 tracking-wider buka-bird-font">GAME INFORMATION</h1>

            <div className="bg-gray-900 bg-opacity-80 rounded-lg p-6 mb-6 text-left space-y-4">
              <div>
                <h3 className="text-lg font-bold text-yellow-300 mb-2">Controls</h3>
                <p className="text-sm text-gray-300">• ARROW KEYS or ZQSD to move</p>
                <p className="text-sm text-gray-300">• SPACE or UP ARROW to shoot</p>
                <p className="text-sm text-gray-300">• ESC to pause during game</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-yellow-300 mb-2">Difficulty System</h3>
                <p className="text-sm text-gray-300">• Difficulty increases every 3 levels</p>
                <p className="text-sm text-gray-300">• Enemy fire rate: Low → Med → High → Max</p>
                <p className="text-sm text-gray-300">• Enemy speed and count increase progressively</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-yellow-300 mb-2">Enemy Types</h3>
                <p className="text-sm text-red-400">Leroy: Spread Attack (Aimed) - 30 points</p>
                <p className="text-sm text-purple-400">Jumba: Rapid Fire (Aimed) - 20 points</p>
                <p className="text-sm text-green-400">Pleakley: Power Shot (Aimed) - 10 points</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-yellow-300 mb-2">Scoring & Features</h3>
                <p className="text-sm text-gray-300">• Destructible bunkers for protection</p>
                <p className="text-sm text-gray-300">• Global/Local leaderboard system</p>
                <p className="text-sm text-gray-300">• Progressive difficulty scaling</p>
                {!isOnline && <p className="text-sm text-orange-400">• Currently running in offline mode</p>}
              </div>
            </div>

            <button
              onClick={() => {
                audio.playMenuSelect()
                setShowInfo(false)
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
            >
              BACK TO MENU
            </button>
          </div>
        </div>
      )
    }

    if (showAudioSettings) {
      return (
        <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
          {/* Stars background */}
          <div className="absolute inset-0">{renderStars(menuStars.current)}</div>

          <div className="text-center z-10 max-w-md w-full mx-4">
            <h1 className="text-4xl font-bold mb-6 text-cyan-300 tracking-wider buka-bird-font">AUDIO SETTINGS</h1>

            <div className="bg-gray-900 bg-opacity-80 rounded-lg p-6 mb-6 space-y-6">
              <div>
                <label className="block text-lg font-bold text-yellow-300 mb-4">Sound Effects</label>
                <button
                  onClick={() => {
                    audio.toggleAudio()
                    audio.playMenuSelect()
                  }}
                  className={`w-full py-3 px-6 rounded-lg text-lg font-bold transition-colors ${
                    audio.settings.enabled
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {audio.settings.enabled ? "ENABLED" : "DISABLED"}
                </button>
              </div>

              <div>
                <label className="block text-lg font-bold text-yellow-300 mb-4">
                  Volume: {Math.round(audio.settings.volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={audio.settings.volume}
                  onChange={(e) => audio.setVolume(Number.parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${audio.settings.volume * 100}%, #374151 ${audio.settings.volume * 100}%, #374151 100%)`,
                  }}
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-400">Test sounds:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={audio.playPlayerShoot}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm transition-colors"
                  >
                    Player Shot
                  </button>
                  <button
                    onClick={audio.playEnemyShoot}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm transition-colors"
                  >
                    Enemy Shot
                  </button>
                  <button
                    onClick={audio.playEnemyHit}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded text-sm transition-colors"
                  >
                    Enemy Hit
                  </button>
                  <button
                    onClick={audio.playPlayerHit}
                    className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded text-sm transition-colors"
                  >
                    Player Hit
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                audio.playMenuSelect()
                setShowAudioSettings(false)
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
            >
              BACK TO MENU
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="w-full h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
        {/* Stars background */}
        <div className="absolute inset-0">{renderStars(menuStars.current)}</div>

        {/* Main content container */}
        <div className="flex items-center justify-between w-full max-w-6xl mx-auto px-8 z-10">
          {/* Left side - Menu content */}
          <div className="flex-1 text-center max-w-md">
            <h1
              className="text-7xl font-bold mb-4 text-yellow-300 tracking-wider buka-bird-font"
              style={{
                textShadow: "0 0 8px rgba(255, 255, 0, 0.4), 0 0 12px rgba(255, 255, 0, 0.2)",
                fontSize: "5rem",
              }}
            >
              STITCH
            </h1>
            <h1
              className="text-7xl font-bold mb-8 text-yellow-300 tracking-wider buka-bird-font"
              style={{
                textShadow: "0 0 8px rgba(255, 255, 0, 0.4), 0 0 12px rgba(255, 255, 0, 0.2)",
                fontSize: "5rem",
              }}
            >
              INVADERS
            </h1>

            <div className="mb-6">
              <label htmlFor="playerName" className="block text-sm text-gray-400 mb-2">
                Enter your name:
              </label>
              <input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your name"
                maxLength={15}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-center focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div className="space-y-4">
              <button
                onClick={startGame}
                disabled={!playerName.trim()}
                className={`w-full font-bold py-4 px-8 rounded-lg text-xl transition-colors ${
                  playerName.trim()
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                START GAME
              </button>

              <button
                onClick={() => {
                  audio.playMenuSelect()
                  setShowLeaderboard(true)
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
              >
                {isOnline ? "GLOBAL" : ""} LEADERBOARD
              </button>

              <button
                onClick={() => {
                  audio.playMenuSelect()
                  setShowInfo(true)
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
              >
                GAME INFO
              </button>

              <button
                onClick={() => {
                  audio.playMenuSelect()
                  setShowAudioSettings(true)
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
              >
                AUDIO SETTINGS
              </button>
            </div>

            <div className="mt-8 text-sm text-gray-400">
              <p>Use ARROW KEYS or ZQSD to move</p>
              <p>SPACE or UP ARROW to shoot</p>
            </div>

            {/* Mettre à jour la légende des attaques dans le menu principal */}
            <div className="text-xs mt-3 space-y-1">
              <p className="text-red-400">Leroy: Spread Attack (Aimed)</p>
              <p className="text-purple-400">Jumba: Rapid Fire (Aimed)</p>
              <p className="text-green-400">Pleakley: Power Shot (Aimed)</p>
            </div>

            {/* Audio status indicator */}
            <div className="mt-4 text-xs text-gray-500">
              Audio: {audio.settings.enabled ? "ON" : "OFF"} | Volume: {Math.round(audio.settings.volume * 100)}%
            </div>
          </div>

          {/* Right side - Stitch warrior image */}
          <div className="flex-1 flex justify-center items-center">
            <div className="relative">
              <img
                src="/images/stitch-warrior.png"
                alt="Stitch Warrior"
                className="w-96 h-auto object-contain"
                style={{
                  filter: "drop-shadow(0 0 20px rgba(255, 255, 0, 0.3))",
                  animation: "float 3s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        </div>

        {/* CSS Animation for floating effect */}
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}</style>
      </div>
    )
  }

  if (gameState === "gameOver") {
    const difficulty = getDifficultySettings(level)
    return (
      <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1
          className="text-6xl font-bold mb-6 text-red-500 buka-bird-font"
          style={{
            textShadow: "0 0 8px rgba(255, 0, 0, 0.4), 0 0 12px rgba(255, 0, 0, 0.2)",
            fontSize: "5.5rem",
          }}
        >
          GAME OVER
        </h1>
        <p className="text-xl mb-2">Final Score: {score}</p>
        <p className="text-lg mb-2">Level Reached: {level}</p>
        <p className="text-lg mb-2">Hi-Score: {hiScore}</p>
        <div className="text-sm text-gray-400 mb-4 text-center">
          <p>Enemy Speed: {difficulty.enemySpeed.toFixed(1)}x</p>
          <p>Enemy Count: {difficulty.enemyCount} per row</p>
        </div>
        {playerRank && (
          <p className="text-lg mb-4 text-yellow-400">
            {isOnline ? "Global" : ""} Rank: #{playerRank}
          </p>
        )}
        <div className="flex gap-4">
          <button
            onClick={startGame}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            REJOUER
          </button>
          <button
            onClick={() => {
              audio.playMenuSelect()
              setGameState("menu")
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            QUITTER
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen bg-black text-white relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0">{renderStars(gameStars.current)}</div>

      {/* Game area */}
      <div
        className="relative mx-auto bg-black border-2 border-gray-800"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
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
              <div>SHIPS {ships.filter((s) => s.blocks.some((row) => row.some((block) => block))).length}</div>
              <div className="flex items-center gap-2">
                LIVES
                {Array.from({ length: Math.max(0, lives) }).map((_, i) => (
                  <div key={i} className="w-6 h-6 relative">
                    <img
                      src="/images/player-ship.png"
                      alt="life"
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pause button */}
        <button
          onClick={() => togglePause()}
          className="absolute top-4 right-1/2 transform translate-x-1/2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
        >
          {isPaused ? "RESUME" : "PAUSE"}
        </button>

        {/* In-game leaderboard button */}
        <button
          onClick={() => toggleInGameLeaderboard()}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
        >
          LEADERBOARD
        </button>

        {/* Audio toggle button */}
        <button
          onClick={() => {
            audio.toggleAudio()
            audio.playMenuSelect()
          }}
          className={`absolute top-4 right-4 text-xs font-mono transition-colors ${
            audio.settings.enabled ? "text-green-400" : "text-red-400"
          }`}
        >
          AUDIO: {audio.settings.enabled ? "ON" : "OFF"}
        </button>

        {/* Difficulty indicator */}
        <div className="absolute top-12 right-4 text-xs font-mono text-cyan-400">
          <div>LEVEL {level}</div>
          <div>TIER {Math.floor((level - 1) / 3) + 1}</div>
          <div>FIRE RATE: {level < 3 ? "LOW" : level < 6 ? "MED" : level < 9 ? "HIGH" : "MAX"}</div>
          <div>SPEED: {getDifficultySettings(level).enemySpeed.toFixed(1)}x</div>
        </div>

        {/* Mettre à jour la légende des attaques pour refléter le changement de couleur */}
        <div className="absolute bottom-4 right-4 text-xs font-mono">
          <div className="text-red-400">Spread (Leroy)</div>
          <div className="text-purple-400">Rapid (Jumba)</div>
          <div className="text-green-400">Power (Pleakley)</div>
          <div className="text-yellow-400 mt-1">AIMED</div>
        </div>

        {/* Ships (bunkers) */}
        {ships.map((ship, index) => (
          <ShipComponent key={index} ship={ship} />
        ))}

        {/* Enemies */}
        {enemies.map((enemy, index) => (
          <EnemyComponent key={index} enemy={enemy} />
        ))}

        {/* Player */}
        <div
          className="absolute"
          style={{
            left: player.x,
            top: player.y,
            width: 50,
            height: 50,
          }}
        >
          <img
            src="/images/player-ship.png"
            alt="player ship"
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
            }}
          />
        </div>

        {/* Bullets with different styles */}
        {bullets.map((bullet, index) => (
          <BulletComponent key={index} bullet={bullet} index={index} />
        ))}

        {/* Enemy bullets with directional movement */}
        {enemyBullets.map((bullet, index) => (
          <BulletComponent key={index} bullet={bullet} index={index} />
        ))}

        {/* Explosions */}
        {explosions.map((explosion, index) => (
          <ExplosionComponent key={index} explosion={explosion} />
        ))}

        {/* Pause overlay */}
        {isPaused && !showInGameLeaderboard && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4 buka-bird-font">PAUSED</h2>
              <p className="text-gray-300 mb-6">Press ESC or click RESUME to continue</p>
              <button
                onClick={() => togglePause()}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
              >
                RESUME GAME
              </button>
            </div>
          </div>
        )}

        {/* In-game leaderboard overlay */}
        {isPaused && showInGameLeaderboard && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="text-center max-w-md w-full mx-4">
              <h2 className="text-3xl font-bold text-yellow-300 mb-4 buka-bird-font">
                TOP 5 {isOnline ? "GLOBAL" : "LOCAL"} LEADERBOARD
              </h2>
              {!isOnline && (
                <p className="text-sm text-gray-400 mb-4">
                  Scores are saved locally. Configure Supabase for global leaderboard.
                </p>
              )}

              <div className="bg-gray-900 bg-opacity-90 rounded-lg p-6 mb-6 max-h-80 overflow-y-auto">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
                    <p className="text-gray-400 mt-2">Loading scores...</p>
                  </div>
                ) : leaderboard.length === 0 ? (
                  <p className="text-gray-400 py-8">No scores yet!</p>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.slice(0, 5).map((entry, index) => (
                      <div
                        key={entry.id || index}
                        className={`flex justify-between items-center py-3 px-4 rounded-lg border-l-4 ${
                          index === 0
                            ? "bg-yellow-900 bg-opacity-30 border-yellow-400"
                            : index === 1
                              ? "bg-gray-700 bg-opacity-30 border-gray-300"
                              : index === 2
                                ? "bg-orange-900 bg-opacity-30 border-orange-400"
                                : "bg-gray-800 bg-opacity-30 border-gray-600"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xl font-bold min-w-[2rem] ${
                              index === 0
                                ? "text-yellow-400"
                                : index === 1
                                  ? "text-gray-300"
                                  : index === 2
                                    ? "text-orange-400"
                                    : "text-white"
                            }`}
                          >
                            #{index + 1}
                          </span>
                          <div>
                            <div className="text-white font-semibold">{entry.player_name}</div>
                            <div className="text-xs text-gray-400">
                              Level {entry.level_reached} •{" "}
                              {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : "N/A"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-cyan-400 font-bold text-lg">{entry.score.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowInGameLeaderboard(false)
                    setIsPaused(false)
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
                >
                  RESUME GAME
                </button>
                <button
                  onClick={() => toggleInGameLeaderboard()}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile controls hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
        ARROW KEYS / ZQSD: Move • SPACE / UP: Shoot
      </div>
    </div>
  )
}
