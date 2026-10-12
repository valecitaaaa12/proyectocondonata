import { useState } from 'react'
import { X, Mail, Lock, User, Eye, EyeOff, Wind, Calendar } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AuthModal() {
  const { authModal, setAuthModal, login, register } = useAuth()
  const [mode,      setMode]      = useState(authModal || 'login')
  const [name,      setName]      = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [showPass,  setShowPass]  = useState(false)
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)

  if (!authModal) return null

  const close = () => setAuthModal(null)

  const switchMode = (m) => {
    setMode(m)
    setError('')
    setName(''); setEmail(''); setPassword(''); setBirthdate('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 300))
    let result
    if (mode === 'login') {
      result = login(email, password)
    } else {
      if (!name.trim()) { setError('El nombre es requerido.'); setLoading(false); return }
      result = register(name.trim(), email, password, birthdate || null)
    }
    setLoading(false)
    if (!result.ok) setError(result.error)
  }

  return (
    <>
      <div onClick={close} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]" />
      <div className="fixed inset-0 z-[201] flex items-center justify-center px-4 pointer-events-none">
        <div className="bg-dark-800 border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl pointer-events-auto animate-[pop_0.3s_cubic-bezier(0.34,1.56,0.64,1)_both]">

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center">
                <Wind size={15} className="text-white" />
              </div>
              <span className="font-black text-white">
                {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
              </span>
            </div>
            <button onClick={close} className="w-8 h-8 rounded-xl bg-dark-700 flex items-center justify-center text-white/50 hover:text-white transition-colors">
              <X size={15} />
            </button>
          </div>

          <div className="flex gap-1 bg-dark-700 rounded-xl p-1 mb-6">
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => switchMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                  mode === m ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-white/40 hover:text-white/70'
                }`}>
                {m === 'login' ? 'Entrar' : 'Registrarse'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="text-white/40 text-xs font-medium mb-1.5 block">Nombre completo</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder="Ej: María García" className="input-field pl-10" required />
                  </div>
                </div>
                <div>
                  <label className="text-white/40 text-xs font-medium mb-1.5 block">
                    Fecha de nacimiento <span className="text-white/20 font-normal">(descuento de cumpleaños 🎂)</span>
                  </label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                    <input type="text" value={birthdate} onChange={e => setBirthdate(e.target.value)}
                      placeholder="DD-MM-AAAA" className="input-field pl-10" />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-white/40 text-xs font-medium mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com" className="input-field pl-10" required />
              </div>
            </div>

            <div>
              <label className="text-white/40 text-xs font-medium mb-1.5 block">Contraseña</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" className="input-field pl-10 pr-10" required minLength={6} />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-rose-400 text-xs font-medium bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3.5 mt-1 disabled:opacity-60">
              {loading ? '...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>

          {mode === 'register' && (
            <p className="text-white/20 text-[11px] text-center mt-4">
              Al registrarte aceptás los términos de uso.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
