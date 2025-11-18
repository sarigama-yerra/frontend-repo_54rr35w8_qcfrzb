import { ShoppingCart, Search } from 'lucide-react'

export default function Navbar({ cartCount }) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/50 bg-white/70 border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-semibold tracking-tight">ShopSwift</a>

        <div className="hidden md:flex items-center gap-6">
          <a href="/" className="text-slate-700 hover:text-slate-900">Home</a>
          <a href="#products" className="text-slate-700 hover:text-slate-900">Products</a>
          <a href="#contact" className="text-slate-700 hover:text-slate-900">Contact</a>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <input type="text" placeholder="Search products..." className="pl-10 pr-3 py-2 rounded-full border bg-white/80 focus:bg-white focus:outline-none focus:ring-2 ring-blue-500" />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          </div>

          <a href="#cart" className="relative p-2 rounded-full hover:bg-slate-100">
            <ShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-blue-600 text-white rounded-full h-5 min-w-5 px-1 flex items-center justify-center">{cartCount}</span>
            )}
          </a>
        </div>
      </div>
    </header>
  )
}
