'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Instagram, ArrowRight } from 'lucide-react'

// ─── PALETTE ──────────────────────────────────────────────────────────────
const C = {
  bg:        '#F3EDE3',
  surface:   '#EDE6D8',
  border:    '#D4C8B4',
  text:      '#1A1814',
  muted:     '#8A7A68',
  faint:     '#B0A090',
  bronze:    '#9A7B4F',
  bronzeLight:'#B8956A',
  dark:      '#1C1710',
  darkMid:   '#2E2618',
  white:     '#FAF7F2',
}

// ─── ITINERARY ────────────────────────────────────────────────────────────
const days = [
  { day: 1,  date: 'May 9',  theme: 'Adventure Begins',       sub: 'Private transfers to Ubud · Luxury villa check-in · Balinese welcome dinner', img: '/riceterraces.jpeg' },
  { day: 2,  date: 'May 10', theme: 'Spiritual Cleanse',     sub: 'Tirta Empul temple at dawn · ATV through rice fields · Jungle Club sunset', img: '/atv.jpeg' },
  { day: 3,  date: 'May 11', theme: 'Volcanic Hike',         sub: 'Mount Batur sunrise trek · Volcanic hot springs · Return to Ubud', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=75' },
  { day: 4,  date: 'May 12', theme: 'Immersion Day',         sub: 'Green School Bali visit · Field experience with students · Free afternoon in Ubud', img: '/waterfall3.jpeg' },
  { day: 5,  date: 'May 13', theme: 'Meet the Mantas',       sub: 'Fast boat to Nusa Penida · Manta ray snorkeling · Coastal cliffs · Check-in Canggu', img: '/nusapenida.jpeg' },
  { day: 6,  date: 'May 14', theme: 'Catch a Wave',          sub: 'Surf lesson at dawn · Free time in Canggu · Luna Beach Club afternoon', img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=75' },
  { day: 7,  date: 'May 15', theme: 'Inside the Machine',    sub: 'Embedded with a local Bali startup · Founders session · Finns Beach Club evening', img: '/finns2.jpeg' },
  { day: 8,  date: 'May 16', theme: 'The Send-Off',          sub: 'Free morning to wander · Closing night at Savaya', img: '/sendoff.jpeg' },
  { day: 9,  date: 'May 17', theme: 'Until Next Time',       sub: 'Breakfast included · Airport transfers · Until next time', img: '/waterfall2.jpeg' },
]

const included = [
  'Luxury villa and hotel accommodation',
  'Daily breakfast',
  'Airport & all intercity transfers',
  'Balinese welcome dinner',
  'Jungle Club, Luna & Finns Beach Club access',
  'Mount Batur sunrise hike & hot springs',
  'Tirta Empul temple visit',
  'Green School Bali immersion',
  'Fast boat to Nusa Penida',
  'Manta ray snorkeling',
  'Local startup immersion session',
  'Savaya closing night entry',
  'On-ground coordination throughout',
]

// ─── HOOKS ────────────────────────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function Fade({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useFadeIn()
  return (
    <div ref={ref} className="fade-in" style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  )
}

// ─── EMAIL FORM ───────────────────────────────────────────────────────────
function SignupForm({ dark = false, onDone }: { dark?: boolean; onDone?: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')

  const inputStyle: React.CSSProperties = {
    padding: '13px 16px',
    borderRadius: '6px',
    border: `1px solid ${dark ? 'rgba(255,255,255,0.15)' : C.border}`,
    background: dark ? 'rgba(255,255,255,0.07)' : C.white,
    color: dark ? C.white : C.text,
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
    backdropFilter: dark ? 'blur(4px)' : undefined,
    WebkitBackdropFilter: dark ? 'blur(4px)' : undefined,
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('loading')
    await new Promise(r => setTimeout(r, 900))
    try {
      await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, trip: 'Bali May 2026', source: 'info-session' }),
      })
    } catch { /* silent */ }
    setState('done')
    onDone?.()
  }

  if (state === 'done') {
    return (
      <div style={{ textAlign: 'center', padding: '12px 0' }}>
        <div style={{ fontSize: '22px', marginBottom: '8px' }}>✦</div>
        <p style={{ color: dark ? C.white : C.text, fontSize: '16px', fontFamily: 'Georgia, serif' }}>
          You&apos;re on the list.
        </p>
        <p style={{ color: dark ? 'rgba(243,237,227,0.55)' : C.muted, fontSize: '13px', marginTop: '6px' }}>
          Watch your inbox for details.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
      <input
        type="text" required value={name} onChange={e => setName(e.target.value)}
        placeholder="Your name" style={inputStyle}
      />
      <input
        type="email" required value={email} onChange={e => setEmail(e.target.value)}
        placeholder="Your email" style={inputStyle}
      />
      <button
        type="submit" disabled={state === 'loading'}
        style={{
          padding: '13px 20px',
          borderRadius: '6px',
          background: C.bronze,
          color: C.white,
          fontWeight: 500,
          fontSize: '14px',
          border: 'none',
          cursor: state === 'loading' ? 'wait' : 'pointer',
          letterSpacing: '0.04em',
          transition: 'background 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          opacity: state === 'loading' ? 0.7 : 1,
        }}
      >
        {state === 'loading' ? '...' : <><span>Reserve my spot</span><ArrowRight size={14} /></>}
      </button>
    </form>
  )
}

// ─── MODAL ────────────────────────────────────────────────────────────────
function Modal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
        transition: 'opacity 0.25s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.dark,
          borderRadius: '14px',
          padding: '44px 36px',
          width: '100%',
          maxWidth: '400px',
          position: 'relative',
          transform: open ? 'scale(1)' : 'scale(0.96)',
          transition: 'transform 0.25s ease',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
          border: `1px solid rgba(255,255,255,0.07)`,
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
        >
          <X size={16} />
        </button>
        <p style={{ fontSize: '10px', letterSpacing: '0.2em', color: C.bronze, marginBottom: '12px', fontWeight: 500 }}>
          EARLY BIRD · MARCH 22
        </p>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', color: C.white, fontWeight: 400, marginBottom: '6px', lineHeight: 1.2 }}>
          Info Session
        </h3>
        <p style={{ fontSize: '13px', color: 'rgba(243,237,227,0.5)', marginBottom: '28px' }}>
          Bali · May 2026 · 30 spots
        </p>
        <SignupForm dark onDone={onClose} />
      </div>
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────
export default function Page() {
  const [modalOpen, setModalOpen] = useState(false)
  const [heroSignedUp] = useState(false)

  return (
    <>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} />

      <main style={{ background: C.bg }}>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section
          className="hero-bg"
          style={{
            minHeight: '100svh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background image — vsco treated */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: 'url(/nusapenida.jpeg)',
            backgroundSize: 'cover', backgroundPosition: 'center 30%',
            filter: 'contrast(0.9) saturate(0.55) brightness(0.38) sepia(0.15)',
          }} />

          {/* Nav */}
          <nav style={{
            position: 'relative', zIndex: 10,
            padding: '28px 40px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpeg" alt="SideQuest" style={{ height: '32px', width: 'auto', objectFit: 'contain', opacity: 0.92 }} />
            <button
              onClick={() => setModalOpen(true)}
              style={{
                padding: '9px 20px', borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.25)',
                background: 'rgba(255,255,255,0.07)',
                color: 'rgba(243,237,227,0.85)',
                fontSize: '13px', cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                letterSpacing: '0.03em',
                transition: 'background 0.2s, border-color 0.2s',
              }}
            >
              Info session →
            </button>
          </nav>

          {/* Hero content */}
          <div style={{
            position: 'relative', zIndex: 10,
            flex: 1,
            display: 'flex', flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: 'clamp(32px, 6vw, 80px)',
            paddingBottom: 'clamp(48px, 8vw, 96px)',
          }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.22em', color: 'rgba(154,123,79,0.9)', marginBottom: '20px', fontWeight: 500 }}>
              BALI · MAY 2026
            </p>
            <h1 style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(48px, 8.5vw, 112px)',
              color: C.white,
              fontWeight: 400,
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              marginBottom: '28px',
              maxWidth: '14ch',
            }}>
              The Side Quest
            </h1>
            <p style={{
              fontSize: 'clamp(14px, 1.6vw, 17px)',
              color: 'rgba(243,237,227,0.55)',
              maxWidth: '38ch',
              lineHeight: 1.65,
              marginBottom: '40px',
              fontWeight: 300,
            }}>
              Nine days in Bali for MBAs who want more than a vacation.
              Bucket-list experiences. Real access. People worth knowing.
            </p>

            {/* Hero CTA */}
            {heroSignedUp ? (
              <p style={{ color: 'rgba(243,237,227,0.7)', fontSize: '15px', fontFamily: 'Georgia, serif' }}>
                You&apos;re on the list. ✦
              </p>
            ) : (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  onClick={() => setModalOpen(true)}
                  style={{
                    padding: '14px 28px', borderRadius: '6px',
                    background: C.bronze, color: C.white,
                    fontWeight: 500, fontSize: '14px', border: 'none', cursor: 'pointer',
                    letterSpacing: '0.04em', transition: 'background 0.2s',
                  }}
                >
                  Get early access
                </button>
                <a href="#itinerary" style={{
                  padding: '14px 20px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '6px',
                  color: 'rgba(243,237,227,0.7)',
                  fontSize: '14px',
                  textDecoration: 'none',
                  letterSpacing: '0.03em',
                }}>
                  View itinerary
                </a>
              </div>
            )}

            <p style={{ fontSize: '12px', color: 'rgba(154,123,79,0.6)', marginTop: '20px', letterSpacing: '0.05em' }}>
              Early bird opens March 22 · 30 spots · By application
            </p>
          </div>
        </section>

        {/* ── INTRO STRIP ──────────────────────────────────────── */}
        <section style={{ background: C.dark, padding: '0 clamp(24px, 6vw, 80px)' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}>
            {[
              { n: '9', l: 'Days in Bali' },
              { n: '30', l: 'Spots only' },
              { n: '1', l: 'Startup immersion' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: 'clamp(24px, 4vw, 44px) 0',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                paddingLeft: i > 0 ? 'clamp(16px, 3vw, 40px)' : 0,
                paddingRight: i < 2 ? 'clamp(16px, 3vw, 40px)' : 0,
              }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 5vw, 52px)', color: C.white, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '6px', letterSpacing: '0.06em' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── INFO SESSION BANNER ──────────────────────────────── */}
        <section style={{
          background: C.bronze,
          padding: 'clamp(20px, 3vw, 28px) clamp(24px, 6vw, 80px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(26,24,20,0.6)', marginBottom: '4px' }}>EARLY BIRD</p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(16px, 2.5vw, 20px)', color: C.dark }}>
              Info session opens March 22, 2026
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              padding: '11px 24px', borderRadius: '6px',
              background: C.dark, color: C.white,
              fontWeight: 500, fontSize: '13px', border: 'none', cursor: 'pointer',
              letterSpacing: '0.04em', whiteSpace: 'nowrap',
            }}
          >
            Sign up now →
          </button>
        </section>

        {/* ── ITINERARY ────────────────────────────────────────── */}
        <section id="itinerary" style={{ padding: 'clamp(64px, 10vw, 120px) clamp(24px, 6vw, 80px)' }}>
          <Fade>
            <p style={{ fontSize: '11px', letterSpacing: '0.2em', color: C.bronze, marginBottom: '12px' }}>THE TRIP</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 400, marginBottom: '4px', lineHeight: 1.1 }}>
              Nine days.
            </h2>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 400, color: C.muted, marginBottom: '64px', lineHeight: 1.1 }}>
              Every one counts.
            </h2>
          </Fade>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {days.map((d, i) => (
              <Fade key={d.day} delay={i * 40}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'clamp(40px, 6vw, 72px) 1fr clamp(100px, 18vw, 220px)',
                  gap: '0 clamp(16px, 3vw, 40px)',
                  padding: 'clamp(20px, 3vw, 32px) 0',
                  borderBottom: `1px solid ${C.border}`,
                  alignItems: 'center',
                }}>
                  {/* Day number */}
                  <div>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(11px, 1.5vw, 13px)', color: C.bronze, letterSpacing: '0.06em' }}>
                      {String(d.day).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '11px', color: C.faint, marginTop: '2px' }}>{d.date}</div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: 'clamp(17px, 2.5vw, 24px)',
                      fontWeight: 400,
                      color: C.text,
                      marginBottom: '6px',
                    }}>
                      {d.theme}
                    </h3>
                    <p style={{ fontSize: 'clamp(12px, 1.3vw, 14px)', color: C.muted, lineHeight: 1.6 }}>
                      {d.sub}
                    </p>
                  </div>

                  {/* Image */}
                  <div style={{
                    aspectRatio: '3/2',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: C.surface,
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={d.img}
                      alt={d.theme}
                      className="vsco-img"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      loading="lazy"
                    />
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </section>

        {/* ── INCLUDED ─────────────────────────────────────────── */}
        <section style={{
          background: C.dark,
          padding: 'clamp(64px, 10vw, 120px) clamp(24px, 6vw, 80px)',
        }}>
          <Fade>
            <p style={{ fontSize: '11px', letterSpacing: '0.2em', color: C.bronze, marginBottom: '12px' }}>INCLUDED</p>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(28px, 4vw, 48px)',
              color: C.white,
              fontWeight: 400,
              marginBottom: '48px',
              lineHeight: 1.15,
            }}>
              Show up. We handle everything else.
            </h2>
          </Fade>
          <Fade delay={100}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '0',
            }}>
              {included.map((item, i) => (
                <div key={i} style={{
                  padding: '18px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '14px',
                }}>
                  <span style={{ color: C.bronze, fontSize: '14px', flexShrink: 0 }}>✦</span>
                  <span style={{ fontSize: '14px', color: 'rgba(243,237,227,0.65)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </Fade>
        </section>

        {/* ── IMPACT LINE ──────────────────────────────────────── */}
        <section style={{
          padding: 'clamp(80px, 12vw, 140px) clamp(24px, 6vw, 80px)',
          background: C.bg,
        }}>
          <Fade>
            <p style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(22px, 3.5vw, 40px)',
              color: C.text,
              maxWidth: '22ch',
              fontWeight: 400,
              lineHeight: 1.45,
            }}>
              &ldquo;Every trip includes a day embedded with a local startup.&rdquo;
            </p>
            <div style={{ width: '40px', height: '1px', background: C.bronze, marginTop: '32px' }} />
          </Fade>
        </section>

        {/* ── BOTTOM CTA ───────────────────────────────────────── */}
        <section style={{
          background: C.dark,
          padding: 'clamp(80px, 12vw, 140px) clamp(24px, 6vw, 80px)',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 'clamp(32px, 6vw, 80px)',
          alignItems: 'end',
          flexWrap: 'wrap',
        }}>
          <Fade>
            <p style={{ fontSize: '11px', letterSpacing: '0.2em', color: C.bronze, marginBottom: '16px' }}>EARLY BIRD OPENS MARCH 22</p>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(36px, 6vw, 72px)',
              color: C.white,
              fontWeight: 400,
              lineHeight: 1.05,
              marginBottom: '16px',
            }}>
              30 spots.<br />First cohort.
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(243,237,227,0.4)', letterSpacing: '0.06em' }}>
              May 2026 · Indonesia
            </p>
          </Fade>

          <Fade delay={150} style={{ minWidth: '280px', maxWidth: '360px' }}>
            <SignupForm dark />
          </Fade>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────── */}
        <footer style={{
          background: C.dark,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '28px clamp(24px, 6vw, 80px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpeg" alt="SideQuest" style={{ height: '22px', width: 'auto', opacity: 0.45 }} />
          <a href="#" aria-label="Instagram" style={{ color: 'rgba(255,255,255,0.2)', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)' )}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
          >
            <Instagram size={16} />
          </a>
        </footer>
      </main>

      {/* Mobile responsive overrides */}
      <style>{`
        @media (max-width: 640px) {
          section[id="itinerary"] > div:last-child > div > div {
            grid-template-columns: clamp(36px, 8vw, 48px) 1fr !important;
          }
          section[id="itinerary"] > div:last-child > div > div > div:last-child {
            display: none !important;
          }
          footer {
            flex-direction: column !important;
            gap: 16px !important;
            text-align: center !important;
          }
          section:last-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  )
}
