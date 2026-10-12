import { useState } from 'react'
import AgeGate from './components/AgeGate'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Products from './components/Products'
import Brands from './components/Brands'
import PromoBanner from './components/PromoBanner'
import Mayoreo from './components/Mayoreo'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Cart from './components/Cart'
import Toast from './components/Toast'
import { CartProvider } from './context/CartContext'

export default function App() {
  const [verified, setVerified] = useState(false)

  // Mientras no pase la verificación, solo mostramos AgeGate
  if (!verified) {
    return <AgeGate onVerified={() => setVerified(true)} />
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-dark-900 animate-[fadeIn_0.6s_ease]">
        <Navbar />
        <main>
          <Hero />
          <Stats />
          <Products />
          <Brands />
          <PromoBanner />
          <Mayoreo />
          <Contact />
        </main>
        <Footer />
        <Cart />
        <Toast />
      </div>
    </CartProvider>
  )
}
