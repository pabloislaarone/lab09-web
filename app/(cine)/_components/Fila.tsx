'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  id: string
  titulo: string
  descripcion?: string
  children: React.ReactNode
}

// Fila horizontal de pósters con flechas para desplazarse (el contenido llega del servidor)
export default function Fila({ id, titulo, descripcion, children }: Props) {
  const lista = useRef<HTMLUListElement>(null)
  const [inicio, setInicio] = useState(true)
  const [fin, setFin] = useState(false)

  // Activa o desactiva las flechas según la posición del scroll
  useEffect(() => {
    const el = lista.current
    if (!el) return
    const revisar = () => {
      setInicio(el.scrollLeft <= 4)
      setFin(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
    }
    requestAnimationFrame(revisar)
    el.addEventListener('scroll', revisar, { passive: true })
    window.addEventListener('resize', revisar)
    return () => {
      el.removeEventListener('scroll', revisar)
      window.removeEventListener('resize', revisar)
    }
  }, [])

  const mover = (direccion: 1 | -1) => {
    const el = lista.current
    if (el) el.scrollBy({ left: direccion * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  const flecha =
    'boton-cine flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-pantalla/20 text-pantalla hover:border-foco hover:text-foco disabled:cursor-default disabled:opacity-30 disabled:hover:border-pantalla/20 disabled:hover:text-pantalla focus-visible:outline-2 focus-visible:outline-offset-2'

  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="scroll-mt-24 py-10">
      <div className="mx-auto mb-6 flex max-w-6xl items-end justify-between gap-4 px-4 sm:px-6">
        <div>
          <h2 id={`${id}-titulo`} className="font-marquee text-4xl font-extrabold text-pantalla sm:text-5xl">
            {titulo}
          </h2>
          {descripcion && <p className="mt-1 text-sm text-rosa">{descripcion}</p>}
        </div>
        <div className="hidden gap-2 sm:flex">
          <button type="button" onClick={() => mover(-1)} disabled={inicio} aria-label={`Anterior en ${titulo}`} className={flecha}>
            <ChevronLeft aria-hidden className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => mover(1)} disabled={fin} aria-label={`Siguiente en ${titulo}`} className={flecha}>
            <ChevronRight aria-hidden className="h-5 w-5" />
          </button>
        </div>
      </div>

      <ul
        ref={lista}
        className="fila-scroll mx-auto flex max-w-6xl snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-6 pt-3 sm:px-6"
      >
        {children}
      </ul>
    </section>
  )
}
