import { Package, Star, Truck, ShieldCheck } from 'lucide-react'

const stats = [
  { icon: Package,     value: '+50',  label: 'Productos',       color: 'text-primary-400' },
  { icon: Star,        value: '5.0',  label: 'Rating Google',   color: 'text-amber-400' },
  { icon: Truck,       value: '24hs', label: 'Envío express',   color: 'text-cyan-400' },
  { icon: ShieldCheck, value: '100%', label: 'Productos orig.', color: 'text-emerald-400' },
]

export default function Stats() {
  return (
    <section className="py-14 bg-dark-800 border-y border-white/5">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-3 p-6">
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${s.color}`}>
                <s.icon size={22} />
              </div>
              <span className={`text-3xl font-black ${s.color}`}>{s.value}</span>
              <span className="text-white/40 text-sm font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
