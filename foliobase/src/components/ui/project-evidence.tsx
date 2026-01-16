'use client'

import { ProjectEvidence } from '@/lib/content'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PdfViewer } from '@/components/ui/pdf-viewer'
import { ExternalLink, Image as ImageIcon, FileText, PlayCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect, useRef } from 'react'

interface ProjectEvidenceProps {
  evidence: ProjectEvidence
  className?: string
  compact?: boolean
}

interface ProjectEvidenceListProps {
  evidences: ProjectEvidence[]
  className?: string
  title?: string
  compact?: boolean
  maxDisplay?: number
}

// Fonction utilitaire pour extraire l'ID YouTube d'une URL
function getYouTubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{10,11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

// Composant YouTube Embed avec lazy loading basé sur viewport
function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded) {
            setIsLoaded(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1, // Se déclenche quand 10% du composant est visible
        rootMargin: '50px' // Charge 50px avant d'entrer dans le viewport
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [isLoaded])

  if (hasError) {
    return (
      <div className="aspect-video rounded-lg overflow-hidden bg-muted border-2 border-dashed border-muted-foreground/20">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center space-y-2">
            <PlayCircle className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">Vidéo non disponible</p>
            <p className="text-xs text-muted-foreground">ID: {videoId}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="aspect-video rounded-lg overflow-hidden bg-muted">
      {isLoaded ? (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          loading="lazy"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <div className="text-center space-y-2">
            <PlayCircle className="h-12 w-12 text-muted-foreground mx-auto animate-pulse" />
            <p className="text-sm text-muted-foreground">Chargement de la vidéo...</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Composant pour une preuve individuelle
export function ProjectEvidenceItem({ evidence, className, compact = false }: ProjectEvidenceProps) {
  const getTypeIcon = () => {
    switch (evidence.type) {
      case 'Image':
        return <ImageIcon className="h-4 w-4" />
      case 'PDF':
        return <FileText className="h-4 w-4" />
      case 'URL':
        return <ExternalLink className="h-4 w-4" />
      case 'Video':
        return <PlayCircle className="h-4 w-4" />
    }
  }

  const getTypeColor = () => {
    switch (evidence.type) {
      case 'Image':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'PDF':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'URL':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'Video':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    }
  }

  if (compact) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Badge variant="secondary" className={getTypeColor()}>
              <span className="flex items-center gap-1">
                {getTypeIcon()}
                {evidence.type}
              </span>
            </Badge>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{evidence.description}</p>
              {evidence.type === 'URL' && evidence.url && (
                <Button variant="link" size="sm" className="h-auto p-0 mt-1" asChild>
                  <a href={evidence.url} target="_blank" rel="noopener noreferrer">
                    Voir le lien
                  </a>
                </Button>
              )}
              {evidence.type === 'Video' && evidence.youtube_url && (
                <Button variant="link" size="sm" className="h-auto p-0 mt-1" asChild>
                  <a href={evidence.youtube_url} target="_blank" rel="noopener noreferrer">
                    Voir la vidéo
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            {getTypeIcon()}
            {evidence.description}
          </CardTitle>
          <Badge variant="secondary" className={getTypeColor()}>
            {evidence.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {evidence.type === 'Image' && evidence.file && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={evidence.file}
              alt={evidence.description}
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {evidence.type === 'PDF' && evidence.pdf && (
          <PdfViewer
            url={evidence.pdf}
            title={evidence.description}
            allowDownload={true}
          />
        )}

        {evidence.type === 'URL' && evidence.url && (
          <div className="space-y-3">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Lien externe :</p>
              <p className="text-sm font-mono break-all">{evidence.url}</p>
            </div>
            <Button asChild className="w-full">
              <a href={evidence.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Ouvrir le lien
              </a>
            </Button>
          </div>
        )}

        {evidence.type === 'Video' && evidence.youtube_url && (
          <div className="space-y-3">
            {(() => {
              const videoId = getYouTubeVideoId(evidence.youtube_url)
              return videoId ? (
                <YouTubeEmbed videoId={videoId} title={evidence.description} />
              ) : (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">URL YouTube :</p>
                  <p className="text-sm font-mono break-all">{evidence.youtube_url}</p>
                </div>
              )
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Composant pour une liste de preuves
export function ProjectEvidenceList({ 
  evidences, 
  className, 
  title = "Preuves", 
  compact = false,
  maxDisplay 
}: ProjectEvidenceListProps) {
  if (!evidences || evidences.length === 0) {
    return null
  }

  const displayedEvidences = maxDisplay ? evidences.slice(0, maxDisplay) : evidences
  const remainingCount = maxDisplay && evidences.length > maxDisplay 
    ? evidences.length - maxDisplay 
    : 0

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Badge variant="outline">
          {evidences.length} preuve{evidences.length > 1 ? 's' : ''}
        </Badge>
      </div>

      <div className={cn(
        "space-y-4",
        compact ? "grid grid-cols-1 gap-3" : "space-y-6"
      )}>
        {displayedEvidences.map((evidence, index) => (
          <ProjectEvidenceItem
            key={index}
            evidence={evidence}
            compact={compact}
          />
        ))}
      </div>

      {remainingCount > 0 && (
        <div className="text-center pt-4">
          <Badge variant="secondary">
            +{remainingCount} preuve{remainingCount > 1 ? 's' : ''} supplémentaire{remainingCount > 1 ? 's' : ''}
          </Badge>
        </div>
      )}
    </div>
  )
}

// Export du composant principal pour rétrocompatibilité
export { ProjectEvidenceList as ProjectEvidence } 