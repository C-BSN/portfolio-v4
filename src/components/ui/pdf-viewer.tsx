'use client'

import { useState } from 'react'
import { Download, ExternalLink, FileText, Eye } from 'lucide-react'
import { cn, fixCloudinaryPdfUrl, getCloudinaryPdfPreviewUrl, isCloudinaryPdf } from '@/lib/utils'

interface PdfViewerProps {
  url: string | string[]
  title?: string
  className?: string
  allowDownload?: boolean
  isDark?: boolean
  accentColor?: string
}

export function PdfViewer({
  url,
  title,
  className,
  allowDownload = true,
  isDark = true,
  accentColor,
}: PdfViewerProps) {
  const [previewError, setPreviewError] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const [hovered, setHovered] = useState(false)

  const pdfUrl = fixCloudinaryPdfUrl(url)
  const isCloudinary = isCloudinaryPdf(pdfUrl)
  const previewUrl = isCloudinary ? getCloudinaryPdfPreviewUrl(url) : ''

  const accent = accentColor || (isDark ? '#00f3ff' : '#c45880')
  const panelBg = isDark ? 'rgba(5,5,5,0.75)' : 'rgba(255,255,255,0.9)'
  const borderCol = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(26,47,90,0.15)'
  const textCol = isDark ? '#F0F0F0' : '#1a2f5a'
  const subtleText = isDark ? 'rgba(240,240,240,0.45)' : 'rgba(26,47,90,0.45)'

  // ── Fallback : document non disponible ──────────────────────────────────────
  const Fallback = () => (
    <div
      className={cn('rounded-lg overflow-hidden', className)}
      style={{ border: `1px solid ${borderCol}`, background: panelBg }}
    >
      <div className="flex flex-col items-center gap-5 py-10 px-6">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
        >
          <FileText className="h-7 w-7" style={{ color: accent }} />
        </div>
        <p
          className="text-sm uppercase tracking-widest text-center"
          style={{ fontFamily: "'Oswald', sans-serif", color: subtleText }}
        >
          {title || 'Document PDF'}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          {allowDownload && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 text-xs uppercase tracking-widest transition-all duration-200"
              style={{
                border: `1px solid ${accent}`,
                color: accent,
                fontFamily: "'Oswald', sans-serif",
              }}
            >
              <Download className="h-3.5 w-3.5" />
              Télécharger
            </a>
          )}
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 text-xs uppercase tracking-widest transition-all duration-200"
            style={{
              border: `1px solid ${accent}`,
              color: accent,
              fontFamily: "'Oswald', sans-serif",
            }}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Ouvrir
          </a>
        </div>
      </div>
    </div>
  )

  // ── Cloudinary : aperçu image + overlay ────────────────────────────────────
  if (isCloudinary) {
    if (previewError) return <Fallback />

    return (
      <div
        className={cn('group relative rounded-lg overflow-hidden', className)}
        style={{
          border: `1px solid ${borderCol}`,
          boxShadow: hovered
            ? `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px ${accent}40`
            : '0 8px 32px rgba(0,0,0,0.35)',
          transition: 'box-shadow 0.35s ease, transform 0.35s ease',
          transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Aperçu de la première page */}
        <div className="relative overflow-hidden">
          <img
            src={previewUrl}
            alt={title || 'Aperçu du PDF'}
            className="w-full h-auto block"
            style={{
              filter: hovered ? 'brightness(0.45) blur(0px)' : 'brightness(1)',
              transition: 'filter 0.35s ease',
            }}
            onError={() => setPreviewError(true)}
          />

          {/* Coin replié (paper corner) */}
          <div
            className="absolute top-0 right-0 pointer-events-none"
            style={{
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '0 32px 32px 0',
              borderColor: `transparent ${isDark ? '#0a0a0a' : '#e8eef8'} transparent transparent`,
              filter: 'drop-shadow(-3px 3px 4px rgba(0,0,0,0.4))',
            }}
          />
          {/* Ombre douce sur le coin replié */}
          <div
            className="absolute top-0 right-0 pointer-events-none"
            style={{
              width: 32,
              height: 32,
              background: `linear-gradient(225deg, ${accent}20, transparent 60%)`,
            }}
          />

          {/* Overlay au survol */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            style={{
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.65))',
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-1"
              style={{ background: `${accent}20`, border: `1px solid ${accent}60` }}
            >
              <FileText className="h-5 w-5" style={{ color: accent }} />
            </div>
            {title && (
              <p
                className="text-sm uppercase tracking-widest px-4 text-center"
                style={{ fontFamily: "'Oswald', sans-serif", color: '#fff' }}
              >
                {title}
              </p>
            )}
            <div className="flex flex-wrap gap-3 justify-center mt-1">
              {allowDownload && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2 text-xs uppercase tracking-widest backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
                  style={{
                    border: `1px solid ${accent}`,
                    color: accent,
                    fontFamily: "'Oswald', sans-serif",
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <Download className="h-3.5 w-3.5" />
                  Télécharger
                </a>
              )}
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2 text-xs uppercase tracking-widest backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
                style={{
                  border: `1px solid ${accent}`,
                  color: accent,
                  fontFamily: "'Oswald', sans-serif",
                }}
                onClick={e => e.stopPropagation()}
              >
                <Eye className="h-3.5 w-3.5" />
                Ouvrir
              </a>
            </div>
          </div>
        </div>

        {/* Barre inférieure */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{
            background: panelBg,
            borderTop: `1px solid ${borderCol}`,
          }}
        >
          <FileText className="h-4 w-4 flex-shrink-0" style={{ color: accent }} />
          <span
            className="text-xs uppercase tracking-widest flex-1 truncate"
            style={{ fontFamily: "'Oswald', sans-serif", color: textCol }}
          >
            {title || 'Document PDF'}
          </span>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs uppercase tracking-wider opacity-50 hover:opacity-100 transition-opacity"
            style={{ color: accent, fontFamily: "'Oswald', sans-serif" }}
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    )
  }

  // ── Non-Cloudinary : iframe ──────────────────────────────────────────────────
  if (iframeError) return <Fallback />

  return (
    <div
      className={cn('rounded-lg overflow-hidden', className)}
      style={{
        border: `1px solid ${borderCol}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      {/* Barre titre */}
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ background: panelBg, borderBottom: `1px solid ${borderCol}` }}
      >
        <FileText className="h-4 w-4 flex-shrink-0" style={{ color: accent }} />
        <span
          className="text-xs uppercase tracking-widest flex-1 truncate"
          style={{ fontFamily: "'Oswald', sans-serif", color: textCol }}
        >
          {title || 'Document PDF'}
        </span>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs uppercase tracking-wider opacity-50 hover:opacity-100 transition-opacity"
          style={{ color: accent, fontFamily: "'Oswald', sans-serif" }}
        >
          <ExternalLink className="h-3 w-3" />
          Ouvrir
        </a>
      </div>
      <div className="w-full aspect-[210/297]">
        <iframe
          src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
          width="100%"
          height="100%"
          className="border-0"
          title={title || 'Document PDF'}
          onError={() => setIframeError(true)}
        />
      </div>
    </div>
  )
}
