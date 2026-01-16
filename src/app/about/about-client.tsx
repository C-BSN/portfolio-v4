"use client"

import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Mail, Download, User, Palette, Zap, Code, ExternalLink, Calendar } from "lucide-react"
import { CursorGlow } from "@/components/effects"

interface Page {
  title: string
  subtitle?: string
  description?: string
  hero_image?: string
  cta_text?: string
  profile_image?: string
  skills?: string[]
  stats?: {
    years: { value: string; label: string }
    projects: { value: string; label: string }
  }
  availability?: {
    status: boolean
    message: string
  }
  cta_buttons?: {
    contact: {
      text: string
      email: string
      icon: string
    }
    cv: {
      text: string
      file_url: string
      icon: string
    }
  }
  final_cta?: {
    title: string
    description_line1: string
    description_line2: string
    buttons: {
      projects: {
        text: string
        link: string
        icon: string
      }
      contact: {
        text: string
        email: string
        icon: string
      }
      calendly?: {
        text: string
        link: string
        icon: string
      }
    }
  }
  body: string
}

interface AboutClientProps {
  pageData: Page
}

export default function AboutClient({ pageData }: AboutClientProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Effet de souris pour le curseur glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Animation de pluie cyberpunk
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()

    const drops: Array<{
      id: number
      x: number
      y: number
      speed: number
      length: number
      opacity: number
    }> = []
    
    const dropCount = 100
    for (let i = 0; i < dropCount; i++) {
      drops.push({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        speed: Math.random() * 8 + 4,
        length: Math.random() * 30 + 10,
        opacity: Math.random() * 0.6 + 0.2
      })
    }

    let lastTime = 0
    const targetFPS = 30
    const frameTime = 1000 / targetFPS
    let animationRef: number | null = null

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameTime) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        drops.forEach(drop => {
          drop.y += drop.speed

          if (drop.y > canvas.height + drop.length) {
            drop.y = -drop.length
            drop.x = Math.random() * canvas.width
            drop.speed = Math.random() * 8 + 4
          }

          const gradient = ctx.createLinearGradient(drop.x, drop.y, drop.x, drop.y + drop.length)
          gradient.addColorStop(0, `rgba(0, 255, 255, 0)`)
          gradient.addColorStop(0.5, `rgba(0, 255, 255, ${drop.opacity})`)
          gradient.addColorStop(1, `rgba(255, 0, 255, ${drop.opacity * 0.7})`)

          ctx.strokeStyle = gradient
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(drop.x, drop.y)
          ctx.lineTo(drop.x, drop.y + drop.length)
          ctx.stroke()

          ctx.shadowColor = '#00ffff'
          ctx.shadowBlur = 3
          ctx.strokeStyle = `rgba(0, 255, 255, ${drop.opacity * 0.3})`
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(drop.x, drop.y)
          ctx.lineTo(drop.x, drop.y + drop.length)
          ctx.stroke()
          ctx.shadowBlur = 0
        })

        lastTime = currentTime
      }

      animationRef = requestAnimationFrame(animate)
    }

    animationRef = requestAnimationFrame(animate)

    return () => {
      if (animationRef) {
        cancelAnimationFrame(animationRef)
      }
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  // Fonction pour séparer le contenu en sections thématiques
  const getSections = (content: string) => {
    const sections = content.split('## ').filter(section => section.trim())
    
    return sections.map((section, index) => {
      const lines = section.split('\n').filter(line => line.trim())
      const title = lines[0]
      const content = lines.slice(1).join('\n')
      
      return { title, content, index }
    })
  }

  // Fonction pour obtenir l'icône et la couleur selon le titre de section
  const getSectionStyle = (title: string) => {
    const titleLower = title.toLowerCase()
    
    if (titleLower.includes('qui suis-je') || titleLower.includes('qui suis')) {
      return {
        icon: <User className="h-6 w-6" />,
        gradient: 'from-cyan-500 to-blue-600',
        borderColor: 'border-cyan-400/50',
        iconColor: 'text-cyan-400'
      }
    } else if (titleLower.includes('philosophie')) {
      return {
        icon: <Palette className="h-6 w-6" />,
        gradient: 'from-purple-500 to-pink-600',
        borderColor: 'border-purple-400/50',
        iconColor: 'text-purple-400'
      }
    } else if (titleLower.includes('processus')) {
      return {
        icon: <Zap className="h-6 w-6" />,
        gradient: 'from-pink-500 to-orange-600',
        borderColor: 'border-pink-400/50',
        iconColor: 'text-pink-400'
      }
    } else if (titleLower.includes('collaboration')) {
      return {
        icon: <Code className="h-6 w-6" />,
        gradient: 'from-green-500 to-teal-600',
        borderColor: 'border-green-400/50',
        iconColor: 'text-green-400'
      }
    } else {
      return {
        icon: <User className="h-6 w-6" />,
        gradient: 'from-gray-500 to-slate-600',
        borderColor: 'border-gray-400/50',
        iconColor: 'text-gray-400'
      }
    }
  }

  // Fonction pour rendre une section individuelle
  const renderSection = (section: { title: string; content: string; index: number }) => {
    const style = getSectionStyle(section.title)
    
    // Traitement spécial pour "Mon processus créatif"
    if (section.title.toLowerCase().includes('processus créatif')) {
      const steps: { num: number; title: string; desc: string }[] = []
      const stepLines = section.content.split('\n').filter(line => line.trim().match(/^\d+\./))
      
      stepLines.forEach(line => {
        // Nouveau format : "1. **Titre →** Description" ou "1. **Titre** **→** Description"
        const match1 = line.match(/^(\d+)\.\s\*\*(.*?)\s→\*\*\s(.*)/)
        const match2 = line.match(/^(\d+)\.\s\*\*(.*?)\*\*\s\*\*→\*\*\s(.*)/)
        const match3 = line.match(/^(\d+)\.\s\*\*(.*?)\*\*\s→\s(.*)/)
        
        const match = match1 || match2 || match3
        if (match) {
          const [, num, stepTitle, desc] = match
          steps.push({ num: parseInt(num), title: stepTitle.trim(), desc: desc.trim() })
        }
      })

      return (
        <Card key={section.index} className={`cyberpunk-card bg-gradient-to-br from-black/70 to-slate-900/50 backdrop-blur-md ${style.borderColor} shadow-lg hover:shadow-pink-400/30 transition-all duration-500`}>
          <CardContent className="p-8">
            {/* En-tête de section avec icône */}
            <div className="flex items-center gap-4 mb-8">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${style.gradient} ${style.iconColor}`}>
                {style.icon}
              </div>
              <h2 className={`text-2xl font-bold ${style.iconColor} cyberpunk-heading font-mono`}>
                <span className="text-pink-400">[</span> {section.title} <span className="text-pink-400">]</span>
              </h2>
            </div>

            {steps.length > 0 ? (
              <div className="relative">
                {/* Ligne de connexion principale - cachée sur mobile */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-400 transform -translate-x-1/2 z-0"></div>
                
                <div className="space-y-8">
                  {steps.map((step, stepIndex) => (
                    <div key={stepIndex} className={`relative flex items-center ${stepIndex % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} md:${stepIndex % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} flex-col md:flex-row group`}>
                      {/* Numéro central avec effet glow - adapté mobile */}
                      <div className="relative md:absolute left-1/2 top-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 z-10 mb-4 md:mb-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-black via-slate-900 to-black border-2 border-cyan-400 rounded-full flex items-center justify-center relative overflow-hidden group-hover:border-pink-400 transition-all duration-300 mx-auto">
                          <span className="text-xl font-bold text-cyan-400 font-mono group-hover:text-pink-400 transition-colors duration-300">
                            {step.num.toString().padStart(2, '0')}
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                        </div>
                      </div>

                      {/* Carte du processus - responsive et plus large */}
                      <div className={`w-full md:w-6/12 lg:w-5/12 xl:w-4/12 ${stepIndex % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                        <div className="bg-gradient-to-br from-black/80 to-slate-900/60 backdrop-blur-md border border-cyan-400/30 rounded-lg p-6 group-hover:border-pink-400/50 transition-all duration-300 relative overflow-hidden">
                          {/* Effet de scan */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                          
                          <h3 className="text-lg font-bold text-cyan-400 mb-3 font-mono group-hover:text-pink-400 transition-colors duration-300">
                            {step.title}
                          </h3>
                          <p className="text-gray-300 leading-relaxed text-sm">
                            {step.desc}
                          </p>

                          {/* Flèche de connexion - cachée sur mobile */}
                          <div className={`hidden md:block absolute top-1/2 ${stepIndex % 2 === 0 ? 'right-0 translate-x-full' : 'left-0 -translate-x-full'} transform -translate-y-1/2`}>
                            <div className={`w-8 h-0.5 bg-gradient-to-r ${stepIndex % 2 === 0 ? 'from-cyan-400 to-transparent' : 'from-transparent to-cyan-400'} group-hover:from-pink-400 group-hover:to-pink-400/50 transition-all duration-300`}></div>
                          </div>

                          {/* Indicateurs de progression */}
                          <div className="absolute top-2 right-2">
                            <div className="flex space-x-1">
                              {Array.from({length: 7}, (_, i) => (
                                <div 
                                  key={i} 
                                  className={`w-1.5 h-1.5 rounded-full ${i < step.num ? 'bg-cyan-400' : 'bg-gray-600'} group-hover:bg-pink-400 transition-all duration-300`}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Effet de particules flottantes */}
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({length: 6}, (_, i) => (
                    <div 
                      key={i}
                      className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30 animate-pulse"
                      style={{
                        left: `${20 + (i * 15)}%`,
                        top: `${10 + (i * 20)}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: `${2 + (i * 0.3)}s`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-300 leading-relaxed">
                {section.content.split('\n').map((line, lineIndex) => {
                  if (line.trim()) {
                    return (
                      <p key={lineIndex} className="leading-relaxed mb-4">
                        {line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-400 font-mono">$1</strong>')
                             .split('<strong class="text-cyan-400 font-mono">').map((part, i) => 
                          i % 2 === 0 ? part : <strong key={i} className="text-cyan-400 font-mono">{part.replace('</strong>', '')}</strong>
                        )}
                      </p>
                    )
                  }
                  return null
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )
    }
    
    // Rendu normal pour les autres sections
    return (
      <Card key={section.index} className={`cyberpunk-card bg-gradient-to-br from-black/70 to-slate-900/50 backdrop-blur-md ${style.borderColor} shadow-lg hover:shadow-${style.iconColor.split('-')[1]}-400/30 transition-all duration-500`}>
        <CardContent className="p-8">
          {/* En-tête de section avec icône */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${style.gradient} text-white`}>
              {style.icon}
            </div>
            <h2 className={`text-2xl font-bold ${style.iconColor} cyberpunk-heading font-mono`}>
              <span className="text-pink-400">[</span> {section.title} <span className="text-pink-400">]</span>
            </h2>
          </div>
          
          {/* Contenu de la section */}
          <div className="text-gray-300 leading-relaxed">
            {section.content.split('\n').map((line, lineIndex) => {
              if (line.trim()) {
                return (
                  <p key={lineIndex} className="leading-relaxed mb-4">
                    {line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-400 font-mono">$1</strong>')
                         .split('<strong class="text-cyan-400 font-mono">').map((part, i) => 
                      i % 2 === 0 ? part : <strong key={i} className="text-cyan-400 font-mono">{part.replace('</strong>', '')}</strong>
                    )}
                  </p>
                )
              }
              return null
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 w-full h-full"
        style={{
          backgroundImage: "url(/Cyberpunk-apropos.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      />
      
      {/* Overlay sombre pour la lisibilité - ne couvre pas le footer */}
      <div className="absolute inset-0 z-[1] bg-black/50" />

      {/* Rain Effect Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[2] opacity-40" />

      {/* Cursor Glow Effect */}
      <CursorGlow 
        className="fixed pointer-events-none z-50 rounded-full blur-3xl transition-all duration-300 opacity-30"
        size={384}
        colors={["#ff00ff", "#00ffff"]}
      />

      <div className="relative z-[10] min-h-screen py-12">
        <div className="max-w-7xl mx-auto w-full px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header cyberpunk */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent cyberpunk-title font-mono">
                {pageData.title}
              </h1>
              <p className="text-xl text-cyan-300 max-w-2xl mx-auto font-mono mb-8">
                &gt; Découvrez mon parcours, mes compétences et ma passion pour le design graphique
              </p>
              
              {/* Indicateur de progression de lecture */}
              <div className="hidden md:flex justify-center items-center space-x-4 mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-cyan-400 font-mono">PROFIL</span>
                </div>
                <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className="text-xs text-purple-400 font-mono">PHILOSOPHIE</span>
                </div>
                <div className="w-8 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                  <span className="text-xs text-pink-400 font-mono">PROCESSUS</span>
                </div>
                <div className="w-8 h-0.5 bg-gradient-to-r from-pink-400 to-green-400"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-green-400 font-mono">COLLABORATION</span>
                </div>
              </div>
              
              {/* Version mobile simplifiée */}
              <div className="md:hidden flex justify-center mb-8">
                <div className="flex space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Photo de profil et infos - Style cyberpunk */}
              <div className="lg:col-span-1 order-1 lg:order-1">
                <Card className="cyberpunk-card bg-black/60 backdrop-blur-md border-cyan-400/50 shadow-lg hover:shadow-cyan-400/30 transition-all duration-500 h-full">
                  <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                    {/* Section supérieure */}
                    <div className="flex-1 flex flex-col justify-start">
                      {/* Avatar cyberpunk */}
                      <div className="relative w-32 h-32 mx-auto mb-6 cyberpunk-avatar">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-purple-500/30 rounded-full animate-pulse" />
                        <div className="absolute inset-1 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
                        
                        {pageData.profile_image ? (
                          <div className="absolute inset-3 rounded-full overflow-hidden border-2 border-cyan-400">
                            <img
                              src={pageData.profile_image}
                              alt="Photo de profil"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="absolute inset-3 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full border-2 border-cyan-400 flex items-center justify-center">
                            <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                              P
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 border-2 border-transparent border-t-cyan-400 rounded-full animate-spin" style={{ animationDuration: "3s" }} />
                      </div>
                      
                      <h2 className="text-xl font-semibold mb-6 text-white font-mono">
                        <span className="text-cyan-400">[</span> {pageData.subtitle || "Graphiste Freelance"} <span className="text-cyan-400">]</span>
                      </h2>
                    </div>
                    
                    {/* Section centrale - Compétences et infos */}
                    <div className="flex-1 flex flex-col justify-center mb-6 space-y-6">
                      {/* Statistiques rapides */}
                      {pageData.stats && (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-cyan-400 font-mono">{pageData.stats.years.value}</div>
                            <div className="text-xs text-gray-400 font-mono">{pageData.stats.years.label}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400 font-mono">{pageData.stats.projects.value}</div>
                            <div className="text-xs text-gray-400 font-mono">{pageData.stats.projects.label}</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Compétences */}
                      <div>
                        <h3 className="text-sm font-semibold mb-4 text-pink-400 uppercase tracking-wide font-mono">
                          &gt; COMPÉTENCES_
                        </h3>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {pageData.skills?.map((skill) => (
                            <Badge key={skill} className="cyberpunk-skill bg-gradient-to-r from-cyan-400/20 to-purple-500/20 border-cyan-400/50 text-cyan-300 hover:text-white text-xs font-mono">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Status en ligne */}
                      {pageData.availability && pageData.availability.status && (
                        <div className="flex items-center justify-center space-x-2 text-green-400">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs font-mono">{pageData.availability.message}</span>
                        </div>
                      )}
                    </div>

                    {/* Section inférieure - Actions */}
                    <div className="flex-shrink-0">
                      <div className="space-y-3">
                        {pageData.cta_buttons?.contact && (
                          <Button asChild className="w-full cyberpunk-btn-primary bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold font-mono hover:shadow-lg hover:shadow-cyan-500/25">
                            <Link href={`mailto:${pageData.cta_buttons.contact.email}`}>
                              <Mail className="mr-2 h-4 w-4" />
                              {pageData.cta_buttons.contact.text}
                            </Link>
                          </Button>
                        )}
                        {pageData.cta_buttons?.cv && (
                          <Button asChild variant="outline" className="w-full cyberpunk-btn border-pink-400/50 text-pink-400 hover:bg-pink-500/20 font-mono">
                            <Link href={pageData.cta_buttons.cv.file_url} target="_blank" rel="noopener noreferrer">
                              <Download className="mr-2 h-4 w-4" />
                              {pageData.cta_buttons.cv.text}
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contenu principal cyberpunk - Sections réorganisées */}
              <div className="lg:col-span-2 space-y-6 lg:space-y-8 order-2 lg:order-2">
                {/* Rendu des sections dans l'ordre logique */}
                {getSections(pageData.body).map(section => {
                  const titleLower = section.title.toLowerCase()
                  
                  // Rendre seulement "Qui suis-je" dans cette colonne
                  if (titleLower.includes('qui suis-je') || titleLower.includes('qui suis')) {
                    return renderSection(section)
                  }
                  return null
                })}
              </div>
            </div>

            {/* Section Philosophie en pleine largeur */}
            <div className="mt-8 lg:mt-12 section-container">
              {getSections(pageData.body).map(section => {
                if (section.title.toLowerCase().includes('philosophie')) {
                  return (
                    <div key={section.index} className="max-w-5xl mx-auto section-philosophie">
                      {renderSection(section)}
                    </div>
                  )
                }
                return null
              })}
            </div>

            {/* Section Processus Créatif en pleine largeur */}
            <div className="mt-8 lg:mt-12 section-container">
              {getSections(pageData.body).map(section => {
                if (section.title.toLowerCase().includes('processus créatif')) {
                  return (
                    <div key={section.index} className="max-w-7xl mx-auto section-processus">
                      {renderSection(section)}
                    </div>
                  )
                }
                return null
              })}
            </div>

            {/* Section Collaborations et CTA */}
            <div className="mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto section-container">
              {/* Collaborations */}
              <div className="section-collaboration">
                {getSections(pageData.body).map(section => {
                  if (section.title.toLowerCase().includes('collaboration')) {
                    return renderSection(section)
                  }
                  return null
                })}
              </div>

              {/* CTA Section avec style cyberpunk */}
              <div>
                <Card className="cyberpunk-card bg-gradient-to-r from-black/70 to-purple-900/50 backdrop-blur-md border-pink-400/50 shadow-lg h-full">
                  <CardContent className="p-8 text-center h-full flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-4 text-pink-400 font-mono cyberpunk-heading">
                      {pageData.final_cta?.title || "PROJECT.INITIALIZE()"}
                    </h3>
                    <p className="text-gray-300 mb-6 font-mono">
                      <span className="text-cyan-400">&gt;</span> {pageData.final_cta?.description_line1 || "Ready to create something extraordinary together?"}
                      <br />
                      <span className="text-purple-400">&gt;</span> {pageData.final_cta?.description_line2 || "Initialize collaboration protocol..."}
                    </p>
                    <div className="flex flex-col gap-4 justify-center">
                      {pageData.final_cta?.buttons?.projects && (
                        <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold cyberpunk-btn-primary font-mono hover:shadow-lg hover:shadow-cyan-500/25">
                          <Link href={pageData.final_cta.buttons.projects.link}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            {pageData.final_cta.buttons.projects.text}
                          </Link>
                        </Button>
                      )}
                      {pageData.final_cta?.buttons?.calendly && (
                        <Button asChild size="lg" className="bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold cyberpunk-btn-primary font-mono hover:shadow-lg hover:shadow-green-500/25">
                          <Link href={pageData.final_cta.buttons.calendly.link} target="_blank" rel="noopener noreferrer">
                            <Calendar className="mr-2 h-4 w-4" />
                            {pageData.final_cta.buttons.calendly.text}
                          </Link>
                        </Button>
                      )}
                      {pageData.final_cta?.buttons?.contact && (
                        <Button asChild variant="outline" size="lg" className="border-pink-400/50 text-pink-400 hover:bg-pink-500/20 cyberpunk-btn font-mono">
                          <Link href={`mailto:${pageData.final_cta.buttons.contact.email}`}>
                            <Mail className="mr-2 h-4 w-4" />
                            {pageData.final_cta.buttons.contact.text}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        
        .font-mono {
          font-family: 'Orbitron', monospace;
        }
        
        body {
          font-family: 'Orbitron', monospace;
        }
        
        /* Cyberpunk Effects - Version optimisée */
        .cyberpunk-card {
          position: relative;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        }
        
        .cyberpunk-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(6, 182, 212, 0.3);
        }
        
        .cyberpunk-title {
          position: relative;
          text-shadow: 0 0 15px rgba(6, 182, 212, 0.5);
          animation: title-glow 3s ease-in-out infinite alternate;
        }
        
        @keyframes title-glow {
          0% { 
            text-shadow: 0 0 15px rgba(6, 182, 212, 0.5);
          }
          100% { 
            text-shadow: 0 0 25px rgba(147, 51, 234, 0.6);
          }
        }
        
        .cyberpunk-heading {
          position: relative;
          text-shadow: 0 0 10px currentColor;
        }
        
        .cyberpunk-skill {
          position: relative;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }
        
        .cyberpunk-skill:hover {
          transform: scale(1.05);
        }
        
        .cyberpunk-btn {
          position: relative;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }
        
        .cyberpunk-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(6, 182, 212, 0.4);
        }
        
        .cyberpunk-btn-primary {
          position: relative;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4);
        }
        
        .cyberpunk-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(6, 182, 212, 0.5);
        }
        
        /* Amélioration de l'ergonomie et du flux de lecture */
        .section-container {
          transition: all 0.3s ease;
        }
        
        .section-container:hover {
          transform: translateY(-2px);
        }
        
        /* Effet de progression visuelle */
        .section-philosophie {
          border-left: 4px solid rgba(147, 51, 234, 0.5);
          padding-left: 2rem;
        }
        
        .section-processus {
          border-left: 4px solid rgba(236, 72, 153, 0.5);
          padding-left: 2rem;
        }
        
        .section-collaboration {
          border-left: 4px solid rgba(16, 185, 129, 0.5);
          padding-left: 2rem;
        }
        
        /* Responsive optimizations */
        @media (max-width: 768px) {
          .cyberpunk-card {
            backdrop-filter: blur(5px);
          }
          
          .cyberpunk-title {
            animation: none;
            text-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
          }
          
          /* Adaptations pour les cartes de sections sur mobile */
          .cyberpunk-card .flex.items-center.gap-4 {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 1rem;
          }
          
          .cyberpunk-card .flex.items-center.gap-4 h2 {
            font-size: 1.5rem;
          }
          
          /* Ajustements pour le processus créatif sur mobile */
          .space-y-8 > div {
            margin-bottom: 2rem;
          }
          
          /* Suppression des bordures gauches sur mobile */
          .section-philosophie,
          .section-processus,
          .section-collaboration {
            border-left: none;
            padding-left: 0;
          }
        }
      `}</style>
    </div>
  )
}
