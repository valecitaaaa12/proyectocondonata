import { useState, useEffect } from 'react'
import AgeGate             from './components/AgeGate'
import Navbar              from './components/Navbar'
import Hero                from './components/Hero'
import Stats               from './components/Stats'
import ShippingBanner      from './components/ShippingBanner'
import Products            from './components/Products'
import WeeklyFlavors       from './components/WeeklyFlavors'
import CommunitySection    from './components/CommunitySection'
import Brands              from './components/Brands'
import PromoBanner         from './components/PromoBanner'
import Mayoreo             from './components/Mayoreo'
import PromoEngine         from './components/PromoEngine'
import BudgetFinder        from './components/BudgetFinder'
import InfoSection         from './components/InfoSection'
import Guides              from './components/Guides'
import Contact             from './components/Contact'
import Footer              from './components/Footer'
import Cart                from './components/Cart'
import Toast               from './components/Toast'
import AuthModal           from './components/AuthModal'
import WelcomeBanner       from './components/WelcomeBanner'
import PostPurchaseSurvey  from './components/PostPurchaseSurvey'
import AdminPanel          from './components/AdminPanel'
import { CartProvider }    from './context/CartContext'
import { AuthProvider }    from './context/AuthContext'
import { AdminProvider }   from './context/AdminContext'
import { TAB_HASH, ANCHOR_TAB, tabFromHash } from './data/tabs'

export default function App() {
  const [verified,  setVerified]  = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  // Pestaña activa: arranca según el hash con el que entraron (deep links intactos)
  const [tab, setTabState] = useState(() => tabFromHash(window.location.hash))

  // Cambia de pestaña, actualiza la URL y lleva el scroll al sitio correcto
  const setTab = (t, hash) => {
    setTabState(t)
    const h = hash || TAB_HASH[t] || '#inicio'
    if (window.location.hash !== h) history.replaceState(null, '', window.location.pathname + h)
    setTimeout(() => {
      const id = h.replace(/^#/, '')
      const el = id ? document.getElementById(id) : null
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 60)
  }

  // #admin abre el panel; cualquier otra ancla interna la resuelve como pestaña
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash
      if (hash === '#admin') {
        setShowAdmin(true)
        history.replaceState(null, '', window.location.pathname)
        return
      }
      const t = tabFromHash(hash)
      if (hash && t !== tab) setTabState(t)
    }
    checkHash()
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [tab])

  // Interceptor global: cualquier <a href="#..."> conmuta a su pestaña
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest?.('a[href^="#"]')
      if (!a) return
      const hash = a.getAttribute('href')
      if (!hash || hash === '#' || hash === '#admin') return
      const t = ANCHOR_TAB[hash.slice(1)]
      if (!t) return
      e.preventDefault()
      setTab(t, hash)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  if (!verified) {
    return (
      <AdminProvider>
        <AgeGate onVerified={() => setVerified(true)} />
        {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
      </AdminProvider>
    )
  }

  return (
    <AdminProvider>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-dark-900 animate-[fadeIn_0.6s_ease]">
            <ShippingBanner />
            <Navbar tab={tab} setTab={setTab} />
            <main>
              {tab === 'inicio' && (
                <>
                  <Hero />
                  <Stats />
                  <InfoSection />
                </>
              )}

              {tab === 'catalogo' && (
                <>
                  <Products />
                  <PromoBanner />
                  <WeeklyFlavors />
                  <PromoEngine />
                  <BudgetFinder />
                </>
              )}

              {tab === 'marcas'    && <Brands />}
              {tab === 'mayoreo'   && <Mayoreo />}
              {tab === 'comunidad' && <CommunitySection />}
              {tab === 'guias'     && <Guides />}
              {tab === 'contacto'  && <Contact />}
            </main>
            <Footer />
            <Cart />
            <Toast />
            <AuthModal />
            <WelcomeBanner />
            <PostPurchaseSurvey />
          </div>
          {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
        </CartProvider>
      </AuthProvider>
    </AdminProvider>
  )
}
