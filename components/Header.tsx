'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/AuthContext'
import { LogOut, User, Zap, CreditCard, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Header() {
  const { user, logout, token } = useAuth()
  const pathname = usePathname()
  const [credits, setCredits] = useState<number | null>(null)

  useEffect(() => {
    if (token) {
      fetch('/api/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) setCredits(data.user.credits)
      })
      .catch(console.error)
    }
  }, [token, pathname])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,45,120,0.3)] group-hover:scale-110 transition-transform duration-300">
              <Sparkles size={14} className="text-white fill-white" />
            </div>
            <span className="font-display text-lg font-bold tracking-tighter text-white">
              CLAUDINE<span className="text-primary">.AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/studio" 
              className={`text-[10px] font-mono uppercase tracking-widest transition-colors ${
                pathname === '/studio' ? 'text-primary' : 'text-muted-foreground hover:text-white'
              }`}
            >
              Studio
            </Link>
            <Link 
              href="/pricing" 
              className={`text-[10px] font-mono uppercase tracking-widest transition-colors ${
                pathname === '/pricing' ? 'text-primary' : 'text-muted-foreground hover:text-white'
              }`}
            >
              Pricing
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                <Zap size={10} className="text-primary fill-primary" />
                <span className="text-[9px] font-mono font-bold text-white">
                  {credits !== null ? `${credits} CREDITS` : '...'}
                </span>
                <Link href="/pricing" className="ml-1 p-0.5 hover:bg-white/10 rounded transition-colors">
                  <CreditCard size={10} className="text-muted-foreground" />
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end hidden lg:flex">
                  <p className="text-[9px] font-mono text-muted-foreground leading-none mb-1 uppercase tracking-tighter">Logged in</p>
                  <p className="text-[11px] font-bold text-white leading-none">{user.name}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                  <User size={14} className="text-primary" />
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                  title="Logout"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/register" className="cyber-button rounded-none text-[9px] px-4 py-1.5">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
