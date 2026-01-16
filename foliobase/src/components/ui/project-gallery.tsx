"use client"

import { useState } from "react"
import { GridGallery } from "./grid-gallery"
import { JustifiedGallery } from "./justified-gallery"
import { MasonryGallery } from "./masonry-gallery"
import { useGallery, ProjectGalleryItem } from "@/hooks/use-gallery"
import { Button } from "./button"
import { Skeleton } from "./skeleton"
import { Grid, LayoutGrid, Columns, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ProjectGalleryProps {
  gallery: ProjectGalleryItem[] | string[][] | undefined
  title?: string
  className?: string
  defaultLayout?: "grid" | "justified" | "masonry"
  showLayoutSwitcher?: boolean
}

export type GalleryLayout = "grid" | "justified" | "masonry"

export function ProjectGallery({
  gallery,
  title = "Galerie",
  className,
  defaultLayout = "grid",
  showLayoutSwitcher = true
}: ProjectGalleryProps) {
  const [currentLayout, setCurrentLayout] = useState<GalleryLayout>(defaultLayout)
  const { images, hasImages, isLoading } = useGallery(gallery, {
    loadRealDimensions: true,
    defaultWidth: 1200,
    defaultHeight: 800
  })

  if (!hasImages) {
    return null
  }

  const layoutIcons = {
    grid: Grid,
    justified: LayoutGrid,
    masonry: Columns
  }

  const layoutLabels = {
    grid: "Grille",
    justified: "Justifiée", 
    masonry: "Maçonnerie"
  }

  const renderGallery = () => {
    const commonProps = {
      images,
      className: "mt-6",
      withCaption: true
    }

    // Si on est en mode justified et que les dimensions se chargent encore, 
    // utiliser une hauteur de ligne plus conservatrice
    const targetRowHeight = isLoading ? 150 : 200

    switch (currentLayout) {
      case "justified":
        return (
          <JustifiedGallery 
            {...commonProps} 
            targetRowHeight={targetRowHeight}
            spacing={8}
          />
        )
      case "masonry":
        return <MasonryGallery {...commonProps} columns={3} spacing={8} />
      case "grid":
      default:
        return (
          <GridGallery 
            {...commonProps} 
            columns={{ default: 2, md: 3, lg: 4 }}
            aspectRatio="auto"
          />
        )
    }
  }

  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">{title}</h2>
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Optimisation des dimensions...</span>
            </div>
          )}
        </div>
        
        {showLayoutSwitcher && (
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {(Object.keys(layoutIcons) as GalleryLayout[]).map((layout) => {
              const Icon = layoutIcons[layout]
              const isActive = currentLayout === layout
              
              return (
                <Button
                  key={layout}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentLayout(layout)}
                  className={cn(
                    "h-8 w-8 p-0",
                    isActive && "bg-background shadow-sm"
                  )}
                  title={layoutLabels[layout]}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              )
            })}
          </div>
        )}
      </div>
      
      {/* Afficher un skeleton pendant le chargement initial si pas d'images encore */}
      {images.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full rounded-lg" />
          ))}
        </div>
      ) : (
        renderGallery()
      )}
    </div>
  )
} 