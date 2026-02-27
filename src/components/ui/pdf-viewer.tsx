'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, ExternalLink, FileText } from 'lucide-react'
import { cn, fixCloudinaryPdfUrl, getCloudinaryPdfPreviewUrl, isCloudinaryPdf } from '@/lib/utils'

interface PdfViewerProps {
  url: string | string[]
  title?: string
  className?: string
  allowDownload?: boolean
}

export function PdfViewer({ 
  url, 
  title, 
  className,
  allowDownload = true
}: PdfViewerProps) {
  const [hasError, setHasError] = useState(false)
  const [previewError, setPreviewError] = useState(false)
  
  // Résoudre l'URL (gère les tableaux YAML du CMS)
  const pdfUrl = fixCloudinaryPdfUrl(url)
  const isCloudinary = isCloudinaryPdf(pdfUrl)
  const previewUrl = isCloudinary ? getCloudinaryPdfPreviewUrl(url) : ''

  // Pour les PDFs Cloudinary, afficher un aperçu image + bouton téléchargement
  // car Cloudinary peut bloquer la livraison directe des PDFs
  if (isCloudinary) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-0">
          {!previewError ? (
            <div className="w-full">
              <img
                src={previewUrl}
                alt={title || "Aperçu du PDF"}
                className="w-full h-auto rounded-t-lg"
                onError={() => setPreviewError(true)}
              />
            </div>
          ) : (
            <div className="p-6 text-center space-y-2">
              <FileText className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-300">Aperçu non disponible</p>
            </div>
          )}
          <div className="p-4 flex gap-2 justify-center">
            {allowDownload && (
              <Button variant="outline" asChild>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger le PDF
                </a>
              </Button>
            )}
            <Button variant="outline" asChild>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Ouvrir
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Pour les PDFs non-Cloudinary, utiliser l'iframe classique
  if (hasError) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6 text-center space-y-4">
          <FileText className="h-12 w-12 text-gray-400 mx-auto" />
          <div>
            <p className="text-sm text-gray-300 mb-2">Impossible d&apos;afficher le PDF</p>
            <p className="text-xs text-gray-400 break-all">{pdfUrl}</p>
          </div>
          <div className="flex gap-2 justify-center">
            {allowDownload && (
              <Button variant="outline" asChild>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </a>
              </Button>
            )}
            <Button variant="outline" asChild>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Ouvrir dans un nouvel onglet
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-0">
        <div className="w-full aspect-[210/297]">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
            width="100%"
            height="100%"
            className="border-0"
            title={title || "Document PDF"}
            onError={() => setHasError(true)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
