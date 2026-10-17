'use client'

import { useState } from 'react'
import { Play, Star, Ticket } from 'lucide-react'
import { useAbrirFicha, useAbrirTrailer } from './FichaProvider'
import FavButton from './FavButton'
import Poster from './Poster'
import { getTrailer } from '../_lib/trailers'
import { MovieDetail, hasPoster, orDash, posterGrande, typeLabel } from '../_lib/omdb'

interface Props {
  // Títulos destacados que llegan ya obtenidos desde el servidor (SSR)
  destacadas: MovieDetail[]
}

// Segundos que se muestra cada título antes de pasar al siguiente
const DURACION = 8

// Portada de la cartelera: un título destacado a pantalla completa que va rotando
export default function Hero({ destacadas }: Props) {
  const [actual, setActual] = useState(0)
  const [pausado, setPausado] = useState(false)
  const abrirFicha = useAbrirFicha()
  const abrirTrailer = useAbrirTrailer()

  const pelicula = destacadas[actual]
  if (!pelicula) return null

  const siguiente = () => setActual((i) => (i + 1) % destacadas.length)

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Películas y series destacadas"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
      id="inicio"
      className="relative isolate flex min-h-[92svh] flex-col overflow-hidden pt-20"
    >
      {/* Fondos: el póster desenfocado de cada título, se cruzan al cambiar */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {destacadas.map((m, i) => (
          <div
            key={m.imdbID}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${i === actual ? 'opacity-100' : 'opacity-0'}`}
          >
            {hasPoster(m.Poster) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i === actual ? `activo-${actual}` : m.imdbID}
                src={posterGrande(m.Poster, 600)}
                alt=""
                className={`h-full w-full object-cover opacity-60 blur-2xl saturate-150 ${i === actual ? 'motion-safe:animate-acercar' : ''}`}
              />
            )}
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-sala via-sala/85 to-sala/30" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-sala to-transparent" />
      </div>

      {/* Título destacado */}
      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1fr_minmax(0,320px)]">
        {/* key={actual} reinicia las animaciones de entrada al cambiar de título */}
        <div key={actual} className="max-w-2xl" aria-live="polite">
          <h1 className="font-marquee text-6xl font-black leading-[0.9] text-balance text-pantalla motion-safe:animate-subir sm:text-7xl lg:text-8xl">
            {pelicula.Title}
          </h1>
          <div
            className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-rosa motion-safe:animate-subir"
            style={{ animationDelay: '80ms' }}
          >
            <span className="inline-flex items-center gap-1 font-semibold tabular-nums text-foco">
              <Star aria-hidden className="h-4 w-4 fill-current" strokeWidth={0} />
              {orDash(pelicula.imdbRating)}
            </span>
            <span className="tabular-nums">{pelicula.Year}</span>
            <span>{typeLabel(pelicula.Type)}</span>
            <span>{orDash(pelicula.Runtime)}</span>
            <span>{pelicula.Genre}</span>
          </div>
          <p
            className="mt-5 line-clamp-3 max-w-prose text-lg leading-relaxed text-pantalla/90 motion-safe:animate-subir"
            style={{ animationDelay: '160ms' }}
          >
            {pelicula.Plot}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 motion-safe:animate-subir" style={{ animationDelay: '240ms' }}>
            <button
              type="button"
              onClick={() => abrirTrailer({ title: pelicula.Title, year: pelicula.Year, videoId: getTrailer(pelicula.imdbID) })}
              className="boton-cine inline-flex cursor-pointer items-center gap-2 rounded-full bg-foco px-6 py-3 font-semibold text-sala hover:bg-pantalla focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pantalla"
            >
              <Play aria-hidden className="h-5 w-5 fill-current" />
              Ver tráiler
            </button>
            <button
              type="button"
              onClick={() => abrirFicha(pelicula.imdbID)}
              className="boton-cine inline-flex cursor-pointer items-center gap-2 rounded-full bg-pantalla/10 px-6 py-3 font-semibold text-pantalla backdrop-blur hover:bg-pantalla/20 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <Ticket aria-hidden className="h-5 w-5" />
              Ver ficha
            </button>
            <FavButton
              titulo={{ imdbID: pelicula.imdbID, Title: pelicula.Title, Year: pelicula.Year, Type: pelicula.Type, Poster: pelicula.Poster }}
              className="h-12 w-12"
            />
          </div>
        </div>

        {/* Póster nítido */}
        <button
          key={`poster-${actual}`}
          type="button"
          onClick={() => abrirFicha(pelicula.imdbID)}
          aria-label={`Ver ficha de ${pelicula.Title}`}
          className="tarjeta-poster order-first block w-32 cursor-pointer focus-visible:outline-none sm:w-40 md:order-none md:w-auto motion-safe:animate-aparecer"
          style={{ animationDelay: '120ms' }}
        >
          <span className="poster-marco block overflow-hidden rounded-xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
            <Poster src={posterGrande(pelicula.Poster)} title={pelicula.Title} priority />
          </span>
        </button>
      </div>

      {/* Selector de destacadas con barra de progreso */}
      <nav aria-label="Elegir título destacado" className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6">
        <ul className="grid grid-cols-5 gap-2 sm:gap-3">
          {destacadas.map((m, i) => {
            const activo = i === actual
            return (
              <li key={m.imdbID}>
                <button
                  type="button"
                  onClick={() => setActual(i)}
                  aria-current={activo}
                  className={`group w-full cursor-pointer text-left text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 ${
                    activo ? 'text-pantalla' : 'text-rosa hover:text-pantalla'
                  }`}
                >
                  <span className="block h-1 overflow-hidden rounded-full bg-pantalla/15">
                    {activo && (
                      <span
                        key={actual}
                        onAnimationEnd={siguiente}
                        className="barra-progreso block h-full origin-left rounded-full bg-foco animate-progreso"
                        style={{ animationDuration: `${DURACION}s`, animationPlayState: pausado ? 'paused' : 'running' }}
                      />
                    )}
                  </span>
                  <span className="mt-2 block truncate text-xs font-semibold sm:text-sm">{m.Title}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </section>
  )
}
