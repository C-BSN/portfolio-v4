import { getAllProjects } from "@/lib/content"
import ProjectsClient from "./projects-client"

export default function ProjectsPage() {
  const allProjects = getAllProjects()

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto w-full px-4">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Mes Réalisations
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez une sélection de projets qui illustrent ma passion pour le design 
            et mon expertise dans différents domaines créatifs.
          </p>
        </div>

        {/* Contenu avec filtres côté client */}
        <ProjectsClient projects={allProjects} />
      </div>
    </div>
  )
} 