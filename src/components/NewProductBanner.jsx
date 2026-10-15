import { useState, useEffect } from 'react'
import { Sparkles, ChevronLeft, ChevronRight, X, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'

// ── All "nuevoproducto" images + the general one ───────────────────────────────
const NEW_PRODUCT_IMAGES = [
  '/products/waka25000slim.webp',
  '/products/lifepod40000life80knuevoproducto.webp',
  '/products/lifepodmontablekitnuevoproducto.webp',
  '/products/wakanuevoproductogeneral.webp',
]

// Matching product data for each banner image
const NEW_PRODUCT_DATA = [
  {
    id: 46,
    name: 'Waka Ka25 Slim 25k',
    brand: 'Waka',
    puffs: '25.000 puffs',
    price: 230,
    flavors: ['Icy Mint', 'Grape Ice', 'Boobaloo Grape'],
    tag: 'Cuerpo de aluminio · USB-C · Pantalla dinámica',
  },
  {
    id: 47,
    name: 'Life Pod 80k',
    brand: 'Life Pod',
    puffs: '80.000 puffs',
    price: 520,
    flavors: ['Strawberry Bubblegum', 'Watermelon Ice', 'Grape Ice'],
    tag: 'Máxima duración del catálogo',
  },
  {
    id: 48,
    name: 'Life Pod Kit Nuevo',
    brand: 'Life Pod',
    puffs: 'Kit completo',
    price: null,
    flavors: ['Consultar'],
    tag: 'Nuevo kit montable · Lego',
  },
  {
    id: null,
    name: 'Nuevos productos',
    brand: 'Bad Bunny Vape',
    puffs: '',
    price: null,
    flavors: [],
    tag: 'Siempre actualizados para vos',
  },
]

// ── Seeded rotation: changes every 7 days ────────────────────────────────────
function getWeekSeed() {
  const epoch  = new Date('2024-01-01').getTime()
  const weekMs = 7 * 24 * 60 * 60 * 1000
  return Math.floor((Date.now() - epoch) / weekMs)
}

function getRotatedIndex(seed, total) {
  return seed % total
}

export default function NewProductBanner() {
  const { addItem } = useCart()
  const [idx,      setIdx]      = useState(() => getRotatedIndex(getWeekSeed(), NEW_PRODUCT_IMAGES.length))
  const [visible,  setVisible]  = useState(true)
  const [imgError, setImgError] = useState({})

  // Auto-advance every 5 seconds
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % NEW_PRODUCT_IMAGES.length), 5000)
    return () => clearInterval(t)
  }, [])

  if (!visible) return null

  const img  = NEW_PRODUCT_IMAGES[idx]
  const data = NEW_PRODUCT_DATA[idx]
  const hasErr = imgError[idx]

  const handleAdd = () => {
    if (!data.id || !data.price) return
    addItem({
      id: data.id,
      name: data.name,
      brand: data.brand,
      price: data.price,
      puffs: data.puffs,
      nicotina: '5%',
      tipo: data.tag,
      desc: data.tag,
      flavors: data.flavors,
      selectedFlavor: data.flavors[0],
      image: img,
      badge: 'nuevo',
      badgeText: 'NUEVO',
      category: 'tipoC',
    })
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary-500/25 bg-gradient-to-br from-dark-800 via-dark-700 to-dark-800"
      style={{ boxShadow: '0 0 40px rgba(219,39,119,0.10)' }}>

      {/* Dismiss */}
      <button onClick={() => setVisible(false)}
        className="absolute top-3 right-3 z-10 w-7 h-7 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/40 hover:text-white transition-colors">
        <X size={13} />
      </button>

      <div className="flex flex-col sm:flex-row items-stretch min-h-[200px]">

        {/* Image panel */}
        <div className="sm:w-1/2 relative overflow-hidden rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none bg-dark-700 flex items-center justify-center min-h-[180px]">
          {!hasErr ? (
            <img
              src={img}
              alt={data.name}
              className="w-full h-full object-cover object-center"
              style={{ maxHeight: 240 }}
              onError={() => setImgError(e => ({ ...e, [idx]: true }))}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-white/20 p-8">
              <Sparkles size={32} />
              <span className="text-sm font-bold">{data.name}</span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-dark-800/30 pointer-events-none sm:block hidden" />

          {/* Nav arrows */}
          <button onClick={() => setIdx(i => (i - 1 + NEW_PRODUCT_IMAGES.length) % NEW_PRODUCT_IMAGES.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-xl bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <ChevronLeft size={14} />
          </button>
          <button onClick={() => setIdx(i => (i + 1) % NEW_PRODUCT_IMAGES.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-xl bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Info panel */}
        <div className="flex-1 p-5 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary-600/20 border border-primary-500/30 text-primary-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={9} />Nuevo producto
              </span>
              <span className="text-white/25 text-[10px]">{data.brand}</span>
            </div>

            <h3 className="font-black text-white text-xl leading-tight mb-1">{data.name}</h3>

            <p className="text-white/45 text-xs mb-3">{data.tag}</p>

            {data.puffs && (
              <div className="flex items-center gap-3 flex-wrap mb-3">
                <span className="text-primary-300 text-xs font-semibold bg-primary-500/10 border border-primary-500/20 px-2.5 py-1 rounded-full">
                  {data.puffs}
                </span>
                {data.flavors.slice(0, 3).map(f => (
                  <span key={f} className="text-white/35 text-[11px]">{f}</span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              {data.price ? (
                <span className="text-white font-black text-2xl">Bs. {data.price}</span>
              ) : (
                <span className="text-amber-400 font-bold text-sm">Consultar precio</span>
              )}
            </div>
            {data.id && data.price && (
              <button onClick={handleAdd}
                className="btn-primary px-4 py-2 text-sm rounded-xl flex items-center gap-2">
                <ShoppingCart size={14} />
                Agregar
              </button>
            )}
          </div>

          {/* Dots */}
          <div className="flex gap-1.5">
            {NEW_PRODUCT_IMAGES.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'w-5 bg-primary-500' : 'w-1.5 bg-white/15'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
