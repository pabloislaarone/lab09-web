'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import { Play, X } from 'lucide-react'
import Poster from './Poster'
import FavButton from './FavButton'
import { useAbrirTrailer } from './FichaProvider'
import { getTrailer } from '../_lib/trailers'
import { API_KEY, OMDB_URL, MovieDetail, orDash, posterGrande, typeLabel } from '../_lib/omdb'

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

// Duración de la animación de salida (ms)
const SALIDA = 200

export default function MovieModal({ imdbID, onClose }: Props) {
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [error, setError] = useState('')
  const [cerrando, setCerrando] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const abrirTrailer = useAbrirTrailer()

  // Primero se anima la salida y luego se quita el modal
  const cerrar = useCallback(() => {
    setCerrando(true)
    setTimeout(onClose, SALIDA)
  }, [onClose])

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
        if (!cancelled) setError('No se pudo cargar la ficha. Revisa tu conexión e inténtalo otra vez.')
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
      if (e.key === 'Escape') cerrar()
    }
    window.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [cerrar])

  return (
    <div
      onClick={cerrar}
      className={`fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm transition-opacity duration-200 ease-out sm:items-center sm:p-8 ${
        cerrando ? 'opacity-0' : 'motion-safe:animate-desvanecer'
      }`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={movie ? `Ficha de ${movie.Title}` : 'Ficha de la película'}
        onClick={(e) => e.stopPropagation()}
        className={`cartelera relative w-full max-w-5xl font-texto text-pantalla transition-[opacity,transform] duration-200 ease-out ${
          cerrando ? 'translate-y-3 scale-[0.97] opacity-0' : 'motion-safe:animate-aparecer'
        }`}
      >
        <button
          ref={closeRef}
          onClick={cerrar}
          aria-label="Cerrar ficha"
          className="boton-cine absolute -top-3 -right-3 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-foco text-sala shadow-[0_8px_20px_-6px_rgba(0,0,0,0.7)] hover:bg-pantalla focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pantalla"
        >
          <X aria-hidden className="h-5 w-5" strokeWidth={2.5} />
        </button>

        {/* Entrada de cine: cuerpo + talón separados por una línea perforada */}
        <div className="grid overflow-hidden rounded-2xl bg-butaca shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] md:grid-cols-[1fr_200px]">
          {/* Cuerpo de la entrada */}
          <div className="grid gap-6 p-6 sm:grid-cols-[200px_1fr] sm:p-8">
            {!movie && !error && (
              <>
                <div className="esqueleto aspect-[2/3] w-36 rounded-lg animate-brillo sm:w-full" />
                <div className="space-y-4">
                  <div className="esqueleto h-12 w-3/4 rounded animate-brillo" />
                  <div className="esqueleto h-4 w-1/2 rounded animate-brillo" />
                  <div className="esqueleto h-24 rounded animate-brillo" />
                  <div className="esqueleto h-32 rounded animate-brillo" />
                </div>
              </>
            )}

            {error && <p className="col-span-full py-10 text-center text-rosa">{error}</p>}

            {movie && (
              <>
                <div className="w-36 motion-safe:animate-aparecer sm:w-full">
                  <Poster src={posterGrande(movie.Poster, 500)} title={movie.Title} priority className="rounded-lg shadow-xl" />
                </div>
                <div className="min-w-0">
                  <h2 className="pr-6 font-marquee text-4xl font-black leading-[0.95] text-balance motion-safe:animate-subir sm:text-6xl">
                    {movie.Title}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm motion-safe:animate-subir" style={{ animationDelay: '60ms' }}>
                    <span className="rounded-full bg-sala/60 px-3 py-1">{typeLabel(movie.Type)}</span>
                    <span className="rounded-full bg-sala/60 px-3 py-1 tabular-nums">{movie.Year}</span>
                    <span className="rounded-full bg-sala/60 px-3 py-1">{orDash(movie.Runtime)}</span>
                    <span className="rounded-full bg-sala/60 px-3 py-1">Clasificación {orDash(movie.Rated)}</span>
                    {movie.totalSeasons && movie.totalSeasons !== 'N/A' && (
                      <span className="rounded-full bg-sala/60 px-3 py-1">{movie.totalSeasons} temporadas</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-foco motion-safe:animate-subir" style={{ animationDelay: '100ms' }}>
                    {movie.Genre}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2 motion-safe:animate-subir" style={{ animationDelay: '120ms' }}>
                    <button
                      type="button"
                      onClick={() => abrirTrailer({ title: movie.Title, year: movie.Year, videoId: getTrailer(movie.imdbID) })}
                      className="boton-cine inline-flex cursor-pointer items-center gap-2 rounded-full bg-foco px-5 py-2.5 text-sm font-semibold text-sala hover:bg-pantalla focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      <Play aria-hidden className="h-4 w-4 fill-current" />
                      Ver tráiler
                    </button>
                    <FavButton
                      variante="texto"
                      titulo={{ imdbID: movie.imdbID, Title: movie.Title, Year: movie.Year, Type: movie.Type, Poster: movie.Poster }}
                    />
                  </div>

                  <p
                    className="mt-5 max-w-prose leading-relaxed text-pantalla/90 motion-safe:animate-subir"
                    style={{ animationDelay: '140ms' }}
                  >
                    {orDash(movie.Plot)}
                  </p>

                  <dl
                    className="mt-6 grid grid-cols-[100px_1fr] gap-x-4 gap-y-2 text-sm motion-safe:animate-subir"
                    style={{ animationDelay: '180ms' }}
                  >
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
                        <dd className="tabular-nums">{movie.BoxOffice}</dd>
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
            <span aria-hidden className="absolute -left-3 -top-3 hidden h-6 w-6 rounded-full bg-black/80 md:block" />
            <span aria-hidden className="absolute -bottom-3 -left-3 hidden h-6 w-6 rounded-full bg-black/80 md:block" />

            <h3 className="font-marquee text-2xl font-extrabold text-foco">Calificaciones</h3>
            {movie ? (
              <div className="motion-safe:animate-subir" style={{ animationDelay: '220ms' }}>
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
              </div>
            ) : (
              <div className="esqueleto mt-4 h-16 w-24 rounded animate-brillo" />
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
