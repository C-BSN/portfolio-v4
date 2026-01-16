import { getPageData } from "@/lib/content"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MDXRemote } from "next-mdx-remote/rsc"
import { ArrowRight, Mail, Download } from "lucide-react"

export const metadata = {
  title: "À propos",
  description: "Découvrez mon parcours, mes compétences et ma passion pour le design graphique."
}

export default function AboutPage() {
  const aboutData = getPageData('about')

  // Données par défaut si le contenu n'existe pas encore
  const defaultData = {
    title: "À propos de moi",
    profile_image: undefined as string | undefined,
    skills: [
      "Adobe Creative Suite",
      "Figma", 
      "Sketch",
      "Photographie",
      "Illustration",
      "Branding",
      "Web Design",
      "Print Design"
    ],
    body: `## Qui suis-je ?

Graphiste freelance depuis plus de 5 ans, je me spécialise dans la création d'identités visuelles fortes et mémorables. Ma formation en arts appliqués et mon expérience en agence m'ont permis de développer une approche méthodique et créative du design.

## Ma philosophie

Je crois que chaque projet a sa propre personnalité et mérite une approche unique. Mon rôle est de comprendre vos besoins, votre audience et vos objectifs pour créer des solutions visuelles qui vous démarquent.

## Mon processus créatif

1. **Écoute et analyse** : Comprendre votre projet et vos attentes
2. **Recherche et inspiration** : Explorer les tendances et références  
3. **Conception** : Développer les concepts créatifs
4. **Itération** : Affiner et perfectionner les créations
5. **Livraison** : Finaliser et décliner sur tous supports

## Collaborations

J'ai eu le plaisir de travailler avec des startups innovantes, des PME dynamiques et des associations engagées. Chaque collaboration est une opportunité d'apprendre et de créer quelque chose d'unique.

Prêt(e) à donner vie à votre projet ? Contactons-nous !`
  }

  const pageData = aboutData || defaultData

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto w-full px-4">
        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {pageData.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez mon parcours, mes compétences et ma passion pour le design graphique.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Photo de profil et infos */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                {/* Placeholder pour la photo de profil */}
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  {pageData.profile_image ? (
                    <img
                      src={pageData.profile_image}
                      alt="Photo de profil"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-primary">P</span>
                  )}
                </div>
                
                <h2 className="text-xl font-semibold mb-4">Graphiste Freelance</h2>
                
                {/* Compétences */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                    Compétences
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {pageData.skills?.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button asChild className="w-full">
                    <Link href="mailto:corentinbassonpro@gmail.com">
                      <Mail className="mr-2 h-4 w-4" />
                      Me contacter
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger CV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <MDXRemote source={pageData.body} />
            </div>

            {/* CTA Section */}
            <div className="mt-12 p-8 bg-muted/50 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4">
                Vous avez un projet en tête ?
              </h3>
              <p className="text-muted-foreground mb-6">
                N&apos;hésitez pas à me contacter pour discuter de votre projet. 
                Je serais ravi de vous accompagner dans la réalisation de vos ambitions créatives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/projects">
                    Voir mes réalisations
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="mailto:corentinbassonpro@gmail.com">
                    Démarrer un projet
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
} 