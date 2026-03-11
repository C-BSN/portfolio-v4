"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return <div className="w-10 h-10" aria-hidden />
  }

  const isDark = resolvedTheme === "dark"

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        relative w-10 h-10 flex items-center justify-center
        border-2 transition-all duration-300
        ${isDark
          ? "border-white/30 hover:border-white/70 text-white/70 hover:text-white"
          : "border-[#1a2f5a]/40 hover:border-[#1a2f5a]/80 text-[#1a2f5a]/70 hover:text-[#1a2f5a]"
        }
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? "Passer au thème jour" : "Passer au thème nuit"}
      title={isDark ? "Thème jour ☀️" : "Thème nuit 🌩️"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="text-lg leading-none select-none"
          >
            ☀️
          </motion.span>
        ) : (
          <motion.span
            key="storm"
            initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="text-lg leading-none select-none"
          >
            🌩️
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
