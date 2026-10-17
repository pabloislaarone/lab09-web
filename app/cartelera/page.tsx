import { Suspense } from 'react'
import Link from 'next/link'
import { connection } from 'next/server'
import axios from 'axios'
import { ArrowLeft, Star } from 'lucide-react'
import SearchMovies from './_components/SearchMovies'
import Poster from './_components/Poster'
import { API_KEY, OMDB_URL, MovieDetail, orDash, typeLabel } from './_lib/omdb'

// OMDb no tiene un endpoint de "populares", así que usamos una selección de IDs de IMDb
const POPULAR_IDS = [
  'tt0848228', // The Avengers
  'tt4154796', // Avengers: Endgame
  'tt3896198', // Guardians of the Galaxy Vol. 2
  'tt0468569', // The Dark Knight
  'tt1375666', // Inception
  'tt0816692', // Interstellar
  'tt0903747', // Breaking Bad
  'tt1632701', // Suits
  'tt4574334', // Stranger Things
  'tt0944947', // Game of Thrones
  'tt0371746', // Iron Man
]

// SSR: esta función corre en el servidor con async/await
async function getPopular(): Promise<MovieDetail[]> {
  // Las peticiones van en paralelo para no sumar los tiempos de cada una
  const responses = await Promise.all(
    POPULAR_IDS.map((id) =>
      axios.get<MovieDetail>(OMDB_URL, { params: { apikey: API_KEY, i: id } })
    )
  )
  return responses.map((r) => r.data).filter((m) => m.Response === 'True')
}

// Componente de servidor (sin 'use client'): llega al navegador como HTML ya armado
async function PopularList() {
  // Indica a Next.js que se renderice en cada petición, sin caché
  await connection()

  let popular: MovieDetail[] = []
  try {
    popular = await getPopular()
  } catch (err) {
    // Se ve en la terminal donde corre "npm run dev"
    console.error('Error al pedir la cartelera a OMDb:', err instanceof Error ? err.message : err)
    return (
      <p className="max-w-xl rounded-xl border border-foco/30 bg-butaca/50 p-6 text-pantalla/90">
        No se pudo cargar la cartelera. Revisa que el archivo <code className="text-foco">.env.local</code> tenga
        tu apikey de OMDb y reinicia el servidor con <code className="text-foco">npm run dev</code>.
      </p>
    )
  }

  const [destacada, ...resto] = popular

  return (
    <>
      {/* Título destacado: el primero de la lista */}
      {destacada && (
        <article className="mb-16 grid gap-8 md:grid-cols-[minmax(0,280px)_1fr] md:items-end">
          <div className="w-48 md:w-auto">
            <Poster
              src={destacada.Poster}
              title={destacada.Title}
              priority
              className="rounded-lg shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)]"
            />
          </div>
          <div className="max-w-2xl">
            <h3 className="font-marquee text-5xl font-extrabold leading-[0.95] text-balance text-pantalla md:text-7xl">
              {destacada.Title}
            </h3>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-rosa">
              <span className="tabular-nums">{destacada.Year}</span>
              <span>{orDash(destacada.Runtime)}</span>
              <span>{destacada.Genre}</span>
              <Rating value={destacada.imdbRating} />
            </div>
            <p className="mt-5 max-w-prose text-lg leading-relaxed text-pantalla/90">{destacada.Plot}</p>
            <p className="mt-4 text-sm text-rosa">
              Dirigida por <span className="text-pantalla">{destacada.Director}</span>
            </p>
          </div>
        </article>
      )}

      {/* Resto de la cartelera */}
      <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {resto.map((movie) => (
          <li key={movie.imdbID}>
            <Poster src={movie.Poster} title={movie.Title} className="rounded-md" />
            <h3 className="mt-3 font-marquee text-xl font-extrabold leading-tight text-pantalla">
              {movie.Title}
            </h3>
            <div className="mt-1 flex items-center justify-between gap-2 text-sm text-rosa">
              <span className="tabular-nums">
                {movie.Year} <span className="text-rosa/80">{typeLabel(movie.Type)}</span>
              </span>
              <Rating value={movie.imdbRating} />
            </div>
            <p className="mt-1 line-clamp-1 text-xs text-rosa">{movie.Genre}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

function Rating({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center gap-1 font-semibold tabular-nums text-foco">
      <Star aria-hidden className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
      <span className="sr-only">Calificación IMDb</span>
      {orDash(value)}
    </span>
  )
}

function PopularSkeleton() {
  return (
    <div aria-label="Cargando cartelera">
      <div className="mb-16 grid gap-8 md:grid-cols-[280px_1fr] md:items-end">
        <div className="aspect-[2/3] w-48 animate-pulse rounded-lg bg-butaca/60 md:w-auto" />
        <div className="space-y-4">
          <div className="h-14 w-2/3 animate-pulse rounded bg-butaca/60" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-butaca/60" />
          <div className="h-20 animate-pulse rounded bg-butaca/60" />
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <li key={i} className="aspect-[2/3] animate-pulse rounded-md bg-butaca/60" />
        ))}
      </ul>
    </div>
  )
}

export default function CarteleraPage() {
  return (
    <main className="cartelera min-h-screen bg-sala font-texto text-pantalla">
      {/* Luz del proyector sobre el letrero */}
      <div className="bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(122,26,46,0.55),transparent)]">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 rounded text-sm text-rosa transition hover:text-pantalla focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foco"
          >
            <ArrowLeft aria-hidden className="h-4 w-4" />
            Volver a la portada
          </Link>

          {/* CSR: búsqueda interactiva */}
          <SearchMovies />
        </div>
      </div>

      {/* SSR: cartelera popular */}
      <section className="mx-auto max-w-6xl px-4 pb-24 pt-4 sm:px-6" aria-labelledby="cartelera">
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-2 border-b border-foco/20 pb-4">
          <h2 id="cartelera" className="font-marquee text-4xl font-extrabold text-pantalla">
            En cartelera
          </h2>
          <p className="text-sm text-rosa">Lo más visto en cine y series</p>
        </div>

        <Suspense fallback={<PopularSkeleton />}>
          <PopularList />
        </Suspense>
      </section>

      <footer className="border-t border-foco/10 py-8 text-center text-xs text-rosa">
        Datos de OMDb API. La cartelera se renderiza en el servidor y la búsqueda en el navegador.
      </footer>
    </main>
  )
}
