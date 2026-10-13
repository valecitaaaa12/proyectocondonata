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

export default function App() {
  const [verified,  setVerified]  = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setShowAdmin(true)
        history.replaceState(null, '', window.location.pathname)
      }
    }
    checkHash()
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
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
            <Navbar />
            <main>
              <Hero />
              <Stats />
              <Products />
              <WeeklyFlavors />
              <CommunitySection />
              <PromoEngine />
              <BudgetFinder />
              <Brands />
              <PromoBanner />
              <Mayoreo />
              <InfoSection />
              <Guides />
              <Contact />
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
