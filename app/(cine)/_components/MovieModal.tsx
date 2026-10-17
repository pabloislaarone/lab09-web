'use client'

import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { X } from 'lucide-react'
import Poster from './Poster'
import { API_KEY, OMDB_URL, MovieDetail, orDash, typeLabel } from '../_lib/omdb'

interface Props {
  imdbID: string
  onClose: () => void
}

// Nombres cortos para las fuentes de calificación
const SOURCE_LABEL: Record<string, string> = {
  'Internet Movie Database': 'IMDb',
  'Rotten Tomatoes': 'Rotten Tomatoes',
  Metacritic: 'Metacritic',
}

export default function MovieModal({ imdbID, onClose }: Props) {
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [error, setError] = useState('')
  const closeRef = useRef<HTMLButtonElement>(null)

  // Pide la ficha completa por id: ?i=tt3896198&plot=full
  useEffect(() => {
    let cancelled = false
    const fetchDetail = async () => {
      try {
        const { data } = await axios.get<MovieDetail>(OMDB_URL, {
          params: { apikey: API_KEY, i: imdbID, plot: 'full' },
        })
        if (cancelled) return
        if (data.Response === 'True') setMovie(data)
        else setError('No se encontró la ficha de este título.')
      } catch {
        if (!cancelled) setError('No se pudo cargar la ficha. Inténtalo otra vez.')
      }
    }
    fetchDetail()
    return () => {
      cancelled = true
    }
  }, [imdbID])

  // Cierra con Escape, bloquea el scroll de fondo y enfoca el botón cerrar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm sm:items-center sm:p-8"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={movie ? `Ficha de ${movie.Title}` : 'Ficha de la película'}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl font-texto text-pantalla motion-safe:animate-aparecer"
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Cerrar ficha"
          className="absolute -top-3 -right-3 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-foco text-sala shadow-[0_8px_20px_-6px_rgba(0,0,0,0.7)] transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pantalla"
        >
          <X aria-hidden className="h-5 w-5" strokeWidth={2.5} />
        </button>

        {/* Entrada de cine: cuerpo + talón separados por una línea perforada */}
        <div className="grid overflow-hidden rounded-2xl bg-butaca md:grid-cols-[1fr_200px]">
          {/* Cuerpo de la entrada */}
          <div className="grid gap-6 p-6 sm:grid-cols-[200px_1fr] sm:p-8">
            {!movie && !error && (
              <>
                <div className="aspect-[2/3] animate-pulse rounded-lg bg-sala/60" />
                <div className="space-y-4">
                  <div className="h-12 w-3/4 animate-pulse rounded bg-sala/60" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-sala/60" />
                  <div className="h-24 animate-pulse rounded bg-sala/60" />
                </div>
              </>
            )}

            {error && <p className="col-span-full py-10 text-center text-rosa">{error}</p>}

            {movie && (
              <>
                <div className="w-36 sm:w-full">
                  <Poster src={movie.Poster} title={movie.Title} className="rounded-lg shadow-xl" />
                </div>
                <div className="min-w-0">
                  <h2 className="pr-6 font-marquee text-4xl font-black leading-[0.95] sm:text-6xl">
                    {movie.Title}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    <span className="rounded-full bg-sala/60 px-3 py-1">{typeLabel(movie.Type)}</span>
                    <span className="rounded-full bg-sala/60 px-3 py-1">{movie.Year}</span>
                    <span className="rounded-full bg-sala/60 px-3 py-1">{orDash(movie.Runtime)}</span>
                    <span className="rounded-full bg-sala/60 px-3 py-1">Clasificación {orDash(movie.Rated)}</span>
                    {movie.totalSeasons && (
                      <span className="rounded-full bg-sala/60 px-3 py-1">{movie.totalSeasons} temporadas</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-foco">{movie.Genre}</p>

                  <p className="mt-5 max-w-prose leading-relaxed text-pantalla/90">{orDash(movie.Plot)}</p>

                  <dl className="mt-6 grid grid-cols-[100px_1fr] gap-x-4 gap-y-2 text-sm">
                    <dt className="text-rosa">Dirección</dt>
                    <dd>{orDash(movie.Director)}</dd>
                    <dt className="text-rosa">Guion</dt>
                    <dd>{orDash(movie.Writer)}</dd>
                    <dt className="text-rosa">Reparto</dt>
                    <dd>{orDash(movie.Actors)}</dd>
                    <dt className="text-rosa">Estreno</dt>
                    <dd>{orDash(movie.Released)}</dd>
                    <dt className="text-rosa">Idioma</dt>
                    <dd>{orDash(movie.Language)}</dd>
                    <dt className="text-rosa">País</dt>
                    <dd>{orDash(movie.Country)}</dd>
                    <dt className="text-rosa">Premios</dt>
                    <dd>{orDash(movie.Awards)}</dd>
                    {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                      <>
                        <dt className="text-rosa">Taquilla</dt>
                        <dd>{movie.BoxOffice}</dd>
                      </>
                    )}
                  </dl>
                </div>
              </>
            )}
          </div>

          {/* Talón de la entrada: calificaciones */}
          <aside className="relative border-t-2 border-dashed border-sala/80 bg-telon p-6 md:border-t-0 md:border-l-2">
            {/* Muescas de la entrada */}
            <span aria-hidden className="absolute -left-3 -top-3 hidden h-6 w-6 rounded-full bg-black/75 md:block" />
            <span aria-hidden className="absolute -bottom-3 -left-3 hidden h-6 w-6 rounded-full bg-black/75 md:block" />

            <h3 className="font-marquee text-2xl font-extrabold text-foco">Calificaciones</h3>
            {movie ? (
              <>
                <p className="mt-4 font-marquee text-7xl font-black leading-none tabular-nums text-pantalla">
                  {orDash(movie.imdbRating)}
                </p>
                <p className="mt-1 text-sm text-rosa">IMDb, {orDash(movie.imdbVotes)} votos</p>
                <ul className="mt-6 space-y-3 text-sm">
                  {movie.Ratings?.filter((r) => r.Source !== 'Internet Movie Database').map((r) => (
                    <li key={r.Source} className="flex justify-between gap-2 border-b border-sala/50 pb-2">
                      <span className="text-rosa">{SOURCE_LABEL[r.Source] ?? r.Source}</span>
                      <span className="font-semibold tabular-nums">{r.Value}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-xs text-rosa">ID {movie.imdbID}</p>
              </>
            ) : (
              <div className="mt-4 h-16 w-24 animate-pulse rounded bg-sala/50" />
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
