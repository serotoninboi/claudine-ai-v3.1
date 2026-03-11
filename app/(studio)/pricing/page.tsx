'use client'
import { useState } from 'react'
import { Check, Zap, ChevronDown, ChevronUp } from 'lucide-react'

const PLANS = [
  {
    name: 'Starter',
    price: '9.99',
    credits: 50,
    features: ['50 high-quality edits', 'Standard support', 'No watermark', 'Cloud storage (7 days)'],
    popular: false,
    color: 'rgba(255, 45, 120, 0.35)',
  },
  {
    name: 'Pro',
    price: '24.99',
    credits: 200,
    features: ['200 high-quality edits', 'Priority support', 'No watermark', 'Cloud storage (30 days)', 'Early access to new models'],
    popular: true,
    color: 'rgba(255, 45, 120, 0.7)',
  },
  {
    name: 'Unlimited',
    price: '49.99',
    credits: 500,
    features: ['500 high-quality edits', '24/7 VIP support', 'No watermark', 'Permanent cloud storage', 'Commercial license'],
    popular: false,
    color: 'rgba(165, 91, 255, 0.7)',
  },
  {
    name: 'Elite',
    price: '99.99',
    credits: 1200,
    features: ['1200 edits', 'Dedicated strategist', 'Custom fine-tuning', 'API access (beta)', 'Private Discord'],
    popular: false,
    color: 'rgba(0, 242, 255, 0.7)',
  },
]

const FAQS = [
  {
    q: 'How do credits work?',
    a: 'One credit equals one successful generation. Credits remain as long as your account is active.',
  },
  {
    q: 'Is my content private?',
    a: 'Yes—everything is encrypted and only accessible by you.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'Cards (Visa/Mastercard/Amex) and crypto (BTC, ETH, USDT).',
  },
  {
    q: 'Can I get a refund?',
    a: 'No refunds once credits are consumed due to GPU costs. Start with Starter if unsure.',
  },
]

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handlePurchase = (planName: string) => {
    setLoadingPlan(planName)
    setTimeout(() => setLoadingPlan(null), 1500)
  }

  return (
    <div className="relative py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,45,120,0.12),_transparent_60%)]" />
      <div className="relative z-10 mx-auto max-w-6xl space-y-16 px-4">
        <header className="rounded-[28px] border border-white/10 bg-black/70 p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.85)]">
          <div className="flex items-center justify-center gap-3">
            <Zap size={20} className="text-[#ff6da0]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.6em] text-[#f6d1fa]">Limited time</span>
          </div>
          <h1 className="mt-4 text-4xl font-display font-bold tracking-tight text-white">Power your imagination</h1>
          <p className="mt-2 text-[12px] uppercase tracking-[0.3em] text-[#8f8397]">No subscriptions. Just pure generative fuel.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className={`relative overflow-hidden rounded-[32px] border border-white/10 bg-black/60 p-6 shadow-[0_30px_60px_rgba(0,0,0,0.85)] ${
                plan.popular ? 'border-[#ff6da0]' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-gradient-to-r from-[#ff2d78] to-[#a55bff] px-5 py-1 text-[10px] font-mono uppercase tracking-[0.4em] text-white shadow-lg shadow-[#ff2d78]/40">
                  Most Popular
                </div>
              )}
              <div className="space-y-2 pt-4">
                <p className="text-[12px] uppercase tracking-[0.6em] text-[#a99bc8]">{plan.name}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">€{plan.price}</span>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#7a6f6d]">/pack</span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.5em]" style={{ color: plan.color }}>
                  {plan.credits} Credits
                </p>
              </div>
              <ul className="mt-6 space-y-3 text-[11px] text-[#a58fc6]">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check size={16} className="mt-1 text-[#ff6da0]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePurchase(plan.name)}
                disabled={!!loadingPlan}
                className="mt-6 neon-button w-full rounded-2xl py-4 text-[11px] font-bold uppercase tracking-[0.4em]"
              >
                {loadingPlan === plan.name ? 'Processing…' : 'Secure purchase'}
              </button>
            </div>
          ))}
        </div>

        <section className="space-y-6 rounded-[32px] border border-white/10 bg-black/60 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.9)]">
          <h2 className="text-center text-3xl font-display font-bold tracking-tight text-white">Frequently asked questions</h2>
          <div className="grid gap-3">
            {FAQS.map((faq, index) => (
              <div key={faq.q} className="overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(160deg,_rgba(255,45,120,0.05),_rgba(10,0,10,0.9))]">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-[13px] font-semibold uppercase tracking-[0.2em] text-white"
                >
                  {faq.q}
                  {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-4 text-[12px] uppercase tracking-[0.4em] text-[#b7accd]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-[32px] border border-white/10 bg-[linear-gradient(90deg,_rgba(255,45,120,0.12),_rgba(10,0,10,0.95))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.9)]">
          <div>
            <p className="text-[12px] uppercase tracking-[0.6em] text-[#8f8397]">Questions?</p>
            <h3 className="text-3xl font-display font-bold text-white">Support 24/7</h3>
            <p className="text-[11px] text-[#b7accd]">Reach out via DM or email—our creative team stays on call.</p>
          </div>
          <button className="neon-button rounded-2xl py-3 px-6 text-[11px] font-bold uppercase tracking-[0.4em]">
            Contact support
          </button>
        </section>
      </div>
    </div>
  )
}
