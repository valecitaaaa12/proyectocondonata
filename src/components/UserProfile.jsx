import { useState } from 'react'
import { X, Star, ShoppingBag, Gift, RefreshCw, LogOut, Heart, Trophy, Clock } from 'lucide-react'
import { useAuth, POINTS_PER_500, POINTS_VALUE_BS, BADGES, getUserBadge } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { getMergedProducts } from '../context/AdminContext'

function BadgeCard({ badge }) {
  if (!badge) return null
  return (
    <div className={`flex items-center gap-2.5 ${badge.bg} border ${badge.border} rounded-xl px-3 py-2`}>
      <span className="text-xl">{badge.emoji}</span>
      <div>
        <p className={`font-black text-xs ${badge.color}`}>Nivel {badge.label}</p>
        <p className="text-white/40 text-[10px]">{badge.benefit}</p>
      </div>
    </div>
  )
}

export default function UserProfile({ onClose }) {
  const { currentUser, logout, redeemPoints, toggleFavorite, isFavorite } = useAuth()
  const { setIsOpen, setPointsRedeemed } = useCart()
  const [tab, setTab] = useState('overview')

  if (!currentUser) return null

  const points = currentUser.points || 0
  const orderCount = currentUser.orderCount || (currentUser.orders?.length || 0)
  const canRedeem = points >= POINTS_PER_500
  const badge = getUserBadge(orderCount)
  const nextBadge = BADGES.find(b => b.minOrders > orderCount)

  // Points expiry
  const pointsExpiry = currentUser.pointsEarnedAt
    ? new Date(new Date(currentUser.pointsEarnedAt).getTime() + 30 * 24 * 3600000)
    : null
  const daysLeft = pointsExpiry ? Math.max(0, Math.ceil((pointsExpiry - Date.now()) / (1000 * 60 * 60 * 24))) : null

  const favProducts = getMergedProducts().filter(p => (currentUser.favorites || []).includes(p.id))

  const handleRedeem = () => {
    if (!canRedeem) return
    const blocks = Math.floor(points / POINTS_PER_500)
    const bsDiscount = blocks * POINTS_VALUE_BS
    redeemPoints(blocks * POINTS_PER_500)
    setPointsRedeemed(bsDiscount)
    onClose()
    setIsOpen(true)
  }

  const tabs = [
    { id: 'overview',  label: 'Mi cuenta' },
    { id: 'favorites', label: `♥ Favoritos (${favProducts.length})` },
    { id: 'orders',    label: 'Pedidos' },
  ]

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]" />
      <div className="fixed inset-0 z-[201] flex items-center justify-center px-4 pointer-events-none">
        <div className="bg-dark-800 border border-white/10 rounded-3xl w-full max-w-sm shadow-2xl shadow-black/60 pointer-events-auto animate-fade-up overflow-hidden max-h-[90vh] flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
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

          {/* Badge bar */}
          {badge && (
            <div className="px-4 pt-3 shrink-0">
              <BadgeCard badge={badge} />
            </div>
          )}
          {!badge && nextBadge && (
            <div className="px-4 pt-3 shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
                <Trophy size={13} className="text-white/30" />
                <p className="text-white/30 text-[10px]">
                  Te faltan <strong className="text-white/50">{nextBadge.minOrders - orderCount} compras</strong> para alcanzar nivel {nextBadge.label} {nextBadge.emoji}
                </p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 p-3 border-b border-white/10 shrink-0">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 ${
                  tab === t.id ? 'bg-primary-600 text-white' : 'text-white/40 hover:text-white/70'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {tab === 'overview' && (
              <div className="p-5 flex flex-col gap-4">
                {/* Points */}
                <div className="bg-gradient-to-br from-primary-600/20 to-purple-600/20 border border-primary-500/30 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Star size={15} className="text-amber-400 fill-amber-400" />
                      <span className="font-bold text-white text-sm">Mis puntos</span>
                    </div>
                    <span className="text-primary-300 font-black text-2xl">{points}</span>
                  </div>
                  {daysLeft !== null && points > 0 && (
                    <div className={`flex items-center gap-1.5 mb-2 text-[10px] font-medium ${daysLeft <= 7 ? 'text-rose-400' : 'text-white/40'}`}>
                      <Clock size={10} />
                      {daysLeft === 0 ? 'Tus puntos vencen hoy' : `Tus puntos vencen en ${daysLeft} día${daysLeft !== 1 ? 's' : ''}`}
                    </div>
                  )}
                  <div className="bg-dark-700/50 rounded-xl p-2.5 text-[10px] text-white/40 mb-3">
                    <p>• 500 Bs = 10 puntos · 10 puntos = <strong className="text-primary-400">5 Bs de descuento</strong></p>
                    <p className="mt-0.5 text-white/25">Los puntos vencen a los 30 días de ganados.</p>
                  </div>
                  {canRedeem ? (
                    <button onClick={handleRedeem}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
                      <Gift size={14} />
                      Canjear — {Math.floor(points / POINTS_PER_500) * POINTS_VALUE_BS} Bs de descuento
                    </button>
                  ) : (
                    <p className="text-white/25 text-xs text-center">
                      Te faltan {POINTS_PER_500 - points} puntos para canjear
                    </p>
                  )}
                </div>

                {/* Last order */}
                {currentUser.orders && currentUser.orders.length > 0 && (
                  <div className="bg-dark-700 border border-white/10 rounded-2xl p-4">
                    <p className="text-white/40 text-xs font-medium mb-3">Último pedido</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white text-sm">
                          {currentUser.orders[0].items?.length ?? '?'} productos · Bs. {currentUser.orders[0].total?.toLocaleString('es-BO')}
                        </p>
                      </div>
                      <button onClick={() => { onClose(); setIsOpen(true) }}
                        className="flex items-center gap-1.5 bg-primary-600/20 border border-primary-500/30 text-primary-300 text-xs font-bold px-3 py-2 rounded-xl hover:bg-primary-600/40 transition-all">
                        <RefreshCw size={12} />
                        Volver a comprar
                      </button>
                    </div>
                  </div>
                )}

                <button onClick={() => { logout(); onClose() }}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-rose-500/30 text-rose-400 text-sm font-semibold hover:bg-rose-500/10 transition-all">
                  <LogOut size={15} />
                  Cerrar sesión
                </button>
              </div>
            )}

            {tab === 'favorites' && (
              <div className="p-4 flex flex-col gap-3">
                {favProducts.length === 0 ? (
                  <div className="text-center py-10 text-white/30">
                    <Heart size={40} strokeWidth={1} className="mx-auto mb-3" />
                    <p className="text-sm font-medium">No tenés favoritos aún</p>
                    <p className="text-xs mt-1">Tocá el ❤ en cualquier producto</p>
                  </div>
                ) : (
                  favProducts.map(p => (
                    <div key={p.id} className="flex items-center gap-3 bg-dark-700 border border-white/10 rounded-xl px-3 py-2.5">
                      <span className="text-2xl shrink-0">{p.emoji || p.name?.charAt(0) || '🛍️'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-xs truncate">{p.name}</p>
                        <p className="text-primary-400 font-bold text-xs">Bs. {p.price ?? 'Consultar'}</p>
                      </div>
                      <button onClick={() => toggleFavorite(p.id)}
                        className="text-rose-400 hover:text-white/30 transition-colors">
                        <Heart size={14} className="fill-rose-400" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'orders' && (
              <div className="p-4 flex flex-col gap-3">
                {(!currentUser.orders || currentUser.orders.length === 0) ? (
                  <div className="text-center py-10 text-white/30">
                    <ShoppingBag size={40} strokeWidth={1} className="mx-auto mb-3" />
                    <p className="text-sm font-medium">Aún no tenés pedidos</p>
                  </div>
                ) : (
                  currentUser.orders.map(order => (
                    <div key={order.id} className="bg-dark-700 border border-white/10 rounded-2xl p-4">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-white font-semibold text-sm">
                          {order.items?.length ?? 1} producto{(order.items?.length ?? 1) !== 1 ? 's' : ''}
                        </p>
                        <span className="text-primary-400 font-black text-sm">
                          Bs. {order.total?.toLocaleString('es-BO')}
                        </span>
                      </div>
                      <p className="text-white/30 text-[11px]">
                        {new Date(order.date).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                      {order.items?.slice(0, 2).map((item, i) => (
                        <p key={i} className="text-white/40 text-[11px] truncate mt-1">• {item.name} ×{item.qty}</p>
                      ))}
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
