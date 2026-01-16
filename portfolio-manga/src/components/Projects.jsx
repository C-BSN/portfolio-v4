import { motion } from 'framer-motion';
import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { PORTFOLIO_DATA } from '../lib/data';

function ProjectCard({ project, index }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Accent colors for different projects
  const accentColors = [
    'rgba(59, 130, 246, 0.1)',  // Blue
    'rgba(239, 68, 68, 0.1)',   // Red
    'rgba(34, 197, 94, 0.1)',   // Green
    'rgba(168, 85, 247, 0.1)',  // Purple
  ];

  return (
    <motion.article
      className="relative min-h-[400px] border border-white/10 bg-[#050505] overflow-hidden cursor-pointer group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.6, 0.01, 0.05, 0.95]
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

      {/* Content */}
      <div className="relative z-10 h-full p-8 flex flex-col justify-between">
        {/* Top: Year & Category */}
        <div className="flex items-start justify-between">
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
          className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
        <div>
          <motion.h3 
            className="text-4xl md:text-5xl font-bold uppercase leading-none mb-4"
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
            className="text-sm opacity-0 max-w-md group-hover:opacity-70 transition-opacity duration-300"
          >
            {project.description}
          </motion.p>

          {/* Link Icon */}
          <motion.div
            className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100"
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
  );
}

export default function Projects() {
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
        <h2 className="text-6xl md:text-8xl font-bold uppercase text-outline-thick mb-4">
          Projets
        </h2>
        <p className="text-sm uppercase tracking-widest opacity-50">
          Sélection de travaux récents
        </p>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PORTFOLIO_DATA.projects.map((project, index) => (
          <a 
            key={project.id}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <ProjectCard project={project} index={index} />
          </a>
        ))}
      </div>
    </section>
  );
}
