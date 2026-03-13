import { getProjectData, getProjectSlugs, getAllProjects } from "@/lib/content"
import { notFound } from "next/navigation"
import ProjectPageManga from "./_components/ProjectPage"

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

  const description = project.excerpt || `Projet créatif par Corentin Basson`

  return {
    title: project.title,
    description,
    alternates: {
      canonical: `/projects/${slug}/`,
    },
    openGraph: {
      title: project.title,
      description,
      type: "article",
      url: `/projects/${slug}/`,
      locale: "fr_FR",
      siteName: "Corentin Basson",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: project.title,
      description,
      creator: "@cbsn_pics",
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
