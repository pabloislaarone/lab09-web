'use client'

import { Heart } from 'lucide-react'
import { useFavoritos } from './useFavoritos'
import TituloCard from './TituloCard'

// Sección "Mis favoritos": se arma en el navegador con lo guardado en localStorage
export default function Favoritos() {
  const favoritos = useFavoritos()

  return (
    <section id="favoritos" aria-labelledby="favoritos-titulo" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-2 border-b border-foco/20 pb-4">
        <h2 id="favoritos-titulo" className="font-marquee text-4xl font-extrabold text-pantalla sm:text-5xl">
          Mis favoritos
        </h2>
        <p className="text-sm text-rosa tabular-nums">
          {favoritos.length === 1 ? '1 título guardado' : `${favoritos.length} títulos guardados`}
        </p>
      </div>

      {favoritos.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-foco/30 px-6 py-14 text-center">
          <Heart aria-hidden className="h-10 w-10 text-foco/70" />
          <p className="font-marquee text-2xl font-extrabold">Todavía no guardas nada</p>
          <p className="max-w-sm text-rosa">
            Toca el corazón de cualquier póster o de una ficha para tenerlo a la mano aquí.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {favoritos.map((f) => (
            <li key={f.imdbID} className="motion-safe:animate-aparecer">
              <TituloCard imdbID={f.imdbID} title={f.Title} year={f.Year} type={f.Type} poster={f.Poster} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
