import OpenFicha from './OpenFicha'
import FavButton from './FavButton'
import PosterCard from './PosterCard'

interface Props {
  imdbID: string
  title: string
  year: string
  type: string
  poster: string
  rating?: string
  genre?: string
}

// Tarjeta completa: el póster abre la ficha y el corazón guarda en favoritos.
// Funciona dentro de componentes de servidor y de cliente.
export default function TituloCard({ imdbID, title, year, type, poster, rating, genre }: Props) {
  return (
    <div className="tarjeta-poster relative">
      <OpenFicha imdbID={imdbID} className="block w-full" label={`Ver ficha de ${title}`}>
        <PosterCard title={title} year={year} type={type} poster={poster} rating={rating} genre={genre} />
      </OpenFicha>
      <FavButton
        titulo={{ imdbID, Title: title, Year: year, Type: type, Poster: poster }}
        className="poster-fav absolute right-2 top-2"
      />
    </div>
  )
}
