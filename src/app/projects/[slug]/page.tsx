import { getProjectData, getProjectSlugs, getAllProjects } from "@/lib/content"
import { notFound } from "next/navigation"
import ProjectPageManga from "./page-manga"

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  try {
    const slugs = getProjectSlugs()
    return slugs.map((slug) => ({
      slug: encodeURIComponent(slug),
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
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
    <ProjectPageManga 
      project={project}
      previousProject={previousProject}
      nextProject={nextProject}
    />
  )
}
