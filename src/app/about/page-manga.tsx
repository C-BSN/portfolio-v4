'use client'

import { motion } from 'framer-motion'
import { Download, Mail, ExternalLink, Calendar } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { AboutData } from '@/lib/content'
import { NeonTitle } from '@/components/effects/NeonTitle'

interface AboutMangaProps {
  pageData: AboutData
}

export default function AboutManga({ pageData }: AboutMangaProps) {
  const profileImage = Array.isArray(pageData.profile_image) 
    ? pageData.profile_image[0] 
    : pageData.profile_image || '/Cocorentin.jpg'

  const cvUrl = Array.isArray(pageData.cta_buttons.cv.file_url)
    ? pageData.cta_buttons.cv.file_url[0]
    : pageData.cta_buttons.cv.file_url

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-8 py-20">
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-square border-2 border-[#F0F0F0] overflow-hidden">
              <Image
                src={profileImage}
                alt={pageData.title}
                fill
                className="object-cover"
              />
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#F0F0F0] -translate-x-[4px] -translate-y-[4px]" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#F0F0F0] translate-x-[4px] -translate-y-[4px]" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#F0F0F0] -translate-x-[4px] translate-y-[4px]" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#F0F0F0] translate-x-[4px] translate-y-[4px]" />
            </div>

            {/* Stats */}
            <div className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="border border-white/20 p-6 text-center"
              >
                <div className="text-4xl font-bold mb-2">{pageData.stats.projects.value}</div>
                <div className="text-sm tracking-widest opacity-70">{pageData.stats.projects.label}</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <NeonTitle 
                as="h1"
                className="text-6xl md:text-8xl font-bold uppercase leading-none mb-4"
              >
                {pageData.title}
              </NeonTitle>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-xl uppercase tracking-widest opacity-70"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                {pageData.subtitle}
              </motion.p>
            </div>

            {/* Availability */}
            {pageData.availability.status && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="border border-white/20 px-6 py-3 inline-block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm uppercase tracking-widest" style={{ fontFamily: "'Oswald', sans-serif" }}>
                    {pageData.availability.message}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <NeonTitle as="h3" className="text-2xl font-bold mb-4 uppercase" filled noAnimation>
                Compétences
              </NeonTitle>
              <div className="flex flex-wrap gap-3">
                {pageData.skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                    className="border border-white/20 px-4 py-2 text-sm uppercase tracking-wide"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href={`mailto:${pageData.cta_buttons.contact.email}`}
                className="border-2 border-[#F0F0F0] px-8 py-3 uppercase tracking-widest hover:bg-[#F0F0F0] hover:text-[#050505] transition-all duration-300 flex items-center gap-2"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                <Mail className="w-4 h-4" />
                {pageData.cta_buttons.contact.text}
              </a>
              <a
                href={cvUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white/30 px-8 py-3 uppercase tracking-widest hover:border-[#F0F0F0] transition-all duration-300 flex items-center gap-2"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                <Download className="w-4 h-4" />
                {pageData.cta_buttons.cv.text}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-8 py-20 max-w-5xl mx-auto relative z-10" style={{ color: '#F0F0F0' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="prose prose-lg prose-invert max-w-none"
          style={{ 
            fontFamily: "'Oswald', sans-serif", 
            color: '#F0F0F0',
            textShadow: '0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.2)'
          }}
        >
          <div
            style={{ color: '#F0F0F0' }}
            dangerouslySetInnerHTML={{
              __html: pageData.body
                .split('\n\n')
                .map(paragraph => {
                  // Skip empty paragraphs
                  if (!paragraph.trim()) return ''
                  
                  // Handle h2
                  if (paragraph.startsWith('## ')) {
                    return `<h2 class="text-5xl font-bold uppercase mb-8 mt-16 title-h2-sparkle" style="font-family: 'Oswald', sans-serif;">${paragraph.replace('## ', '')}</h2>`
                  }
                  
                  // Handle ordered lists (detect if starts with number)
                  if (/^\d+\./.test(paragraph.trim())) {
                    const items = paragraph.split('\n').filter(line => line.trim())
                    const listItems = items.map(item => {
                      const cleanItem = item.replace(/^\d+\.\s*/, '')
                        .replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #00f3ff; font-weight: bold; text-shadow: 0 0 10px rgba(0, 243, 255, 0.6), 0 0 20px rgba(0, 243, 255, 0.4);">$1</strong>')
                        .replace(/\*([^*]+)\*/g, '<em style="color: #F0F0F0; font-style: italic;">$1</em>')
                        .replace(/→/g, '→')
                      return `<li class="mb-3 text-lg" style="color: #F0F0F0; text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);">${cleanItem}</li>`
                    }).join('')
                    return `<ol class="list-decimal list-inside space-y-3 mb-6" style="color: #F0F0F0;">${listItems}</ol>`
                  }
                  
                  // Handle regular paragraphs with markdown
                  const processedParagraph = paragraph
                    .replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #00f3ff; font-weight: bold; text-shadow: 0 0 10px rgba(0, 243, 255, 0.6), 0 0 20px rgba(0, 243, 255, 0.4);">$1</strong>')
                    .replace(/\*([^*]+)\*/g, '<em style="color: #F0F0F0; font-style: italic;">$1</em>')
                    .replace(/\n/g, '<br />')
                  
                  return `<p class="text-lg leading-relaxed mb-6" style="color: #F0F0F0; text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);">${processedParagraph}</p>`
                })
                .filter(html => html) // Remove empty strings
                .join('')
            }}
          />
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="px-8 py-20 border-t border-white/10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <NeonTitle as="h2" className="text-5xl md:text-7xl font-bold uppercase mb-6" filled>
            {pageData.final_cta.title}
          </NeonTitle>
          <p className="text-xl mb-4 opacity-70" style={{ fontFamily: "'Oswald', sans-serif" }}>
            {pageData.final_cta.description_line1}
          </p>
          <p className="text-lg mb-12 opacity-60" style={{ fontFamily: "'Oswald', sans-serif" }}>
            {pageData.final_cta.description_line2}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            {pageData.final_cta.buttons.projects && (
              <Link
                href={pageData.final_cta.buttons.projects.link}
                className="border-2 border-[#F0F0F0] px-8 py-3 uppercase tracking-widest hover:bg-[#F0F0F0] hover:text-[#050505] transition-all duration-300 flex items-center gap-2"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                <ExternalLink className="w-4 h-4" />
                {pageData.final_cta.buttons.projects.text}
              </Link>
            )}
            {pageData.final_cta.buttons.calendly && (
              <a
                href={pageData.final_cta.buttons.calendly.link}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white/30 px-8 py-3 uppercase tracking-widest hover:border-[#F0F0F0] transition-all duration-300 flex items-center gap-2"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                <Calendar className="w-4 h-4" />
                {pageData.final_cta.buttons.calendly.text}
              </a>
            )}
            <a
              href={`mailto:${pageData.final_cta.buttons.contact.email}`}
              className="border-2 border-white/30 px-8 py-3 uppercase tracking-widest hover:border-[#F0F0F0] transition-all duration-300 flex items-center gap-2"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              <Mail className="w-4 h-4" />
              {pageData.final_cta.buttons.contact.text}
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
