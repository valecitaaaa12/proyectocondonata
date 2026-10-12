import { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext(null)

const itemKey = (id, flavor) => `${id}__${flavor ?? ''}`

export function CartProvider({ children }) {
  const [items, setItems]         = useState([])
  const [isOpen, setIsOpen]       = useState(false)
  const [toast, setToast]         = useState({ visible: false, message: '' })
  const [coupon, setCoupon]       = useState(null)  // { code, discount, label } | null
  const [pointsRedeemed, setPointsRedeemed] = useState(0) // Bs de descuento por puntos

  const showToast = useCallback((message) => {
    setToast({ visible: true, message })
    setTimeout(() => setToast({ visible: false, message: '' }), 2500)
  }, [])

  const addItem = useCallback((product) => {
    const key = itemKey(product.id, product.selectedFlavor)
    setItems(prev => {
      const existing = prev.find(i => itemKey(i.id, i.selectedFlavor) === key)
      if (existing) {
        return prev.map(i =>
          itemKey(i.id, i.selectedFlavor) === key ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
    const flavorLabel = product.selectedFlavor && !product.selectedFlavor.startsWith('Solo')
      ? ` · ${product.selectedFlavor}` : ''
    showToast(`${product.name}${flavorLabel} agregado`)
  }, [showToast])

  const removeItem = useCallback((id, flavor) => {
    const key = itemKey(id, flavor)
    setItems(prev => prev.filter(i => itemKey(i.id, i.selectedFlavor) !== key))
  }, [])

  const changeQty = useCallback((id, flavor, delta) => {
    const key = itemKey(id, flavor)
    setItems(prev =>
      prev
        .map(i => itemKey(i.id, i.selectedFlavor) === key ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setCoupon(null)
    setPointsRedeemed(0)
  }, [])

  const subtotal = items.reduce((s, i) => s + (i.price ?? 0) * i.qty, 0)
  const couponDiscount = coupon ? Math.round(subtotal * coupon.discount) : 0
  const total = Math.max(0, subtotal - couponDiscount - pointsRedeemed)
  const count = items.reduce((s, i) => s + i.qty, 0)

  return (
    <CartContext.Provider value={{
      items, isOpen, setIsOpen,
      addItem, removeItem, changeQty, clearCart,
      subtotal, couponDiscount, total, count, toast,
      coupon, setCoupon,
      pointsRedeemed, setPointsRedeemed,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
