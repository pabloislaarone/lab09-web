'use client'

import { useSyncExternalStore } from 'react'
import { getFavoritos, getFavoritosServidor, subscribeFavoritos } from '../_lib/favoritos'

// Lista de favoritos que se actualiza en todos los componentes al mismo tiempo
export function useFavoritos() {
  return useSyncExternalStore(subscribeFavoritos, getFavoritos, getFavoritosServidor)
}
