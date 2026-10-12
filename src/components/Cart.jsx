import { X, Trash2, Plus, Minus, ShoppingCart, Send, Wind } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, isOpen, setIsOpen, removeItem, changeQty, total } = useCart()

  const handleCheckout = () => {
    if (items.length === 0) return
    const lines = items.map(i => {
      const flavor = i.selectedFlavor && !i.selectedFlavor.startsWith('Solo')
        ? `\n   Sabor: ${i.selectedFlavor}`
        : ''
      return `• *${i.name}* ×${i.qty}${flavor}\n   Bs. ${(i.price * i.qty).toLocaleString('es-BO')}`
    }).join('\n\n')
    const text = `Hola Bad Bunny Vape! 👋\n\nQuiero hacer el siguiente pedido:\n\n${lines}\n\n*Total: Bs. ${total.toLocaleString('es-BO')}*\n\nDirección: Juan Jose Perez 583, Sucre`
    window.open(`https://wa.me/59178580928?text=${encodeURIComponent(text)}`, '_blank')
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
            {items.length > 0 && (
              <span className="bg-primary-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {items.reduce((s, i) => s + i.qty, 0)}
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
                className="bg-dark-700 border border-white/5 rounded-2xl p-3 flex gap-3">
                <span className="text-2xl shrink-0 mt-0.5">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs text-white truncate">{item.name}</p>
                  {/* Sabor seleccionado */}
                  {item.selectedFlavor && !item.selectedFlavor.startsWith('Solo') && (
                    <div className="flex items-center gap-1 mt-1">
                      <Wind size={9} className="text-primary-400 shrink-0" />
                      <p className="text-primary-300 text-[10px] font-medium truncate">{item.selectedFlavor}</p>
                    </div>
                  )}
                  <p className="text-primary-400 font-bold text-sm mt-1.5">
                    Bs. {(item.price * item.qty).toLocaleString('es-BO')}
                  </p>
                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => changeQty(item.id, item.selectedFlavor, -1)}
                      className="w-6 h-6 rounded-lg bg-white/5 hover:bg-primary-600/50 flex items-center justify-center transition-colors text-white"
                      aria-label="Quitar uno">
                      <Minus size={11} />
                    </button>
                    <span className="text-sm font-bold min-w-[18px] text-center text-white">{item.qty}</span>
                    <button onClick={() => changeQty(item.id, item.selectedFlavor, 1)}
                      className="w-6 h-6 rounded-lg bg-white/5 hover:bg-primary-600/50 flex items-center justify-center transition-colors text-white"
                      aria-label="Agregar uno">
                      <Plus size={11} />
                    </button>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id, item.selectedFlavor)}
                  className="text-white/20 hover:text-rose-400 transition-colors shrink-0 self-start mt-0.5"
                  aria-label="Eliminar producto">
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-white/10 space-y-3">
            {/* Subtotales */}
            <div className="space-y-1.5">
              {items.map(item => (
                <div key={`${item.id}-${item.selectedFlavor}-sub`}
                  className="flex justify-between text-xs text-white/40">
                  <span className="truncate max-w-[180px]">{item.name} ×{item.qty}</span>
                  <span>Bs. {(item.price * item.qty).toLocaleString('es-BO')}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between items-center">
              <span className="text-white/60 font-semibold text-sm">Total</span>
              <span className="text-primary-400 font-black text-2xl">
                Bs. {total.toLocaleString('es-BO')}
              </span>
            </div>
            <button onClick={handleCheckout}
              className="btn-primary w-full justify-center py-3.5 text-sm">
              <Send size={15} />
              Confirmar pedido por WhatsApp
            </button>
            <p className="text-center text-white/25 text-[10px]">
              En caso de falla de fábrica, reclamar al momento de la compra en tienda. No se realizan cambios ni devoluciones.
            </p>
          </div>
        )}
      </aside>
    </>
  )
}
