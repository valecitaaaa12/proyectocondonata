import { useState } from 'react'
import { X, Star, ShoppingBag, Gift, RefreshCw, LogOut, ChevronRight } from 'lucide-react'
import { useAuth, POINTS_PER_500, POINTS_VALUE_BS } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function UserProfile({ onClose }) {
  const { currentUser, logout, redeemPoints } = useAuth()
  const { setIsOpen, items, setPointsRedeemed, pointsRedeemed, showToast } = useCart()
  const [tab, setTab] = useState('overview') // 'overview' | 'orders'

  if (!currentUser) return null

  const points = currentUser.points || 0
  const canRedeem = points >= POINTS_PER_500 // mínimo 10 puntos para canjear

  const handleRedeem = () => {
    if (!canRedeem) return
    // Canjear todos los puntos disponibles en bloques de 10
    const blocks = Math.floor(points / POINTS_PER_500)
    const bsDiscount = blocks * POINTS_VALUE_BS
    redeemPoints(blocks * POINTS_PER_500)
    setPointsRedeemed(bsDiscount)
    onClose()
    setIsOpen(true)
  }

  const handleReorder = (order) => {
    onClose()
    setIsOpen(true)
  }

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]" />
      <div className="fixed inset-0 z-[201] flex items-center justify-center px-4 pointer-events-none">
        <div className="bg-dark-800 border border-white/10 rounded-3xl w-full max-w-sm shadow-2xl shadow-black/60 pointer-events-auto animate-fade-up overflow-hidden max-h-[90vh] flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center text-white font-black text-sm">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{currentUser.name}</p>
                <p className="text-white/40 text-[11px]">{currentUser.email}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-dark-700 flex items-center justify-center text-white/50 hover:text-white transition-colors">
              <X size={15} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-3 border-b border-white/10 shrink-0">
            {[
              { id: 'overview', label: 'Mi cuenta' },
              { id: 'orders', label: 'Pedidos' },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                  tab === t.id
                    ? 'bg-primary-600 text-white'
                    : 'text-white/40 hover:text-white/70'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {tab === 'overview' && (
              <div className="p-5 flex flex-col gap-4">
                {/* Points card */}
                <div className="bg-gradient-to-br from-primary-600/20 to-purple-600/20 border border-primary-500/30 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-amber-400 fill-amber-400" />
                      <span className="font-bold text-white text-sm">Mis puntos</span>
                    </div>
                    <span className="text-primary-300 font-black text-2xl">{points}</span>
                  </div>
                  <div className="bg-dark-700/50 rounded-xl p-3 text-xs text-white/50 leading-relaxed mb-3">
                    <p>• Cada <strong className="text-white/80">500 Bs</strong> en compras = <strong className="text-white/80">10 puntos</strong></p>
                    <p>• <strong className="text-white/80">10 puntos</strong> = <strong className="text-primary-400">5 Bs de descuento</strong></p>
                    <p className="mt-1 text-white/30">Acumulables para tu próximo pedido.</p>
                  </div>
                  {canRedeem ? (
                    <button onClick={handleRedeem}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
                      <Gift size={14} />
                      Canjear puntos en el carrito
                      <span className="bg-primary-500 rounded-full px-2 py-0.5 text-[10px]">
                        {Math.floor(points / POINTS_PER_500) * POINTS_VALUE_BS} Bs
                      </span>
                    </button>
                  ) : (
                    <p className="text-white/30 text-xs text-center">
                      Necesitás {POINTS_PER_500 - points} puntos más para canjear.
                    </p>
                  )}
                </div>

                {/* Reorder last */}
                {currentUser.orders && currentUser.orders.length > 0 && (
                  <div className="bg-dark-700 border border-white/10 rounded-2xl p-4">
                    <p className="text-white/40 text-xs font-medium mb-3">Último pedido</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white text-sm">
                          {currentUser.orders[0].items?.length ?? '?'} productos
                        </p>
                        <p className="text-white/40 text-xs">
                          Bs. {currentUser.orders[0].total?.toLocaleString('es-BO')}
                        </p>
                      </div>
                      <button onClick={() => handleReorder(currentUser.orders[0])}
                        className="flex items-center gap-1.5 bg-primary-600/20 border border-primary-500/30 text-primary-300 text-xs font-bold px-3 py-2 rounded-xl hover:bg-primary-600/40 transition-all duration-200">
                        <RefreshCw size={12} />
                        Volver a comprar
                      </button>
                    </div>
                  </div>
                )}

                {/* Logout */}
                <button onClick={() => { logout(); onClose() }}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-rose-500/30 text-rose-400 text-sm font-semibold hover:bg-rose-500/10 transition-all duration-200">
                  <LogOut size={15} />
                  Cerrar sesión
                </button>
              </div>
            )}

            {tab === 'orders' && (
              <div className="p-5 flex flex-col gap-3">
                {(!currentUser.orders || currentUser.orders.length === 0) ? (
                  <div className="text-center py-10 text-white/30">
                    <ShoppingBag size={40} strokeWidth={1} className="mx-auto mb-3" />
                    <p className="text-sm font-medium">Aún no tenés pedidos</p>
                    <p className="text-xs mt-1">Tus compras aparecerán aquí</p>
                  </div>
                ) : (
                  currentUser.orders.map(order => (
                    <div key={order.id} className="bg-dark-700 border border-white/10 rounded-2xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-white font-semibold text-sm">
                            {order.items?.length ?? 1} producto{(order.items?.length ?? 1) !== 1 ? 's' : ''}
                          </p>
                          <p className="text-white/30 text-[11px]">
                            {new Date(order.date).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <span className="text-primary-400 font-black text-sm">
                          Bs. {order.total?.toLocaleString('es-BO')}
                        </span>
                      </div>
                      {order.items?.slice(0, 2).map((item, i) => (
                        <p key={i} className="text-white/40 text-[11px] truncate">
                          • {item.name} ×{item.qty}
                        </p>
                      ))}
                      {(order.items?.length ?? 0) > 2 && (
                        <p className="text-white/25 text-[11px]">+{order.items.length - 2} más</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
