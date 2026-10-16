import { useState } from 'react'
import { getMergedProducts } from '../context/AdminContext'
import { useCart } from '../context/CartContext'
import { Plus, Wind, Zap, ChevronRight } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

// ── Budget sections ────────────────────────────────────────────────────────────
const budgets = [
  { id: 'low',  label: 'Menos de 100 Bs', max: 100,  min: 0,   color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', emoji: '💚' },
  { id: 'mid',  label: '100 a 200 Bs',    max: 200,  min: 100, color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/20',   emoji: '🟡' },
  { id: 'high', label: 'Más de 200 Bs',   max: 9999, min: 200, color: 'text-primary-400', bg: 'bg-primary-400/10', border: 'border-primary-400/20', emoji: '💎' },
]

// ── Vape quiz ──────────────────────────────────────────────────────────────────
const quizSteps = [
  {
    q: '¿Cuánto usás vapear por día?',
    options: [
      { label: 'Poco, solo a veces',  value: 'low'  },
      { label: 'Moderado, a diario',  value: 'mid'  },
      { label: 'Bastante, todo el día', value: 'high' },
    ],
  },
  {
    q: '¿Qué nicotina preferís?',
    options: [
      { label: 'Baja (2%)',     value: 'low'  },
      { label: 'Media (3%)',    value: 'mid'  },
      { label: 'Alta (5%)',     value: 'high' },
    ],
  },
  {
    q: '¿Qué es más importante para vos?',
    options: [
      { label: 'Precio bajo',         value: 'price'   },
      { label: 'Muchos puffs',        value: 'puffs'   },
      { label: 'Tecnología / pantalla', value: 'tech'  },
    ],
  },
  {
    q: '¿Cuál es tu presupuesto?',
    options: [
      { label: 'Hasta 100 Bs',   value: 'budget_low'  },
      { label: '100–200 Bs',     value: 'budget_mid'  },
      { label: 'Más de 200 Bs',  value: 'budget_high' },
    ],
  },
]

function getRecommendation(answers) {
  const [uso, nic, prio, budget] = answers
  const budgetMax = budget === 'budget_low' ? 100 : budget === 'budget_mid' ? 200 : 9999
  const budgetMin = budget === 'budget_low' ? 0   : budget === 'budget_mid' ? 100 : 200

  let pool = getMergedProducts().filter(p => p.price && p.price >= budgetMin && p.price <= budgetMax && p.category !== 'accesorio')

  if (prio === 'price')  pool = [...pool].sort((a, b) => a.price - b.price)
  if (prio === 'puffs')  pool = [...pool].sort((a, b) => parseInt(b.puffs) - parseInt(a.puffs))
  if (prio === 'tech')   pool = pool.filter(p => (p.desc || '').toLowerCase().includes('pantalla') || (p.tipo || '').toLowerCase().includes('pantalla'))

  if (nic === 'low')  pool = pool.filter(p => p.nicotina === '2%' || p.nicotina === '3%')
  if (nic === 'high') pool = pool.filter(p => p.nicotina === '5%')

  return pool.slice(0, 3)
}

function MiniCard({ p }) {
  const { addItem } = useCart()
  return (
    <div className="bg-dark-700 border border-white/10 rounded-2xl p-4 flex gap-3 hover:border-primary-500/30 transition-all duration-300">
      <span className="text-3xl shrink-0">{p.emoji || p.name?.charAt(0) || '🛍️'}</span>
      <div className="flex-1 min-w-0">
        <p className="text-primary-400 text-[10px] font-black uppercase">{p.brand}</p>
        <p className="font-bold text-white text-sm truncate">{p.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="flex items-center gap-1 text-primary-300 text-[10px] font-semibold">
            <Wind size={9} />{p.puffs}
          </span>
          <span className="text-white/30 text-[10px]">·</span>
          <span className="text-white/50 text-[10px]">{p.nicotina}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="font-black text-white text-base">Bs. {p.price}</span>
        <button onClick={() => addItem({ ...p, selectedFlavor: p.flavors?.[0] })}
          className="w-7 h-7 rounded-lg bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95">
          <Plus size={13} />
        </button>
      </div>
    </div>
  )
}

export default function BudgetFinder() {
  const [activeBudget, setActiveBudget]   = useState(null)
  const [quizActive,   setQuizActive]     = useState(false)
  const [quizStep,     setQuizStep]       = useState(0)
  const [answers,      setAnswers]        = useState([])
  const [quizResult,   setQuizResult]     = useState(null)
  const [ref, visible] = useScrollReveal()

  const budgetProducts = activeBudget
    ? getMergedProducts().filter(p => {
        const b = budgets.find(b => b.id === activeBudget)
        return p.price && p.price >= b.min && p.price <= b.max && p.category !== 'accesorio'
      }).slice(0, 6)
    : []

  const handleQuizAnswer = (val) => {
    const newAnswers = [...answers, val]
    if (newAnswers.length === quizSteps.length) {
      setAnswers(newAnswers)
      setQuizResult(getRecommendation(newAnswers))
    } else {
      setAnswers(newAnswers)
      setQuizStep(s => s + 1)
    }
  }

  const resetQuiz = () => {
    setQuizStep(0)
    setAnswers([])
    setQuizResult(null)
    setQuizActive(false)
  }

  return (
    <section id="presupuesto" className="py-20 bg-dark-800 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-5">
        <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>

          <div className="text-center mb-10">
            <h2 className="section-title">¿Qué comprar según tu <span>presupuesto</span>?</h2>
            <p className="section-sub">Elegí tu rango y encontrá el vape ideal para vos.</p>
          </div>

          {/* Budget tabs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            {budgets.map(b => (
              <button key={b.id}
                onClick={() => { setActiveBudget(activeBudget === b.id ? null : b.id); setQuizActive(false) }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm border transition-all duration-300 ${
                  activeBudget === b.id
                    ? `${b.bg} ${b.border} ${b.color} shadow-lg`
                    : 'bg-dark-700 border-white/10 text-white/50 hover:border-white/20 hover:text-white/80'
                }`}>
                <span className="text-lg">{b.emoji}</span>
                {b.label}
              </button>
            ))}
          </div>

          {/* Budget results */}
          {activeBudget && budgetProducts.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 animate-[fadeIn_0.4s_ease]">
              {budgetProducts.map(p => <MiniCard key={p.id} p={p} />)}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 border-t border-white/10" />
            <span className="text-white/30 text-xs font-medium">o usá el test rápido</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          {/* Quiz */}
          {!quizActive && !quizResult && (
            <div className="bg-dark-700 border border-primary-500/20 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">🤔</div>
              <h3 className="font-black text-white text-lg mb-2">¿Qué vape te conviene?</h3>
              <p className="text-white/40 text-sm mb-5">4 preguntas rápidas y te recomendamos el ideal para vos.</p>
              <button onClick={() => setQuizActive(true)}
                className="btn-primary px-8">
                <Zap size={15} />
                Empezar test
              </button>
            </div>
          )}

          {quizActive && !quizResult && (
            <div className="bg-dark-700 border border-primary-500/20 rounded-2xl p-6 animate-[fadeIn_0.3s_ease]">
              <div className="flex items-center justify-between mb-5">
                <span className="text-white/40 text-xs font-medium">Pregunta {quizStep + 1} de {quizSteps.length}</span>
                <div className="flex gap-1">
                  {quizSteps.map((_, i) => (
                    <div key={i} className={`h-1.5 w-8 rounded-full transition-all ${i <= quizStep ? 'bg-primary-500' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>
              <h3 className="font-black text-white text-lg mb-5">{quizSteps[quizStep].q}</h3>
              <div className="flex flex-col gap-3">
                {quizSteps[quizStep].options.map((opt, i) => (
                  <button key={i}
                    onClick={() => handleQuizAnswer(opt.value)}
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-dark-600 border border-white/10 text-white/70 hover:border-primary-500/50 hover:bg-primary-600/10 hover:text-white transition-all duration-200 font-medium text-sm group">
                    {opt.label}
                    <ChevronRight size={16} className="text-white/30 group-hover:text-primary-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {quizResult && (
            <div className="animate-[fadeIn_0.4s_ease]">
              <div className="text-center mb-5">
                <div className="text-4xl mb-2">🎯</div>
                <h3 className="font-black text-white text-lg">Estos son tus vapes ideales</h3>
                <p className="text-white/40 text-sm">Basados en tus respuestas</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                {quizResult.length > 0
                  ? quizResult.map(p => <MiniCard key={p.id} p={p} />)
                  : <p className="text-white/30 text-sm col-span-3 text-center py-6">No encontramos productos exactos. Ampliá tu presupuesto.</p>
                }
              </div>
              <div className="text-center">
                <button onClick={resetQuiz}
                  className="text-white/40 text-xs hover:text-white transition-colors underline">
                  Volver a hacer el test
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
