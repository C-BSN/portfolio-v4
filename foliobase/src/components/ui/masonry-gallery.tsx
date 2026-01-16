"use client"

import { useRef } from "react"
import { MasonryPhotoAlbum } from "react-photo-album"
import "react-photo-album/masonry.css"
import { Gallery, GalleryImage, GalleryItem } from "./gallery"

export interface MasonryGalleryProps {
  images: GalleryImage[]
  className?: string
  withCaption?: boolean
  columns?: number
  spacing?: number
  options?: Record<string, unknown>
}

export function MasonryGallery({
  images,
  className,
  withCaption = false,
  columns = 3,
  spacing = 8,
  options = {}
}: MasonryGalleryProps) {
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Si pas d'images, ne rien afficher
  if (!images || images.length === 0) {
    return null
  }

  // Transformation des images pour react-photo-album
  const photos = images.map((image) => ({
    src: image.src,
    width: image.width,
    height: image.height,
    alt: image.alt,
    caption: image.caption
  }))

  return (
    <div className={className}>
      <Gallery 
        images={images} 
        withCaption={withCaption}
        options={options}
      >
        {/* Éléments PhotoSwipe cachés pour la lightbox */}
        {images.map((image, index) => (
          <GalleryItem key={`hidden-${index}`} image={image}>
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
        
        {/* Galerie masonry visible */}
        <MasonryPhotoAlbum
          photos={photos}
          columns={columns}
          spacing={spacing}
          onClick={({ index }) => {
            // Déclencher le bouton PhotoSwipe correspondant via ref
            const trigger = triggerRefs.current[index]
            if (trigger) {
              trigger.click()
            }
          }}
        />
      </Gallery>
    </div>
  )
} 