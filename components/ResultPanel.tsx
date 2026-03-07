'use client'

import { Download, ImageIcon } from 'lucide-react'
import { Button } from './ui/button'

interface ResultPanelProps {
  result?: string | null
  loading?: boolean
  label?: string
}

export function ResultPanel({ result, loading, label = 'Output' }: ResultPanelProps) {
  return (
    <div className="flex flex-col gap-2">
      <span
        className="text-[10px] uppercase tracking-[0.2em] font-mono"
        style={{ color: '#3d3636' }}
      >
        {label}
      </span>
      <div
        className="relative min-h-[280px] border flex items-center justify-center overflow-hidden"
        style={{ background: '#0e0e0e', borderColor: '#1a1a1a' }}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-8 w-8">
              <div
                className="absolute inset-0 rounded-full border"
                style={{ borderColor: 'rgba(255,45,120,0.15)' }}
              />
              <div
                className="absolute inset-0 rounded-full border border-t-transparent animate-spin"
                style={{ borderColor: '#ff2d78', borderTopColor: 'transparent' }}
              />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: '#3d3636' }}>
              Processing
            </p>
          </div>
        ) : result ? (
          <img src={result} alt="Result" className="h-full w-full object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-2" style={{ color: '#2a2a2a' }}>
            <ImageIcon size={24} strokeWidth={1} />
            <p className="text-[10px] font-mono uppercase tracking-[0.15em]" style={{ color: '#2a2a2a' }}>
              Result appears here
            </p>
          </div>
        )}
      </div>

      {result && (
        <a href={result} download="pixelforge-result.png">
          <Button variant="outline" size="sm" className="w-full">
            <Download size={11} />
            Download
          </Button>
        </a>
      )}
    </div>
  )
}

