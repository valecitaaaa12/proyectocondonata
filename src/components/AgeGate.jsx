import { useState, useEffect } from 'react'
import { Wind, AlertTriangle, X } from 'lucide-react'

const SESSION_KEY = 'bbv_age_verified'

export default function AgeGate({ onVerified }) {
  const [blocked, setBlocked]   = useState(false)   // menor de edad
  const [shake,   setShake]     = useState(false)   // animación de rechazo

  // Si ya verificó en esta sesión, pasa directo
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'yes') {
      onVerified()
    }
  }, [onVerified])

  const handleYes = () => {
    sessionStorage.setItem(SESSION_KEY, 'yes')
    onVerified()
  }

  const handleNo = () => {
    setBlocked(true)
  }

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 600)
  }

  // ── PANTALLA BLOQUEADA (menor de edad) ──────────────────
  if (blocked) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-dark-900 px-6 text-center">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-rose-600/10 blur-3xl" />
        </div>

        <div className="relative max-w-md">
          <div className="w-20 h-20 rounded-full bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={36} className="text-rose-400" />
          </div>

          <h1 className="text-2xl font-black text-white mb-3">Acceso denegado</h1>
          <p className="text-white/50 text-sm leading-relaxed mb-6">
            Este sitio contiene productos con nicotina y alcohol destinados
            <strong className="text-white/80"> únicamente a mayores de 18 años</strong>.
            No podés acceder si sos menor de edad.
          </p>

          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-rose-300 text-xs leading-relaxed">
            🚫 El acceso a este sitio web está restringido por ley a personas mayores de 18 años.
          </div>
        </div>
      </div>
    )
  }

  // ── PANTALLA DE VERIFICACIÓN ─────────────────────────────
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-dark-900 px-6">
      {/* Fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-hero-gradient opacity-60" />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(236,72,153,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-primary-600/20 blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-purple-600/15 blur-3xl" />
      </div>

      <div className={`relative max-w-sm w-full ${shake ? 'animate-[wiggle_0.4s_ease]' : ''}`}>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center mb-4 shadow-2xl shadow-primary-500/40">
            <Wind size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Bad Bunny <span className="text-primary-500">Vape</span>
          </h1>
          <p className="text-white/40 text-xs mt-1 font-medium">Sucre, Bolivia · Abierto 24hs</p>
        </div>

        {/* Card */}
        <div className="bg-dark-800/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              ⚠️ Verificación de edad
            </span>
          </div>

          <h2 className="text-white font-black text-2xl text-center leading-tight mb-3">
            ¿Tenés<br />
            <span className="text-primary-400">18 años o más?</span>
          </h2>

          <p className="text-white/40 text-sm text-center leading-relaxed mb-8">
            Este sitio contiene productos con nicotina. El acceso está
            permitido solo para mayores de edad.
          </p>

          {/* Botones */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleYes}
              className="w-full btn-primary justify-center py-4 text-base font-black tracking-wide rounded-2xl"
            >
              ✅ Sí, tengo 18 años o más
            </button>

            <button
              onClick={handleNo}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-white/10 text-white/40 hover:border-rose-500/40 hover:text-rose-400 font-semibold text-sm transition-all duration-300"
            >
              <X size={16} />
              No, soy menor de edad
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-white/20 text-[11px] mt-5 leading-relaxed px-4">
          Al ingresar confirmás que sos mayor de 18 años y aceptás los
          términos de uso del sitio. La venta de productos con nicotina a
          menores de edad está prohibida por ley.
        </p>
      </div>
    </div>
  )
}
