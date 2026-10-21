import { Flame } from 'lucide-react'
import { PROMO_HOY } from '../data/promos'

// ── Cuenta regresiva legible ──────────────────────────────────────────────────
function fmt(ms) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = String(Math.floor(total / 3600)).padStart(2, '0')
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
  const s = String(total % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

// ── Aviso de la promo del día ────────────────────────────────────────────────
//  Recibe el estado desde el catálogo (que es quien tiene el reloj) y se
//  muestra solo mientras la promo sea visible:
//   · antes de las 13:00 → anuncia y cuenta regresiva para que empiece
//   · de 13:00 a 14:00   → promo activa y cuánto falta para que termine
//   · después de las 14:00 → desaparece
export default function PromoHoyBanner({ state }) {
  if (!state || !state.visible) return null

  const active = state.active

  return (
    <div
      className={`mb-5 rounded-2xl px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 border ${
        active
          ? 'bg-gradient-to-r from-rose-600/30 via-primary-600/25 to-amber-500/15 border-rose-400/40'
          : 'bg-white/5 border-white/10'
      }`}
    >
      {/* Icono + estado */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            active ? 'bg-rose-500/25 text-rose-300 animate-pulse' : 'bg-white/10 text-white/40'
          }`}>
          <Flame size={17} />
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-black ${active ? 'text-white' : 'text-white/70'}`}>
              {PROMO_HOY.label} en TODOS los productos
            </span>
            {active ? (
              <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                Activa ahora
              </span>
            ) : (
              <span className="bg-white/10 text-white/50 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                {PROMO_HOY.scheduleLabel}
              </span>
            )}
          </p>
          <p className="text-white/45 text-[11px] mt-0.5">
            {active
              ? `Válido hoy de ${String(PROMO_HOY.startHour).padStart(2, '0')}:00 a ${String(PROMO_HOY.endHour).padStart(2, '0')}:00 · el descuento ya está aplicado en los precios`
              : 'La promo aplica sola en el precio de cada producto al llegar la hora.'}
          </p>
        </div>
      </div>

      {/* Reloj */}
      <div className="shrink-0 flex items-center gap-3 bg-dark-900/40 border border-white/10 rounded-xl px-3.5 py-2 self-start sm:self-auto">
        <span className="text-white/40 text-[9px] font-black uppercase tracking-wider">
          {active ? 'Termina en' : 'Empieza en'}
        </span>
        <span className="text-white font-black text-lg tabular-nums leading-none">
          {fmt(active ? state.msToEnd : state.msToStart)}
        </span>
      </div>
    </div>
  )
}
