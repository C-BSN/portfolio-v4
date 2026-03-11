"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { ThemeToggle } from "@/components/ThemeToggle"

const navigation = [
  { name: "ACCUEIL", href: "/" },
  { name: "À PROPOS", href: "/about" },
  { name: "PROJETS", href: "/projects" },
]

export function HeaderManga() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const isDark = !mounted || resolvedTheme === "dark"

  return (
    <>
      {/* Manga/Anime Navigation Bar */}
      <header className={`fixed top-0 left-0 right-0 z-[50] backdrop-blur-md border-b transition-colors duration-300 ${
        isDark
          ? "bg-[#050505]/90 border-white/10"
          : "bg-white/60 border-[#1a2f5a]/15"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo CBSN Studio */}
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <div className="relative w-32 h-16 sm:w-40 sm:h-20 md:w-48 md:h-24 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={isDark ? "/logo-cbsn-v4.png" : "/images/Logo CBSN bleu rose.png"}
                    alt="CBSN Studio Logo"
                    fill
                    sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 192px"
                    className="object-contain transition-all duration-300"
                    priority
                  />
                </div>
              </div>
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-6 py-2 uppercase tracking-widest text-sm transition-colors ${
                    isDark
                      ? "hover:text-white/70"
                      : "text-[#1a2f5a] hover:text-[#1a2f5a]/60"
                  }`}
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Contact Button + Theme Toggle Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/contact"
                className={`border-2 px-6 py-2 uppercase tracking-widest text-sm transition-all duration-300 ${
                  isDark
                    ? "border-[#F0F0F0] hover:bg-[#F0F0F0] hover:text-[#050505]"
                    : "border-[#1a2f5a] text-[#1a2f5a] hover:bg-[#1a2f5a] hover:text-white"
                }`}
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                CONTACT
              </Link>
            </div>

            {/* Mobile : Toggle + Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                className={`p-2 border transition-colors ${isDark ? "border-white/20" : "border-[#1a2f5a]/30"}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`fixed top-20 left-0 right-0 z-40 border-b md:hidden transition-colors duration-300 ${
              isDark
                ? "bg-[#050505] border-white/10"
                : "bg-white/90 border-[#1a2f5a]/15 backdrop-blur-md"
            }`}
          >
            <nav className="flex flex-col p-6 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`py-3 uppercase tracking-widest text-lg border-b transition-colors ${
                    isDark
                      ? "border-white/10 hover:text-white/70"
                      : "border-[#1a2f5a]/15 text-[#1a2f5a] hover:text-[#1a2f5a]/60"
                  }`}
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/contact"
                className={`border-2 px-6 py-3 uppercase tracking-widest text-center transition-all duration-300 ${
                  isDark
                    ? "border-[#F0F0F0] hover:bg-[#F0F0F0] hover:text-[#050505]"
                    : "border-[#1a2f5a] text-[#1a2f5a] hover:bg-[#1a2f5a] hover:text-white"
                }`}
                style={{ fontFamily: "'Oswald', sans-serif" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                CONTACT
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
