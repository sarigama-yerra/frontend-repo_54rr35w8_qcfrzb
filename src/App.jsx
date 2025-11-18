import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import ProductCard from './components/ProductCard'
import CartDrawer from './components/CartDrawer'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function useSessionId() {
  return useMemo(() => {
    let id = localStorage.getItem('session_id')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('session_id', id)
    }
    return id
  }, [])
}

function App() {
  const sessionId = useSessionId()
  const [products, setProducts] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    const res = await fetch(`${API}/products`)
    if (res.ok) {
      const data = await res.json()
      if (data.length === 0) {
        // seed demo products
        await fetch(`${API}/seed`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ wipe: false }) })
        const again = await fetch(`${API}/products`)
        setProducts(await again.json())
      } else {
        setProducts(data)
      }
    }
  }

  const fetchCart = async () => {
    const res = await fetch(`${API}/cart/${sessionId}`)
    if (res.ok) setCart(await res.json())
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchProducts(), fetchCart()]).finally(() => setLoading(false))
  }, [])

  const addToCart = async (product) => {
    await fetch(`${API}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, product_id: product.id, quantity: 1, price_at_add: product.price })
    })
    await fetchCart()
    setCartOpen(true)
  }

  const removeFromCart = async (item) => {
    await fetch(`${API}/cart/${sessionId}/${item.id}`, { method: 'DELETE' })
    await fetchCart()
  }

  const onCheckout = async () => {
    const items = cart.map((it) => ({
      product_id: it.product_id,
      title: it.product?.title,
      price: it.product?.price,
      quantity: it.quantity,
      image: it.product?.image
    }))
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
    const res = await fetch(`${API}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        items,
        total_amount: total,
        customer_name: 'Guest',
        customer_email: 'guest@example.com',
        shipping_address: 'N/A'
      })
    })
    if (res.ok) {
      await fetchCart()
      alert('Order placed successfully!')
      setCartOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar cartCount={cart.reduce((s, i) => s + i.quantity, 0)} />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <section className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">Find your next favorite gadget</h1>
          <p className="text-slate-600">Quality tech products curated for you</p>
        </section>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <section id="products" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} />
            ))}
          </section>
        )}
      </main>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onRemove={removeFromCart} onCheckout={onCheckout} />
    </div>
  )
}

export default App
