import { Hero, StackMarquee, Projects } from '@/components/manga'
import { getFeaturedProjects, getPageData } from '@/lib/content'
import { convertProjectsToCardData, defaultPortfolioData } from '@/lib/manga-helpers'
import { NeonTitle } from '@/components/effects/NeonTitle'
import Link from 'next/link'

export default function HomeManga() {
  // Get homepage data
  const homepageData = getPageData('homepage')
  
  // Prepare hero data
  const heroData = {
    title: homepageData?.title || defaultPortfolioData.hero.title,
    subtitle: homepageData?.subtitle || defaultPortfolioData.hero.subtitle,
    location: defaultPortfolioData.hero.location,
    status: defaultPortfolioData.hero.status
  }

  // Get featured projects
  const cmsProjects = getFeaturedProjects(4)
  const projectsData = convertProjectsToCardData(cmsProjects)

  // About section data
  const aboutData = {
    title: "À PROPOS",
    description: homepageData?.description || defaultPortfolioData.about.description,
    body: homepageData?.body || ""
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero data={heroData} />

      {/* Stack Marquee */}
      <StackMarquee stack={defaultPortfolioData.stack} />

      {/* About Section */}
      <section className="min-h-screen flex items-center justify-center px-8 py-20">
        <div className="max-w-4xl">
          <NeonTitle as="h2" className="text-6xl font-bold mb-8" filled>
            {aboutData.title}
          </NeonTitle>
          {aboutData.body ? (
            <div className="text-xl leading-relaxed space-y-6" style={{ fontFamily: "'Oswald', sans-serif" }}>
              {aboutData.body.split('\n\n').map((paragraph, index) => {
                // Handle headers (lines starting with *)
                if (paragraph.trim().startsWith('*') && !paragraph.trim().startsWith('**')) {
                  return (
                    <h3 key={index} className="text-3xl font-bold mt-8 mb-4 home-h3-sparkle">
                      {paragraph.replace(/^\*/, '').trim()}
                    </h3>
                  )
                }
                
                // Handle bold text
                const processedText = paragraph
                  .replace(/\*\*([^*]+)\*\*/g, '<strong class="home-strong" style="font-weight: bold;">$1</strong>')
                  .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')

                return (
                  <p 
                    key={index} 
                    className="text-xl leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: processedText }}
                  />
                )
              })}
            </div>
          ) : (
            <p className="text-2xl leading-relaxed" style={{ fontFamily: "'Oswald', sans-serif" }}>
              {aboutData.description}
            </p>
          )}
        </div>
      </section>

      {/* Projects Section */}
      {projectsData.length > 0 && (
        <Projects 
          projects={projectsData} 
          title="PROJETS"
          subtitle="Sélection de travaux récents"
        />
      )}

      {/* CTA Section */}
      <section className="min-h-[50vh] flex items-center justify-center px-8 py-20 border-t border-foreground/10">
        <div className="max-w-4xl text-center">
          <NeonTitle as="h2" className="text-5xl md:text-7xl font-bold mb-8" filled>
            CONTACTEZ-MOI
          </NeonTitle>
          <p className="text-xl mb-12 opacity-70" style={{ fontFamily: "'Oswald', sans-serif" }}>
            Collaborons ensemble pour créer quelque chose d'exceptionnel
          </p>
          <Link 
            href="/contact"
            className="inline-block border-2 px-12 py-4 text-lg uppercase tracking-widest transition-all duration-300 border-[#1a2f5a] text-[#1a2f5a] hover:bg-[#1a2f5a] hover:text-white dark:border-[#F0F0F0] dark:text-[#F0F0F0] dark:hover:bg-[#F0F0F0] dark:hover:text-[#050505]"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Démarrer un projet
          </Link>
        </div>
      </section>
    </div>
  )
}
