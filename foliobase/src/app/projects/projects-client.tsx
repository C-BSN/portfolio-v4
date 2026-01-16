"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useState, useMemo } from "react"
import { Eye, ExternalLink, Search } from "lucide-react"
import { type Project } from "@/lib/content"

interface ProjectsClientProps {
  projects: Project[]
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")

  // Obtenir tous les types de projets uniques
  const projectTypes = useMemo(() => {
    const types = projects.flatMap(project => 
      Array.isArray(project.project_type) ? project.project_type : [project.project_type]
    ).filter((type): type is string => typeof type === 'string')
    return Array.from(new Set(types))
  }, [projects])

  // Filtrer les projets
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (project.annonceur && project.annonceur.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesType = selectedType === "all" || 
        (Array.isArray(project.project_type) 
          ? project.project_type.includes(selectedType)
          : project.project_type === selectedType)

      return matchesSearch && matchesType
    })
  }, [projects, searchTerm, selectedType])

  return (
    <>
      {/* Filtres et recherche */}
      <div className="mb-12 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Recherche */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtre par type */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">Filtrer par :</span>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type de projet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les projets</SelectItem>
                {projectTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Grille de projets */}
      {filteredProjects.length > 0 ? (
        <>
          {/* Statistiques */}
          <div className="mb-8 text-center">
            <p className="text-muted-foreground">
              {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} 
              {searchTerm || selectedType !== "all" ? ' trouvé' + (filteredProjects.length > 1 ? 's' : '') : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Card key={project.slug} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
                  {project.featured_image ? (
                    <img
                      src={project.featured_image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button size="sm" asChild>
                      <Link href={`/projects/${project.slug}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir le projet
                      </Link>
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary">{project.project_type}</Badge>
                    {project.annonceur && (
                      <Badge variant="outline">{project.annonceur}</Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {project.status}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    <Link href={`/projects/${project.slug}`}>
                      {project.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {project.excerpt}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {new Date(project.date).toLocaleDateString('fr-FR')}
                    </span>
                    <div className="flex gap-2">
                      {project.project_url && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={project.project_url} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          {projects.length === 0 ? (
            <>
              <h3 className="text-2xl font-bold mb-4">Aucun projet disponible</h3>
              <p className="text-muted-foreground mb-8">
                Les premiers projets seront bientôt ajoutés au portfolio !
              </p>
              <Button asChild variant="outline">
                <Link href="/admin">Ajouter des projets</Link>
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-bold mb-4">Aucun projet trouvé</h3>
              <p className="text-muted-foreground mb-8">
                Essayez de modifier vos critères de recherche ou filtres.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("")
                  setSelectedType("all")
                }}
              >
                Réinitialiser les filtres
              </Button>
            </>
          )}
        </div>
      )}
    </>
  )
} 