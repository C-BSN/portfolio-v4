'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProjectGallery } from "@/components/ui/project-gallery"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Download, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import type { Project } from "@/lib/content"
import { NeonTitle } from "@/components/effects/NeonTitle"
import { fixCloudinaryPdfUrl, getCloudinaryPdfPreviewUrl, isCloudinaryPdf, resolveUrl } from "@/lib/utils"

interface ProjectPageMangaProps {
  project: Project
  previousProject: Project | null
  nextProject: Project | null
}

function getYoutubeEmbedUrl(url: string): string {
  try {
    if (url.includes('youtube.com/embed/')) return url
    let videoId = ''
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1])
      videoId = urlParams.get('v') || ''
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0]
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  } catch {
    return url
  }
}

export default function ProjectPageManga({ project, previousProject, nextProject }: ProjectPageMangaProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const isDark = !mounted || resolvedTheme === 'dark'

  const backgroundImage = Array.isArray(project.featured_image)
    ? project.featured_image[0]
    : project.featured_image
  const hasValidImage = backgroundImage && backgroundImage.trim() !== ''

  // Couleurs dynamiques
  const textColor = isDark ? '#F0F0F0' : '#1a2f5a'
  const accentColor = isDark ? '#00f3ff' : '#f97316'
  const headingColor = isDark ? '#ff0080' : '#e11d48'
  const h2Class = isDark ? 'title-h2-sparkle' : 'title-h2-sparkle-day'

  // Panel styles
  const panelBg = isDark ? 'bg-[#050505]/80' : 'bg-white/80'
  const panelBorder = isDark ? 'border-white/40' : 'border-[#1a2f5a]/25'
  const innerBorder = isDark ? 'border-white/20' : 'border-[#1a2f5a]/15'
  const innerBg = isDark ? 'bg-white/5' : 'bg-[#1a2f5a]/5'
  const sidebarBorder = isDark ? 'border-white/10' : 'border-[#1a2f5a]/10'
  const badgeCls = `border uppercase tracking-wider ${isDark ? 'border-white/30 bg-white/10' : 'border-[#1a2f5a]/30 bg-[#1a2f5a]/5 text-[#1a2f5a]'}`

  // Build body HTML
  const buildBodyHtml = (body: string) =>
    body.split('\n\n').map(paragraph => {
      const clean = paragraph.trim()
      if (!clean) return ''

      if (clean.match(/^### .+\n(-|\d+\.)\s/)) {
        const lines = clean.split('\n')
        const h3Line = lines[0]
        const listLines = lines.slice(1).filter(l => l.match(/^(-|\d+\.)\s/))
        const isOrdered = listLines.length > 0 && listLines[0].match(/^\d+\.\s/)
        const tag = isOrdered ? 'ol' : 'ul'
        const listClass = isOrdered ? 'list-decimal' : 'list-disc'
        const h3Html = `<h3 class="text-xl font-bold mb-2" style="font-family: 'Oswald', sans-serif; color: ${headingColor};">${h3Line.replace('### ', '')}</h3>`
        const listHtml = `<${tag} class="${listClass} list-inside mb-4 space-y-2">${listLines.map(item =>
          `<li style="color: ${textColor};">${item.replace(/^(-|\d+\.)\s/, '').replace(/\*\*([^*]+)\*\*/g, `<strong style="color: ${accentColor}; font-weight: bold;">$1</strong>`)}</li>`
        ).join('')}</${tag}>`
        return h3Html + listHtml
      }

      if (clean.startsWith('# ') || clean.startsWith('## ') || clean.startsWith('### ')) {
        const lines = clean.split('\n')
        const headingLine = lines[0]
        const restLines = lines.slice(1).filter(l => l.trim() !== '')
        let headingHtml = ''
        if (headingLine.startsWith('### ')) {
          headingHtml = `<h3 class="text-xl font-bold mb-2" style="font-family: 'Oswald', sans-serif; color: ${headingColor};">${headingLine.replace('### ', '')}</h3>`
        } else if (headingLine.startsWith('## ')) {
          headingHtml = `<h2 class="text-3xl font-bold mb-3 ${h2Class}" style="font-family: 'Oswald', sans-serif;">${headingLine.replace('## ', '')}</h2>`
        } else {
          headingHtml = `<h1 class="text-4xl font-bold mb-4" style="font-family: 'Oswald', sans-serif; color: ${textColor};">${headingLine.replace('# ', '')}</h1>`
        }
        if (restLines.length > 0) {
          const restText = restLines.join('\n')
            .replace(/\*\*([^*]+)\*\*/g, `<strong style="color: ${accentColor}; font-weight: bold;">$1</strong>`)
            .replace(/\*([^*]+)\*/g, `<em style="color: ${textColor}; font-style: italic;">$1</em>`)
            .replace(/\n/g, '<br />')
          headingHtml += `<p class="text-lg leading-relaxed mb-6" style="color: ${textColor};">${restText}</p>`
        }
        return headingHtml
      }

      if (clean.includes('\n- ') || clean.startsWith('- ')) {
        const items = clean.split('\n').filter(l => l.startsWith('- '))
        return `<ul class="list-disc list-inside mb-4 space-y-2">${items.map(item =>
          `<li style="color: ${textColor};">${item.replace('- ', '').replace(/\*\*([^*]+)\*\*/g, `<strong style="color: ${accentColor}; font-weight: bold;">$1</strong>`)}</li>`
        ).join('')}</ul>`
      }

      if (clean.match(/^(\d+\.)\s/) || clean.includes('\n1.')) {
        const items = clean.split('\n').filter(l => l.match(/^\d+\.\s/))
        if (items.length > 0) {
          return `<ol class="list-decimal list-inside mb-4 space-y-2">${items.map(item =>
            `<li style="color: ${textColor};">${item.replace(/^\d+\.\s/, '').replace(/\*\*([^*]+)\*\*/g, `<strong style="color: ${accentColor}; font-weight: bold;">$1</strong>`)}</li>`
          ).join('')}</ol>`
        }
      }

      const processed = clean
        .replace(/\*\*([^*]+)\*\*/g, `<strong style="color: ${accentColor}; font-weight: bold;">$1</strong>`)
        .replace(/\*([^*]+)\*/g, `<em style="color: ${textColor}; font-style: italic;">$1</em>`)
        .replace(/\n/g, '<br />')
      return `<p class="text-lg leading-relaxed mb-6" style="color: ${textColor};">${processed}</p>`
    }).filter(Boolean).join('')

  const btnPrimary = isDark
    ? 'border-2 border-[#F0F0F0] bg-transparent hover:bg-[#F0F0F0] hover:text-[#050505] text-[#F0F0F0] transition-all'
    : 'border-2 border-[#1a2f5a] bg-transparent text-[#1a2f5a] hover:bg-[#1a2f5a] hover:text-white transition-all'

  const navBtnCls = isDark
    ? 'border-2 border-white/40 bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white'
    : 'border-2 border-[#1a2f5a]/30 bg-white/70 backdrop-blur-sm hover:bg-white/90 text-[#1a2f5a]'

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      {hasValidImage ? (
        <div className="fixed inset-0 z-0">
          <img src={backgroundImage} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className={`absolute inset-0 ${isDark ? 'bg-[#050505]/55' : 'bg-white/45'}`} />
        </div>
      ) : (
        <div className={`fixed inset-0 z-0 ${isDark ? 'bg-[#050505]' : 'bg-sky-100/80'}`} />
      )}

      {/* Contenu */}
      <div className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto w-full px-4">

          {/* Retour */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Button variant="ghost" asChild className={`border ${isDark ? 'border-white/20 hover:bg-white/10 text-white' : 'border-[#1a2f5a]/30 hover:bg-white/60 text-[#1a2f5a]'}`}>
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux projets
              </Link>
            </Button>
          </motion.div>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-7xl mx-auto mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {(Array.isArray(project.project_type) ? project.project_type : [project.project_type]).map((type, i) => (
                <Badge key={i} className={badgeCls} style={{ fontFamily: "'Oswald', sans-serif" }}>{type}</Badge>
              ))}
              {project.annonceur && (
                <Badge className={badgeCls} style={{ fontFamily: "'Oswald', sans-serif" }}>{project.annonceur}</Badge>
              )}
              {project.status && (
                <Badge className={badgeCls} style={{ fontFamily: "'Oswald', sans-serif" }}>{project.status}</Badge>
              )}
            </div>

            <div className={`inline-block px-6 py-4 backdrop-blur-sm border-4 rounded-lg ${isDark ? 'bg-black/30 border-white/40' : 'bg-white/70 border-[#1a2f5a]/30'}`}>
              <NeonTitle as="h1" className="text-5xl md:text-7xl font-bold uppercase leading-tight">
                {project.title}
              </NeonTitle>
            </div>

            {project.excerpt && (
              <p
                className={`text-xl mb-8 mt-4 inline-block px-6 py-3 backdrop-blur-sm border-2 rounded-lg ${isDark ? 'bg-black/30 border-white/30' : 'bg-white/70 border-[#1a2f5a]/20'}`}
                style={{ fontFamily: "'Oswald', sans-serif", color: textColor }}
              >
                {project.excerpt}
              </p>
            )}
          </motion.div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

              {/* Contenu principal */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">

                {/* Description */}
                <div className={`border ${panelBorder} ${panelBg} backdrop-blur-sm rounded-lg p-8 mb-8`}>
                  <div className="prose prose-lg max-w-none" style={{ fontFamily: "'Oswald', sans-serif", color: textColor }}>
                    <div dangerouslySetInnerHTML={{ __html: buildBodyHtml(project.body) }} />
                  </div>

                  {/* Stratégie de communication */}
                  {(project.cibles || project.strategie_creative || project.objectifs_cognitifs || project.objectifs_affectifs || project.objectifs_conatifs) && (
                    <div className={`mt-8 pt-8 border-t ${innerBorder}`}>
                      <h2 className={`text-3xl font-bold mb-6 ${h2Class}`} style={{ fontFamily: "'Oswald', sans-serif" }}>
                        Stratégie de Communication
                      </h2>

                      <div className="space-y-6">
                        {project.cibles && (
                          <div className={`border-l-4 pl-6 py-2 ${isDark ? 'border-white/40' : 'border-[#1a2f5a]/30'}`}>
                            <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Oswald', sans-serif", color: headingColor }}>Cibles</h3>
                            <p className="text-lg leading-relaxed" style={{ fontFamily: "'Oswald', sans-serif", color: textColor }}>{project.cibles}</p>
                          </div>
                        )}

                        {project.strategie_creative && (
                          <div className={`border-l-4 pl-6 py-2 ${isDark ? 'border-white/40' : 'border-[#1a2f5a]/30'}`}>
                            <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Oswald', sans-serif", color: headingColor }}>Positionnement</h3>
                            <p className="text-lg leading-relaxed" style={{ fontFamily: "'Oswald', sans-serif", color: textColor }}>{project.strategie_creative}</p>
                          </div>
                        )}

                        {((project.objectifs_cognitifs?.length ?? 0) > 0 || (project.objectifs_affectifs?.length ?? 0) > 0 || (project.objectifs_conatifs?.length ?? 0) > 0) && (
                          <div className={`border-l-4 pl-6 py-2 ${isDark ? 'border-white/40' : 'border-[#1a2f5a]/30'}`}>
                            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Oswald', sans-serif", color: headingColor }}>Objectifs</h3>
                            <div className="space-y-4">
                              {(['cognitifs', 'affectifs', 'conatifs'] as const).map(type => {
                                const key = `objectifs_${type}` as keyof Project
                                const items = project[key] as string[] | undefined
                                if (!items || items.length === 0) return null
                                return (
                                  <div key={type}>
                                    <p className="text-base mb-2 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif", color: accentColor }}>
                                      {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </p>
                                    <ul className="space-y-2">
                                      {items.map((item, i) => (
                                        <li key={i} className="text-lg leading-relaxed pl-4 relative" style={{ fontFamily: "'Oswald', sans-serif", color: textColor }}>
                                          <span className="absolute left-0">•</span>
                                          {item}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Galerie */}
                {project.gallery && project.gallery.length > 0 && (
                  <div className={`border ${panelBorder} ${panelBg} backdrop-blur-sm rounded-lg p-6 mb-8`}>
                    <NeonTitle as="h3" className="text-3xl font-bold uppercase mb-4" filled noAnimation>Galerie</NeonTitle>
                    <ProjectGallery gallery={project.gallery} title="" defaultLayout="justified" showLayoutSwitcher={false} className="" />
                  </div>
                )}

                {/* Preuves */}
                {project.preuves && project.preuves.length > 0 && (
                  <div className={`border ${panelBorder} ${panelBg} backdrop-blur-sm rounded-lg p-6 mb-8`}>
                    <NeonTitle as="h3" className="text-3xl font-bold uppercase mb-6" filled noAnimation>Preuves</NeonTitle>
                    <div className="space-y-6">
                      {project.preuves.map((preuve, index) => (
                        <div key={index} className={`border ${innerBorder} ${innerBg} rounded-lg p-4`}>
                          {preuve.description && (
                            <p className="text-sm font-medium uppercase tracking-wider mb-3" style={{ fontFamily: "'Oswald', sans-serif", color: textColor }}>
                              {preuve.description}
                            </p>
                          )}
                          {preuve.type === 'Video' && preuve.youtube_url && (
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                              <iframe className="absolute top-0 left-0 w-full h-full rounded"
                                src={getYoutubeEmbedUrl(preuve.youtube_url)} title={preuve.description}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                            </div>
                          )}
                          {preuve.type === 'Image' && preuve.file && (
                            <Image src={preuve.file} alt={preuve.description} width={800} height={600} className="w-full h-auto rounded" />
                          )}
                          {preuve.type === 'PDF' && preuve.pdf && (() => {
                            const pdfUrl = fixCloudinaryPdfUrl(preuve.pdf)
                            const previewUrl = isCloudinaryPdf(pdfUrl) ? getCloudinaryPdfPreviewUrl(preuve.pdf) : ''
                            return (
                              <div className="space-y-3">
                                {previewUrl && <img src={previewUrl} alt={preuve.description} className="w-full h-auto rounded" />}
                                <Button asChild className={`w-full ${btnPrimary}`} style={{ fontFamily: "'Oswald', sans-serif" }}>
                                  <Link href={pdfUrl} target="_blank"><Download className="mr-2 h-4 w-4" />Télécharger le PDF</Link>
                                </Button>
                              </div>
                            )
                          })()}
                          {preuve.type === 'URL' && preuve.url && (
                            <Button asChild className={`w-full ${btnPrimary}`} style={{ fontFamily: "'Oswald', sans-serif" }}>
                              <Link href={preuve.url} target="_blank"><ExternalLink className="mr-2 h-4 w-4" />Voir le lien</Link>
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Sidebar */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-1">
                <div className={`sticky top-24 border ${panelBorder} ${panelBg} backdrop-blur-sm rounded-lg p-6`}>
                  <NeonTitle as="h3" className="text-2xl font-bold mb-4 uppercase" filled noAnimation>Informations</NeonTitle>
                  <div className="space-y-4">
                    {[
                      { label: 'Date', value: new Date(project.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }), icon: <Calendar className="h-5 w-5 mt-1" /> },
                      project.annonceur ? { label: 'Client', value: project.annonceur } : null,
                      project.contexte ? { label: 'Contexte', value: project.contexte } : null,
                      project.duration ? { label: 'Durée', value: project.duration } : null,
                    ].filter(Boolean).map((item, i) => (
                      <div key={i} className={`flex items-start gap-3 p-3 border ${sidebarBorder} ${innerBg}`}>
                        {(item as { label: string; value: string; icon?: React.ReactNode }).icon && (
                          <span style={{ color: textColor }}>{(item as { label: string; value: string; icon?: React.ReactNode }).icon}</span>
                        )}
                        <div>
                          <p className="text-sm font-medium uppercase tracking-wider mb-1" style={{ fontFamily: "'Oswald', sans-serif", color: textColor }}>
                            {(item as { label: string; value: string }).label}
                          </p>
                          <p className="text-sm" style={{ color: textColor }}>
                            {(item as { label: string; value: string }).value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {project.tools && project.tools.length > 0 && (
                    <div className={`mt-6 pt-6 border-t ${sidebarBorder}`}>
                      <h4 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif", color: textColor }}>
                        Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.tools.map((tool) => (
                          <Badge key={tool} className={`text-xs uppercase ${innerBg} border ${innerBorder}`} style={{ fontFamily: "'Oswald', sans-serif", color: textColor }}>
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Navigation entre projets */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="max-w-7xl mx-auto mt-16">
            <div className={`h-px mb-8 bg-gradient-to-r from-transparent ${isDark ? 'via-white/20' : 'via-[#1a2f5a]/20'} to-transparent`} />
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex-1">
                {previousProject ? (
                  <Button variant="outline" asChild className={`h-auto p-4 w-full justify-start ${navBtnCls}`}>
                    <Link href={`/projects/${previousProject.slug}`}>
                      <div className="flex items-center gap-3">
                        <ChevronLeft className="h-5 w-5 flex-shrink-0" />
                        <div className="text-left">
                          <p className="text-xs mb-1 uppercase tracking-wider opacity-70" style={{ fontFamily: "'Oswald', sans-serif" }}>Précédent</p>
                          <p className="font-medium text-sm">{previousProject.title}</p>
                        </div>
                      </div>
                    </Link>
                  </Button>
                ) : <div />}
              </div>

              <Button variant="ghost" asChild className={`${navBtnCls} uppercase tracking-widest`} style={{ fontFamily: "'Oswald', sans-serif" }}>
                <Link href="/projects">Tous</Link>
              </Button>

              <div className="flex-1 flex justify-end">
                {nextProject ? (
                  <Button variant="outline" asChild className={`h-auto p-4 w-full justify-end ${navBtnCls}`}>
                    <Link href={`/projects/${nextProject.slug}`}>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs mb-1 uppercase tracking-wider opacity-70" style={{ fontFamily: "'Oswald', sans-serif" }}>Suivant</p>
                          <p className="font-medium text-sm">{nextProject.title}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 flex-shrink-0" />
                      </div>
                    </Link>
                  </Button>
                ) : <div />}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
