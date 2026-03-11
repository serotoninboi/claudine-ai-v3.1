'use client'
import { useState, useCallback } from 'react'
import { useAuth } from '@/components/AuthContext'
import { DropZone } from '@/components/DropZone'
import { ResultPanel } from '@/components/ResultPanel'
import { Textarea } from '@/components/ui/textarea'
import { Alert } from '@/components/ui/alert'
import { Wand2 } from 'lucide-react'

const QUICK_PROMPTS = [
  'Change background to golden sunset',
  'Make it look like a vintage oil painting',
  'Add dramatic cinematic lighting',
  'Convert to soft watercolor style',
  'Apply neon cyberpunk color grading',
]

export default function ImageEditPage() {
  const { token } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleFile = useCallback((f: File) => {
    setFile(f); setResult(null); setError('')
    const r = new FileReader()
    r.onload = () => setPreview(r.result as string)
    r.readAsDataURL(f)
  }, [])

  const clear = useCallback(() => { setFile(null); setPreview(null); setResult(null) }, [])

  const handleSubmit = async () => {
    if (!file || !prompt.trim()) { setError('Upload an image and enter a prompt'); return }
    setLoading(true); setError('')
    try {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('prompt', prompt)
      const res = await fetch('/api/image-edit', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-up">
      {/* Page header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className="text-[10px] font-mono uppercase tracking-[0.2em] border px-2 py-0.5"
              style={{ borderColor: 'rgba(255,45,120,0.3)', color: '#ff2d78', background: 'rgba(255,45,120,0.06)' }}
            >
              AI Edit
            </span>
            <span
              className="text-[10px] font-mono uppercase tracking-[0.2em] border px-2 py-0.5"
              style={{ borderColor: '#1e1e1e', color: '#7a6f6d', background: '#111111' }}
            >
              Qwen Vision
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight" style={{ color: '#f0eae8' }}>
            Image Editor
          </h1>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em]" style={{ color: '#8a8583' }}>
            Describe your edit — AI handles the rest
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left – inputs */}
        <div className="flex flex-col gap-5">
          <div>
            <span
              className="mb-2 block text-[10px] uppercase tracking-[0.2em] font-mono"
              style={{ color: '#3d3636' }}
            >
              Source image
            </span>
            <DropZone onFile={handleFile} preview={preview} onClear={clear} />
          </div>

          <Textarea
            label="Edit prompt"
            id="prompt"
            placeholder="e.g. Turn the background into a misty forest at dawn…"
            rows={4}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />

          {/* Quick prompts */}
          <div>
            <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] font-mono" style={{ color: '#8a8583' }}>
              Quick prompts
            </span>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => setPrompt(p)}
                  className="border px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.1em] transition-all duration-200"
                  style={{ borderColor: '#1e1e1e', color: '#7a6f6d', background: '#111111' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,45,120,0.3)'
                    e.currentTarget.style.color = '#ff6da0'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#1e1e1e'
                    e.currentTarget.style.color = '#7a6f6d'
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <button
            onClick={handleSubmit}
            disabled={loading || !file}
            className="h-11 w-full border font-mono text-[11px] uppercase tracking-[0.2em] transition-all duration-200 disabled:opacity-30 flex items-center justify-center gap-2"
            style={{ borderColor: '#ff2d78', color: '#ff2d78', background: 'rgba(255,45,120,0.06)' }}
            onMouseEnter={e => {
              if (!loading && file) {
                e.currentTarget.style.background = 'rgba(255,45,120,0.12)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(255,45,120,0.2)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,45,120,0.06)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Generating
              </>
            ) : (
              <>
                <Wand2 size={13} />
                Generate edit
              </>
            )}
          </button>
        </div>

        {/* Right – result */}
        <ResultPanel result={result} loading={loading} />
      </div>
    </div>
  )
}

