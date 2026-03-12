'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/AuthContext'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'

function RegisterForm() {
  const { register } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/studio'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setError('All fields required')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    setError('')
    try {
      await register(name, email, password)
      router.push(redirect)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-up mx-auto flex w-full max-w-md flex-col gap-8 rounded-[32px] border border-white/10 bg-black/70 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
      <div className="space-y-3 text-center">
        <p className="text-[10px] font-mono uppercase tracking-[0.6em] text-[#ffb4d7]">Create account</p>
        <h1 className="text-3xl font-display font-bold tracking-tight text-white">Join PixelForge</h1>
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#7a6f6d]">Craft seductive imagery with AI</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          label="Full name"
          placeholder="Jane Doe"
          value={name}
          onChange={e => setName(e.target.value)}
          autoComplete="name"
          className="border border-white/10 bg-black/40 text-white placeholder:text-[#7c7092]"
        />
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
          placeholder="Min 8 characters"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border border-white/10 bg-black/40 text-white placeholder:text-[#7c7092]"
        />
        <Input
          id="confirm"
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="border border-white/10 bg-black/40 text-white placeholder:text-[#7c7092]"
        />
        {error && <Alert variant="error" className="text-xs uppercase tracking-[0.3em]">{error}</Alert>}
        <button
          type="submit"
          disabled={loading}
          className="neon-button w-full rounded-2xl py-3 text-[11px] font-bold uppercase tracking-[0.4em]"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="text-center text-[10px] uppercase tracking-[0.3em] text-[#7a6f6d]">
        Already a member?{' '}
        <Link href="/login" className="text-[#ff6da0] underline-offset-4 hover:text-white">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(165,91,255,0.15),_transparent_60%)]" />
      <Suspense
        fallback={
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#ff2d78]" />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </main>
  )
}
