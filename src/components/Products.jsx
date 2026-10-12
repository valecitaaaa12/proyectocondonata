import { useState } from 'react'
import { Plus, Wind, ChevronDown, ChevronUp, Tag, Bell, Scale, X, Check, Heart } from 'lucide-react'
import { products, categories } from '../data/products'
import { useCart } from '../context/CartContext'
import { useAdmin } from '../context/AdminContext'
import { useAuth } from '../context/AuthContext'
import { useScrollReveal } from '../hooks/useScrollReveal'

const badgeStyles = {
  oferta:  'bg-amber-400 text-black',
  mega:    'bg-rose-500 text-white',
  nuevo:   'bg-primary-600 text-white',
  limited: 'bg-cyan-500 text-black',
}

const categoryGrad = {
  desechable: 'from-blue-900/40 to-dark-700',
  tipoC:      'from-purple-900/40 to-dark-700',
  lego:       'from-amber-900/30 to-dark-700',
  accesorio:  'from-emerald-900/30 to-dark-700',
}

// ── Notify-when-back storage ──────────────────────────────────────────────────
function getNotifyList() {
  try { return JSON.parse(localStorage.getItem('bbv_notify_list') || '[]') } catch { return [] }
}
function addToNotifyList(productId, phone) {
  const list = getNotifyList()
  if (!list.find(e => e.productId === productId && e.phone === phone)) {
    list.push({ productId, phone, date: new Date().toISOString() })
    localStorage.setItem('bbv_notify_list', JSON.stringify(list))
  }
}

// ── ProductCard ───────────────────────────────────────────────────────────────
function ProductCard({ p, compareList, onCompareToggle }) {
  const { addItem }          = useCart()
  const { getProductStock }  = useAdmin()
  const { currentUser, toggleFavorite, isFavorite, setAuthModal } = useAuth()
  const stockInfo            = getProductStock(p.id)
  const isOutOfStock         = stockInfo.disabled || stockInfo.stock === 0
  const isLowStock           = !isOutOfStock && stockInfo.stock !== null && stockInfo.stock <= 5 && stockInfo.stock > 0
  const favorited            = isFavorite(p.id)

  const [selectedFlavor, setSelectedFlavor] = useState(
    p.flavors.length > 0 ? p.flavors[0] : ''
  )
  const [showFlavors, setShowFlavors]   = useState(false)
  const [notifyOpen,  setNotifyOpen]    = useState(false)
  const [notifyPhone, setNotifyPhone]   = useState('')
  const [notifySent,  setNotifySent]    = useState(false)
  const hasFlavors = p.flavors.length > 1 || (p.flavors.length === 1 && !p.flavors[0].startsWith('Solo'))

  const isInCompare = compareList.includes(p.id)

  const handleAdd = () => {
    if (isOutOfStock) return
    addItem({ ...p, selectedFlavor })
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
    <article className={`card flex flex-col group relative ${isOutOfStock ? 'opacity-70' : ''}`}>
      {/* Compare toggle */}
      <button
        onClick={() => onCompareToggle(p.id)}
        className={`absolute top-2 left-2 z-10 w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 border text-[10px] font-black ${
          isInCompare
            ? 'bg-primary-600 border-primary-600 text-white'
            : 'bg-dark-700/80 border-white/10 text-white/30 hover:border-primary-500/40 hover:text-white/60'
        }`}
        title={isInCompare ? 'Quitar del comparador' : 'Comparar'}
      >
        <Scale size={11} />
      </button>

      {/* Image area */}
      <div className={`relative bg-gradient-to-br ${categoryGrad[p.category] || 'from-dark-600 to-dark-700'} flex items-center justify-center min-h-[190px] overflow-hidden`}>
        {/* Dot pattern only shown as fallback bg */}
        {!p.image && (
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(236,72,153,0.4) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        )}
        {p.badge && (
          <span className={`absolute top-3 left-3 z-10 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${badgeStyles[p.badge]}`}>
            {p.badgeText}
          </span>
        )}
        {/* Extra labels */}
        {isLowStock && (
          <span className="absolute top-3 left-3 z-10 text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-orange-500 text-white">Últimas unidades</span>
        )}
        {p.promoTag && (
          <span className="absolute top-3 right-10 z-10 bg-green-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
            <Tag size={8} />{p.promoTag}
          </span>
        )}
        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 border ${
            favorited
              ? 'bg-rose-500/30 border-rose-500/50 text-rose-400'
              : 'bg-dark-700/70 border-white/10 text-white/25 hover:border-rose-400/40 hover:text-rose-400'
          }`}
          title={favorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart size={12} className={favorited ? 'fill-rose-400' : ''} />
        </button>
        {isOutOfStock && (
          <span className="absolute inset-0 z-10 flex items-center justify-center bg-dark-900/60">
            <span className="bg-rose-500/90 text-white text-xs font-black px-3 py-1.5 rounded-full">AGOTADO</span>
          </span>
        )}
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-[190px] object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex' }}
          />
        ) : null}
        {/* Emoji fallback — shown when no image or image fails */}
        <span
          className={`text-5xl relative z-10 group-hover:scale-110 transition-transform duration-300 ${p.image ? 'hidden' : 'flex'} items-center justify-center`}
          style={{ filter: 'drop-shadow(0 4px 16px rgba(236,72,153,0.4))' }}>
          {p.emoji}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div>
          <span className="text-primary-500 text-[10px] font-black uppercase tracking-widest">{p.brand}</span>
          <h3 className="font-bold text-white text-sm leading-snug mt-0.5">{p.name}</h3>
          <p className="text-white/40 text-[11px] mt-1 leading-relaxed">{p.desc}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          <span className="flex items-center gap-1 bg-primary-500/10 border border-primary-500/20 text-primary-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            <Wind size={9} />{p.puffs}
          </span>
          {p.nicotina !== '—' && (
            <span className="bg-white/5 border border-white/10 text-white/40 text-[10px] px-2 py-0.5 rounded-full">
              {p.nicotina}
            </span>
          )}
          <span className="bg-white/5 border border-white/10 text-white/30 text-[10px] px-2 py-0.5 rounded-full truncate max-w-[120px]">
            {p.tipo}
          </span>
        </div>

        {/* Flavor selector */}
        {hasFlavors && (
          <div className="relative">
            <button
              onClick={() => setShowFlavors(v => !v)}
              className="w-full flex items-center justify-between bg-white/5 border border-white/10 hover:border-primary-500/40 rounded-xl px-3 py-2 text-left transition-colors duration-200"
            >
              <span className="text-[11px] text-white/70 font-medium truncate">{selectedFlavor}</span>
              {showFlavors ? <ChevronUp size={13} className="text-white/40 shrink-0" /> : <ChevronDown size={13} className="text-white/40 shrink-0" />}
            </button>
            {showFlavors && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-dark-800 border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/50 max-h-44 overflow-y-auto">
                {p.flavors.map((f, i) => (
                  <button key={i}
                    onClick={() => { setSelectedFlavor(f); setShowFlavors(false) }}
                    className={`w-full text-left px-3 py-2 text-[11px] font-medium transition-colors ${
                      selectedFlavor === f ? 'bg-primary-600/30 text-primary-300' : 'text-white/60 hover:bg-white/5 hover:text-white'
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
          <div>
            {p.price ? (
              <span className="text-white font-black text-xl">Bs. {p.price}</span>
            ) : (
              <span className="text-amber-400 font-bold text-sm">Consultar</span>
            )}
          </div>

          {isOutOfStock ? (
            <button
              onClick={() => setNotifyOpen(v => !v)}
              className="flex items-center gap-1.5 px-3 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40 hover:text-amber-300 text-white/40 text-[11px] font-bold transition-all duration-300"
            >
              <Bell size={13} />
              Avísame
            </button>
          ) : (
            <button
              onClick={handleAdd}
              disabled={!p.price}
              className="w-10 h-10 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:bg-white/10 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg shadow-primary-500/30 shrink-0"
              aria-label={`Agregar ${p.name}`}>
              <Plus size={18} />
            </button>
          )}
        </div>

        {/* Notify form */}
        {notifyOpen && isOutOfStock && (
          <div className="bg-dark-800 border border-amber-400/20 rounded-xl p-3 flex flex-col gap-2">
            {notifySent ? (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <Check size={14} />
                ¡Listo! Te avisamos cuando llegue.
              </div>
            ) : (
              <>
                <p className="text-white/50 text-[11px]">Te avisamos por WhatsApp cuando llegue:</p>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={notifyPhone}
                    onChange={e => setNotifyPhone(e.target.value)}
                    placeholder="Tu WhatsApp"
                    className="input-field text-xs py-2 flex-1"
                  />
                  <button onClick={handleNotify}
                    className="px-2 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] font-bold hover:bg-amber-500/40 transition-all">
                    OK
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

// ── Comparator modal ──────────────────────────────────────────────────────────
function Comparator({ ids, onClose }) {
  if (ids.length < 2) return null
  const items = ids.map(id => products.find(p => p.id === id)).filter(Boolean)

  const rows = [
    { label: 'Precio',    key: p => p.price ? `Bs. ${p.price}` : 'Consultar' },
    { label: 'Puffs',     key: p => p.puffs },
    { label: 'Nicotina',  key: p => p.nicotina },
    { label: 'Tipo',      key: p => p.tipo },
    { label: 'Sabores',   key: p => `${p.flavors.length} disponibles` },
  ]

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]" />
      <div className="fixed inset-0 z-[201] flex items-center justify-center px-4 pointer-events-none">
        <div className="bg-dark-800 border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl shadow-black/60 pointer-events-auto animate-fade-up overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Scale size={18} className="text-primary-400" />
              <h3 className="font-black text-white text-lg">Comparador</h3>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-dark-700 flex items-center justify-center text-white/50 hover:text-white transition-colors">
              <X size={15} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-3 text-white/40 text-xs font-medium w-28">Característica</th>
                  {items.map(p => (
                    <th key={p.id} className="px-4 py-3 text-center">
                      <div className="text-2xl mb-1">{p.emoji}</div>
                      <div className="text-primary-400 text-[10px] font-black uppercase">{p.brand}</div>
                      <div className="text-white font-bold text-xs leading-tight">{p.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                    <td className="px-6 py-3 text-white/40 text-xs font-medium">{row.label}</td>
                    {items.map(p => {
                      const val = row.key(p)
                      const isPrice = row.label === 'Precio'
                      const prices = items.map(x => x.price || 9999)
                      const minPrice = Math.min(...prices)
                      const isBest = isPrice && p.price === minPrice
                      return (
                        <td key={p.id} className="px-4 py-3 text-center">
                          <span className={`text-sm font-semibold ${isBest ? 'text-emerald-400' : 'text-white/70'}`}>
                            {val}
                            {isBest && <span className="ml-1 text-[10px] text-emerald-400">✓mejor</span>}
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

// ── Category section ──────────────────────────────────────────────────────────
function CategorySection({ categoryId, label, icon, items, compareList, onCompareToggle }) {
  const [collapsed, setCollapsed] = useState(false)
  const [ref, visible] = useScrollReveal()
  if (items.length === 0) return null

  return (
    <div ref={ref} className={`mb-16 reveal ${visible ? 'visible' : ''}`}>
      <button
        onClick={() => setCollapsed(v => !v)}
        className="w-full flex items-center justify-between mb-8 group"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div className="text-left">
            <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-primary-400 transition-colors">{label}</h3>
            <p className="text-white/40 text-xs font-medium">{items.length} productos</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-dark-700 border border-white/10 rounded-xl px-3 py-2 text-white/40 group-hover:border-primary-500/40 transition-colors">
          <span className="text-xs font-medium hidden sm:block">{collapsed ? 'Mostrar' : 'Ocultar'}</span>
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </div>
      </button>

      {!collapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map(p => (
            <ProductCard key={p.id} p={p} compareList={compareList} onCompareToggle={onCompareToggle} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Products section ─────────────────────────────────────────────────────
export default function Products() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [search,       setSearch]       = useState('')
  const [compareList,  setCompareList]  = useState([]) // up to 3 ids
  const [showCompare,  setShowCompare]  = useState(false)
  const [headerRef, headerVisible] = useScrollReveal()

  const filteredByCategory = activeFilter === 'all'
    ? products
    : products.filter(p => p.category === activeFilter)

  const filtered = search.trim()
    ? filteredByCategory.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.flavors.some(f => f.toLowerCase().includes(search.toLowerCase()))
      )
    : filteredByCategory

  const grouped = categories
    .filter(c => c.id !== 'all')
    .map(c => ({
      ...c,
      items: filtered.filter(p => p.category === c.id),
    }))

  const handleCompareToggle = (id) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 3) return [...prev.slice(1), id]
      return [...prev, id]
    })
  }

  return (
    <section id="productos" className="py-24">
      <div className="max-w-6xl mx-auto px-5">

        {/* Header */}
        <div ref={headerRef} className={`text-center mb-14 reveal ${headerVisible ? 'visible' : ''}`}>
          <h2 className="section-title">Nuestro <span>catálogo</span></h2>
          <p className="section-sub">Todos los productos con precios reales. Seleccioná tu sabor y pedí por WhatsApp.</p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por marca, nombre o sabor..."
            className="input-field flex-1"
          />
          <div className="flex gap-2 flex-wrap">
            {categories.map(c => (
              <button key={c.id} onClick={() => setActiveFilter(c.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all duration-300 whitespace-nowrap ${
                  activeFilter === c.id
                    ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/30'
                    : 'bg-dark-700 border-white/10 text-white/50 hover:border-primary-500/40 hover:text-white/80'
                }`}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Compare bar */}
        {compareList.length >= 2 && (
          <div className="flex items-center justify-between bg-primary-600/10 border border-primary-500/30 rounded-2xl px-4 py-3 mb-6 animate-[fadeIn_0.3s_ease]">
            <div className="flex items-center gap-2">
              <Scale size={15} className="text-primary-400" />
              <span className="text-white/70 text-sm font-medium">
                {compareList.length} productos seleccionados para comparar
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowCompare(true)}
                className="px-4 py-1.5 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 transition-colors">
                Comparar ahora
              </button>
              <button onClick={() => setCompareList([])}
                className="px-3 py-1.5 rounded-xl bg-white/5 text-white/40 text-xs hover:text-white transition-colors">
                <X size={13} />
              </button>
            </div>
          </div>
        )}

        {/* Results count */}
        {search && (
          <p className="text-white/40 text-sm mb-8">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para &ldquo;{search}&rdquo;
          </p>
        )}

        {/* Grid / Sections */}
        {(activeFilter !== 'all' || search) ? (
          filtered.length === 0 ? (
            <div className="text-center py-20 text-white/30">
              <p className="text-4xl mb-4">🔍</p>
              <p className="font-medium">No se encontraron productos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(p => (
                <ProductCard key={p.id} p={p} compareList={compareList} onCompareToggle={handleCompareToggle} />
              ))}
            </div>
          )
        ) : (
          grouped.map(g => (
            <CategorySection
              key={g.id}
              categoryId={g.id}
              label={g.label}
              icon={g.icon}
              items={g.items}
              compareList={compareList}
              onCompareToggle={handleCompareToggle}
            />
          ))
        )}
      </div>

      {showCompare && <Comparator ids={compareList} onClose={() => setShowCompare(false)} />}
    </section>
  )
}
