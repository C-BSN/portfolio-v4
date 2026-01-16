"use client"

import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const navigation = [
  { name: "ACCUEIL", href: "/" },
  { name: "À PROPOS", href: "/about" },
  { name: "PROJETS", href: "/projects" },
]

export function HeaderManga() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Manga/Anime Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-[50] backdrop-blur-md bg-[#050505]/90 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="relative w-12 h-12">
                  <Image
                    src="/Logo%20CBSN%20v3.png"
                    alt="CBSN Logo"
                    fill
                    sizes="48px"
                    className="object-contain filter brightness-110"
                    priority
                  />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                  Corentin Basson
                </span>
              </div>
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative px-6 py-2 uppercase tracking-widest text-sm transition-colors hover:text-white/70"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Contact Button Desktop */}
            <div className="hidden md:block">
              <a
                href="mailto:corentinbassonpro@gmail.com"
                className="border-2 border-[#F0F0F0] px-6 py-2 uppercase tracking-widest text-sm hover:bg-[#F0F0F0] hover:text-[#050505] transition-all duration-300"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                CONTACT
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 border border-white/20"
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
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-20 left-0 right-0 z-40 bg-[#050505] border-b border-white/10 md:hidden"
          >
            <nav className="flex flex-col p-6 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="py-3 uppercase tracking-widest text-lg border-b border-white/10 hover:text-white/70 transition-colors"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href="mailto:corentinbassonpro@gmail.com"
                className="border-2 border-[#F0F0F0] px-6 py-3 uppercase tracking-widest text-center hover:bg-[#F0F0F0] hover:text-[#050505] transition-all duration-300"
                style={{ fontFamily: "'Oswald', sans-serif" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                CONTACT
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
