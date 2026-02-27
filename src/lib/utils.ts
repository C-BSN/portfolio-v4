import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extrait l'URL string depuis une valeur qui peut être un tableau (YAML CMS)
 */
export function resolveUrl(url: string | string[] | undefined | null): string {
  if (!url) return ''
  return Array.isArray(url) ? url[0] || '' : url
}

/**
 * Vérifie si une URL est un PDF Cloudinary
 */
export function isCloudinaryPdf(url: string): boolean {
  return url.includes('res.cloudinary.com') && url.toLowerCase().endsWith('.pdf')
}

/**
 * Génère une URL de preview image pour un PDF Cloudinary.
 * Cloudinary peut bloquer la livraison directe des PDFs (paramètre de sécurité),
 * mais la conversion en image (pg_1,f_jpg) fonctionne toujours.
 * Cela affiche la première page du PDF en tant qu'image JPG.
 */
export function getCloudinaryPdfPreviewUrl(url: string | string[]): string {
  const rawUrl = resolveUrl(url)
  if (!rawUrl) return ''
  
  if (isCloudinaryPdf(rawUrl)) {
    // Injecte la transformation pg_1,f_jpg après /upload/
    return rawUrl.replace('/upload/', '/upload/pg_1,f_jpg/')
  }
  
  return rawUrl
}

/**
 * Résout l'URL d'un PDF depuis une valeur CMS (peut être un tableau).
 * Retourne l'URL directe du PDF telle quelle.
 */
export function fixCloudinaryPdfUrl(url: string | string[]): string {
  return resolveUrl(url)
}
