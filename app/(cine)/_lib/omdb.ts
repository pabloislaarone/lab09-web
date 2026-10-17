// Configuración y tipos compartidos para la API de OMDb

export const OMDB_URL = 'https://www.omdbapi.com/'
export const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY

// Resultado corto de la búsqueda general (?s=)
export interface MovieSummary {
  imdbID: string
  Title: string
  Year: string
  Type: string
  Poster: string
}

// Respuesta de la búsqueda general
export interface SearchResponse {
  Search?: MovieSummary[]
  totalResults?: string
  Response: 'True' | 'False'
  Error?: string
}

// Detalle completo (?i= o ?t=)
export interface MovieDetail {
  imdbID: string
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: { Source: string; Value: string }[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  Type: string
  BoxOffice?: string
  totalSeasons?: string
  Response: 'True' | 'False'
  Error?: string
}

// Si OMDb no tiene póster devuelve "N/A"
export const hasPoster = (poster?: string) => !!poster && poster !== 'N/A'

// OMDb entrega pósters pequeños (300 px); Amazon permite pedir uno más grande
export const posterGrande = (poster: string, ancho = 800) =>
  hasPoster(poster) ? poster.replace(/_SX\d+/, `_SX${ancho}`) : poster

// Muestra un texto o un guion si OMDb devuelve "N/A"
export const orDash = (value?: string) => (value && value !== 'N/A' ? value : '—')

export const typeLabel = (type: string) =>
  type === 'series' ? 'Serie' : type === 'episode' ? 'Episodio' : 'Película'

// Traduce los mensajes de error de OMDb
export const translateError = (error?: string) => {
  if (!error) return 'No se pudo completar la búsqueda.'
  if (error.includes('not found')) return 'No encontramos títulos con ese nombre. Prueba con otra palabra o quita el filtro de año.'
  if (error.includes('Too many')) return 'Hay demasiados resultados. Escribe un título más específico.'
  if (error.includes('Invalid API key')) return 'La apikey no es válida. Revisa tu archivo .env.local.'
  if (error.includes('limit')) return 'Se alcanzó el límite diario de la apikey (1000 peticiones).'
  return error
}
