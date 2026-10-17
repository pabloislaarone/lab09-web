import axios from 'axios'
import { cacheLife } from 'next/cache'
import { API_KEY, OMDB_URL, MovieDetail } from './omdb'

// OMDb no tiene endpoints de "populares", así que usamos selecciones de IDs de IMDb
export const PELICULAS_IDS = [
  'tt15239678', // Dune: Part Two
  'tt15398776', // Oppenheimer
  'tt4154796', // Avengers: Endgame
  'tt10872600', // Spider-Man: No Way Home
  'tt7286456', // Joker
  'tt0816692', // Interstellar
  'tt1375666', // Inception
  'tt0468569', // The Dark Knight
  'tt0848228', // The Avengers
  'tt0371746', // Iron Man
  'tt3896198', // Guardians of the Galaxy Vol. 2
  'tt0133093', // The Matrix
]

export const SERIES_IDS = [
  'tt4574334', // Stranger Things
  'tt3581920', // The Last of Us
  'tt13443470', // Wednesday
  'tt0903747', // Breaking Bad
  'tt0944947', // Game of Thrones
  'tt5753856', // Dark
  'tt1632701', // Suits
  'tt0386676', // The Office
]

// Títulos de la portada
export const DESTACADAS_IDS = ['tt15239678', 'tt4574334', 'tt15398776', 'tt3581920', 'tt4154796']

// SSR: se ejecuta en el servidor con async/await.
// 'use cache' guarda la respuesta una hora en el servidor para no gastar el límite
// de 1000 peticiones diarias de la apikey; la página se sigue armando en cada visita.
export async function getTitulos(ids: string[]): Promise<MovieDetail[]> {
  'use cache'
  cacheLife('hours')

  // Las peticiones van en paralelo para no sumar los tiempos de cada una
  const responses = await Promise.all(
    ids.map((id) => axios.get<MovieDetail>(OMDB_URL, { params: { apikey: API_KEY, i: id } }))
  )
  return responses.map((r) => r.data).filter((m) => m.Response === 'True')
}
