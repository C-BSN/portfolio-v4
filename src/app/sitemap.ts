import { MetadataRoute } from "next"
import { getAllProjects } from "@/lib/content"

const BASE_URL = "https://cbsn-pics.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getAllProjects()

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/projects/${encodeURIComponent(project.slug)}/`,
    lastModified: project.date ? new Date(project.date) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/projects/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact/`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    ...projectEntries,
  ]
}
