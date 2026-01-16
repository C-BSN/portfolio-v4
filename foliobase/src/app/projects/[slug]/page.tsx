import { getProjectData, getProjectSlugs, getAllProjects } from "@/lib/content"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ProjectEvidenceList } from "@/components/ui/project-evidence"
import { ProjectObjectives, ProjectStrategy } from "@/components/ui/project-objectives"
import { ProjectGallery } from "@/components/ui/project-gallery"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { ArrowLeft, ExternalLink, Download, Calendar, User, Clock, ChevronLeft, ChevronRight, Building, GraduationCap } from "lucide-react"

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  try {
    const slugs = getProjectSlugs()
    return slugs.map((slug) => ({
      slug: encodeURIComponent(slug), // Encoder pour correspondre aux URLs
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return [] // Retourner un tableau vide en cas d'erreur
  }
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const project = getProjectData(decodedSlug)
  
  if (!project) {
    return {
      title: "Projet non trouvé",
    }
  }

  return {
    title: project.title,
    description: project.excerpt,
    openGraph: {
      title: project.title,
      description: project.excerpt,
      images: project.featured_image ? [project.featured_image] : [],
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  // Décoder le slug pour gérer les caractères spéciaux
  const decodedSlug = decodeURIComponent(slug)
  const project = getProjectData(decodedSlug)
  
  if (!project) {
    notFound()
  }

  // Obtenir les projets suivant et précédent
  const allProjects = getAllProjects()
  const currentIndex = allProjects.findIndex(p => p.slug === decodedSlug)
  const previousProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto w-full px-4">
        {/* Navigation de retour */}
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux projets
            </Link>
          </Button>
        </div>

        {/* Header du projet */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{project.project_type}</Badge>
            {project.annonceur && (
              <Badge variant="outline">{project.annonceur}</Badge>
            )}
            <Badge variant="outline">{project.status}</Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              {project.contexte === 'École' ? <GraduationCap className="h-3 w-3" /> : 
               project.contexte === 'Client' ? <Building className="h-3 w-3" /> : null}
              {project.contexte}
              {project.contexte === 'Autre' && project.contexte_autre && ` (${project.contexte_autre})`}
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {project.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            {project.excerpt}
          </p>

          {/* Actions principales */}
          <div className="flex flex-wrap gap-4">
            {project.project_url && (
              <Button asChild>
                <Link href={project.project_url} target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Voir le projet en ligne
                </Link>
              </Button>
            )}
            {project.pdf_portfolio && (
              <Button variant="outline" asChild>
                <Link href={project.pdf_portfolio} target="_blank">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger le PDF
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contenu principal */}
            <div className="lg:col-span-2">
              {/* Image principale */}
              {project.featured_image && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img
                    src={project.featured_image}
                    alt={project.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Description du projet */}
              <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
                <MDXRemote source={project.body} />
              </div>

              {/* Galerie d'images */}
              <ProjectGallery 
                gallery={project.gallery}
                title="Galerie"
                defaultLayout="justified"
                showLayoutSwitcher={false}
                className="mb-8"
              />

              {/* Stratégie et ciblage */}
              <ProjectStrategy 
                cibles={project.cibles}
                strategie_creative={project.strategie_creative}
                className="mb-8"
              />

              {/* Objectifs pédagogiques */}
              <ProjectObjectives 
                cognitifs={project.objectifs_cognitifs}
                affectifs={project.objectifs_affectifs}
                conatifs={project.objectifs_conatifs}
                className="mb-8"
              />

              {/* Preuves du projet */}
              {project.preuves && project.preuves.length > 0 && (
                <ProjectEvidenceList 
                  evidences={project.preuves}
                  title="Preuves et éléments complémentaires"
                  className="mb-8"
                />
              )}
            </div>

            {/* Sidebar avec informations */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Informations du projet</h3>
                  
                  <div className="space-y-4">
                    {/* Date */}
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Date de création</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(project.date).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Annonceur */}
                    {project.annonceur && (
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Annonceur</p>
                          <p className="text-sm text-muted-foreground">{project.annonceur}</p>
                        </div>
                      </div>
                    )}

                    {/* Contexte */}
                    <div className="flex items-center gap-3">
                      {project.contexte === 'École' ? <GraduationCap className="h-4 w-4 text-muted-foreground" /> : 
                       project.contexte === 'Client' ? <Building className="h-4 w-4 text-muted-foreground" /> : 
                       <Clock className="h-4 w-4 text-muted-foreground" />}
                      <div>
                        <p className="text-sm font-medium">Contexte</p>
                        <p className="text-sm text-muted-foreground">
                          {project.contexte}
                          {project.contexte === 'Autre' && project.contexte_autre && ` (${project.contexte_autre})`}
                        </p>
                      </div>
                    </div>

                    {/* Durée */}
                    {project.duration && (
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Durée</p>
                          <p className="text-sm text-muted-foreground">{project.duration}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Technologies/Outils */}
                  {project.tools && project.tools.length > 0 && (
                    <>
                      <Separator className="my-6" />
                      <div>
                        <h4 className="text-sm font-semibold mb-3">Technologies utilisées</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.tools.map((tool) => (
                            <Badge key={tool} variant="outline" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Objectifs en mode compact */}
                  <ProjectObjectives 
                    cognitifs={project.objectifs_cognitifs}
                    affectifs={project.objectifs_affectifs}
                    conatifs={project.objectifs_conatifs}
                    title="Objectifs"
                    compact={true}
                    className="my-6"
                  />

                  {/* Actions */}
                  <Separator className="my-6" />
                  <div className="space-y-3">
                    {project.project_url && (
                      <Button asChild className="w-full">
                        <Link href={project.project_url} target="_blank">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Voir en ligne
                        </Link>
                      </Button>
                    )}
                    {project.pdf_portfolio && (
                      <Button variant="outline" asChild className="w-full">
                        <Link href={project.pdf_portfolio} target="_blank">
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger PDF
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Navigation entre projets */}
        <div className="max-w-7xl mx-auto mt-16">
          <Separator className="mb-8" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Projet précédent */}
            <div className="flex-1">
              {previousProject ? (
                <Button variant="outline" asChild className="h-auto p-4 w-full justify-start">
                  <Link href={`/projects/${previousProject.slug}`}>
                    <div className="flex items-center gap-3">
                      <ChevronLeft className="h-5 w-5 flex-shrink-0" />
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground mb-1">Projet précédent</p>
                        <p className="font-medium text-sm">{previousProject.title}</p>
                      </div>
                    </div>
                  </Link>
                </Button>
              ) : (
                <div></div>
              )}
            </div>

            {/* Retour à la grille */}
            <Button variant="ghost" asChild>
              <Link href="/projects">
                Tous les projets
              </Link>
            </Button>

            {/* Projet suivant */}
            <div className="flex-1 flex justify-end">
              {nextProject ? (
                <Button variant="outline" asChild className="h-auto p-4 w-full justify-end">
                  <Link href={`/projects/${nextProject.slug}`}>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">Projet suivant</p>
                        <p className="font-medium text-sm">{nextProject.title}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 flex-shrink-0" />
                    </div>
                  </Link>
                </Button>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 