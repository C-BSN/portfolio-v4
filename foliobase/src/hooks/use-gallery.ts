import { useMemo, useState, useEffect } from "react"
import { GalleryImage } from "@/components/ui/gallery"

export interface ProjectGalleryItem {
  image: string
  caption?: string
}

export interface UseGalleryOptions {
  defaultWidth?: number
  defaultHeight?: number
  loadRealDimensions?: boolean
}

// Fonction pour charger les vraies dimensions d'une image
function loadImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`))
    }
    img.src = src
  })
}

// Fonction pour détecter si c'est une URL Cloudinary
function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com')
}

// Fonction pour estimer les dimensions basées sur des ratios communs
function estimateDimensions(url: string, defaultWidth: number, defaultHeight: number): { width: number; height: number } {
  // Pour les images Cloudinary, utiliser des ratios plus réalistes
  if (isCloudinaryUrl(url)) {
    // Utiliser un ratio 4:3 par défaut pour les photos
    const aspectRatio = 4 / 3
    return {
      width: Math.round(defaultHeight * aspectRatio),
      height: defaultHeight
    }
  }
  
  return { width: defaultWidth, height: defaultHeight }
}

export function useGallery(
  items: ProjectGalleryItem[] | string[][] | undefined,
  options: UseGalleryOptions = {}
) {
  const { defaultWidth = 1200, defaultHeight = 800, loadRealDimensions = true } = options
  const [realDimensions, setRealDimensions] = useState<Map<string, { width: number; height: number }>>(new Map())

  // Extraire les URLs des images
  const imageUrls = useMemo(() => {
    if (!items || items.length === 0) return []
    
    if (Array.isArray(items[0])) {
      return items[0] as string[]
    }
    
    return (items as ProjectGalleryItem[]).map(item => item.image)
  }, [items])

  // Charger les vraies dimensions des images
  useEffect(() => {
    if (!loadRealDimensions || imageUrls.length === 0) return

    const loadDimensions = async () => {
      const dimensionsMap = new Map<string, { width: number; height: number }>()
      
      // Charger les dimensions en parallèle avec un délai pour éviter de surcharger
      const promises = imageUrls.map(async (url, index) => {
        try {
          // Petit délai pour éviter de surcharger le navigateur
          await new Promise(resolve => setTimeout(resolve, index * 50))
          const dimensions = await loadImageDimensions(url)
          dimensionsMap.set(url, dimensions)
        } catch (error) {
          console.warn(`Failed to load dimensions for ${url}:`, error)
          // Utiliser les estimations en cas d'erreur
          const estimated = estimateDimensions(url, defaultWidth, defaultHeight)
          dimensionsMap.set(url, estimated)
        }
      })

      await Promise.allSettled(promises)
      setRealDimensions(dimensionsMap)
    }

    loadDimensions()
  }, [imageUrls, defaultWidth, defaultHeight, loadRealDimensions])

  const galleryImages = useMemo<GalleryImage[]>(() => {
    if (!items || items.length === 0) return []
    
    // Cas 1: Format YAML - tableau de tableaux d'URLs (venant du YAML)
    if (Array.isArray(items[0])) {
      const urls = items[0] as string[]
      return urls.map((url, index) => {
        // Utiliser les vraies dimensions si disponibles, sinon les estimations
        const realDims = realDimensions.get(url)
        const dimensions = realDims || estimateDimensions(url, defaultWidth, defaultHeight)
        
        return {
          src: url,
          width: dimensions.width,
          height: dimensions.height,
          alt: `Image ${index + 1}`,
          caption: undefined
        }
      })
    }
    
    // Cas 2: Format objet - tableau d'objets ProjectGalleryItem
    return (items as ProjectGalleryItem[]).map((item, index) => {
      // Utiliser les vraies dimensions si disponibles, sinon les estimations
      const realDims = realDimensions.get(item.image)
      const dimensions = realDims || estimateDimensions(item.image, defaultWidth, defaultHeight)
      
      return {
        src: item.image,
        width: dimensions.width,
        height: dimensions.height,
        alt: `Image ${index + 1}`,
        caption: item.caption
      }
    })
  }, [items, defaultWidth, defaultHeight, realDimensions])

  return {
    images: galleryImages,
    hasImages: galleryImages.length > 0,
    count: galleryImages.length,
    isLoading: loadRealDimensions && realDimensions.size < imageUrls.length
  }
}

// Fonction utilitaire pour transformer une galerie de projet (version synchrone)
export function transformProjectGallery(
  gallery: ProjectGalleryItem[] | string[][] | undefined,
  options: UseGalleryOptions = {}
): GalleryImage[] {
  if (!gallery || gallery.length === 0) return []
  
  const { defaultWidth = 1200, defaultHeight = 800 } = options
  
  // Cas 1: Format YAML - tableau de tableaux d'URLs
  if (Array.isArray(gallery[0])) {
    const urls = gallery[0] as string[]
    return urls.map((url, index) => {
      const dimensions = estimateDimensions(url, defaultWidth, defaultHeight)
      
      return {
        src: url,
        width: dimensions.width,
        height: dimensions.height,
        alt: `Image ${index + 1}`,
        caption: undefined
      }
    })
  }
  
  // Cas 2: Format objet - tableau d'objets ProjectGalleryItem
  return (gallery as ProjectGalleryItem[]).map((item, index) => {
    const dimensions = estimateDimensions(item.image, defaultWidth, defaultHeight)
    
    return {
      src: item.image,
      width: dimensions.width,
      height: dimensions.height,
      alt: `Image ${index + 1}`,
      caption: item.caption
    }
  })
} 