import { useState } from 'react'
import { Star, Camera, Users, Trophy, Check, Upload, X, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useScrollReveal } from '../hooks/useScrollReveal'

// ── Storage helpers ───────────────────────────────────────────────────────────
const loadReviews  = () => { try { return JSON.parse(localStorage.getItem('bbv_reviews')  || '[]') } catch { return [] } }
const saveReviews  = d => localStorage.setItem('bbv_reviews', JSON.stringify(d))
const loadEntries  = () => { try { return JSON.parse(localStorage.getItem('bbv_contest')  || '[]') } catch { return [] } }
const saveEntries  = d => localStorage.setItem('bbv_contest', JSON.stringify(d))
const loadWall     = () => { try { return JSON.parse(localStorage.getItem('bbv_wall')     || '[]') } catch { return [] } }
const saveWall     = d => localStorage.setItem('bbv_wall', JSON.stringify(d))

// ── Demo wall data (shown until real clients add themselves) ──────────────────
const DEMO_WALL = [
  { id: 'demo1', apodo: 'La Rochi',     sabor: 'Cherry Watermelon Mint', puffs: '30k+', color: '#f43f5e' },
  { id: 'demo2', apodo: 'El Nico',      sabor: 'Grape Ice',              puffs: '15k+', color: '#a855f7' },
  { id: 'demo3', apodo: 'Sofi V.',      sabor: 'Strawberry Kiwi',        puffs: '20k+', color: '#ec4899' },
  { id: 'demo4', apodo: 'Martín D.',    sabor: 'Cool Mint',              puffs: '50k+', color: '#34d399' },
  { id: 'demo5', apodo: 'Caro M.',      sabor: 'Blueberry Mint',         puffs: '10k+', color: '#818cf8' },
  { id: 'demo6', apodo: 'El Tato',      sabor: 'Blue Razz',              puffs: '25k+', color: '#60a5fa' },
]

// ── Tab button ────────────────────────────────────────────────────────────────
function TabBtn({ active, onClick, icon: Icon, label, badge }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border shrink-0 ${
        active
          ? 'bg-primary-600/20 border-primary-500/40 text-primary-300'
          : 'bg-white/5 border-white/10 text-white/45 hover:text-white/75 hover:bg-white/8'
      }`}>
      <Icon size={14} />
      {label}
      {badge && (
        <span className={`text-[9px] rounded-full px-1.5 py-0.5 ${active ? 'bg-primary-500/30 text-primary-300' : 'bg-white/10 text-white/30'}`}>
          {badge}
        </span>
      )}
    </button>
  )
}

// ── Stars input ───────────────────────────────────────────────────────────────
function StarsInput({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-125">
          <Star size={22}
            className={n <= (hover || value) ? 'text-amber-400 fill-amber-400' : 'text-white/20'} />
        </button>
      ))}
    </div>
  )
}

// ── Reviews tab ───────────────────────────────────────────────────────────────
function ReviewsTab() {
  const { currentUser, updateUser } = useAuth()
  const [reviews,   setReviews]   = useState(loadReviews)
  const [rating,    setRating]    = useState(0)
  const [text,      setText]      = useState('')
  const [hasPhoto,  setHasPhoto]  = useState(false)
  const [product,   setProduct]   = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error,     setError]     = useState('')

  const alreadyReviewed = currentUser && reviews.some(r => r.userEmail === currentUser.email)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!currentUser) { setError('Iniciá sesión para dejar una reseña.'); return }
    if (rating === 0) { setError('Seleccioná una calificación.'); return }
    if (!text.trim()) { setError('Escribí tu reseña.'); return }

    const review = {
      id: Date.now().toString(),
      userName: currentUser.name,
      userEmail: currentUser.email,
      rating, text: text.trim(), product: product.trim(),
      hasPhoto, date: new Date().toISOString(),
    }
    const updated = [review, ...reviews]
    saveReviews(updated)
    setReviews(updated)

    // Give 1 Bs discount = add 2 special points (2 pts = 1 Bs)
    // We store it as a direct wallet credit
    const credits = JSON.parse(localStorage.getItem(`bbv_credits_${currentUser.email}`) || '0')
    localStorage.setItem(`bbv_credits_${currentUser.email}`, String(credits + 1))

    setSubmitted(true)
    setText(''); setRating(0); setHasPhoto(false); setProduct('')
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Incentive bar */}
      <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl px-4 py-3 flex items-center gap-3">
        <Star size={18} className="text-amber-400 fill-amber-400 shrink-0" />
        <div>
          <p className="text-white font-bold text-sm">Ganás <span className="text-amber-400">1 Bs de descuento</span> por opinar</p>
          <p className="text-white/40 text-xs">Si adjuntás una foto, tu reseña se destaca en el muro.</p>
        </div>
      </div>

      {/* Form */}
      {!alreadyReviewed ? (
        <form onSubmit={handleSubmit} className="bg-dark-700 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
          <h4 className="font-bold text-white text-sm">Escribí tu opinión</h4>

          <div>
            <label className="text-white/40 text-xs mb-1.5 block">Calificación</label>
            <StarsInput value={rating} onChange={setRating} />
          </div>

          <div>
            <label className="text-white/40 text-xs mb-1.5 block">Producto (opcional)</label>
            <input type="text" value={product} onChange={e => setProduct(e.target.value)}
              placeholder="Ej: Waka Boost 30k" className="input-field" />
          </div>

          <div>
            <label className="text-white/40 text-xs mb-1.5 block">Tu reseña</label>
            <textarea value={text} onChange={e => setText(e.target.value)}
              rows={3} placeholder="Contanos qué te pareció el servicio y el producto..."
              className="input-field resize-none" required />
          </div>

          {/* Photo toggle */}
          <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-all duration-200 ${
            hasPhoto
              ? 'bg-primary-600/10 border-primary-500/30'
              : 'bg-white/5 border-white/10 hover:border-white/20'
          }`}>
            <input type="checkbox" className="sr-only" checked={hasPhoto} onChange={e => setHasPhoto(e.target.checked)} />
            <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${hasPhoto ? 'bg-primary-600 border-primary-600' : 'border-white/20'}`}>
              {hasPhoto && <Check size={12} className="text-white" />}
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium flex items-center gap-1.5">
                <Camera size={13} />
                Tengo foto del producto
              </p>
              <p className="text-white/30 text-xs">Envianos la foto por WhatsApp y destacamos tu reseña</p>
            </div>
          </label>

          {error && <p className="text-rose-400 text-xs font-medium">{error}</p>}

          {submitted ? (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold py-2 animate-[fadeIn_0.3s_ease]">
              <Check size={16} />¡Reseña enviada! Sumaste 1 Bs de descuento.
            </div>
          ) : (
            <button type="submit" className="btn-primary justify-center py-3">
              <Star size={14} />
              Enviar reseña
            </button>
          )}
        </form>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3">
          <Check size={18} className="text-emerald-400 shrink-0" />
          <p className="text-emerald-300 text-sm font-medium">Ya enviaste tu reseña. ¡Gracias!</p>
        </div>
      )}

      {/* Reviews list */}
      {reviews.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-white/60 text-xs uppercase tracking-wider">
            Últimas opiniones · {reviews.length}
          </h4>
          {reviews.slice(0, 5).map(r => (
            <div key={r.id} className="bg-dark-700 border border-white/8 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} size={12}
                        className={n <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-white/10'} />
                    ))}
                    {r.hasPhoto && (
                      <span className="ml-1.5 text-[9px] font-black bg-primary-600/20 text-primary-400 border border-primary-500/20 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <Camera size={8} /> Foto
                      </span>
                    )}
                  </div>
                  <p className="text-white font-semibold text-xs">{r.userName}</p>
                  {r.product && <p className="text-primary-400 text-[10px]">{r.product}</p>}
                </div>
                <span className="text-white/20 text-[10px] shrink-0">
                  {new Date(r.date).toLocaleDateString('es-BO', { day: '2-digit', month: 'short' })}
                </span>
              </div>
              <p className="text-white/55 text-xs leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Photo contest tab ─────────────────────────────────────────────────────────
function ContestTab() {
  const { currentUser } = useAuth()
  const [entries,   setEntries]   = useState(loadEntries)
  const [desc,      setDesc]      = useState('')
  const [type,      setType]      = useState('setup')  // 'setup' | 'nube'
  const [submitted, setSubmitted] = useState(false)
  const [error,     setError]     = useState('')

  const alreadyEntered = currentUser && entries.some(e => e.userEmail === currentUser.email)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!currentUser) { setError('Iniciá sesión para participar.'); return }

    const entry = {
      id: Date.now().toString(),
      userName: currentUser.name,
      userEmail: currentUser.email,
      type, desc: desc.trim(),
      date: new Date().toISOString(),
      votes: 0,
    }
    const updated = [entry, ...entries]
    saveEntries(updated)
    setEntries(updated)

    // Credit 1 Bs
    const credits = JSON.parse(localStorage.getItem(`bbv_credits_${currentUser.email}`) || '0')
    localStorage.setItem(`bbv_credits_${currentUser.email}`, String(credits + 1))

    setSubmitted(true)
    setDesc('')
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Rules */}
      <div className="bg-dark-700 border border-white/8 rounded-2xl p-4 grid sm:grid-cols-3 gap-3">
        {[
          { icon: Shield,  color: 'text-emerald-400', title: 'Solo +18',          desc: 'El concurso está abierto exclusivamente a clientes mayores de edad.' },
          { icon: Trophy,  color: 'text-amber-400',   title: 'Premio: 1 Bs',       desc: 'El ganador mensual recibe 1 Bs de descuento en su próximo pedido.' },
          { icon: Camera,  color: 'text-primary-400', title: 'Enviá por WhatsApp', desc: 'Mandá la foto al WhatsApp y acá dejás tu descripción para participar.' },
        ].map((r, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <r.icon size={16} className={`${r.color} shrink-0 mt-0.5`} />
            <div>
              <p className={`font-bold text-xs ${r.color}`}>{r.title}</p>
              <p className="text-white/40 text-[11px] leading-relaxed mt-0.5">{r.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      {!alreadyEntered ? (
        <form onSubmit={handleSubmit} className="bg-dark-700 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
          <h4 className="font-bold text-white text-sm">Participar en el concurso</h4>

          {/* Type */}
          <div className="flex gap-2">
            {[
              { v: 'setup', label: 'Mi setup' },
              { v: 'nube',  label: 'Mi nube' },
            ].map(opt => (
              <button key={opt.v} type="button"
                onClick={() => setType(opt.v)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm border transition-all ${
                  type === opt.v
                    ? 'bg-primary-600/20 border-primary-500/40 text-primary-300'
                    : 'bg-white/5 border-white/10 text-white/40 hover:text-white/65'
                }`}>
                {opt.v === 'setup' ? '📸 ' : '☁️ '}{opt.label}
              </button>
            ))}
          </div>

          <div>
            <label className="text-white/40 text-xs mb-1.5 block">Descripción de tu foto</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} required
              rows={3} placeholder="Describí tu foto. Después mandá la imagen por WhatsApp para confirmar tu participación."
              className="input-field resize-none" />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2 text-white/40 text-xs">
            <Upload size={13} className="shrink-0" />
            Después de enviar, mandá tu foto al <a href="https://wa.me/59178580928" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline ml-1">WhatsApp</a>
          </div>

          {error && <p className="text-rose-400 text-xs font-medium">{error}</p>}

          {submitted ? (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold py-2 animate-[fadeIn_0.3s_ease]">
              <Check size={16} />¡Inscripto! Sumaste 1 Bs de descuento. Mandá tu foto por WA.
            </div>
          ) : (
            <button type="submit" className="btn-primary justify-center py-3">
              <Camera size={14} />
              Participar
            </button>
          )}
        </form>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3">
          <Check size={18} className="text-emerald-400 shrink-0" />
          <p className="text-emerald-300 text-sm font-medium">¡Ya estás participando! Recordá mandar la foto por WhatsApp.</p>
        </div>
      )}

      {/* Entries list */}
      {entries.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-white/60 text-xs uppercase tracking-wider">Participantes · {entries.length}</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            {entries.slice(0, 6).map(e => (
              <div key={e.id} className="bg-dark-700 border border-white/8 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-xl bg-primary-600/20 flex items-center justify-center text-primary-400 font-black text-sm">
                    {e.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-xs">{e.userName}</p>
                    <p className="text-white/30 text-[10px]">{e.type === 'setup' ? '📸 Setup' : '☁️ Nube'}</p>
                  </div>
                </div>
                {e.desc && <p className="text-white/45 text-xs leading-relaxed">{e.desc}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Wall tab ──────────────────────────────────────────────────────────────────
function WallTab() {
  const { currentUser } = useAuth()
  const [wall,      setWall]      = useState(loadWall)
  const [apodo,     setApodo]     = useState('')
  const [sabor,     setSabor]     = useState('')
  const [consent,   setConsent]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error,     setError]     = useState('')

  const allWall    = [...DEMO_WALL, ...wall]
  const alreadyIn  = currentUser && wall.some(e => e.userEmail === currentUser.email)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!currentUser) { setError('Iniciá sesión para unirte al muro.'); return }
    if (!apodo.trim() || !sabor.trim()) { setError('Completá apodo y sabor favorito.'); return }
    if (!consent) { setError('Necesitamos tu permiso para mostrar tu perfil.'); return }

    const colors = ['#f43f5e','#a855f7','#ec4899','#34d399','#60a5fa','#facc15','#fb923c','#818cf8']
    const entry = {
      id: Date.now().toString(),
      apodo: apodo.trim(),
      sabor: sabor.trim(),
      puffs: '—',
      userEmail: currentUser.email,
      color: colors[Math.floor(Math.random() * colors.length)],
      date: new Date().toISOString(),
    }
    const updated = [entry, ...wall]
    saveWall(updated)
    setWall(updated)

    // Credit 1 Bs
    const credits = JSON.parse(localStorage.getItem(`bbv_credits_${currentUser.email}`) || '0')
    localStorage.setItem(`bbv_credits_${currentUser.email}`, String(credits + 1))

    setSubmitted(true)
    setApodo(''); setSabor(''); setConsent(false)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Info */}
      <div className="bg-dark-700 border border-white/8 rounded-2xl p-4 flex items-start gap-3">
        <Users size={18} className="text-primary-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-white text-sm">Muro de clientes frecuentes</p>
          <p className="text-white/45 text-xs leading-relaxed mt-1">
            Mostramos tu apodo y tu sabor favorito, con tu permiso. Ganás <span className="text-amber-400 font-bold">1 Bs de descuento</span> por sumarte.
          </p>
        </div>
      </div>

      {/* Wall grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {allWall.map(e => (
          <div key={e.id}
            className="bg-dark-700 rounded-2xl p-3.5 text-center hover:-translate-y-1 transition-all duration-300"
            style={{ border: `1px solid ${e.color}22` }}>
            <div className="w-10 h-10 rounded-2xl mx-auto mb-2 flex items-center justify-center font-black text-base"
              style={{ background: `${e.color}20`, color: e.color }}>
              {e.apodo.charAt(0)}
            </div>
            <p className="font-bold text-white text-xs truncate">{e.apodo}</p>
            <p className="text-[10px] leading-relaxed mt-1 truncate" style={{ color: e.color }}>
              {e.sabor}
            </p>
            {e.puffs && e.puffs !== '—' && (
              <p className="text-white/25 text-[9px] mt-0.5">{e.puffs}</p>
            )}
          </div>
        ))}
      </div>

      {/* Join form */}
      {!alreadyIn ? (
        <form onSubmit={handleSubmit} className="bg-dark-700 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
          <h4 className="font-bold text-white text-sm">Sumate al muro</h4>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-white/40 text-xs mb-1.5 block">Tu apodo</label>
              <input type="text" value={apodo} onChange={e => setApodo(e.target.value)}
                placeholder="Ej: La Sofi" className="input-field" required maxLength={20} />
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1.5 block">Tu sabor favorito</label>
              <input type="text" value={sabor} onChange={e => setSabor(e.target.value)}
                placeholder="Ej: Watermelon Ice" className="input-field" required maxLength={30} />
            </div>
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <div className={`w-5 h-5 mt-0.5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${consent ? 'bg-primary-600 border-primary-600' : 'border-white/20'}`}
              onClick={() => setConsent(v => !v)}>
              {consent && <Check size={12} className="text-white" />}
            </div>
            <span className="text-white/50 text-xs leading-relaxed">
              Autorizo a Bad Bunny Vape a mostrar mi apodo y sabor favorito en el sitio web de forma pública.
            </span>
          </label>

          {error && <p className="text-rose-400 text-xs font-medium">{error}</p>}

          {submitted ? (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold py-2 animate-[fadeIn_0.3s_ease]">
              <Check size={16} />¡Listo! Ya estás en el muro y sumaste 1 Bs de descuento.
            </div>
          ) : (
            <button type="submit" className="btn-primary justify-center py-3">
              <Users size={14} />
              Sumarme al muro
            </button>
          )}
        </form>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3">
          <Check size={18} className="text-emerald-400 shrink-0" />
          <p className="text-emerald-300 text-sm font-medium">¡Ya estás en el muro!</p>
        </div>
      )}
    </div>
  )
}

// ── Main CommunitySection ─────────────────────────────────────────────────────
export default function CommunitySection() {
  const [tab, setTab] = useState('reviews')
  const [ref, visible] = useScrollReveal()

  const reviews = loadReviews()
  const entries = loadEntries()
  const wall    = loadWall()

  return (
    <section id="comunidad" className="py-20 bg-dark-900 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>

          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="section-title">Nuestra <span>comunidad</span></h2>
            <p className="section-sub">Opiná, participá y aparecé. Cada acción suma descuentos reales.</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-8 pb-1">
            <TabBtn active={tab === 'reviews'} onClick={() => setTab('reviews')}
              icon={Star} label="Reseñas" badge={reviews.length || null} />
            <TabBtn active={tab === 'contest'} onClick={() => setTab('contest')}
              icon={Camera} label="Concurso de fotos" badge={entries.length || null} />
            <TabBtn active={tab === 'wall'} onClick={() => setTab('wall')}
              icon={Users} label="Clientes frecuentes" badge={DEMO_WALL.length + wall.length} />
          </div>

          {/* Panel */}
          <div className="animate-[fadeIn_0.3s_ease]" key={tab}>
            {tab === 'reviews' && <ReviewsTab />}
            {tab === 'contest' && <ContestTab />}
            {tab === 'wall'    && <WallTab />}
          </div>

        </div>
      </div>
    </section>
  )
}
