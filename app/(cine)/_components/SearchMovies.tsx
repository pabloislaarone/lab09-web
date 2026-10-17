'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Search } from 'lucide-react'
import TituloCard from './TituloCard'
import {
  API_KEY,
  OMDB_URL,
  MovieDetail,
  MovieSummary,
  SearchResponse,
  translateError,
} from '../_lib/omdb'

type Mode = 'nombre' | 'titulo'

export default function SearchMovies() {
  // Estado del formulario
  const [mode, setMode] = useState<Mode>('nombre')
  const [query, setQuery] = useState('')
  const [type, setType] = useState('')
  const [year, setYear] = useState('')

  // Estado de los resultados
  const [results, setResults] = useState<MovieSummary[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')


  const minLength = mode === 'nombre' ? 3 : 2
  const isSearching = query.trim().length >= minLength

  // Búsqueda en tiempo real: se ejecuta al escribir o cambiar un filtro
  useEffect(() => {
    if (query.trim().length < minLength) return

    let cancelled = false

    // Debounce: espera 500 ms a que el usuario deje de escribir
    const timer = setTimeout(async () => {
      setLoading(true)
      setError('')
      setPage(1)

      try {
        if (mode === 'nombre') {
          // Búsqueda general: ?s=marvel
          const { data } = await axios.get<SearchResponse>(OMDB_URL, {
            params: { apikey: API_KEY, s: query.trim(), type: type || undefined, y: year || undefined },
          })
          if (cancelled) return
          if (data.Response === 'True' && data.Search) {
            setResults(data.Search)
            setTotal(Number(data.totalResults ?? 0))
          } else {
            setResults([])
            setTotal(0)
            setError(translateError(data.Error))
          }
        } else {
          // Búsqueda por título y año: ?t=suits&y=2012
          const { data } = await axios.get<MovieDetail>(OMDB_URL, {
            params: { apikey: API_KEY, t: query.trim(), type: type || undefined, y: year || undefined },
          })
          if (cancelled) return
          if (data.Response === 'True') {
            setResults([
              { imdbID: data.imdbID, Title: data.Title, Year: data.Year, Type: data.Type, Poster: data.Poster },
            ])
            setTotal(1)
          } else {
            setResults([])
            setTotal(0)
            setError(translateError(data.Error))
          }
        }
      } catch {
        if (!cancelled) setError('No hay conexión con OMDb. Revisa tu internet e inténtalo otra vez.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 500)

    // Si cambia algo antes de los 500 ms, se cancela la búsqueda anterior
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, type, year, mode, minLength])

  // Carga la siguiente página de resultados (OMDb devuelve 10 por página)
  const loadMore = async () => {
    const nextPage = page + 1
    setLoadingMore(true)
    try {
      const { data } = await axios.get<SearchResponse>(OMDB_URL, {
        params: { apikey: API_KEY, s: query.trim(), type: type || undefined, y: year || undefined, page: nextPage },
      })
      if (data.Response === 'True' && data.Search) {
        // Evita duplicados que a veces devuelve OMDb entre páginas
        setResults((prev) => {
          const ids = new Set(prev.map((m) => m.imdbID))
          return [...prev, ...data.Search!.filter((m) => !ids.has(m.imdbID))]
        })
        setPage(nextPage)
      }
    } finally {
      setLoadingMore(false)
    }
  }

  const fieldClass =
    'h-12 rounded-lg border border-foco/25 bg-sala/70 px-4 text-pantalla placeholder:text-rosa/80 outline-none transition focus:border-foco focus:ring-2 focus:ring-foco/30'

  return (
    <>
      {/* Letrero de cine con focos */}
      <div id="buscar" className="relative scroll-mt-28 rounded-[28px] p-5 shadow-[0_30px_80px_-30px_rgba(245,184,61,0.5)]">
        {/* Fila de focos alrededor del letrero */}
        <div aria-hidden className="focos" />
        <div className="relative rounded-2xl border-2 border-foco/60 bg-butaca px-5 py-8 sm:px-10 sm:py-10">
          <h2 className="text-center font-marquee text-5xl font-black leading-none text-foco drop-shadow-[0_0_18px_rgba(245,184,61,0.45)] sm:text-7xl">
            ¿Qué quieres ver?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-rosa">
            Busca cualquier película o serie y mira su ficha completa.
          </p>

          {/* Modo de búsqueda */}
          <div
            role="radiogroup"
            aria-label="Modo de búsqueda"
            className="relative mx-auto mt-8 grid w-fit max-w-full grid-cols-2 rounded-full border border-foco/30 bg-sala/60 p-1 text-sm"
          >
            {/* Píldora que se desliza hacia el modo elegido */}
            <span
              aria-hidden
              className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-foco transition-transform duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] ${
                mode === 'titulo' ? 'translate-x-full' : 'translate-x-0'
              }`}
            />
            {(
              [
                ['nombre', 'Por nombre'],
                ['titulo', 'Título y año'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                role="radio"
                aria-checked={mode === value}
                onClick={() => setMode(value)}
                className={`relative z-10 cursor-pointer whitespace-nowrap rounded-full px-3 py-2 text-center font-semibold transition-colors duration-200 sm:px-4 focus-visible:outline-2 focus-visible:outline-foco ${
                  mode === value ? 'text-sala' : 'text-rosa hover:text-pantalla'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Inputs */}
          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_200px_120px]">
            <label className="sr-only" htmlFor="q">
              Título
            </label>
            <div className="relative">
              <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-rosa" />
              <input
                id="q"
                type="search"
                autoComplete="off"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={mode === 'nombre' ? 'Escribe un título: marvel, batman, shrek…' : 'Título exacto: suits, inception…'}
                className={`${fieldClass} w-full pl-12 text-lg`}
              />
            </div>
            <label className="sr-only" htmlFor="tipo">
              Tipo
            </label>
            <select id="tipo" value={type} onChange={(e) => setType(e.target.value)} className={fieldClass}>
              <option value="">Películas y series</option>
              <option value="movie">Solo películas</option>
              <option value="series">Solo series</option>
            </select>
            <label className="sr-only" htmlFor="anio">
              Año
            </label>
            <input
              id="anio"
              type="number"
              inputMode="numeric"
              min={1900}
              max={2100}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Año"
              className={fieldClass}
            />
          </div>
        </div>
      </div>

      {/* Resultados (CSR) */}
      <section aria-live="polite" className="mt-10">
        {!isSearching && (
          <p className="text-center text-rosa">
            {mode === 'nombre'
              ? 'Los resultados aparecen mientras escribes, sin recargar la página.'
              : 'Escribe el título exacto. Agrega el año si hay varias versiones.'}
          </p>
        )}

        {isSearching && loading && (
          <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i}>
                <div className="esqueleto aspect-[2/3] rounded-md animate-brillo" style={{ animationDelay: `${i * 120}ms` }} />
                <div className="esqueleto mt-3 h-5 w-3/4 rounded animate-brillo" />
              </li>
            ))}
          </ul>
        )}

        {isSearching && !loading && error && (
          <p className="mx-auto max-w-lg rounded-xl border border-foco/25 bg-butaca/50 p-5 text-center text-pantalla/90 motion-safe:animate-aparecer">
            {error}
          </p>
        )}

        {isSearching && !loading && !error && results.length > 0 && (
          <>
            <p className="mb-5 text-sm text-rosa motion-safe:animate-desvanecer">
              {total === 1 ? '1 resultado' : `${total.toLocaleString('es-PE')} resultados`} para “{query.trim()}”
            </p>
            <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
              {results.map((movie, i) => (
                <li
                  key={movie.imdbID}
                  className="motion-safe:animate-aparecer"
                  // Cascada: cada póster entra un poco después del anterior (los de "cargar más" sin retraso extra)
                  style={{ animationDelay: `${(i % 10) * 45}ms` }}
                >
                  <TituloCard
                    imdbID={movie.imdbID}
                    title={movie.Title}
                    year={movie.Year}
                    type={movie.Type}
                    poster={movie.Poster}
                  />
                </li>
              ))}
            </ul>

            {mode === 'nombre' && results.length < total && (
              <div className="mt-10 text-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="boton-cine cursor-pointer rounded-full border border-foco/50 px-6 py-3 font-semibold text-foco hover:bg-foco hover:text-sala disabled:cursor-wait disabled:opacity-60"
                >
                  {loadingMore ? 'Cargando…' : `Cargar más resultados (${results.length} de ${total})`}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}
