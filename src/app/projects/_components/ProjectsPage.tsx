import { getAllProjects } from "@/lib/content"
import { Projects } from "@/components/manga"
import { convertProjectsToCardData } from "@/lib/manga-helpers"
import { NeonTitle } from "@/components/effects/NeonTitle"

export default function ProjectsPageManga() {
  const allProjects = getAllProjects()
  const projectsData = convertProjectsToCardData(allProjects)

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Header */}
      <section className="px-8 py-20 text-center">
        <NeonTitle as="h1" className="text-7xl md:text-9xl font-bold uppercase leading-none mb-6">
          PROJETS
        </NeonTitle>
        <p className="text-xl uppercase tracking-widest opacity-70 max-w-2xl mx-auto" style={{ fontFamily: "'Oswald', sans-serif" }}>
          Découvrez une sélection de mes réalisations créatives
        </p>
      </section>

      {/* Projects Grid */}
      <Projects 
        projects={projectsData}
        title=""
        subtitle=""
      />
    </div>
  )
}
