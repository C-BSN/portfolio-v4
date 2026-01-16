import { ProjectCardData } from '@/components/manga'

export interface CMSProject {
  slug: string
  title: string
  date: string
  annonceur?: string
  contexte?: string
  project_type: string | string[]
  tools?: string[]
  featured_image?: string | string[]
  excerpt?: string
  description?: string
  duration?: string
  status?: string
  project_url?: string
}

export function convertProjectToCardData(project: CMSProject): ProjectCardData {
  // Extract tech stack from tools or use project_type
  const tech = Array.isArray(project.tools) && project.tools.length > 0
    ? project.tools
    : Array.isArray(project.project_type)
    ? project.project_type
    : [project.project_type]

  // Get category (first project_type)
  const category = Array.isArray(project.project_type)
    ? project.project_type[0]
    : project.project_type

  // Get year from date
  const year = new Date(project.date).getFullYear().toString()

  // Get description
  const description = project.excerpt || project.description || `Projet réalisé pour ${project.annonceur || 'client'}`

  // Get featured image (take first if array)
  const featured_image = Array.isArray(project.featured_image)
    ? project.featured_image[0]
    : project.featured_image

  return {
    id: project.slug,
    slug: project.slug,
    title: project.title,
    description,
    category,
    year,
    tech: tech.slice(0, 4), // Limit to 4 tech items
    link: project.project_url,
    featured_image,
  }
}

export function convertProjectsToCardData(projects: CMSProject[]): ProjectCardData[] {
  return projects.map(convertProjectToCardData)
}

export interface PortfolioData {
  hero: {
    title: string
    subtitle: string
    location: string
    status: string
  }
  about: {
    title: string
    description: string
    mission: string
  }
  stack: string[]
}

export const defaultPortfolioData: PortfolioData = {
  hero: {
    title: "CREATIVE DESIGNER",
    subtitle: "PHOTOGRAPHIE • GRAPHISME • AUDIOVISUEL",
    location: "LA RÉUNION • 974",
    status: "DISPONIBLE POUR PROJETS"
  },
  about: {
    title: "À PROPOS",
    description: "Je suis photographe et créatif en communication, passionné par l'image et les projets qui transmettent des émotions fortes.",
    mission: "Transformer vos idées en créations visuelles percutantes"
  },
  stack: [
    "Photographie",
    "Graphisme",
    "Audiovisuel",
    "Communication",
    "Design",
    "Stratégie",
    "Création",
    "Innovation"
  ]
}
