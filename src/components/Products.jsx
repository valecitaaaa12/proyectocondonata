import { useState, useRef, useEffect } from 'react'
import {
  Plus, Wind, ChevronDown, ChevronUp, Tag, Bell,
  Scale, X, Check, Heart, Search, SlidersHorizontal,
  Zap, Package, Plug, Layers, ShoppingBag, Share2,
} from 'lucide-react'
import { categories } from '../data/products'
import { getMergedProducts } from '../context/AdminContext'
import NewProductBanner from './NewProductBanner'
import PromoHoyBanner from './PromoHoyBanner'
import { usePromoState } from '../hooks/usePromo'
import { useCart } from '../context/CartContext'
import { useAdmin } from '../context/AdminContext'
import { useAuth } from '../context/AuthContext'
import { useScrollReveal } from '../hooks/useScrollReveal'

// ── Notify-when-back ──────────────────────────────────────────────────────────
function addToNotifyList(productId, phone) {
  try {
    const list = JSON.parse(localStorage.getItem('bbv_notify_list') || '[]')
    if (!list.find(e => e.productId === productId && e.phone === phone)) {
      list.push({ productId, phone, date: new Date().toISOString() })
      localStorage.setItem('bbv_notify_list', JSON.stringify(list))
    }
  } catch { /* ignore */ }
}

// ── Category meta ─────────────────────────────────────────────────────────────
const categoryMeta = {
  desechable: { grad: 'from-sky-900/50 via-blue-900/30 to-dark-700',    accent: '#38bdf8', Icon: Wind    },
  tipoC:      { grad: 'from-violet-900/50 via-purple-900/30 to-dark-700', accent: '#a78bfa', Icon: Plug    },
  lego:       { grad: 'from-amber-900/40 via-yellow-900/20 to-dark-700', accent: '#fbbf24', Icon: Layers  },
  accesorio:  { grad: 'from-emerald-900/40 via-teal-900/20 to-dark-700', accent: '#34d399', Icon: Package },
}

// Initial-letter card (replaces generic emoji fallback)
function ProductInitial({ name, accent }) {
  return (
    <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black select-none"
      style={{ background: `radial-gradient(circle at 30% 30%, ${accent}33, ${accent}11)`, color: accent, border: `1px solid ${accent}33` }}>
      {name.charAt(0)}
    </div>
  )
}

const badgeStyles = {
  oferta:  'bg-amber-400/90 text-black',
  mega:    'bg-rose-500 text-white',
  nuevo:   'bg-primary-600 text-white',
  limited: 'bg-cyan-500 text-black',
}

// Cross-sell: simplistic — same category, excluding self, sorted random
function getCrossSell(p) {
  const pool = getMergedProducts().filter(x => x.id !== p.id && x.category === p.category && x.price)
  const seed = p.id * 31
  const r = (s => () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 })(seed)
  return [...pool].sort(() => r() - 0.5).slice(0, 3)
}

// ── ProductCard ───────────────────────────────────────────────────────────────
function ProductCard({ p, compareList, onCompareToggle, animDelay = 0 }) {
  const { addItem }         = useCart()
  const { getProductStock } = useAdmin()
  const { currentUser, toggleFavorite, isFavorite, setAuthModal } = useAuth()

  const stockInfo    = getProductStock(p.id)
  const isOutOfStock = stockInfo.disabled || stockInfo.stock === 0
  const isLowStock   = !isOutOfStock && stockInfo.stock !== null && stockInfo.stock <= 5 && stockInfo.stock > 0
  const favorited    = isFavorite(p.id)
  const meta         = categoryMeta[p.category] || categoryMeta.accesorio

  const flavors    = p.flavors || []
  const [selectedFlavor, setSelectedFlavor] = useState(flavors[0] || '')
  const [showFlavors,    setShowFlavors]    = useState(false)
  const [notifyOpen,     setNotifyOpen]     = useState(false)
  const [notifyPhone,    setNotifyPhone]    = useState('')
  const [notifySent,     setNotifySent]     = useState(false)
  const [showCross,      setShowCross]      = useState(false)
  const [added,          setAdded]          = useState(false)

  const hasFlavors = flavors.length > 1 || (flavors.length === 1 && !flavors[0].startsWith('Solo'))
  const crossSell  = getCrossSell(p)

  const handleShare = () => {
    const flavor = selectedFlavor && !selectedFlavor.startsWith('Solo') ? ` - ${selectedFlavor}` : ''
    const price = p.price ? `Bs. ${p.price}` : 'Consultar precio'
    const text = `¡Mirá este vape en Bad Bunny Vape Bolivia! 🔥\n\n*${p.name}${flavor}*\n${p.puffs} · ${p.nicotina} nicotina\n${price}\n\nhttps://bad-bunny-vape-bolivia.vercel.app/#productos`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleAdd = () => {
    if (isOutOfStock || !p.price) return
    addItem({ ...p, selectedFlavor })
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  const handleFavorite = () => {
    if (!currentUser) { setAuthModal('login'); return }
    toggleFavorite(p.id)
  }

  const handleNotify = () => {
    if (!notifyPhone.trim()) return
    addToNotifyList(p.id, notifyPhone.trim())
    setNotifySent(true)
    setTimeout(() => { setNotifyOpen(false); setNotifySent(false); setNotifyPhone('') }, 2000)
  }

  return (
    <article
      className={`card flex flex-col group relative animate-card-enter ${isOutOfStock ? 'opacity-60' : ''}`}
      style={{ animationDelay: `${animDelay}ms`, animationFillMode: 'both' }}
    >
      {/* ── Image / Visual area ── */}
      <div className={`relative bg-gradient-to-br ${meta.grad} flex items-center justify-center overflow-hidden`}
        style={{ minHeight: 180 }}>

        {/* Animated mesh overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${meta.accent}18, transparent)`,
          }} />

        {/* Badges row */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          {isLowStock && (
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-500/90 text-white backdrop-blur-sm">
              Últimas unidades
            </span>
          )}
          {p.badge && !isLowStock && (
            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full backdrop-blur-sm ${badgeStyles[p.badge]}`}>
              {p.badgeText}
            </span>
          )}
          {p.promoTag && (
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/90 text-black backdrop-blur-sm flex items-center gap-1">
              <Tag size={8} />{p.promoTag}
            </span>
          )}
        </div>

        {/* Top-right actions */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
          {/* Favorite */}
          <button onClick={handleFavorite}
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 border backdrop-blur-sm ${
              favorited ? 'bg-rose-500/30 border-rose-400/50 text-rose-400' : 'bg-black/30 border-white/10 text-white/30 hover:text-rose-400 hover:border-rose-400/40'
            }`}>
            <Heart size={12} className={favorited ? 'fill-rose-400' : ''} />
          </button>
          {/* Compare */}
          <button onClick={() => onCompareToggle(p.id)}
            title={compareList.includes(p.id) ? 'Quitar del comparador' : 'Comparar'}
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 border backdrop-blur-sm ${
              compareList.includes(p.id)
                ? 'bg-primary-600 border-primary-500 text-white'
                : 'bg-black/30 border-white/10 text-white/30 hover:border-primary-400/40 hover:text-primary-400'
            }`}>
            <Scale size={11} />
          </button>
        </div>

        {/* Out-of-stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-dark-900/70 backdrop-blur-[2px]">
            <span className="bg-rose-500 text-white text-[11px] font-black px-3 py-1.5 rounded-full tracking-wide uppercase">
              Agotado
            </span>
          </div>
        )}

        {/* Product image or letter */}
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            className="card-img w-full h-[180px] object-cover object-center"
            loading="lazy"
            onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.style && (e.currentTarget.nextElementSibling.style.display = 'flex') }}
          />
        ) : null}
        <div className={`py-10 ${p.image ? 'hidden' : 'flex'} items-center justify-center`}>
          <ProductInitial name={p.name} accent={meta.accent} />
        </div>
      </div>

      {/* ── Info area ── */}
      <div className="p-4 flex flex-col flex-1 gap-2.5">
        <div>
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: meta.accent }}>
              {p.brand}
            </span>
          </div>
          <h3 className="font-bold text-white text-sm leading-snug">{p.name}</h3>
        </div>

        {/* Spec chips */}
        <div className="flex flex-wrap gap-1.5">
          <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${meta.accent}15`, color: meta.accent, border: `1px solid ${meta.accent}25` }}>
            <Wind size={9} />{p.puffs}
          </span>
          {p.nicotina !== '—' && (
            <span className="bg-white/5 border border-white/10 text-white/40 text-[10px] px-2 py-0.5 rounded-full">
              {p.nicotina} nic.
            </span>
          )}
          <span className="bg-white/5 border border-white/10 text-white/25 text-[10px] px-2 py-0.5 rounded-full truncate max-w-[110px]">
            {p.tipo}
          </span>
        </div>

        {/* Flavor selector */}
        {hasFlavors && (
          <div className="relative">
            <button onClick={() => setShowFlavors(v => !v)}
              className="w-full flex items-center justify-between bg-white/5 border border-white/10 hover:border-primary-500/40 rounded-xl px-3 py-2 text-left transition-all duration-200 group/fl">
              <span className="text-[11px] text-white/60 font-medium truncate group-hover/fl:text-white/80">{selectedFlavor}</span>
              {showFlavors
                ? <ChevronUp size={12} className="text-white/30 shrink-0" />
                : <ChevronDown size={12} className="text-white/30 shrink-0" />}
            </button>
            {showFlavors && (
              <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-dark-800 border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/60 max-h-44 overflow-y-auto animate-[fadeUpSm_0.2s_ease_both]">
                {flavors.map((f, i) => (
                  <button key={i}
                    onClick={() => { setSelectedFlavor(f); setShowFlavors(false) }}
                    className={`w-full text-left px-3 py-2 text-[11px] font-medium transition-colors ${
                      selectedFlavor === f ? 'bg-primary-600/25 text-primary-300' : 'text-white/55 hover:bg-white/5 hover:text-white'
                    }`}>
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Price + Add */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            {p.price ? (
              <>
                <span className="text-white font-black text-xl leading-none">Bs. {p.price}</span>
                {p.oldPrice > p.price && (
                  <>
                    <span className="text-white/30 text-xs line-through">Bs. {p.oldPrice}</span>
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300">
                      −{Math.round((1 - p.price / p.oldPrice) * 100)}%
                    </span>
                  </>
                )}
                {/* Promo del día: precio original tachado + descuento */}
                {p.promoDiscount && !p.oldPrice && p.basePrice && (
                  <span className="text-white/30 text-xs line-through">Bs. {p.basePrice}</span>
                )}
                {p.promoDiscount && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-rose-500/25 border border-rose-400/40 text-rose-200">
                    🔥 −{p.promoDiscount} Bs
                  </span>
                )}
              </>
            ) : (
              <span className="text-amber-400 font-bold text-sm">Consultar</span>
            )}
          </div>

          {/* Share */}
          <button onClick={handleShare}
            className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-500/20 hover:border-emerald-400/40 hover:text-emerald-400 text-white/25 flex items-center justify-center transition-all duration-200 shrink-0"
            aria-label="Compartir por WhatsApp"
            title="Compartir por WhatsApp">
            <Share2 size={13} />
          </button>

          {isOutOfStock ? (
            <button onClick={() => setNotifyOpen(v => !v)}
              className="flex items-center gap-1.5 px-3 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40 hover:text-amber-300 text-white/35 text-[11px] font-bold transition-all">
              <Bell size={12} />
              Avísame
            </button>
          ) : (
            <button onClick={handleAdd} disabled={!p.price}
              className={`btn-add w-10 h-10 rounded-xl text-white flex items-center justify-center transition-all duration-200 shrink-0 ${
                added
                  ? 'bg-emerald-500 scale-90'
                  : 'bg-primary-600 hover:bg-primary-700 hover:scale-110 active:scale-95 disabled:bg-white/10 disabled:cursor-not-allowed'
              }`}
              style={!added ? { boxShadow: '0 4px 16px rgba(219,39,119,0.4)' } : {}}
              aria-label={`Agregar ${p.name}`}>
              {added ? <Check size={16} /> : <Plus size={18} />}
            </button>
          )}
        </div>

        {/* Notify form */}
        {notifyOpen && isOutOfStock && (
          <div className="bg-dark-800 border border-amber-400/20 rounded-xl p-3 flex flex-col gap-2 animate-[fadeUpSm_0.2s_ease_both]">
            {notifySent ? (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <Check size={13} />¡Listo! Te avisamos cuando llegue.
              </div>
            ) : (
              <>
                <p className="text-white/50 text-[11px]">Dejá tu WhatsApp y te avisamos:</p>
                <div className="flex gap-2">
                  <input type="tel" value={notifyPhone} onChange={e => setNotifyPhone(e.target.value)}
                    placeholder="Tu número" className="input-field text-xs py-2 flex-1" />
                  <button onClick={handleNotify}
                    className="px-3 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] font-bold hover:bg-amber-500/40 transition-all">
                    OK
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Cross-sell */}
        {crossSell.length > 0 && (
          <div>
            <button onClick={() => setShowCross(v => !v)}
              className="text-white/25 text-[10px] hover:text-white/50 transition-colors flex items-center gap-1">
              <ShoppingBag size={10} />
              También llevaron
              {showCross ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
            </button>
            {showCross && (
              <div className="mt-2 flex flex-col gap-1.5 animate-[fadeUpSm_0.2s_ease_both]">
                {crossSell.map(cs => (
                  <div key={cs.id} className="flex items-center gap-2 bg-white/5 rounded-xl px-2.5 py-1.5 hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => {
                      addItem({ ...cs, selectedFlavor: cs.flavors?.[0] })
                      // scroll to product
                      document.getElementById(`prod-${cs.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }}>
                    <span className="text-sm shrink-0"
                      style={{ color: (categoryMeta[cs.category] || categoryMeta.accesorio).accent }}>
                      {cs.name.charAt(0)}
                    </span>
                    <span className="text-white/50 text-[10px] truncate flex-1">{cs.name}</span>
                    <span className="shrink-0 flex items-center gap-1">
                      {cs.oldPrice > cs.price && <span className="text-white/20 line-through text-[9px]">Bs. {cs.oldPrice}</span>}
                      <span className="text-white/40 font-bold text-[10px]">Bs. {cs.price}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

// ── Comparator ────────────────────────────────────────────────────────────────
function Comparator({ ids, onClose }) {
  if (ids.length < 2) return null
  const items = ids.map(id => getMergedProducts().find(p => p.id === id)).filter(Boolean)
  const rows = [
    { label: 'Precio',   fn: p => p.price ? (p.oldPrice > p.price ? `Bs. ${p.price} (antes Bs. ${p.oldPrice})` : `Bs. ${p.price}`) : 'Consultar' },
    { label: 'Puffs',    fn: p => p.puffs },
    { label: 'Nicotina', fn: p => p.nicotina },
    { label: 'Tipo',     fn: p => p.tipo },
    { label: 'Sabores',  fn: p => `${(p.flavors || []).length}` },
  ]
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[200]" />
      <div className="fixed inset-0 z-[201] flex items-center justify-center px-4 pointer-events-none">
        <div className="bg-dark-800 border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl pointer-events-auto animate-[pop_0.3s_cubic-bezier(0.34,1.56,0.64,1)_both] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Scale size={17} className="text-primary-400" />
              <span className="font-black text-white">Comparador</span>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-dark-700 flex items-center justify-center text-white/50 hover:text-white transition-colors">
              <X size={15} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-5 py-3 text-white/35 text-xs font-medium w-24" />
                  {items.map(p => {
                    const meta = categoryMeta[p.category] || categoryMeta.accesorio
                    return (
                      <th key={p.id} className="px-4 py-3 text-center">
                        <div className="w-10 h-10 rounded-xl mx-auto mb-1 flex items-center justify-center font-black text-lg"
                          style={{ background: `${meta.accent}18`, color: meta.accent }}>
                          {p.name.charAt(0)}
                        </div>
                        <div className="text-[9px] font-black uppercase" style={{ color: meta.accent }}>{p.brand}</div>
                        <div className="text-white font-bold text-[11px] leading-tight">{p.name}</div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                    <td className="px-5 py-3 text-white/35 text-xs font-medium">{row.label}</td>
                    {items.map(p => {
                      const val     = row.fn(p)
                      const isPrice = row.label === 'Precio'
                      const best    = isPrice && p.price === Math.min(...items.map(x => x.price || 9999))
                      return (
                        <td key={p.id} className="px-4 py-3 text-center">
                          <span className={`text-sm font-semibold ${best ? 'text-emerald-400' : 'text-white/65'}`}>
                            {val}{best && <span className="ml-1 text-[9px]">✓</span>}
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Tab icon map ──────────────────────────────────────────────────────────────
const tabIcons = { all: ShoppingBag, desechable: Wind, tipoC: Plug, lego: Layers, accesorio: Package }
const tabAccents = { all: '#ec4899', desechable: '#38bdf8', tipoC: '#a78bfa', lego: '#fbbf24', accesorio: '#34d399' }

// ── Main Products section ─────────────────────────────────────────────────────
export default function Products() {
  // Reloj de la promo del día: mantiene vivos los precios mientras la promo
  // esté visible, para que corte exacto a las 13:00 y a las 14:00
  const promo = usePromoState()
  const products = getMergedProducts()
  const [activeTab,   setActiveTab]   = useState('all')
  const [search,      setSearch]      = useState('')
  const [compareList, setCompareList] = useState([])
  const [showCompare, setShowCompare] = useState(false)
  const [panelOpen,   setPanelOpen]   = useState(true)
  const [headerRef,   headerVisible]  = useScrollReveal()

  const filteredByTab = activeTab === 'all'
    ? products
    : products.filter(p => p.category === activeTab)

  const filtered = search.trim()
    ? filteredByTab.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        (p.flavors || []).some(f => f.toLowerCase().includes(search.toLowerCase()))
      )
    : filteredByTab

  const handleCompareToggle = id => {
    setCompareList(prev =>
      prev.includes(id) ? prev.filter(x => x !== id)
      : prev.length >= 3 ? [...prev.slice(1), id]
      : [...prev, id]
    )
  }

  const accent = tabAccents[activeTab] || '#ec4899'

  return (
    <section id="productos" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section header */}
        <div ref={headerRef} className={`text-center mb-10 reveal ${headerVisible ? 'visible' : ''}`}>
          <h2 className="section-title">Nuestro <span>catálogo</span></h2>
          <p className="section-sub">Precios reales. Elegí tu sabor y pedí por WhatsApp.</p>
        </div>

        <NewProductBanner />

        <PromoHoyBanner state={promo} />

        {/* ── Catalog panel ── */}
        <div className="catalog-panel">

          {/* Panel header — tabs + search + toggle */}
          <div className="flex flex-col gap-3 px-4 sm:px-6 pt-5 pb-4 border-b border-white/8"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}>

            {/* Top row: title + collapse */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-black text-white text-sm hidden sm:block">Productos</span>
                <span className="text-white/30 text-xs hidden sm:block">
                  {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                {/* Search */}
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Marca, nombre o sabor..."
                    className="input-field pl-8 py-2 text-xs w-40 sm:w-56 md:w-72"
                  />
                  {search && (
                    <button onClick={() => setSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                      <X size={12} />
                    </button>
                  )}
                </div>
                {/* Collapse toggle */}
                <button onClick={() => setPanelOpen(v => !v)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white text-xs font-semibold transition-all hover:bg-white/10">
                  <SlidersHorizontal size={13} />
                  <span className="hidden sm:inline">{panelOpen ? 'Minimizar' : 'Expandir'}</span>
                  {panelOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
              {categories.map(c => {
                const Icon = tabIcons[c.id] || ShoppingBag
                const acc  = tabAccents[c.id] || '#ec4899'
                const active = activeTab === c.id
                return (
                  <button key={c.id}
                    onClick={() => setActiveTab(c.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-250 border shrink-0 ${
                      active ? 'text-white border-transparent' : 'bg-white/5 border-white/10 text-white/45 hover:text-white/75 hover:bg-white/8'
                    }`}
                    style={active ? { background: `${acc}22`, borderColor: `${acc}40`, color: acc } : {}}>
                    <Icon size={12} />
                    {c.label}
                    <span className={`text-[9px] rounded-full px-1.5 py-0.5 ${active ? 'bg-white/15' : 'bg-white/5 text-white/30'}`}>
                      {products.filter(p => c.id === 'all' || p.category === c.id).length}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Panel body */}
          {panelOpen && (
            <div className="p-4 sm:p-6">
              {/* Compare bar */}
              {compareList.length >= 2 && (
                <div className="flex items-center justify-between bg-primary-600/10 border border-primary-500/25 rounded-xl px-4 py-2.5 mb-5 animate-[fadeUpSm_0.25s_ease_both]">
                  <div className="flex items-center gap-2">
                    <Scale size={14} className="text-primary-400" />
                    <span className="text-white/70 text-xs font-medium">{compareList.length} seleccionados</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowCompare(true)}
                      className="px-3 py-1.5 rounded-lg bg-primary-600 text-white text-[11px] font-bold hover:bg-primary-700 transition-colors">
                      Comparar
                    </button>
                    <button onClick={() => setCompareList([])} className="text-white/35 hover:text-white transition-colors">
                      <X size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* Grid */}
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-white/25 gap-3">
                  <Search size={40} strokeWidth={1} />
                  <p className="font-semibold text-sm">Sin resultados para &ldquo;{search}&rdquo;</p>
                  <button onClick={() => setSearch('')} className="text-primary-400 text-xs hover:underline">
                    Limpiar búsqueda
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {filtered.map((p, i) => (
                    <ProductCard
                      key={p.id}
                      p={p}
                      compareList={compareList}
                      onCompareToggle={handleCompareToggle}
                      animDelay={Math.min(i, 12) * 45}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Collapsed state */}
          {!panelOpen && (
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-white/35 text-xs">
                {filtered.length} productos · pestaña <strong className="text-white/55">{categories.find(c => c.id === activeTab)?.label}</strong>
              </span>
              <button onClick={() => setPanelOpen(true)}
                className="text-primary-400 text-xs font-semibold hover:underline flex items-center gap-1">
                Ver catálogo <ChevronDown size={12} />
              </button>
            </div>
          )}
        </div>
      </div>

      {showCompare && <Comparator ids={compareList} onClose={() => setShowCompare(false)} />}
    </section>
  )
}
