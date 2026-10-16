import { useState, useEffect, useRef } from 'react'
import { Clock, Gift, Flame, ChevronLeft, ChevronRight, Star, Trophy, Tag } from 'lucide-react'
import { getMergedProducts } from '../context/AdminContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useScrollReveal } from '../hooks/useScrollReveal'

// ── Deterministic shuffle via seed ─────────────────────────────────────────────
function seededRand(seed) {
  let s = seed
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}
function seededShuffle(arr, seed) {
  const a = [...arr]; const r = seededRand(seed)
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

// ── Monday deal (21:30–22:30, -10 Bs on 1 random product) ─────────────────────
function getMondayDeal() {
  const now = new Date()
  const seed = now.getFullYear() * 100 + now.getMonth() * 4 + Math.floor(now.getDate() / 7)
  const pool = getMergedProducts().filter(p => p.price && p.price >= 100 && p.category !== 'accesorio')
  const shuffled = seededShuffle(pool, seed)
  return shuffled[0] || null
}

function getMondayWindow() {
  const now = new Date()
  const day = now.getDay() // 0=Sun, 1=Mon
  // Next Monday
  const daysUntilMon = day === 1 ? 0 : (8 - day) % 7
  const nextMon = new Date(now)
  nextMon.setDate(now.getDate() + daysUntilMon)
  nextMon.setHours(21, 30, 0, 0)
  const end = new Date(nextMon); end.setHours(22, 30, 0, 0)
  const isActive = day === 1 && now.getHours() >= 21 && (now.getHours() < 22 || (now.getHours() === 22 && now.getMinutes() < 30))
  return { nextMon, end, isActive }
}

function useCountdown(target) {
  const [diff, setDiff] = useState(0)
  useEffect(() => {
    const tick = () => setDiff(Math.max(0, target - Date.now()))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [target])
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return { h, m, s, done: diff === 0 }
}

function CountdownBlock({ v, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-black text-white tabular-nums w-10 text-center">{String(v).padStart(2,'0')}</span>
      <span className="text-white/30 text-[9px] uppercase tracking-wider">{label}</span>
    </div>
  )
}

// ── Seasonal promos (-15 Bs on 5 products, carousel) ──────────────────────────
function getSeasonalPromo() {
  const now = new Date()
  const m = now.getMonth() + 1, d = now.getDate()
  // Black Friday: last Friday of November
  if (m === 11 && d >= 25) return { name: 'Black Friday', emoji: '🖤', color: 'from-gray-900 to-dark-800' }
  // Navidad
  if (m === 12 && d >= 15) return { name: 'Navidad',      emoji: '🎄', color: 'from-red-900/40 to-green-900/30' }
  // Año Nuevo
  if (m === 1  && d <= 5)  return { name: 'Año Nuevo',    emoji: '🎆', color: 'from-blue-900/40 to-purple-900/30' }
  // Día del Trabajador
  if (m === 5  && d === 1) return { name: 'Día del Trabajador', emoji: '🔨', color: 'from-amber-900/30 to-dark-800' }
  // Independencia Bolivia
  if (m === 8  && d === 6) return { name: 'Independencia de Bolivia', emoji: '🇧🇴', color: 'from-red-900/30 to-yellow-900/20' }
  return null
}

function getSeasonalProducts() {
  const seed = new Date().getMonth() * 31 + new Date().getDate()
  const pool = getMergedProducts().filter(p => p.price && p.price >= 100 && p.category !== 'accesorio')
  return seededShuffle(pool, seed).slice(0, 5)
}

function PromoCarousel({ items, discount }) {
  const [idx, setIdx] = useState(0)
  const { addItem } = useCart()
  const prev = () => setIdx(i => (i - 1 + items.length) % items.length)
  const next = () => setIdx(i => (i + 1) % items.length)

  const p = items[idx]
  if (!p) return null

  return (
    <div className="relative bg-dark-700 border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-4 p-5">
        <button onClick={prev} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 shrink-0 transition-colors">
          <ChevronLeft size={16} />
        </button>
        <div className="flex-1 flex items-center gap-4">
          <span className="text-4xl shrink-0">{p.emoji || p.name?.charAt(0) || '🏷️'}</span>
          <div className="flex-1 min-w-0">
            <p className="text-primary-400 text-[10px] font-black uppercase">{p.brand}</p>
            <p className="font-bold text-white text-sm truncate">{p.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="line-through text-white/30 text-xs">Bs. {p.price}</span>
              <span className="font-black text-emerald-400 text-base">Bs. {p.price - discount}</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30">-{discount} Bs</span>
            </div>
          </div>
        </div>
        <button onClick={() => addItem({ ...p, selectedFlavor: p.flavors?.[0], price: p.price - discount })}
          className="w-9 h-9 rounded-xl bg-primary-600 hover:bg-primary-700 flex items-center justify-center text-white shrink-0 transition-all hover:scale-110">
          <Tag size={15} />
        </button>
        <button onClick={next} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 shrink-0 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-1.5 pb-3">
        {items.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-5 bg-primary-500' : 'w-1.5 bg-white/20'}`} />
        ))}
      </div>
    </div>
  )
}

// ── Monthly lottery ────────────────────────────────────────────────────────────
function LotterySection() {
  const { currentUser } = useAuth()
  const now = new Date()
  const totalOrdersBs = (currentUser?.orders || []).reduce((s, o) => s + (o.total || 0), 0)
  const eligible = currentUser && totalOrdersBs >= 1000

  // Next draw: last day of month
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  lastDay.setHours(20, 0, 0, 0)
  const { h, m, s } = useCountdown(lastDay.getTime())

  return (
    <div className="bg-gradient-to-br from-amber-900/30 to-dark-700 border border-amber-500/20 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
          <Trophy size={20} className="text-amber-400" />
        </div>
        <div>
          <p className="font-black text-white text-sm">Sorteo mensual 🎁</p>
          <p className="text-white/40 text-xs">Gift card de <strong className="text-amber-400">50 Bs</strong></p>
        </div>
      </div>
      <p className="text-white/50 text-xs mb-3 leading-relaxed">
        Cada mes sorteamos una gift card de 50 Bs entre clientes registrados mayores de 18 años con compras superiores a 1.000 Bs.
      </p>
      <div className="bg-dark-800/60 rounded-xl p-3 mb-3">
        <p className="text-white/30 text-[10px] text-center mb-2">Próximo sorteo en</p>
        <div className="flex items-center justify-center gap-3">
          <CountdownBlock v={h + (lastDay.getDate() - now.getDate()) * 24} label="horas" />
          <span className="text-white/20 font-black">:</span>
          <CountdownBlock v={m} label="min" />
          <span className="text-white/20 font-black">:</span>
          <CountdownBlock v={s} label="seg" />
        </div>
      </div>
      {currentUser ? (
        eligible ? (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2.5">
            <Star size={14} className="text-emerald-400 fill-emerald-400 shrink-0" />
            <p className="text-emerald-300 text-xs font-semibold">
              ¡Estás participando! Tus compras: Bs. {totalOrdersBs.toLocaleString('es-BO')}
            </p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
            <p className="text-white/40 text-xs text-center">
              Necesitás Bs. {Math.max(0, 1000 - totalOrdersBs).toLocaleString('es-BO')} más en compras para participar
            </p>
          </div>
        )
      ) : (
        <p className="text-white/30 text-xs text-center">Iniciá sesión para participar</p>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function PromoEngine() {
  const [ref, visible] = useScrollReveal()
  const { isActive, nextMon, end } = getMondayWindow()
  const { h: mh, m: mm, s: ms } = useCountdown(isActive ? end.getTime() : nextMon.getTime())
  const mondayDeal = getMondayDeal()
  const seasonal = getSeasonalPromo()
  const seasonalProducts = getSeasonalProducts()
  const { addItem } = useCart()

  return (
    <section id="promos" className="py-20 bg-dark-900 border-t border-white/5">
      <div ref={ref} className={`max-w-6xl mx-auto px-5 reveal ${visible ? 'visible' : ''}`}>

        <div className="text-center mb-12">
          <h2 className="section-title">Promociones <span>especiales</span></h2>
          <p className="section-sub">Ofertas de temporada, lunes de descuento y sorteos mensuales.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Monday deal */}
          <div className={`rounded-2xl p-5 border ${isActive ? 'bg-gradient-to-br from-primary-900/50 to-dark-700 border-primary-500/30' : 'bg-dark-700 border-white/10'}`}>
            <div className="flex items-center gap-2 mb-3">
              <Flame size={18} className={isActive ? 'text-primary-400' : 'text-white/30'} />
              <span className="font-black text-white text-sm">Oferta del Lunes</span>
              {isActive && (
                <span className="ml-auto bg-primary-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full animate-pulse">ACTIVA AHORA</span>
              )}
            </div>
            <p className="text-white/40 text-xs mb-4">
              Cada lunes de <strong className="text-white/70">21:30 a 22:30</strong> — un producto con <strong className="text-primary-400">10 Bs de descuento</strong> por tiempo limitado.
            </p>

            {/* Countdown */}
            <div className="bg-dark-800/60 rounded-xl p-3 mb-4">
              <p className="text-white/30 text-[10px] text-center mb-2">
                {isActive ? 'Oferta termina en' : 'Próxima oferta en'}
              </p>
              <div className="flex items-center justify-center gap-3">
                <CountdownBlock v={mh} label="horas" />
                <span className="text-white/20 font-black text-lg">:</span>
                <CountdownBlock v={mm} label="min" />
                <span className="text-white/20 font-black text-lg">:</span>
                <CountdownBlock v={ms} label="seg" />
              </div>
            </div>

            {/* Deal product */}
            {mondayDeal && (
              <div className={`flex items-center gap-3 rounded-xl p-3 border ${isActive ? 'bg-primary-600/10 border-primary-500/30' : 'bg-white/5 border-white/5 opacity-60'}`}>
                <span className="text-3xl">{mondayDeal.emoji || mondayDeal.name?.charAt(0) || '🔥'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate">{mondayDeal.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="line-through text-white/30 text-xs">Bs. {mondayDeal.price}</span>
                    <span className="font-black text-primary-400">Bs. {mondayDeal.price - 10}</span>
                  </div>
                </div>
                {isActive && (
                  <button onClick={() => addItem({ ...mondayDeal, selectedFlavor: mondayDeal.flavors?.[0], price: mondayDeal.price - 10 })}
                    className="btn-primary px-3 py-2 text-xs rounded-xl">
                    Agregar
                  </button>
                )}
              </div>
            )}
            {!isActive && (
              <p className="text-white/20 text-[10px] text-center mt-2">El producto se revela cuando comienza la oferta</p>
            )}
          </div>

          {/* Seasonal promo */}
          <div className="flex flex-col gap-4">
            {seasonal ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{seasonal.emoji}</span>
                  <span className="font-black text-white text-sm">Promo {seasonal.name}</span>
                  <span className="ml-auto bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full">-15 Bs</span>
                </div>
                <p className="text-white/40 text-xs mb-3">5 productos con 15 Bs de descuento por tiempo limitado</p>
                <PromoCarousel items={seasonalProducts} discount={15} />
              </div>
            ) : (
              <div className="bg-dark-700 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Gift size={18} className="text-white/30" />
                  <span className="font-black text-white/50 text-sm">Promos de temporada</span>
                </div>
                <p className="text-white/30 text-xs leading-relaxed">
                  En Navidad, Año Nuevo, Black Friday e independencia activamos descuentos de temporada. Seguinos para no perderlos. 🎁
                </p>
              </div>
            )}

            <LotterySection />
          </div>
        </div>

      </div>
    </section>
  )
}
