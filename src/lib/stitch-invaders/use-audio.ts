"use client"

import { useCallback, useRef, useState } from "react"

interface AudioSettings {
  volume: number
  enabled: boolean
}

export function useAudio() {
  const [settings, setSettings] = useState<AudioSettings>({
    volume: 0.3,
    enabled: true,
  })

  const audioContextRef = useRef<AudioContext | null>(null)

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "square", volume = 1) => {
      if (!settings.enabled) return

      try {
        const audioContext = getAudioContext()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
        oscillator.type = type

        gainNode.gain.setValueAtTime(0, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(settings.volume * volume, audioContext.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + duration)
      } catch (error) {
        console.warn("Audio playback failed:", error)
      }
    },
    [settings, getAudioContext],
  )

  const playPlayerShoot = useCallback(() => {
    playTone(800, 0.1, "square", 0.3)
  }, [playTone])

  const playEnemyShoot = useCallback(() => {
    playTone(200, 0.15, "sawtooth", 0.2)
  }, [playTone])

  const playEnemyHit = useCallback(() => {
    const audioContext = getAudioContext()
    if (!settings.enabled) return

    try {
      const duration = 0.3
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      const filter = audioContext.createBiquadFilter()

      oscillator.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.type = "sawtooth"
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + duration)

      filter.type = "lowpass"
      filter.frequency.setValueAtTime(2000, audioContext.currentTime)
      filter.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + duration)

      gainNode.gain.setValueAtTime(settings.volume * 0.4, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    } catch (error) {
      console.warn("Audio playback failed:", error)
    }
  }, [settings, getAudioContext])

  const playPlayerHit = useCallback(() => {
    const audioContext = getAudioContext()
    if (!settings.enabled) return

    try {
      const duration = 0.8
      const oscillator1 = audioContext.createOscillator()
      const gainNode1 = audioContext.createGain()

      oscillator1.connect(gainNode1)
      gainNode1.connect(audioContext.destination)

      oscillator1.type = "sawtooth"
      oscillator1.frequency.setValueAtTime(300, audioContext.currentTime)
      oscillator1.frequency.exponentialRampToValueAtTime(30, audioContext.currentTime + duration)

      gainNode1.gain.setValueAtTime(settings.volume * 0.6, audioContext.currentTime)
      gainNode1.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)

      oscillator1.start(audioContext.currentTime)
      oscillator1.stop(audioContext.currentTime + duration)

      setTimeout(() => {
        playTone(150, 0.4, "triangle", 0.3)
      }, 100)
    } catch (error) {
      console.warn("Audio playback failed:", error)
    }
  }, [settings, getAudioContext, playTone])

  const playLevelComplete = useCallback(() => {
    const notes = [523, 659, 784, 1047]
    notes.forEach((note, index) => {
      setTimeout(() => {
        playTone(note, 0.3, "sine", 0.4)
      }, index * 150)
    })
  }, [playTone])

  const playGameOver = useCallback(() => {
    const notes = [523, 466, 415, 349, 294]
    notes.forEach((note, index) => {
      setTimeout(() => {
        playTone(note, 0.5, "triangle", 0.5)
      }, index * 200)
    })
  }, [playTone])

  const playMenuSelect = useCallback(() => {
    playTone(659, 0.1, "sine", 0.2)
  }, [playTone])

  const toggleAudio = useCallback(() => {
    setSettings((prev) => ({ ...prev, enabled: !prev.enabled }))
  }, [])

  const setVolume = useCallback((volume: number) => {
    setSettings((prev) => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }))
  }, [])

  return {
    settings,
    playPlayerShoot,
    playEnemyShoot,
    playEnemyHit,
    playPlayerHit,
    playLevelComplete,
    playGameOver,
    playMenuSelect,
    toggleAudio,
    setVolume,
  }
}
