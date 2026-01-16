import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Eye, ExternalLink } from "lucide-react"
import { getFeaturedProjects, getPageData } from "@/lib/content"
import { CyberpunkBackground, GlitchCard } from "@/components/effects"
import { TypewriterText, NeonText } from "@/components/effects/AnimatedText"
import "../styles/cyberpunk-effects.css"

// Les types sont importés depuis @/lib/content

export default function Home() {
  // Données par défaut si le contenu n'existe pas encore
  const defaultData = {
    title: "Créatif Passionné",
    subtitle: "Graphiste Freelance spécialisé en Design Visuel",
    description: "Je transforme vos idées en créations visuelles percutantes. Découvrez un portfolio riche en projets d&apos;identité visuelle, web design et print.",
    cta_text: "Découvrir mes projets",
    body: ""
  }

  // Récupération des données depuis le CMS ou utilisation des données par défaut
  const cmsData = getPageData('homepage')
  const pageData = cmsData || defaultData
  const featuredProjects = getFeaturedProjects(3) // Les 3 projets les plus récents

  return (
    <CyberpunkBackground 
      backgroundImage="/cyberpunk-street.webp"
      showRain={true}
      showParticles={true}
      showCursor={true}
      rainOpacity={0.3}
      particleOpacity={0.2}
      cursorOpacity={0.30}
    >
      {/* Hero Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto w-full px-4">
          <div className="text-center max-w-4xl mx-auto">
          <div className="hero-title mb-8">
            <h1 className="text-4xl md:text-6xl font-cyberpunk font-bold tracking-tight mb-6 gradient-text">
              <TypewriterText text={pageData.title} delay={500} />
            </h1>
          </div>
          <div className="slide-up animation-delay-1000">
            <p className="text-xl md:text-2xl text-cyan-300 font-cyberpunk mb-8">
              <TypewriterText text={pageData.subtitle || ""} delay={1500} />
            </p>
          </div>
          <div className="slide-up animation-delay-1500">
            <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto font-cyberpunk">
              {pageData.description}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center slide-up animation-delay-2000">
            <Button asChild size="lg" className="text-lg px-8 hologram-btn bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-cyberpunk font-bold">
              <Link href="/projects">
                {pageData.cta_text}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 hologram-btn border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 font-cyberpunk" asChild>
              <Link href="/about">En savoir plus</Link>
            </Button>
          </div>
          </div>
        </div>
      </section>

      {/* About Me Section - Displaying markdown body */}
      {pageData.body && (
        <section className="py-20 px-4 relative">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-cyberpunk font-bold mb-4 slide-down">
                <NeonText color="#ff00ff">ABOUT.EXE</NeonText>
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto font-cyberpunk slide-up animation-delay-200">
                Découvrez mon parcours, mes compétences et ma vision créative dans l'univers du design et de la communication.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <GlitchCard 
                className="hologram-card bg-black/40 backdrop-blur-md border border-pink-500/20 shadow-2xl shadow-pink-500/10 hover:shadow-pink-500/20 hover:border-pink-400/40 slide-up animation-delay-500" 
                glitchIntensity="medium"
                autoGlitch={true}
                glitchInterval={4000}
              >
                <div className="p-8 md:p-12 about-content">
                  <div 
                    className="font-cyberpunk text-gray-200 leading-relaxed text-lg"
                    dangerouslySetInnerHTML={{ 
                      __html: pageData.body
                        .split('\n\n')
                        .map(paragraph => {
                          if (paragraph.trim().startsWith('*') && !paragraph.trim().startsWith('**')) {
                            // Section headers
                            return `<h3 class="text-2xl font-bold text-pink-400 mb-4 neon-text-purple" style="text-shadow: 0 0 10px #ff00ff;">${paragraph.replace(/^\*/, '').trim()}</h3>`
                          }
                          return paragraph
                            .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-cyan-400 font-bold" style="text-shadow: 0 0 5px #00ffff;">$1</strong>')
                            .replace(/\*([^*]+)\*/g, '<em class="text-pink-300 italic">$1</em>')
                        })
                        .map(content => content.trim().startsWith('<h3') ? content : `<p class="mb-6 text-gray-200">${content}</p>`)
                        .join('')
                        .replace(/<p class="mb-6 text-gray-200"><\/p>/g, '')
                    }}
                  />
                </div>
              </GlitchCard>
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-cyberpunk font-bold mb-4 slide-down">
              <NeonText color="#00ffff">PROJETS.DIR</NeonText>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto font-cyberpunk slide-up animation-delay-200">
              Découvrez quelques-unes de mes réalisations récentes qui illustrent ma passion pour le design et l&apos;innovation visuelle.
            </p>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProjects.map((project, index) => (
                <Card key={project.slug} className={`group overflow-hidden bg-black/50 border-cyan-400/30 hologram-card slide-up animation-delay-${(index + 1) * 200} relative z-10`}>
                  <div className="aspect-video bg-gradient-to-br from-cyan-400/10 to-pink-500/10 relative overflow-hidden">
                    {project.featured_image && (
                      <img
                        src={project.featured_image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
                      <Button size="sm" className="hologram-btn bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-cyberpunk relative z-20" asChild>
                        <Link href={`/projects/${project.slug}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir le projet
                        </Link>
                      </Button>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {Array.isArray(project.project_type) ? (
                        project.project_type.map((type, index) => (
                          <Badge key={index} className="bg-purple-500/20 text-purple-400 border-purple-500/30 tech-tag">{type}</Badge>
                        ))
                      ) : (
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 tech-tag">{project.project_type}</Badge>
                      )}
                      {project.annonceur && (
                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">{project.annonceur}</Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-cyberpunk font-semibold mb-2 text-cyan-400 group-hover:text-pink-400 transition-colors">
                      <Link href={`/projects/${project.slug}`} className="hover:underline">
                        {project.title}
                      </Link>
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2 font-cyberpunk">
                      {project.excerpt}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 font-cyberpunk">
                        {new Date(project.date).toLocaleDateString('fr-FR')}
                      </span>
                      {project.project_url && (
                        <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-pink-400" asChild>
                          <Link href={project.project_url} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-300 mb-8 font-cyberpunk">
                Aucun projet n&apos;est encore disponible. Les créations seront bientôt ajoutées !
              </p>
              <Button asChild className="hologram-btn border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 font-cyberpunk" variant="outline">
                <Link href="/admin">Ajouter des projets</Link>
              </Button>
            </div>
          )}

          <div className="text-center slide-up animation-delay-600">
            <Button asChild variant="outline" size="lg" className="hologram-btn border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 font-cyberpunk">
              <Link href="/projects">
                Voir tous les projets
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto w-full px-4">
          <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-cyberpunk font-bold mb-6 slide-down">
            <NeonText color="#ff00ff">CONTACT.SYS</NeonText>
          </h2>
          <p className="text-lg text-gray-300 mb-8 font-cyberpunk slide-up animation-delay-200">
            Collaborons ensemble pour créer quelque chose d&apos;exceptionnel qui marquera les esprits et atteindra vos objectifs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center slide-up animation-delay-400">
            <Button asChild size="lg" className="text-lg px-8 hologram-btn bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-cyberpunk font-bold pulse-glow">
              <Link href="mailto:corentinbassonpro@gmail.com">
                INITIALISER CONTACT
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 hologram-btn border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 font-cyberpunk" asChild>
              <Link href="/about">
                En savoir plus sur moi
              </Link>
            </Button>
          </div>
          </div>
        </div>
      </section>
    </CyberpunkBackground>
  )
}
