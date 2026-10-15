import { useState } from 'react'
import { X, Package, Users, BarChart2, ShieldCheck, Eye, EyeOff, LogOut, Check, Edit2, RotateCcw, Plus, Trash2 } from 'lucide-react'
import { useAdmin, loadSalesLog, loadAgeVerifications, getMergedProducts } from '../context/AdminContext'
import { useAuth } from '../context/AuthContext'
import { products as BASE_PRODUCTS, categories } from '../data/products'

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
  const allProducts = getMergedProducts()
  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div>
      <input type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Buscar producto..." className="input-field mb-4" />
      <div className="space-y-2">
        {filtered.map(p => {
          const info = stockOverrides[p.id] || {}
          const isDisabled = info.disabled || info.stock === 0
          return (
            <div key={p.id} className={`flex items-center gap-3 bg-dark-700 border rounded-xl px-4 py-3 ${isDisabled ? 'border-rose-500/20' : 'border-white/10'}`}>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">{p.name}</p>
                <p className="text-white/40 text-xs">{p.brand} · {p.price ? `Bs. ${p.price}` : 'Consultar'}</p>
              </div>
              <input type="number" min="0" defaultValue={info.stock ?? ''}
                placeholder="Stock"
                onBlur={e => { const val = parseInt(e.target.value); if (!isNaN(val)) setStock(p.id, val) }}
                className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-sm text-center outline-none focus:border-primary-500" />
              <button onClick={() => setProductDisabled(p.id, !isDisabled)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isDisabled ? 'bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500/30'
                             : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                }`}>
                {isDisabled ? 'Agotado' : 'En stock'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Product Editor ─────────────────────────────────────────────────────────────
const BADGE_OPTIONS = ['', 'oferta', 'mega', 'nuevo', 'limited']

function ProductEditorRow({ p, onSave, onReset, isEdited }) {
  const [open,   setOpen]   = useState(false)
  const [draft,  setDraft]  = useState({ ...p })
  const [saved,  setSaved]  = useState(false)

  const field = (key, label, type = 'text', options = null) => (
    <div>
      <label className="text-white/40 text-xs mb-1 block">{label}</label>
      {options ? (
        <select value={draft[key] ?? ''} onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))}
          className="input-field py-2 text-xs">
          {options.map(o => <option key={o} value={o}>{o || '(ninguno)'}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea value={draft[key] ?? ''} onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))}
          rows={2} className="input-field text-xs resize-none" />
      ) : (
        <input type={type} value={draft[key] ?? ''} onChange={e => {
            const v = type === 'number' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value
            setDraft(d => ({ ...d, [key]: v }))
          }}
          className="input-field py-2 text-xs" />
      )}
    </div>
  )

  const handleSave = () => {
    onSave(p.id, draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
    setOpen(false)
  }

  return (
    <div className={`border rounded-xl overflow-hidden ${isEdited ? 'border-primary-500/30' : 'border-white/8'}`}>
      <div className="flex items-center gap-3 px-4 py-3 bg-dark-700">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm truncate">{p.name}</p>
          <p className="text-white/35 text-xs">{p.brand} · {p.price ? `Bs. ${p.price}` : 'Consultar'}{isEdited ? ' · ✏️ editado' : ''}</p>
        </div>
        <div className="flex gap-2">
          {isEdited && (
            <button onClick={() => { onReset(p.id); setDraft({ ...BASE_PRODUCTS.find(b => b.id === p.id) || p }) }}
              className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/30 hover:text-amber-400 transition-colors" title="Restaurar original">
              <RotateCcw size={12} />
            </button>
          )}
          <button onClick={() => setOpen(v => !v)}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${open ? 'bg-primary-600 text-white' : 'bg-white/5 text-white/40 hover:text-white'}`}>
            <Edit2 size={12} />
          </button>
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 pt-2 bg-dark-800/60 border-t border-white/8 grid sm:grid-cols-2 gap-3">
          {field('name',     'Nombre')}
          {field('brand',    'Marca')}
          {field('price',    'Precio (Bs.)', 'number')}
          {field('puffs',    'Puffs')}
          {field('nicotina', 'Nicotina')}
          {field('tipo',     'Tipo')}
          {field('badge',    'Badge', 'text', BADGE_OPTIONS)}
          {field('badgeText','Texto badge')}
          {field('promoTag', 'PromoTag')}
          <div className="sm:col-span-2">
            {field('desc', 'Descripción', 'textarea')}
          </div>
          <div className="sm:col-span-2">
            <label className="text-white/40 text-xs mb-1 block">Sabores (uno por línea)</label>
            <textarea
              value={Array.isArray(draft.flavors) ? draft.flavors.join('\n') : (draft.flavors || '')}
              onChange={e => setDraft(d => ({ ...d, flavors: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) }))}
              rows={4} className="input-field text-xs resize-none" />
          </div>
          <div className="sm:col-span-2 flex gap-2 pt-1">
            <button onClick={handleSave}
              className="btn-primary px-4 py-2 text-xs rounded-xl flex items-center gap-1.5">
              {saved ? <Check size={13} /> : <Edit2 size={13} />}
              {saved ? 'Guardado' : 'Guardar cambios'}
            </button>
            <button onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 text-xs hover:text-white transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ProductEditor() {
  const { editProduct, resetProductEdits, productEdits, addCustomProduct, deleteCustomProduct, customProducts } = useAdmin()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newDraft, setNewDraft] = useState({ name: '', brand: '', category: 'tipoC', price: '', puffs: '', nicotina: '5%', tipo: '', desc: '', badge: 'nuevo', badgeText: 'NUEVO', flavors: '', promoTag: '' })

  const allProducts = getMergedProducts()
  const filtered = allProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === 'all' || p.category === catFilter
    return matchSearch && matchCat
  })

  const handleAddCustom = () => {
    if (!newDraft.name || !newDraft.brand) return
    addCustomProduct({
      ...newDraft,
      price: newDraft.price ? Number(newDraft.price) : null,
      flavors: newDraft.flavors.split('\n').map(s => s.trim()).filter(Boolean),
    })
    setNewDraft({ name: '', brand: '', category: 'tipoC', price: '', puffs: '', nicotina: '5%', tipo: '', desc: '', badge: 'nuevo', badgeText: 'NUEVO', flavors: '', promoTag: '' })
    setShowAddForm(false)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar..." className="input-field flex-1 min-w-[150px] py-2 text-xs" />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="input-field py-2 text-xs w-36">
          <option value="all">Todas</option>
          <option value="desechable">Desechables</option>
          <option value="tipoC">Tipo C</option>
          <option value="lego">Lego</option>
          <option value="accesorio">Accesorios</option>
        </select>
        <button onClick={() => setShowAddForm(v => !v)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary-600/20 border border-primary-500/30 text-primary-300 text-xs font-bold hover:bg-primary-600/30 transition-all">
          <Plus size={13} />Nuevo
        </button>
      </div>

      {/* Add custom product form */}
      {showAddForm && (
        <div className="bg-dark-700 border border-primary-500/20 rounded-2xl p-4 grid sm:grid-cols-2 gap-3">
          <h4 className="sm:col-span-2 font-bold text-white text-sm">Agregar producto</h4>
          {[
            ['name','Nombre'],['brand','Marca'],['puffs','Puffs'],['nicotina','Nicotina'],
            ['tipo','Tipo'],['promoTag','PromoTag'],
          ].map(([k, l]) => (
            <div key={k}>
              <label className="text-white/40 text-xs mb-1 block">{l}</label>
              <input type="text" value={newDraft[k]} onChange={e => setNewDraft(d => ({ ...d, [k]: e.target.value }))}
                className="input-field py-2 text-xs" />
            </div>
          ))}
          <div>
            <label className="text-white/40 text-xs mb-1 block">Precio (Bs.)</label>
            <input type="number" value={newDraft.price} onChange={e => setNewDraft(d => ({ ...d, price: e.target.value }))}
              className="input-field py-2 text-xs" />
          </div>
          <div>
            <label className="text-white/40 text-xs mb-1 block">Categoría</label>
            <select value={newDraft.category} onChange={e => setNewDraft(d => ({ ...d, category: e.target.value }))}
              className="input-field py-2 text-xs">
              <option value="desechable">Desechable</option>
              <option value="tipoC">Tipo C</option>
              <option value="lego">Lego</option>
              <option value="accesorio">Accesorio</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-white/40 text-xs mb-1 block">Descripción</label>
            <textarea value={newDraft.desc} onChange={e => setNewDraft(d => ({ ...d, desc: e.target.value }))}
              rows={2} className="input-field text-xs resize-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-white/40 text-xs mb-1 block">Sabores (uno por línea)</label>
            <textarea value={newDraft.flavors} onChange={e => setNewDraft(d => ({ ...d, flavors: e.target.value }))}
              rows={3} className="input-field text-xs resize-none" />
          </div>
          <div className="sm:col-span-2 flex gap-2">
            <button onClick={handleAddCustom} className="btn-primary px-4 py-2 text-xs rounded-xl flex items-center gap-1.5">
              <Plus size={13} />Agregar
            </button>
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 text-xs">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Product list */}
      <div className="space-y-2">
        {filtered.map(p => {
          const isCustom  = p.isCustom
          const isEdited  = !isCustom && !!productEdits[p.id]
          return (
            <div key={p.id} className="relative">
              {isCustom ? (
                <div className={`border rounded-xl overflow-hidden border-emerald-500/20`}>
                  <div className="flex items-center gap-3 px-4 py-3 bg-dark-700">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm truncate">{p.name} <span className="text-emerald-400 text-[10px] font-black ml-1">CUSTOM</span></p>
                      <p className="text-white/35 text-xs">{p.brand} · {p.price ? `Bs. ${p.price}` : 'Consultar'}</p>
                    </div>
                    <button onClick={() => deleteCustomProduct(p.id)}
                      className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 hover:bg-rose-500/20 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <ProductEditorRow
                  p={p}
                  isEdited={isEdited}
                  onSave={editProduct}
                  onReset={resetProductEdits}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Clients Manager ───────────────────────────────────────────────────────────
function ClientsManager() {
  const { getAllUsers } = useAuth()
  const [users, setUsers] = useState(() => getAllUsers())
  const [couponEmails, setCouponEmails] = useState(
    () => JSON.parse(localStorage.getItem('bbv_coupon_emails') || '["ivonne@demo.com"]')
  )
  const toggleCoupon = (email) => {
    const list = couponEmails.includes(email) ? couponEmails.filter(e => e !== email) : [...couponEmails, email]
    setCouponEmails(list)
    localStorage.setItem('bbv_coupon_emails', JSON.stringify(list))
  }
  return (
    <div className="space-y-3">
      <p className="text-white/40 text-xs">
        Marca con ✓ los clientes habilitados para el cupón <strong className="text-white/60">IvonneSolidario</strong> (5%).
      </p>
      {users.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-8">No hay clientes registrados aún.</p>
      ) : (
        users.map(u => (
          <div key={u.id} className="flex items-center gap-3 bg-dark-700 border border-white/10 rounded-xl px-4 py-3">
            <div className="w-8 h-8 rounded-xl bg-primary-600/20 flex items-center justify-center text-primary-400 font-black text-sm shrink-0">
              {u.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm">{u.name}</p>
              <p className="text-white/40 text-xs">{u.email} · ⭐ {u.points ?? 0} pts</p>
            </div>
            <button onClick={() => toggleCoupon(u.email)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                couponEmails.includes(u.email) ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/60'
              }`}>
              {couponEmails.includes(u.email) ? <Check size={11} /> : null} Cupón
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
  if (!sales.length) return <p className="text-white/30 text-sm text-center py-8">No hay ventas registradas aún.</p>
  return (
    <div className="space-y-2">
      {sales.map((sale, i) => (
        <div key={i} className="bg-dark-700 border border-white/10 rounded-xl px-4 py-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white/40 text-xs">{new Date(sale.date).toLocaleString('es-BO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-primary-400 font-black text-sm">Bs. {sale.total?.toLocaleString('es-BO')}</span>
          </div>
          <p className="text-white/60 text-xs">{sale.user || 'Anónimo'}</p>
          {sale.coupon && <span className="text-emerald-400 text-[10px]">Cupón: {sale.coupon}</span>}
        </div>
      ))}
    </div>
  )
}

function AgeLog() {
  const verifs = loadAgeVerifications()
  if (!verifs.length) return <p className="text-white/30 text-sm text-center py-8">No hay verificaciones.</p>
  return (
    <div className="space-y-2">
      {verifs.map((v, i) => (
        <div key={i} className={`flex items-center gap-3 bg-dark-700 border rounded-xl px-4 py-3 ${v.passed ? 'border-white/10' : 'border-rose-500/20'}`}>
          <span className={v.passed ? 'text-emerald-400' : 'text-rose-400'}>{v.passed ? '✓' : '✗'}</span>
          <span className="text-white/60 text-sm flex-1">Edad: {v.age} años</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${v.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {v.passed ? 'Aprobado' : 'Bloqueado'}
          </span>
          <span className="text-white/25 text-xs">{new Date(v.date).toLocaleString('es-BO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      ))}
    </div>
  )
}

// ── Main AdminPanel ───────────────────────────────────────────────────────────
export default function AdminPanel({ onClose }) {
  const { adminUser, adminLogout } = useAdmin()
  const [tab, setTab] = useState('products')

  if (!adminUser) return <AdminLogin onClose={onClose} />

  const tabs = [
    { id: 'products', label: 'Editar productos', icon: Edit2 },
    { id: 'stock',    label: 'Stock',             icon: Package },
    { id: 'clients',  label: 'Clientes',          icon: Users },
    { id: 'sales',    label: 'Ventas',            icon: BarChart2 },
    { id: 'age',      label: 'Verificaciones',    icon: ShieldCheck },
  ]

  return (
    <div className="fixed inset-0 bg-dark-900 z-[300] flex flex-col overflow-hidden animate-fade-up">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-dark-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center">
            <ShieldCheck size={16} className="text-white" />
          </div>
          <span className="font-black text-white">Panel Admin</span>
          <span className="text-white/30 text-xs ml-1">· {adminUser.user}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { adminLogout(); onClose() }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-all">
            <LogOut size={12} />Salir
          </button>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-dark-700 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="flex gap-1 px-6 py-3 border-b border-white/10 bg-dark-800 shrink-0 overflow-x-auto scrollbar-hide">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              tab === t.id ? 'bg-primary-600 text-white' : 'bg-dark-700 border border-white/10 text-white/40 hover:text-white/70'
            }`}>
            <t.icon size={13} />{t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {tab === 'products' && <ProductEditor />}
        {tab === 'stock'    && <StockManager />}
        {tab === 'clients'  && <ClientsManager />}
        {tab === 'sales'    && <SalesLog />}
        {tab === 'age'      && <AgeLog />}
      </div>

      <div className="px-6 py-3 border-t border-white/5 shrink-0">
        <p className="text-white/20 text-[10px] text-center">
          Acceso: URL <code className="text-primary-400/50">#admin</code> · Usuario: ValeValda
        </p>
      </div>
    </div>
  )
}
