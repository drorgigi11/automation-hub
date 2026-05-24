'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { MapPin } from 'lucide-react'

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

const CARD_WIDTH = 260
const CARD_HEIGHT = 175
const GAP = 14
const STEP = CARD_WIDTH + GAP
const SET_WIDTH = ITEMS.length * STEP

const AUTO_SPEED_PX_PER_SEC = 35
const FRICTION = 3.5             // higher = inertia stops faster
const VELOCITY_CLAMP = 4000      // px/sec cap on fling momentum
const RESUME_AFTER_RELEASE_MS = 1500
const DIRECTION_LOCK_PX = 6      // touch dx threshold before we capture horizontal

// Duplicate the items so wrapping by SET_WIDTH lands on visually identical content.
const LOOP = [...ITEMS, ...ITEMS]

export default function GalleryStrip() {
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)            // current translate offset (positive = scrolled right)
  const velocityRef = useRef(0)          // px/sec — for inertia after release
  const draggingRef = useRef(false)
  const dragRef = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastTime: 0,
    captured: false,   // direction-locked to horizontal
    pointerId: 0,
  })
  const hoveringRef = useRef(false)
  const resumeAtRef = useRef(0)

  // Wrap helper — modulo handles arbitrarily-large jumps in a single step.
  const normalize = (v: number) => ((v % SET_WIDTH) + SET_WIDTH) % SET_WIDTH

  useEffect(() => {
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let lastTime = performance.now()

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now
      const track = trackRef.current
      if (track) {
        if (!draggingRef.current) {
          if (Math.abs(velocityRef.current) > 2) {
            // Inertia from a fling — decay exponentially.
            offsetRef.current += velocityRef.current * dt
            velocityRef.current *= Math.exp(-FRICTION * dt)
          } else if (!hoveringRef.current && now >= resumeAtRef.current && !reduceMotion) {
            offsetRef.current += AUTO_SPEED_PX_PER_SEC * dt
          }
        }
        // Seamless wrap — content repeats every SET_WIDTH px. Modulo handles any size jump.
        offsetRef.current = normalize(offsetRef.current)

        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // --- Pointer handlers (mouse + touch + pen unified) ---

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore right-click etc.
    if (e.button !== undefined && e.button !== 0) return
    draggingRef.current = true
    velocityRef.current = 0
    const now = performance.now()
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastTime: now,
      captured: e.pointerType === 'mouse', // mouse captures immediately; touch waits for direction
      pointerId: e.pointerId,
    }
    if (e.pointerType === 'mouse') {
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    }
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    const d = dragRef.current
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY

    // For touch, lock direction first — release back to page if user is scrolling vertically.
    if (!d.captured) {
      if (Math.abs(dx) < DIRECTION_LOCK_PX && Math.abs(dy) < DIRECTION_LOCK_PX) return
      if (Math.abs(dy) > Math.abs(dx)) {
        draggingRef.current = false
        return
      }
      d.captured = true
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    }

    // Incremental update (delta since last move) — never lets offset accumulate
    // an out-of-range value that the per-frame wrap can't catch.
    const stepDx = e.clientX - d.lastX
    offsetRef.current = normalize(offsetRef.current - stepDx)

    const now = performance.now()
    const elapsed = (now - d.lastTime) / 1000
    if (elapsed > 0.001) {
      const instantV = -stepDx / elapsed
      velocityRef.current = velocityRef.current * 0.3 + instantV * 0.7
    }
    d.lastX = e.clientX
    d.lastTime = now
  }

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {}
    velocityRef.current = Math.max(-VELOCITY_CLAMP, Math.min(VELOCITY_CLAMP, velocityRef.current))
    resumeAtRef.current = performance.now() + RESUME_AFTER_RELEASE_MS
  }

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Trackpad horizontal swipe — apply directly. Vertical wheel leaves the gallery alone.
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      offsetRef.current = normalize(offsetRef.current + e.deltaX)
      velocityRef.current = 0
      resumeAtRef.current = performance.now() + RESUME_AFTER_RELEASE_MS
    }
  }

  const onMouseEnter = () => { hoveringRef.current = true }
  const onMouseLeave = () => { hoveringRef.current = false }

  return (
    <section style={{
      width: '100%',
      padding: '36px 0 28px',
      borderTop: '1px solid var(--pb-divider)',
      borderBottom: '1px solid var(--pb-divider)',
      background: 'var(--pb-bg-soft)',
    }}>
      <style>{`
        .pb-marquee-viewport {
          position: relative;
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
          touch-action: pan-y;          /* let page scroll vertically; we handle horizontal */
          cursor: grab;
          user-select: none;
        }
        .pb-marquee-viewport:active { cursor: grabbing; }
        .pb-marquee-track {
          display: flex;
          gap: ${GAP}px;
          width: max-content;
          padding: 8px 0 16px;
          will-change: transform;
        }
        .pb-marquee-track img { pointer-events: none; -webkit-user-drag: none; }
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

      <div
        className="pb-marquee-viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onWheel={onWheel}
      >
        <div className="pb-marquee-track" ref={trackRef}>
          {LOOP.map((item, i) => (
            <GalleryCard key={`${item.family}-${i}`} item={item} priority={i < 3} />
          ))}
        </div>
      </div>
    </section>
  )
}

function GalleryCard({ item, priority }: { item: GalleryItem; priority: boolean }) {
  return (
    <div style={{
      flex: '0 0 auto',
      width: CARD_WIDTH,
      borderRadius: 12,
      overflow: 'hidden',
      background: 'var(--pb-card)',
      border: '1px solid var(--pb-divider)',
      boxShadow: '0 6px 20px rgba(10,31,61,0.08)',
      position: 'relative',
    }}>
      <div style={{ position: 'relative', width: CARD_WIDTH, height: CARD_HEIGHT, background: '#e5e7eb' }}>
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
