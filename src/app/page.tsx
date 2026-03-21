'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Lock, Instagram, X } from 'lucide-react'

// ─── DATA ──────────────────────────────────────────────────────────────────

const baliCards = [
  {
    id: 'surf',
    title: 'Surf Uluwatu',
    location: 'Uluwatu, Bali',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&q=80',
    locked: false,
  },
  {
    id: 'manta',
    title: 'Manta Ray Snorkeling',
    location: 'Nusa Penida',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
    locked: false,
  },
  {
    id: 'volcano',
    title: 'Sunrise Volcano Trek',
    location: 'Mt. Batur, 4am',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
    locked: false,
  },
  {
    id: 'temple',
    title: 'Spiritual Cleansing',
    location: 'Tirta Empul, Bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    locked: false,
  },
  {
    id: 'penida',
    title: 'Nusa Penida Island Hop',
    location: 'Nusa Penida',
    image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80',
    locked: false,
  },
  {
    id: 'africa',
    title: 'East Africa',
    location: 'Coming 2027',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80',
    locked: true,
  },
  {
    id: 'egypt',
    title: 'Egypt',
    location: 'Coming 2027',
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=600&q=80',
    locked: true,
  },
]

// SVG map pin data — coordinates within a 560×340 viewBox
// Bali island silhouette is centered in this space
const mapPins = [
  {
    id: 'uluwatu',
    label: 'Uluwatu',
    activity: 'Surf Uluwatu',
    cx: 185, cy: 268,
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&q=80',
    isHome: false,
    activities: null,
  },
  {
    id: 'canggu',
    label: 'Canggu',
    activity: 'Send-off Night',
    cx: 160, cy: 230,
    image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400&q=80',
    isHome: false,
    activities: null,
  },
  {
    id: 'ubud',
    label: 'Ubud',
    activity: 'Home Base',
    cx: 280, cy: 200,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80',
    isHome: true,
    activities: 'ATV Ride · Rice Terraces · Jungle Swing',
  },
  {
    id: 'tirta',
    label: 'Tirta Empul',
    activity: 'Spiritual Cleansing',
    cx: 295, cy: 168,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80',
    isHome: false,
    activities: null,
  },
  {
    id: 'batur',
    label: 'Mt. Batur',
    activity: 'Sunrise Volcano Trek',
    cx: 330, cy: 148,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
    isHome: false,
    activities: null,
  },
  {
    id: 'penida',
    label: 'Nusa Penida',
    activity: 'Manta Ray Snorkeling',
    cx: 355, cy: 310,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80',
    isHome: false,
    activities: null,
  },
]

// Route order: Uluwatu → Nusa Penida → Ubud → Tirta Empul → Mt. Batur → Canggu
const routeOrder = ['uluwatu', 'penida', 'ubud', 'tirta', 'batur', 'canggu']

// ─── COMPONENTS ────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function FadeSection({ children, delay = 0, className = '' }: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function EmailForm({
  compact = false,
  isSubmitted,
  onSubmit,
}: {
  compact?: boolean
  isSubmitted: boolean
  onSubmit: (email: string) => void
}) {
  const [val, setVal] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!val) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    try {
      await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: val, name: val, trip: 'Bali May 2026' }),
      })
    } catch { /* silent */ }
    setLoading(false)
    onSubmit(val)
  }

  if (isSubmitted) {
    return (
      <p style={{
        color: '#E8DCC8',
        fontSize: compact ? '14px' : '16px',
        transition: 'opacity 0.4s ease',
        opacity: 1,
      }}>
        You&apos;re on the list. Watch your inbox.
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: compact ? 'column' : undefined,
        gap: '8px',
        width: '100%',
        maxWidth: compact ? '360px' : undefined,
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .hero-form { flex-direction: column !important; }
          .hero-form input, .hero-form button { width: 100% !important; }
        }
      `}</style>
      <input
        type="email"
        required
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder="Your email"
        className="hero-form-input"
        style={{
          flex: compact ? undefined : 1,
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.08)',
          color: '#fff',
          fontSize: '15px',
          outline: 'none',
          backdropFilter: 'blur(4px)',
          minWidth: 0,
          width: compact ? '100%' : undefined,
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '12px 20px',
          borderRadius: '8px',
          background: loading ? 'rgba(196,163,90,0.6)' : '#C4A35A',
          color: '#1A3A4A',
          fontWeight: 600,
          fontSize: '15px',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          whiteSpace: 'nowrap',
          width: compact ? '100%' : undefined,
          transition: 'filter 0.2s ease',
        }}
        onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.1)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = 'none' }}
      >
        {loading ? '...' : 'Get Early Access'}
      </button>
    </form>
  )
}

function Modal({ isOpen, onClose, isSubmitted, onSubmit }: {
  isOpen: boolean
  onClose: () => void
  isSubmitted: boolean
  onSubmit: (email: string) => void
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'all' : 'none',
        transition: 'opacity 0.25s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#1A3A4A',
          borderRadius: '16px',
          padding: '40px 32px',
          width: '100%',
          maxWidth: '420px',
          position: 'relative',
          transform: isOpen ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 0.25s ease',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={18} />
        </button>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', color: '#fff', marginBottom: '8px' }}>
          Join the waitlist
        </h3>
        <p style={{ color: 'rgba(232,220,200,0.7)', fontSize: '14px', marginBottom: '24px' }}>
          30 spots · Bali · May 2026
        </p>
        <EmailForm compact isSubmitted={isSubmitted} onSubmit={onSubmit} />
      </div>
    </div>
  )
}

function BaliMap() {
  const [activePin, setActivePin] = useState<string | null>(null)
  const { ref, inView } = useInView(0.2)
  const [routeDrawn, setRouteDrawn] = useState(false)

  useEffect(() => {
    if (inView && !routeDrawn) {
      setTimeout(() => setRouteDrawn(true), 400)
    }
  }, [inView, routeDrawn])

  const routePoints = routeOrder
    .map(id => mapPins.find(p => p.id === id))
    .filter(Boolean)
    .map(p => `${p!.cx},${p!.cy}`)
    .join(' ')

  const getPopupPosition = (pin: typeof mapPins[0]) => {
    const left = pin.cx > 300 ? pin.cx - 220 : pin.cx + 16
    const top = pin.cy > 200 ? pin.cy - 170 : pin.cy + 16
    return { left, top }
  }

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', maxWidth: '700px', margin: '0 auto' }}>
      <svg
        viewBox="0 0 560 370"
        style={{ width: '100%', overflow: 'visible' }}
        aria-label="Map of Bali with activity pins"
      >
        {/* Ocean background */}
        <rect x="0" y="0" width="560" height="370" fill="#D8EAF0" rx="12" />

        {/* Subtle wave lines */}
        {[60, 120, 180, 240, 300, 340].map(y => (
          <path
            key={y}
            d={`M 10 ${y} Q 140 ${y - 8} 280 ${y} Q 420 ${y + 8} 550 ${y}`}
            fill="none"
            stroke="#B8D4DC"
            strokeWidth="0.8"
            opacity="0.5"
          />
        ))}

        {/* Bali island silhouette */}
        <path
          d="M 95 195 C 110 170 130 155 160 148 C 185 142 205 138 235 132
             C 260 127 290 118 320 115 C 348 113 372 118 395 128
             C 418 138 435 152 445 168 C 455 183 452 200 442 215
             C 432 230 415 242 395 250 C 375 258 350 262 325 260
             C 300 258 278 250 260 242 C 242 234 228 226 210 230
             C 192 234 178 248 165 255 C 152 262 138 262 126 255
             C 114 248 100 230 95 215 Z"
          fill="#E8DCC8"
          stroke="#5A8A8A"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Uluwatu peninsula (southwest tip) */}
        <path
          d="M 165 255 C 172 265 178 275 182 280 C 186 285 190 285 192 278
             C 194 271 190 260 185 255 Z"
          fill="#E8DCC8"
          stroke="#5A8A8A"
          strokeWidth="1.2"
        />

        {/* Nusa Penida island (southeast) */}
        <path
          d="M 330 295 C 338 288 352 286 364 290 C 376 294 382 305 378 316
             C 374 327 362 332 350 330 C 338 328 328 320 326 310 Z"
          fill="#E8DCC8"
          stroke="#5A8A8A"
          strokeWidth="1.2"
        />

        {/* Route line */}
        <polyline
          points={routePoints}
          fill="none"
          stroke="#C4A35A"
          strokeWidth="1.5"
          strokeDasharray="6 5"
          opacity="0.55"
          className={`route-animate ${routeDrawn ? 'drawn' : ''}`}
          style={routeDrawn ? {
            animation: 'drawRoute 2s ease-out forwards',
            strokeDasharray: '6 5',
          } : {}}
        />

        {/* Pins */}
        {mapPins.map(pin => (
          <g key={pin.id}>
            {/* Pulse ring */}
            <circle
              cx={pin.cx}
              cy={pin.cy}
              r={8}
              fill={pin.isHome ? '#2D7A8A' : '#C4A35A'}
              opacity={0}
              style={{ animation: `pinPulse 2.5s ease-out ${Math.random() * 1.5}s infinite` }}
            />
            {/* Main dot */}
            <circle
              cx={pin.cx}
              cy={pin.cy}
              r={pin.isHome ? 7 : 5}
              fill={pin.isHome ? '#2D7A8A' : '#C4A35A'}
              stroke="#fff"
              strokeWidth="2"
              style={{ cursor: 'pointer', transition: 'r 0.2s' }}
              onClick={() => setActivePin(prev => prev === pin.id ? null : pin.id)}
              onMouseEnter={() => setActivePin(pin.id)}
              onMouseLeave={() => setActivePin(null)}
            />
            {/* Home ring */}
            {pin.isHome && (
              <circle
                cx={pin.cx}
                cy={pin.cy}
                r={12}
                fill="none"
                stroke="#2D7A8A"
                strokeWidth="1.5"
                opacity="0.4"
              />
            )}
            {/* Label */}
            <text
              x={pin.cx + (pin.cx > 300 ? -10 : 10)}
              y={pin.cy - 10}
              textAnchor={pin.cx > 300 ? 'end' : 'start'}
              fontSize="9"
              fontFamily="system-ui, sans-serif"
              fill="#2D7A8A"
              opacity="0.8"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {pin.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Popup cards — rendered as HTML overlay */}
      {mapPins.map(pin => {
        const pos = getPopupPosition(pin)
        const isActive = activePin === pin.id
        return (
          <div
            key={`popup-${pin.id}`}
            style={{
              position: 'absolute',
              left: `${(pos.left / 560) * 100}%`,
              top: `${(pos.top / 370) * 100}%`,
              width: '180px',
              borderRadius: '10px',
              overflow: 'hidden',
              background: '#1A3A4A',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateY(0) scale(1)' : 'translateY(4px) scale(0.97)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
              pointerEvents: isActive ? 'all' : 'none',
              zIndex: 10,
            }}
            onMouseEnter={() => setActivePin(pin.id)}
            onMouseLeave={() => setActivePin(null)}
          >
            <div
              style={{
                height: '90px',
                backgroundImage: `url(${pin.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div style={{ padding: '10px 12px 12px' }}>
              <div style={{
                fontFamily: 'Georgia, serif',
                fontSize: '13px',
                color: '#fff',
                lineHeight: 1.3,
                marginBottom: '2px',
              }}>
                {pin.isHome ? `${pin.label} — Home Base` : pin.activity}
              </div>
              {pin.activities && (
                <div style={{ fontSize: '11px', color: 'rgba(232,220,200,0.7)', marginTop: '4px' }}>
                  {pin.activities}
                </div>
              )}
              {!pin.activities && (
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>
                  {pin.label}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── PAGE ───────────────────────────────────────────────────────────────────

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, scroll: 0 })

  const handleSubmit = useCallback((email: string) => {
    console.log('email:', email)
    setIsSubmitted(true)
    setIsModalOpen(false)
  }, [])

  // Drag-to-scroll on carousel
  const onMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return
    isDragging.current = true
    dragStart.current = { x: e.pageX, scroll: carouselRef.current.scrollLeft }
    carouselRef.current.style.cursor = 'grabbing'
    carouselRef.current.style.userSelect = 'none'
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !carouselRef.current) return
    carouselRef.current.scrollLeft = dragStart.current.scroll - (e.pageX - dragStart.current.x)
  }
  const onMouseUp = () => {
    isDragging.current = false
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab'
      carouselRef.current.style.userSelect = ''
    }
  }

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isSubmitted={isSubmitted} onSubmit={handleSubmit} />

      <main>
        {/* ── Section 1: Hero ─────────────────────────────────────── */}
        <section
          className="hero-bg"
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 24px 60px',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* Logo / wordmark */}
          <div style={{ marginBottom: '40px' }}>
            <span style={{
              fontFamily: 'Georgia, serif',
              fontSize: '22px',
              color: 'rgba(232,220,200,0.9)',
              letterSpacing: '0.15em',
              fontWeight: 400,
            }}>
              SIDEQUEST
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(52px, 10vw, 96px)',
            color: '#fff',
            fontWeight: 400,
            lineHeight: 1.0,
            marginBottom: '16px',
            letterSpacing: '-0.02em',
          }}>
            The Side Quest
          </h1>

          {/* Subline */}
          <p style={{
            fontSize: '16px',
            color: '#E8DCC8',
            opacity: 0.75,
            marginBottom: '36px',
            fontWeight: 300,
            letterSpacing: '0.08em',
          }}>
            Bali · May 2026
          </p>

          {/* Email form */}
          <div className="hero-form" style={{
            display: 'flex',
            gap: '8px',
            width: '100%',
            maxWidth: '460px',
            marginBottom: '16px',
          }}>
            <EmailForm isSubmitted={isSubmitted} onSubmit={handleSubmit} />
          </div>

          {/* Scarcity */}
          {!isSubmitted && (
            <p style={{
              fontSize: '13px',
              color: 'rgba(90,138,138,0.8)',
              letterSpacing: '0.04em',
            }}>
              30 spots · By invite only
            </p>
          )}
        </section>

        {/* ── Section 2: Carousel ─────────────────────────────────── */}
        <section style={{
          background: 'linear-gradient(180deg, #1A3A4A 0%, #EDF4F2 80px)',
          paddingTop: '64px',
          paddingBottom: '64px',
        }}>
          <FadeSection>
            <div style={{
              paddingLeft: 'max(24px, calc(50vw - 560px))',
              marginBottom: '20px',
            }}>
              <span style={{
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: '#5A8A8A',
                fontWeight: 500,
              }}>
                INDONESIA
              </span>
            </div>

            <div
              ref={carouselRef}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              style={{
                display: 'flex',
                gap: '16px',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                paddingLeft: 'max(24px, calc(50vw - 560px))',
                paddingRight: '60px',
                paddingBottom: '12px',
                cursor: 'grab',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              {baliCards.map(card => (
                <div
                  key={card.id}
                  style={{
                    flexShrink: 0,
                    scrollSnapAlign: 'start',
                    width: 'clamp(260px, 35vw, 300px)',
                    height: 'clamp(360px, 50vw, 420px)',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                    backgroundImage: `url(${card.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: card.locked ? 'grayscale(100%)' : 'none',
                    opacity: card.locked ? 0.45 : 1,
                    transition: card.locked ? 'none' : 'transform 0.3s ease, filter 0.3s ease',
                    cursor: card.locked ? 'default' : 'pointer',
                  }}
                  onMouseEnter={e => {
                    if (!card.locked) {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.transform = 'scale(1.03)'
                      el.style.filter = 'brightness(1.1)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!card.locked) {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.transform = 'scale(1)'
                      el.style.filter = 'none'
                    }
                  }}
                >
                  {/* Gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.0) 55%)',
                  }} />

                  {/* Lock icon */}
                  {card.locked && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Lock size={28} color="rgba(255,255,255,0.5)" />
                    </div>
                  )}

                  {/* Text */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '20px 18px',
                  }}>
                    <div style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: '18px',
                      color: card.locked ? 'rgba(255,255,255,0.4)' : '#fff',
                      fontWeight: 400,
                      marginBottom: '4px',
                    }}>
                      {card.title}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: card.locked ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.6)',
                      fontWeight: 300,
                    }}>
                      {card.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeSection>
        </section>

        {/* ── Section 3: Map ──────────────────────────────────────── */}
        <section style={{
          background: '#EDF4F2',
          padding: '72px 24px',
        }}>
          <FadeSection>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <span style={{
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: '#5A8A8A',
                fontWeight: 500,
              }}>
                THE ROUTE
              </span>
            </div>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(28px, 5vw, 40px)',
              color: '#1A3A4A',
              textAlign: 'center',
              fontWeight: 400,
              marginBottom: '48px',
            }}>
              Nine days across the island
            </h2>
          </FadeSection>

          <FadeSection delay={150}>
            <BaliMap />
            <p style={{
              textAlign: 'center',
              fontSize: '12px',
              color: '#5A8A8A',
              marginTop: '20px',
              opacity: 0.7,
            }}>
              Hover the pins to explore each stop
            </p>
          </FadeSection>
        </section>

        {/* ── Section 4: Impact line ──────────────────────────────── */}
        <section style={{
          background: '#F9F7F4',
          padding: '96px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <FadeSection>
            <p style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(18px, 3vw, 26px)',
              color: '#1A3A4A',
              textAlign: 'center',
              maxWidth: '620px',
              fontWeight: 400,
              lineHeight: 1.5,
              margin: '0 auto',
            }}>
              Every trip includes a day embedded with a local startup.
            </p>
          </FadeSection>
        </section>

        {/* ── Section 5: Bottom CTA ───────────────────────────────── */}
        <section style={{
          background: '#1A3A4A',
          padding: '96px 24px',
          textAlign: 'center',
        }}>
          <FadeSection>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(36px, 6vw, 64px)',
              color: '#fff',
              fontWeight: 400,
              marginBottom: '12px',
              lineHeight: 1.1,
            }}>
              30 spots. First cohort.
            </h2>
            <p style={{
              fontSize: '15px',
              color: 'rgba(232,220,200,0.6)',
              marginBottom: '40px',
              letterSpacing: '0.06em',
            }}>
              May 2026 · Indonesia
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                padding: '14px 36px',
                background: '#C4A35A',
                color: '#1A3A4A',
                fontWeight: 600,
                fontSize: '15px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'filter 0.2s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.1)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = 'none' }}
            >
              Join the Waitlist
            </button>
          </FadeSection>
        </section>

        {/* ── Section 6: Footer ───────────────────────────────────── */}
        <footer style={{
          background: '#1A3A4A',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}>
          <span style={{
            fontFamily: 'Georgia, serif',
            fontSize: '15px',
            color: 'rgba(232,220,200,0.5)',
            letterSpacing: '0.12em',
          }}>
            SIDEQUEST
          </span>
          <a
            href="#"
            aria-label="Instagram"
            style={{
              color: 'rgba(255,255,255,0.3)',
              transition: 'color 0.2s ease',
              display: 'flex',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.7)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.3)' }}
          >
            <Instagram size={18} />
          </a>
        </footer>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .hero-form {
            flex-direction: column !important;
          }
        }
        div[style*="overflow-x: auto"]::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  )
}
