import { Zap } from 'lucide-react'

export default function PromoBanner() {
  return (
    <section id="ofertas" className="py-24 relative overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-700 via-primary-900/40 to-dark-800" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
              <Zap size={12} className="fill-amber-400 text-amber-400" />
              Oferta especial
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-5">
              Pack x3<br />
              <span className="text-amber-400">Lost Mary</span><br />
              MO10000
            </h2>
            <p className="text-white/50 leading-relaxed mb-8 max-w-md">
              Llevate 3 unidades a elección de sabores y ahorrá 30% en tu compra.
              Consultanos por WhatsApp para armar tu pack. ¡Stock limitado!
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <a href="https://wa.me/59178580928?text=Hola%20Bad%20Bunny%20Vape!%20Quiero%20el%20Pack%20x3%20Lost%20Mary%20MO10000"
                target="_blank" rel="noreferrer"
                className="btn-primary">
                Quiero el pack 🔥
              </a>
              <div className="flex flex-col">
                <span className="text-white/30 text-sm line-through">Bs. 450</span>
                <span className="text-white font-black text-2xl">Bs. 315</span>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="flex justify-center">
            <div className="relative w-72 h-72">
              <div className="animate-float absolute inset-0 rounded-full border-2 border-primary-500/20 bg-gradient-to-br from-primary-600/15 to-purple-600/10 flex flex-col items-center justify-center gap-4">
                {/* Badge */}
                <div className="absolute -top-3 right-6 bg-amber-400 text-black font-black text-lg px-4 py-1 rounded-full shadow-xl">
                  -30%
                </div>
                <span className="text-7xl">💨</span>
                <div className="flex gap-2 text-3xl">💜🩵💚</div>
                <span className="bg-primary-500/20 border border-primary-500/30 text-primary-300 text-xs font-bold px-4 py-1.5 rounded-full">
                  10.000 puffs × 3
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
