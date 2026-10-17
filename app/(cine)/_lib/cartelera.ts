import { cache } from 'react'
import axios from 'axios'
import { API_KEY, OMDB_URL, MovieDetail } from './omdb'

// OMDb no tiene un endpoint de "populares", así que usamos una selección de IDs de IMDb
const POPULAR_IDS = [
  'tt0848228', // The Avengers
  'tt4154796', // Avengers: Endgame
  'tt0468569', // The Dark Knight
  'tt1375666', // Inception
  'tt0816692', // Interstellar
  'tt3896198', // Guardians of the Galaxy Vol. 2
  'tt0903747', // Breaking Bad
  'tt1632701', // Suits
  'tt4574334', // Stranger Things
  'tt0944947', // Game of Thrones
  'tt0371746', // Iron Man
  'tt0133093', // The Matrix
]

// SSR: se ejecuta en el servidor con async/await.
// cache() evita repetir las peticiones si la portada y la lista la piden en la misma visita.
export const getPopular = cache(async (): Promise<MovieDetail[]> => {
  // Las peticiones van en paralelo para no sumar los tiempos de cada una
  const responses = await Promise.all(
    POPULAR_IDS.map((id) =>
      axios.get<MovieDetail>(OMDB_URL, { params: { apikey: API_KEY, i: id } })
    )
  )
  return responses.map((r) => r.data).filter((m) => m.Response === 'True')
})
