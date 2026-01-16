import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Eye, ExternalLink } from "lucide-react"
import { getFeaturedProjects } from "@/lib/content"

// Les types sont importés depuis @/lib/content

export default function Home() {
  // Données par défaut si le contenu n'existe pas encore
  const defaultData = {
    title: "Créatif Passionné",
    subtitle: "Graphiste Freelance spécialisé en Design Visuel",
    description: "Je transforme vos idées en créations visuelles percutantes. Découvrez un portfolio riche en projets d&apos;identité visuelle, web design et print.",
    cta_text: "Découvrir mes projets",
    body: ""
  }

  const pageData = defaultData
  const featuredProjects = getFeaturedProjects(3) // Les 3 projets les plus récents

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto w-full px-4">
          <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {pageData.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            {pageData.subtitle}
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            {pageData.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/projects">
                {pageData.cta_text}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8" asChild>
              <Link href="/about">En savoir plus</Link>
            </Button>
          </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Projets en vedette
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez quelques-unes de mes réalisations récentes qui illustrent ma passion pour le design et l&apos;innovation visuelle.
            </p>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProjects.map((project) => (
                <Card key={project.slug} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
                    {project.featured_image && (
                      <img
                        src={project.featured_image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
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
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.excerpt}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {new Date(project.date).toLocaleDateString('fr-FR')}
                      </span>
                      {project.project_url && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={project.project_url} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-8">
                Aucun projet n&apos;est encore disponible. Les créations seront bientôt ajoutées !
              </p>
              <Button asChild variant="outline">
                <Link href="/admin">Ajouter des projets</Link>
              </Button>
            </div>
          )}

          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/projects">
                Voir tous les projets
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto w-full px-4">
          <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt(e) à donner vie à votre projet ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Collaborons ensemble pour créer quelque chose d&apos;exceptionnel qui marquera les esprits et atteindra vos objectifs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="mailto:corentinbassonpro@gmail.com">
                Démarrer un projet
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8" asChild>
                            <Link href="/about">
                En savoir plus sur moi
              </Link>
            </Button>
          </div>
          </div>
        </div>
      </section>
    </div>
  )
}
