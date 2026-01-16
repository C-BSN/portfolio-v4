'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, ExternalLink, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  
  // Si c'est un tableau, prendre le premier élément
  const pdfUrl = Array.isArray(url) ? url[0] : url

  if (hasError) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6 text-center space-y-4">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <p className="text-sm text-muted-foreground mb-2">Impossible d&apos;afficher le PDF</p>
            <p className="text-xs text-muted-foreground break-all">{pdfUrl}</p>
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