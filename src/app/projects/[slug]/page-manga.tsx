'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProjectGallery } from "@/components/ui/project-gallery"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Download, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import type { Project } from "@/lib/content"
import { NeonTitle } from "@/components/effects/NeonTitle"
import { fixCloudinaryPdfUrl, getCloudinaryPdfPreviewUrl, isCloudinaryPdf, resolveUrl } from "@/lib/utils"

interface ProjectPageMangaProps {
  project: Project
  previousProject: Project | null
  nextProject: Project | null
}

// Fonction pour convertir une URL YouTube en URL d'embed
function getYoutubeEmbedUrl(url: string): string {
  try {
    // Gestion des formats d'URL YouTube
    // Format 1: https://www.youtube.com/watch?v=VIDEO_ID
    // Format 2: https://youtu.be/VIDEO_ID
    // Format 3: https://www.youtube.com/embed/VIDEO_ID (déjà au bon format)
    
    if (url.includes('youtube.com/embed/')) {
      return url
    }
    
    let videoId = ''
    
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1])
      videoId = urlParams.get('v') || ''
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0]
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  } catch (error) {
    console.error('Error parsing YouTube URL:', error)
    return url
  }
}

export default function ProjectPageManga({ project, previousProject, nextProject }: ProjectPageMangaProps) {
  // Extraire l'image (peut être un tableau ou une string)
  const backgroundImage = Array.isArray(project.featured_image) 
    ? project.featured_image[0] 
    : project.featured_image

  // Vérifier que l'image n'est pas vide
  const hasValidImage = backgroundImage && backgroundImage.trim() !== ''

  return (
    <div className="min-h-screen relative">
      {/* Background Image du projet */}
      {hasValidImage ? (
        <div className="fixed inset-0 z-0">
          <img
            src={backgroundImage}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#050505]/50" />
        </div>
      ) : (
        // Fallback: fond noir si pas d'image
        <div className="fixed inset-0 z-0 bg-[#050505]" />
      )}

      {/* Contenu */}
      <div className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto w-full px-4">
          {/* Navigation de retour */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button variant="ghost" asChild className="border border-white/20 hover:bg-white/10">
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux projets
              </Link>
            </Button>
          </motion.div>

          {/* Header du projet */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-7xl mx-auto mb-12"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {Array.isArray(project.project_type) ? (
                project.project_type.map((type, index) => (
                  <Badge key={index} className="border border-white/30 bg-white/10 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                    {type}
                  </Badge>
                ))
              ) : (
                <Badge className="border border-white/30 bg-white/10 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                  {project.project_type}
                </Badge>
              )}
              {project.annonceur && (
                <Badge className="border border-white/20 bg-white/5 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                  {project.annonceur}
                </Badge>
              )}
              {project.status && (
                <Badge className="border border-white/20 bg-white/5 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                  {project.status}
                </Badge>
              )}
            </div>
            
            <div className="inline-block px-6 py-4 bg-black/30 backdrop-blur-sm border-4 border-white/40 rounded-lg">
              <NeonTitle 
                as="h1" 
                className="text-5xl md:text-7xl font-bold uppercase leading-tight"
              >
                {project.title}
              </NeonTitle>
            </div>
            
            {project.excerpt && (
              <p 
                className="text-xl mb-8 inline-block px-6 py-3 bg-black/30 backdrop-blur-sm border-2 border-white/30 rounded-lg" 
                style={{ 
                  fontFamily: "'Oswald', sans-serif", 
                  color: '#F0F0F0' 
                }}
              >
                {project.excerpt}
              </p>
            )}

          </motion.div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contenu principal */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2"
              >
                {/* Description du projet */}
                <div className="border border-white/40 bg-[#050505]/80 backdrop-blur-sm rounded-lg p-8 mb-8">
                  <div 
                    className="prose prose-lg prose-invert max-w-none project-content-manga" 
                    style={{ 
                      fontFamily: "'Oswald', sans-serif", 
                      color: '#F0F0F0'
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: project.body
                          .split('\n\n')
                          .map(paragraph => {
                            // Nettoyer le paragraphe
                            const cleanParagraph = paragraph.trim()
                            if (!cleanParagraph) return ''
                            
                            // Si le paragraphe contient un titre ### suivi de listes (puces ou numérotées), les séparer
                            if (cleanParagraph.match(/^### .+\n(-|\d+\.)\s/)) {
                              const lines = cleanParagraph.split('\n')
                              const h3Line = lines[0]
                              const listLines = lines.slice(1).filter(line => line.match(/^(-|\d+\.)\s/))
                              const isOrdered = listLines.length > 0 && listLines[0].match(/^\d+\.\s/)
                              const h3Html = `<h3 class="text-xl font-bold mb-2" style="font-family: 'Oswald', sans-serif; color: #ff0080 !important;">${h3Line.replace('### ', '')}</h3>`
                              const tag = isOrdered ? 'ol' : 'ul'
                              const listClass = isOrdered ? 'list-decimal' : 'list-disc'
                              const listHtml = `<${tag} class="${listClass} list-inside mb-4 text-white space-y-2">${listLines.map(item => `<li style="color: #F0F0F0; ">${item.replace(/^(-|\d+\.)\s/, '').replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold" style="color: #00f3ff;">$1</strong>')}</li>`).join('')}</${tag}>`
                              return h3Html + listHtml
                            }
                            
                            // Gérer les titres (potentiellement suivis de texte)
                            if (cleanParagraph.startsWith('# ') || cleanParagraph.startsWith('## ') || cleanParagraph.startsWith('### ')) {
                              const lines = cleanParagraph.split('\n')
                              const headingLine = lines[0]
                              const restLines = lines.slice(1).filter(l => l.trim() !== '')
                              
                              let headingHtml = ''
                              if (headingLine.startsWith('### ')) {
                                headingHtml = `<h3 class="text-xl font-bold mb-2" style="font-family: 'Oswald', sans-serif; color: #ff0080 !important;">${headingLine.replace('### ', '')}</h3>`
                              } else if (headingLine.startsWith('## ')) {
                                headingHtml = `<h2 class="text-3xl font-bold mb-3 title-h2-sparkle" style="font-family: 'Oswald', sans-serif;">${headingLine.replace('## ', '')}</h2>`
                              } else {
                                headingHtml = `<h1 class="text-4xl font-bold mb-4 neon-title" style="font-family: 'Oswald', sans-serif;">${headingLine.replace('# ', '')}</h1>`
                              }
                              
                              // S'il y a du texte après le titre, le rendre comme paragraphe
                              if (restLines.length > 0) {
                                const restText = restLines.join('\n')
                                  .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white" style="color: #00f3ff;">$1</strong>')
                                  .replace(/\*([^*]+)\*/g, '<em class="italic text-white" style="color: #F0F0F0;">$1</em>')
                                  .replace(/\n/g, '<br />')
                                headingHtml += `<p class="text-lg leading-relaxed mb-6" style="color: #F0F0F0; ">${restText}</p>`
                              }
                              
                              return headingHtml
                            }
                            
                            // Gérer les listes seules (puces)
                            if (cleanParagraph.includes('\n- ') || cleanParagraph.startsWith('- ')) {
                              const items = cleanParagraph.split('\n').filter(line => line.startsWith('- '))
                              return `<ul class="list-disc list-inside mb-4 text-white space-y-2">${items.map(item => `<li style="color: #F0F0F0; ">${item.replace('- ', '').replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold" style="color: #00f3ff;">$1</strong>')}</li>`).join('')}</ul>`
                            }
                            
                            // Gérer les listes numérotées seules
                            if (cleanParagraph.match(/^(\d+\.)\s/) || cleanParagraph.includes('\n1.')) {
                              const items = cleanParagraph.split('\n').filter(line => line.match(/^\d+\.\s/))
                              if (items.length > 0) {
                                return `<ol class="list-decimal list-inside mb-4 text-white space-y-2">${items.map(item => `<li style="color: #F0F0F0; ">${item.replace(/^\d+\.\s/, '').replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold" style="color: #00f3ff;">$1</strong>')}</li>`).join('')}</ol>`
                              }
                            }
                            
                            // Gérer le texte normal avec bold et italic
                            const processedParagraph = cleanParagraph
                              .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white" style="color: #00f3ff;">$1</strong>')
                              .replace(/\*([^*]+)\*/g, '<em class="italic text-white" style="color: #F0F0F0;">$1</em>')
                              .replace(/\n/g, '<br />')
                            
                            return `<p class="text-lg leading-relaxed mb-6" style="color: #F0F0F0; ">${processedParagraph}</p>`
                          })
                          .filter(html => html)
                          .join('')
                      }}
                    />
                  </div>

                  {/* Copy Strategy - intégré dans le même bloc */}
                  {(project.cibles || project.strategie_creative || project.objectifs_cognitifs || project.objectifs_affectifs || project.objectifs_conatifs) && (
                    <div className="mt-8 pt-8 border-t border-white/20">
                      <h2 className="text-3xl font-bold mb-6 title-h2-sparkle" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        Stratégie de Communication
                      </h2>
                      
                      <div className="space-y-6">
                        {/* Cibles */}
                        {project.cibles && (
                          <div className="border-l-4 border-white/40 pl-6 py-2">
                            <h3 
                              className="text-xl font-bold mb-3" 
                              style={{ 
                                fontFamily: "'Oswald', sans-serif", 
                                color: '#ff0080'
                              }}
                            >
                              Cibles
                            </h3>
                            <p 
                              className="text-lg leading-relaxed" 
                              style={{ 
                                fontFamily: "'Oswald', sans-serif",
                                color: '#F0F0F0',
                              }}
                            >
                              {project.cibles}
                            </p>
                          </div>
                        )}
                        
                        {/* Stratégie créative */}
                        {project.strategie_creative && (
                          <div className="border-l-4 border-white/40 pl-6 py-2">
                            <h3 
                              className="text-xl font-bold mb-3" 
                              style={{ 
                                fontFamily: "'Oswald', sans-serif", 
                                color: '#ff0080'
                              }}
                            >
                              Positionnement
                            </h3>
                            <p 
                              className="text-lg leading-relaxed" 
                              style={{ 
                                fontFamily: "'Oswald', sans-serif",
                                color: '#F0F0F0',
                              }}
                            >
                              {project.strategie_creative}
                            </p>
                          </div>
                        )}
                        
                        {/* Objectifs */}
                        {((project.objectifs_cognitifs && project.objectifs_cognitifs.length > 0) || 
                          (project.objectifs_affectifs && project.objectifs_affectifs.length > 0) || 
                          (project.objectifs_conatifs && project.objectifs_conatifs.length > 0)) && (
                          <div className="border-l-4 border-white/40 pl-6 py-2">
                            <h3 
                              className="text-xl font-bold mb-4" 
                              style={{ 
                                fontFamily: "'Oswald', sans-serif", 
                                color: '#ff0080'
                              }}
                            >
                              Objectifs
                            </h3>
                            
                            <div className="space-y-4">
                              {/* Objectifs cognitifs */}
                              {project.objectifs_cognitifs && project.objectifs_cognitifs.length > 0 && (
                                <div>
                                  <p 
                                    className="text-base mb-2 uppercase tracking-wider" 
                                    style={{ 
                                      fontFamily: "'Oswald', sans-serif",
                                      color: '#00f3ff',
                                    }}
                                  >
                                    Cognitifs
                                  </p>
                                  <ul className="space-y-2">
                                    {project.objectifs_cognitifs.map((objectif, index) => (
                                      <li 
                                        key={index} 
                                        className="text-lg leading-relaxed pl-4"
                                        style={{ 
                                          fontFamily: "'Oswald', sans-serif",
                                          color: '#F0F0F0',
                                          position: 'relative'
                                        }}
                                      >
                                        <span style={{ position: 'absolute', left: 0 }}>•</span>
                                        {objectif}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* Objectifs affectifs */}
                              {project.objectifs_affectifs && project.objectifs_affectifs.length > 0 && (
                                <div>
                                  <p 
                                    className="text-base mb-2 uppercase tracking-wider" 
                                    style={{ 
                                      fontFamily: "'Oswald', sans-serif",
                                      color: '#00f3ff',
                                    }}
                                  >
                                    Affectifs
                                  </p>
                                  <ul className="space-y-2">
                                    {project.objectifs_affectifs.map((objectif, index) => (
                                      <li 
                                        key={index} 
                                        className="text-lg leading-relaxed pl-4"
                                        style={{ 
                                          fontFamily: "'Oswald', sans-serif",
                                          color: '#F0F0F0',
                                          position: 'relative'
                                        }}
                                      >
                                        <span style={{ position: 'absolute', left: 0 }}>•</span>
                                        {objectif}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* Objectifs conatifs */}
                              {project.objectifs_conatifs && project.objectifs_conatifs.length > 0 && (
                                <div>
                                  <p 
                                    className="text-base mb-2 uppercase tracking-wider" 
                                    style={{ 
                                      fontFamily: "'Oswald', sans-serif",
                                      color: '#00f3ff',
                                    }}
                                  >
                                    Conatifs
                                  </p>
                                  <ul className="space-y-2">
                                    {project.objectifs_conatifs.map((objectif, index) => (
                                      <li 
                                        key={index} 
                                        className="text-lg leading-relaxed pl-4"
                                        style={{ 
                                          fontFamily: "'Oswald', sans-serif",
                                          color: '#F0F0F0',
                                          position: 'relative'
                                        }}
                                      >
                                        <span style={{ position: 'absolute', left: 0 }}>•</span>
                                        {objectif}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Galerie d'images */}
                {project.gallery && project.gallery.length > 0 && (
                  <div className="border border-white/40 bg-[#050505]/80 backdrop-blur-sm rounded-lg p-6 mb-8">
                    <NeonTitle as="h3" className="text-3xl font-bold uppercase mb-4" filled noAnimation>
                      Galerie
                    </NeonTitle>
                    <ProjectGallery 
                      gallery={project.gallery}
                      title=""
                      defaultLayout="justified"
                      showLayoutSwitcher={false}
                      className=""
                    />
                  </div>
                )}

                {/* Section Preuves */}
                {project.preuves && project.preuves.length > 0 && (
                  <div className="border border-white/40 bg-[#050505]/80 backdrop-blur-sm rounded-lg p-6 mb-8">
                    <NeonTitle as="h3" className="text-3xl font-bold uppercase mb-6" filled noAnimation>
                      Preuves
                    </NeonTitle>
                    <div className="space-y-6">
                      {project.preuves.map((preuve, index) => (
                        <div key={index} className="border border-white/20 bg-white/5 rounded-lg p-4">
                          {/* Description */}
                          {preuve.description && (
                            <p className="text-sm font-medium uppercase tracking-wider mb-3 text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>
                              {preuve.description}
                            </p>
                          )}
                          
                          {/* Contenu selon le type */}
                          {preuve.type === 'Video' && preuve.youtube_url && (
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                              <iframe
                                className="absolute top-0 left-0 w-full h-full rounded"
                                src={getYoutubeEmbedUrl(preuve.youtube_url)}
                                title={preuve.description}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          )}
                          
                          {preuve.type === 'Image' && preuve.file && (
                            <div className="relative w-full">
                              <Image
                                src={preuve.file}
                                alt={preuve.description}
                                width={800}
                                height={600}
                                className="w-full h-auto rounded"
                              />
                            </div>
                          )}
                          
                          {preuve.type === 'PDF' && preuve.pdf && (() => {
                            const pdfUrl = fixCloudinaryPdfUrl(preuve.pdf)
                            const previewUrl = isCloudinaryPdf(pdfUrl) ? getCloudinaryPdfPreviewUrl(preuve.pdf) : ''
                            return (
                              <div className="space-y-3">
                                {previewUrl && (
                                  <div className="relative w-full rounded overflow-hidden">
                                    <img
                                      src={previewUrl}
                                      alt={preuve.description}
                                      className="w-full h-auto"
                                    />
                                  </div>
                                )}
                                <Button asChild className="w-full border-2 border-[#F0F0F0] hover:bg-[#F0F0F0] hover:text-[#050505] transition-all" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                  <Link href={pdfUrl} target="_blank">
                                    <Download className="mr-2 h-4 w-4" />
                                    Télécharger le PDF
                                  </Link>
                                </Button>
                              </div>
                            )
                          })()}
                          
                          {preuve.type === 'URL' && preuve.url && (
                            <Button asChild className="w-full border-2 border-[#F0F0F0] hover:bg-[#F0F0F0] hover:text-[#050505] transition-all" style={{ fontFamily: "'Oswald', sans-serif" }}>
                              <Link href={preuve.url} target="_blank">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Voir le lien
                              </Link>
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Sidebar avec informations */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="lg:col-span-1"
              >
                <div className="sticky top-24 border border-white/40 bg-[#050505]/80 backdrop-blur-sm rounded-lg p-6">
                  <NeonTitle as="h3" className="text-2xl font-bold mb-4 uppercase" filled noAnimation>
                    Informations
                  </NeonTitle>
                
                  <div className="space-y-4">
                    {/* Date */}
                    <div className="flex items-start gap-3 p-3 border border-white/10 bg-white/5">
                      <Calendar className="h-5 w-5 mt-1 text-white" />
                      <div>
                        <p className="text-sm font-medium uppercase tracking-wider mb-1 text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>Date</p>
                        <p className="text-sm text-white">
                          {new Date(project.date).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Annonceur */}
                    {project.annonceur && (
                      <div className="flex items-start gap-3 p-3 border border-white/10 bg-white/5">
                        <div>
                          <p className="text-sm font-medium uppercase tracking-wider mb-1 text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>Client</p>
                          <p className="text-sm text-white">{project.annonceur}</p>
                        </div>
                      </div>
                    )}

                    {/* Contexte */}
                    {project.contexte && (
                      <div className="flex items-start gap-3 p-3 border border-white/10 bg-white/5">
                        <div>
                          <p className="text-sm font-medium uppercase tracking-wider mb-1 text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>Contexte</p>
                          <p className="text-sm text-white">{project.contexte}</p>
                        </div>
                      </div>
                    )}

                    {/* Durée */}
                    {project.duration && (
                      <div className="flex items-start gap-3 p-3 border border-white/10 bg-white/5">
                        <div>
                          <p className="text-sm font-medium uppercase tracking-wider mb-1 text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>Durée</p>
                          <p className="text-sm text-white">{project.duration}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Technologies/Outils */}
                  {project.tools && project.tools.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <h4 className="text-sm font-bold mb-3 uppercase tracking-wider text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.tools.map((tool) => (
                          <Badge key={tool} className="text-xs border border-white/20 bg-white/5 uppercase" style={{ fontFamily: "'Oswald', sans-serif" }}>
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-7xl mx-auto mt-16"
          >
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              {/* Projet précédent */}
              <div className="flex-1">
                {previousProject ? (
                  <Button variant="outline" asChild className="h-auto p-4 w-full justify-start border-2 border-white/40 bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white">
                    <Link href={`/projects/${previousProject.slug}`}>
                      <div className="flex items-center gap-3">
                        <ChevronLeft className="h-5 w-5 flex-shrink-0 text-white" />
                        <div className="text-left">
                          <p className="text-xs text-white/70 mb-1 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>Précédent</p>
                          <p className="font-medium text-sm text-white">{previousProject.title}</p>
                        </div>
                      </div>
                    </Link>
                  </Button>
                ) : (
                  <div></div>
                )}
              </div>

              {/* Retour à la grille */}
              <Button variant="ghost" asChild className="border-2 border-white/40 bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white uppercase tracking-widest" style={{ fontFamily: "'Oswald', sans-serif" }}>
                <Link href="/projects">
                  Tous
                </Link>
              </Button>

              {/* Projet suivant */}
              <div className="flex-1 flex justify-end">
                {nextProject ? (
                  <Button variant="outline" asChild className="h-auto p-4 w-full justify-end border-2 border-white/40 bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white">
                    <Link href={`/projects/${nextProject.slug}`}>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs text-white/70 mb-1 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>Suivant</p>
                          <p className="font-medium text-sm text-white">{nextProject.title}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 flex-shrink-0 text-white" />
                      </div>
                    </Link>
                  </Button>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
