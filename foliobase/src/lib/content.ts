import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')
const pagesDirectory = path.join(contentDirectory, 'pages')
const projectsDirectory = path.join(contentDirectory, 'projects')

// Types
export interface ProjectEvidence {
  type: 'Image' | 'URL' | 'PDF' | 'Video'
  description: string
  file?: string // Pour les images
  pdf?: string // Pour les PDFs
  url?: string // Pour les URLs
  youtube_url?: string // Pour les vidéos YouTube
}

export interface Project {
  slug: string
  ordre: number
  title: string
  date: string
  annonceur?: string
  contexte: 'Alternance' | 'École' | 'Projet personnel' | 'Client' | 'Autre'
  contexte_autre?: string // Obligatoire quand contexte = "Autre"
  project_type: string
  tools: string[]
  featured_image: string
  gallery: { image: string }[]
  duration?: string
  status: 'En cours' | 'Terminé' | 'En pause'
  pdf_portfolio?: string
  project_url?: string
  cibles?: string
  strategie_creative?: string
  objectifs_cognitifs?: string[]
  objectifs_affectifs?: string[]
  objectifs_conatifs?: string[]
  preuves?: ProjectEvidence[]
  excerpt: string
  body: string
  published: boolean
}

export interface Page {
  title: string
  subtitle?: string
  description?: string
  hero_image?: string
  cta_text?: string
  profile_image?: string
  skills?: string[]
  body: string
}

// Fonctions pour les pages
export function getPageData(pageName: string): Page | null {
  try {
    const fullPath = path.join(pagesDirectory, `${pageName}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    return {
      ...data,
      body: content,
    } as Page
  } catch (error) {
    console.error(`Error reading page ${pageName}:`, error)
    return null
  }
}

// Fonctions pour les projets
export function getAllProjects(): Project[] {
  try {
    if (!fs.existsSync(projectsDirectory)) {
      return []
    }

    const fileNames = fs.readdirSync(projectsDirectory)
    const projects = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '')
        return getProjectData(slug)
      })
      .filter((project): project is Project => project !== null)
      .filter(project => project.published)
      .sort((a, b) => {
        // Tri par ordre d'abord (1, 2, 3...), puis par date si égal
        if (a.ordre !== b.ordre) {
          return a.ordre - b.ordre
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })

    return projects
  } catch (error) {
    console.error('Error getting all projects:', error)
    return []
  }
}

export function getProjectData(slug: string): Project | null {
  try {
    const fullPath = path.join(projectsDirectory, `${slug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    return {
      slug,
      ...data,
      body: content,
      tools: data.tools || [],
      gallery: data.gallery || [],
      ordre: data.ordre || 999, // Valeur par défaut si pas définie
    } as Project
  } catch (error) {
    console.error(`Error reading project ${slug}:`, error)
    return null
  }
}

export function getProjectSlugs(): string[] {
  try {
    if (!fs.existsSync(projectsDirectory)) {
      return []
    }

    const fileNames = fs.readdirSync(projectsDirectory)
    return fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => fileName.replace(/\.md$/, ''))
  } catch (error) {
    console.error('Error getting project slugs:', error)
    return []
  }
}

// Fonction pour obtenir les projets featured (les 3 plus récents par exemple)
export function getFeaturedProjects(limit: number = 3): Project[] {
  const allProjects = getAllProjects()
  return allProjects.slice(0, limit)
} 