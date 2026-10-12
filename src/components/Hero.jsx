import { ArrowDown, Star, Zap, ShieldCheck } from 'lucide-react'

export default function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center pt-20 overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 opacity-30"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(236,72,153,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      {/* Glow orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary-600/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 w-full grid md:grid-cols-2 gap-12 items-center py-16">

        {/* Left */}
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 text-primary-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <Zap size={12} className="fill-primary-400 text-primary-400" />
            Abierto las 24 horas · Sucre, Bolivia
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-5">
            Los mejores<br />
            <span className="text-gradient glow">vapes premium</span><br />
            en Bolivia
          </h1>

          <p className="text-white/50 text-lg leading-relaxed mb-6 max-w-md">
            Encontrá las marcas más reconocidas del mercado con los mejores sabores y precios. Envíos a todo Bolivia.
          </p>

          {/* Nicotine warning badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <ShieldCheck size={12} />
            Productos con nicotina · Solo mayores de 18 años
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-white/60 text-sm font-medium">5.0 en Google · +500 clientes felices</span>
          </div>

          <div className="flex flex-wrap gap-4">
            <a href="#productos" className="btn-primary text-base px-8 py-3.5">
              Ver catálogo
            </a>
            <a href="#contacto" className="btn-outline text-base px-8 py-3.5">
              Contactar ahora
            </a>
          </div>
        </div>

        {/* Right – floating showcase */}
        <div className="hidden md:flex justify-center items-center">
          <div className="relative w-80 h-80">
            <div className="animate-float absolute inset-0 rounded-full border-2 border-primary-500/20 bg-gradient-to-br from-primary-600/10 to-purple-600/10 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
              <div className="text-7xl filter drop-shadow-2xl">💨</div>
              <span className="text-primary-300 font-bold text-lg">Bad Bunny Vape</span>
              <span className="text-white/40 text-sm">Sucre, Bolivia</span>
            </div>
            <div className="absolute -top-4 -right-4 bg-dark-700 border border-primary-500/40 rounded-2xl px-3 py-2 shadow-xl shadow-primary-500/20 animate-pulse-slow">
              <p className="text-primary-400 font-bold text-xs">+45 productos</p>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-dark-700 border border-amber-500/40 rounded-2xl px-3 py-2 shadow-xl shadow-amber-500/20">
              <p className="text-amber-400 font-bold text-xs">24hs abierto</p>
            </div>
            <div className="absolute top-1/2 -right-10 -translate-y-1/2 bg-dark-700 border border-purple-500/40 rounded-2xl px-3 py-2 shadow-xl">
              <p className="text-purple-400 font-bold text-xs">Envío express</p>
            </div>
            <div className="absolute top-1/2 -left-10 -translate-y-1/2 bg-dark-700 border border-emerald-500/40 rounded-2xl px-3 py-2 shadow-xl">
              <p className="text-emerald-400 font-bold text-xs">⭐ Puntos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a href="#productos"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors">
        <span className="text-xs font-medium">Explorar</span>
        <ArrowDown size={16} className="animate-bounce" />
      </a>
    </section>
  )
}
