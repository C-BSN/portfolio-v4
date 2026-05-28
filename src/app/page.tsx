import { Hero, StackMarquee, Projects } from '@/components/manga'
import { getFeaturedProjects, getPageData } from '@/lib/content'
import { convertProjectsToCardData, defaultPortfolioData } from '@/lib/manga-helpers'
import { NeonTitle } from '@/components/effects/NeonTitle'
import Link from 'next/link'
import { Camera, Pen, Clapperboard, Megaphone } from 'lucide-react'

const EXPERTISE_ICONS: Record<string, React.ReactNode> = {
  'Photographie': <Camera size={28} strokeWidth={1.5} />,
  'Graphisme & design': <Pen size={28} strokeWidth={1.5} />,
  'Audiovisuel': <Clapperboard size={28} strokeWidth={1.5} />,
  'Communication': <Megaphone size={28} strokeWidth={1.5} />,
}

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
  const cmsProjects = getFeaturedProjects(3)
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
              {(() => {
                const paragraphs = aboutData.body.split('\n\n')
                const elements: React.ReactNode[] = []
                let i = 0

                while (i < paragraphs.length) {
                  const paragraph = paragraphs[i]

                  // H3 header (single * not **)
                  if (paragraph.trim().startsWith('*') && !paragraph.trim().startsWith('**')) {
                    const headerText = paragraph.replace(/^\*/, '').trim()

                    // Look ahead: collect consecutive **bold** paragraphs as expertise items
                    const expertiseItems: string[] = []
                    let j = i + 1
                    while (j < paragraphs.length && paragraphs[j].trim().startsWith('**')) {
                      expertiseItems.push(paragraphs[j])
                      j++
                    }

                    elements.push(
                      <h3 key={`h-${i}`} className="text-3xl font-bold mt-8 mb-6 home-h3-sparkle">
                        {headerText}
                      </h3>
                    )

                    if (expertiseItems.length > 1) {
                      // Render expertise grid
                      elements.push(
                        <div key={`grid-${i}`} className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-italic">
                          {expertiseItems.map((item, idx) => {
                            const match = item.match(/\*\*([^*]+)\*\*\s*[:\-]?\s*(.*)/)
                            const title = match ? match[1].trim() : item
                            const desc = match ? match[2].trim() : ''
                            const icon = EXPERTISE_ICONS[title]
                            return (
                              <div
                                key={idx}
                                className="group flex gap-4 items-start rounded-xl border p-5 transition-all duration-300
                                  dark:bg-white/5 dark:border-[#00f3ff]/15 dark:hover:border-[#00f3ff]/40 dark:hover:bg-white/10
                                  bg-white/60 border-[#c45880]/20 hover:border-[#c45880]/50 hover:bg-white/80
                                  backdrop-blur-sm"
                              >
                                <span className="mt-0.5 shrink-0 dark:text-[#00f3ff] text-[#c45880] opacity-80 group-hover:opacity-100 transition-opacity">
                                  {icon}
                                </span>
                                <div>
                                  <p className="font-bold text-lg leading-tight home-strong">{title}</p>
                                  {desc && (
                                    <p className="text-sm mt-1 opacity-70 dark:text-[#F0F0F0] text-[#1a2f5a]" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                      {desc}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                      i = j
                      continue
                    }

                    i++
                    continue
                  }

                  // Regular paragraph with bold/italic processing
                  const processedText = paragraph
                    .replace(/\*\*([^*]+)\*\*/g, '<strong class="home-strong" style="font-weight: bold;">$1</strong>')
                    .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')

                  elements.push(
                    <p
                      key={`p-${i}`}
                      className="text-xl leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: processedText }}
                    />
                  )
                  i++
                }

                return elements
              })()}
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
            Collaborons ensemble pour créer quelque chose d&apos;exceptionnel
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
