import { useScrollReveal } from '../hooks/useScrollReveal'
import { Heart, Target, Eye, Users } from 'lucide-react'

const cardClass = 'bg-dark-700 border border-white/10 rounded-2xl p-6 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300'

export default function InfoSection() {
  const [ref1, v1] = useScrollReveal()
  const [ref2, v2] = useScrollReveal()

  return (
    <section id="nosotros" className="py-24 bg-dark-800 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-5">

        {/* Header */}
        <div ref={ref1} className={`text-center mb-14 reveal ${v1 ? 'visible' : ''}`}>
          <h2 className="section-title">Quiénes <span>somos</span></h2>
          <p className="section-sub">Conocé la historia y los valores que guían a Bad Bunny Vape Bolivia.</p>
        </div>

        <div ref={ref2} className={`grid md:grid-cols-3 gap-6 reveal ${v2 ? 'visible' : ''}`}>
          {/* Quiénes somos */}
          <div className={`${cardClass} md:col-span-3`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-600/20 flex items-center justify-center">
                <Users size={20} className="text-primary-400" />
              </div>
              <h3 className="font-black text-white text-lg">Nuestra historia</h3>
            </div>
            <p className="text-white/50 leading-relaxed">
              Bad Bunny Vape Bolivia nació en Sucre con una sola misión: ofrecer los mejores vapes del mercado
              a precios justos, con atención personalizada y honesta. Somos un emprendimiento local que cree
              en la transparencia: te decimos exactamente qué tiene cada producto, qué nicotina lleva y qué
              podés esperar. Sin letras chicas. Vendemos marcas reconocidas a nivel mundial con garantía de
              producto original, y atendemos las 24 horas porque sabemos que nuestros clientes no tienen horario.
            </p>
          </div>

          {/* Misión */}
          <div className={cardClass}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                <Target size={20} className="text-rose-400" />
              </div>
              <h3 className="font-black text-white">Misión</h3>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Brindar productos de vapeo de calidad certificada a mayores de 18 años, con información
              completa sobre nicotina y uso responsable, precios accesibles y entrega rápida en toda Bolivia.
            </p>
          </div>

          {/* Visión */}
          <div className={cardClass}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Eye size={20} className="text-purple-400" />
              </div>
              <h3 className="font-black text-white">Visión</h3>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Ser la tienda de referencia de vapes en Bolivia, conocida por su honestidad, variedad de productos
              premium y comunidad de clientes satisfechos que eligen vapear de forma informada y responsable.
            </p>
          </div>

          {/* Valores */}
          <div className={cardClass}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Heart size={20} className="text-amber-400" />
              </div>
              <h3 className="font-black text-white">Valores</h3>
            </div>
            <ul className="text-white/50 text-sm space-y-2">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />Transparencia total en productos y precios</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />Productos originales con garantía</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />Atención personalizada 24/7</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />Venta responsable solo a mayores de 18</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  )
}
