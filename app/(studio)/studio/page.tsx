'use client'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/components/AuthContext'
import { DropZone } from '@/components/DropZone'
import { Textarea } from '@/components/ui/textarea'
import { Alert } from '@/components/ui/alert'
import { Wand2, Sparkles, History, Settings, Zap, Image as ImageIcon, Layers, Share2, Download } from 'lucide-react'

const QUICK_PROMPTS = [
  { label: 'Sunset', prompt: 'Change background to golden sunset' },
  { label: 'Cyberpunk', prompt: 'Apply neon cyberpunk color grading' },
  { label: 'Oil Painting', prompt: 'Make it look like a vintage oil painting' },
  { label: 'Cinematic', prompt: 'Add dramatic cinematic lighting' },
]

export default function StudioPage() {
  const { token } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('edit')

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
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden bg-[#050505]">
      {/* Left Sidebar - Tools */}
      <aside className="w-16 border-r border-white/5 flex flex-col items-center py-6 gap-6 bg-black/40 backdrop-blur-xl">
        <ToolIcon icon={ImageIcon} active={activeTab === 'edit'} onClick={() => setActiveTab('edit')} label="Studio" />
        <ToolIcon icon={Layers} active={activeTab === 'layers'} onClick={() => setActiveTab('layers')} label="Layers" />
        <ToolIcon icon={History} active={activeTab === 'history'} onClick={() => setActiveTab('history')} label="History" />
        <div className="mt-auto">
          <ToolIcon icon={Settings} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} label="Settings" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className="w-[400px] border-r border-white/5 flex flex-col bg-black/20 p-6 overflow-y-auto custom-scrollbar">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary">AI Engine Active</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Claudine Studio</h1>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">v3.1 - Claudine.ai Generative Engine</p>
          </header>

          <div className="space-y-8">
            {/* Image Upload Section */}
            <section>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">Source Asset</label>
              <div className="relative group">
                <DropZone onFile={handleFile} preview={preview} onClear={clear} />
                {preview && (
                  <motion.button 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    onClick={clear}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/20 border border-white/10 rounded-lg text-white/60 hover:text-red-500 transition-all"
                  >
                    <Share2 size={14} />
                  </motion.button>
                )}
              </div>
            </section>

            {/* Prompt Section */}
            <section>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">Transformation Prompt</label>
              <div className="relative">
                <Textarea
                  placeholder="Describe the transformation..."
                  className="bg-white/5 border-white/10 focus:border-primary/50 min-h-[120px] text-sm resize-none"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                />
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-muted-foreground hover:text-white transition-all">
                    <Sparkles size={14} />
                  </button>
                </div>
              </div>
            </section>

            {/* Quick Presets */}
            <section>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">Quick Presets</label>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setPrompt(p.prompt)}
                    className="px-3 py-2 bg-white/5 border border-white/10 hover:border-primary/30 rounded-lg text-[10px] font-mono text-muted-foreground hover:text-primary transition-all text-left"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </section>

            {error && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Alert variant="error" className="bg-red-500/10 border-red-500/20 text-red-500 text-xs">
                  {error}
                </Alert>
              </motion.div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !file}
              className="w-full py-4 bg-primary hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Wand2 size={16} className="group-hover:rotate-12 transition-transform" />
                  Generate Transformation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative bg-[#080808] flex items-center justify-center p-12">
          <div className="absolute inset-0 opacity-20 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#1a1a1a 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="relative max-w-full max-h-full shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden border border-white/10"
              >
                <img src={result} alt="Result" className="max-w-full max-h-[70vh] object-contain" />
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button className="p-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-primary transition-all">
                    <Download size={18} />
                  </button>
                  <button className="p-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-primary transition-all">
                    <Share2 size={18} />
                  </button>
                </div>
              </motion.div>
            ) : loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap size={32} className="text-primary animate-pulse" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-lg mb-1">Forging Image...</p>
                  <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest">Neural Network Processing</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center max-w-md"
              >
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <ImageIcon size={32} className="text-white/20" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Ready for Transformation</h3>
                <p className="text-muted-foreground text-sm">Upload an image and describe your vision in the left panel to begin the generative process.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

function ToolIcon({ icon: Icon, active, onClick, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`relative group p-3 rounded-xl transition-all duration-300 ${
        active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={20} />
      <div className="absolute left-full ml-4 px-2 py-1 bg-black border border-white/10 rounded text-[10px] font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
        {label}
      </div>
    </button>
  )
}
