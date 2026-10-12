import { useState } from 'react'
import { Truck, Clock, MapPin, MessageCircle } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const zones = [
  { barrio: 'Centro / Plaza 25 de Mayo', costo: 'Gratis desde 650 Bs', costoNum: 0, tiempo: '15–25 min', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  { barrio: 'Mercado Central / Paseo',   costo: 'Bs. 10',  costoNum: 10,  tiempo: '20–30 min', color: 'text-primary-400', bg: 'bg-primary-400/10', border: 'border-primary-400/20' },
  { barrio: 'Recoleta',                   costo: 'Bs. 10',  costoNum: 10,  tiempo: '20–35 min', color: 'text-primary-400', bg: 'bg-primary-400/10', border: 'border-primary-400/20' },
  { barrio: 'Villa Armonía / Las Piedras', costo: 'Bs. 15', costoNum: 15, tiempo: '25–40 min', color: 'text-cyan-400',    bg: 'bg-cyan-400/10',    border: 'border-cyan-400/20'    },
  { barrio: 'Av. Juana Azurduy',          costo: 'Bs. 15', costoNum: 15,  tiempo: '25–40 min', color: 'text-cyan-400',    bg: 'bg-cyan-400/10',    border: 'border-cyan-400/20'    },
  { barrio: 'Parque Bolívar / Muyurina',  costo: 'Bs. 15', costoNum: 15,  tiempo: '30–40 min', color: 'text-cyan-400',    bg: 'bg-cyan-400/10',    border: 'border-cyan-400/20'    },
  { barrio: 'San Roque / Cachimayo',      costo: 'Bs. 20', costoNum: 20,  tiempo: '35–50 min', color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/20'   },
  { barrio: 'Mercado Campesino',          costo: 'Bs. 20', costoNum: 20,  tiempo: '35–50 min', color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/20'   },
  { barrio: 'Zona Norte (Colinas del Sur / Ñucchu)', costo: 'Bs. 25', costoNum: 25, tiempo: '40–60 min', color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
  { barrio: 'Zona Sur (Tumusla / El Tejar)', costo: 'Bs. 25', costoNum: 25, tiempo: '40–60 min', color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
  { barrio: 'Fuera de Sucre',             costo: 'Encomienda',  costoNum: 99, tiempo: 'Coordinar', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
]

export default function DeliveryZones() {
  const [ref, visible] = useScrollReveal()
  const [needsDelivery, setNeedsDelivery] = useState(null)

  const handleContact = () => {
    const txt = `Hola Bad Bunny Vape! 👋\n\nQuiero coordinar un envío a mi barrio. ¿Me pueden confirmar el costo y tiempo de entrega?`
    window.open(`https://wa.me/59178580928?text=${encodeURIComponent(txt)}`, '_blank')
  }

  return (
    <section id="delivery" className="py-20 bg-dark-900 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-5">
        <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 text-primary-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              <Truck size={12} />
              Envíos en Sucre
            </div>
            <h2 className="section-title">Zonas de <span>delivery</span></h2>
            <p className="section-sub">Entregamos a tu barrio. El envío se coordina directamente por WhatsApp.</p>
          </div>

          {/* Free shipping banner */}
          <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-2xl px-5 py-4 flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Truck size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="font-black text-white text-sm">🎉 Envío GRATIS en Sucre centro desde <span className="text-emerald-400">650 Bs</span></p>
              <p className="text-white/40 text-xs mt-0.5">Para zonas alejadas se coordina el costo extra por WhatsApp</p>
            </div>
          </div>

          {/* Zones grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {zones.map((z, i) => (
              <div key={i} className={`flex items-center gap-3 bg-dark-700 border ${z.border} rounded-2xl px-4 py-3 hover:bg-dark-600 transition-colors`}>
                <div className={`w-8 h-8 rounded-xl ${z.bg} flex items-center justify-center shrink-0`}>
                  <MapPin size={15} className={z.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 font-semibold text-xs truncate">{z.barrio}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`font-black text-xs ${z.color}`}>{z.costo}</span>
                    <span className="text-white/25 text-[10px]">·</span>
                    <span className="text-white/30 text-[10px] flex items-center gap-1">
                      <Clock size={9} />{z.tiempo}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery toggle for order */}
          <div className="bg-dark-700 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
            <p className="font-bold text-white text-sm">¿Tu pedido necesita envío?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setNeedsDelivery(true)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all ${
                  needsDelivery === true
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'bg-white/5 border-white/10 text-white/50 hover:border-primary-500/40 hover:text-white/80'
                }`}>
                Sí, necesito envío 🛵
              </button>
              <button
                onClick={() => setNeedsDelivery(false)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all ${
                  needsDelivery === false
                    ? 'bg-dark-600 border-white/30 text-white'
                    : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'
                }`}>
                No, voy a recoger 🏪
              </button>
            </div>
            {needsDelivery === true && (
              <div className="animate-[fadeIn_0.3s_ease]">
                <p className="text-white/50 text-xs mb-3">
                  El costo de envío se suma al pedido y se coordina por WhatsApp según tu barrio.
                </p>
                <button onClick={handleContact}
                  className="btn-primary w-full justify-center py-3 text-sm">
                  <MessageCircle size={15} />
                  Coordinar envío por WhatsApp
                </button>
              </div>
            )}
            {needsDelivery === false && (
              <p className="text-emerald-400 text-xs font-semibold animate-[fadeIn_0.3s_ease]">
                ✅ Perfecto — Juan Jose Perez 583, Sucre. Abierto 24hs.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
