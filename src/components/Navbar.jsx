import { useState, useEffect } from 'react'
import { ShoppingCart, Wind, Menu, X } from 'lucide-react'
import { useCart } from '../context/CartContext'

const navLinks = [
  { href: '#inicio',    label: 'Inicio' },
  { href: '#productos', label: 'Productos' },
  { href: '#marcas',    label: 'Marcas' },
  { href: '#ofertas',   label: 'Ofertas' },
  { href: '#contacto',  label: 'Contacto' },
]

export default function Navbar() {
  const { count, setIsOpen } = useCart()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-dark-900/95 backdrop-blur-md shadow-lg shadow-black/30 py-3' : 'py-5'
    }`}>
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between gap-6">

        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-2.5 font-extrabold text-xl shrink-0">
          <span className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
            <Wind size={18} className="text-white" />
          </span>
          <span className="text-white">Bad Bunny <span className="text-primary-500">Vape</span></span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(l => (
            <a key={l.href} href={l.href}
              className="text-sm font-medium text-white/50 hover:text-white transition-colors relative group">
              {l.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button onClick={() => setIsOpen(true)}
            className="relative w-10 h-10 rounded-xl bg-dark-700 border border-white/10 flex items-center justify-center text-white/70 hover:bg-primary-600 hover:border-primary-600 hover:text-white transition-all duration-300"
            aria-label="Carrito">
            <ShoppingCart size={18} />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-content-center flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
          <button onClick={() => setMenuOpen(v => !v)}
            className="md:hidden w-10 h-10 rounded-xl bg-dark-700 border border-white/10 flex items-center justify-center text-white/70"
            aria-label="Menú">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-64' : 'max-h-0'}`}>
        <nav className="flex flex-col gap-1 px-5 pb-4 pt-2 bg-dark-900/98 border-t border-white/5">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-white/60 hover:text-white py-2 transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
