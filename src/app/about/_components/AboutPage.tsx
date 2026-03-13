'use client'

import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Download, Mail, ExternalLink, Calendar, GraduationCap, Briefcase, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { AboutData } from '@/lib/content'
import { NeonTitle } from '@/components/effects/NeonTitle'
import { fixCloudinaryPdfUrl } from '@/lib/utils'

const timeline = [
  {
    year: '2018',
    items: [
      { type: 'exp' as const, title: 'Assistant Administratif', org: 'CINOR', detail: 'Stage de 6 semaines — Fiche client, prospection, communication interne' },
    ],
  },
  {
    year: '2019',
    items: [
      { type: 'formation' as const, title: 'BAC Pro Gestion-Administration', org: 'Lycée Julien de Rontaunay', detail: 'Mention Assez Bien + BEP Gestion-Administration' },
    ],
  },
  {
    year: '2019 – 2021',
    items: [
      { type: 'formation' as const, title: 'BTS SIO (niveau)', org: 'Lycée Bellepierre', detail: 'Services Informatiques aux Organisations' },
    ],
  },
  {
    year: '2021 – 2023',
    items: [
      { type: 'formation' as const, title: 'Titre Pro Manager Unité Marchande (niveau)', org: 'DEVA Formation', detail: '' },
      { type: 'exp' as const, title: 'Assistant de Direction', org: 'Lino Comedy', detail: 'Alternance 1 an 7 mois — Gestion d\'équipe, factures/devis, événementiel, supports visuels, vidéo' },
    ],
  },
  {
    year: '2024',
    items: [
      { type: 'benevolat' as const, title: 'Assistant Communication', org: 'Poney No Jutsu', detail: 'Bénévolat — Photo, vidéo, brainstorming, storys' },
    ],
  },
  {
    year: '2024 – 2026',
    items: [
      { type: 'formation' as const, title: 'BTS Communication', org: 'École du Numérique', detail: 'En alternance — En cours' },
      { type: 'exp' as const, title: 'Chargé de Communication', org: 'UDAF Réunion', detail: 'Alternance — Supports visuels, événementiel, vidéos de prévention' },
    ],
  },
]

function TimelineIcon({ type }: { type: 'formation' | 'exp' | 'benevolat' }) {
  if (type === 'formation') return <GraduationCap className="w-4 h-4" />
  if (type === 'benevolat') return <Heart className="w-4 h-4" />
  return <Briefcase className="w-4 h-4" />
}

// Couleurs adaptées selon le thème pour chaque type
function typeColor(type: 'formation' | 'exp' | 'benevolat', isDark: boolean) {
  if (isDark) {
    if (type === 'formation') return '#00f3ff'
    if (type === 'benevolat') return '#a855f7'
    return '#ff0080'
  } else {
    if (type === 'formation') return '#0369a1'
    if (type === 'benevolat') return '#7c3aed'
    return '#e11d48'
  }
}

interface AboutMangaProps {
  pageData: AboutData
}

export default function AboutManga({ pageData }: AboutMangaProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true) }, [])

  const isDark = !mounted || resolvedTheme === 'dark'

  const profileImage = Array.isArray(pageData.profile_image)
    ? pageData.profile_image[0]
    : pageData.profile_image || '/Cocorentin.jpg'

  const cvUrl = fixCloudinaryPdfUrl(pageData.cta_buttons.cv.file_url)

  // Couleurs inline selon le thème
  const textColor = isDark ? '#F0F0F0' : '#1a2f5a'
  const strongColor = isDark ? '#00f3ff' : '#c45880'
  const h2Class = isDark ? 'title-h2-sparkle' : 'title-h2-sparkle-day'

  const borderColor = isDark ? 'border-white/20' : 'border-[#1a2f5a]/20'
  const borderColorAlt = isDark ? 'border-white/10' : 'border-[#1a2f5a]/15'
  const borderColorHover = isDark ? 'hover:border-white/25' : 'hover:border-[#1a2f5a]/35'
  const cornerColor = isDark ? 'border-[#F0F0F0]' : 'border-[#1a2f5a]'
  const imageBorder = isDark ? 'border-[#F0F0F0]' : 'border-[#1a2f5a]'

  const btnPrimary = isDark
    ? 'border-2 border-[#F0F0F0] hover:bg-[#F0F0F0] hover:text-[#050505] transition-all duration-300'
    : 'border-2 border-[#1a2f5a] text-[#1a2f5a] hover:bg-[#1a2f5a] hover:text-white transition-all duration-300'
  const btnSecondary = isDark
    ? 'border-2 border-white/30 hover:border-[#F0F0F0] transition-all duration-300'
    : 'border-2 border-[#1a2f5a]/40 text-[#1a2f5a] hover:border-[#1a2f5a] transition-all duration-300'

  const cardBg = isDark ? 'rgba(5,5,5,0.8)' : 'rgba(255,255,255,0.80)'
  const yearBadgeBg = isDark ? '#050505' : 'rgba(255,255,255,0.90)'

  const buildBody = (html: string) =>
    html.split('\n\n').map(paragraph => {
      if (!paragraph.trim()) return ''
      if (paragraph.startsWith('## ')) {
        return `<h2 class="text-5xl font-bold uppercase mb-8 mt-16 ${h2Class}" style="font-family: 'Oswald', sans-serif;">${paragraph.replace('## ', '')}</h2>`
      }
      if (/^\d+\./.test(paragraph.trim())) {
        const items = paragraph.split('\n').filter(l => l.trim())
        const listItems = items.map(item => {
          const clean = item.replace(/^\d+\.\s*/, '')
            .replace(/\*\*([^*]+)\*\*/g, `<strong style="color: ${strongColor}; font-weight: bold;">$1</strong>`)
            .replace(/\*([^*]+)\*/g, `<em style="color: ${textColor}; font-style: italic;">$1</em>`)
          return `<li class="mb-3 text-lg" style="color: ${textColor};">${clean}</li>`
        }).join('')
        return `<ol class="list-decimal list-inside space-y-3 mb-6" style="color: ${textColor};">${listItems}</ol>`
      }
      const processed = paragraph
        .replace(/\*\*([^*]+)\*\*/g, `<strong style="color: ${strongColor}; font-weight: bold;">$1</strong>`)
        .replace(/\*([^*]+)\*/g, `<em style="color: ${textColor}; font-style: italic;">$1</em>`)
        .replace(/\n/g, '<br />')
      return `<p class="text-lg leading-relaxed mb-6" style="color: ${textColor};">${processed}</p>`
    }).filter(Boolean).join('')

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-8 py-20">
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="relative">
            <div className={`relative aspect-square border-2 overflow-hidden ${imageBorder}`}>
              <Image src={profileImage} alt={pageData.title} fill className="object-cover" />
              <div className={`absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 -translate-x-[4px] -translate-y-[4px] ${cornerColor}`} />
              <div className={`absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 translate-x-[4px] -translate-y-[4px] ${cornerColor}`} />
              <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 -translate-x-[4px] translate-y-[4px] ${cornerColor}`} />
              <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 translate-x-[4px] translate-y-[4px] ${cornerColor}`} />
            </div>

            <div className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
                className={`p-6 text-center border ${borderColor} ${!isDark ? 'bg-white/60 backdrop-blur-sm' : ''}`}
              >
                <div className="text-4xl font-bold mb-2">{pageData.stats.projects.value}</div>
                <div className="text-sm tracking-widest opacity-70">{pageData.stats.projects.label}</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
            <div>
              <NeonTitle as="h1" className="text-6xl md:text-8xl font-bold uppercase leading-none mb-4">
                {pageData.title}
              </NeonTitle>
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
                className="text-xl uppercase tracking-widest opacity-70"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                {pageData.subtitle}
              </motion.p>
            </div>

            {/* Availability */}
            {pageData.availability.status && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
                className={`px-6 py-3 inline-block border ${borderColor} ${!isDark ? 'bg-white/60 backdrop-blur-sm' : ''}`}
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
              <NeonTitle as="h3" className="text-2xl font-bold mb-4 uppercase" filled noAnimation>
                Compétences
              </NeonTitle>
              <div className="flex flex-wrap gap-3">
                {pageData.skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                    className={`px-4 py-2 text-sm uppercase tracking-wide border ${borderColor} ${!isDark ? 'bg-white/50 backdrop-blur-sm' : ''}`}
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }} className="flex flex-wrap gap-4">
              <Link href="/contact" className={`${btnPrimary} px-8 py-3 uppercase tracking-widest flex items-center gap-2`} style={{ fontFamily: "'Oswald', sans-serif" }}>
                <Mail className="w-4 h-4" />
                {pageData.cta_buttons.contact.text}
              </Link>
              <a href={cvUrl} download target="_blank" rel="noopener noreferrer"
                className={`${btnSecondary} px-8 py-3 uppercase tracking-widest flex items-center gap-2`}
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
      <section className="px-8 py-20 max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className={`prose prose-lg max-w-none rounded-sm ${!isDark ? 'bg-white/50 backdrop-blur-sm p-8' : ''}`}
          style={{ fontFamily: "'Oswald', sans-serif", color: textColor }}
        >
          <div
            style={{ color: textColor }}
            dangerouslySetInnerHTML={{ __html: buildBody(pageData.body) }}
          />
        </motion.div>
      </section>

      {/* Parcours Timeline */}
      <section className="px-8 py-20 max-w-5xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <NeonTitle as="h2" className="text-5xl md:text-7xl font-bold uppercase mb-4 text-center" filled>
            Mon Parcours
          </NeonTitle>
          <div className="flex flex-wrap items-center justify-center gap-6 mb-16 text-sm uppercase tracking-widest" style={{ fontFamily: "'Oswald', sans-serif" }}>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: typeColor('formation', isDark) }} />
              Formation
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: typeColor('exp', isDark) }} />
              Expérience
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: typeColor('benevolat', isDark) }} />
              Bénévolat
            </span>
          </div>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className={`absolute left-6 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 ${isDark ? 'bg-white/10' : 'bg-[#1a2f5a]/20'}`} />

          {timeline.map((block, blockIdx) => {
            const color = typeColor(block.items[0].type, isDark)
            return (
              <motion.div
                key={blockIdx}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: blockIdx * 0.1 }}
                className="relative mb-12 last:mb-0"
              >
                {/* Year badge */}
                <div className="flex items-center md:justify-center mb-6">
                  <div
                    className={`relative z-10 px-5 py-2 text-sm uppercase tracking-widest border ${borderColor}`}
                    style={{ fontFamily: "'Oswald', sans-serif", background: yearBadgeBg }}
                  >
                    {block.year}
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {block.items.map((item, itemIdx) => {
                    const itemColor = typeColor(item.type, isDark)
                    const isLeft = itemIdx % 2 === 0
                    return (
                      <div
                        key={itemIdx}
                        className={`relative flex items-start gap-4 md:gap-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                      >
                        {/* Dot */}
                        <div
                          className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full -translate-x-1/2 mt-1.5 z-10 shrink-0"
                          style={{
                            background: itemColor,
                            boxShadow: isDark ? `0 0 8px ${itemColor}` : `0 2px 6px ${itemColor}40`,
                          }}
                        />

                        <div className="w-12 shrink-0 md:hidden" />

                        {/* Card */}
                        <div className={`flex-1 md:w-[calc(50%-2rem)] ${isLeft ? 'md:pr-10 md:text-right' : 'md:pl-10 md:text-left'}`}>
                          <div
                            className={`border p-5 transition-colors duration-300 ${borderColorAlt} ${borderColorHover} ${!isDark ? 'backdrop-blur-sm' : ''}`}
                            style={{ background: cardBg }}
                          >
                            <div className={`flex items-center gap-2 mb-2 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
                              <span style={{ color: itemColor }}><TimelineIcon type={item.type} /></span>
                              <span className="text-xs uppercase tracking-widest opacity-50" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                {item.org}
                              </span>
                            </div>
                            <h4 className="text-lg font-bold uppercase mb-1" style={{ fontFamily: "'Oswald', sans-serif", color: itemColor }}>
                              {item.title}
                            </h4>
                            {item.detail && (
                              <p className="text-sm opacity-60 leading-relaxed" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                {item.detail}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className={`px-8 py-20 border-t relative z-10 ${isDark ? 'border-white/10' : 'border-[#1a2f5a]/10'}`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
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
              <Link href={pageData.final_cta.buttons.projects.link} className={`${btnPrimary} px-8 py-3 uppercase tracking-widest flex items-center gap-2`} style={{ fontFamily: "'Oswald', sans-serif" }}>
                <ExternalLink className="w-4 h-4" />
                {pageData.final_cta.buttons.projects.text}
              </Link>
            )}
            {pageData.final_cta.buttons.calendly && (
              <a href={pageData.final_cta.buttons.calendly.link} target="_blank" rel="noopener noreferrer"
                className={`${btnSecondary} px-8 py-3 uppercase tracking-widest flex items-center gap-2`}
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                <Calendar className="w-4 h-4" />
                {pageData.final_cta.buttons.calendly.text}
              </a>
            )}
            <Link href="/contact" className={`${btnSecondary} px-8 py-3 uppercase tracking-widest flex items-center gap-2`} style={{ fontFamily: "'Oswald', sans-serif" }}>
              <Mail className="w-4 h-4" />
              {pageData.final_cta.buttons.contact.text}
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
