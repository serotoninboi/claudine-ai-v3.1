'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/AuthContext'
import { User, Zap, CreditCard, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

const navLinks = [
  { label: 'Studio', href: '/studio' },
  { label: 'Pose Edit', href: '/pose-edit' },
  { label: 'Pricing', href: '/pricing' },
]

export function Header() {
  const { user, logout, token } = useAuth()
  const pathname = usePathname()
  const [credits, setCredits] = useState<number | null>(null)

  useEffect(() => {
    if (!token) {
      queueMicrotask(() => setCredits(null))
      return
    }

    let cancelled = false
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (cancelled) return
        if (data?.user?.credits) {
          setCredits(data.user.credits)
        }
      })
      .catch((err) => {
        console.error('[header] Failed to fetch user info', err)
      })

    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-3xl">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2" aria-label="PixelForge Home">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#ff2d78] via-[#ff7ccf] to-[#a56bff] shadow-[0_0_25px_rgba(255,45,120,0.4)]">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.4em] text-muted-foreground">PixelForge</p>
              <p className="font-display text-lg uppercase tracking-tight text-white">
                {user?.name ? user.name.toUpperCase() : 'CLAUDINE.AI'}
              </p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[10px] font-mono uppercase tracking-[0.3em] transition-colors ${
                  pathname.startsWith(link.href) ? 'text-white' : 'text-muted-foreground/80 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.4em] text-white shadow-[0_0_25px_rgba(255,45,120,0.25)]">
                <Zap size={12} className="text-primary" />
                <span>{credits !== null ? `${credits} CREDITS` : 'LOADING…'}</span>
                <Link href="/pricing" className="text-muted-foreground/70 hover:text-white transition-colors">
                  <CreditCard size={12} />
                </Link>
              </div>

              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                  <p>Logged in</p>
                  <p className="text-white text-xs font-bold">{user.name}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-black/30 to-black/60 text-primary">
                  <User size={16} />
                </div>
                <button
                  onClick={logout}
                  className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-white"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-white/15 bg-gradient-to-r from-[#ff2d78] via-[#ff7ccf] to-[#a56bff] px-4 py-1.5 text-[10px] font-mono uppercase tracking-[0.4em] text-white shadow-[0_0_25px_rgba(255,45,120,0.35)]"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
