'use client'

import { useAbrirTrailer } from './FichaProvider'

interface Props {
  title: string
  year: string
  videoId?: string
  className?: string
  label?: string
  children: React.ReactNode
}

// Botón que abre el tráiler en el modal de video
export default function OpenTrailer({ title, year, videoId, className = '', label, children }: Props) {
  const abrirTrailer = useAbrirTrailer()
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => abrirTrailer({ title, year, videoId })}
      className={`cursor-pointer text-left ${className}`}
    >
      {children}
    </button>
  )
}
