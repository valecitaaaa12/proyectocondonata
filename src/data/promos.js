// ============================================================
//  Promo global temporal — 10 Bs de descuento en TODOS los
//  productos, miércoles 21 de octubre de 2026
//  de 13:00 a 14:00.
//
//  El horario se calcula con la hora oficial de Bolivia
//  (America/La_Paz · UTC-4 · sin horario de verano), así que
//  es el mismo para todos los clientes, estén donde estén.
// ============================================================

export const PROMO_HOY = {
  id: 'promo_10bs_21oct2026',
  discount: 10,
  label: '-10 Bs',
  title: 'TODOS los productos con 10 Bs menos',
  scheduleLabel: 'Hoy de 13:00 a 14:00',
  date: { year: 2026, month: 10, day: 21 },
  startHour: 13,
  endHour: 14,
  tzOffsetHours: -4, // America/La_Paz
}

const HOUR_MS = 3600 * 1000

// Instantes UTC en que empieza y termina la promoción
function windowMs() {
  const { date, startHour, endHour, tzOffsetHours } = PROMO_HOY
  const offset = tzOffsetHours * HOUR_MS
  return {
    start: Date.UTC(date.year, date.month - 1, date.day, startHour) - offset,
    end: Date.UTC(date.year, date.month - 1, date.day, endHour) - offset,
  }
}

// ── Estado de la promo respecto al reloj ──────────────────────────────────────
//  active      → dentro de la ventana: aplica el descuento
//  visible     → mostrar el aviso (hoy, antes o durante la ventana)
//  todayBefore → es hoy y aún no empezó (mostrar cuenta regresiva)
//  ended       → ya pasó la ventana
export function getPromoState(now = new Date()) {
  const { start, end } = windowMs()
  const t = typeof now === 'number' ? now : now.getTime()

  // Hora "en Bolivia" para comparar el día sin importar la zona del cliente
  const b = new Date(t + PROMO_HOY.tzOffsetHours * HOUR_MS)
  const isSameDay =
    b.getUTCFullYear() === PROMO_HOY.date.year &&
    b.getUTCMonth() + 1 === PROMO_HOY.date.month &&
    b.getUTCDate() === PROMO_HOY.date.day

  const active = t >= start && t < end

  return {
    ...PROMO_HOY,
    active,
    today: isSameDay,
    todayBefore: isSameDay && t < start,
    ended: t >= end,
    msToStart: Math.max(0, start - t),
    msToEnd: Math.max(0, end - t),
    // El aviso se ve hoy hasta que la promo termine; el descuento, solo en la ventana
    visible: active || (isSameDay && t < start),
  }
}

export const isPromoActive = (now) => getPromoState(now).active

// ── Aplicación del descuento ─────────────────────────────────────────────────
//  Devuelve los productos con el precio descontado y deja el precio original
//  en `basePrice` (para poder mostrarlo tachado). Fuera de la ventana no toca
//  nada, así que el catálogo base queda siempre intacto.
export function applyPromo(products, state = getPromoState()) {
  if (!state.active) return products
  return products.map(p =>
    p.price
      ? { ...p, basePrice: p.price, price: Math.max(p.price - state.discount, 0), promoDiscount: state.discount }
      : p
  )
}
