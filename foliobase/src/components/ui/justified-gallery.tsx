"use client"

import { useRef, useMemo } from "react"
import { RowsPhotoAlbum } from "react-photo-album"
import "react-photo-album/rows.css"
import { Gallery, GalleryImage, GalleryItem } from "./gallery"

export interface JustifiedGalleryProps {
  images: GalleryImage[]
  className?: string
  withCaption?: boolean
  targetRowHeight?: number
  spacing?: number
  containerWidth?: number
  options?: Record<string, unknown>
}

export function JustifiedGallery({
  images,
  className,
  withCaption = false,
  targetRowHeight = 200,
  spacing = 8,
  containerWidth,
  options = {}
}: JustifiedGalleryProps) {
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Transformation des images pour react-photo-album avec validation et mémorisation
  const photos = useMemo(() => {
    if (!images || images.length === 0) {
      return []
    }
    return images.map((image, index) => ({
      src: image.src,
      width: Math.max(image.width || 800, 100), // Minimum 100px pour éviter les erreurs
      height: Math.max(image.height || 600, 100), // Minimum 100px pour éviter les erreurs
      alt: image.alt || `Image ${index + 1}`,
      caption: image.caption,
      key: `photo-${index}-${image.src}` // Clé unique incluant l'URL pour forcer la mise à jour
    }))
  }, [images])

  // Si pas d'images, ne rien afficher
  if (!images || images.length === 0) {
    return null
  }

  // S'assurer que triggerRefs a la bonne taille
  if (triggerRefs.current.length !== images.length) {
    triggerRefs.current = new Array(images.length).fill(null)
  }

  return (
    <div className={className}>
      <Gallery 
        images={images} 
        withCaption={withCaption}
        options={{
          bgOpacity: 0.9,
          loop: true,
          showHideOpacity: true,
          ...options
        }}
      >
        {/* Éléments PhotoSwipe cachés pour la lightbox */}
        {images.map((image, index) => (
          <GalleryItem key={`hidden-${index}-${image.src}`} image={image}>
            {({ ref, open }) => (
              <button
                ref={(el) => {
                  triggerRefs.current[index] = el
                  if (typeof ref === 'function') {
                    ref(el)
                  }
                }}
                onClick={open}
                style={{ display: 'none' }}
                aria-hidden="true"
              />
            )}
          </GalleryItem>
        ))}
        
        {/* Galerie justifiée visible */}
        <RowsPhotoAlbum
          photos={photos}
          targetRowHeight={targetRowHeight}
          spacing={spacing}
          defaultContainerWidth={containerWidth}
          onClick={({ index }) => {
            // Déclencher le bouton PhotoSwipe correspondant via ref
            const trigger = triggerRefs.current[index]
            if (trigger) {
              trigger.click()
            }
          }}
          // Forcer la mise à jour en passant une clé basée sur les dimensions
          key={`justified-${photos.map(p => `${p.width}x${p.height}`).join('-')}`}
        />
      </Gallery>
    </div>
  )
} 