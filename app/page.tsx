import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

// Páginas del laboratorio, en el orden de la guía
const FUNCIONES = [
  {
    numero: '1.1',
    titulo: 'Pokémon CSR',
    detalle: 'Un Pokémon al azar pedido desde el navegador después de cargar la página.',
    modo: 'CSR',
    href: '/pokemon-csr',
  },
  {
    numero: '1.1',
    titulo: 'Pokémon SSR',
    detalle: 'Un Pokémon al azar pedido en el servidor antes de enviar el HTML.',
    modo: 'SSR',
    href: '/pokemon-ssr',
  },
  {
    numero: '2.1',
    titulo: 'Dashboard del clima',
    detalle: 'Lima se obtiene en el servidor y las demás ciudades se piden desde el navegador.',
    modo: 'SSR + CSR',
    href: '/weather',
  },
  {
    numero: 'Tarea',
    titulo: 'Cartelera',
    detalle: 'Galería de películas y series con la API de OMDb: cartelera en el servidor, búsqueda y ficha en el navegador.',
    modo: 'SSR + CSR',
    href: '/cartelera',
  },
]

export default function Portada() {
  return (
    <main className="cartelera min-h-screen bg-sala font-texto text-pantalla">
      <div className="bg-[radial-gradient(ellipse_70%_55%_at_20%_0%,rgba(122,26,46,0.6),transparent)]">
        <div className="mx-auto max-w-5xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
          {/* Título del laboratorio */}
          <header>
            <h1 className="font-marquee text-7xl font-black leading-[0.85] text-foco drop-shadow-[0_0_18px_rgba(245,184,61,0.45)] sm:text-8xl">
              Laboratorio 09
            </h1>
            <p className="mt-5 max-w-xl text-xl leading-snug text-pantalla text-balance">
              Introducción a Next.js: renderizado en el cliente (CSR) y en el servidor (SSR).
            </p>

            <dl className="mt-10 grid max-w-3xl grid-cols-1 gap-x-10 gap-y-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-rosa">Estudiante</dt>
                <dd className="mt-0.5 text-base">Pablo Isla</dd>
              </div>
              <div>
                <dt className="text-rosa">Curso</dt>
                <dd className="mt-0.5 text-base">Desarrollo de Aplicaciones Web Avanzado</dd>
              </div>
              <div>
                <dt className="text-rosa">Docente</dt>
                <dd className="mt-0.5 text-base">Edwin William Arévalo Sermeño</dd>
              </div>
              <div>
                <dt className="text-rosa">Grupo</dt>
                <dd className="mt-0.5 text-base">5 C24, TECSUP 2026</dd>
              </div>
            </dl>
          </header>

          {/* Programa de funciones: una fila por página del laboratorio */}
          <nav aria-label="Páginas del laboratorio" className="mt-16">
            <h2 className="border-b border-foco/30 pb-3 font-marquee text-3xl font-extrabold">Funciones</h2>
            <ul>
              {FUNCIONES.map((f) => {
                const esTarea = f.numero === 'Tarea'
                return (
                  <li key={f.href} className="border-b border-foco/15">
                    <Link
                      href={f.href}
                      className="group grid grid-cols-[4.5rem_1fr_auto] items-baseline gap-x-4 gap-y-1 py-6 transition-colors hover:bg-butaca/40 focus-visible:bg-butaca/40 focus-visible:outline-2 focus-visible:outline-offset-2 sm:grid-cols-[6rem_1fr_7rem_auto] sm:px-3"
                    >
                      <span className={`font-marquee text-2xl font-extrabold tabular-nums ${esTarea ? 'text-foco' : 'text-rosa'}`}>
                        {f.numero}
                      </span>
                      <span>
                        <span
                          className={`block font-marquee font-extrabold leading-none ${
                            esTarea ? 'text-5xl text-foco sm:text-6xl' : 'text-3xl text-pantalla'
                          }`}
                        >
                          {f.titulo}
                        </span>
                        <span className="mt-2 block max-w-prose text-sm leading-relaxed text-rosa">{f.detalle}</span>
                      </span>
                      <span className="col-start-2 text-sm font-semibold text-pantalla/90 sm:col-start-auto">{f.modo}</span>
                      <ArrowUpRight
                        aria-hidden
                        className="row-start-1 col-start-3 h-6 w-6 self-center text-rosa transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foco sm:col-start-4"
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>
    </main>
  )
}
