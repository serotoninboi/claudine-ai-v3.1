'use client'
import Link from 'next/link'
import { Sparkles, Zap, RotateCcw } from 'lucide-react'

const HERO_TAGS = ['Neon Couture', 'Cinematic Retouch', 'Predictive Poses']
const FEATURES = [
  {
    title: 'Creative Command Deck',
    copy: 'Meld prompts, sketches, and reference boards in one tactile canvas with live feedback.',
    accent: 'glow'
  },
  {
    title: 'Intelligent Pose Director',
    copy: 'Switch between physics-aware pose exploration, loci analysis, and cinematic framing lanes.',
    accent: 'ember'
  },
  {
    title: 'Studio Memory Vault',
    copy: 'Every edit is versioned, timestamped, and shareable with clients or collaborators.',
    accent: 'aurora'
  },
]
const JOURNEY = [
  {
    label: '1',
    title: 'Launch the atelier',
    body: 'Drag your reference, lock the mood, and watch the neon grid awaken with intent.'
  },
  {
    label: '2',
    title: 'Orchestrate light & pose',
    body: 'Control lighting envelopes, pose chains, and generative prompts with tactile sliders.'
  },
  {
    label: '3',
    title: 'Deliver cinematic stills',
    body: 'Export layered assets, credits statements, and a sharable story reel instantly.'
  },
]

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,45,120,0.2),_transparent_55%),_radial-gradient(circle_at_20%_30%,_rgba(165,91,255,0.25),_transparent_40%),linear-gradient(160deg,_rgba(3,0,9,0.97),_rgba(7,1,17,0.95))]">
      <div className="pointer-events-none absolute inset-0 opacity-70" style={{ backgroundImage: 'radial-gradient(circle at 20% 0%, rgba(255,45,120,0.3), transparent 45%)' }} />
      <div className="pointer-events-none absolute inset-0 opacity-70" style={{ backgroundImage: 'radial-gradient(circle at 80% 10%, rgba(165,91,255,0.3), transparent 40%)' }} />
      <main className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col gap-16 px-4 py-12 lg:py-20">
        <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[linear-gradient(145deg,_rgba(255,45,120,0.15),_rgba(255,45,120,0))] p-8 shadow-[0_45px_90px_rgba(0,0,0,0.85)]">
          <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-end">
            <div className="flex-1 space-y-6">
              <p className="text-[10px] uppercase tracking-[0.5em] text-[rgba(255,255,255,0.6)]">ClaudiNe Atelier</p>
              <h1 className="font-oxanium text-5xl font-semibold uppercase tracking-tight text-white sm:text-6xl">
                Seductive worlds crafted in real time
              </h1>
              <p className="max-w-2xl readable-copy">
                A luxe studio that channels cinematic lighting, sculpted poses, and generative nuance into every edit.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/studio" className="neon-button rounded-2xl px-6 py-3 text-[11px]">
                  {""}Enter Studio
                </Link>
                <Link
                  href="/pricing"
                  className="rounded-2xl border border-white/20 px-6 py-3 text-[11px] uppercase tracking-[0.4em] text-white transition hover:border-white"
                >
                  View pricing
                </Link>
              </div>
              <div className="flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.4em] text-[#c2b5d2]">
                {HERO_TAGS.map(tag => (
                  <span key={tag} className="rounded-full border border-white/20 px-3 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 text-[10px] uppercase tracking-[0.4em] text-[#c0b4dc]">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-5 py-3">
                <Zap size={18} className="text-[#ff6da0]" />
                <div>
                  <p className="text-sm font-semibold text-white">Live previews</p>
                  <p>Color-wave delta <span className="font-bold text-[#ff6da0]">+48%</span></p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-5 py-3">
                <Sparkles size={18} className="text-[#a55bff]" />
                <div>
                  <p className="text-sm font-semibold text-white">Pose recall</p>
                  <p>Chain edits at <span className="font-bold text-[#a55bff]">120fps</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {FEATURES.map(feature => (
            <article
              key={feature.title}
              className="neon-panel relative overflow-hidden rounded-[32px] border border-white/10 p-6"
            >
              <div
                className={`absolute inset-0 opacity-50 ${
                  feature.accent === 'glow'
                    ? 'bg-[radial-gradient(circle,_rgba(255,45,120,0.25),_transparent_70%)]'
                    : feature.accent === 'ember'
                    ? 'bg-[radial-gradient(circle,_rgba(255,107,160,0.25),_transparent_65%)]'
                    : 'bg-[radial-gradient(circle,_rgba(165,91,255,0.3),_transparent_60%)]'
                }`}
              />
              <div className="relative z-10 space-y-3">
                <p className="text-[9px] uppercase tracking-[0.6em] text-[#a298c4]">insight</p>
                <h3 className="text-2xl font-oxanium font-semibold text-white">{feature.title}</h3>
                <p className="readable-copy">
                  {feature.copy}
                </p>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-6 rounded-[40px] border border-white/10 bg-black/60 p-8 lg:grid-cols-3">
          {JOURNEY.map(step => (
            <div key={step.title} className="relative space-y-4 rounded-[32px] border border-white/5 bg-[rgba(4,0,10,0.6)] p-6">
              <div className="text-[32px] font-oxanium text-[#ff6da0]">{step.label}</div>
              <h4 className="text-xl font-semibold uppercase tracking-[0.5em] text-white">{step.title}</h4>
              <p className="readable-copy text-[#ada0c2]">{step.body}</p>
            </div>
          ))}
          <div className="flex flex-col justify-between rounded-[32px] border border-dashed border-white/10 p-6 text-[11px] uppercase tracking-[0.4em] text-[#f7e4ff]">
            <div>
              <p className="text-[9px] tracking-[0.7em] text-[#b7accd]">Immersion</p>
              <h4 className="mt-2 text-3xl font-oxanium text-white">Focus Mode</h4>
              <p className="mt-2 text-[12px] text-[#dcd3ff]">Tap the floating spark to trigger a cinematic wipe on the hero canvas.</p>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <RotateCcw size={20} className="text-[#ff6da0]" />
              <span className="text-[12px]">Live sync across devices + collaborators</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
