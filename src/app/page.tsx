import { Hero, StackMarquee, Projects } from '@/components/manga'
import { getFeaturedProjects, getPageData } from '@/lib/content'
import { convertProjectsToCardData, defaultPortfolioData } from '@/lib/manga-helpers'
import { NeonTitle } from '@/components/effects/NeonTitle'

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
                    <h3 key={index} className="text-3xl font-bold mt-8 mb-4 title-h2-sparkle">
                      {paragraph.replace(/^\*/, '').trim()}
                    </h3>
                  )
                }
                
                // Handle bold text
                const processedText = paragraph
                  .replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #00f3ff; font-weight: bold; text-shadow: 0 0 10px rgba(0, 243, 255, 0.6), 0 0 20px rgba(0, 243, 255, 0.4);">$1</strong>')
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
      <section className="min-h-[50vh] flex items-center justify-center px-8 py-20 border-t border-white/10">
        <div className="max-w-4xl text-center">
          <NeonTitle as="h2" className="text-5xl md:text-7xl font-bold mb-8" filled>
            CONTACTEZ-MOI
          </NeonTitle>
          <p className="text-xl mb-12 opacity-70" style={{ fontFamily: "'Oswald', sans-serif" }}>
            Collaborons ensemble pour créer quelque chose d'exceptionnel
          </p>
          <a 
            href="mailto:corentinbassonpro@gmail.com"
            className="inline-block border-2 border-[#F0F0F0] px-12 py-4 text-lg uppercase tracking-widest hover:bg-[#F0F0F0] hover:text-[#050505] transition-all duration-300"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Démarrer un projet
          </a>
        </div>
      </section>
    </div>
  )
}
