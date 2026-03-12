'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'

function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/studio'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('All fields required')
      return
    }
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      router.push(redirect)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-up mx-auto flex w-full max-w-md flex-col gap-8 rounded-[32px] border border-white/10 bg-black/70 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
      <div className="space-y-3 text-center">
        <p className="text-[10px] font-mono uppercase tracking-[0.6em] text-[#ffb4d7]">Welcome back</p>
        <h1 className="text-3xl font-display font-bold tracking-tight text-white">Sign in</h1>
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#7a6f6d]">Continue crafting seductive imagery</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          className="border border-white/10 bg-black/40 text-white placeholder:text-[#7c7092]"
        />
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          className="border border-white/10 bg-black/40 text-white placeholder:text-[#7c7092]"
        />
        {error && <Alert variant="error" className="text-xs uppercase tracking-[0.3em]">{error}</Alert>}
        <button
          type="submit"
          disabled={loading}
          className="neon-button w-full rounded-2xl py-3 text-[11px] font-bold uppercase tracking-[0.4em]"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="text-center text-[10px] uppercase tracking-[0.3em] text-[#7a6f6d]">
        No account?{' '}
        <Link href="/register" className="text-[#ff6da0] underline-offset-4 hover:text-white">
          Create one
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,45,120,0.15),_transparent_55%)]" />
      <Suspense
        fallback={
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#ff2d78]" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  )
}
