'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthContext'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('All fields required'); return }
    setLoading(true); setError('')
    try { await login(email, password) }
    catch (err) { setError(err instanceof Error ? err.message : 'Login failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="fade-up flex flex-col gap-8">
      {/* Header */}
      <div className="text-center">
        <div className="mb-6">
          <span className="text-[10px] font-mono tracking-[0.4em] uppercase" style={{ color: '#ff2d78' }}>
            PIXEL
          </span>
          <span className="text-[10px] font-mono tracking-[0.4em] uppercase ml-2" style={{ color: '#f0eae8' }}>
            FORGE
          </span>
        </div>
        <h1 className="text-2xl font-display font-semibold tracking-tight" style={{ color: '#f0eae8' }}>
          Welcome back
        </h1>
        <p className="mt-1.5 text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: '#3d3636' }}>
          Sign in to continue
        </p>
      </div>

      {/* Form */}
      <div className="border p-6 flex flex-col gap-5" style={{ background: '#0e0e0e', borderColor: '#1a1a1a' }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error && <Alert variant="error">{error}</Alert>}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 h-10 w-full border font-mono text-[11px] uppercase tracking-[0.2em] transition-all duration-200 disabled:opacity-40"
            style={{ borderColor: '#ff2d78', color: '#ff2d78', background: 'rgba(255,45,120,0.06)' }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.background = 'rgba(255,45,120,0.12)'
                e.currentTarget.style.boxShadow = '0 0 16px rgba(255,45,120,0.2)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,45,120,0.06)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Signing in
              </span>
            ) : 'Sign in'}
          </button>
        </form>
      </div>

      <p className="text-center text-[10px] font-mono uppercase tracking-[0.15em]" style={{ color: '#3d3636' }}>
        No account?{' '}
        <Link href="/register" className="transition-colors duration-200" style={{ color: '#ff2d78' }}>
          Create one
        </Link>
      </p>
    </div>
  )
}

