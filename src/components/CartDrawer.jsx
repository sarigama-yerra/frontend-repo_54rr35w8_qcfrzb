import { X, Trash2 } from 'lucide-react'

export default function CartDrawer({ open, onClose, items, onRemove, onCheckout }) {
  const total = items.reduce((sum, it) => sum + (it.product?.price || 0) * it.quantity, 0)
  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-lg">Your Cart</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X /></button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-140px)]">
          {items.length === 0 ? (
            <p className="text-slate-500">Your cart is empty.</p>
          ) : (
            items.map((it) => (
              <div key={it.id} className="flex gap-3 border-b pb-3">
                <img src={it.product?.image} alt={it.product?.title} className="w-16 h-16 rounded object-cover" />
                <div className="flex-1">
                  <h4 className="font-medium line-clamp-1">{it.product?.title}</h4>
                  <p className="text-sm text-slate-500">Qty: {it.quantity}</p>
                  <p className="text-sm font-semibold">${(it.product?.price || 0).toFixed(2)}</p>
                </div>
                <button onClick={() => onRemove(it)} className="self-start p-2 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-600">Subtotal</span>
            <span className="text-lg font-bold">${total.toFixed(2)}</span>
          </div>
          <button disabled={items.length===0} onClick={onCheckout} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50">Checkout</button>
        </div>
      </div>
    </div>
  )
}
