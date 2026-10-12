import { useState } from 'react'
import { Plus, Wind, ChevronDown, ChevronUp, Tag } from 'lucide-react'
import { products, categories } from '../data/products'
import { useCart } from '../context/CartContext'

const badgeStyles = {
  oferta:  'bg-amber-400 text-black',
  mega:    'bg-rose-500 text-white',
  nuevo:   'bg-primary-600 text-white',
  limited: 'bg-cyan-500 text-black',
}

// Mapa de color de fondo por categoría
const categoryGrad = {
  desechable: 'from-blue-900/40 to-dark-700',
  tipoC:      'from-purple-900/40 to-dark-700',
  lego:       'from-amber-900/30 to-dark-700',
  accesorio:  'from-emerald-900/30 to-dark-700',
}

function ProductCard({ p }) {
  const { addItem } = useCart()
  const [selectedFlavor, setSelectedFlavor] = useState(
    p.flavors.length > 0 ? p.flavors[0] : ''
  )
  const [showFlavors, setShowFlavors] = useState(false)
  const hasFlavors = p.flavors.length > 1 || (p.flavors.length === 1 && !p.flavors[0].startsWith('Solo'))

  const handleAdd = () => {
    addItem({ ...p, selectedFlavor })
  }

  return (
    <article className="card flex flex-col group">
      {/* Image area */}
      <div className={`relative bg-gradient-to-br ${categoryGrad[p.category] || 'from-dark-600 to-dark-700'} px-6 py-8 flex items-center justify-center min-h-[160px]`}>
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(236,72,153,0.4) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        {p.badge && (
          <span className={`absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${badgeStyles[p.badge]}`}>
            {p.badgeText}
          </span>
        )}
        {p.promoTag && (
          <span className="absolute top-3 right-3 bg-green-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
            <Tag size={8} />{p.promoTag}
          </span>
        )}
        <span className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-300"
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
              {showFlavors
                ? <ChevronUp size={13} className="text-white/40 shrink-0" />
                : <ChevronDown size={13} className="text-white/40 shrink-0" />}
            </button>
            {showFlavors && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-dark-800 border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/50 max-h-44 overflow-y-auto">
                {p.flavors.map((f, i) => (
                  <button key={i}
                    onClick={() => { setSelectedFlavor(f); setShowFlavors(false) }}
                    className={`w-full text-left px-3 py-2 text-[11px] font-medium transition-colors ${
                      selectedFlavor === f
                        ? 'bg-primary-600/30 text-primary-300'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
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
          <button
            onClick={handleAdd}
            disabled={!p.price}
            className="w-10 h-10 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:bg-white/10 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg shadow-primary-500/30 shrink-0"
            aria-label={`Agregar ${p.name}`}>
            <Plus size={18} />
          </button>
        </div>
      </div>
    </article>
  )
}

// Sección con título y grid de productos
function CategorySection({ categoryId, label, icon, items }) {
  const [collapsed, setCollapsed] = useState(false)
  if (items.length === 0) return null

  return (
    <div className="mb-16">
      {/* Section header */}
      <button
        onClick={() => setCollapsed(v => !v)}
        className="w-full flex items-center justify-between mb-8 group"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div className="text-left">
            <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-primary-400 transition-colors">
              {label}
            </h3>
            <p className="text-white/40 text-xs font-medium">{items.length} productos</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-dark-700 border border-white/10 rounded-xl px-3 py-2 text-white/40 group-hover:border-primary-500/40 transition-colors">
          <span className="text-xs font-medium hidden sm:block">{collapsed ? 'Mostrar' : 'Ocultar'}</span>
          {collapsed
            ? <ChevronDown size={16} />
            : <ChevronUp size={16} />}
        </div>
      </button>

      {!collapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  )
}

export default function Products() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch] = useState('')

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

  // Agrupar por categoría para mostrar secciones
  const grouped = categories
    .filter(c => c.id !== 'all')
    .map(c => ({
      ...c,
      items: filtered.filter(p => p.category === c.id),
    }))

  return (
    <section id="productos" className="py-24">
      <div className="max-w-6xl mx-auto px-5">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="section-title">Nuestro <span>catálogo</span></h2>
          <p className="section-sub">Todos los productos con precios reales. Seleccioná tu sabor y pedí por WhatsApp.</p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar producto, marca o sabor..."
            className="input-field flex-1"
          />
          {/* Category pills */}
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

        {/* Results count */}
        {search && (
          <p className="text-white/40 text-sm mb-8">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para &ldquo;{search}&rdquo;
          </p>
        )}

        {/* Si hay filtro activo o búsqueda → grid plano */}
        {(activeFilter !== 'all' || search) ? (
          filtered.length === 0 ? (
            <div className="text-center py-20 text-white/30">
              <p className="text-4xl mb-4">🔍</p>
              <p className="font-medium">No se encontraron productos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(p => <ProductCard key={p.id} p={p} />)}
            </div>
          )
        ) : (
          /* Vista por secciones */
          grouped.map(g => (
            <CategorySection
              key={g.id}
              categoryId={g.id}
              label={g.label}
              icon={g.icon}
              items={g.items}
            />
          ))
        )}
      </div>
    </section>
  )
}
