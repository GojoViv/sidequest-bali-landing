'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mountain, Waves, Users, MapPin, Calendar, CheckCircle2,
  Plus, ArrowRight, Compass, Star, Sunrise, TreePalm,
  Globe, Menu, X,
} from 'lucide-react'

const itinerary = [
  { day: 1, date: 'May 9', theme: 'Arrival & Check-in', icon: MapPin, color: 'green', highlights: ['Arrival in Bali', 'Private transfers to Ubud (groups of 5+)', 'Hotel check-in', 'Balinese welcome dinner in the villa'] },
  { day: 2, date: 'May 10', theme: 'Culture + Adventure', icon: Compass, color: 'gold', highlights: ['Tirta Empul temple (8:00–10:30 AM)', 'Breakfast at villa', 'ATV ride (optional)', 'Jungle Club from 3:30 PM (included)'] },
  { day: 3, date: 'May 11', theme: 'The Hike', icon: Mountain, color: 'green', highlights: ['Sunrise hike up Mount Batur (included)', 'Hot springs session (included)', 'Return to Ubud'] },
  { day: 4, date: 'May 12', theme: 'School Immersion + Free Day', icon: Globe, color: 'gold', highlights: ['Visit to Green School Bali (included)', 'School tour and field experience', 'Free time to explore Ubud'] },
  { day: 5, date: 'May 13', theme: 'Snorkel Day', icon: Waves, color: 'green', highlights: ['Check-out from Ubud', 'Transfer to Sanur → fast boat to Nusa Penida (included)', 'Manta ray snorkeling (included)', 'Explore the island', 'Transfer + hotel check-in in Canggu'] },
  { day: 6, date: 'May 14', theme: 'Beach Club Day', icon: TreePalm, color: 'gold', highlights: ['Morning surf lesson (optional)', 'Free morning in Canggu', 'Luna Beach Club afternoon (included)'] },
  { day: 7, date: 'May 15', theme: 'Company Immersion', icon: Users, color: 'green', highlights: ['Local company immersion session (included)', 'Finns Beach Club + group transfer (included)'] },
  { day: 8, date: 'May 16', theme: 'Free + Closing Night', icon: Star, color: 'gold', highlights: ['Free morning', 'Closing night: Savaya club entry + group transfer (included)'] },
  { day: 9, date: 'May 17', theme: 'Departure', icon: Sunrise, color: 'green', highlights: ['Breakfast (included)', 'Airport transfers (groups of 5+)'] },
]

const included = [
  'Accommodation in luxury villas and hotels',
  'Daily breakfast',
  'Airport transfers (groups of 5+)',
  'All intercity transfers (Ubud → Canggu, Sanur, etc.)',
  'Balinese welcome dinner in the villa',
  'Jungle Club access',
  'Tirta Empul temple visit',
  'Mount Batur sunrise hike',
  'Hot springs experience',
  'Green School Bali visit & immersion',
  'Fast boat to Nusa Penida',
  'Manta ray snorkeling experience',
  'Finns Beach Club access + group transfer',
  'Luna Beach Club access',
  'Savaya club entry + closing night',
  'On-ground coordination and trip support',
]

const addons = [
  { name: 'ATV ride in Ubud', icon: '🏍️' },
  { name: 'Waterfall exploration', icon: '🌊' },
  { name: 'Yoga / wellness session', icon: '🧘' },
  { name: 'Surf lessons', icon: '🏄' },
]

const experiences = [
  { label: 'Manta Ray Snorkeling', location: 'Nusa Penida', icon: '🐟' },
  { label: 'Mount Batur Sunrise', location: 'Active Volcano', icon: '🌋' },
  { label: 'Green School Immersion', location: 'Ubud, Bali', icon: '🌿' },
  { label: 'Founders & NGO Access', location: 'Curated Sessions', icon: '🤝' },
]

function ReserveForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [school, setSchool] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, school }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-[#2dbd6e]/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-[#2dbd6e]" />
        </div>
        <h3 className="text-2xl font-semibold text-[#f0f7f2] mb-2">You&apos;re on the list.</h3>
        <p className="text-[#8fa898]">We&apos;ll be in touch with details about your spot in Bali.</p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-[#8fa898] mb-1.5 font-medium">Full Name</label>
          <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
            className="w-full bg-[#0f1611] border border-[#1e2d24] rounded-lg px-4 py-3 text-[#f0f7f2] placeholder:text-[#5a7060] focus:outline-none focus:border-[#2dbd6e] transition-colors" />
        </div>
        <div>
          <label className="block text-sm text-[#8fa898] mb-1.5 font-medium">Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@school.edu"
            className="w-full bg-[#0f1611] border border-[#1e2d24] rounded-lg px-4 py-3 text-[#f0f7f2] placeholder:text-[#5a7060] focus:outline-none focus:border-[#2dbd6e] transition-colors" />
        </div>
      </div>
      <div>
        <label className="block text-sm text-[#8fa898] mb-1.5 font-medium">School / Program <span className="text-[#5a7060]">(optional)</span></label>
        <input type="text" value={school} onChange={e => setSchool(e.target.value)} placeholder="e.g. Wharton MBA 2025"
          className="w-full bg-[#0f1611] border border-[#1e2d24] rounded-lg px-4 py-3 text-[#f0f7f2] placeholder:text-[#5a7060] focus:outline-none focus:border-[#2dbd6e] transition-colors" />
      </div>
      <button type="submit" disabled={status === 'loading'}
        className="w-full bg-[#2dbd6e] hover:bg-[#3dda82] text-[#080c0a] font-semibold py-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-base disabled:opacity-60">
        {status === 'loading' ? 'Reserving...' : <><span>Reserve Your Spot</span><ArrowRight className="w-4 h-4" /></>}
      </button>
      {status === 'error' && <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>}
      <p className="text-[#5a7060] text-xs text-center">Limited spots available. No payment required to reserve.</p>
    </form>
  )
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 backdrop-blur-md bg-[#080c0a]/80 border-b border-[#1e2d24]">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2dbd6e]/20 border border-[#2dbd6e]/30 flex items-center justify-center">
              <Compass className="w-4 h-4 text-[#2dbd6e]" />
            </div>
            <span className="font-semibold text-[#f0f7f2] tracking-tight">SideQuest</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#itinerary" className="text-sm text-[#8fa898] hover:text-[#f0f7f2] transition-colors">Itinerary</a>
            <a href="#whats-included" className="text-sm text-[#8fa898] hover:text-[#f0f7f2] transition-colors">What&apos;s Included</a>
            <a href="#reserve" className="text-sm bg-[#2dbd6e] hover:bg-[#3dda82] text-[#080c0a] font-semibold px-4 py-2 rounded-lg transition-colors">Reserve Your Spot</a>
          </div>
          <button className="md:hidden text-[#8fa898]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#0f1611] border-b border-[#1e2d24] px-6 py-4 space-y-4">
            <a href="#itinerary" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-[#8fa898] hover:text-[#f0f7f2]">Itinerary</a>
            <a href="#whats-included" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-[#8fa898] hover:text-[#f0f7f2]">What&apos;s Included</a>
            <a href="#reserve" onClick={() => setMobileMenuOpen(false)} className="block text-sm bg-[#2dbd6e] text-[#080c0a] font-semibold px-4 py-2 rounded-lg text-center">Reserve Your Spot</a>
          </motion.div>
        )}
      </nav>

      {/* Hero */}
      <section className="hero-gradient min-h-screen flex flex-col items-center justify-center pt-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #2dbd6e 1px, transparent 0)`, backgroundSize: '48px 48px' }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2dbd6e]/30 bg-[#2dbd6e]/10 text-[#2dbd6e] text-sm font-medium mb-8">
            <Calendar className="w-3.5 h-3.5" />
            May 9–17, 2025 · Bali, Indonesia
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            Travel with{' '}<span className="gradient-text">Intention.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-[#8fa898] max-w-2xl mx-auto mb-4 leading-relaxed">
            9 days in Bali. Bucket-list experiences. Curated access to founders, NGOs, and changemakers.
            Built for MBAs who want more than a vacation.
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            className="text-sm text-[#5a7060] mb-10">
            Swim with manta rays. Hike an active volcano at sunrise. Meet the people building tomorrow.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#reserve" className="inline-flex items-center gap-2 bg-[#2dbd6e] hover:bg-[#3dda82] text-[#080c0a] font-semibold px-8 py-4 rounded-xl transition-colors duration-200 text-base">
              Reserve Your Spot <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#itinerary" className="inline-flex items-center gap-2 border border-[#2a3d30] text-[#8fa898] hover:text-[#f0f7f2] hover:border-[#2dbd6e]/50 px-8 py-4 rounded-xl transition-colors duration-200 text-base">
              View Itinerary
            </a>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 max-w-4xl mx-auto w-full px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {experiences.map((exp, i) => (
              <motion.div key={exp.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                className="bg-[#0f1611] border border-[#1e2d24] rounded-xl p-4 text-center card-hover">
                <div className="text-2xl mb-2">{exp.icon}</div>
                <div className="text-sm font-medium text-[#f0f7f2]">{exp.label}</div>
                <div className="text-xs text-[#5a7060] mt-0.5">{exp.location}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-5 h-8 border-2 border-[#2a3d30] rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-[#2dbd6e] rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Itinerary */}
      <section id="itinerary" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-[#2dbd6e] mb-4">
              <span className="w-8 h-px bg-[#2dbd6e]" />The Journey<span className="w-8 h-px bg-[#2dbd6e]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">9 Days. Every One Counts.</h2>
            <p className="text-[#8fa898] mt-4 text-lg max-w-xl mx-auto">No filler days. Each morning is intentional, each evening is memorable.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {itinerary.map((day, i) => {
              const Icon = day.icon
              const isGold = day.color === 'gold'
              const accentColor = isGold ? '#d4a847' : '#2dbd6e'
              return (
                <motion.div key={day.day} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
                  className="bg-[#0f1611] border border-[#1e2d24] rounded-xl p-6 card-hover" style={{ borderLeft: `2px solid ${accentColor}` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-xs font-medium tracking-widest uppercase text-[#5a7060] mb-1">Day {day.day}</div>
                      <div className="text-sm font-semibold" style={{ color: accentColor }}>{day.date}</div>
                    </div>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accentColor}18` }}>
                      <Icon className="w-4 h-4" style={{ color: accentColor }} />
                    </div>
                  </div>
                  <h3 className="font-semibold text-[#f0f7f2] mb-3 text-base">{day.theme}</h3>
                  <ul className="space-y-1.5">
                    {day.highlights.map((h, j) => (
                      <li key={j} className="text-sm text-[#8fa898] flex items-start gap-2">
                        <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
                        {h}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section id="whats-included" className="py-24 px-6 bg-[#0f1611]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-[#2dbd6e] mb-4">
              <span className="w-8 h-px bg-[#2dbd6e]" />No Surprises<span className="w-8 h-px bg-[#2dbd6e]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Everything&apos;s Handled.</h2>
            <p className="text-[#8fa898] mt-4 text-lg max-w-xl mx-auto">Show up. We take care of the rest.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-16">
            {included.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ duration: 0.3, delay: (i % 8) * 0.05 }}
                className="flex items-center gap-3 p-4 rounded-lg bg-[#080c0a] border border-[#1e2d24]">
                <CheckCircle2 className="w-4 h-4 text-[#2dbd6e] flex-shrink-0" />
                <span className="text-sm text-[#8fa898]">{item}</span>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-6">
              <Plus className="w-5 h-5 text-[#d4a847]" />
              <h3 className="font-semibold text-[#f0f7f2] text-lg">Optional Add-ons</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {addons.map((addon, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-[#080c0a] border border-[#1e2d24] rounded-xl p-4 text-center card-hover">
                  <div className="text-2xl mb-2">{addon.icon}</div>
                  <div className="text-sm text-[#8fa898]">{addon.name}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reserve */}
      <section id="reserve" className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-[#2dbd6e] mb-4">
              <span className="w-8 h-px bg-[#2dbd6e]" />Limited Spots<span className="w-8 h-px bg-[#2dbd6e]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Ready for Bali?</h2>
            <p className="text-[#8fa898] text-lg leading-relaxed">Reserve your spot for the May 9–17 trip. We&apos;ll reach out with everything you need.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#0f1611] border border-[#1e2d24] rounded-2xl p-8">
            <ReserveForm />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e2d24] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2dbd6e]/20 border border-[#2dbd6e]/30 flex items-center justify-center">
              <Compass className="w-3.5 h-3.5 text-[#2dbd6e]" />
            </div>
            <span className="font-semibold text-[#f0f7f2] tracking-tight">SideQuest</span>
          </div>
          <p className="text-sm text-[#5a7060]">Travel with intention. © 2025 SideQuest.</p>
          <div className="flex items-center gap-1 text-sm text-[#5a7060]">
            <MapPin className="w-3.5 h-3.5" />
            Bali, Indonesia · May 9–17, 2025
          </div>
        </div>
      </footer>
    </main>
  )
}
