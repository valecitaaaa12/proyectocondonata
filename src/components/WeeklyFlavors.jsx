import { useScrollReveal } from '../hooks/useScrollReveal'
import { Sparkles } from 'lucide-react'

// Rotates weekly using the week number as seed
function weekNumber() {
  const d = new Date()
  const onejan = new Date(d.getFullYear(), 0, 1)
  return Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7)
}

const allFlavors = [
  { name: 'Cherry Watermelon Mint', emoji: '🍒', desc: 'Cereza fresca, sandía dulce y un toque de menta que refresca al final. Ideal para días calurosos.', color: '#f43f5e' },
  { name: 'Blueberry Raspberry Lemon', emoji: '🫐', desc: 'Combinación frutal intensa. Arándano cremoso, frambuesa ácida y limón chispeante.', color: '#818cf8' },
  { name: 'Peach Mango Watermelon', emoji: '🍑', desc: 'Durazno jugoso, mango tropical y sandía helada. Uno de los más pedidos de temporada.', color: '#fb923c' },
  { name: 'Watermelon Ice', emoji: '🍉', desc: 'Sandía clásica con final helado intenso. Simple, directo y muy refrescante.', color: '#4ade80' },
  { name: 'Grape Ice', emoji: '🍇', desc: 'Uva oscura dulce con un frío de hielo que limpia el paladar. Favorito de los que prefieren sabores profundos.', color: '#a855f7' },
  { name: 'Strawberry Kiwi', emoji: '🍓', desc: 'Frutilla madura y kiwi tropical. Equilibrado, ni demasiado dulce ni demasiado ácido.', color: '#ec4899' },
  { name: 'Lemon Mint', emoji: '🍋', desc: 'Limón cítrico fresco con menta suave. El más limpio del catálogo, excelente para principiantes.', color: '#facc15' },
  { name: 'Cool Mint', emoji: '🌿', desc: 'Menta pura e intensa. La elección clásica para quienes buscan frescura sin complicaciones.', color: '#34d399' },
  { name: 'Sour Apple Ice', emoji: '🍏', desc: 'Manzana ácida verde con escarcha de hielo. Ideal para quienes gustan de sabores atrevidos.', color: '#86efac' },
  { name: 'Coconut Strawberry', emoji: '🥥', desc: 'Coco cremoso con frutilla. Dulce y tropical, una de las combinaciones más únicas del catálogo.', color: '#f0abfc' },
  { name: 'Blue Razz', emoji: '💙', desc: 'Frambuesa azul ultra dulce con toque helado. Muy popular entre quienes buscan sabores intensos.', color: '#60a5fa' },
  { name: 'Watermelon Strawberry', emoji: '🍓', desc: 'Doble fruta de verano. Sandía suave y frutilla brillante en cada puff.', color: '#fb7185' },
]

function pickWeeklyFlavors() {
  const wn = weekNumber()
  const seed = wn * 31 + 7
  let s = seed
  const rnd = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
  return [...allFlavors].sort(() => rnd() - 0.5).slice(0, 4)
}

export default function WeeklyFlavors() {
  const [ref, visible] = useScrollReveal()
  const flavors = pickWeeklyFlavors()

  return (
    <section id="sabores" className="py-20 bg-dark-800 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-primary-600/20 flex items-center justify-center">
              <Sparkles size={18} className="text-primary-400" />
            </div>
            <div>
              <h2 className="font-black text-white text-2xl">Sabores de la <span className="text-primary-400">semana</span></h2>
              <p className="text-white/40 text-xs mt-0.5">Descripciones reales · Se actualiza cada lunes</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {flavors.map((f, i) => (
              <div key={i}
                className="bg-dark-700 border border-white/8 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
                style={{ borderColor: `${f.color}20`, animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: `${f.color}18`, border: `1px solid ${f.color}28` }}>
                    {f.emoji}
                  </div>
                  <h3 className="font-bold text-white text-sm leading-snug group-hover:text-primary-300 transition-colors">
                    {f.name}
                  </h3>
                </div>
                <p className="text-white/45 text-xs leading-relaxed">{f.desc}</p>
                <div className="mt-3 pt-3 border-t flex items-center gap-1.5" style={{ borderColor: `${f.color}15` }}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: f.color }} />
                  <span className="text-[10px] font-semibold" style={{ color: f.color }}>Disponible esta semana</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
