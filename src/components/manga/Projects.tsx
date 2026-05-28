'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProjectCard, { ProjectCardData } from './ProjectCard'
import { NeonTitle } from '@/components/effects/NeonTitle'
import { useTheme } from 'next-themes'

interface ProjectsProps {
  projects: ProjectCardData[]
  title?: string
  subtitle?: string
  carousel?: boolean
}

export default function Projects({ projects, title = "Projets", subtitle = "Sélection de travaux récents", carousel = false }: ProjectsProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const scroll = (dir: 'left' | 'right') => {
    if (!trackRef.current) return
    const card = trackRef.current.querySelector('article') as HTMLElement
    const cardWidth = card ? card.offsetWidth + 32 : 400
    trackRef.current.scrollBy({ left: dir === 'right' ? cardWidth : -cardWidth, behavior: 'smooth' })
  }

  return (
    <section className="min-h-screen py-20 px-6 md:px-12 lg:px-24">
      {/* Section Title */}
      {(title || subtitle) && (
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {title && (
            <NeonTitle as="h2" className="text-6xl md:text-8xl font-bold uppercase mb-4" filled>
              {title}
            </NeonTitle>
          )}
          {subtitle && (
            <p className="text-sm uppercase tracking-widest opacity-50">
              {subtitle}
            </p>
          )}
        </motion.div>
      )}

      {carousel ? (
        /* Carousel mode */
        <div className="relative">
          <div
            ref={trackRef}
            className="flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="flex-none w-[calc(50%-1rem)] snap-start"
              >
                <ProjectCard project={project} index={index} />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={() => scroll('left')}
              className={`w-12 h-12 flex items-center justify-center border transition-all duration-300 ${
                isDark
                  ? 'border-white/20 text-white/60 hover:border-white hover:text-white hover:bg-white/5'
                  : 'border-[#1a2f5a]/20 text-[#1a2f5a]/60 hover:border-[#1a2f5a] hover:text-[#1a2f5a] hover:bg-[#1a2f5a]/5'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className={`w-12 h-12 flex items-center justify-center border transition-all duration-300 ${
                isDark
                  ? 'border-white/20 text-white/60 hover:border-white hover:text-white hover:bg-white/5'
                  : 'border-[#1a2f5a]/20 text-[#1a2f5a]/60 hover:border-[#1a2f5a] hover:text-[#1a2f5a] hover:bg-[#1a2f5a]/5'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      ) : (
        /* Grid mode (default) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  )
}
