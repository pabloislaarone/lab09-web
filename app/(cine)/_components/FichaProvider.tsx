'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import MovieModal from './MovieModal'
import TrailerModal from './TrailerModal'

export interface TrailerPedido {
  title: string
  year: string
  videoId?: string
}

interface CineContext {
  abrirFicha: (imdbID: string) => void
  abrirTrailer: (trailer: TrailerPedido) => void
}

const Contexto = createContext<CineContext>({ abrirFicha: () => {}, abrirTrailer: () => {} })

export const useAbrirFicha = () => useContext(Contexto).abrirFicha
export const useAbrirTrailer = () => useContext(Contexto).abrirTrailer

// Guarda qué ficha o qué tráiler está abierto y muestra su modal
export default function FichaProvider({ children }: { children: React.ReactNode }) {
  const [fichaId, setFichaId] = useState<string | null>(null)
  const [trailer, setTrailer] = useState<TrailerPedido | null>(null)

  const cerrarFicha = useCallback(() => setFichaId(null), [])
  const cerrarTrailer = useCallback(() => setTrailer(null), [])
  const valor = useMemo(() => ({ abrirFicha: setFichaId, abrirTrailer: setTrailer }), [])

  return (
    <Contexto value={valor}>
      {children}
      {fichaId && <MovieModal imdbID={fichaId} onClose={cerrarFicha} />}
      {trailer && <TrailerModal trailer={trailer} onClose={cerrarTrailer} />}
    </Contexto>
  )
}
