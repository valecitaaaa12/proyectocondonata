import { useState, useEffect } from 'react'
import { ShoppingCart, Wind, Menu, X, User, LogIn } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import UserProfile from './UserProfile'
import { TABS } from '../data/tabs'

export default function Navbar({ tab = 'inicio', setTab = () => {} }) {
  const { count, setIsOpen }        = useCart()
  const { currentUser, setAuthModal } = useAuth()
  const [scrolled,  setScrolled]   = useState(false)
  const [menuOpen,  setMenuOpen]   = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const goTab = (id) => { setTab(id); setMenuOpen(false) }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark-900/95 backdrop-blur-md shadow-lg shadow-black/30 py-3' : 'py-5'
      }`}>
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between gap-4 xl:gap-6">

          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-2.5 font-extrabold text-xl shrink-0">
            <span className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Wind size={18} className="text-white" />
            </span>
            <span className="text-white">Bad Bunny <span className="text-primary-500">Vape</span></span>
          </a>

          {/* Desktop nav — pestañas */}
          <nav className="hidden lg:flex items-center gap-1 bg-dark-800/70 border border-white/10 rounded-2xl p-1.5 shrink-0">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} aria-current={tab === t.id ? 'page' : undefined}
                className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all duration-200 ${
                  tab === t.id
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                    : 'text-white/55 hover:text-white hover:bg-white/5'
                }`}>
                {t.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Auth button */}
            {currentUser ? (
              <button
                onClick={() => setShowProfile(true)}
                className="hidden md:flex items-center gap-2 h-10 px-3 rounded-xl bg-dark-700 border border-white/10 text-white/70 hover:bg-primary-600/20 hover:border-primary-500/40 hover:text-white transition-all duration-300 text-sm font-medium"
              >
                <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center text-[10px] font-black text-white">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[80px] truncate">{currentUser.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => setAuthModal('login')}
                className="hidden md:flex items-center gap-1.5 h-10 px-3 rounded-xl bg-dark-700 border border-white/10 text-white/60 hover:bg-primary-600/20 hover:border-primary-500/40 hover:text-white transition-all duration-300 text-sm font-medium"
              >
                <LogIn size={14} />
                Entrar
              </button>
            )}

            {/* Cart */}
            <button onClick={() => setIsOpen(true)}
              className="relative w-10 h-10 rounded-xl bg-dark-700 border border-white/10 flex items-center justify-center text-white/70 hover:bg-primary-600 hover:border-primary-600 hover:text-white transition-all duration-300"
              aria-label="Carrito">
              <ShoppingCart size={18} />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center animate-[fadeIn_0.3s_ease]">
                  {count}
                </span>
              )}
            </button>

            <button onClick={() => setMenuOpen(v => !v)}
              className="lg:hidden w-10 h-10 rounded-xl bg-dark-700 border border-white/10 flex items-center justify-center text-white/70"
              aria-label="Menú">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu — pestañas */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-[30rem]' : 'max-h-0'}`}>
          <nav className="flex flex-col gap-1 px-5 pb-4 pt-2 bg-dark-900/98 border-t border-white/5">
            {TABS.map(t => (
              <button key={t.id} onClick={() => goTab(t.id)} aria-current={tab === t.id ? 'page' : undefined}
                className={`text-sm font-semibold py-2.5 px-3 rounded-xl text-left transition-colors ${
                  tab === t.id ? 'bg-primary-600/20 text-primary-400' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}>
                {t.label}
              </button>
            ))}
            <div className="border-t border-white/5 pt-3 mt-1">
              {currentUser ? (
                <button onClick={() => { setShowProfile(true); setMenuOpen(false) }}
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white">
                  <User size={14} />
                  {currentUser.name}
                </button>
              ) : (
                <button onClick={() => { setAuthModal('login'); setMenuOpen(false) }}
                  className="flex items-center gap-2 text-sm text-primary-400 font-semibold">
                  <LogIn size={14} />
                  Iniciar sesión / Registrarse
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>

      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
    </>
  )
}
