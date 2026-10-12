import { Truck } from 'lucide-react'

const FREE_SHIPPING_MIN = 650

export default function ShippingBanner() {
  return (
    <div className="bg-gradient-to-r from-emerald-600/20 via-emerald-500/15 to-emerald-600/20 border-y border-emerald-500/20 py-2.5">
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-center gap-2.5">
        <Truck size={15} className="text-emerald-400 shrink-0" />
        <p className="text-emerald-300 text-xs font-semibold text-center">
          🎉 <strong>Envío GRATIS</strong> en Sucre centro en pedidos desde <strong className="text-emerald-400">Bs. {FREE_SHIPPING_MIN}</strong> — se coordina por WhatsApp
        </p>
      </div>
    </div>
  )
}
