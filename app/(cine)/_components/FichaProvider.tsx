'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import MovieModal from './MovieModal'

// Función para abrir la ficha de un título desde cualquier parte de la página
const AbrirFichaContext = createContext<(imdbID: string) => void>(() => {})

export const useAbrirFicha = () => useContext(AbrirFichaContext)

// Guarda qué título está abierto y muestra la ficha en un modal
export default function FichaProvider({ children }: { children: React.ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const cerrar = useCallback(() => setSelectedId(null), [])

  return (
    <AbrirFichaContext value={setSelectedId}>
      {children}
      {selectedId && <MovieModal imdbID={selectedId} onClose={cerrar} />}
    </AbrirFichaContext>
  )
}
