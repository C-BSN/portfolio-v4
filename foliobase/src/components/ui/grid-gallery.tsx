"use client"

import Image from "next/image"
import { Gallery, GalleryImage, GalleryItem } from "./gallery"
import { cn } from "@/lib/utils"

export interface GridGalleryProps {
  images: GalleryImage[]
  className?: string
  gridClassName?: string
  imageClassName?: string
  withCaption?: boolean
  aspectRatio?: "square" | "video" | "auto"
  columns?: {
    default: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
}

export function GridGallery({
  images,
  className,
  gridClassName,
  imageClassName,
  withCaption = false,
  aspectRatio = "auto",
  columns = { default: 2, md: 3, lg: 4 }
}: GridGalleryProps) {
  // Construction des classes CSS pour les colonnes responsive
  const gridClasses = cn(
    "grid gap-4",
    `grid-cols-${columns.default}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
    gridClassName
  )

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    auto: ""
  }

  return (
    <Gallery 
      images={images} 
      className={className} 
      withCaption={withCaption}
    >
      <div className={gridClasses}>
        {images.map((image, index) => (
          <GalleryItem key={index} image={image}>
            {({ ref, open }) => (
              <div 
                className={cn(
                  "rounded-lg overflow-hidden cursor-pointer group",
                  aspectClasses[aspectRatio],
                  imageClassName
                )}
                onClick={open}
              >
                <Image
                  ref={ref}
                  src={image.src}
                  alt={image.alt || `Image ${index + 1}`}
                  width={image.width}
                  height={image.height}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {withCaption && image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {image.caption}
                  </div>
                )}
              </div>
            )}
          </GalleryItem>
        ))}
      </div>
    </Gallery>
  )
} 