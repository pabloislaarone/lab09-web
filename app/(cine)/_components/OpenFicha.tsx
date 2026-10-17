'use client'

import { useAbrirFicha } from './FichaProvider'

interface Props {
  imdbID: string
  className?: string
  children: React.ReactNode
  label?: string
}

// Botón que abre la ficha completa. Permite que la cartelera (componente de
// servidor) tenga elementos clicables sin dejar de renderizarse en el servidor.
export default function OpenFicha({ imdbID, className = '', children, label }: Props) {
  const abrirFicha = useAbrirFicha()
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => abrirFicha(imdbID)}
      className={`cursor-pointer text-left focus-visible:outline-none ${className}`}
    >
      {children}
    </button>
  )
}
