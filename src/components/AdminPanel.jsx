import { useState, useEffect } from 'react'
import { X, Package, Users, BarChart2, ShieldCheck, Eye, EyeOff, LogOut, Bell, ChevronDown, Check, Trash2 } from 'lucide-react'
import { useAdmin, loadSalesLog, loadAgeVerifications } from '../context/AdminContext'
import { useAuth } from '../context/AuthContext'
import { products } from '../data/products'

// ── Admin Login ───────────────────────────────────────────────────────────────
function AdminLogin({ onClose }) {
  const { adminLogin } = useAdmin()
  const [user, setUser]     = useState('')
  const [pass, setPass]     = useState('')
  const [show, setShow]     = useState(false)
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 400))
    const result = adminLogin(user, pass)
    setLoading(false)
    if (!result.ok) setError(result.error)
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-hero-gradient opacity-30" />
      <div className="relative bg-dark-800 border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-fade-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-primary-400" />
            <span className="font-black text-white">Panel Administrador</span>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <p className="text-white/40 text-xs mb-6">Acceso privado. No compartir este enlace.</p>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-white/40 text-xs font-medium mb-1.5 block">Usuario</label>
            <input type="text" value={user} onChange={e => setUser(e.target.value)}
              placeholder="ValeValda" className="input-field" autoComplete="username" required />
          </div>
          <div>
            <label className="text-white/40 text-xs font-medium mb-1.5 block">Contraseña</label>
            <div className="relative">
              <input type={show ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)}
                placeholder="••••••••" className="input-field pr-10" autoComplete="current-password" required />
              <button type="button" onClick={() => setShow(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          {error && <p className="text-rose-400 text-xs font-medium">{error}</p>}
          <button type="submit" disabled={loading}
            className="btn-primary w-full justify-center py-3.5 disabled:opacity-60">
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Stock Manager ─────────────────────────────────────────────────────────────
function StockManager() {
  const { stockOverrides, setStock, setProductDisabled } = useAdmin()
  const [search, setSearch] = useState('')

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar producto..."
        className="input-field mb-4"
      />
      <div className="space-y-2">
        {filtered.map(p => {
          const info = stockOverrides[p.id] || {}
          const isDisabled = info.disabled || info.stock === 0
          return (
            <div key={p.id}
              className={`flex items-center gap-3 bg-dark-700 border rounded-xl px-4 py-3 ${isDisabled ? 'border-rose-500/20' : 'border-white/10'}`}>
              <span className="text-xl shrink-0">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">{p.name}</p>
                <p className="text-white/40 text-xs">{p.brand} · Bs. {p.price ?? 'Consultar'}</p>
              </div>
              {/* Stock input */}
              <input
                type="number"
                min="0"
                defaultValue={info.stock ?? ''}
                placeholder="Stock"
                onBlur={e => {
                  const val = parseInt(e.target.value)
                  if (!isNaN(val)) setStock(p.id, val)
                }}
                className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-sm text-center outline-none focus:border-primary-500"
              />
              {/* Toggle agotado */}
              <button
                onClick={() => setProductDisabled(p.id, !isDisabled)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isDisabled
                    ? 'bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500/30'
                    : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                }`}
              >
                {isDisabled ? 'Agotado' : 'En stock'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Clients Manager ───────────────────────────────────────────────────────────
function ClientsManager() {
  const { getAllUsers, updateUser } = useAuth()
  const [users, setUsers] = useState(() => getAllUsers())
  const [couponEmails, setCouponEmails] = useState(
    () => JSON.parse(localStorage.getItem('bbv_coupon_emails') || '["ivonne@demo.com"]')
  )

  const refresh = () => setUsers(getAllUsers())

  const toggleCoupon = (email) => {
    const list = couponEmails.includes(email)
      ? couponEmails.filter(e => e !== email)
      : [...couponEmails, email]
    setCouponEmails(list)
    localStorage.setItem('bbv_coupon_emails', JSON.stringify(list))
  }

  return (
    <div className="space-y-3">
      <p className="text-white/40 text-xs">
        Marca con ✓ los clientes habilitados para el cupón <strong className="text-white/60">IvonneSolidario</strong> (5%). El cupón nunca se muestra públicamente.
      </p>
      {users.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-8">No hay clientes registrados aún.</p>
      ) : (
        users.map(u => (
          <div key={u.id}
            className="flex items-center gap-3 bg-dark-700 border border-white/10 rounded-xl px-4 py-3">
            <div className="w-8 h-8 rounded-xl bg-primary-600/20 flex items-center justify-center text-primary-400 font-black text-sm shrink-0">
              {u.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm">{u.name}</p>
              <p className="text-white/40 text-xs">{u.email} · ⭐ {u.points ?? 0} pts</p>
            </div>
            <button
              onClick={() => toggleCoupon(u.email)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                couponEmails.includes(u.email)
                  ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                  : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/60'
              }`}
            >
              {couponEmails.includes(u.email) ? <Check size={11} /> : null}
              Cupón
            </button>
          </div>
        ))
      )}
    </div>
  )
}

// ── Sales Log ─────────────────────────────────────────────────────────────────
function SalesLog() {
  const sales = loadSalesLog()

  if (sales.length === 0) {
    return <p className="text-white/30 text-sm text-center py-8">No hay ventas registradas aún.</p>
  }

  return (
    <div className="space-y-2">
      {sales.map((sale, i) => (
        <div key={i}
          className="bg-dark-700 border border-white/10 rounded-xl px-4 py-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white/40 text-xs">
              {new Date(sale.date).toLocaleString('es-BO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-primary-400 font-black text-sm">Bs. {sale.total?.toLocaleString('es-BO')}</span>
          </div>
          <p className="text-white/60 text-xs">{sale.user || 'Anónimo'}</p>
          {sale.coupon && (
            <span className="text-emerald-400 text-[10px]">Cupón: {sale.coupon}</span>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Age verifications log ─────────────────────────────────────────────────────
function AgeLog() {
  const verifs = loadAgeVerifications()
  if (verifs.length === 0) {
    return <p className="text-white/30 text-sm text-center py-8">No hay verificaciones registradas.</p>
  }
  return (
    <div className="space-y-2">
      {verifs.map((v, i) => (
        <div key={i}
          className={`flex items-center gap-3 bg-dark-700 border rounded-xl px-4 py-3 ${v.passed ? 'border-white/10' : 'border-rose-500/20'}`}>
          <span className={v.passed ? 'text-emerald-400' : 'text-rose-400'}>
            {v.passed ? '✓' : '✗'}
          </span>
          <span className="text-white/60 text-sm flex-1">Edad declarada: {v.age} años</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${v.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {v.passed ? 'Aprobado' : 'Bloqueado'}
          </span>
          <span className="text-white/25 text-xs">
            {new Date(v.date).toLocaleString('es-BO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Main AdminPanel ───────────────────────────────────────────────────────────
export default function AdminPanel({ onClose }) {
  const { adminUser, adminLogout } = useAdmin()
  const [tab, setTab] = useState('stock')

  if (!adminUser) {
    return <AdminLogin onClose={onClose} />
  }

  const tabs = [
    { id: 'stock',   label: 'Stock',    icon: Package },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'sales',   label: 'Ventas',   icon: BarChart2 },
    { id: 'age',     label: 'Verificaciones edad', icon: ShieldCheck },
  ]

  return (
    <div className="fixed inset-0 bg-dark-900 z-[300] flex flex-col overflow-hidden animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-dark-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center">
            <ShieldCheck size={16} className="text-white" />
          </div>
          <div>
            <span className="font-black text-white">Panel Admin</span>
            <span className="text-white/30 text-xs ml-2">· {adminUser.user}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { adminLogout(); onClose() }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-all">
            <LogOut size={12} />
            Salir
          </button>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl bg-dark-700 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 py-3 border-b border-white/10 bg-dark-800 shrink-0 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              tab === t.id
                ? 'bg-primary-600 text-white'
                : 'bg-dark-700 border border-white/10 text-white/40 hover:text-white/70'
            }`}>
            <t.icon size={13} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {tab === 'stock'   && <StockManager />}
        {tab === 'clients' && <ClientsManager />}
        {tab === 'sales'   && <SalesLog />}
        {tab === 'age'     && <AgeLog />}
      </div>

      {/* How to access note (only visible in admin) */}
      <div className="px-6 py-3 border-t border-white/5 shrink-0">
        <p className="text-white/20 text-[10px] text-center">
          Para acceder: navegar a <code className="text-primary-400/50">#admin</code> en la URL de la tienda · Usuario: ValeValda
        </p>
      </div>
    </div>
  )
}
