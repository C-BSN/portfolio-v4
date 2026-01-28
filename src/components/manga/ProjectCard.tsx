'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
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

  // Accent colors for different projects
  const accentColors = [
    'rgba(59, 130, 246, 0.1)',  // Blue
    'rgba(239, 68, 68, 0.1)',   // Red
    'rgba(34, 197, 94, 0.1)',   // Green
    'rgba(168, 85, 247, 0.1)',  // Purple
  ]

  const projectHref = project.slug ? `/projects/${project.slug}` : (project.link || '#')
  const isExternal = !project.slug && project.link

  const CardContent = (
    <motion.article
      className="relative h-[500px] border border-white/10 bg-[#050505] overflow-hidden cursor-pointer group block"
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
        borderColor: 'rgba(240, 240, 240, 0.3)',
      }}
    >
      {/* Hover background effect */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          background: isHovered 
            ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${accentColors[index % accentColors.length]}, transparent 40%)`
            : 'transparent'
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Image Background */}
      {project.featured_image && (
        <div className="absolute inset-0 z-0">
          <Image
            src={project.featured_image}
            alt={project.title}
            fill
            className="object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-[#050505]/60" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full p-10 flex flex-col justify-between gap-6">
        {/* Top: Year & Category */}
        <div className="flex items-start justify-between mb-4">
          <motion.span 
            className="text-xs uppercase tracking-wider opacity-50 border border-white/20 px-3 py-1"
            animate={{ 
              x: isHovered ? -5 : 0,
              opacity: isHovered ? 0.8 : 0.5
            }}
          >
            {project.category}
          </motion.span>
          
          <motion.span 
            className="text-2xl font-bold opacity-30"
            animate={{ 
              scale: isHovered ? 1.1 : 1,
              opacity: isHovered ? 0.5 : 0.3
            }}
          >
            {project.year}
          </motion.span>
        </div>

        {/* Middle: Tech Stack */}
        <motion.div 
          className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 min-h-[32px]"
        >
          {project.tech.map((tech, i) => (
            <span 
              key={i}
              className="text-xs border border-white/20 px-2 py-1 uppercase tracking-wide"
            >
              {tech}
            </span>
          ))}
        </motion.div>

        {/* Bottom: Title & Description */}
        <div className="mt-auto space-y-4 pb-4">
          <motion.h3 
            className="text-4xl md:text-5xl font-bold uppercase leading-none"
            animate={{ 
              x: isHovered ? 10 : 0,
              y: isHovered ? -5 : 0,
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20 
            }}
          >
            {project.title}
          </motion.h3>

          <motion.p 
            className="text-sm opacity-0 max-w-[calc(100%-80px)] group-hover:opacity-70 transition-opacity duration-300 pr-4"
          >
            {project.description}
          </motion.p>

          {/* Link Icon */}
          <motion.div
            className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: isHovered ? 1 : 0,
              rotate: isHovered ? 0 : -180
            }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
          >
            <ExternalLink className="w-6 h-6" />
          </motion.div>
        </div>
      </div>

      {/* Cursor follower effect */}
      {isHovered && (
        <motion.div
          className="absolute w-32 h-32 rounded-full border border-white/20 pointer-events-none z-20"
          style={{
            left: mousePosition.x - 64,
            top: mousePosition.y - 64,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 150, 
            damping: 15 
          }}
        />
      )}
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
