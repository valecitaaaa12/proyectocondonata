import { useScrollReveal } from '../hooks/useScrollReveal'
import { Sparkles, RefreshCw } from 'lucide-react'

// ── Seed based on 3-day cycle ─────────────────────────────────────────────────
function threeDaySeed() {
  const epoch = new Date('2024-01-01').getTime()
  const cycleMs = 3 * 24 * 60 * 60 * 1000
  return Math.floor((Date.now() - epoch) / cycleMs)
}

function seededShuffle(arr, seed) {
  const a = [...arr]
  let s = seed * 1664525 + 1013904223
  const rnd = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 4294967296 }
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const allFlavors = [
  { name: 'Cherry Watermelon Mint',    desc: 'Cereza fresca, sandía dulce y un toque de menta que refresca al final. Ideal para días calurosos.',                       color: '#f43f5e', icon: '🍒' },
  { name: 'Blueberry Raspberry Lemon', desc: 'Combinación frutal intensa. Arándano cremoso, frambuesa ácida y limón chispeante.',                                          color: '#818cf8', icon: '🫐' },
  { name: 'Peach Mango Watermelon',    desc: 'Durazno jugoso, mango tropical y sandía helada. Uno de los más pedidos de temporada.',                                        color: '#fb923c', icon: '🍑' },
  { name: 'Watermelon Ice',            desc: 'Sandía clásica con final helado intenso. Simple, directo y muy refrescante.',                                                 color: '#4ade80', icon: '🍉' },
  { name: 'Grape Ice',                 desc: 'Uva oscura dulce con un frío de hielo que limpia el paladar. Favorito de los que prefieren sabores profundos.',               color: '#a855f7', icon: '🍇' },
  { name: 'Strawberry Kiwi',           desc: 'Frutilla madura y kiwi tropical. Equilibrado, ni demasiado dulce ni demasiado ácido.',                                       color: '#ec4899', icon: '🍓' },
  { name: 'Lemon Mint',                desc: 'Limón cítrico fresco con menta suave. El más limpio del catálogo, excelente para principiantes.',                             color: '#facc15', icon: '🍋' },
  { name: 'Cool Mint',                 desc: 'Menta pura e intensa. La elección clásica para quienes buscan frescura sin complicaciones.',                                  color: '#34d399', icon: '🌿' },
  { name: 'Sour Apple Ice',            desc: 'Manzana ácida verde con escarcha de hielo. Ideal para quienes gustan de sabores atrevidos.',                                  color: '#86efac', icon: '🍏' },
  { name: 'Coconut Strawberry',        desc: 'Coco cremoso con frutilla. Dulce y tropical, una de las combinaciones más únicas del catálogo.',                              color: '#f0abfc', icon: '🥥' },
  { name: 'Blue Razz',                 desc: 'Frambuesa azul ultra dulce con toque helado. Muy popular entre quienes buscan sabores intensos.',                             color: '#60a5fa', icon: '🫐' },
  { name: 'Watermelon Strawberry',     desc: 'Doble fruta de verano. Sandía suave y frutilla brillante en cada puff.',                                                      color: '#fb7185', icon: '🍓' },
  { name: 'Icy Mint',                  desc: 'Menta glaciar intensa. Frío extremo desde el primer puff, ideal para los que buscan una experiencia limpia y poderosa.',      color: '#67e8f9', icon: '❄️' },
  { name: 'Dark Cherry',               desc: 'Cereza oscura madura, ligeramente ácida. Sabor profundo y elegante, perfecto para las noches.',                               color: '#e11d48', icon: '🍒' },
  { name: 'Açaí Banana',               desc: 'Açaí tropical con banana suave. Una combinación cremosa y exótica que sorprende en cada puff.',                               color: '#c084fc', icon: '🍌' },
  { name: 'Minty Thrill',              desc: 'Menta con un giro picante al final. Una experiencia distinta para los que buscan algo más que frescura.',                     color: '#2dd4bf', icon: '🌿' },
  { name: 'Kiwi Dragon Berry',         desc: 'Kiwi verde, pitahaya rosa y una base frutal intensa. Uno de los más llamativos en sabor y color.',                            color: '#a3e635', icon: '🥝' },
  { name: 'Miami Mint',                desc: 'Cítrico fresco con menta tropical. Inspirado en el verano, refrescante y ligero desde el inicio.',                            color: '#38bdf8', icon: '🍊' },
]

export default function WeeklyFlavors() {
  const [ref, visible] = useScrollReveal()
  const seed    = threeDaySeed()
  const flavors = seededShuffle(allFlavors, seed).slice(0, 4)

  // Days until next rotation
  const epoch   = new Date('2024-01-01').getTime()
  const cycleMs = 3 * 24 * 60 * 60 * 1000
  const nextMs  = (seed + 1) * cycleMs + epoch
  const daysLeft = Math.ceil((nextMs - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <section id="sabores" className="py-20 bg-dark-800 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>

          <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-600/20 flex items-center justify-center shrink-0">
                <Sparkles size={18} className="text-primary-400" />
              </div>
              <div>
                <h2 className="font-black text-white text-2xl leading-tight">
                  Sabores destacados
                </h2>
                <p className="text-white/40 text-xs mt-0.5">Descripciones reales del catálogo</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white/35 text-[11px] font-medium">
              <RefreshCw size={11} />
              Rota en {daysLeft} día{daysLeft !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {flavors.map((f, i) => (
              <div
                key={`${seed}-${i}`}
                className="bg-dark-700 rounded-2xl p-5 hover:-translate-y-1.5 transition-all duration-300 group cursor-default"
                style={{
                  border: `1px solid ${f.color}22`,
                  animationDelay: `${i * 70}ms`,
                  boxShadow: 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 12px 32px ${f.color}18`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                {/* Color bar top */}
                <div className="h-0.5 rounded-full mb-4 w-12 opacity-60"
                  style={{ background: `linear-gradient(90deg, ${f.color}, transparent)` }} />

                <h3 className="font-bold text-white text-sm leading-snug mb-2 group-hover:text-primary-300 transition-colors">
                  {f.name}
                </h3>
                <p className="text-white/45 text-xs leading-relaxed">{f.desc}</p>

                <div className="mt-4 pt-3 border-t flex items-center gap-1.5"
                  style={{ borderColor: `${f.color}18` }}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse-slow"
                    style={{ background: f.color }} />
                  <span className="text-[10px] font-semibold" style={{ color: f.color }}>
                    Disponible ahora
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
