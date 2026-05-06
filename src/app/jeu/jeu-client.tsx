'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useGameState } from '@/game/hooks/useGameState'
import { RdpHomeScreen } from '@/components/rdp/HomeScreen'
import { RdpSetupScreen } from '@/components/rdp/setup/SetupScreen'
import { RdpGameScreen } from '@/components/rdp/game/GameScreen'

export default function JeuClient() {
  const {
    state, goToSetup, goToHome, addPlayer, removePlayer, shufflePlayers,
    setMode, addQuestion, removeQuestion, editQuestion, startGame,
    onSpinComplete, setWheelSpinning, nextPlayer, skipCard, rerollCard,
    resetGame, fullReset,
  } = useGameState()

  const hasSavedGame = state.screen === 'game' || (state.screen === 'setup' && state.players.length > 0)

  return (
    <AnimatePresence mode="wait">
      {state.screen === 'home' && (
        <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <RdpHomeScreen
            onStart={() => { fullReset(); setTimeout(goToSetup, 50) }}
            hasSavedGame={hasSavedGame}
            onResume={() => { if (state.screen === 'game') return; goToSetup() }}
          />
        </motion.div>
      )}
      {state.screen === 'setup' && (
        <motion.div key="setup" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
          <RdpSetupScreen
            players={state.players}
            shuffledIds={state.shuffledPlayerIds}
            mode={state.mode}
            customQuestions={state.customQuestions}
            onAddPlayer={addPlayer}
            onRemovePlayer={removePlayer}
            onShufflePlayers={shufflePlayers}
            onSetMode={setMode}
            onAddQuestion={addQuestion}
            onRemoveQuestion={removeQuestion}
            onEditQuestion={editQuestion}
            onStartGame={startGame}
            onBack={goToHome}
          />
        </motion.div>
      )}
      {state.screen === 'game' && (
        <motion.div key="game" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.35 }}>
          <RdpGameScreen
            state={state}
            players={state.players}
            onSpinStart={setWheelSpinning}
            onSpinComplete={onSpinComplete}
            onNextPlayer={nextPlayer}
            onSkipCard={skipCard}
            onRerollCard={rerollCard}
            onReset={resetGame}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
