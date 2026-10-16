import { useState, useMemo } from 'react'
import { Send, Copy, Check, RefreshCw, ExternalLink, Users, MessageCircle } from 'lucide-react'
import { getMergedProducts } from '../context/AdminContext'
import { getMondayDeal, getMondayWindow, getSeasonalPromo, getSeasonalProducts } from './PromoEngine'

// Enlace por defecto del grupo de WhatsApp (editable desde el panel)
const DEFAULT_GROUP_LINK = 'https://chat.whatsapp.com/DTh6smD7UFA2RFy63acGys?mode=gi_t'
const SITE_URL = 'https://bad-bunny-vape-bolivia.vercel.app'
const MAX_OFERTAS = 8
const MAX_NUEVOS = 6

// ── Construye el mensaje de WhatsApp con las promos activas ────────────────────
function buildPromoMessage() {
  const all = getMergedProducts()
  const now = new Date()
  const L = []

  L.push('🔥 *BAD BUNNY VAPES — OFERTAS* 🔥')
  L.push(`📅 ${now.toLocaleDateString('es-BO', { weekday: 'long', day: 'numeric', month: 'long' })}`)
  L.push('')

  // 1) Oferta del Lunes (producto rotativo -10 Bs)
  try {
    const monday = getMondayDeal()
    const { isActive } = getMondayWindow()
    if (monday && monday.price) {
      L.push(`⚡ *OFERTA DEL LUNES${isActive ? ' — ¡AHORA ACTIVA!' : ''}*`)
      L.push(`Cada lunes 21:30 a 22:30 h · *10 Bs de descuento*`)
      L.push(`• ${monday.name} — ~~Bs. ${monday.price}~~ → *Bs. ${monday.price - 10}*`)
      L.push('')
    }
  } catch { /* sin promo de lunes */ }

  // 2) Promo de temporada (si está activa)
  try {
    const seasonal = getSeasonalPromo()
    if (seasonal) {
      L.push(`${seasonal.emoji || '🎉'} *PROMO ${seasonal.name.toUpperCase()}* 🎉`)
      L.push(`*15 Bs de descuento* en productos seleccionados`)
      getSeasonalProducts().slice(0, 5).forEach(p => {
        if (p.price) L.push(`• ${p.name} — ~~Bs. ${p.price}~~ → *Bs. ${p.price - 15}*`)
      })
      L.push('')
    }
  } catch { /* sin promo de temporada */ }

  // 3) Ofertas destacadas del catálogo (badge oferta/mega o con oldPrice)
  const ofertas = all.filter(p =>
    p.price && !p.isNewProduct &&
    (p.badge === 'oferta' || p.badge === 'mega' || (p.oldPrice && p.oldPrice > p.price))
  ).slice(0, MAX_OFERTAS)
  if (ofertas.length) {
    L.push('💎 *OFERTAS DESTACADAS*')
    ofertas.forEach(p => {
      const tag = p.promoTag ? `  ${p.promoTag}` : ''
      const old = p.oldPrice ? ` ~~Bs. ${p.oldPrice}~~ →` : ''
      L.push(`• ${p.name} —${old} *Bs. ${p.price}*${tag}`)
    })
    L.push('')
  }

  // 4) Nuevos ingresos
  const nuevos = all.filter(p => p.isNewProduct || p.badge === 'nuevo').slice(0, MAX_NUEVOS)
  if (nuevos.length) {
    L.push('🆕 *NUEVOS INGRESOS*')
    nuevos.forEach(p => {
      L.push(p.price ? `• ${p.name} — *Bs. ${p.price}*` : `• ${p.name}`)
    })
    L.push('')
  }

  L.push(`🛒 *Comprá acá:* ${SITE_URL}`)
  L.push('🛵 Envíos en Sucre · Abierto 24hs')
  L.push('💬 Cualquier consulta, respondo por privado 🔥')

  return L.join('\n')
}

// ── Componente ────────────────────────────────────────────────────────────────
export default function PromoNotifier() {
  const [msg, setMsg] = useState(() => buildPromoMessage())
  const [copied, setCopied] = useState(false)
  const [sent, setSent] = useState(false)
  const [groupLink, setGroupLink] = useState(() => localStorage.getItem('bbv_wa_group_link') || DEFAULT_GROUP_LINK)
  const [editingLink, setEditingLink] = useState(false)

  // Resumen de qué detectó (para el preview visual)
  const detected = useMemo(() => {
    const all = getMergedProducts()
    const { isActive } = getMondayWindow()
    return {
      lunes: !!getMondayDeal()?.price,
      lunesActiva: isActive,
      temporada: getSeasonalPromo(),
      ofertas: all.filter(p => p.price && !p.isNewProduct && (p.badge === 'oferta' || p.badge === 'mega' || (p.oldPrice && p.oldPrice > p.price))).length,
      nuevos: all.filter(p => p.isNewProduct || p.badge === 'nuevo').length,
    }
  }, [msg])

  const regenerate = () => { setMsg(buildPromoMessage()); setSent(false) }

  const sendToGroup = () => {
    // wa.me/?text= abre WhatsApp con el texto listo: elegís el grupo y listo.
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  const copyMsg = async () => {
    try { await navigator.clipboard.writeText(msg) } catch {
      const ta = document.createElement('textarea'); ta.value = msg; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove()
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const saveLink = (v) => {
    const clean = v.trim() || DEFAULT_GROUP_LINK
    setGroupLink(clean)
    localStorage.setItem('bbv_wa_group_link', clean)
    setEditingLink(false)
  }

  return (
    <div className="space-y-4">
      {/* Detección de promos activas */}
      <div className="bg-dark-700 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <MessageCircle size={14} className="text-emerald-400" />
            Detección automática
          </h4>
          <button onClick={regenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 text-xs hover:text-white transition-colors">
            <RefreshCw size={11} />Regenerar
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { on: detected.lunes, label: `Oferta del Lunes${detected.lunesActiva ? ' · ACTIVA' : ''}` },
            { on: !!detected.temporada, label: detected.temporada ? `Temporada: ${detected.temporada.name}` : 'Temporada: inactiva' },
            { on: detected.ofertas > 0, label: `${detected.ofertas} ofertas destacadas` },
            { on: detected.nuevos > 0, label: `${detected.nuevos} nuevos ingresos` },
          ].map(c => (
            <span key={c.label}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${c.on ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-white/30'}`}>
              {c.on ? '✓ ' : '— '}{c.label}
            </span>
          ))}
        </div>
      </div>

      {/* Mensaje editable */}
      <div className="bg-dark-700 border border-white/10 rounded-2xl p-4">
        <label className="text-white/40 text-xs mb-2 block">Mensaje (podés editarlo antes de enviar)</label>
        <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={14}
          className="input-field text-xs leading-relaxed resize-y font-mono" />
        <div className="flex flex-wrap gap-2 mt-3">
          <button onClick={sendToGroup}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors">
            {sent ? <><Check size={13} />WhatsApp abierto — elegí el grupo</> : <><Send size={13} />Enviar al grupo</>}
          </button>
          <button onClick={copyMsg}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-xs font-bold hover:text-white transition-colors">
            {copied ? <><Check size={13} className="text-emerald-400" />Copiado</> : <><Copy size={13} />Copiar</>}
          </button>
        </div>
        <p className="text-white/25 text-[10px] mt-2">
          Se abre WhatsApp con el mensaje listo: solo elegís el grupo y tocás enviar. No se envía nada automáticamente.
        </p>
      </div>

      {/* Enlace al grupo */}
      <div className="bg-dark-700 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Users size={14} className="text-primary-400" />
          <span className="font-bold text-white text-sm">Tu grupo de WhatsApp</span>
        </div>
        {editingLink ? (
          <div className="flex gap-2">
            <input type="text" defaultValue={groupLink} id="wa-group-link" autoFocus
              onBlur={e => saveLink(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveLink(e.target.value); if (e.key === 'Escape') setEditingLink(false) }}
              className="input-field py-2 text-xs flex-1" />
            <button onClick={() => saveLink(document.getElementById('wa-group-link').value)}
              className="px-3 py-2 rounded-lg bg-primary-600 text-white text-xs font-bold">Guardar</button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xs flex-1 truncate">{groupLink}</span>
            <button onClick={() => setEditingLink(true)}
              className="text-[11px] text-primary-400 hover:text-primary-300 font-bold">Editar</button>
            <a href={groupLink} target="_blank" rel="noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 text-[11px] font-bold hover:text-white transition-colors">
              <ExternalLink size={11} />Abrir
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
