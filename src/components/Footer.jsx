import { Wind, Instagram, MessageCircle, MapPin, Clock, Phone } from 'lucide-react'

const navLinks = [
  { href: '#inicio',    label: 'Inicio' },
  { href: '#productos', label: 'Productos' },
  { href: '#marcas',    label: 'Marcas' },
  { href: '#ofertas',   label: 'Ofertas' },
  { href: '#contacto',  label: 'Contacto' },
]

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#inicio" className="flex items-center gap-2.5 font-extrabold text-xl mb-4">
              <span className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
                <Wind size={18} className="text-white" />
              </span>
              <span className="text-white">Bad Bunny <span className="text-primary-500">Vape</span></span>
            </a>
            <p className="text-white/40 text-sm leading-relaxed mb-5 max-w-sm">
              Tu tienda de vapes de confianza en Sucre, Bolivia. Productos originales,
              precios justos y atención las 24 horas.
            </p>
            <div className="flex gap-3">
              <a href="https://wa.me/59178580928" target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-dark-700 border border-white/10 flex items-center justify-center text-white/50 hover:bg-emerald-600 hover:border-emerald-600 hover:text-white transition-all duration-300"
                aria-label="WhatsApp">
                <MessageCircle size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-dark-700 border border-white/10 flex items-center justify-center text-white/50 hover:bg-primary-600 hover:border-primary-600 hover:text-white transition-all duration-300"
                aria-label="Instagram">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4">Navegación</h4>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map(l => (
                <li key={l.href}>
                  <a href={l.href}
                    className="text-white/40 text-sm hover:text-white transition-colors hover:pl-1 inline-block transition-all duration-200">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4">Contacto</h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5 text-white/40 text-sm">
                <MapPin size={14} className="text-rose-400 mt-0.5 shrink-0" />
                Juan Jose Perez 583, Sucre, Bolivia
              </li>
              <li className="flex items-center gap-2.5 text-white/40 text-sm">
                <Phone size={14} className="text-blue-400 shrink-0" />
                <a href="tel:+59178580928" className="hover:text-white transition-colors">78580928</a>
              </li>
              <li className="flex items-center gap-2.5 text-white/40 text-sm">
                <Clock size={14} className="text-amber-400 shrink-0" />
                Abierto las 24 horas
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-5">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">© 2026 Bad Bunny Vape Bolivia – Todos los derechos reservados.</p>
          <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium px-3 py-1.5 rounded-full">
            ⚠️ Solo para mayores de 18 años
          </div>
        </div>
      </div>
    </footer>
  )
}
