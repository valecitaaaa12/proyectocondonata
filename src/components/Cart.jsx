import { X, Trash2, Plus, Minus, ShoppingCart, Send } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, isOpen, setIsOpen, removeItem, changeQty, total } = useCart()

  const handleCheckout = () => {
    if (items.length === 0) return
    const lines = items.map(i => `• ${i.name} ×${i.qty} = Bs. ${(i.price * i.qty).toLocaleString('es-BO')}`).join('\n')
    const text  = `Hola Bad Bunny Vape! 👋\n\nQuiero hacer el siguiente pedido:\n\n${lines}\n\n*Total: Bs. ${total.toLocaleString('es-BO')}*`
    window.open(`https://wa.me/59178580928?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Panel */}
      <aside className={`fixed top-0 right-0 bottom-0 w-full max-w-sm bg-dark-800 border-l border-white/10 z-50 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="font-bold text-lg flex items-center gap-2.5">
            <ShoppingCart size={20} className="text-primary-400" />
            Tu carrito
          </h2>
          <button onClick={() => setIsOpen(false)}
            className="w-9 h-9 rounded-xl bg-dark-700 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-white/30">
              <ShoppingCart size={48} strokeWidth={1} />
              <p className="font-medium">Tu carrito está vacío</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id}
                className="flex items-center gap-4 bg-dark-700 border border-white/5 rounded-2xl p-4">
                <span className="text-3xl shrink-0">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-white truncate">{item.name}</p>
                  <p className="text-primary-400 font-bold text-sm mt-0.5">Bs. {(item.price * item.qty).toLocaleString('es-BO')}</p>
                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => changeQty(item.id, -1)}
                      className="w-6 h-6 rounded-lg bg-white/5 hover:bg-primary-600/50 flex items-center justify-center transition-colors"
                      aria-label="Quitar uno">
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-bold min-w-[20px] text-center">{item.qty}</span>
                    <button onClick={() => changeQty(item.id, 1)}
                      className="w-6 h-6 rounded-lg bg-white/5 hover:bg-primary-600/50 flex items-center justify-center transition-colors"
                      aria-label="Agregar uno">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)}
                  className="text-white/20 hover:text-rose-400 transition-colors shrink-0"
                  aria-label="Eliminar">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/50 font-medium">Total</span>
              <span className="text-primary-400 font-black text-2xl">Bs. {total.toLocaleString('es-BO')}</span>
            </div>
            <button onClick={handleCheckout}
              className="btn-primary w-full justify-center py-3.5">
              <Send size={16} />
              Pedir por WhatsApp
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
