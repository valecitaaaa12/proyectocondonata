import { Truck, Package } from 'lucide-react'

export default function ShippingBanner() {
  return (
    <div className="bg-dark-800/80 border-b border-white/5 py-2 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center gap-6 flex-wrap">
        <div className="flex items-center gap-2 text-white/50 text-[11px]">
          <Truck size={12} className="text-emerald-400 shrink-0" />
          <span>Envío <strong className="text-emerald-400">gratis</strong> en Sucre centro desde <strong className="text-white/70">Bs. 650</strong></span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-white/50 text-[11px]">
          <Package size={12} className="text-sky-400 shrink-0" />
          <span>Envíos a <strong className="text-sky-400">los 9 departamentos</strong> de Bolivia por encomienda</span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-white/50 text-[11px]">
          <span className="text-amber-400 font-bold">24hs</span>
          <span>abierto · Sucre, Bolivia</span>
        </div>
      </div>
    </div>
  )
}
