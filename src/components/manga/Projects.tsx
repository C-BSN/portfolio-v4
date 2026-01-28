'use client'

import { motion } from 'framer-motion'
import ProjectCard, { ProjectCardData } from './ProjectCard'
import { NeonTitle } from '@/components/effects/NeonTitle'

interface ProjectsProps {
  projects: ProjectCardData[]
  title?: string
  subtitle?: string
}

export default function Projects({ projects, title = "Projets", subtitle = "Sélection de travaux récents" }: ProjectsProps) {
  return (
    <section className="min-h-screen py-20 px-6 md:px-12 lg:px-24">
      {/* Section Title */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <NeonTitle as="h2" className="text-6xl md:text-8xl font-bold uppercase mb-4" filled>
          {title}
        </NeonTitle>
        <p className="text-sm uppercase tracking-widest opacity-50">
          {subtitle}
        </p>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {projects.map((project, index) => (
          <ProjectCard 
            key={project.id}
            project={project} 
            index={index} 
          />
        ))}
      </div>
    </section>
  )
}
