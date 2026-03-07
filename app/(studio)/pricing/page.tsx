'use client'
import { useState } from 'react'
import { Check, Zap, Shield, CreditCard, HelpCircle, ChevronDown, ChevronUp, Lock, Bitcoin } from 'lucide-react'

const PLANS = [
  {
    name: 'Starter',
    price: '9.99',
    credits: 50,
    features: ['50 High-quality edits', 'Standard support', 'No watermark', 'Cloud storage (7 days)'],
    popular: false,
    color: 'rgba(255, 255, 255, 0.1)',
  },
  {
    name: 'Pro',
    price: '24.99',
    credits: 200,
    features: ['200 High-quality edits', 'Priority support', 'No watermark', 'Cloud storage (30 days)', 'Early access to new models'],
    popular: true,
    color: '#ff2d78',
  },
  {
    name: 'Unlimited',
    price: '49.99',
    credits: 500,
    features: ['500 High-quality edits', '24/7 VIP support', 'No watermark', 'Permanent cloud storage', 'Commercial license'],
    popular: false,
    color: '#ff2d78',
  },
  {
    name: 'Elite',
    price: '99.99',
    credits: 1200,
    features: ['1200 High-quality edits', 'Dedicated account manager', 'Custom model fine-tuning', 'API access (Beta)', 'Private Discord access'],
    popular: false,
    color: '#00f2ff', // Cyan neon for Elite
  },
]

const FAQS = [
  {
    q: "How do credits work?",
    a: "One credit equals one successful image generation or edit. Credits never expire as long as your account is active."
  },
  {
    q: "Is my content private?",
    a: "Absolutely. We use industry-standard encryption. Your source images and generated results are only accessible by you."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, Amex) and cryptocurrencies (BTC, ETH, USDT) for maximum privacy."
  },
  {
    q: "Can I get a refund?",
    a: "Due to the high cost of GPU inference, we cannot offer refunds once credits have been used. We recommend starting with the Starter pack."
  }
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handlePurchase = (planName: string) => {
    setLoading(planName)
    setTimeout(() => {
      alert(`Redirecting to secure payment for ${planName} plan...`)
      setLoading(null)
    }, 1000)
  }

  return (
    <div className="fade-up max-w-7xl mx-auto py-16 px-6">
      {/* Header Section */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
          <Zap size={12} className="text-primary fill-primary" />
          <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">Limited Time Offer: +20% Credits on Pro & Up</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
          POWER YOUR <span className="text-primary">IMAGINATION</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Choose your fuel. No subscriptions, no recurring fees. Just pure, unadulterated generative power.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
        {PLANS.map((plan) => (
          <div 
            key={plan.name}
            className={`group relative flex flex-col p-8 rounded-2xl border transition-all duration-500 hover:-translate-y-2 ${
              plan.popular 
                ? 'border-primary bg-primary/5 shadow-[0_0_40px_rgba(255,45,120,0.15)] z-10' 
                : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
            style={{ 
              boxShadow: plan.name === 'Elite' ? '0 0 40px rgba(0, 242, 255, 0.1)' : undefined,
              borderColor: plan.name === 'Elite' ? 'rgba(0, 242, 255, 0.2)' : undefined
            }}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-primary/20">
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <h3 className={`text-xl font-bold mb-2 uppercase tracking-tight ${plan.name === 'Elite' ? 'text-[#00f2ff]' : ''}`}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">€{plan.price}</span>
                <span className="text-muted-foreground text-xs font-mono">/PACK</span>
              </div>
              <div className="mt-6 flex items-center gap-2 font-mono text-sm" style={{ color: plan.color }}>
                <Zap size={14} className="fill-current" />
                <span className="font-bold">{plan.credits} Credits</span>
                <span className="text-[10px] text-muted-foreground ml-auto">€{(parseFloat(plan.price)/plan.credits).toFixed(2)}/cr</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground group-hover:text-white/80 transition-colors">
                  <Check size={16} className="shrink-0 mt-0.5" style={{ color: plan.color }} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePurchase(plan.name)}
              disabled={!!loading}
              className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden relative group/btn ${
                plan.popular
                  ? 'bg-primary text-white hover:shadow-[0_0_25px_rgba(255,45,120,0.4)]'
                  : plan.name === 'Elite'
                  ? 'bg-[#00f2ff] text-black hover:shadow-[0_0_25px_rgba(0,242,255,0.4)]'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                {loading === plan.name ? (
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard size={14} />
                    Secure Purchase
                  </>
                )}
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 mb-32 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="flex items-center gap-2 text-sm font-mono"><Shield size={18} /> SECURE SSL</div>
        <div className="flex items-center gap-2 text-sm font-mono"><Lock size={18} /> 256-BIT AES</div>
        <div className="flex items-center gap-2 text-sm font-mono"><Bitcoin size={18} /> CRYPTO READY</div>
        <div className="flex items-center gap-2 text-sm font-mono"><CreditCard size={18} /> DISCREET BILLING</div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mb-32">
        <h2 className="text-3xl font-bold mb-12 text-center tracking-tight">Frequently Asked <span className="text-primary font-mono italic">Questions</span></h2>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div 
              key={i} 
              className="border border-white/5 bg-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/10"
            >
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <span className="font-bold text-lg">{faq.q}</span>
                {openFaq === i ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-muted-foreground" />}
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6 text-muted-foreground leading-relaxed animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative p-12 rounded-3xl border border-primary/20 bg-primary/5 overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
        <p className="text-muted-foreground mb-8">Our support team is available 24/7 to help you with your creative journey.</p>
        <button className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/5 transition-colors font-mono text-xs uppercase tracking-widest">
          Contact Support
        </button>
      </div>
    </div>
  )
}
