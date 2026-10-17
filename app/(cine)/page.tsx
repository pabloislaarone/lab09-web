import { Suspense } from 'react'
import { connection } from 'next/server'
import FichaProvider from './_components/FichaProvider'
import Hero from './_components/Hero'
import SearchMovies from './_components/SearchMovies'
import OpenFicha from './_components/OpenFicha'
import PosterCard from './_components/PosterCard'
import Reveal from './_components/Reveal'
import { getPopular } from './_lib/cartelera'
import { MovieDetail } from './_lib/omdb'

// Pide la cartelera en el servidor. Si falla, muestra el error en la terminal de "npm run dev".
async function cargarCartelera(): Promise<MovieDetail[] | null> {
  // Indica a Next.js que esta parte se renderice en cada petición (SSR real, sin caché)
  await connection()
  try {
    return await getPopular()
  } catch (err) {
    console.error('Error al pedir la cartelera a OMDb:', err instanceof Error ? err.message : err)
    return null
  }
}

// Portada (SSR): los títulos destacados llegan al navegador ya obtenidos
async function Portada() {
  const popular = await cargarCartelera()

  if (!popular || popular.length === 0) {
    return (
      <section className="flex min-h-[60svh] items-center justify-center px-4">
        <div className="max-w-lg text-center">
          <p className="font-marquee text-5xl font-black text-foco">CARTELERA</p>
          <p className="mt-4 text-pantalla/90">
            No se pudo cargar la cartelera. Revisa que el archivo <code className="text-foco">.env.local</code> tenga
            tu apikey de OMDb y reinicia el servidor con <code className="text-foco">npm run dev</code>.
          </p>
        </div>
      </section>
    )
  }

  return <Hero destacadas={popular.slice(0, 5)} />
}

// Lista "En cartelera" (SSR): componente de servidor con pósters clicables
async function ListaCartelera() {
  const popular = await cargarCartelera()
  if (!popular) return null

  return (
    <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {popular.map((movie, i) => (
        <Reveal as="li" key={movie.imdbID} delay={(i % 6) * 70}>
          <OpenFicha imdbID={movie.imdbID} className="tarjeta-poster block w-full" label={`Ver ficha de ${movie.Title}`}>
            <PosterCard
              title={movie.Title}
              year={movie.Year}
              type={movie.Type}
              poster={movie.Poster}
              rating={movie.imdbRating}
              genre={movie.Genre}
            />
          </OpenFicha>
        </Reveal>
      ))}
    </ul>
  )
}

function PortadaCargando() {
  return (
    <div className="mx-auto grid min-h-[92svh] w-full max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-[1fr_320px]" aria-label="Cargando cartelera">
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

function ListaCargando() {
  return (
    <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" aria-label="Cargando cartelera">
      {Array.from({ length: 12 }).map((_, i) => (
        <li key={i}>
          <div className="esqueleto aspect-[2/3] rounded-md animate-brillo" style={{ animationDelay: `${(i % 6) * 100}ms` }} />
          <div className="esqueleto mt-3 h-5 w-3/4 rounded animate-brillo" />
        </li>
      ))}
    </ul>
  )
}

export default function CinePage() {
  return (
    <main className="cartelera min-h-screen bg-sala font-texto text-pantalla">
      <FichaProvider>
        {/* Portada (SSR) */}
        <Suspense fallback={<PortadaCargando />}>
          <Portada />
        </Suspense>

        {/* Búsqueda (CSR) */}
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SearchMovies />
        </div>

        {/* En cartelera (SSR) */}
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6" aria-labelledby="en-cartelera">
          <Reveal className="mb-10 flex flex-wrap items-baseline justify-between gap-2 border-b border-foco/20 pb-4">
            <h2 id="en-cartelera" className="font-marquee text-4xl font-extrabold text-pantalla">
              En cartelera
            </h2>
            <p className="text-sm text-rosa">Elige un póster para ver su ficha completa</p>
          </Reveal>

          <Suspense fallback={<ListaCargando />}>
            <ListaCartelera />
          </Suspense>
        </section>

        <footer className="border-t border-foco/10 py-8 text-center text-xs text-rosa">
          Datos de OMDb API. La cartelera se renderiza en el servidor y la búsqueda en el navegador.
        </footer>
      </FichaProvider>
    </main>
  )
}
