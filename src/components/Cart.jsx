import { X, Trash2, Plus, Minus, ShoppingCart, Send, Wind, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { logSale } from '../context/AdminContext'

export default function Cart() {
  const {
    items, isOpen, setIsOpen, removeItem, changeQty, clearCart,
    subtotal, total, count,
    pointsRedeemed, setPointsRedeemed,
  } = useCart()
  const { currentUser, addOrderPoints, addOrder } = useAuth()

  const removePoints = () => {
    setPointsRedeemed(0)
  }

  const handleCheckout = () => {
    if (items.length === 0) return

    const lines = items.map(i => {
      const flavor = i.selectedFlavor && !i.selectedFlavor.startsWith('Solo')
        ? `\n   Sabor: ${i.selectedFlavor}` : ''
      return `• *${i.name}* ×${i.qty}${flavor}\n   Bs. ${(i.price * i.qty).toLocaleString('es-BO')}`
    }).join('\n\n')

    let discountLines = ''
    if (pointsRedeemed > 0) discountLines += `\n⭐ Descuento puntos: -Bs. ${pointsRedeemed}`

    const userName = currentUser ? `\n👤 Cliente: *${currentUser.name}*` : ''
    const text = `Hola Bad Bunny Vape! 👋${userName}\n\nQuiero hacer el siguiente pedido:\n\n${lines}\n\nSubtotal: Bs. ${subtotal.toLocaleString('es-BO')}${discountLines}\n\n*Total: Bs. ${total.toLocaleString('es-BO')}*\n\n📦 Necesito envío a domicilio — por favor coordinen el costo y barrio.\n\nDirección tienda: Juan Jose Perez 583, Sucre`

    // Log sale
    const orderData = { items: items.map(i => ({ name: i.name, qty: i.qty, price: i.price })), total }
    logSale({ ...orderData, user: currentUser?.email || 'anonymous' })

    // Give points and register order if logged in
    if (currentUser) {
      addOrderPoints(total)
      addOrder(orderData)
    }

    window.open(`https://wa.me/59178580928?text=${encodeURIComponent(text)}`, '_blank')
    clearCart()
    setIsOpen(false)
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Panel */}
      <aside className={`fixed top-0 right-0 bottom-0 w-full max-w-sm bg-dark-800 border-l border-white/10 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="font-bold text-base flex items-center gap-2.5">
            <ShoppingCart size={18} className="text-primary-400" />
            Tu pedido
            {count > 0 && (
              <span className="bg-primary-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </h2>
          <button onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-xl bg-dark-700 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            aria-label="Cerrar carrito">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-white/20">
              <ShoppingCart size={52} strokeWidth={1} />
              <div className="text-center">
                <p className="font-semibold text-sm">Tu carrito está vacío</p>
                <p className="text-xs mt-1">Agregá productos del catálogo</p>
              </div>
            </div>
          ) : (
            items.map(item => (
              <div key={`${item.id}-${item.selectedFlavor}`}
                className="bg-dark-700 border border-white/5 rounded-2xl p-3 flex gap-3 group hover:border-white/10 transition-colors">
                {item.emoji ? (
                  <span className="text-2xl shrink-0 mt-0.5">{item.emoji}</span>
                ) : item.image ? (
                  <img src={item.image} alt="" className="w-7 h-7 rounded-lg object-cover shrink-0 mt-0.5 bg-dark-600"
                    onError={e => { e.currentTarget.style.display = 'none' }} />
                ) : (
                  <span className="w-7 h-7 rounded-lg bg-dark-600 border border-white/10 flex items-center justify-center text-primary-300 font-black text-xs shrink-0 mt-0.5">
                    {(item.name || '?').charAt(0)}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs text-white truncate">{item.name}</p>
                  {item.selectedFlavor && !item.selectedFlavor.startsWith('Solo') && (
                    <div className="flex items-center gap-1 mt-1">
                      <Wind size={9} className="text-primary-400 shrink-0" />
                      <p className="text-primary-300 text-[10px] font-medium truncate">{item.selectedFlavor}</p>
                    </div>
                  )}
                  <p className="text-primary-400 font-bold text-sm mt-1.5">
                    Bs. {(item.price * item.qty).toLocaleString('es-BO')}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => changeQty(item.id, item.selectedFlavor, -1)}
                      className="w-6 h-6 rounded-lg bg-white/5 hover:bg-primary-600/50 flex items-center justify-center transition-colors text-white"
                      aria-label="Quitar uno"><Minus size={11} /></button>
                    <span className="text-sm font-bold min-w-[18px] text-center text-white">{item.qty}</span>
                    <button onClick={() => changeQty(item.id, item.selectedFlavor, 1)}
                      className="w-6 h-6 rounded-lg bg-white/5 hover:bg-primary-600/50 flex items-center justify-center transition-colors text-white"
                      aria-label="Agregar uno"><Plus size={11} /></button>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id, item.selectedFlavor)}
                  className="text-white/20 hover:text-rose-400 transition-colors shrink-0 self-start mt-0.5"
                  aria-label="Eliminar producto"><Trash2 size={14} /></button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-white/10 space-y-3">

            {/* Points redeemed */}
            {pointsRedeemed > 0 && (
              <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
                <div className="flex items-center gap-2">
                  <Star size={13} className="text-amber-400 fill-amber-400" />
                  <span className="text-amber-300 text-xs font-semibold">Descuento puntos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-300 text-xs font-bold">-Bs. {pointsRedeemed}</span>
                  <button onClick={removePoints} className="text-amber-400/50 hover:text-rose-400 transition-colors">
                    <X size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* Totals */}
            <div className="space-y-1.5">
              {items.map(item => (
                <div key={`${item.id}-${item.selectedFlavor}-sub`}
                  className="flex justify-between text-xs text-white/40">
                  <span className="truncate max-w-[180px]">{item.name} ×{item.qty}</span>
                  <span>Bs. {(item.price * item.qty).toLocaleString('es-BO')}</span>
                </div>
              ))}
            </div>

            {pointsRedeemed > 0 && (
              <div className="flex justify-between text-xs text-white/40 border-t border-white/5 pt-1.5">
                <span>Subtotal</span>
                <span>Bs. {subtotal.toLocaleString('es-BO')}</span>
              </div>
            )}

            <div className="border-t border-white/10 pt-3 flex justify-between items-center">
              <span className="text-white/60 font-semibold text-sm">Total</span>
              <span className="text-primary-400 font-black text-2xl">
                Bs. {total.toLocaleString('es-BO')}
              </span>
            </div>

            {/* Points hint */}
            {currentUser && (
              <p className="text-white/25 text-[10px] text-center">
                Esta compra te dará puntos para tu próximo pedido 🌟
              </p>
            )}
            {!currentUser && (
              <p className="text-primary-400/60 text-[10px] text-center">
                Iniciá sesión para acumular puntos y canjear descuentos
              </p>
            )}

            <button onClick={handleCheckout}
              className="btn-primary w-full justify-center py-3.5 text-sm group">
              <Send size={15} />
              Confirmar pedido por WhatsApp
            </button>

            {/* Delivery question */}
            <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-center">
              <p className="text-white/40 text-[10px]">¿Necesitás envío? Indicalo en el mensaje — se coordina por WhatsApp 🛵</p>
            </div>

            <p className="text-center text-white/25 text-[10px]">
              En caso de falla de fábrica, reclamar al momento de la compra. No se realizan cambios ni devoluciones.
            </p>
          </div>
        )}
      </aside>
    </>
  )
}
