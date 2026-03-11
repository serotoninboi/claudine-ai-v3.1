'use client'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/components/AuthContext'
import { DropZone } from '@/components/DropZone'
import { Textarea } from '@/components/ui/textarea'
import { Alert } from '@/components/ui/alert'
import { Sparkles, Zap } from 'lucide-react'

const QUICK_PROMPTS = [
  { label: 'Sunset', prompt: 'Shift the background to a molten sunset glow' },
  { label: 'Cyberpunk', prompt: 'Neon outlines, rainy streets, cinematic lighting' },
  { label: 'Oil Painting', prompt: 'Render it like a dramatic oil portrait with deep shadows' },
  { label: 'Cinematic', prompt: 'Add volumetric light and theatrical lens flares' },
]

export default function StudioPage() {
  const { token } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('image')

  const handleFile = useCallback((f: File) => {
    setFile(f)
    setResult(null)
    setError('')
    const r = new FileReader()
    r.onload = () => setPreview(r.result as string)
    r.readAsDataURL(f)
  }, [])

  const clear = useCallback(() => {
    setFile(null)
    setPreview(null)
    setResult(null)
  }, [])

  const handleSubmit = async () => {
    if (!file || !prompt.trim()) {
      setError('Upload an image and describe your vision')
      return
    }

    setLoading(true)
    setError('')
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
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-br from-[#ff2d78] to-transparent blur-[120px]
                     opacity-50"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-[#a55bff]/50 to-transparent blur-[150px]"
      />

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] max-w-[1400px] flex-col gap-8 px-4 py-10 lg:flex-row">
        <section className="w-full max-w-xl space-y-6 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.05),_rgba(255,255,255,0))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.8)] lg:sticky lg:top-10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-[#f0dffb]">Studio</p>
              <h1 className="text-3xl font-display tracking-tight text-white">Seductive Alchemy</h1>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[10px] uppercase tracking-[0.4em] text-[#f3c5e3]">
              <Zap size={14} />
              Live Engine
            </div>
          </div>

          <div className="flex gap-3">
            {['image', 'pose'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-2xl border px-3 py-2 text-[10px] font-mono uppercase tracking-[0.4em] transition ${
                  activeTab === tab
                    ? 'border-[#ff6da0] bg-gradient-to-r from-[#ff2d78]/40 to-[#a55bff]/20 text-white'
                    : 'border-white/10 text-[#b1abc4] hover:border-[#ff2d78]/40 hover:text-white'
                }`}
              >
                {tab === 'image' ? 'Image Edit' : 'Pose Studio'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8f8397]">Source asset</p>
              <DropZone onFile={handleFile} preview={preview} onClear={clear} />
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#7b6e8d]">Transformation prompt</p>
              <Textarea
                placeholder="Describe the transformation with cinematic precision..."
                className="border border-white/15 bg-black/40 text-sm text-white placeholder:text-[#7c7092]"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
              />
            </div>

            <div>
              <p className="text-[9px] font-mono uppercase tracking-[0.5em] text-[#6b6378]">quick prompts</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {QUICK_PROMPTS.map(p => (
                  <button
                    key={p.label}
                    onClick={() => setPrompt(p.prompt)}
                    className="rounded-2xl border border-white/10 bg-[#130014] px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-[#ffc3e5] transition hover:border-[#ff2d78] hover:text-white"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="text-xs uppercase tracking-[0.3em]">
              {error}
            </Alert>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !file}
            className="neon-button w-full rounded-2xl py-4 text-[11px] font-bold uppercase tracking-[0.4em]"
          >
            {loading ? 'Forging...' : 'Generate Seduction'}
          </button>
        </section>

        <section className="relative flex-1 overflow-hidden rounded-[38px] border border-white/10 bg-black/60 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.9)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(255,45,120,0.16),_transparent_55%)]" />
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#b7accd]">Live Preview</p>
                <p className="text-xs text-[#a08fb7]">Inspired by imggen.org</p>
              </div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.4em] text-[#f0dffb]">
                <span className="h-2 w-2 rounded-full bg-[#ff6da0]" />
                Streaming
              </div>
            </div>

            <div className="relative h-[480px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#050006] to-[#02000a]">
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,45,120,0.25), transparent 60%)' }} />
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.img
                    key="result"
                    src={result}
                    alt="Result"
                    className="relative z-10 h-full w-full object-contain"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  />
                ) : loading ? (
                  <motion.div
                    key="loading"
                    className="relative z-10 flex h-full flex-col items-center justify-center gap-4 text-center text-sm uppercase tracking-[0.3em] text-[#d1c5ef]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10">
                      <Sparkles size={32} className="text-[#ff6da0]" />
                    </div>
                    <p>Forging composition...</p>
                    <p className="text-[10px] text-[#8f8397]">AI cores 49% utilization</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    className="relative z-10 flex h-full flex-col items-center justify-center gap-4 text-center text-sm uppercase tracking-[0.3em] text-[#a08fb7]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Sparkles size={36} className="text-[#ff2d78]" />
                    <p>Ready to enchant</p>
                    <p className="text-[10px] text-[#7a6f6d]">Upload a photo, describe the vibe, and let the engine breathe</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[10px] uppercase tracking-[0.4em] text-[#a08fb7]">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-[12px] text-white">Credits left</p>
                <p className="text-3xl font-bold text-[#ff6da0]">298</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-[12px] text-white">Latency</p>
                <p className="text-3xl font-bold text-[#a55bff]">0.86s</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
