import { Zap, MessageCircle } from 'lucide-react'

export default function PromoBanner() {
  return (
    <section id="ofertas" className="py-24 relative overflow-hidden">
      {/* BG – celeste/azul inspirado en la promo Gippro */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-900/60 via-blue-900/40 to-dark-800" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(14,165,233,0.4) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative max-w-6xl mx-auto px-5">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* ── Texto ── */}
          <div>
            {/* Badge "Abierto por Error" */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="inline-flex items-center gap-2 bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
                <Zap size={11} className="fill-amber-400 text-amber-400" />
                Oferta especial
              </div>
              <div className="inline-flex items-center gap-1.5 bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
                🔓 Abierto por Error
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-2">
              Gippro 600
            </h2>
            <p className="text-sky-400 font-black text-xl md:text-2xl mb-5 uppercase tracking-wide">
              Desechable · 600 puffs · 2%
            </p>

            {/* Características */}
            <ul className="space-y-2 text-white/60 text-sm mb-6">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                Desechable compacto tipo lápiz
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                2% de Nicotina · Modo suave (Eco)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                <strong className="text-white">Todos los sabores disponibles</strong>
              </li>
            </ul>

            {/* Precio promo */}
            <div className="flex flex-wrap items-end gap-6 mb-8">
              <div>
                <p className="text-white/30 text-sm mb-0.5">Precio regular</p>
                <p className="text-white/30 text-lg line-through font-bold">Bs. 40 c/u</p>
              </div>
              <div className="bg-white text-dark-900 rounded-2xl px-6 py-3 shadow-2xl shadow-sky-500/20">
                <p className="text-xs font-black text-gray-600 uppercase tracking-wider mb-0.5">Promo</p>
                <p className="text-3xl font-black text-dark-900 leading-none">1 × 20 Bs</p>
              </div>
            </div>

            <a
              href="https://wa.me/59178580928?text=Hola%20Bad%20Bunny%20Vape!%20Quiero%20la%20promo%20Gippro%20600%20%E2%80%93%201x20%20Bs%20%F0%9F%94%A5"
              target="_blank" rel="noreferrer"
              className="btn-primary text-base px-8 py-4 rounded-2xl"
            >
              <MessageCircle size={18} />
              Quiero la promo
            </a>
          </div>

          {/* ── Visual ── */}
          <div className="flex justify-center items-center">
            <div className="relative">

              {/* Círculo animado de fondo */}
              <div className="animate-float w-72 h-72 rounded-full border-2 border-sky-400/20 bg-gradient-to-br from-sky-500/10 to-cyan-500/5 flex flex-col items-center justify-center gap-4 relative">

                {/* Precio grande encima */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white text-dark-900 font-black text-xl px-6 py-2 rounded-full shadow-2xl whitespace-nowrap">
                  AHORA 1x20 Bs
                </div>

                {/* Emojis de vapers */}
                <div className="flex gap-3 text-5xl">
                  🖊️🖊️
                </div>

                {/* Flavors */}
                <div className="flex flex-wrap justify-center gap-2 px-6">
                  {['Cool Mint', 'Cherry Watermelon', 'Grape', 'Passion Fruit'].map(f => (
                    <span key={f}
                      className="bg-sky-500/20 border border-sky-400/30 text-sky-300 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      {f}
                    </span>
                  ))}
                  <span className="bg-sky-500/20 border border-sky-400/30 text-sky-300 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    +más
                  </span>
                </div>

                {/* Puffs badge */}
                <div className="bg-dark-700 border border-sky-400/30 rounded-full px-4 py-1.5 text-sky-300 text-xs font-black">
                  600 puffs · todos los sabores
                </div>

                {/* Mascota corazón */}
                <div className="absolute -bottom-4 -right-4 text-4xl animate-pulse-slow">❤️‍🩹</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
