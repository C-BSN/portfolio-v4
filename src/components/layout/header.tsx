"use client"

import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, Home, User, Briefcase, ExternalLink } from "lucide-react"

const navigation = [
  { name: "ACCUEIL", href: "/", icon: Home },
  { name: "À PROPOS", href: "/about", icon: User },
  { name: "PROJETS", href: "/projects", icon: Briefcase },
]

interface HeaderProps {
  theme?: {
    headerClasses?: string
    primary?: string
    secondary?: string
    mood?: string
  }
}

export function Header({ theme }: HeaderProps = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Classes par défaut ou thématiques
  const headerClasses = theme?.headerClasses || 'bg-black/50 border-cyan-400/30 text-cyan-400'
  const primaryColor = theme?.primary || 'cyan-400'
  const secondaryColor = theme?.secondary || 'pink-400'

  return (
    <>
      {/* Cyberpunk Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-[50] backdrop-blur-md bg-black/90 border-b border-cyan-400/30 cyberpunk-nav">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo BSN */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="relative">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 cyberpunk-logo-natural">
                  <Image
                    src="/Logo%20CBSN%20v3.png"
                    alt="CBSN Logo"
                    fill
                    sizes="(max-width: 640px) 40px, 48px"
                    className="object-contain w-full h-full filter brightness-110 contrast-110 drop-shadow-lg"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/30 to-purple-500/30 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
              </div>
              <div className="hidden sm:block">
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent font-mono">
                  Corentin Basson
                </span>
                <div className="h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 font-mono text-sm cyberpunk-nav-item text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/5"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.name}</span>
                    <div className="absolute inset-0 border border-transparent group-hover:border-cyan-400/50 rounded-lg transition-colors"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-purple-500/0 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity"></div>
                  </Link>
                )
              })}
            </nav>

            {/* CTA Button Desktop */}
            <div className="hidden md:block">
              <Button 
                asChild 
                className="relative bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-mono border-0 px-6 py-2 group overflow-hidden"
              >
                <Link href="/projects" className="flex items-center space-x-2">
                  <span>VOIR PROJETS</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-cyan-400 hover:text-purple-400 hover:bg-cyan-400/10 border border-cyan-400/30"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-cyan-400/30">
            <div className="px-4 py-6 space-y-4">
              {navigation.map((item) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg font-mono text-sm transition-all text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              <div className="pt-4">
                <Button 
                  asChild 
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-mono"
                >
                  <Link href="/projects" onClick={() => setMobileMenuOpen(false)}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    VOIR PROJETS
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Cyberpunk Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        
        .font-mono {
          font-family: 'Orbitron', monospace;
        }
        
        /* Cyberpunk Navigation Styles */
        .cyberpunk-nav {
          position: relative;
        }
        
        .cyberpunk-nav::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #00ffff, #ff00ff, transparent);
          animation: nav-scan 3s linear infinite;
        }
        
        @keyframes nav-scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .cyberpunk-logo-natural {
          animation: logo-pulse-natural 2s ease-in-out infinite alternate;
        }
        
        .cyberpunk-logo-natural:hover {
          transform: scale(1.05);
          transition: transform 0.3s ease;
        }
        
        @keyframes logo-pulse-natural {
          0% { 
            filter: drop-shadow(0 0 5px rgba(6, 182, 212, 0.5)) drop-shadow(0 0 10px rgba(147, 51, 234, 0.3));
          }
          100% { 
            filter: drop-shadow(0 0 10px rgba(6, 182, 212, 0.8)) drop-shadow(0 0 15px rgba(147, 51, 234, 0.5));
          }
        }
        
        @keyframes logo-pulse {
          0% { 
            box-shadow: 0 0 10px rgba(6, 182, 212, 0.5), 0 0 20px rgba(147, 51, 234, 0.3);
          }
          100% { 
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.8), 0 0 30px rgba(147, 51, 234, 0.5);
          }
        }
        
        .cyberpunk-nav-item {
          position: relative;
          overflow: hidden;
        }
        
        .cyberpunk-nav-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.1), transparent);
          transition: left 0.5s ease;
        }
        
        .cyberpunk-nav-item:hover::before {
          left: 100%;
        }
      `}</style>
    </>
  )
} 