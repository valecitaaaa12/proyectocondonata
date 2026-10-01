import { CheckCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Toast() {
  const { toast } = useCart()

  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-300 ${
      toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
    }`}>
      <div className="flex items-center gap-3 bg-primary-600 text-white font-semibold text-sm px-5 py-3 rounded-full shadow-xl shadow-primary-500/40 whitespace-nowrap">
        <CheckCircle size={18} className="shrink-0" />
        {toast.message}
      </div>
    </div>
  )
}
