import { useState, useEffect, useRef } from 'react'
import { Wind, AlertTriangle, Calendar } from 'lucide-react'
import { logAgeVerification } from '../context/AdminContext'

const SESSION_KEY = 'bbv_age_verified'

function calcAge(year, month, day) {
  const today = new Date()
  const birth = new Date(Number(year), Number(month) - 1, Number(day))
  if (isNaN(birth.getTime())) return -1
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export default function AgeGate({ onVerified }) {
  const [blocked, setBlocked]     = useState(false)
  const [shake,   setShake]       = useState(false)
  const [error,   setError]       = useState('')
  const [day,     setDay]         = useState('')
  const [month,   setMonth]       = useState('')
  const [year,    setYear]        = useState('')
  const monthRef = useRef(null)
  const yearRef  = useRef(null)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'yes') onVerified()
  }, [onVerified])

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 600)
  }

  const handleVerify = () => {
    if (!day || !month || !year || year.length < 4) {
      setError('Por favor ingresá tu fecha de nacimiento completa.')
      triggerShake()
      return
    }
    const age = calcAge(year, month, day)
    if (age < 0) {
      setError('La fecha ingresada no es válida.')
      triggerShake()
      return
    }
    // Log verification attempt (without storing PII, only age)
    logAgeVerification({ age, passed: age >= 18 })

    if (age >= 18) {
      sessionStorage.setItem(SESSION_KEY, 'yes')
      onVerified()
    } else {
      setBlocked(true)
    }
  }

  const handleDayChange = (v) => {
    const val = v.replace(/\D/g, '').slice(0, 2)
    setDay(val)
    setError('')
    if (val.length === 2) monthRef.current?.focus()
  }
  const handleMonthChange = (v) => {
    const val = v.replace(/\D/g, '').slice(0, 2)
    setMonth(val)
    setError('')
    if (val.length === 2) yearRef.current?.focus()
  }
  const handleYearChange = (v) => {
    const val = v.replace(/\D/g, '').slice(0, 4)
    setYear(val)
    setError('')
  }

  if (blocked) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-dark-900 px-6 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-rose-600/10 blur-3xl" />
        </div>
        <div className="relative max-w-md animate-fade-up">
          <div className="w-20 h-20 rounded-full bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={36} className="text-rose-400" />
          </div>
          <h1 className="text-2xl font-black text-white mb-3">Acceso denegado</h1>
          <p className="text-white/50 text-sm leading-relaxed mb-6">
            Este sitio contiene productos con nicotina destinados
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

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-dark-900 px-6">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-hero-gradient opacity-60" />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(236,72,153,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-primary-600/20 blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-purple-600/15 blur-3xl" />
      </div>

      <div className={`relative max-w-sm w-full ${shake ? 'animate-[wiggle_0.4s_ease]' : 'animate-fade-up'}`}>
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
          <div className="flex justify-center mb-5">
            <span className="bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              ⚠️ Verificación de edad
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar size={20} className="text-primary-400" />
            <h2 className="text-white font-black text-xl text-center">
              Ingresá tu fecha de nacimiento
            </h2>
          </div>

          <p className="text-white/40 text-sm text-center leading-relaxed mb-7">
            Este sitio contiene productos con nicotina. El acceso está
            permitido solo para mayores de <strong className="text-white/70">18 años</strong>.
          </p>

          {/* Date inputs */}
          <div className="flex gap-3 mb-2">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-white/40 text-[10px] font-medium text-center uppercase tracking-wider">Día</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={2}
                placeholder="DD"
                value={day}
                onChange={e => handleDayChange(e.target.value)}
                className="input-field text-center text-lg font-bold tracking-widest"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-white/40 text-[10px] font-medium text-center uppercase tracking-wider">Mes</label>
              <input
                ref={monthRef}
                type="text"
                inputMode="numeric"
                maxLength={2}
                placeholder="MM"
                value={month}
                onChange={e => handleMonthChange(e.target.value)}
                className="input-field text-center text-lg font-bold tracking-widest"
              />
            </div>
            <div className="flex-[1.6] flex flex-col gap-1">
              <label className="text-white/40 text-[10px] font-medium text-center uppercase tracking-wider">Año</label>
              <input
                ref={yearRef}
                type="text"
                inputMode="numeric"
                maxLength={4}
                placeholder="AAAA"
                value={year}
                onChange={e => handleYearChange(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleVerify()}
                className="input-field text-center text-lg font-bold tracking-widest"
              />
            </div>
          </div>

          {error && (
            <p className="text-rose-400 text-xs text-center mb-3 font-medium">{error}</p>
          )}

          <div className="flex flex-col gap-3 mt-5">
            <button
              onClick={handleVerify}
              className="w-full btn-primary justify-center py-4 text-base font-black tracking-wide rounded-2xl"
            >
              ✅ Verificar y entrar
            </button>
          </div>

          {/* Nicotine warning */}
          <div className="mt-5 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex gap-2 items-start">
            <span className="text-amber-400 text-base shrink-0">⚠️</span>
            <p className="text-amber-300/80 text-[11px] leading-relaxed">
              <strong>Advertencia de nicotina:</strong> Los productos aquí vendidos contienen nicotina,
              una sustancia adictiva. Su venta y consumo están prohibidos a menores de 18 años.
            </p>
          </div>
        </div>

        <p className="text-center text-white/20 text-[11px] mt-5 leading-relaxed px-4">
          Al ingresar confirmás que sos mayor de 18 años y aceptás los
          términos de uso del sitio.
        </p>
      </div>
    </div>
  )
}
