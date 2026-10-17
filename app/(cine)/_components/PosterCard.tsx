import { Eye, Star } from 'lucide-react'
import Poster from './Poster'
import { orDash, typeLabel } from '../_lib/omdb'

interface Props {
  title: string
  year: string
  type: string
  poster: string
  rating?: string
  genre?: string
}

// Contenido de una tarjeta de póster. El botón que la envuelve (OpenFicha o el
// del buscador) lleva la clase "tarjeta-poster" que activa las animaciones.
export default function PosterCard({ title, year, type, poster, rating, genre }: Props) {
  return (
    <>
      <span className="poster-marco relative block overflow-hidden rounded-md">
        <Poster src={poster} title={title} />
        {/* Velo que aparece al pasar el mouse */}
        <span className="poster-velo absolute inset-0 flex items-end bg-gradient-to-t from-sala/95 via-sala/40 to-transparent p-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-foco px-3 py-1.5 text-xs font-semibold text-sala">
            <Eye aria-hidden className="h-3.5 w-3.5" />
            Ver ficha
          </span>
        </span>
      </span>
      <span className="mt-3 block font-marquee text-xl font-extrabold leading-tight text-pantalla">{title}</span>
      <span className="mt-1 flex items-center justify-between gap-2 text-sm text-rosa">
        <span className="tabular-nums">
          {year} <span className="text-rosa/80">{typeLabel(type)}</span>
        </span>
        {rating && (
          <span className="inline-flex items-center gap-1 font-semibold tabular-nums text-foco">
            <Star aria-hidden className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
            <span className="sr-only">Calificación IMDb</span>
            {orDash(rating)}
          </span>
        )}
      </span>
      {genre && <span className="mt-1 block line-clamp-1 text-xs text-rosa">{genre}</span>}
    </>
  )
}
