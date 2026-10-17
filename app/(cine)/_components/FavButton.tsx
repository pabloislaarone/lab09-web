'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { useFavoritos } from './useFavoritos'
import { toggleFavorito } from '../_lib/favoritos'
import { MovieSummary } from '../_lib/omdb'

interface Props {
  titulo: MovieSummary
  // "icono": botón redondo sobre el póster; "texto": botón con etiqueta (en la ficha)
  variante?: 'icono' | 'texto'
  className?: string
}

// Agrega o quita un título de "Mis favoritos"
export default function FavButton({ titulo, variante = 'icono', className = '' }: Props) {
  const favoritos = useFavoritos()
  const [latido, setLatido] = useState(0)
  const guardado = favoritos.some((f) => f.imdbID === titulo.imdbID)

  const alternar = () => {
    toggleFavorito(titulo)
    setLatido((n) => n + 1) // reinicia la animación del corazón
  }

  const corazon = (
    <Heart
      key={latido}
      aria-hidden
      className={`h-5 w-5 ${guardado ? 'fill-current' : ''} ${latido > 0 ? 'motion-safe:animate-latido' : ''}`}
    />
  )

  if (variante === 'texto') {
    return (
      <button
        type="button"
        onClick={alternar}
        aria-pressed={guardado}
        className={`boton-cine inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${
          guardado ? 'bg-pantalla text-telon' : 'bg-sala/60 text-pantalla hover:bg-sala'
        } ${className}`}
      >
        {corazon}
        {guardado ? 'En favoritos' : 'Guardar en favoritos'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={alternar}
      aria-pressed={guardado}
      aria-label={guardado ? `Quitar ${titulo.Title} de favoritos` : `Guardar ${titulo.Title} en favoritos`}
      className={`boton-cine flex h-10 w-10 cursor-pointer items-center justify-center rounded-full backdrop-blur-md focus-visible:outline-2 focus-visible:outline-offset-2 ${
        guardado ? 'bg-foco text-sala' : 'bg-sala/70 text-pantalla hover:bg-sala hover:text-foco'
      } ${className}`}
    >
      {corazon}
    </button>
  )
}
