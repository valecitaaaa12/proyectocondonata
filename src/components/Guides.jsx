import { useState } from 'react'
import { ChevronDown, ChevronUp, Zap, Battery, Wrench, AlertTriangle, Calendar, BarChart2, TrendingUp } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

// ── Accordion item ────────────────────────────────────────────────────────────
function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-semibold text-white/80 text-sm">{title}</span>
        {open ? <ChevronUp size={16} className="text-primary-400 shrink-0" /> : <ChevronDown size={16} className="text-white/30 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 text-white/50 text-sm leading-relaxed border-t border-white/5">
          {children}
        </div>
      )}
    </div>
  )
}

// ── Problem guide card (extraído para poder usar hook correctamente) ──────────
function ProblemGuideCard({ guide, delay }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div ref={ref} className={`bg-dark-700 border border-white/10 rounded-2xl p-5 reveal ${visible ? 'visible' : ''} delay-${(delay + 1) * 100}`}>
      <h4 className="font-bold text-white mb-4">{guide.title}</h4>
      <div className="space-y-3">
        {guide.items.map((item, j) => (
          <div key={j}>
            <p className="text-white/60 text-xs font-semibold">{item.q}</p>
            <p className="text-white/40 text-xs mt-0.5">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Guide card ────────────────────────────────────────────────────────────────
function GuideCard({ icon: Icon, color, title, items }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div ref={ref} className={`bg-dark-700 border border-white/10 rounded-2xl p-5 hover:border-${color}-500/30 transition-all duration-300 reveal ${visible ? 'visible' : ''}`}>
      <div className={`flex items-center gap-3 mb-4`}>
        <div className={`w-9 h-9 rounded-xl bg-${color}-500/20 flex items-center justify-center shrink-0`}>
          <Icon size={18} className={`text-${color}-400`} />
        </div>
        <h4 className="font-bold text-white text-sm">{title}</h4>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-white/50 text-xs leading-relaxed">
            <span className={`w-1.5 h-1.5 rounded-full bg-${color}-400 shrink-0 mt-1`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Section header with reveal ────────────────────────────────────────────────
function SectionHeader({ id, title, highlight, sub }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div ref={ref} id={id} className={`text-center mb-12 reveal ${visible ? 'visible' : ''}`}>
      <h2 className="section-title">{title} <span>{highlight}</span></h2>
      {sub && <p className="section-sub">{sub}</p>}
    </div>
  )
}

// ── Replenishment calendar ────────────────────────────────────────────────────
const calendarEvents = [
  { date: '15 Oct 2026', event: 'Llegada de nuevos sabores Waka Boost 30k', type: 'reposicion' },
  { date: '20 Oct 2026', event: 'Lanzamiento: Waka Fasta Turbo 46k — nuevos sabores', type: 'lanzamiento' },
  { date: '28 Oct 2026', event: 'Reposición stock Gippro + Geek Bar', type: 'reposicion' },
  { date: '5 Nov 2026',  event: 'Promo de temporada: kits de inicio con descuento', type: 'promo' },
  { date: '12 Nov 2026', event: 'Nuevo ingreso: Black Sheep edición limitada', type: 'lanzamiento' },
  { date: '25 Nov 2026', event: 'Reposición masiva Black Friday', type: 'reposicion' },
]

const eventColors = {
  reposicion: { dot: 'bg-emerald-400', text: 'text-emerald-400', label: 'Reposición', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  lanzamiento: { dot: 'bg-primary-400', text: 'text-primary-400', label: 'Lanzamiento', bg: 'bg-primary-400/10 border-primary-400/20' },
  promo: { dot: 'bg-amber-400', text: 'text-amber-400', label: 'Promo', bg: 'bg-amber-400/10 border-amber-400/20' },
}

// ── Main Guides component ─────────────────────────────────────────────────────
export default function Guides() {
  const [calRef, calVisible] = useScrollReveal()
  const [faqRef, faqVisible] = useScrollReveal()
  const [compRef, compVisible] = useScrollReveal()

  return (
    <section id="guias" className="py-24 bg-dark-800 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-5 space-y-20">

        {/* ── Guía para principiantes ───────────────────────────────────────── */}
        <div>
          <SectionHeader
            title="Guía para"
            highlight="principiantes"
            sub="Todo lo que necesitás saber antes de empezar a vapear."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <GuideCard icon={Zap} color="primary" title="Elegir tu equipo" items={[
              'Los desechables son ideales para comenzar: sin configuración, listos para usar.',
              'Los recargables tipo C duran más y son más económicos a largo plazo.',
              'Los kits lego permiten personalizar potencia y sabor.',
              'Empezá con 600–1600 puffs para probar sabores sin gastar mucho.',
            ]} />
            <GuideCard icon={AlertTriangle} color="amber" title="Sobre la nicotina" items={[
              '2% (20mg/ml): ideal para principiantes o quienes fuman poco.',
              '3% (30mg/ml): intermedio, flujo más suave.',
              '5% (50mg/ml): para fumadores habituales, sensación fuerte.',
              'La nicotina es adictiva. Usá solo si ya sos fumador adulto.',
            ]} />
            <GuideCard icon={Battery} color="blue" title="Baterías y carga" items={[
              'Los tipo C se cargan con el mismo cable de tu celular.',
              'No los dejes cargando toda la noche.',
              'Una pantalla digital te indica la batería restante.',
              'Los desechables no tienen batería reemplazable.',
            ]} />
            <GuideCard icon={Wrench} color="emerald" title="Mantenimiento" items={[
              'Guardá siempre con la tapa puesta.',
              'No los expongas al sol directo ni al frío extremo.',
              'Si notás sabor raro, puede ser que el líquido se agotó.',
              'Limpiá el conector de vez en cuando con un hisopo.',
            ]} />
          </div>
        </div>

        {/* ── Comparativas ─────────────────────────────────────────────────── */}
        <div>
          <SectionHeader title="Comparativas" highlight="y rankings" sub="Las mejores opciones según tus necesidades." />
          <div ref={compRef} className={`grid md:grid-cols-2 gap-6 reveal ${compVisible ? 'visible' : ''}`}>

            <div className="bg-dark-700 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-primary-400" />
                <h4 className="font-bold text-white">Mejores pods para principiantes</h4>
              </div>
              <ol className="space-y-3">
                {[
                  { name: 'Gippro 600', why: 'Precio más bajo, compacto, 2 sabores sólidos.', badge: '🥇' },
                  { name: 'Waka Pocket 6k', why: 'Recargable tipo C, pantalla, ideal transición.', badge: '🥈' },
                  { name: 'Funky Lands 7k', why: 'Buen sabor, fácil de usar, buena duración.', badge: '🥉' },
                  { name: 'Elfbar EW 9k', why: 'Marca mundial, flujo suave, gran variedad de sabores.', badge: '4' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-lg shrink-0">{item.badge}</span>
                    <div>
                      <p className="font-semibold text-white text-sm">{item.name}</p>
                      <p className="text-white/40 text-xs">{item.why}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-dark-700 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 size={16} className="text-amber-400" />
                <h4 className="font-bold text-white">Equipos por rango de precio</h4>
              </div>
              <div className="space-y-3">
                {[
                  { range: 'Hasta Bs. 100', products: 'Gippro 600, Lanyard, Jelly Shot', color: 'text-emerald-400' },
                  { range: 'Bs. 100–180', products: 'Diamond 1k, Fume 5k, Waka Pocket 6k, Funky Lands 7k', color: 'text-blue-400' },
                  { range: 'Bs. 180–250', products: 'Elfbar EW, Waka Sopro, Geek Bar Pulse, Waka Boost', color: 'text-amber-400' },
                  { range: 'Bs. 250–400', products: 'Waka Icon 50k, Black Sheep, Waka Double, Kits completos', color: 'text-primary-400' },
                ].map((item, i) => (
                  <div key={i} className="border-l-2 border-white/10 pl-3">
                    <p className={`font-bold text-xs ${item.color}`}>{item.range}</p>
                    <p className="text-white/40 text-xs">{item.products}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Guías de problemas ───────────────────────────────────────────── */}
        <div>
          <SectionHeader title="Guías de" highlight="problemas" sub="Soluciones rápidas para los problemas más comunes." />
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                title: '🔴 No enciende',
                items: [
                  { q: '¿La batería está descargada?', a: 'Conectá el tipo C al menos 30 minutos antes de usar.' },
                  { q: '¿Está bloqueado?', a: 'Algunos modelos tienen bloqueo. Presioná el botón 5 veces rápido.' },
                  { q: '¿El cartucho está bien puesto?', a: 'Desconectá y volvé a conectar el pod firmemente.' },
                  { q: '¿Sigue sin encender?', a: 'Puede ser falla de fábrica. Contactanos para evaluar garantía.' },
                ],
              },
              {
                title: '🟠 Sabe a quemado',
                items: [
                  { q: '¿Puffeaste muy seguido?', a: 'Esperá 5–10 segundos entre puffs para que el algodón se riegue.' },
                  { q: '¿El líquido está bajo?', a: 'Con pocas gotas queda, el algodón se quema. Es señal de que se acabó.' },
                  { q: '¿Es un pod nuevo?', a: 'Los pods nuevos necesitan 3–5 minutos en reposo antes del primer puff.' },
                  { q: '¿Persiste el sabor?', a: 'Si el liquid está lleno y sigue quemando, puede ser falla del coil.' },
                ],
              },
              {
                title: '💧 Se gotea',
                items: [
                  { q: '¿Está ladeado?', a: 'Guardá siempre en posición vertical para evitar filtración.' },
                  { q: '¿Puffeás muy fuerte?', a: 'Inhalá suave y constante, no en ráfagas cortas y fuertes.' },
                  { q: '¿El pod tiene grieta?', a: 'Revisá el tanque. Una grieta pequeña puede causar goteo constante.' },
                  { q: '¿Gotea mucho?', a: 'Limpiá con papel absorbente y si sigue, contactanos para revisión.' },
                ],
              },
            ].map((guide, i) => (
              <ProblemGuideCard key={i} guide={guide} delay={i} />
            ))}
          </div>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <div>
          <SectionHeader title="Preguntas" highlight="frecuentes" sub="Las dudas más comunes de nuestros clientes." />
          <div ref={faqRef} className={`grid md:grid-cols-2 gap-3 reveal ${faqVisible ? 'visible' : ''}`}>
            {[
              { q: '¿Hacen envíos a toda Bolivia?', a: 'Sí, enviamos a todo el país por encomienda. Los tiempos varían según la ciudad: Sucre mismo día o siguiente día, otros departamentos 1–3 días. Consultá el costo de envío por WhatsApp.' },
              { q: '¿Qué garantía tienen los productos?', a: 'Los productos tienen garantía por falla de fábrica, que se evalúa al momento de la compra presencial. No realizamos cambios ni devoluciones después de la entrega por uso inadecuado.' },
              { q: '¿Son todos productos originales?', a: 'Sí, trabajamos únicamente con distribuidores oficiales. Todos los productos tienen sus sellos de autenticidad. Podés verificar los códigos QR en las cajas originales.' },
              { q: '¿Cuál es la edad mínima para comprar?', a: 'La venta de productos con nicotina está legalmente prohibida a menores de 18 años. Solicitamos verificación de edad en cada pedido.' },
              { q: '¿Qué formas de pago aceptan?', a: 'Aceptamos efectivo, Tigo Money, QR y transferencia bancaria. Consultanos los detalles por WhatsApp.' },
              { q: '¿Tienen locales físicos?', a: 'Sí, estamos en Juan Jose Perez 583, Sucre, Bolivia. Podés venir o hacer tu pedido online para entrega o recojo.' },
              { q: '¿Puedo pedir vapeadores compatibles?', a: 'Sí, trabajamos con sistemas tipo lego/pod donde los cartuchos son intercambiables entre modelos de la misma marca. Consultanos antes de pedir para asegurarte la compatibilidad.' },
              { q: '¿Pueden hacer descuentos por cantidad?', a: 'Sí, tenemos precios de mayoreo para pedidos de 10+ unidades. Consultá la sección "Mayoreo" o escribinos directamente.' },
            ].map((item, i) => (
              <AccordionItem key={i} title={`❓ ${item.q}`}>
                <p className="pt-3">{item.a}</p>
              </AccordionItem>
            ))}
          </div>
        </div>

        {/* ── Calendario ───────────────────────────────────────────────────── */}
        <div>
          <SectionHeader title="Calendario de" highlight="reposiciones" sub="Fechas estimadas de llegada de stock y lanzamientos." />
          <div ref={calRef} className={`bg-dark-700 border border-white/10 rounded-2xl overflow-hidden reveal ${calVisible ? 'visible' : ''}`}>
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
              <Calendar size={18} className="text-primary-400" />
              <h4 className="font-bold text-white">Próximas fechas</h4>
              <div className="ml-auto flex gap-3 text-[11px]">
                {Object.entries(eventColors).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${val.dot}`} />
                    <span className="text-white/40">{val.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {calendarEvents.map((event, i) => {
                const c = eventColors[event.type]
                return (
                  <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors">
                    <span className={`w-2.5 h-2.5 rounded-full ${c.dot} shrink-0`} />
                    <span className="text-white/40 text-xs font-medium w-24 shrink-0">{event.date}</span>
                    <span className="text-white/70 text-sm flex-1">{event.event}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${c.bg} ${c.text} shrink-0`}>
                      {c.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
