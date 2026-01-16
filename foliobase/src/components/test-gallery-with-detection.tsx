"use client"

import { GridGallery } from "@/components/ui/grid-gallery"
import { JustifiedGallery } from "@/components/ui/justified-gallery"
import { MasonryGallery } from "@/components/ui/masonry-gallery"
import { useGallery } from "@/hooks/use-gallery"
import { Loader2, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TestGalleryWithDetectionProps {
  galleryData: string[][]
  showAllTypes?: boolean
}

export function TestGalleryWithDetection({ 
  galleryData, 
  showAllTypes = false 
}: TestGalleryWithDetectionProps) {
  const { images, hasImages, isLoading, count } = useGallery(galleryData, {
    loadRealDimensions: true,
    defaultWidth: 1200,
    defaultHeight: 800
  })

  if (!hasImages) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune image à afficher
      </div>
    )
  }

  const renderSingleGallery = () => (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <p className="text-sm text-muted-foreground">
          Cette galerie utilise le hook useGallery qui détecte automatiquement les vraies dimensions des images.
        </p>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Chargement des dimensions...
            </Badge>
          ) : (
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {count} images détectées
            </Badge>
          )}
        </div>
      </div>
      
      <div className="border-2 border-dashed border-muted rounded-lg p-4">
        <JustifiedGallery
          images={images}
          targetRowHeight={180}
          spacing={6}
          withCaption={true}
          options={{
            bgOpacity: 0.9,
            loop: true,
            showHideOpacity: true
          }}
        />
      </div>

      {/* Informations de debug */}
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <h4 className="text-sm font-semibold mb-2">Informations de debug :</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {images.map((image, index) => (
            <div key={index} className="flex justify-between">
              <span className="truncate">Image {index + 1}</span>
              <span className="text-muted-foreground">{image.width} × {image.height}px</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderAllGalleries = () => (
    <div className="space-y-8">
      {/* Status global */}
      <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Détection des dimensions en cours...
            </Badge>
          ) : (
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {count} images - Dimensions détectées !
            </Badge>
          )}
        </div>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Toutes les galeries utilisent les mêmes données avec détection automatique
        </p>
      </div>

      {/* Galerie Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Grid Gallery (Grille CSS)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Grille CSS avec colonnes responsives - dimensions détectées automatiquement
          </p>
        </CardHeader>
        <CardContent>
          <GridGallery
            images={images}
            columns={{ default: 2, md: 3, lg: 4 }}
            aspectRatio="auto"
            withCaption={true}
          />
        </CardContent>
      </Card>

      {/* Galerie Justified */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Justified Gallery (Style Google Photos)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Rangées harmonieuses avec hauteur cible - utilise les vraies dimensions détectées
          </p>
        </CardHeader>
        <CardContent>
          <JustifiedGallery
            images={images}
            targetRowHeight={200}
            spacing={8}
            withCaption={true}
            options={{
              bgOpacity: 0.9,
              loop: true,
              showHideOpacity: true
            }}
          />
        </CardContent>
      </Card>

      {/* Galerie Masonry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Masonry Gallery (Style Pinterest)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Colonnes de largeur égale avec hauteurs variables - dimensions réelles détectées
          </p>
        </CardHeader>
        <CardContent>
          <MasonryGallery
            images={images}
            columns={3}
            spacing={8}
            withCaption={true}
            options={{
              bgOpacity: 0.9,
              loop: true,
              showHideOpacity: true
            }}
          />
        </CardContent>
      </Card>

      {/* Debug détaillé */}
      <Card>
        <CardHeader>
          <CardTitle>🐛 Informations de Debug - Dimensions Détectées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="aspect-square mb-2 rounded overflow-hidden bg-muted">
                  <img 
                    src={image.src} 
                    alt={image.alt || `Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <p className="font-medium">Image {index + 1}</p>
                  <p className="text-muted-foreground">
                    <strong>Dimensions:</strong> {image.width} × {image.height}px
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Ratio:</strong> {(image.width / image.height).toFixed(2)}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Type:</strong> {
                      image.width / image.height > 1.3 ? 'Paysage' :
                      image.width / image.height < 0.8 ? 'Portrait' : 'Carré'
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return showAllTypes ? renderAllGalleries() : renderSingleGallery()
} 