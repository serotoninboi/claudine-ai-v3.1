'use client'

import { useCallback, useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DropZoneProps {
  onFile: (file: File) => void
  preview?: string | null
  onClear?: () => void
}

export function DropZone({ onFile, preview, onClear }: DropZoneProps) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    onFile(file)
  }, [onFile])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <div className="relative">
      <div
        className={cn('drop-zone relative min-h-[200px] transition-all duration-200 cursor-pointer flex flex-col items-center justify-center')}
        style={{
          borderColor: dragging ? '#ff2d78' : (preview ? '#1a1a1a' : '#1e1e1e'),
          background: dragging ? 'rgba(255,45,120,0.04)' : '#0e0e0e',
          boxShadow: dragging ? '0 0 20px rgba(255,45,120,0.15)' : 'none',
        }}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !preview && inputRef.current?.click()}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="max-h-[200px] w-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <div
              className="flex h-10 w-10 items-center justify-center border"
              style={{ borderColor: '#1e1e1e', background: '#111111' }}
            >
              <Upload size={16} style={{ color: '#3d3636' }} />
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.15em]" style={{ color: '#3d3636' }}>
                Drop image here
              </p>
              <p className="mt-1 text-[10px] font-mono" style={{ color: '#2a2a2a' }}>
                PNG · JPG · WEBP
              </p>
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
      </div>

      {preview && onClear && (
        <button
          onClick={onClear}
          className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center border transition-all duration-200"
          style={{ background: 'rgba(10,10,10,0.9)', borderColor: '#2a2a2a', color: '#7a6f6d' }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#ff2d78'
            e.currentTarget.style.color = '#ff2d78'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#2a2a2a'
            e.currentTarget.style.color = '#7a6f6d'
          }}
        >
          <X size={11} />
        </button>
      )}
    </div>
  )
}

