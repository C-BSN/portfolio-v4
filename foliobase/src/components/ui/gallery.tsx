"use client"

import { ReactNode } from "react"
import { Gallery as PhotoSwipeGallery, Item } from "react-photoswipe-gallery"
import "photoswipe/dist/photoswipe.css"
import { cn } from "@/lib/utils"

export interface GalleryImage {
  src: string
  width: number
  height: number
  alt?: string
  caption?: string
}

export interface GalleryProps {
  images: GalleryImage[]
  children?: ReactNode
  className?: string
  withCaption?: boolean
  options?: Record<string, unknown>
}

export interface GalleryItemProps {
  image: GalleryImage
  children: React.ComponentProps<typeof Item>['children']
}

export function Gallery({ 
  children, 
  className, 
  withCaption = false,
  options = {}
}: GalleryProps) {
  return (
    <div className={cn("w-full", className)}>
      <PhotoSwipeGallery 
        withCaption={withCaption}
        options={{
          // Options par défaut pour une bonne UX
          bgOpacity: 0.8,
          loop: false,
          showHideOpacity: true,
          ...options
        }}
      >
        {children}
      </PhotoSwipeGallery>
    </div>
  )
}

export function GalleryItem({ image, children }: GalleryItemProps) {
  return (
    <Item
      original={image.src}
      thumbnail={image.src}
      width={image.width}
      height={image.height}
      caption={image.caption}
    >
      {children}
    </Item>
  )
}

Gallery.Item = GalleryItem 