'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryItem {
  family: string
  location: string
  src: string
}

const ITEMS: GalleryItem[] = [
  { family: 'The Carl Family', location: 'La Jolla, San Diego', src: '/peakbuilders/gallery/carl.jpg' },
  { family: 'The Rem Family', location: 'Carmel Valley, San Diego', src: '/peakbuilders/gallery/rem.jpg' },
  { family: 'The Lanahan Family', location: 'Encinitas, San Diego', src: '/peakbuilders/gallery/lanahan.jpg' },
  { family: 'The Holeva Family', location: 'Point Loma, San Diego', src: '/peakbuilders/gallery/holeva.jpg' },
  { family: 'The Mizrachi Family', location: 'Del Mar, San Diego', src: '/peakbuilders/gallery/mizrachi.jpg' },
  { family: 'The Diaz Family', location: 'Chula Vista, San Diego', src: '/peakbuilders/gallery/diaz.jpg' },
  { family: 'The Gonzales Family', location: 'Mira Mesa, San Diego', src: '/peakbuilders/gallery/gonzales.jpg' },
  { family: 'The Weisbach Family', location: 'Rancho Bernardo, San Diego', src: '/peakbuilders/gallery/weisbach.jpg' },
  { family: 'The Sommer Family', location: 'Rancho Santa Fe, San Diego', src: '/peakbuilders/gallery/sommer.jpg' },
  { family: 'The Green Family', location: 'Carlsbad, San Diego', src: '/peakbuilders/gallery/green.jpg' },
  { family: 'The Fishbein Family', location: 'North Park, San Diego', src: '/peakbuilders/gallery/fishbein.jpg' },
  { family: 'The Castillo Family', location: 'Scripps Ranch, San Diego', src: '/peakbuilders/gallery/castillo.jpg' },
  { family: 'The Barry Family', location: 'Solana Beach, San Diego', src: '/peakbuilders/gallery/barry.jpg' },
  { family: 'The Rendone Family', location: 'Poway, San Diego', src: '/peakbuilders/gallery/rendone.jpg' },
  { family: 'The Betts Family', location: 'Coronado, San Diego', src: '/peakbuilders/gallery/betts.jpg' },
  { family: 'The Levy Family', location: 'Pacific Beach, San Diego', src: '/peakbuilders/gallery/levy.jpg' },
  { family: 'The Dang Family', location: 'Mission Hills, San Diego', src: '/peakbuilders/gallery/dang.jpg' },
  { family: 'The Nguyen Family', location: 'Escondido, San Diego', src: '/peakbuilders/gallery/nguyen.jpg' },
  { family: 'The Gray Family', location: 'Tierrasanta, San Diego', src: '/peakbuilders/gallery/gray.jpg' },
  { family: 'The Rowe Family', location: 'Bonita, San Diego', src: '/peakbuilders/gallery/rowe.jpg' },
  { family: 'The Saake Family', location: 'Ocean Beach, San Diego', src: '/peakbuilders/gallery/saake.jpg' },
  { family: 'The Hodges Family', location: 'Solana Beach, San Diego', src: '/peakbuilders/gallery/hodges.jpg' },
  { family: 'The Ferrari Family', location: 'Hillcrest, San Diego', src: '/peakbuilders/gallery/ferrari.jpg' },
  { family: 'The Kitchen Family', location: 'El Cajon, San Diego', src: '/peakbuilders/gallery/kitchen.jpg' },
]

const LOOP = [...ITEMS, ...ITEMS]
const CARD_STEP = 260 + 14 // card width + gap
const AUTO_SPEED_PX_PER_SEC = 28 // matches the old ~70s marquee feel
const RESUME_AFTER_MS = 3500

export default function GalleryStrip() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Position the scroller in the middle of the first set on mount so the user
  // has room to manually swipe in both directions before any wrap is needed.
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const id = requestAnimationFrame(() => {
      if (el && el.scrollWidth > 0) {
        el.scrollLeft = Math.max(el.scrollWidth / 4, CARD_STEP)
      }
    })
    return () => cancelAnimationFrame(id)
  }, [])

  // Auto-advance + seamless wrap in both directions.
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    let lastTime = performance.now()
    let raf = 0

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000
      lastTime = now
      const el = scrollerRef.current
      if (el) {
        if (!pausedRef.current) {
          el.scrollLeft += AUTO_SPEED_PX_PER_SEC * dt
        }
        // Wrap checks run every frame so manual swipes loop too.
        const halfWidth = el.scrollWidth / 2
        if (halfWidth > 0) {
          if (el.scrollLeft >= halfWidth) {
            el.scrollLeft -= halfWidth
          } else if (el.scrollLeft <= 0) {
            el.scrollLeft += halfWidth
          }
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const pauseTemporarily = () => {
    pausedRef.current = true
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => { pausedRef.current = false }, RESUME_AFTER_MS)
  }

  const onMouseEnter = () => {
    pausedRef.current = true
    if (resumeTimerRef.current) { clearTimeout(resumeTimerRef.current); resumeTimerRef.current = null }
  }
  const onMouseLeave = () => { pausedRef.current = false }

  const handleArrow = (direction: 1 | -1) => {
    pauseTemporarily()
    scrollerRef.current?.scrollBy({ left: direction * CARD_STEP * 2, behavior: 'smooth' })
  }

  return (
    <section style={{
      width: '100%',
      padding: '36px 0 28px',
      borderTop: '1px solid var(--pb-divider)',
      borderBottom: '1px solid var(--pb-divider)',
      background: 'var(--pb-bg-soft)',
    }}>
      <style>{`
        .pb-scroller {
          display: flex;
          gap: 14px;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x proximity;
          -webkit-overflow-scrolling: touch;
          padding: 8px 16px 16px;
          scrollbar-width: none;
          overscroll-behavior-x: contain;
        }
        .pb-scroller::-webkit-scrollbar { display: none; }
        .pb-scroller > * { scroll-snap-align: center; }
        .pb-scroller-mask {
          position: relative;
          mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
        }
        .pb-arrow {
          position: absolute;
          top: 50%; transform: translateY(-50%);
          width: 42px; height: 42px; border-radius: 50%;
          background: var(--pb-card); color: var(--pb-card-fg);
          border: 1px solid var(--pb-divider);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(10,31,61,0.18);
          z-index: 5;
        }
        .pb-arrow:hover {
          background: var(--pb-primary);
          color: var(--pb-primary-fg);
          border-color: var(--pb-primary);
          transform: translateY(-50%) scale(1.08);
        }
        .pb-arrow:active { transform: translateY(-50%) scale(0.96); }
        .pb-arrow-left  { left: 10px; }
        .pb-arrow-right { right: 10px; }
        @media (max-width: 640px) {
          .pb-arrow { display: none; }
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: 22, padding: '0 1rem' }}>
        <p style={{
          fontSize: 11,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--pb-gold-dark)',
          fontWeight: 700,
          marginBottom: 8,
        }}>
          Recent Projects
        </p>
        <h2 className="pb-serif" style={{
          fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)',
          fontWeight: 700,
          color: 'var(--pb-card-fg)',
          margin: 0,
          lineHeight: 1.2,
        }}>
          2,100+ Roofs Completed Across San Diego
        </h2>
      </div>

      <div className="pb-scroller-mask">
        <button
          type="button"
          onClick={() => handleArrow(-1)}
          aria-label="Scroll gallery left"
          className="pb-arrow pb-arrow-left"
        >
          <ChevronLeft size={20} />
        </button>
        <div
          className="pb-scroller"
          ref={scrollerRef}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onTouchStart={pauseTemporarily}
          onPointerDown={pauseTemporarily}
        >
          {LOOP.map((item, i) => (
            <GalleryCard key={`${item.family}-${i}`} item={item} priority={i < 3} />
          ))}
        </div>
        <button
          type="button"
          onClick={() => handleArrow(1)}
          aria-label="Scroll gallery right"
          className="pb-arrow pb-arrow-right"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  )
}

function GalleryCard({ item, priority }: { item: GalleryItem; priority: boolean }) {
  return (
    <div style={{
      flex: '0 0 auto',
      width: 260,
      borderRadius: 12,
      overflow: 'hidden',
      background: 'var(--pb-card)',
      border: '1px solid var(--pb-divider)',
      boxShadow: '0 6px 20px rgba(10,31,61,0.08)',
      position: 'relative',
    }}>
      <div style={{ position: 'relative', width: 260, height: 175, background: '#e5e7eb' }}>
        <Image
          src={item.src}
          alt={`Roof project — ${item.family}`}
          fill
          sizes="260px"
          style={{ objectFit: 'cover' }}
          priority={priority}
        />
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--pb-card-fg)',
          marginBottom: 4,
          lineHeight: 1.3,
        }}>
          {item.family}
        </div>
        <div style={{
          fontSize: 12,
          color: 'var(--pb-muted-fg)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          <MapPin size={11} color="var(--pb-gold-dark)" />
          {item.location}
        </div>
      </div>
    </div>
  )
}
