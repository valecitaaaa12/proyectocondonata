import { useState, useEffect } from 'react'
import { getPromoState } from '../data/promos'

// ── Estado de la promo con reloj en vivo ──────────────────────────────────────
//  Devuelve el estado de la promo y lo refresca mientras sea visible
//  (cuenta regresiva + corte exacto a las 13:00 y a las 14:00).
//
//  Se usa en la sección de catálogo para que los precios se recalculen solos
//  cuando entra o sale de la ventana horaria, sin recargar la página.
//
//  Fuera del día de la promo no tictaquea nada: no hay renders innecesarios.
export function usePromoState(tickMs = 1000) {
  const [state, setState] = useState(() => getPromoState())

  useEffect(() => {
    // Promo no visible (otro día, o ya terminó) → sin intervalo
    if (!state.visible) return
    const id = setInterval(() => setState(getPromoState()), tickMs)
    return () => clearInterval(id)
  }, [state.visible, tickMs])

  return state
}
