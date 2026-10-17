import { MovieSummary } from './omdb'

// Favoritos guardados en el navegador (localStorage), compartidos por toda la página
const CLAVE = 'cartelera:favoritos'
const VACIO: MovieSummary[] = []

let cache: MovieSummary[] | null = null
const oyentes = new Set<() => void>()

function leer(): MovieSummary[] {
  try {
    const crudo = localStorage.getItem(CLAVE)
    return crudo ? (JSON.parse(crudo) as MovieSummary[]) : []
  } catch {
    return []
  }
}

function avisar() {
  oyentes.forEach((fn) => fn())
}

export function getFavoritos(): MovieSummary[] {
  if (cache === null) cache = leer()
  return cache
}

// En el servidor no hay localStorage: se parte de una lista vacía
export const getFavoritosServidor = () => VACIO

export function subscribeFavoritos(fn: () => void) {
  oyentes.add(fn)
  // Si se cambian en otra pestaña, también se actualizan aquí
  const onStorage = (e: StorageEvent) => {
    if (e.key === CLAVE) {
      cache = leer()
      fn()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    oyentes.delete(fn)
    window.removeEventListener('storage', onStorage)
  }
}

export function toggleFavorito(titulo: MovieSummary) {
  const actuales = getFavoritos()
  const existe = actuales.some((f) => f.imdbID === titulo.imdbID)
  cache = existe ? actuales.filter((f) => f.imdbID !== titulo.imdbID) : [titulo, ...actuales]
  try {
    localStorage.setItem(CLAVE, JSON.stringify(cache))
  } catch {
    // Sin almacenamiento disponible (modo privado): se mantienen solo en memoria
  }
  avisar()
}
