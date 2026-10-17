'use client'

import { useEffect, useState } from 'react'
import { Heart, Search } from 'lucide-react'
import { useFavoritos } from './useFavoritos'

const ENLACES = [
  { href: '#trailers', texto: 'Tráileres' },
  { href: '#peliculas', texto: 'Películas' },
  { href: '#series', texto: 'Series' },
  { href: '#ranking', texto: 'Mejor calificadas' },
]

// Barra de navegación fija: transparente sobre la portada y sólida al bajar
export default function Header() {
  const [solida, setSolida] = useState(false)
  const favoritos = useFavoritos()

  useEffect(() => {
    const revisar = () => setSolida(window.scrollY > 40)
    requestAnimationFrame(revisar)
    window.addEventListener('scroll', revisar, { passive: true })
    return () => window.removeEventListener('scroll', revisar)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-out ${
        solida ? 'bg-sala/85 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav aria-label="Secciones" className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4 sm:px-6">
        <a
          href="#inicio"
          className="font-marquee text-3xl font-black text-foco drop-shadow-[0_0_14px_rgba(245,184,61,0.55)] focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          CARTELERA
        </a>

        <ul className="hidden flex-1 items-center gap-6 text-sm font-semibold lg:flex">
          {ENLACES.map((e) => (
            <li key={e.href}>
              <a href={e.href} className="enlace-nav text-pantalla/85 hover:text-pantalla">
                {e.texto}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <a
            href="#favoritos"
            aria-label={`Mis favoritos (${favoritos.length})`}
            className="boton-cine relative inline-flex items-center gap-2 rounded-full border border-pantalla/25 px-3 py-2 text-sm font-semibold text-pantalla hover:border-foco hover:text-foco focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-4"
          >
            <Heart aria-hidden className={`h-4 w-4 ${favoritos.length > 0 ? 'fill-foco text-foco' : ''}`} />
            <span className="hidden sm:inline">Favoritos</span>
            {favoritos.length > 0 && (
              <span
                key={favoritos.length}
                className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foco px-1.5 text-xs font-bold tabular-nums text-sala motion-safe:animate-latido"
              >
                {favoritos.length}
              </span>
            )}
          </a>
          <a
            href="#buscar"
            className="boton-cine inline-flex items-center gap-2 rounded-full bg-foco px-3 py-2 text-sm font-semibold text-sala hover:bg-pantalla focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-4"
          >
            <Search aria-hidden className="h-4 w-4" />
            <span className="hidden sm:inline">Buscar</span>
          </a>
        </div>
      </nav>
    </header>
  )
}
