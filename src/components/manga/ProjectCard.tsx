'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const accentColors = [
    'rgba(0, 243, 255, 0.12)',
    'rgba(255, 0, 128, 0.12)',
    'rgba(34, 197, 94, 0.12)',
    'rgba(168, 85, 247, 0.12)',
  ]

  const projectHref = project.slug ? `/projects/${project.slug}` : (project.link || '#')
  const isExternal = !project.slug && project.link

  const CardContent = (
    <motion.article
      className="relative h-[480px] border border-white/10 bg-[#0a0a0a] overflow-hidden cursor-pointer group block rounded-sm"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.6, 0.01, 0.05, 0.95] as const
      }}
      whileHover={{ 
        borderColor: 'rgba(255, 255, 255, 0.25)',
      }}
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
            className="object-cover opacity-50 group-hover:opacity-65 transition-opacity duration-500 group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full p-8 md:p-10 flex flex-col justify-end">
        {/* Title — always visible */}
        <motion.h3 
          className="text-2xl md:text-3xl font-bold uppercase leading-snug line-clamp-3 text-white"
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
          animate={{ 
            height: isHovered ? 'auto' : 0, 
            opacity: isHovered ? 1 : 0 
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-[0.15em] text-white/80 border border-white/20 px-3 py-1 bg-white/5 backdrop-blur-sm">
                {project.category}
              </span>
              <span className="text-sm text-white/50">{project.year}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {project.tech.map((tech, i) => (
                <span 
                  key={i}
                  className="text-[10px] border border-white/15 px-2 py-0.5 uppercase tracking-wider text-white/60 bg-white/5"
                >
                  {tech}
                </span>
              ))}
            </div>

            <p className="text-sm leading-relaxed text-white/60 line-clamp-2">
              {project.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-[11px] uppercase tracking-[0.15em] text-white/50">
                Voir le projet
              </span>
              <ArrowUpRight className="w-4 h-4 text-white/50" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.article>
  )

  if (isExternal) {
    return (
      <a 
        href={projectHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        {CardContent}
      </a>
    )
  }

  return (
    <Link href={projectHref}>
      {CardContent}
    </Link>
  )
}
