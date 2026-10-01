import { useState } from 'react'
import { Plus, Wind } from 'lucide-react'
import { products, categories } from '../data/products'
import { useCart } from '../context/CartContext'

const badgeStyles = {
  hot:     'bg-rose-500 text-white',
  new:     'bg-primary-600 text-white',
  sale:    'bg-amber-400 text-black',
  limited: 'bg-cyan-500 text-black',
}

export default function Products() {
  const [activeFilter, setActiveFilter] = useState('all')
  const { addItem } = useCart()

  const filtered = activeFilter === 'all'
    ? products
    : products.filter(p => p.category === activeFilter)

  return (
    <section id="productos" className="py-24">
      <div className="max-w-6xl mx-auto px-5">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="section-title">Nuestro <span>catálogo</span></h2>
          <p className="section-sub">Encontrá tu vape ideal entre nuestros productos seleccionados</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map(c => (
            <button key={c.id} onClick={() => setActiveFilter(c.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${
                activeFilter === c.id
                  ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-dark-700 border-white/10 text-white/50 hover:border-primary-500/50 hover:text-white/80'
              }`}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p, i) => (
            <article key={p.id} className="card flex flex-col"
              style={{ animationDelay: `${i * 0.05}s` }}>

              {/* Image area */}
              <div className="relative bg-gradient-to-br from-dark-600 to-dark-700 p-8 flex items-center justify-center min-h-[180px]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-purple-600/5" />
                {p.badge && (
                  <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${badgeStyles[p.badge]}`}>
                    {p.badgeText}
                  </span>
                )}
                <span className="text-5xl relative z-10 filter drop-shadow-lg" style={{ filter: 'drop-shadow(0 4px 12px rgba(236,72,153,0.4))' }}>
                  {p.emoji}
                </span>
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col flex-1">
                <span className="text-primary-500 text-[10px] font-bold uppercase tracking-widest mb-1">{p.brand}</span>
                <h3 className="font-bold text-white text-sm mb-2 leading-snug">{p.name}</h3>
                <p className="text-white/40 text-xs leading-relaxed mb-3 flex-1">{p.desc}</p>

                {/* Flavors */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {p.flavors.map((f, i) => (
                    <span key={i} className="text-[10px] font-medium text-white/40 border border-white/10 px-2 py-0.5 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>

                {/* Puffs */}
                <div className="flex items-center gap-1.5 bg-primary-500/10 border border-primary-500/20 rounded-full px-3 py-1.5 mb-4 w-fit">
                  <Wind size={11} className="text-primary-400" />
                  <span className="text-primary-300 text-[11px] font-semibold">{p.puffs}</span>
                </div>

                {/* Price + Add */}
                <div className="flex items-center justify-between gap-3">
                  <div>
                    {p.oldPrice && (
                      <span className="text-white/30 text-[11px] line-through block leading-none mb-0.5">
                        Bs. {p.oldPrice}
                      </span>
                    )}
                    <span className="text-white font-black text-lg">Bs. {p.price}</span>
                  </div>
                  <button onClick={() => addItem(p)}
                    className="w-10 h-10 rounded-xl bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg shadow-primary-500/30 shrink-0"
                    aria-label={`Agregar ${p.name}`}>
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
