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
      {/* Filtres et recherche - Style Cyberpunk */}
      <div className="mb-12 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-6 bg-black/60 backdrop-blur-md rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
          {/* Recherche */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
            <Input
              placeholder="Rechercher un projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/70 border-cyan-500/40 text-cyan-100 placeholder:text-cyan-300/60 focus:border-cyan-400 focus:ring-cyan-400/30 shadow-inner"
            />
          </div>

          {/* Filtre par type */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-cyan-200 font-mono">Filtrer par :</span>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48 bg-black/70 border-purple-500/40 text-purple-100 focus:border-purple-400 focus:ring-purple-400/30 shadow-inner">
                <SelectValue placeholder="Type de projet" />
              </SelectTrigger>
              <SelectContent className="bg-black/95 border-purple-500/40 backdrop-blur-md">
                <SelectItem value="all" className="text-purple-100 focus:bg-purple-500/30 hover:bg-purple-500/20">Tous les projets</SelectItem>
                {projectTypes.map(type => (
                  <SelectItem key={type} value={type} className="text-purple-100 focus:bg-purple-500/30 hover:bg-purple-500/20">{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Grille de projets */}
      {filteredProjects.length > 0 ? (
        <>
          {/* Statistiques - Style Cyberpunk */}
          <div className="mb-8 text-center">
            <p className="text-cyan-300/80 font-mono text-sm tracking-wider">
              <span className="text-pink-400">[</span>
              {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} 
              {searchTerm || selectedType !== "all" ? ' trouvé' + (filteredProjects.length > 1 ? 's' : '') : ''}
              <span className="text-pink-400">]</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Card key={project.slug} className="group overflow-hidden bg-black/40 backdrop-blur-md border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:border-cyan-400/40 transition-all duration-500 relative z-10">
                <div className="aspect-video bg-gradient-to-br from-cyan-500/10 to-purple-500/10 relative overflow-hidden">
                  {project.featured_image ? (
                    <>
                      <img
                        src={project.featured_image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center relative">
                      <span className="text-4xl font-bold text-cyan-400 z-10">
                        {project.title.charAt(0)}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 animate-pulse" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
                    <Button size="sm" asChild className="bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/50 text-cyan-100 hover:bg-cyan-400/30 hover:text-white transition-all duration-300 relative z-20">
                      <Link href={`/projects/${project.slug}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir le projet
                      </Link>
                    </Button>
                  </div>
                  
                  {/* Effet de bordure néon */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
                    <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
                    <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent" />
                  </div>
                </div>
                <CardContent className="p-6 bg-black/20">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {Array.isArray(project.project_type) ? (
                      project.project_type.map((type, index) => (
                        <Badge key={index} className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30">{type}</Badge>
                      ))
                    ) : (
                      <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30">{project.project_type}</Badge>
                    )}
                    {project.annonceur && (
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30">{project.annonceur}</Badge>
                    )}
                    <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30 text-xs hover:bg-pink-500/30">
                      {project.status}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-cyan-100 group-hover:text-cyan-300 transition-colors duration-300">
                    <Link href={`/projects/${project.slug}`}>
                      {project.title}
                    </Link>
                  </h3>
                  <p className="text-cyan-200/70 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {project.excerpt}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-cyan-300/60 font-mono tracking-wider">
                      {new Date(project.date).toLocaleDateString('fr-FR')}
                    </span>
                    <div className="flex gap-2">
                      {project.project_url && (
                        <Button variant="ghost" size="sm" asChild className="text-purple-300 hover:text-purple-100 hover:bg-purple-500/20">
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
          <div className="max-w-md mx-auto p-8 bg-black/40 backdrop-blur-md rounded-2xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
            {projects.length === 0 ? (
              <>
                <h3 className="text-2xl font-bold mb-4 text-cyan-300">Aucun projet disponible</h3>
                <p className="text-cyan-200/70 mb-8 leading-relaxed">
                  Les premiers projets seront bientôt ajoutés au portfolio !
                </p>
                <Button asChild className="bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/50 text-cyan-100 hover:bg-cyan-400/30 hover:text-white transition-all duration-300">
                  <Link href="/admin">
                    <span className="mr-2">+</span>
                    Ajouter des projets
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-4 text-purple-300">Aucun projet trouvé</h3>
                <p className="text-purple-200/70 mb-8 leading-relaxed">
                  Essayez de modifier vos critères de recherche ou filtres.
                </p>
                <Button 
                  className="bg-purple-500/20 backdrop-blur-sm border border-purple-400/50 text-purple-100 hover:bg-purple-400/30 hover:text-white transition-all duration-300"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedType("all")
                  }}
                >
                  <span className="mr-2">↻</span>
                  Réinitialiser les filtres
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
} 