import { Clapperboard } from 'lucide-react'
import { hasPoster } from '../_lib/omdb'

interface Props {
  src: string
  title: string
  className?: string
  // true para el póster que se ve primero (se carga sin esperar)
  priority?: boolean
}

// Póster con respaldo cuando OMDb no tiene imagen ("N/A")
export default function Poster({ src, title, className = '', priority = false }: Props) {
  if (!hasPoster(src)) {
    return (
      <div
        role="img"
        aria-label={`${title} (sin póster)`}
        className={`flex aspect-[2/3] w-full flex-col justify-between bg-gradient-to-b from-telon to-butaca p-4 ${className}`}
      >
        <Clapperboard aria-hidden className="h-6 w-6 text-foco/70" />
        <span className="font-marquee text-2xl font-extrabold leading-none text-pantalla/90">{title}</span>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`Póster de ${title}`}
      loading={priority ? 'eager' : 'lazy'}
      className={`block aspect-[2/3] w-full bg-butaca object-cover ${className}`}
    />
  )
}
