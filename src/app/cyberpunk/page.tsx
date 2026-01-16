"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, Github, Linkedin, Mail, ExternalLink, Code, Palette, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type RainDrop = {
  id: number
  x: number
  y: number
  speed: number
  length: number
  opacity: number
}

export default function CyberpunkPortfolio() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [rainDrops, setRainDrops] = useState<RainDrop[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rainCanvasRef = useRef<HTMLCanvasElement>(null)
  const sectionsRef = useRef<Array<HTMLElement | null>>([])
  const animationFrameRef = useRef<number | null>(null)
  const rainAnimationRef = useRef<number | null>(null)

  useEffect(() => {
    // Loading sequence
    const loadingTimer = setTimeout(() => {
      setIsLoaded(true)
    }, 1000)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    // Intersection Observer for section transitions
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionIndex = sectionsRef.current.indexOf(entry.target as HTMLElement)
            if (sectionIndex !== -1 && sectionIndex !== currentSection) {
              setIsTransitioning(true)
              setTimeout(() => {
                setCurrentSection(sectionIndex)
                setIsTransitioning(false)
              }, 300)
            }
          }
        })
      },
      { threshold: 0.5 },
    )

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      clearTimeout(loadingTimer)
      window.removeEventListener("mousemove", handleMouseMove)
      observer.disconnect()
    }
  }, [currentSection])

  // Optimized particle system
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

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      color: string
    }> = []

    const colors = ["#00ffff", "#ff00ff", "#ffff00", "#ff0080"]

    // Reduced particle count for better performance
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    let lastTime = 0
    const targetFPS = 60
    const frameTime = 1000 / targetFPS

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameTime) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        particles.forEach((particle, index) => {
          particle.x += particle.vx
          particle.y += particle.vy

          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

          // Optimized connection drawing - only check nearby particles
          for (let j = index + 1; j < particles.length; j++) {
            const otherParticle = particles[j]
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.hypot(dx, dy)

            if (distance < 80) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.strokeStyle = `rgba(0, 255, 255, ${0.08 * (1 - distance / 80)})`
              ctx.lineWidth = 1
              ctx.stroke()
            }
          }

          // Draw particle with glow
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = particle.color
          ctx.shadowBlur = 8
          ctx.shadowColor = particle.color
          const prevAlpha = ctx.globalAlpha
          ctx.globalAlpha = particle.opacity
          ctx.fill()
          ctx.globalAlpha = prevAlpha
          ctx.shadowBlur = 0
        })

        lastTime = currentTime
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  // Rain effect
  useEffect(() => {
    if (!isLoaded) return

    const rainCanvas = rainCanvasRef.current
    if (!rainCanvas) return

    const ctx = rainCanvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      rainCanvas.width = window.innerWidth
      rainCanvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize rain drops
    const drops: RainDrop[] = []
    for (let i = 0; i < 150; i++) {
      drops.push({
        id: i,
        x: Math.random() * rainCanvas.width,
        y: Math.random() * rainCanvas.height - rainCanvas.height,
        speed: Math.random() * 8 + 4,
        length: Math.random() * 30 + 10,
        opacity: Math.random() * 0.6 + 0.2
      })
    }

    setRainDrops(drops)

    let lastRainTime = 0
    const rainFPS = 60
    const rainFrameTime = 1000 / rainFPS

    const animateRain = (currentTime: number) => {
      if (currentTime - lastRainTime >= rainFrameTime) {
        ctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height)

        drops.forEach(drop => {
          drop.y += drop.speed

          // Reset drop when it goes off screen
          if (drop.y > rainCanvas.height + drop.length) {
            drop.y = -drop.length
            drop.x = Math.random() * rainCanvas.width
            drop.speed = Math.random() * 8 + 4
          }

          // Draw rain drop with neon effect
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

        lastRainTime = currentTime
      }

      rainAnimationRef.current = requestAnimationFrame(animateRain)
    }

    rainAnimationRef.current = requestAnimationFrame(animateRain)

    return () => {
      if (rainAnimationRef.current) {
        cancelAnimationFrame(rainAnimationRef.current)
      }
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [isLoaded])

  const projects = [
    {
      title: "Campagne Digitale Immersive",
      description: "Stratégie de communication 360° avec réalité augmentée et hologrammes",
      tech: ["Adobe Creative", "AR/VR", "Social Media"],
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "Brand Identity Futuriste",
      description: "Identité visuelle cyberpunk pour startup technologique",
      tech: ["Branding", "Motion Design", "UI/UX"],
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "Communication Événementielle",
      description: "Événement corporate avec mapping vidéo et effets holographiques",
      tech: ["Event Planning", "Video Mapping", "Live Streaming"],
      image: "/placeholder.svg?height=300&width=400",
    },
  ]

  const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    const [displayText, setDisplayText] = useState("")
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
      if (!isLoaded) return

      const timer = setTimeout(() => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1))
          setCurrentIndex(currentIndex + 1)
        }
      }, 50 + delay)

      return () => clearTimeout(timer)
    }, [currentIndex, text, isLoaded, delay])

    return (
      <span>
        {displayText}
        <span className="animate-pulse">|</span>
      </span>
    )
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="loading-grid mb-8">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="loading-cell" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
          <div className="text-cyan-400 font-mono text-xl">
            <TypewriterText text="INITIALIZING SYSTEM..." />
          </div>
          <div className="mt-4 w-64 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 loading-bar" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Transition Overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="scan-line" />
          <div className="glitch-overlay" />
        </div>
      )}

      {/* Background Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />
      
      {/* Rain Canvas */}
      <canvas ref={rainCanvasRef} className="fixed inset-0 pointer-events-none z-[1] opacity-60" />

      {/* Background Image with Overlay */}
      <div
        className="fixed inset-0 z-0 opacity-20 transition-all duration-1000"
        style={{
          backgroundImage: "url(/cyberpunk-street.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          filter: `hue-rotate(${currentSection * 30}deg)`,
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-purple-900/20 to-black/90 z-0" />

      {/* Cursor Glow Effect */}
      <div
        className="fixed pointer-events-none z-50 w-96 h-96 rounded-full opacity-30 blur-3xl transition-all duration-300"
        style={{
          background: "radial-gradient(circle, #ff00ff 0%, #00ffff 50%, transparent 70%)",
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      <div className="relative z-10">
        {/* Hero Section */}
        <section
          ref={(el) => {
            if (el) sectionsRef.current[0] = el
          }}
          className="min-h-screen flex items-center justify-center px-4 relative"
        >
          <div className="text-center">
            <div className="relative mb-8 hero-title">
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                <TypewriterText text="CORENTIN BASSON" delay={500} />
              </h1>
              <div className="absolute inset-0 text-6xl md:text-8xl font-bold text-cyan-400 opacity-20 blur-sm animate-pulse">
                <TypewriterText text="CORENTIN BASSON" delay={500} />
              </div>
            </div>

            <div className="relative mb-8 slide-up" style={{ animationDelay: "1.5s" }}>
              <p className="text-xl md:text-2xl text-cyan-300 font-mono glitch-text">
                <TypewriterText text="> Alternant en BTS Communication" delay={1500} />
              </p>
              <div className="absolute inset-0 text-xl md:text-2xl text-pink-500 opacity-30 blur-sm animate-pulse">
                <TypewriterText text="> Alternant en BTS Communication" delay={1500} />
              </div>
            </div>

            <div className="flex justify-center space-x-6 mb-12">
              {[
                { icon: Github, text: "GitHub", color: "cyan" },
                { icon: Linkedin, text: "LinkedIn", color: "pink" },
                { icon: Mail, text: "Contact", color: "purple" },
              ].map((item, index) => (
                <Button
                  key={item.text}
                  variant="outline"
                  size="lg"
                  className={`border-${item.color}-400 text-${item.color}-400 hover:bg-${item.color}-400/10 hologram-btn slide-up`}
                  style={{ animationDelay: `${2 + index * 0.2}s` }}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.text}
                </Button>
              ))}
            </div>

            <ChevronDown className="w-8 h-8 text-cyan-400 animate-bounce mx-auto pulse-glow" />
          </div>
        </section>

        {/* About Section */}
        <section 
          ref={(el) => {
            if (el) sectionsRef.current[1] = el
          }} 
          className="py-20 px-4"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 neon-text slide-down">ABOUT.EXE</h2>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="slide-right" style={{ animationDelay: "0.2s" }}>
                  <p className="text-lg text-gray-300 leading-relaxed font-mono">
                    Étudiant passionné par la communication digitale et les nouvelles technologies. Je développe des
                    stratégies de communication innovantes qui allient créativité et technologies émergentes.
                  </p>
                </div>
                <div className="slide-right" style={{ animationDelay: "0.4s" }}>
                  <p className="text-lg text-gray-300 leading-relaxed font-mono">
                    Spécialisé dans la communication visuelle, le marketing digital et la création de contenus immersifs
                    pour les marques du futur.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-8">
                  {[
                    { icon: Palette, text: "Design", color: "cyan" },
                    { icon: Zap, text: "Marketing", color: "pink" },
                    { icon: Code, text: "Digital", color: "purple" },
                  ].map((item, index) => (
                    <div
                      key={item.text}
                      className={`text-center p-4 border border-${item.color}-400/30 rounded-lg hologram-card scale-up`}
                      style={{ animationDelay: `${0.6 + index * 0.2}s` }}
                    >
                      <item.icon className={`w-8 h-8 text-${item.color}-400 mx-auto mb-2`} />
                      <p className={`text-${item.color}-400 font-mono`}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative slide-left" style={{ animationDelay: "0.3s" }}>
                <div className="w-80 h-80 mx-auto relative hologram-avatar">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full opacity-20 blur-xl animate-pulse" />
                  <div className="absolute inset-4 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full opacity-30 blur-lg animate-pulse animation-delay-1000" />
                  <div className="absolute inset-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-40 blur-md animate-pulse animation-delay-2000" />
                  <div className="absolute inset-12 bg-black rounded-full border-2 border-cyan-400 flex items-center justify-center avatar-core">
                    <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                      C
                    </div>
                  </div>
                  <div className="scan-ring" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section 
          ref={(el) => {
            if (el) sectionsRef.current[2] = el
          }} 
          className="py-20 px-4"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 neon-text slide-down">PROJECTS.DIR</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Card
                  key={index}
                  className="bg-black/50 border-cyan-400/30 hologram-card group cursor-pointer project-card slide-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-48 object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-4 right-4">
                        <ExternalLink className="w-6 h-6 text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:rotate-12" />
                      </div>
                      <div className="project-scan-line" />
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-cyan-400 mb-2 font-mono group-hover:text-pink-400 transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-gray-300 mb-4 text-sm">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded border border-purple-500/30 hover:bg-purple-500/40 transition-all duration-300 tech-tag"
                            style={{ animationDelay: `${techIndex * 0.1}s` }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section 
          ref={(el) => {
            if (el) sectionsRef.current[3] = el
          }} 
          className="py-20 px-4"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 neon-text slide-down">CONTACT.SYS</h2>
            <p className="text-xl text-gray-300 mb-12 font-mono slide-up" style={{ animationDelay: "0.2s" }}>
              Prêt à créer quelque chose d'extraordinaire ensemble ?
            </p>

            <div className="relative inline-block slide-up" style={{ animationDelay: "0.4s" }}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-bold px-8 py-4 text-lg hologram-btn contact-btn"
              >
                INITIALISER CONTACT
              </Button>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-500 opacity-30 blur-lg animate-pulse" />
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        
        .font-mono {
          font-family: 'Orbitron', monospace;
        }
        
        /* Loading Animations */
        .loading-grid {
          display: grid;
          grid-template-columns: repeat(3, 20px);
          gap: 5px;
          justify-content: center;
        }
        
        .loading-cell {
          width: 20px;
          height: 20px;
          background: linear-gradient(45deg, #00ffff, #ff00ff);
          animation: loading-pulse 1.5s infinite;
        }
        
        .loading-bar {
          width: 0;
          animation: loading-progress 3s ease-out forwards;
        }
        
        @keyframes loading-pulse {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(0.8); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.2); 
          }
        }
        
        @keyframes loading-progress {
          0% { width: 0; }
          100% { width: 100%; }
        }
        
        /* Transition Effects */
        .scan-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00ffff, transparent);
          animation: scan-sweep 0.5s ease-out;
        }
        
        .glitch-overlay {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 255, 0.1) 2px,
            rgba(0, 255, 255, 0.1) 4px
          );
          animation: glitch-flicker 0.3s;
        }
        
        @keyframes scan-sweep {
          0% { top: 0; }
          100% { top: 100%; }
        }
        
        @keyframes glitch-flicker {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        
        /* Entry Animations */
        .slide-up {
          opacity: 0;
          transform: translateY(50px);
          animation: slide-up 1s ease-out forwards;
        }
        
        .slide-down {
          opacity: 0;
          transform: translateY(-50px);
          animation: slide-down 1s ease-out forwards;
        }
        
        .slide-left {
          opacity: 0;
          transform: translateX(50px);
          animation: slide-left 1s ease-out forwards;
        }
        
        .slide-right {
          opacity: 0;
          transform: translateX(-50px);
          animation: slide-right 1s ease-out forwards;
        }
        
        .scale-up {
          opacity: 0;
          transform: scale(0.8);
          animation: scale-up 0.8s ease-out forwards;
        }
        
        @keyframes slide-up {
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-down {
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-left {
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-right {
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes scale-up {
          to { opacity: 1; transform: scale(1); }
        }
        
        /* Enhanced Effects */
        .neon-text {
          text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
          animation: neon-flicker 3s infinite alternate ease-in-out;
        }
        
        .glitch-text {
          position: relative;
          animation: glitch 4s infinite ease-in-out;
        }
        
        .hologram-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateZ(0);
          will-change: transform, box-shadow;
        }
        
        .hologram-btn:hover {
          transform: translateY(-3px) translateZ(0);
          box-shadow: 0 15px 35px rgba(0, 255, 255, 0.4);
        }
        
        .hologram-card {
          position: relative;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          transform: translateZ(0);
          will-change: transform, box-shadow;
        }
        
        .hologram-card:hover {
          transform: translateY(-8px) rotateX(2deg) translateZ(0);
          box-shadow: 0 25px 50px rgba(255, 0, 255, 0.3);
        }
        
        .project-card:hover .project-scan-line {
          animation: project-scan 2s infinite;
        }
        
        .project-scan-line {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.3), transparent);
          opacity: 0;
        }
        
        @keyframes project-scan {
          0% { left: -100%; opacity: 0; }
          50% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        
        .hologram-avatar {
          animation: float 8s ease-in-out infinite;
          transform: translateZ(0);
          will-change: transform;
        }
        
        .avatar-core {
          animation: rotate 25s linear infinite;
          transform: translateZ(0);
          will-change: transform;
        }
        
        .scan-ring {
          position: absolute;
          inset: 0;
          border: 2px solid transparent;
          border-top: 2px solid #00ffff;
          border-radius: 50%;
          animation: scan-rotate 4s linear infinite;
          transform: translateZ(0);
          will-change: transform;
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateZ(0); 
          }
          25% { 
            transform: translateY(-8px) translateZ(0); 
          }
          50% { 
            transform: translateY(-15px) translateZ(0); 
          }
          75% { 
            transform: translateY(-8px) translateZ(0); 
          }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg) translateZ(0); }
          to { transform: rotate(360deg) translateZ(0); }
        }
        
        @keyframes scan-rotate {
          from { transform: rotate(0deg) translateZ(0); }
          to { transform: rotate(360deg) translateZ(0); }
        }
        
        .contact-btn {
          animation: pulse-glow 2s infinite;
        }
        
        .pulse-glow {
          animation: pulse-glow 2s infinite;
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
          }
          50% { 
            box-shadow: 0 0 40px rgba(255, 0, 255, 0.8);
          }
        }
        
        .tech-tag {
          animation: tech-glow 3s infinite;
        }
        
        @keyframes tech-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(147, 51, 234, 0.3); }
          50% { box-shadow: 0 0 15px rgba(147, 51, 234, 0.6); }
        }
        
        .hero-title {
          animation: hero-entrance 2s ease-out;
        }
        
        @keyframes hero-entrance {
          0% { 
            opacity: 0; 
            transform: scale(0.5) rotateY(180deg);
            filter: blur(20px);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1) rotateY(90deg);
            filter: blur(10px);
          }
          100% { 
            opacity: 1; 
            transform: scale(1) rotateY(0deg);
            filter: blur(0px);
          }
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        @keyframes neon-flicker {
          0%, 100% {
            text-shadow: 
              0 0 5px #00ffff,
              0 0 10px #00ffff, 
              0 0 20px #00ffff, 
              0 0 30px #00ffff;
          }
          25% {
            text-shadow: 
              0 0 2px #00ffff,
              0 0 5px #00ffff, 
              0 0 10px #00ffff, 
              0 0 15px #00ffff;
          }
          50% {
            text-shadow: 
              0 0 3px #00ffff,
              0 0 7px #00ffff, 
              0 0 15px #00ffff, 
              0 0 25px #00ffff;
          }
          75% {
            text-shadow: 
              0 0 4px #00ffff,
              0 0 8px #00ffff, 
              0 0 18px #00ffff, 
              0 0 28px #00ffff;
          }
        }
        
        @keyframes glitch {
          0% { transform: translateX(0) translateZ(0); }
          10% { transform: translateX(-1px) translateZ(0); }
          20% { transform: translateX(-2px) translateZ(0); }
          30% { transform: translateX(1px) translateZ(0); }
          40% { transform: translateX(2px) translateZ(0); }
          50% { transform: translateX(-1px) translateZ(0); }
          60% { transform: translateX(-2px) translateZ(0); }
          70% { transform: translateX(1px) translateZ(0); }
          80% { transform: translateX(1px) translateZ(0); }
          90% { transform: translateX(-1px) translateZ(0); }
          100% { transform: translateX(0) translateZ(0); }
        }
        
        body {
          font-family: 'Orbitron', monospace;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}