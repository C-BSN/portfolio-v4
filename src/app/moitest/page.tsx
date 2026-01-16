"use client"

import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Mail, Download, User, Palette, Zap, Code, ExternalLink } from "lucide-react"
import { GlassRainEffect } from "@/components/effects"

// Note: metadata export removed because this is a client component ("use client")
// Note: getPageData removed because fs module cannot be used in client components

export default function MoiTestPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showGlassEffect, setShowGlassEffect] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Données statiques pour le bac à sable cyberpunk
  const pageData = {
    title: "À propos de moi - BAC À SABLE",
    profile_image: "/Cocorentin.jpg",
    skills: [
      "Adobe Creative Suite",
      "Figma", 
      "Sketch",
      "Photographie",
      "Illustration",
      "Branding",
      "Web Design",
      "Print Design"
    ],
    body: `## Qui suis-je ?

Graphiste freelance depuis plus de 5 ans, je me spécialise dans la création d'identités visuelles fortes et mémorables. Ma formation en arts appliqués et mon expérience en agence m'ont permis de développer une approche méthodique et créative du design.

## Ma philosophie

Je crois que chaque projet a sa propre personnalité et mérite une approche unique. Mon rôle est de comprendre vos besoins, votre audience et vos objectifs pour créer des solutions visuelles qui vous démarquent.

## Mon processus créatif

1. **Écoute et analyse** : Comprendre votre projet et vos attentes
2. **Recherche et inspiration** : Explorer les tendances et références  
3. **Conception** : Développer les concepts créatifs
4. **Itération** : Affiner et perfectionner les créations
5. **Livraison** : Finaliser et décliner sur tous supports

## Collaborations

J'ai eu le plaisir de travailler avec des startups innovantes, des PME dynamiques et des associations engagées. Chaque collaboration est une opportunité d'apprendre et de créer quelque chose d'unique.

Prêt(e) à donner vie à votre projet ? Contactons-nous !`
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize rain drops (same as homepage)
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

          // Reset drop when it goes off screen
          if (drop.y > canvas.height + drop.length) {
            drop.y = -drop.length
            drop.x = Math.random() * canvas.width
            drop.speed = Math.random() * 8 + 4
          }

          // Draw rain drop with neon effect (same as homepage)
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

          // Add glow effect
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
      
      {/* Overlay sombre pour la lisibilité */}
      <div className="fixed inset-0 z-[1] bg-black/60" />

      {/* Rain Effect Canvas - Simple version */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[2] opacity-40" />

      <div className="relative z-[10] min-h-screen py-12">
        <div className="max-w-7xl mx-auto w-full px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header avec indication bac à sable */}
            <div className="text-center mb-16">
              <div className="inline-block px-6 py-3 bg-black/40 backdrop-blur-md border border-cyan-400/50 text-cyan-400 rounded-full text-sm font-mono mb-8 cyberpunk-badge">
                <span className="animate-pulse">🧪</span> BAC À SABLE - CYBERPUNK MODE
              </div>
              

              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent cyberpunk-title font-mono">
                {pageData.title}
              </h1>
              <p className="text-xl text-cyan-300 max-w-2xl mx-auto font-mono">
                &gt; Interface expérimentale cyberpunk pour la page À propos
              </p>
            </div>



            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Photo de profil et infos - Style cyberpunk */}
              <div className="lg:col-span-1">
                <Card className="cyberpunk-card bg-black/60 backdrop-blur-md border-cyan-400/50 shadow-lg hover:shadow-cyan-400/30 transition-all duration-500">
                  <CardContent className="p-6 text-center">
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
                    
                    <h2 className="text-xl font-semibold mb-4 text-white font-mono">
                      <span className="text-cyan-400">&gt;</span> Graphiste Freelance
                    </h2>
                    
                    {/* Compétences */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold mb-3 text-purple-400 uppercase tracking-wide font-mono">
                        SKILLS.ARRAY[]
                      </h3>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {pageData.skills?.map((skill, index) => (
                          <Badge 
                            key={skill} 
                            className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-400/50 hover:border-cyan-400/80 transition-all duration-300 cyberpunk-skill font-mono text-xs"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <Button asChild className="w-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/30 cyberpunk-btn font-mono">
                        <Link href="mailto:corentinbassonpro@gmail.com">
                          <Mail className="mr-2 h-4 w-4" />
                          CONTACT.INIT()
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full border-purple-400/50 text-purple-300 hover:bg-purple-500/20 cyberpunk-btn font-mono">
                        <Download className="mr-2 h-4 w-4" />
                        DOWNLOAD.CV
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contenu principal */}
              <div className="lg:col-span-2">
                <div className="space-y-8">
                  {/* Zone de contenu avec style cyberpunk */}
                  <Card className="cyberpunk-card bg-black/60 backdrop-blur-md border-purple-400/50 shadow-lg">
                    <CardContent className="p-8">
                      <div className="space-y-8">
                        <div>
                          <h2 className="text-2xl font-bold mb-4 text-cyan-400 cyberpunk-heading font-mono">
                            <span className="text-pink-400">[</span> Qui suis-je ? <span className="text-pink-400">]</span>
                          </h2>
                          <p className="text-gray-300 leading-relaxed">
                            Graphiste freelance depuis plus de 5 ans, je me spécialise dans la création d'identités visuelles fortes et mémorables. Ma formation en arts appliqués et mon expérience en agence m'ont permis de développer une approche méthodique et créative du design.
                          </p>
                        </div>
                        
                        <div>
                          <h2 className="text-2xl font-bold mb-4 text-purple-400 cyberpunk-heading font-mono">
                            <span className="text-cyan-400">[</span> Ma philosophie <span className="text-cyan-400">]</span>
                          </h2>
                          <p className="text-gray-300 leading-relaxed">
                            Je crois que chaque projet a sa propre personnalité et mérite une approche unique. Mon rôle est de comprendre vos besoins, votre audience et vos objectifs pour créer des solutions visuelles qui vous démarquent.
                          </p>
                        </div>
                        
                        <div>
                          <h2 className="text-2xl font-bold mb-4 text-pink-400 cyberpunk-heading font-mono">
                            <span className="text-purple-400">[</span> Mon processus créatif <span className="text-purple-400">]</span>
                          </h2>
                          <ol className="space-y-3 text-gray-300">
                            <li className="flex items-start">
                              <span className="text-cyan-400 font-mono mr-2">01.</span>
                              <div><strong className="text-cyan-400">Écoute et analyse</strong> : Comprendre votre projet et vos attentes</div>
                            </li>
                            <li className="flex items-start">
                              <span className="text-purple-400 font-mono mr-2">02.</span>
                              <div><strong className="text-purple-400">Recherche et inspiration</strong> : Explorer les tendances et références</div>
                            </li>
                            <li className="flex items-start">
                              <span className="text-pink-400 font-mono mr-2">03.</span>
                              <div><strong className="text-pink-400">Conception</strong> : Développer les concepts créatifs</div>
                            </li>
                            <li className="flex items-start">
                              <span className="text-cyan-400 font-mono mr-2">04.</span>
                              <div><strong className="text-cyan-400">Itération</strong> : Affiner et perfectionner les créations</div>
                            </li>
                            <li className="flex items-start">
                              <span className="text-purple-400 font-mono mr-2">05.</span>
                              <div><strong className="text-purple-400">Livraison</strong> : Finaliser et décliner sur tous supports</div>
                            </li>
                          </ol>
                        </div>
                        
                        <div>
                          <h2 className="text-2xl font-bold mb-4 text-cyan-400 cyberpunk-heading font-mono">
                            <span className="text-pink-400">[</span> Collaborations <span className="text-pink-400">]</span>
                          </h2>
                          <p className="text-gray-300 leading-relaxed">
                            J'ai eu le plaisir de travailler avec des startups innovantes, des PME dynamiques et des associations engagées. Chaque collaboration est une opportunité d'apprendre et de créer quelque chose d'unique.
                          </p>
                          <p className="text-pink-400 font-bold mt-4 font-mono">
                            &gt; Prêt(e) à donner vie à votre projet ? Contactons-nous !
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* CTA Section avec style cyberpunk */}
                  <Card className="cyberpunk-card bg-gradient-to-r from-black/70 to-purple-900/50 backdrop-blur-md border-pink-400/50 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <h3 className="text-2xl font-bold mb-4 text-pink-400 font-mono cyberpunk-heading">
                        PROJECT.INITIALIZE()
                      </h3>
                      <p className="text-gray-300 mb-6 font-mono">
                        <span className="text-cyan-400">&gt;</span> Ready to create something extraordinary together?
                        <br />
                        <span className="text-purple-400">&gt;</span> Initialize collaboration protocol...
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold cyberpunk-btn-primary font-mono hover:shadow-lg hover:shadow-cyan-500/25">
                          <Link href="/projects">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            VIEW.PROJECTS()
                          </Link>
                        </Button>
                        <Button variant="outline" size="lg" className="border-pink-400/50 text-pink-400 hover:bg-pink-500/20 cyberpunk-btn font-mono">
                          <Mail className="mr-2 h-4 w-4" />
                          START.PROJECT()
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
        .cyberpunk-badge {
          position: relative;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
        }
        
        .cyberpunk-badge:hover {
          transform: translateY(-1px);
          box-shadow: 0 5px 20px rgba(6, 182, 212, 0.4);
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
        
        .cyberpunk-heading {
          position: relative;
          text-shadow: 0 0 10px currentColor;
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
        
        /* Responsive optimizations */
        @media (max-width: 768px) {
          .cyberpunk-card {
            backdrop-filter: blur(5px);
          }
          
          .cyberpunk-title {
            animation: none;
            text-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
          }
        }
      `}</style>
    </div>
  )
}
