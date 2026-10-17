'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ExternalLink, X } from 'lucide-react'
import { TrailerPedido } from './FichaProvider'
import { trailerEmbed, trailerSearch } from '../_lib/trailers'

interface Props {
  trailer: TrailerPedido
  onClose: () => void
}

const SALIDA = 200

// Reproduce el tráiler de YouTube dentro de la página
export default function TrailerModal({ trailer, onClose }: Props) {
  const [cerrando, setCerrando] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  const cerrar = useCallback(() => {
    setCerrando(true)
    setTimeout(onClose, SALIDA)
  }, [onClose])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar()
    }
    window.addEventListener('keydown', onKey)
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previo
    }
  }, [cerrar])

  return (
    <div
      onClick={cerrar}
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-opacity duration-200 ease-out sm:p-10 ${
        cerrando ? 'opacity-0' : 'motion-safe:animate-desvanecer'
      }`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Tráiler de ${trailer.title}`}
        onClick={(e) => e.stopPropagation()}
        className={`cartelera relative w-full max-w-5xl font-texto text-pantalla transition-[opacity,transform] duration-200 ease-out ${
          cerrando ? 'scale-[0.97] opacity-0' : 'motion-safe:animate-aparecer'
        }`}
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="font-marquee text-2xl font-extrabold sm:text-3xl">
            {trailer.title} <span className="text-rosa">{trailer.year}</span>
          </h2>
          <button
            ref={closeRef}
            onClick={cerrar}
            aria-label="Cerrar tráiler"
            className="boton-cine flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-foco text-sala hover:bg-pantalla focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pantalla"
          >
            <X aria-hidden className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>

        <div className="aspect-video overflow-hidden rounded-xl bg-black shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] ring-1 ring-foco/30">
          {trailer.videoId ? (
            <iframe
              src={trailerEmbed(trailer.videoId)}
              title={`Tráiler de ${trailer.title}`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="h-full w-full"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
              <p className="max-w-md text-pantalla/90">Este título no tiene un tráiler guardado en la cartelera.</p>
              <a
                href={trailerSearch(trailer.title, trailer.year)}
                target="_blank"
                rel="noreferrer"
                className="boton-cine inline-flex items-center gap-2 rounded-full bg-foco px-5 py-2.5 font-semibold text-sala hover:bg-pantalla"
              >
                Buscar el tráiler en YouTube
                <ExternalLink aria-hidden className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
