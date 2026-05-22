'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'

export interface ProjectCardData {
  id: string
  title: string
  description: string
  category: string
  year: string
  tech: string[]
  link?: string
  slug?: string
  featured_image?: string
}

interface ProjectCardProps {
  project: ProjectCardData
  index: number
  featured?: boolean
}

export default function ProjectCard({ project, index, featured = false }: ProjectCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true) }, [])

  const isDark = !mounted || resolvedTheme === 'dark'

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const darkAccentColors = [
    'rgba(0, 243, 255, 0.12)',
    'rgba(255, 0, 128, 0.12)',
    'rgba(34, 197, 94, 0.12)',
    'rgba(168, 85, 247, 0.12)',
  ]
  const lightAccentColors = [
    'rgba(14, 116, 144, 0.10)',
    'rgba(234, 88, 12, 0.10)',
    'rgba(21, 128, 61, 0.10)',
    'rgba(109, 40, 217, 0.10)',
  ]
  const accentColors = isDark ? darkAccentColors : lightAccentColors

  const projectHref = project.slug ? `/projects/${project.slug}` : (project.link || '#')
  const isExternal = !project.slug && project.link

  const CardContent = (
    <motion.article
      className={`relative h-[480px] overflow-hidden cursor-pointer group block rounded-sm border transition-colors duration-300 ${
        isDark
          ? 'bg-[#0a0a0a] border-white/10'
          : 'bg-white/75 backdrop-blur-sm border-[#1a2f5a]/15'
      }`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.6, 0.01, 0.05, 0.95] as const }}
      whileHover={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(26, 47, 90, 0.35)' }}
    >
      {/* Hover radial glow */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          background: isHovered
            ? `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, ${accentColors[index % accentColors.length]}, transparent 40%)`
            : 'transparent'
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Image */}
      {project.featured_image && (
        <div className="absolute inset-0 z-0">
          <Image
            src={project.featured_image}
            alt={project.title}
            fill
            className="object-cover opacity-75 group-hover:opacity-90 transition-opacity duration-500 group-hover:scale-105 transition-transform"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${
            isDark
              ? 'from-[#0a0a0a]/90 via-[#0a0a0a]/30 to-transparent'
              : 'from-white/90 via-white/60 to-transparent'
          }`} />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full p-8 md:p-10 flex flex-col justify-end">
        <motion.h3
          className={`text-2xl md:text-3xl font-bold uppercase leading-snug line-clamp-3 ${isDark ? 'text-white' : 'text-[#1a2f5a]'}`}
          style={{ fontFamily: "'Oswald', sans-serif" }}
          animate={{ y: isHovered ? -8 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {project.title}
        </motion.h3>

        {/* Hover details */}
        <motion.div
          className="overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-3">
              <span className={`text-[11px] uppercase tracking-[0.15em] px-3 py-1 backdrop-blur-sm border ${
                isDark
                  ? 'text-white/80 border-white/20 bg-white/5'
                  : 'text-[#1a2f5a]/80 border-[#1a2f5a]/20 bg-[#1a2f5a]/5'
              }`}>
                {project.category}
              </span>
              <span className={`text-sm ${isDark ? 'text-white/50' : 'text-[#1a2f5a]/50'}`}>{project.year}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {project.tech.map((tech, i) => (
                <span
                  key={i}
                  className={`text-[10px] px-2 py-0.5 uppercase tracking-wider border ${
                    isDark
                      ? 'border-white/15 text-white/60 bg-white/5'
                      : 'border-[#1a2f5a]/15 text-[#1a2f5a]/60 bg-[#1a2f5a]/5'
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>

            <p className={`text-sm leading-relaxed line-clamp-2 ${isDark ? 'text-white/60' : 'text-[#1a2f5a]/70'}`}>
              {project.description}
            </p>

            <div className={`flex items-center justify-between pt-2 border-t ${isDark ? 'border-white/10' : 'border-[#1a2f5a]/10'}`}>
              <span className={`text-[11px] uppercase tracking-[0.15em] ${isDark ? 'text-white/50' : 'text-[#1a2f5a]/50'}`}>
                Voir le projet
              </span>
              <ArrowUpRight className={`w-4 h-4 ${isDark ? 'text-white/50' : 'text-[#1a2f5a]/50'}`} />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.article>
  )

  if (isExternal) {
    return <a href={projectHref} target="_blank" rel="noopener noreferrer">{CardContent}</a>
  }
  return <Link href={projectHref}>{CardContent}</Link>
}
