'use client'

/* eslint-disable @next/next/no-img-element */

/* ------------------------------------------------------------------ *
 *  Renovision — /remodeling landing (redesign).
 *  Forest-green + warm-gold, premium-yet-approachable remodeling site.
 *  Sections: Hero (text + lead form) · Video carousel · How-we-work
 *  table · Photo gallery — with a CTA + lead-form popup between each.
 *  Self-contained scoped styles (rmx-*); Manrope typography.
 * ------------------------------------------------------------------ */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight, Check, ChevronLeft, ChevronRight, Play, X, Menu, Loader2,
} from 'lucide-react'

const WP = 'https://renovisiondesignandbuild.com/wp-content/uploads'
const JOHN = `${WP}/2025/06/john.webp`
const LOGO = '/renovision-logo.png'

const NAV_LINKS = [
  { href: '#top', label: 'Main' },
  { href: '#projects', label: 'Our Projects' },
  { href: '#why', label: 'Why Us' },
  { href: '#why', label: 'Our Story' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#why', label: 'FAQ' },
]

export default function RemodelingLanding() {
  const formRef = useRef<HTMLDivElement>(null)
  const [popup, setPopup] = useState(false)
  const [video, setVideo] = useState<VideoT | null>(null)
  const [lightbox, setLightbox] = useState<number | null>(null)

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])
  const openPopup = useCallback(() => setPopup(true), [])

  return (
    <div className="rmx-root" id="top">
      <RmxStyles />
      <Header onContact={openPopup} />
      <Hero formRef={formRef} onScrollForm={scrollToForm} />

      <CtaBand
        eyebrow="No pressure · No obligation"
        title="See if your project qualifies for a FREE 3D design."
        button="Get My Free Estimate"
        onClick={openPopup}
      />

      <VideoCarousel onPlay={setVideo} />

      <CtaBand
        eyebrow="500+ happy Seattle families"
        title="Your remodel could be the next success story."
        button="Start My Project"
        onClick={openPopup}
      />

      <HowWeWork />

      <CtaBand
        eyebrow="One team, start to finish"
        title="Ready for a remodel without the surprises?"
        button="Book My Free Estimate"
        onClick={openPopup}
      />

      <Gallery onOpen={setLightbox} />

      <CtaBand
        eyebrow="From free 3D design to finished project"
        title="Let’s design the home you’ve always wanted."
        button="Get My Free Estimate"
        onClick={openPopup}
      />

      <Footer onContact={openPopup} />

      {popup && <LeadPopup onClose={() => setPopup(false)} />}
      {video && <VideoModal video={video} onClose={() => setVideo(null)} />}
      {lightbox !== null && (
        <ImageLightbox index={lightbox} onChange={setLightbox} onClose={() => setLightbox(null)} />
      )}
    </div>
  )
}

/* ------------------------------ Header ---------------------------- */

function Header({ onContact }: { onContact: () => void }) {
  const [menu, setMenu] = useState(false)
  return (
    <header className="rmx-header">
      <div className="rmx-header-inner">
        <a href="#top" className="rmx-logo" onClick={() => setMenu(false)}>
          <img src={LOGO} alt="Renovision Design and Build" />
        </a>
        <nav className="rmx-nav">
          {NAV_LINKS.map(l => <a key={l.label} href={l.href}>{l.label}</a>)}
        </nav>
        <button className="rmx-btn rmx-btn-green rmx-header-cta" onClick={onContact}>
          Contact Us <ArrowRight size={16} />
        </button>
        <button className="rmx-burger" aria-label="Menu" onClick={() => setMenu(m => !m)}>
          {menu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {menu && (
        <nav className="rmx-mobile-nav">
          {NAV_LINKS.map(l => <a key={l.label} href={l.href} onClick={() => setMenu(false)}>{l.label}</a>)}
          <button className="rmx-btn rmx-btn-green" onClick={() => { setMenu(false); onContact() }}>
            Contact Us <ArrowRight size={16} />
          </button>
        </nav>
      )}
    </header>
  )
}

/* ------------------------------- Hero ----------------------------- */

const BADGES = [
  { src: `${WP}/2025/05/Google-Review-Logo.png`, label: 'Google Reviews' },
  { src: `${WP}/2025/05/CornerStone-Services-Better-Business-Bureau-A-Rating.png`, label: 'BBB A+ Rating' },
  { src: `${WP}/2025/05/licensed-and-insured-label-official-license-and-insurance-a-guarantee-of-quality-and-safety-png.webp`, label: 'Licensed & Insured' },
  { src: `${WP}/2025/05/award.png`, label: 'Award-Winning Design Team' },
]

function Hero({ formRef, onScrollForm }: { formRef: React.RefObject<HTMLDivElement>; onScrollForm: () => void }) {
  return (
    <section className="rmx-hero">
      <div className="rmx-hero-bg" />
      <div className="rmx-hero-overlay" />
      <div className="rmx-hero-inner">
        <div className="rmx-hero-copy">
          <h1 className="rmx-h1">Remodel Your Home With Confidence</h1>
          <p className="rmx-hero-trust">Licensed, Insured &amp; Backed By 500+ Happy Families</p>
          <p className="rmx-hero-sub">
            From Free 3D Design To Finished Project — One Team, Start To Finish.
          </p>
          <div className="rmx-hero-cta">
            <button className="rmx-btn rmx-btn-gold rmx-btn-lg" onClick={onScrollForm}>
              Get Your Free Estimate <ArrowRight size={18} />
            </button>
            <a href="#testimonials" className="rmx-btn rmx-btn-outline rmx-btn-lg">Learn More</a>
          </div>
          <ul className="rmx-badges">
            {BADGES.map(b => (
              <li key={b.label}>
                <img src={b.src} alt={b.label} />
                <span>{b.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rmx-hero-form" ref={formRef}>
          <LeadFormCard />
        </div>
      </div>
    </section>
  )
}

/* --------------------------- Lead form card ----------------------- */

const PROJECT_TYPES = [
  'Kitchen Remodel', 'Bathroom Remodel', 'Full Home Renovation', 'Roof Replacement',
  'Garage Conversion', 'Basement Finishing', 'Room Addition', 'Outdoor Patio/Deck', 'Other',
]

function LeadFormCard({ onSubmitted }: { onSubmitted?: () => void }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [zip, setZip] = useState('')
  const [types, setTypes] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const guard = useRef(false)

  const allSelected = types.length === PROJECT_TYPES.length
  const toggleAll = () => setTypes(allSelected ? [] : [...PROJECT_TYPES])
  const toggle = (t: string) =>
    setTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError('Please fill in your name, phone and email.')
      return
    }
    if (guard.current) return
    guard.current = true
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/webhooks/lovable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone,
          variant: 'remodeling',
          zip_code: zip,
          interested_multiple: types,
          submitted_at: new Date().toISOString(),
        }),
      })
      if (!res.ok) throw new Error('failed')
      if (onSubmitted) onSubmitted()
      router.push('/renovision/thank-you')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      guard.current = false
    }
  }

  return (
    <form className="rmx-form" onSubmit={submit}>
      <h2 className="rmx-form-title">Get Your Free Estimate</h2>
      <span className="rmx-form-divider" />

      <label className="rmx-field">
        <span>Full Name</span>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" autoComplete="name" />
      </label>
      <label className="rmx-field">
        <span>Phone Number</span>
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 555-5555" type="tel" autoComplete="tel" />
      </label>
      <label className="rmx-field">
        <span>Email Address</span>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email" autoComplete="email" />
      </label>
      <label className="rmx-field">
        <span>ZIP Code</span>
        <input value={zip} onChange={e => setZip(e.target.value)} placeholder="98000" inputMode="numeric" maxLength={5} autoComplete="postal-code" />
      </label>

      <div className="rmx-field">
        <span>Project Type</span>
        <div className="rmx-checks">
          <button type="button" className={`rmx-check rmx-check-all${allSelected ? ' rmx-check-on' : ''}`} onClick={toggleAll}>
            <i>{allSelected && <Check size={13} />}</i> All
          </button>
          {PROJECT_TYPES.map(t => (
            <button type="button" key={t} className={`rmx-check${types.includes(t) ? ' rmx-check-on' : ''}`} onClick={() => toggle(t)}>
              <i>{types.includes(t) && <Check size={13} />}</i> {t}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="rmx-form-err">{error}</p>}

      <button type="submit" className="rmx-form-submit" disabled={loading}>
        <img src={JOHN} alt="John" className="rmx-john" />
        <span>{loading ? 'Sending…' : 'Book Your Free Estimate With John'}</span>
        {loading ? <Loader2 size={16} className="rmx-spin" /> : <ArrowRight size={16} />}
      </button>
      <p className="rmx-form-trust"><Check size={15} /> We’ll Get Back To You Within 24 Hours</p>
    </form>
  )
}

/* ----------------------------- CTA band --------------------------- */

function CtaBand({ eyebrow, title, button, onClick }: { eyebrow: string; title: string; button: string; onClick: () => void }) {
  return (
    <section className="rmx-ctaband">
      <div className="rmx-ctaband-inner">
        <div>
          <p className="rmx-ctaband-eyebrow">{eyebrow}</p>
          <h3 className="rmx-ctaband-title">{title}</h3>
        </div>
        <button className="rmx-btn rmx-btn-gold rmx-btn-lg" onClick={onClick}>
          {button} <ArrowRight size={18} />
        </button>
      </div>
    </section>
  )
}

/* ------------------------- Video carousel ------------------------- */

interface VideoT { name: string; project: string; driveId: string }

const VIDEOS: VideoT[] = [
  { name: 'Maya & Lewis', project: 'Kitchen Renovation', driveId: '1M8U6cIAkCh0yRXNR9isCKKfJ4I99bcDB' },
  { name: 'Jennifer', project: 'Wetroom Transformation', driveId: '1JOzVluFR_T-ui90U9suqBWbdDpwKxlw8' },
  { name: 'Maria', project: 'Bathroom Remodel', driveId: '1fm3UESlPIBYjdutByizCGP0b6MNuhYg5' },
  { name: 'Pete', project: 'Outdoor Project', driveId: '1o8_to9b3siT34t8-vV7WiYY_SalHnxQO' },
  { name: 'Jack', project: 'Kitchen Remodel', driveId: '176JLmYNk1krSTKaCkxIS9c3KSl0F040f' },
  { name: 'Terri & Loreli', project: 'Full-Home Remodel', driveId: '1aU95aapYzyzjhlsvZjjfb06TaVeFnMh5' },
]

function VideoCarousel({ onPlay }: { onPlay: (v: VideoT) => void }) {
  const track = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => track.current?.scrollBy({ left: dir * 360, behavior: 'smooth' })
  return (
    <section className="rmx-section" id="testimonials">
      <div className="rmx-section-head">
        <p className="rmx-eyebrow">Testimonials</p>
        <h2 className="rmx-h2">Hear Their Renovation Stories</h2>
        <p className="rmx-lead">Real Seattle homeowners on what it’s like to remodel with Renovision.</p>
      </div>
      <div className="rmx-carousel">
        <button className="rmx-car-arrow rmx-car-prev" onClick={() => scroll(-1)} aria-label="Scroll left"><ChevronLeft size={24} /></button>
        <div className="rmx-car-track" ref={track}>
          {VIDEOS.map(v => (
            <button key={v.driveId} className="rmx-vid" onClick={() => onPlay(v)} aria-label={`Play ${v.name}'s video`}>
              <img className="rmx-vid-thumb" src={`https://drive.google.com/thumbnail?id=${v.driveId}&sz=w640`} alt={`${v.name} testimonial`} loading="lazy" />
              <span className="rmx-vid-shade" />
              <span className="rmx-vid-play"><Play size={22} fill="currentColor" /></span>
              <span className="rmx-vid-meta">
                <span className="rmx-vid-name">{v.name}</span>
                <span className="rmx-vid-project">{v.project}</span>
              </span>
            </button>
          ))}
        </div>
        <button className="rmx-car-arrow rmx-car-next" onClick={() => scroll(1)} aria-label="Scroll right"><ChevronRight size={24} /></button>
      </div>
    </section>
  )
}

function VideoModal({ video, onClose }: { video: VideoT; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <div className="rmx-modal" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${video.name} testimonial`}>
      <div className="rmx-modal-inner" onClick={e => e.stopPropagation()}>
        <button className="rmx-modal-close" onClick={onClose} aria-label="Close"><X size={22} /></button>
        <div className="rmx-modal-video">
          <iframe src={`https://drive.google.com/file/d/${video.driveId}/preview`} allow="autoplay; fullscreen" allowFullScreen title={`${video.name} — ${video.project}`} />
        </div>
        <div className="rmx-modal-cap"><strong>{video.name}</strong><span>{video.project}</span></div>
      </div>
    </div>
  )
}

/* --------------------------- How we work -------------------------- */

const STEPS = [
  { n: '01', stage: 'Free 3D Design & Estimate', usual: 'A vague number quoted over the phone, sight unseen.', us: 'A free in-home visit, a real 3D design and a clear written estimate before you commit.' },
  { n: '02', stage: 'One Dedicated Project Manager', usual: 'You’re bounced between salespeople, schedulers and crews.', us: 'One project manager owns your job from day one through to handover.' },
  { n: '03', stage: 'Locked Scope & Timeline', usual: '“We’ll try to finish in a few weeks.” Then it drags for months.', us: 'A clear scope, materials list and schedule agreed up front — with updates every step.' },
  { n: '04', stage: 'Clean, Respectful Build', usual: 'Dust everywhere and your home left a construction zone.', us: 'Dust barriers, daily clean-up and a plan so you can keep living at home.' },
  { n: '05', stage: 'Permits & Warranty', usual: 'You chase permits, and the contractor vanishes after the check clears.', us: 'We pull every permit and stand behind the work — licensed, insured & warrantied.' },
]

function HowWeWork() {
  return (
    <section className="rmx-section rmx-section-green" id="why">
      <div className="rmx-section-head">
        <p className="rmx-eyebrow rmx-eyebrow-gold">How We Work</p>
        <h2 className="rmx-h2 rmx-h2-light">A Better Process, From First Call to Final Walk-through</h2>
        <p className="rmx-lead rmx-lead-light">The same five steps on every project — here’s how that compares to the usual remodeling experience.</p>
      </div>
      <div className="rmx-table">
        <div className="rmx-table-head">
          <span>Stage</span>
          <span>The Usual Experience</span>
          <span>The Renovision Way</span>
        </div>
        {STEPS.map(s => (
          <div key={s.n} className="rmx-table-row">
            <div className="rmx-table-stage"><b>{s.n}</b><span>{s.stage}</span></div>
            <div className="rmx-table-usual"><X size={15} /> <span>{s.usual}</span></div>
            <div className="rmx-table-us"><Check size={15} /> <span>{s.us}</span></div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ----------------------------- Gallery ---------------------------- */

interface Shot { src: string; category: string; caption: string }
const GALLERY: Shot[] = [
  { src: '/projects/project-01.jpg', category: 'Kitchen', caption: 'Chef’s Kitchen with Pro Range' },
  { src: '/projects/project-09.jpg', category: 'Kitchen', caption: 'Bright White Shaker Kitchen' },
  { src: '/projects/project-06.jpg', category: 'Bathroom', caption: 'Modern Master Bath' },
  { src: '/projects/project-03.jpg', category: 'Outdoor', caption: 'Covered Patio & Cedar Deck' },
  { src: '/projects/project-12.jpg', category: 'Bathroom', caption: 'Spa Bath & Double Vanity' },
  { src: '/projects/project-04.jpg', category: 'Kitchen', caption: 'Open-Concept Kitchen & Living' },
  { src: '/projects/project-07.jpg', category: 'Bathroom', caption: 'Dark Spa Bath' },
  { src: '/projects/project-15.jpg', category: 'Kitchen', caption: 'U-Shaped Kitchen, Bay Window' },
  { src: '/projects/project-11.jpg', category: 'Bathroom', caption: 'Marble Walk-In Shower' },
  { src: '/projects/project-14.jpg', category: 'Whole Home', caption: 'Kitchen & Dining Great Room' },
  { src: '/projects/project-02.jpg', category: '3D Design', caption: 'Spa-Style Bath — 3D Design' },
  { src: '/projects/project-10.jpg', category: 'Living', caption: 'Waterfront Living Room' },
  { src: '/projects/project-13.jpg', category: 'Bathroom', caption: 'Custom Wood Double Vanity' },
  { src: '/projects/project-05.png', category: '3D Design', caption: 'Open Kitchen — 3D Design' },
  { src: '/projects/project-08.jpg', category: 'Clients', caption: 'Another Happy Homeowner' },
]

function Gallery({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <section className="rmx-section" id="projects">
      <div className="rmx-section-head">
        <p className="rmx-eyebrow">Our Projects</p>
        <h2 className="rmx-h2">A Few of the Spaces We’ve Transformed</h2>
        <p className="rmx-lead">Kitchens, bathrooms, outdoor living and full-home remodels across Greater Seattle. Tap any photo to view it full-size.</p>
      </div>
      <div className="rmx-gal">
        {GALLERY.map((g, i) => (
          <button key={g.src} className="rmx-gal-item" onClick={() => onOpen(i)} aria-label={`View ${g.caption}`}>
            <img src={g.src} alt={g.caption} loading="lazy" />
            <span className="rmx-gal-overlay">
              <span className="rmx-gal-cat">{g.category}</span>
              <span className="rmx-gal-cap">{g.caption}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

function ImageLightbox({ index, onChange, onClose }: { index: number; onChange: (i: number) => void; onClose: () => void }) {
  const total = GALLERY.length
  const prev = useCallback(() => onChange((index - 1 + total) % total), [index, total, onChange])
  const next = useCallback(() => onChange((index + 1) % total), [index, total, onChange])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose, prev, next])
  const g = GALLERY[index]
  return (
    <div className="rmx-lb" onClick={onClose} role="dialog" aria-modal="true" aria-label={g.caption}>
      <button className="rmx-lb-close" onClick={onClose} aria-label="Close"><X size={24} /></button>
      <button className="rmx-lb-nav rmx-lb-prev" onClick={e => { e.stopPropagation(); prev() }} aria-label="Previous"><ChevronLeft size={30} /></button>
      <div className="rmx-lb-stage" onClick={e => e.stopPropagation()}>
        <img src={g.src} alt={g.caption} />
        <div className="rmx-lb-cap"><span className="rmx-gal-cat">{g.category}</span><span>{g.caption}</span><span className="rmx-lb-count">{index + 1} / {total}</span></div>
      </div>
      <button className="rmx-lb-nav rmx-lb-next" onClick={e => { e.stopPropagation(); next() }} aria-label="Next"><ChevronRight size={30} /></button>
    </div>
  )
}

/* ------------------------------ Popup ----------------------------- */

function LeadPopup({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <div className="rmx-popup" onClick={onClose} role="dialog" aria-modal="true" aria-label="Get your free estimate">
      <div className="rmx-popup-inner" onClick={e => e.stopPropagation()}>
        <button className="rmx-popup-close" onClick={onClose} aria-label="Close"><X size={22} /></button>
        <LeadFormCard onSubmitted={onClose} />
      </div>
    </div>
  )
}

/* ------------------------------ Footer ---------------------------- */

function Footer({ onContact }: { onContact: () => void }) {
  return (
    <footer className="rmx-footer">
      <div className="rmx-footer-inner">
        <img src={LOGO} alt="Renovision Design and Build" className="rmx-footer-logo" />
        <nav className="rmx-footer-nav">
          {NAV_LINKS.map(l => <a key={l.label} href={l.href}>{l.label}</a>)}
          <button onClick={onContact}>Contact Us</button>
        </nav>
        <p className="rmx-footer-fine">© 2026 Renovision Design &amp; Build. Licensed &amp; Insured. Serving Greater Seattle, Tacoma → Marysville.</p>
      </div>
    </footer>
  )
}

/* --------------------------- Scoped styles ------------------------ */

function RmxStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
      .rmx-root, .rmx-root * { font-family: 'Manrope', system-ui, -apple-system, sans-serif !important; }
      .rmx-root {
        --g: #123f38;
        --g-deep: #0f352f;
        --gold: #c8b177;
        --gold-d: #b39a5d;
        --ink: #242424;
        --muted: #5f6360;
        --bg: #ffffff;
        --bg2: #f7f5f1;
        --line: rgba(0,0,0,.09);
        color: var(--ink);
        background: var(--bg);
        scroll-behavior: smooth;
        overflow-x: hidden;
      }
      .rmx-root img { max-width: 100%; }

      /* Buttons — squared, not pill */
      .rmx-btn { display: inline-flex; align-items: center; justify-content: center; gap: 9px; border: none; cursor: pointer; border-radius: 3px; font-weight: 700; font-size: 15px; padding: 13px 24px; transition: background .18s ease, transform .15s ease, box-shadow .18s ease; text-decoration: none; line-height: 1; }
      .rmx-btn:hover { transform: translateY(-1px); }
      .rmx-btn-lg { font-size: 16px; padding: 17px 30px; }
      .rmx-btn-gold { background: var(--gold); color: #20180a; }
      .rmx-btn-gold:hover { background: var(--gold-d); }
      .rmx-btn-green { background: var(--g); color: #fff; }
      .rmx-btn-green:hover { background: var(--g-deep); }
      .rmx-btn-outline { background: transparent; border: 1.5px solid var(--g); color: var(--g); }
      .rmx-btn-outline:hover { background: rgba(18,63,56,.06); }

      /* Header */
      .rmx-header { position: sticky; top: 0; z-index: 60; height: 84px; background: #fff; border-bottom: 1px solid var(--line); }
      .rmx-header-inner { max-width: 1500px; margin: 0 auto; height: 84px; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
      .rmx-logo img { height: 50px; width: auto; display: block; }
      .rmx-nav { display: flex; gap: 30px; }
      .rmx-nav a { color: var(--ink); text-decoration: none; font-size: 15px; font-weight: 600; transition: color .15s ease; }
      .rmx-nav a:hover { color: var(--g); }
      .rmx-burger { display: none; background: none; border: none; color: var(--g); cursor: pointer; }
      .rmx-mobile-nav { display: none; }

      /* Hero */
      .rmx-hero { position: relative; min-height: calc(100vh - 84px); display: flex; align-items: center; overflow: hidden; }
      .rmx-hero-bg { position: absolute; inset: 0; background-image: url('/projects/project-01.jpg'); background-size: cover; background-position: center; }
      .rmx-hero-overlay { position: absolute; inset: 0; background: linear-gradient(100deg, rgba(255,255,255,.97) 0%, rgba(255,255,255,.9) 34%, rgba(255,255,255,.55) 56%, rgba(247,245,241,.15) 78%, rgba(247,245,241,0) 100%); }
      .rmx-hero-inner { position: relative; z-index: 2; width: 100%; max-width: 1500px; margin: 0 auto; padding: 60px 40px 60px 80px; display: grid; grid-template-columns: minmax(0, 45%) minmax(420px, 460px); justify-content: space-between; align-items: center; gap: 48px; }
      .rmx-h1 { font-size: clamp(42px, 5vw, 72px); font-weight: 500; line-height: 1.05; letter-spacing: -2px; color: var(--ink); margin: 0 0 22px; }
      .rmx-hero-trust { font-size: clamp(18px, 1.6vw, 22px); font-weight: 800; color: var(--g); margin: 0 0 14px; }
      .rmx-hero-sub { font-size: clamp(17px, 1.3vw, 20px); line-height: 1.55; color: var(--muted); margin: 0 0 30px; max-width: 520px; }
      .rmx-hero-cta { display: flex; gap: 14px; flex-wrap: wrap; }
      .rmx-badges { list-style: none; display: flex; flex-wrap: wrap; gap: 14px 26px; padding: 0; margin: 40px 0 0; }
      .rmx-badges li { display: flex; align-items: center; gap: 9px; font-size: 13px; font-weight: 600; color: var(--ink); }
      .rmx-badges img { height: 30px; width: auto; object-fit: contain; }

      /* Lead form card */
      .rmx-hero-form { width: 100%; }
      .rmx-form { background: linear-gradient(160deg, var(--g) 0%, var(--g-deep) 100%); border-radius: 2px; padding: 40px; box-shadow: 0 30px 70px rgba(15,53,47,.32); }
      .rmx-form-title { font-size: 26px; font-weight: 700; color: #fff; margin: 0 0 12px; letter-spacing: -.5px; }
      .rmx-form-divider { display: block; width: 54px; height: 3px; background: var(--gold); margin: 0 0 24px; }
      .rmx-field { display: block; margin-bottom: 16px; }
      .rmx-field > span { display: block; font-size: 13px; font-weight: 600; color: rgba(255,255,255,.82); margin-bottom: 7px; }
      .rmx-field input { width: 100%; padding: 13px 15px; border-radius: 2px; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.2); color: #fff; font-size: 15px; outline: none; transition: border-color .15s ease, background .15s ease; }
      .rmx-field input::placeholder { color: rgba(255,255,255,.5); }
      .rmx-field input:focus { border-color: var(--gold); background: rgba(255,255,255,.16); }
      .rmx-checks { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
      .rmx-check { display: flex; align-items: center; gap: 9px; padding: 10px 12px; border-radius: 2px; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.16); color: rgba(255,255,255,.9); font-size: 13px; font-weight: 600; cursor: pointer; text-align: left; transition: all .15s ease; }
      .rmx-check:hover { background: rgba(255,255,255,.14); }
      .rmx-check i { flex-shrink: 0; width: 18px; height: 18px; border-radius: 2px; border: 1.5px solid rgba(255,255,255,.45); display: flex; align-items: center; justify-content: center; color: #20180a; }
      .rmx-check-on { background: rgba(200,177,119,.18); border-color: var(--gold); }
      .rmx-check-on i { background: var(--gold); border-color: var(--gold); }
      .rmx-check-all { grid-column: 1 / -1; }
      .rmx-form-err { color: #ffd0c4; font-size: 13px; margin: 6px 0 0; }
      .rmx-form-submit { display: flex; align-items: center; justify-content: center; gap: 11px; width: 100%; margin-top: 22px; padding: 13px 18px; border: none; border-radius: 2px; background: var(--gold); color: #20180a; font-size: 15.5px; font-weight: 700; cursor: pointer; transition: background .18s ease; }
      .rmx-form-submit:hover { background: var(--gold-d); }
      .rmx-form-submit:disabled { opacity: .7; cursor: default; }
      .rmx-john { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,.6); }
      .rmx-spin { animation: rmxspin 1s linear infinite; }
      @keyframes rmxspin { to { transform: rotate(360deg); } }
      .rmx-form-trust { display: flex; align-items: center; justify-content: center; gap: 7px; font-size: 13px; color: rgba(255,255,255,.85); margin: 16px 0 0; }
      .rmx-form-trust svg { color: var(--gold); }

      /* Sections */
      .rmx-section { padding: clamp(60px, 8vw, 104px) 0; scroll-margin-top: 84px; }
      .rmx-section-green { background: linear-gradient(170deg, var(--g) 0%, var(--g-deep) 100%); }
      .rmx-section-head { max-width: 820px; margin: 0 auto; padding: 0 24px; text-align: center; }
      .rmx-eyebrow { text-transform: uppercase; letter-spacing: .16em; font-size: 12px; font-weight: 700; color: var(--gold-d); margin: 0 0 12px; }
      .rmx-eyebrow-gold { color: var(--gold); }
      .rmx-h2 { font-size: clamp(28px, 3.6vw, 42px); font-weight: 700; line-height: 1.15; letter-spacing: -1px; color: var(--ink); margin: 0 0 14px; }
      .rmx-h2-light { color: #fff; }
      .rmx-lead { font-size: 18px; line-height: 1.6; color: var(--muted); margin: 0 0 44px; }
      .rmx-lead-light { color: rgba(255,255,255,.8); }

      /* CTA band */
      .rmx-ctaband { background: var(--bg2); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
      .rmx-ctaband-inner { max-width: 1180px; margin: 0 auto; padding: 32px 40px; display: flex; align-items: center; justify-content: space-between; gap: 28px; }
      .rmx-ctaband-eyebrow { text-transform: uppercase; letter-spacing: .12em; font-size: 11.5px; font-weight: 700; color: var(--gold-d); margin: 0 0 6px; }
      .rmx-ctaband-title { font-size: clamp(19px, 2.2vw, 26px); font-weight: 700; letter-spacing: -.5px; color: var(--g); margin: 0; }

      /* Carousel */
      .rmx-carousel { position: relative; max-width: 1320px; margin: 0 auto; padding: 0 24px; }
      .rmx-car-track { display: flex; gap: 20px; overflow-x: auto; scroll-snap-type: x mandatory; padding: 8px 4px 18px; scrollbar-width: none; }
      .rmx-car-track::-webkit-scrollbar { display: none; }
      .rmx-vid { position: relative; flex: 0 0 300px; scroll-snap-align: start; aspect-ratio: 3/4; border-radius: 4px; overflow: hidden; cursor: pointer; border: none; padding: 0; background: linear-gradient(160deg, #1d3a35, #122b27); }
      .rmx-vid-thumb { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
      .rmx-vid-shade { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(10,24,21,.85) 100%); }
      .rmx-vid-play { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 58px; height: 58px; border-radius: 50%; background: rgba(200,177,119,.95); color: #20180a; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(0,0,0,.35); transition: transform .15s ease; }
      .rmx-vid:hover .rmx-vid-play { transform: translate(-50%, -50%) scale(1.08); }
      .rmx-vid-meta { position: absolute; left: 16px; bottom: 14px; display: flex; flex-direction: column; gap: 2px; text-align: left; z-index: 2; }
      .rmx-vid-name { font-size: 17px; font-weight: 700; color: #fff; }
      .rmx-vid-project { font-size: 12.5px; font-weight: 600; color: var(--gold); }
      .rmx-car-arrow { position: absolute; top: calc(50% - 9px); transform: translateY(-50%); width: 46px; height: 46px; border-radius: 50%; border: 1px solid var(--line); background: #fff; color: var(--g); display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 6px 20px rgba(0,0,0,.12); z-index: 3; transition: background .15s ease, color .15s ease; }
      .rmx-car-arrow:hover { background: var(--g); color: #fff; }
      .rmx-car-prev { left: -6px; }
      .rmx-car-next { right: -6px; }

      /* Video / popup modals */
      .rmx-modal, .rmx-popup, .rmx-lb { position: fixed; inset: 0; z-index: 120; background: rgba(10,18,16,.86); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 24px; }
      .rmx-modal-inner { position: relative; width: 100%; max-width: 460px; }
      .rmx-modal-close, .rmx-popup-close { position: absolute; top: -46px; right: 0; width: 38px; height: 38px; border-radius: 50%; border: none; cursor: pointer; background: rgba(255,255,255,.14); color: #fff; display: flex; align-items: center; justify-content: center; }
      .rmx-modal-video { position: relative; width: 100%; aspect-ratio: 9/16; max-height: 76vh; border-radius: 4px; overflow: hidden; background: #000; }
      .rmx-modal-video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
      .rmx-modal-cap { text-align: center; margin-top: 14px; display: flex; flex-direction: column; gap: 2px; }
      .rmx-modal-cap strong { color: #fff; } .rmx-modal-cap span { color: var(--gold); font-size: 13px; }

      /* Popup */
      .rmx-popup-inner { position: relative; width: 100%; max-width: 440px; max-height: 92vh; overflow-y: auto; }
      .rmx-popup-close { top: 12px; right: 12px; background: rgba(255,255,255,.18); z-index: 2; }

      /* How-we-work table */
      .rmx-table { max-width: 1080px; margin: 0 auto; padding: 0 24px; }
      .rmx-table-head { display: grid; grid-template-columns: .9fr 1.2fr 1.2fr; gap: 1px; background: rgba(255,255,255,.14); border-radius: 4px 4px 0 0; overflow: hidden; }
      .rmx-table-head span { background: rgba(255,255,255,.06); padding: 14px 18px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: rgba(255,255,255,.7); }
      .rmx-table-head span:last-child { color: var(--gold); }
      .rmx-table-row { display: grid; grid-template-columns: .9fr 1.2fr 1.2fr; gap: 1px; background: rgba(255,255,255,.1); }
      .rmx-table-row > div { background: rgba(255,255,255,.04); padding: 18px; font-size: 14.5px; line-height: 1.55; display: flex; gap: 9px; }
      .rmx-table-stage { flex-direction: column; gap: 4px !important; }
      .rmx-table-stage b { color: var(--gold); font-size: 13px; }
      .rmx-table-stage span { color: #fff; font-weight: 700; }
      .rmx-table-usual { color: rgba(255,255,255,.62); }
      .rmx-table-usual svg { color: #d98a7a; flex-shrink: 0; margin-top: 2px; }
      .rmx-table-us { color: #fff; background: rgba(200,177,119,.1) !important; }
      .rmx-table-us svg { color: var(--gold); flex-shrink: 0; margin-top: 2px; }

      /* Gallery */
      .rmx-gal { max-width: 1280px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
      .rmx-gal-item { position: relative; aspect-ratio: 4/3; border: none; padding: 0; cursor: pointer; border-radius: 4px; overflow: hidden; background: #e9e7e2; }
      .rmx-gal-item img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s ease; }
      .rmx-gal-item:hover img { transform: scale(1.06); }
      .rmx-gal-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; gap: 6px; padding: 16px; text-align: left; background: linear-gradient(180deg, transparent 45%, rgba(15,53,47,.86) 100%); opacity: 0; transition: opacity .25s ease; }
      .rmx-gal-item:hover .rmx-gal-overlay { opacity: 1; }
      .rmx-gal-cat { align-self: flex-start; font-size: 11px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: #20180a; background: var(--gold); padding: 3px 9px; border-radius: 3px; }
      .rmx-gal-cap { font-size: 14px; font-weight: 600; color: #fff; }

      /* Lightbox */
      .rmx-lb-close { position: absolute; top: 20px; right: 20px; width: 42px; height: 42px; border-radius: 50%; border: none; cursor: pointer; background: rgba(255,255,255,.14); color: #fff; display: flex; align-items: center; justify-content: center; z-index: 2; }
      .rmx-lb-nav { position: absolute; top: 50%; transform: translateY(-50%); width: 50px; height: 50px; border-radius: 50%; border: none; cursor: pointer; background: rgba(255,255,255,.14); color: #fff; display: flex; align-items: center; justify-content: center; z-index: 2; }
      .rmx-lb-nav:hover { background: var(--gold); color: #20180a; }
      .rmx-lb-prev { left: 16px; } .rmx-lb-next { right: 16px; }
      .rmx-lb-stage { display: flex; flex-direction: column; align-items: center; gap: 14px; max-width: 1100px; }
      .rmx-lb-stage img { max-width: 90vw; max-height: 80vh; object-fit: contain; border-radius: 4px; box-shadow: 0 24px 70px rgba(0,0,0,.6); }
      .rmx-lb-cap { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; color: #fff; font-size: 15px; font-weight: 500; }
      .rmx-lb-count { color: rgba(255,255,255,.55); font-size: 13px; }

      /* Footer */
      .rmx-footer { background: var(--g-deep); color: rgba(255,255,255,.72); padding: 40px 0; }
      .rmx-footer-inner { max-width: 1180px; margin: 0 auto; padding: 0 40px; display: flex; flex-direction: column; align-items: center; gap: 18px; text-align: center; }
      .rmx-footer-logo { height: 46px; width: auto; filter: brightness(0) invert(1); opacity: .9; }
      .rmx-footer-nav { display: flex; gap: 22px; flex-wrap: wrap; justify-content: center; }
      .rmx-footer-nav a, .rmx-footer-nav button { color: rgba(255,255,255,.8); text-decoration: none; font-size: 14px; background: none; border: none; cursor: pointer; }
      .rmx-footer-nav a:hover, .rmx-footer-nav button:hover { color: var(--gold); }
      .rmx-footer-fine { font-size: 13px; color: rgba(255,255,255,.5); margin: 0; }

      /* Responsive */
      @media (max-width: 1100px) {
        .rmx-hero-inner { grid-template-columns: 1fr; padding: 48px 40px; gap: 36px; }
        .rmx-hero-copy { max-width: 640px; }
        .rmx-hero-form { max-width: 460px; }
      }
      @media (max-width: 980px) {
        .rmx-gal { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 820px) {
        .rmx-nav, .rmx-header-cta { display: none; }
        .rmx-burger { display: flex; }
        .rmx-header-inner { padding: 0 24px; }
        .rmx-mobile-nav { display: flex; flex-direction: column; gap: 4px; padding: 12px 24px 20px; background: #fff; border-bottom: 1px solid var(--line); }
        .rmx-mobile-nav a { padding: 11px 4px; color: var(--ink); text-decoration: none; font-weight: 600; border-bottom: 1px solid var(--line); }
        .rmx-mobile-nav .rmx-btn { margin-top: 10px; }
        /* Mobile hero: image as a top banner above the headline, faded out at the bottom */
        .rmx-hero { display: block; min-height: 0; }
        .rmx-hero-bg { position: relative; height: 320px; }
        .rmx-hero-overlay { bottom: auto; height: 320px; background: linear-gradient(to bottom, rgba(247,245,241,0) 42%, rgba(247,245,241,.7) 80%, var(--bg) 100%); }
        .rmx-hero-inner { display: block; padding: 26px 22px 42px; background: var(--bg); }
        .rmx-hero-copy { max-width: none; }
        .rmx-hero-form { max-width: none; margin-top: 26px; }
        .rmx-ctaband-inner { flex-direction: column; align-items: flex-start; gap: 18px; }
        .rmx-table-head { display: none; }
        .rmx-table-row { grid-template-columns: 1fr; gap: 0; border-radius: 4px; overflow: hidden; margin-bottom: 12px; }
      }
      @media (max-width: 560px) {
        .rmx-hero-inner { padding: 36px 22px; }
        .rmx-h1 { letter-spacing: -1px; }
        .rmx-form { padding: 26px 22px; }
        .rmx-checks { grid-template-columns: 1fr; }
        .rmx-gal { grid-template-columns: 1fr; }
        .rmx-vid { flex-basis: 78vw; }
        .rmx-car-prev { left: 2px; } .rmx-car-next { right: 2px; }
      }
    `}</style>
  )
}
