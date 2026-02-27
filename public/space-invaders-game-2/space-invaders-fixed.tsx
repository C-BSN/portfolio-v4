"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface Position {
  x: number
  y: number
}

interface Enemy {
  x: number
  y: number
  type: "green" | "purple" | "red"
  alive: boolean
}

interface Bullet {
  x: number
  y: number
  direction: "up" | "down"
}

const GAME_WIDTH = 800
const GAME_HEIGHT = 600
const PLAYER_SPEED = 5
const BULLET_SPEED = 7
const ENEMY_SPEED = 1

export default function SpaceInvaders() {
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">("menu")
  const [player, setPlayer] = useState<Position>({ x: GAME_WIDTH / 2 - 25, y: GAME_HEIGHT - 60 })
  const [enemies, setEnemies] = useState<Enemy[]>([])
  const [bullets, setBullets] = useState<Bullet[]>([])
  const [enemyBullets, setEnemyBullets] = useState<Bullet[]>([])
  const [score, setScore] = useState(0)
  const [hiScore, setHiScore] = useState(3540)
  const [lives, setLives] = useState(3)
  const [level, setLevel] = useState(1)
  const [keys, setKeys] = useState<Set<string>>(new Set())
  const [enemyDirection, setEnemyDirection] = useState(1)
  const [enemyMoveDown, setEnemyMoveDown] = useState(false)
  // const [showDebug, setShowDebug] = useState(true)

  const gameLoopRef = useRef<number>()
  const lastShotRef = useRef(0)
  const enemyLastShotRef = useRef(0)

  // Précharger les images
  useEffect(() => {
    const preloadImages = () => {
      const imagePaths = ["/images/green-alien.png", "/images/purple-alien.png", "/images/red-stitch.png"]

      imagePaths.forEach((src) => {
        if (typeof window !== "undefined") {
          const img = document.createElement("img")
          img.src = src
        }
      })
    }

    preloadImages()
  }, [])

  // Initialize enemies
  const initializeEnemies = useCallback(() => {
    const newEnemies: Enemy[] = []
    const rows = [
      { count: 11, type: "green" as const, startY: 120 },
      { count: 11, type: "purple" as const, startY: 150 },
      { count: 11, type: "purple" as const, startY: 180 },
      { count: 9, type: "red" as const, startY: 210 },
      { count: 8, type: "red" as const, startY: 240 },
    ]

    rows.forEach((row) => {
      for (let i = 0; i < row.count; i++) {
        newEnemies.push({
          x: 150 + i * 45,
          y: row.startY,
          type: row.type,
          alive: true,
        })
      }
    })

    setEnemies(newEnemies)
  }, [])

  // Start game
  const startGame = () => {
    setGameState("playing")
    setScore(0)
    setLives(3)
    setLevel(1)
    setPlayer({ x: GAME_WIDTH / 2 - 25, y: GAME_HEIGHT - 60 })
    setBullets([])
    setEnemyBullets([])
    initializeEnemies()
  }

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [])

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return

    const gameLoop = () => {
      const now = Date.now()

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

      // Player shooting
      if ((keys.has(" ") || keys.has("arrowup") || keys.has("z")) && now - lastShotRef.current > 250) {
        setBullets((prev) => [...prev, { x: player.x + 25, y: player.y, direction: "up" }])
        lastShotRef.current = now
      }

      // Move bullets
      setBullets((prev) =>
        prev.map((bullet) => ({ ...bullet, y: bullet.y - BULLET_SPEED })).filter((bullet) => bullet.y > 0),
      )

      setEnemyBullets((prev) =>
        prev.map((bullet) => ({ ...bullet, y: bullet.y + BULLET_SPEED })).filter((bullet) => bullet.y < GAME_HEIGHT),
      )

      // Move enemies
      setEnemies((prev) => {
        const aliveEnemies = prev.filter((enemy) => enemy.alive)
        if (aliveEnemies.length === 0) return prev

        const leftMost = Math.min(...aliveEnemies.map((e) => e.x))
        const rightMost = Math.max(...aliveEnemies.map((e) => e.x))

        let newDirection = enemyDirection
        let moveDown = false

        if (rightMost >= GAME_WIDTH - 50 && enemyDirection > 0) {
          newDirection = -1
          moveDown = true
        } else if (leftMost <= 10 && enemyDirection < 0) {
          newDirection = 1
          moveDown = true
        }

        setEnemyDirection(newDirection)
        setEnemyMoveDown(moveDown)

        return prev.map((enemy) => ({
          ...enemy,
          x: enemy.x + (moveDown ? 0 : newDirection * ENEMY_SPEED),
          y: enemy.y + (moveDown ? 20 : 0),
        }))
      })

      // Enemy shooting
      if (now - enemyLastShotRef.current > 1000) {
        const aliveEnemies = enemies.filter((enemy) => enemy.alive)
        if (aliveEnemies.length > 0) {
          const randomEnemy = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)]
          setEnemyBullets((prev) => [...prev, { x: randomEnemy.x + 20, y: randomEnemy.y + 30, direction: "down" }])
          enemyLastShotRef.current = now
        }
      }

      // Collision detection - bullets vs enemies
      setBullets((prevBullets) => {
        const remainingBullets: Bullet[] = []

        prevBullets.forEach((bullet) => {
          let hit = false
          setEnemies((prevEnemies) =>
            prevEnemies.map((enemy) => {
              if (
                enemy.alive &&
                bullet.x > enemy.x &&
                bullet.x < enemy.x + 40 &&
                bullet.y > enemy.y &&
                bullet.y < enemy.y + 30
              ) {
                hit = true
                const points = enemy.type === "green" ? 30 : enemy.type === "purple" ? 20 : 10
                setScore((prev) => prev + points)
                return { ...enemy, alive: false }
              }
              return enemy
            }),
          )
          if (!hit) remainingBullets.push(bullet)
        })

        return remainingBullets
      })

      // Collision detection - enemy bullets vs player
      setEnemyBullets((prevBullets) => {
        const remainingBullets: Bullet[] = []

        prevBullets.forEach((bullet) => {
          if (bullet.x > player.x && bullet.x < player.x + 50 && bullet.y > player.y && bullet.y < player.y + 40) {
            setLives((prev) => {
              const newLives = prev - 1
              if (newLives <= 0) {
                setGameState("gameOver")
                if (score > hiScore) setHiScore(score)
              }
              return newLives
            })
          } else {
            remainingBullets.push(bullet)
          }
        })

        return remainingBullets
      })

      // Check win condition
      const aliveEnemies = enemies.filter((enemy) => enemy.alive)
      if (aliveEnemies.length === 0) {
        setLevel((prev) => prev + 1)
        initializeEnemies()
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState, player, enemies, keys, enemyDirection, score, hiScore, initializeEnemies])

  // Composant ennemi avec fallback
  const EnemyComponent = ({ enemy }: { enemy: Enemy }) => {
    if (!enemy.alive) return null

    // Définir les couleurs de fallback pour chaque type d'ennemi
    const colors = {
      green: "#90EE90",
      purple: "#9370DB",
      red: "#FF6B6B",
    }

    return (
      <div
        className="absolute"
        style={{
          left: enemy.x,
          top: enemy.y,
          width: 40,
          height: 40,
          backgroundColor: colors[enemy.type], // Couleur de fallback
          borderRadius: "50%", // Forme ronde comme fallback
        }}
      >
        {enemy.type === "green" && (
          <div className="w-full h-full" style={{ backgroundColor: colors.green, borderRadius: "50%" }}>
            <div className="w-1 h-3 absolute bg-green-300" style={{ left: "50%", top: "-2px" }}></div>
          </div>
        )}

        {enemy.type === "purple" && (
          <div className="w-full h-full" style={{ backgroundColor: colors.purple, borderRadius: "50%" }}>
            <div className="w-2 h-2 absolute bg-white rounded-full" style={{ left: "25%", top: "30%" }}></div>
            <div className="w-2 h-2 absolute bg-white rounded-full" style={{ left: "65%", top: "30%" }}></div>
          </div>
        )}

        {enemy.type === "red" && (
          <div
            className="w-full h-full"
            style={{ backgroundColor: colors.red, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }}
          >
            <div className="w-3 h-6 absolute bg-red-700 rounded-full" style={{ left: "0px", top: "15%" }}></div>
            <div className="w-3 h-6 absolute bg-red-700 rounded-full" style={{ right: "0px", top: "15%" }}></div>
          </div>
        )}
      </div>
    )
  }

  if (gameState === "menu") {
    return (
      <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
        {/* Stars background */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                opacity: Math.random() * 0.8 + 0.2,
              }}
            />
          ))}
        </div>

        <div className="text-center z-10">
          <h1 className="text-6xl font-bold mb-4 text-yellow-300 tracking-wider">STITCH</h1>
          <h1 className="text-6xl font-bold mb-8 text-yellow-300 tracking-wider">INVADERS</h1>
          <button
            onClick={startGame}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
          >
            START GAME
          </button>
          <div className="mt-8 text-sm text-gray-400">
            <p>Use ARROW KEYS or ZQSD to move</p>
            <p>SPACE or UP ARROW to shoot</p>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === "gameOver") {
    return (
      <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4 text-red-500">GAME OVER</h1>
        <p className="text-xl mb-2">Final Score: {score}</p>
        <p className="text-lg mb-8">Hi-Score: {hiScore}</p>
        <button
          onClick={startGame}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
        >
          PLAY AGAIN
        </button>
      </div>
    )
  }

  return (
    <div className="w-full h-screen bg-black text-white relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: Math.random() * 0.6 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Debug panel */}
      {/* {showDebug && <DebugImages />} */}

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
              <div>SHIPS 0</div>
              <div className="flex items-center gap-2">
                LIVES
                {[...Array(lives)].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 relative"
                    style={{
                      backgroundColor: "#FF6B6B",
                      borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                    }}
                  >
                    <div
                      className="w-1.5 h-3 absolute bg-red-700 rounded-full"
                      style={{ left: "0px", top: "25%" }}
                    ></div>
                    <div
                      className="w-1.5 h-3 absolute bg-red-700 rounded-full"
                      style={{ right: "0px", top: "25%" }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

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
            height: 40,
            backgroundColor: "#FF6B6B",
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          }}
        >
          <div className="w-3 h-6 absolute bg-red-700 rounded-full" style={{ left: "0px", top: "25%" }}></div>
          <div className="w-3 h-6 absolute bg-red-700 rounded-full" style={{ right: "0px", top: "25%" }}></div>
        </div>

        {/* Bullets */}
        {bullets.map((bullet, index) => (
          <div key={index} className="absolute bg-cyan-400 w-1 h-4" style={{ left: bullet.x, top: bullet.y }} />
        ))}

        {/* Enemy bullets */}
        {enemyBullets.map((bullet, index) => (
          <div key={index} className="absolute bg-yellow-400 w-1 h-4" style={{ left: bullet.x, top: bullet.y }} />
        ))}
      </div>

      {/* Mobile controls hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
        ARROW KEYS / ZQSD: Move • SPACE / UP: Shoot
      </div>
    </div>
  )
}
