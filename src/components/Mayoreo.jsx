import { mayoreoTable } from '../data/products'
import { AlertTriangle, Percent, MessageCircle } from 'lucide-react'

export default function Mayoreo() {
  return (
    <section id="mayoreo" className="py-24 bg-dark-800 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-5">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="section-title">Mayoreo y <span>Menudeo</span></h2>
          <p className="section-sub">Descuentos para distribuidores oficiales. Consultanos por WhatsApp.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* Tabla de descuentos */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Percent size={20} className="text-primary-400" />
              <h3 className="font-bold text-lg text-white">Tabla de descuentos</h3>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/10">
              {/* Encabezado */}
              <div className="grid grid-cols-3 bg-dark-600 border-b border-white/10">
                <div className="px-4 py-3 text-[11px] font-black text-white/40 uppercase tracking-wider">#</div>
                <div className="px-4 py-3 text-[11px] font-black text-white/40 uppercase tracking-wider">Producto</div>
                <div className="px-2 py-3 text-[11px] font-black text-white/40 uppercase tracking-wider text-center leading-tight">
                  10–20 pzs
                </div>
              </div>
              {/* Extra header col */}
              <div className="grid grid-cols-[auto_1fr_auto_auto] bg-dark-600 border-b border-white/5 hidden" />

              {/* Usamos tabla completa */}
              <table className="w-full">
                <thead>
                  <tr className="bg-dark-600">
                    <th className="px-4 py-3 text-[11px] font-black text-white/40 uppercase tracking-wider text-left w-8">#</th>
                    <th className="px-4 py-3 text-[11px] font-black text-white/40 uppercase tracking-wider text-left">Producto</th>
                    <th className="px-3 py-3 text-[11px] font-black text-white/40 uppercase tracking-wider text-center">10–20</th>
                    <th className="px-3 py-3 text-[11px] font-black text-white/40 uppercase tracking-wider text-center">21–51</th>
                  </tr>
                </thead>
                <tbody>
                  {mayoreoTable.map((row, i) => (
                    <tr key={i} className={`border-t border-white/5 ${i % 2 === 0 ? 'bg-dark-700' : 'bg-dark-700/50'}`}>
                      <td className="px-4 py-3 text-[11px] text-white/30 font-bold">{row.num}</td>
                      <td className="px-4 py-3 text-[12px] text-white/70 font-medium">{row.producto}</td>
                      <td className="px-3 py-3 text-center">
                        <span className="bg-primary-500/20 text-primary-300 text-[11px] font-bold px-2 py-0.5 rounded-full">
                          {row.mayoreo10a20}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-full">
                          {row.mayoreo21a51}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CTA mayoreo */}
            <a href="https://wa.me/59178580928?text=Hola!%20Quiero%20información%20sobre%20mayoreo%20Bad%20Bunny%20Vape%20Bolivia"
              target="_blank" rel="noreferrer"
              className="btn-primary mt-6 w-full justify-center">
              <MessageCircle size={16} />
              Consultar mayoreo por WhatsApp
            </a>
          </div>

          {/* Política + aviso */}
          <div className="flex flex-col gap-6">
            {/* Distribuidores */}
            <div className="bg-dark-700 border border-primary-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <Percent size={20} className="text-primary-400" />
                </div>
                <h4 className="font-bold text-white">Distribuidores oficiales</h4>
              </div>
              <ul className="space-y-2 text-white/50 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">✓</span>
                  Descuentos aplicables desde 10 piezas del mismo producto
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">✓</span>
                  Precios especiales para vapes de mayor puffage (30k–42k: 12% con 21+ pzs)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">✓</span>
                  Atención personalizada para revendedores
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">✓</span>
                  Productos originales con garantía de fábrica
                </li>
              </ul>
            </div>

            {/* Aviso importante */}
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle size={22} className="text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-rose-300 mb-2">¡Aviso importante!</h4>
                  <p className="text-rose-200/70 text-sm leading-relaxed">
                    En caso de falla de fábrica, el reclamo debe realizarse <strong className="text-rose-200">al momento de la compra en tienda</strong>.
                  </p>
                  <p className="text-rose-200/70 text-sm leading-relaxed mt-2 font-semibold">
                    No se realizan cambios ni devoluciones posterior a la compra.
                  </p>
                </div>
              </div>
            </div>

            {/* "Abierto por Error" tag explicación */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔓</span>
                <div>
                  <h4 className="font-semibold text-green-300 text-sm mb-1">¿Qué significa "Abierto por Error"?</h4>
                  <p className="text-green-200/60 text-xs leading-relaxed">
                    Precio especial en productos que fueron abiertos para demostración o revisión de calidad. 
                    Funcionan perfectamente y tienen descuento adicional. Consultanos por WhatsApp disponibilidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
