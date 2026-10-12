import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function WelcomeBanner() {
  const { welcomeMsg, setWelcomeMsg } = useAuth()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (welcomeMsg) {
      setVisible(true)
      const t = setTimeout(() => { setVisible(false); setTimeout(() => setWelcomeMsg(''), 400) }, 4000)
      return () => clearTimeout(t)
    }
  }, [welcomeMsg, setWelcomeMsg])

  if (!welcomeMsg) return null

  return (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[150] transition-all duration-400 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
    }`}>
      <div className="bg-dark-800 border border-primary-500/40 rounded-2xl px-5 py-3 shadow-2xl shadow-primary-500/20 flex items-center gap-3 max-w-xs">
        <span className="text-xl">👋</span>
        <span className="text-white font-semibold text-sm">{welcomeMsg}</span>
        <button onClick={() => { setVisible(false); setTimeout(() => setWelcomeMsg(''), 400) }}
          className="text-white/30 hover:text-white transition-colors ml-1 shrink-0">
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
