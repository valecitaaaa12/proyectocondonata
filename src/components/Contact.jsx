import { useState } from 'react'
import { Phone, MapPin, Clock, Instagram, MessageCircle, Send } from 'lucide-react'

const contactInfo = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+591 78580928',
    href: 'https://wa.me/59178580928',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    icon: Phone,
    label: 'Teléfono',
    value: '78580928',
    href: 'tel:+59178580928',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: MapPin,
    label: 'Dirección',
    value: 'Juan Jose Perez 583, Sucre, Bolivia',
    href: 'https://maps.google.com/?q=Juan+Jose+Perez+583+Sucre+Bolivia',
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
  },
  {
    icon: Clock,
    label: 'Horario',
    value: 'Abierto las 24 horas, todos los días',
    href: null,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
]

export default function Contact() {
  const [form, setForm] = useState({ nombre: '', telefono: '', producto: '', mensaje: '' })

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    const text = `Hola Bad Bunny Vape! 👋\n\nMi nombre es *${form.nombre}*\nTeléfono: ${form.telefono}\nProducto de interés: *${form.producto || 'Consulta general'}*\n\n${form.mensaje}`
    window.open(`https://wa.me/59178580928?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <section id="contacto" className="py-24 bg-dark-800 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-5">

        <div className="text-center mb-14">
          <h2 className="section-title">Contactanos <span>ahora</span></h2>
          <p className="section-sub">Hacé tu pedido o consultanos por WhatsApp, te respondemos al instante</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Info cards */}
          <div className="flex flex-col gap-4">
            {contactInfo.map((c, i) => (
              <div key={i} className={`flex items-start gap-4 p-5 rounded-2xl bg-dark-700 border border-white/5 hover:border-primary-500/30 transition-all duration-300 ${c.href ? 'cursor-pointer group' : ''}`}
                onClick={() => c.href && window.open(c.href, '_blank')}>
                <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
                  <c.icon size={22} className={c.color} />
                </div>
                <div>
                  <p className="text-white/40 text-xs font-medium mb-1">{c.label}</p>
                  <p className={`font-semibold text-sm ${c.href ? `${c.color} group-hover:underline` : 'text-white'}`}>
                    {c.value}
                  </p>
                </div>
              </div>
            ))}

            {/* Google Maps embed */}
            <div className="rounded-2xl overflow-hidden border border-white/10 mt-2">
              <iframe
                title="Ubicación Bad Bunny Vape Bolivia"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.5!2d-65.2627!3d-19.0477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDAyJzUxLjciUyA2NcKwMTUnNDUuNyJX!5e0!3m2!1ses!2sbo!4v1234567890"
                width="100%"
                height="200"
                style={{ border: 0, display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}
            className="bg-dark-700 border border-white/5 rounded-2xl p-8 flex flex-col gap-4">
            <h3 className="font-bold text-lg text-white mb-2">Hacé tu pedido</h3>

            <div>
              <label className="text-white/40 text-xs font-medium mb-1.5 block">Tu nombre *</label>
              <input name="nombre" value={form.nombre} onChange={handleChange}
                required placeholder="Ej: María García"
                className="input-field" />
            </div>

            <div>
              <label className="text-white/40 text-xs font-medium mb-1.5 block">Tu WhatsApp *</label>
              <input name="telefono" value={form.telefono} onChange={handleChange}
                required placeholder="Ej: 70000000"
                className="input-field" />
            </div>

            <div>
              <label className="text-white/40 text-xs font-medium mb-1.5 block">Producto de interés</label>
              <select name="producto" value={form.producto} onChange={handleChange}
                className="input-field">
                <option value="">Seleccioná un producto</option>
                <optgroup label="🚬 Desechables">
                  <option>Gippro 600 – Bs. 40</option>
                  <option>Gippro 1600 – Bs. 70</option>
                  <option>Diamond 1k – Bs. 105</option>
                  <option>Fume 5k – Bs. 140</option>
                </optgroup>
                <optgroup label="🔌 Recargable Tipo C">
                  <option>Waka Pocket 6k – Bs. 145</option>
                  <option>Funky Lands 7k – Bs. 165</option>
                  <option>Elfbar EW 9k – Bs. 200–220</option>
                  <option>Elfbar EW 16k – Bs. 210</option>
                  <option>Ploox 9k – Bs. 185–220</option>
                  <option>Instabar 15k – Bs. 180</option>
                  <option>Waka Sopro 15k – Bs. 180</option>
                  <option>Life Pod SK 15k – Bs. 180</option>
                  <option>V-Play 20k – Bs. 180</option>
                  <option>Geek Bar Pulse X 25k – Bs. 215</option>
                  <option>Waka Boost 30k – Bs. 235</option>
                  <option>Waka Blast +Ice 36k – Bs. 240</option>
                  <option>Waka Fasta Turbo 46k – Bs. 245</option>
                  <option>Waka Icon 50k – Bs. 290</option>
                  <option>Waka Double Power 70k – Bs. 325</option>
                  <option>Black Sheep 30k – Bs. 285–310</option>
                  <option>Black Sheep 40k – Bs. 300</option>
                  <option>Airmez 40k – Bs. 250</option>
                  <option>Life Pod One 40k – Bs. 280</option>
                  <option>Life Pod Fit 30k – Bs. 240</option>
                </optgroup>
                <optgroup label="🧱 Lego / Kits">
                  <option>Life Pod Eco I Pro 8k – Bs. 165</option>
                  <option>Life Pod Eco II 10k – Bs. 185</option>
                  <option>Life Pod Eco III 10k – Bs. 235</option>
                  <option>Kit Life Pod Eco I Completo – Bs. 240</option>
                  <option>Kit Life Pod Eco III 20k – Bs. 400</option>
                  <option>Waka Pod Creator Lego 20k – Bs. 190</option>
                  <option>Waka Kit Creator Lego 15k – Bs. 250</option>
                  <option>20k Waka Creator Lego – Bs. 260</option>
                  <option>Moss Kit Creator Lego 25k – Bs. 260</option>
                </optgroup>
                <optgroup label="🎁 Accesorios">
                  <option>Parches Nicotina Tacja – Bs. 90</option>
                  <option>Lanyard Collarín – Bs. 10</option>
                  <option>Polera Waka Original – Bs. 150</option>
                  <option>Jelly Shot Four Loko – Bs. 45</option>
                </optgroup>
                <option>Mayoreo / Consulta distribuidores</option>
                <option>Otro / Consulta general</option>
              </select>
            </div>

            <div>
              <label className="text-white/40 text-xs font-medium mb-1.5 block">Mensaje</label>
              <textarea name="mensaje" value={form.mensaje} onChange={handleChange}
                rows={4} placeholder="Contanos qué necesitás..."
                className="input-field resize-none" />
            </div>

            <button type="submit"
              className="btn-primary w-full justify-center mt-2 py-3.5">
              <Send size={16} />
              Enviar por WhatsApp
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
