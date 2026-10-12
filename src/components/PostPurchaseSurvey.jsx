import { useState, useEffect } from 'react'
import { X, Star, ThumbsUp, ThumbsDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const SURVEY_KEY = 'bbv_survey_shown'
const SURVEY_DELAY_DAYS = 2 // Show 2 days after last order

function shouldShowSurvey(user) {
  if (!user?.orders?.length) return false
  const lastOrder = user.orders[0]
  const daysSince = (Date.now() - new Date(lastOrder.date).getTime()) / (1000 * 60 * 60 * 24)
  const alreadyShown = localStorage.getItem(`${SURVEY_KEY}_${user.email}`)
  return daysSince >= SURVEY_DELAY_DAYS && !alreadyShown
}

export default function PostPurchaseSurvey() {
  const { currentUser } = useAuth()
  const [visible, setVisible] = useState(false)
  const [step,    setStep]    = useState(0) // 0=q1, 1=q2, 2=done
  const [ans1,    setAns1]    = useState(null)
  const [ans2,    setAns2]    = useState(null)

  useEffect(() => {
    if (!currentUser) return
    const t = setTimeout(() => {
      if (shouldShowSurvey(currentUser)) setVisible(true)
    }, 3000)
    return () => clearTimeout(t)
  }, [currentUser])

  const dismiss = () => {
    if (currentUser) localStorage.setItem(`${SURVEY_KEY}_${currentUser.email}`, '1')
    setVisible(false)
  }

  const handleAnswer = (q, val) => {
    if (q === 1) { setAns1(val); setStep(1) }
    else         { setAns2(val); setStep(2)
      // Save result
      try {
        const list = JSON.parse(localStorage.getItem('bbv_surveys') || '[]')
        list.push({ user: currentUser?.email, q1: ans1, q2: val, date: new Date().toISOString() })
        localStorage.setItem('bbv_surveys', JSON.stringify(list.slice(-50)))
      } catch { /* ignore */ }
      if (currentUser) localStorage.setItem(`${SURVEY_KEY}_${currentUser.email}`, '1')
      setTimeout(() => setVisible(false), 2500)
    }
  }

  if (!visible || !currentUser) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[180]" onClick={dismiss} />
      <div className="fixed bottom-6 right-6 z-[181] max-w-xs w-full animate-[slideInRight_0.35s_ease_both]">
        <div className="bg-dark-800 border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black/60">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star size={16} className="text-amber-400 fill-amber-400" />
              <span className="font-bold text-white text-sm">¿Cómo estuvo?</span>
            </div>
            <button onClick={dismiss} className="text-white/30 hover:text-white transition-colors">
              <X size={15} />
            </button>
          </div>

          {step === 0 && (
            <div className="animate-[fadeIn_0.3s_ease_both]">
              <p className="text-white/60 text-xs mb-4 leading-relaxed">
                ¿Te gustó el servicio de Bad Bunny Vape?
              </p>
              <div className="flex gap-3">
                <button onClick={() => handleAnswer(1, 'si')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-sm font-bold hover:bg-emerald-500/25 transition-all">
                  <ThumbsUp size={15} /> Sí
                </button>
                <button onClick={() => handleAnswer(1, 'no')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 text-sm font-bold hover:bg-white/10 transition-all">
                  <ThumbsDown size={15} /> Mejorable
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-[fadeIn_0.3s_ease_both]">
              <p className="text-white/60 text-xs mb-4 leading-relaxed">
                ¿Volvería a comprar con nosotros?
              </p>
              <div className="flex gap-3">
                <button onClick={() => handleAnswer(2, 'si')}
                  className="flex-1 py-2.5 rounded-xl bg-primary-600/20 border border-primary-500/30 text-primary-300 text-sm font-bold hover:bg-primary-600/30 transition-all">
                  ¡Claro!
                </button>
                <button onClick={() => handleAnswer(2, 'tal_vez')}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 text-sm font-bold hover:bg-white/10 transition-all">
                  Tal vez
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center animate-[fadeIn_0.3s_ease_both] py-2">
              <div className="text-3xl mb-2">🙏</div>
              <p className="text-white font-bold text-sm">¡Gracias por tu opinión!</p>
              <p className="text-white/40 text-xs mt-1">Nos ayuda a mejorar cada día.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
