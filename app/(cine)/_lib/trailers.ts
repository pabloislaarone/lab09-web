// Tráileres oficiales en YouTube (id de IMDb -> id del video).
// OMDb no trae videos, así que se guardan aquí para los títulos de la cartelera.
const TRAILERS: Record<string, string> = {
  tt15239678: 'U2Qp5pL3ovA', // Dune: Part Two
  tt15398776: 'uYPbbksJxIg', // Oppenheimer
  tt4154796: 'TcMBFSGVi1c', // Avengers: Endgame
  tt10872600: 'JfVOs4VSpmA', // Spider-Man: No Way Home
  tt7286456: 'zAGVQLHvwOY', // Joker
  tt0816692: 'zSWdZVtXT7E', // Interstellar
  tt1375666: 'YoHD9XEInc0', // Inception
  tt0468569: 'EXeTwQWrcwY', // The Dark Knight
  tt0848228: 'eOrNdBpGMv8', // The Avengers
  tt0371746: '8ugaeA-nMTc', // Iron Man
  tt0133093: 'vKQi3bBA1y8', // The Matrix
  tt4574334: 'b9EkMc79ZSU', // Stranger Things
  tt3581920: 'uLtkt8BonwM', // The Last of Us
  tt13443470: 'Di310WS8zLk', // Wednesday
  tt0903747: 'HhesaQXLuRY', // Breaking Bad
}

export const getTrailer = (imdbID: string): string | undefined => TRAILERS[imdbID]

export const trailerThumb = (videoId: string) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

export const trailerEmbed = (videoId: string) =>
  `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`

// Para los títulos sin tráiler guardado (por ejemplo, los de la búsqueda)
export const trailerSearch = (title: string, year: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} ${year.slice(0, 4)} trailer`)}`
