import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Products from './components/Products'
import Brands from './components/Brands'
import PromoBanner from './components/PromoBanner'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Cart from './components/Cart'
import Toast from './components/Toast'
import { CartProvider } from './context/CartContext'

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-dark-900">
        <Navbar />
        <main>
          <Hero />
          <Stats />
          <Products />
          <Brands />
          <PromoBanner />
          <Contact />
        </main>
        <Footer />
        <Cart />
        <Toast />
      </div>
    </CartProvider>
  )
}
