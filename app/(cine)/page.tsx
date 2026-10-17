import { Suspense } from 'react'
import { connection } from 'next/server'
import { Play, Star } from 'lucide-react'
import FichaProvider from './_components/FichaProvider'
import Header from './_components/Header'
import Hero from './_components/Hero'
import Fila from './_components/Fila'
import SearchMovies from './_components/SearchMovies'
import Favoritos from './_components/Favoritos'
import TituloCard from './_components/TituloCard'
import OpenTrailer from './_components/OpenTrailer'
import OpenFicha from './_components/OpenFicha'
import Poster from './_components/Poster'
import { DESTACADAS_IDS, PELICULAS_IDS, SERIES_IDS, getTitulos } from './_lib/cartelera'
import { getTrailer, trailerThumb } from './_lib/trailers'
import { MovieDetail, orDash, typeLabel } from './_lib/omdb'

// Pide títulos en el servidor. Si falla, el error se ve en la terminal de "npm run dev".
async function cargar(ids: string[]): Promise<MovieDetail[] | null> {
  // Indica a Next.js que la página se arme en cada petición (SSR)
  await connection()
  try {
    return await getTitulos(ids)
  } catch (err) {
    console.error('Error al pedir títulos a OMDb:', err instanceof Error ? err.message : err)
    return null
  }
}

// ---------- Secciones renderizadas en el servidor (SSR) ----------

async function Portada() {
  const destacadas = await cargar(DESTACADAS_IDS)

  if (!destacadas || destacadas.length === 0) {
    return (
      <section id="inicio" className="flex min-h-[70svh] items-center justify-center px-4 pt-20">
        <div className="max-w-lg text-center">
          <p className="font-marquee text-5xl font-black text-foco">Sin función por ahora</p>
          <p className="mt-4 text-pantalla/90">
            No se pudo cargar la cartelera. Revisa que el archivo <code className="text-foco">.env.local</code> tenga
            tu apikey de OMDb y reinicia el servidor con <code className="text-foco">npm run dev</code>.
          </p>
        </div>
      </section>
    )
  }

  return <Hero destacadas={destacadas} />
}

async function Trailers() {
  const [peliculas, series] = await Promise.all([cargar(PELICULAS_IDS), cargar(SERIES_IDS)])
  const conTrailer = [...(peliculas ?? []), ...(series ?? [])].filter((m) => getTrailer(m.imdbID))
  if (conTrailer.length === 0) return null

  return (
    <Fila id="trailers" titulo="Tráileres" descripcion="Mira los avances sin salir de la cartelera">
      {conTrailer.map((m) => {
        const videoId = getTrailer(m.imdbID)!
        return (
          <li key={m.imdbID} className="w-72 shrink-0 sm:w-80">
            <OpenTrailer
              title={m.Title}
              year={m.Year}
              videoId={videoId}
              label={`Ver tráiler de ${m.Title}`}
              className="tarjeta-trailer block w-full focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <span className="marco-trailer relative block aspect-video overflow-hidden rounded-lg bg-butaca transition-transform duration-150">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={trailerThumb(videoId)} alt="" loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute inset-0 bg-gradient-to-t from-sala/80 via-transparent to-transparent" />
                <span className="play absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sala/70 text-pantalla backdrop-blur">
                  <Play aria-hidden className="ml-0.5 h-6 w-6 fill-current" />
                </span>
              </span>
              <span className="mt-3 block font-marquee text-xl font-extrabold leading-tight text-pantalla">{m.Title}</span>
              <span className="mt-0.5 block text-sm text-rosa">
                {m.Year} <span className="text-rosa/80">{typeLabel(m.Type)}</span>
              </span>
            </OpenTrailer>
          </li>
        )
      })}
    </Fila>
  )
}

async function FilaTitulos({ id, titulo, descripcion, ids }: { id: string; titulo: string; descripcion: string; ids: string[] }) {
  const titulos = await cargar(ids)
  if (!titulos || titulos.length === 0) return null

  return (
    <Fila id={id} titulo={titulo} descripcion={descripcion}>
      {titulos.map((m) => (
        <li key={m.imdbID} className="w-40 shrink-0 sm:w-48">
          <TituloCard
            imdbID={m.imdbID}
            title={m.Title}
            year={m.Year}
            type={m.Type}
            poster={m.Poster}
            rating={m.imdbRating}
            genre={m.Genre}
          />
        </li>
      ))}
    </Fila>
  )
}

// Las 10 mejor calificadas en IMDb entre películas y series
async function Ranking() {
  const [peliculas, series] = await Promise.all([cargar(PELICULAS_IDS), cargar(SERIES_IDS)])
  const top = [...(peliculas ?? []), ...(series ?? [])]
    .filter((m) => m.imdbRating !== 'N/A')
    .sort((a, b) => Number(b.imdbRating) - Number(a.imdbRating))
    .slice(0, 10)
  if (top.length === 0) return null

  return (
    <Fila id="ranking" titulo="Mejor calificadas" descripcion="Las 10 con mejor nota en IMDb">
      {top.map((m, i) => (
        <li key={m.imdbID} className="w-56 shrink-0">
          <OpenFicha imdbID={m.imdbID} label={`Puesto ${i + 1}: ${m.Title}`} className="tarjeta-poster group block w-full">
            <span className="flex items-end">
              <span
                aria-hidden
                className="relative z-0 -mr-4 w-24 shrink-0 text-right font-marquee text-[7.5rem] font-black leading-[0.72] tabular-nums text-sala [-webkit-text-stroke:2px_var(--color-foco)] transition-colors duration-300 group-hover:text-foco/25"
              >
                {i + 1}
              </span>
              <span className="poster-marco relative z-10 block w-36 shrink-0 overflow-hidden rounded-md">
                <Poster src={m.Poster} title={m.Title} />
              </span>
            </span>
            <span className="ml-auto mt-2 block w-36">
              <span className="flex items-center gap-1 text-sm font-semibold tabular-nums text-foco">
                <Star aria-hidden className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
                {orDash(m.imdbRating)}
              </span>
              <span className="block truncate font-marquee text-lg font-extrabold text-pantalla">{m.Title}</span>
            </span>
          </OpenFicha>
        </li>
      ))}
    </Fila>
  )
}

// ---------- Esqueletos mientras llegan los datos ----------

function PortadaCargando() {
  return (
    <div
      className="mx-auto grid min-h-[92svh] w-full max-w-6xl items-center gap-10 px-4 pt-20 sm:px-6 md:grid-cols-[1fr_320px]"
      aria-label="Cargando cartelera"
    >
      <div className="space-y-5">
        <div className="esqueleto h-24 w-3/4 rounded-lg animate-brillo" />
        <div className="esqueleto h-5 w-1/2 rounded animate-brillo" />
        <div className="esqueleto h-20 w-full rounded animate-brillo" />
        <div className="esqueleto h-12 w-56 rounded-full animate-brillo" />
      </div>
      <div className="esqueleto hidden aspect-[2/3] rounded-xl animate-brillo md:block" />
    </div>
  )
}

function FilaCargando({ ancho = 'w-40 sm:w-48', aspecto = 'aspect-[2/3]' }: { ancho?: string; aspecto?: string }) {
  return (
    <div className="py-10" aria-label="Cargando">
      <div className="mx-auto mb-6 max-w-6xl px-4 sm:px-6">
        <div className="esqueleto h-10 w-56 rounded animate-brillo" />
      </div>
      <div className="mx-auto flex max-w-6xl gap-5 overflow-hidden px-4 sm:px-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`${ancho} shrink-0`}>
            <div className={`esqueleto ${aspecto} rounded-md animate-brillo`} style={{ animationDelay: `${i * 100}ms` }} />
            <div className="esqueleto mt-3 h-5 w-3/4 rounded animate-brillo" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CinePage() {
  return (
    <main className="cartelera min-h-screen bg-sala font-texto text-pantalla">
      <FichaProvider>
        <Header />

        {/* Portada (SSR) */}
        <Suspense fallback={<PortadaCargando />}>
          <Portada />
        </Suspense>

        {/* Secciones de la cartelera (SSR) */}
        <Suspense fallback={<FilaCargando ancho="w-72 sm:w-80" aspecto="aspect-video" />}>
          <Trailers />
        </Suspense>
        <Suspense fallback={<FilaCargando />}>
          <FilaTitulos id="peliculas" titulo="Películas" descripcion="Estrenos y clásicos que no te puedes perder" ids={PELICULAS_IDS} />
        </Suspense>
        <Suspense fallback={<FilaCargando />}>
          <FilaTitulos id="series" titulo="Series" descripcion="Para ver por temporadas" ids={SERIES_IDS} />
        </Suspense>
        <Suspense fallback={<FilaCargando ancho="w-60 sm:w-64" />}>
          <Ranking />
        </Suspense>

        {/* Búsqueda (CSR) */}
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SearchMovies />
        </div>

        {/* Favoritos (CSR, guardados en el navegador) */}
        <Favoritos />

        <footer className="border-t border-foco/10 py-8 text-center text-xs text-rosa">
          Datos de OMDb API. Tráileres de YouTube.
        </footer>
      </FichaProvider>
    </main>
  )
}
