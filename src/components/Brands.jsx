import { brands } from '../data/products'

export default function Brands() {
  return (
    <section id="marcas" className="py-24 bg-dark-800 border-y border-white/5">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-14">
          <h2 className="section-title">Marcas <span>premium</span></h2>
          <p className="section-sub">Trabajamos exclusivamente con las mejores marcas del mercado mundial</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands.map((b, i) => (
            <div key={i}
              className="card p-6 flex flex-col items-center text-center gap-3 group cursor-default">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${b.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-white font-black text-xs text-center leading-tight px-1">{b.name}</span>
              </div>
              <p className="text-white/40 text-[11px] leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
