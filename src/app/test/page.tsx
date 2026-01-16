import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TestGalleryWithDetection } from "@/components/test-gallery-with-detection"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Test des Galeries - Portfolio",
  description: "Page de test pour valider les différents types de galeries",
}

export default function TestPage() {
  // URLs des images de test SANS dimensions manuelles - elles seront détectées automatiquement
  const testImageUrls = [
    "https://res.cloudinary.com/dtnbb9ykw/image/upload/v1753869398/samples/man-on-a-escalator.jpg",
    "https://res.cloudinary.com/dtnbb9ykw/image/upload/v1753869398/samples/man-on-a-street.jpg", 
    "https://res.cloudinary.com/dtnbb9ykw/image/upload/v1753869398/samples/chair-and-coffee-table.jpg",
    "https://res.cloudinary.com/dtnbb9ykw/image/upload/v1753869398/samples/man-portrait.jpg",
    "https://res.cloudinary.com/dtnbb9ykw/image/upload/v1753869398/samples/outdoor-woman.jpg",
    "https://res.cloudinary.com/dtnbb9ykw/image/upload/v1753869398/samples/look-up.jpg",
    "https://res.cloudinary.com/dtnbb9ykw/image/upload/v1753894461/preserver-la-nature_pvxr5x.jpg"
  ]

  // Données simulant le format CMS (string[][]) pour test de détection automatique
  const galleryDataForDetection = [testImageUrls]

  // Info sur les images pour affichage (sans dimensions réelles car elles seront détectées)
  const imageInfo = [
    { name: "Homme sur un escalator", url: testImageUrls[0], expectedRatio: "Portrait 2:3" },
    { name: "Homme dans la rue", url: testImageUrls[1], expectedRatio: "Paysage 3:2" },
    { name: "Chaise et table basse", url: testImageUrls[2], expectedRatio: "Carré 1:1" },
    { name: "Portrait d'homme", url: testImageUrls[3], expectedRatio: "Portrait 3:4" },
    { name: "Femme en extérieur", url: testImageUrls[4], expectedRatio: "Paysage large" },
    { name: "Regard vers le haut", url: testImageUrls[5], expectedRatio: "Portrait 2:3" },
    { name: "Préserver la nature", url: testImageUrls[6], expectedRatio: "Bannière 16:9" }
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l&apos;accueil
            </Link>
          </Button>
          
          <h1 className="text-4xl font-bold mb-4">Test des Galeries</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Validation visuelle des 3 types de galeries avec détection automatique des dimensions d&apos;images
          </p>
          
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge variant="outline">🔍 Détection automatique RÉELLE</Badge>
            <Badge variant="outline">📷 PhotoSwipe Lightbox</Badge>
            <Badge variant="outline">📐 Ratios variés détectés</Badge>
            <Badge variant="outline">{testImageUrls.length} images de test</Badge>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-8">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              🧪 Test de Détection Automatique des Dimensions
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Cette page teste la détection automatique des vraies dimensions des images. 
              Aucune dimension n&apos;est codée en dur - tout est détecté dynamiquement !
            </p>
          </div>
        </div>

        {/* Informations sur les images de test */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Images de Test (Dimensions détectées automatiquement)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {imageInfo.map((image, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Image 
                    src={image.url} 
                    alt={image.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{image.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Ratio attendu: {image.expectedRatio}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Dimensions: détectées automatiquement
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test avec Détection Automatique Complète */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              🔬 Test Principal : Galeries avec Détection Automatique
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Les 3 types de galeries utilisant le hook useGallery avec détection automatique des vraies dimensions
            </p>
          </CardHeader>
          <CardContent>
            <TestGalleryWithDetection 
              galleryData={galleryDataForDetection}
              showAllTypes={true}
            />
          </CardContent>
        </Card>

        {/* Instructions de test */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions de Test pour la Détection Automatique</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">🔍 Vérifications de détection :</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Les images conservent leurs proportions naturelles</li>
                <li>Pas d&apos;images déformées ou étirées</li>
                <li>Les ratios correspondent aux attentes (portrait/paysage/carré)</li>
                <li>La galerie justified crée des rangées harmonieuses</li>
                <li>La galerie masonry respecte les hauteurs variables</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">⚡ Performance de détection :</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Observez l&apos;indicateur de chargement des dimensions</li>
                <li>Notez l&apos;amélioration progressive du layout</li>
                <li>Vérifiez les informations de debug pour voir les vraies dimensions</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">📷 Test de la lightbox :</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Cliquez sur n&apos;importe quelle image pour ouvrir la lightbox</li>
                <li>Vérifiez que l&apos;image s&apos;affiche à sa taille native détectée</li>
                <li>Naviguez entre les images avec les flèches</li>
                <li>Testez le zoom et les captions</li>
                <li>Fermez avec Échap ou en cliquant à l&apos;extérieur</li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <h4 className="font-semibold mb-2 text-amber-900 dark:text-amber-100">
                ⚠️ Points importants à vérifier :
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-amber-700 dark:text-amber-300">
                <li>Aucune dimension n&apos;est codée en dur dans le code</li>
                <li>Toutes les dimensions sont détectées automatiquement</li>
                <li>Le système fonctionne avec le format de données du CMS (string[][])</li>
                <li>Les images gardent leurs proportions réelles</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

 