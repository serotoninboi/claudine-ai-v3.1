'use client'
import { useState, useCallback } from 'react'
import { useAuth } from '@/components/AuthContext'
import { DropZone } from '@/components/DropZone'
import { ResultPanel } from '@/components/ResultPanel'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { Shuffle } from 'lucide-react'

const POSE_PRESETS = [
  { id: 'standing', emoji: '🧍', label: 'Standing', desc: 'Neutral upright pose' },
  { id: 'sitting', emoji: '🪑', label: 'Sitting', desc: 'Seated, relaxed' },
  { id: 'walking', emoji: '🚶', label: 'Walking', desc: 'Mid-stride motion' },
  { id: 'arms_up', emoji: '🙌', label: 'Arms up', desc: 'Both arms raised' },
  { id: 'crossed', emoji: '🤗', label: 'Arms crossed', desc: 'Folded at chest' },
  { id: 'dancing', emoji: '💃', label: 'Dancing', desc: 'Dynamic dance move' },
]

export default function PoseEditPage() {
  const { token } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedPreset, setSelectedPreset] = useState('')
  const [customPose, setCustomPose] = useState('')
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

  const activePose = customPose.trim() || selectedPreset

  const handleSubmit = async () => {
    if (!file || !activePose) { setError('Upload an image and select or describe a pose'); return }
    setLoading(true); setError('')
    try {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('pose', activePose)
      const res = await fetch('/api/pose-edit', {
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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="text-[10px] font-mono uppercase tracking-[0.2em] border px-2 py-0.5"
            style={{ borderColor: 'rgba(255,45,120,0.3)', color: '#ff2d78', background: 'rgba(255,45,120,0.06)' }}
          >
            Pose Transfer
          </span>
          <span
            className="text-[10px] font-mono uppercase tracking-[0.2em] border px-2 py-0.5"
            style={{ borderColor: '#1e1e1e', color: '#7a6f6d', background: '#111111' }}
          >
            AnyPose
          </span>
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight" style={{ color: '#f0eae8' }}>
          Pose Editor
        </h1>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em]" style={{ color: '#8a8583' }}>
          Retarget any character to a new pose
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-5">
          <div>
            <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] font-mono" style={{ color: '#8a8583' }}>
              Source image
            </span>
            <DropZone onFile={handleFile} preview={preview} onClear={clear} />
          </div>

          {/* Pose presets grid */}
          <div>
            <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] font-mono" style={{ color: '#8a8583' }}>
              Select pose
            </span>
            <div className="grid grid-cols-3 gap-2">
              {POSE_PRESETS.map(p => {
                const isSelected = selectedPreset === p.desc && !customPose
                return (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedPreset(p.desc); setCustomPose('') }}
                    className="flex flex-col items-start gap-1 border p-3 text-left transition-all duration-150"
                    style={{
                      borderColor: isSelected ? 'rgba(255,45,120,0.4)' : '#1a1a1a',
                      background: isSelected ? 'rgba(255,45,120,0.06)' : '#0e0e0e',
                      boxShadow: isSelected ? '0 0 10px rgba(255,45,120,0.1)' : 'none',
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) e.currentTarget.style.borderColor = '#2a2a2a'
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) e.currentTarget.style.borderColor = '#1a1a1a'
                    }}
                  >
                    <span className="text-base">{p.emoji}</span>
                    <span
                      className="text-[11px] font-mono font-medium leading-none"
                      style={{ color: isSelected ? '#ff2d78' : '#f0eae8' }}
                    >
                      {p.label}
                    </span>
                    <span className="text-[9px] font-mono leading-none" style={{ color: '#6a6563' }}>
                      {p.desc}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <Input
            label="Or describe custom pose"
            placeholder="e.g. Person leaping with arms spread wide"
            value={customPose}
            onChange={e => { setCustomPose(e.target.value); setSelectedPreset('') }}
          />

          {error && <Alert variant="error">{error}</Alert>}

          <button
            onClick={handleSubmit}
            disabled={loading || !file || !activePose}
            className="h-11 w-full border font-mono text-[11px] uppercase tracking-[0.2em] transition-all duration-200 disabled:opacity-30 flex items-center justify-center gap-2"
            style={{ borderColor: '#ff2d78', color: '#ff2d78', background: 'rgba(255,45,120,0.06)' }}
            onMouseEnter={e => {
              if (!loading && file && activePose) {
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
                Applying
              </>
            ) : (
              <>
                <Shuffle size={13} />
                Apply pose
              </>
            )}
          </button>
        </div>

        <ResultPanel result={result} loading={loading} label="Pose output" />
      </div>
    </div>
  )
}

