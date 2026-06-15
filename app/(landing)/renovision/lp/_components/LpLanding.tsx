'use client'

/* eslint-disable @next/next/no-img-element */

/* ------------------------------------------------------------------ *
 *  Renovision — "/lp" landing page.
 *  A faithful React rebuild of the WordPress/Elementor page at
 *  renovisiondesignandbuild.com/lp/ — same sections, copy, portfolio
 *  (7 before/after projects), trust badges and FAQ. Brand gold #c0ac7a.
 *  Images are hotlinked from the brand's own WP media library.
 *  Lead capture reuses the platform LeadForm (variant general).
 *  Self-contained scoped styles (lp-*).
 * ------------------------------------------------------------------ */

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, Phone, Play, Plus, Minus, Star, X } from 'lucide-react'
import LeadForm from '../../_components/LeadForm'

const WP = 'https://renovisiondesignandbuild.com/wp-content/uploads'
const LOGO = `${WP}/2025/05/logo-1.png`

export default function LpLanding() {
  const formRef = useRef<HTMLDivElement>(null)
  const [video, setVideo] = useState<Video | null>(null)

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <div className="lp-root" id="top">
      <LpStyles />
      <Nav onCta={scrollToForm} />
      <Hero onCta={scrollToForm} />
      <Transformation onCta={scrollToForm} />
      <WhyUs onCta={scrollToForm} />
      <Story />
      <Testimonials onPlay={setVideo} onCta={scrollToForm} />
      <EasyStart onCta={scrollToForm} />
      <Steps onCta={scrollToForm} />
      <Faq />
      <FinalCta formRef={formRef} />
      <Footer />
      {video && <VideoModal video={video} onClose={() => setVideo(null)} />}
    </div>
  )
}

/* ------------------------------- Nav ------------------------------ */

const NAV_LINKS = [
  { href: '#projects', label: 'Our Projects' },
  { href: '#why', label: 'Why us' },
  { href: '#story', label: 'Our Story' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#faq', label: 'FAQ' },
]

function Nav({ onCta }: { onCta: () => void }) {
  return (
    <header className="lp-nav">
      <div className="lp-container lp-nav-inner">
        <a href="#top" className="lp-nav-logo">
          <img src={LOGO} alt="Renovision Design and Build" />
        </a>
        <nav className="lp-nav-links">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <button className="lp-btn lp-btn-gold lp-nav-cta" onClick={onCta}>
          <Phone size={15} /> Contact us
        </button>
      </div>
    </header>
  )
}

/* ------------------------------ Hero ------------------------------ */

const BADGES = [
  { src: `${WP}/2025/05/Google-Review-Logo.png`, alt: 'Google Reviews' },
  { src: `${WP}/2025/05/CornerStone-Services-Better-Business-Bureau-A-Rating.png`, alt: 'BBB A Rating' },
  { src: `${WP}/2025/05/licensed-and-insured-label-official-license-and-insurance-a-guarantee-of-quality-and-safety-png.webp`, alt: 'Licensed & Insured' },
  { src: `${WP}/2025/05/award.png`, alt: 'Award winning' },
]

function Hero({ onCta }: { onCta: () => void }) {
  return (
    <section className="lp-hero" style={{ backgroundImage: `linear-gradient(rgba(15,15,15,.62), rgba(15,15,15,.72)), url(${WP}/2025/05/after1.jpg)` }}>
      <div className="lp-container lp-hero-inner">
        <h1 className="lp-h1">Remodel Your Home With Confidence</h1>
        <p className="lp-hero-sub">Licensed, Insured &amp; Backed by 500+ Happy Families</p>
        <p className="lp-hero-line">From Free 3D Design to Finished Project — One Team, Start to Finish.</p>
        <div className="lp-hero-cta">
          <button className="lp-btn lp-btn-gold lp-btn-lg" onClick={onCta}>
            Get Your Free Estimate <ArrowRight size={18} />
          </button>
          <a href="#why" className="lp-btn lp-btn-ghost lp-btn-lg">Learn more</a>
        </div>
        <div className="lp-badges">
          {BADGES.map(b => <img key={b.alt} src={b.src} alt={b.alt} />)}
        </div>
      </div>
    </section>
  )
}

/* -------------------------- Transformation ------------------------ */

interface Project {
  title: string
  location: string
  category: 'Kitchen' | 'Bathroom' | 'Outdoor'
  after: string
  before: string
  blurb: string
}

const PROJECTS: Project[] = [
  { title: 'Maya & Lewis’s Kitchen Renovation', location: 'Bothell, Washington', category: 'Kitchen',
    after: `${WP}/2025/05/after3.jpg`, before: `${WP}/2025/05/before3.jpg`,
    blurb: 'A tired, closed-off kitchen reimagined into a bright, open family space.' },
  { title: 'Jennifer’s Wetroom Transformation', location: 'Puyallup, Washington', category: 'Bathroom',
    after: `${WP}/2025/05/after1.jpg`, before: `${WP}/2025/05/IMG_3408.jpeg`,
    blurb: 'A dated bathroom converted into a sleek, fully waterproof wetroom.' },
  { title: 'The Thompsons’ Kitchen Makeover', location: 'Kirkland, Washington', category: 'Kitchen',
    after: `${WP}/2025/07/%E7%85%A7%E7%89%87-10-9-24-%E4%B8%8A%E5%8D%8811-17-43-scaled.jpg`, before: `${WP}/2025/07/IMG_0953-scaled.jpg`,
    blurb: 'A 1980s kitchen brought into the present with custom cabinetry and stone.' },
  { title: 'Susan’s Tub-to-Shower Conversion', location: 'Kenmore, Washington', category: 'Bathroom',
    after: `${WP}/2025/05/After2.jpg`, before: `${WP}/2025/05/before2.jpg`,
    blurb: 'An old tub replaced with a spacious, easy-access walk-in shower.' },
  { title: 'The Reynolds’s Driveway Renovation', location: 'Renton, Washington', category: 'Outdoor',
    after: `${WP}/2025/05/b1.jpg`, before: `${WP}/2025/05/b2.jpg`,
    blurb: 'A cracked, worn driveway rebuilt for lasting curb appeal.' },
  { title: 'The Harris’s Bathroom Renovation', location: 'Marysville, Washington', category: 'Bathroom',
    after: `${WP}/2025/05/c3.webp`, before: `${WP}/2025/05/c2.webp`,
    blurb: 'A full bathroom remodel with modern tile, lighting and fixtures.' },
  { title: 'The Bennett Family’s Tub-to-Shower Conversion', location: 'Everett, Washington', category: 'Bathroom',
    after: `${WP}/2025/05/IMG_6638.jpg`, before: `${WP}/2025/05/v3.jpg`,
    blurb: 'A safer, spa-style walk-in shower built for everyday comfort.' },
]

const FILTERS = ['All', 'Kitchen', 'Bathroom', 'Outdoor'] as const

function Transformation({ onCta }: { onCta: () => void }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
  const shown = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === filter)
  return (
    <section className="lp-section" id="projects">
      <div className="lp-container">
        <p className="lp-eyebrow">Our Projects</p>
        <h2 className="lp-h2">See Our Transformation</h2>
        <p className="lp-lead">
          Browse through our portfolio of successful remodeling projects across Seattle. Each space
          tells a story of transformation.
        </p>

        <div className="lp-filters">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`lp-filter${filter === f ? ' lp-filter-active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="lp-proj-grid">
          {shown.map(p => <ProjectCard key={p.title} project={p} />)}
        </div>

        <div className="lp-center">
          <button className="lp-btn lp-btn-gold lp-btn-lg" onClick={onCta}>
            Get a Free 3D Design Now <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const [pos, setPos] = useState(50)
  return (
    <div className="lp-proj">
      <div className="lp-ba">
        <img src={project.after} alt={`${project.title} — after`} className="lp-ba-img" />
        <div className="lp-ba-before" style={{ width: `${pos}%` }}>
          <img src={project.before} alt={`${project.title} — before`} className="lp-ba-img" />
          <span className="lp-ba-tag lp-ba-tag-before">Before</span>
        </div>
        <span className="lp-ba-tag lp-ba-tag-after">After</span>
        <div className="lp-ba-divider" style={{ left: `${pos}%` }}>
          <span className="lp-ba-handle"><ArrowRight size={13} style={{ transform: 'rotate(180deg)' }} /><ArrowRight size={13} /></span>
        </div>
        <input type="range" min={0} max={100} value={pos} onChange={e => setPos(Number(e.target.value))}
          className="lp-ba-range" aria-label={`Compare before and after for ${project.title}`} />
      </div>
      <div className="lp-proj-meta">
        <span className="lp-proj-cat">{project.category}</span>
        <h3 className="lp-proj-title">{project.title}</h3>
        <p className="lp-proj-loc">{project.location}</p>
        <p className="lp-proj-blurb">{project.blurb}</p>
      </div>
    </div>
  )
}

/* ------------------------------ Why us ---------------------------- */

function WhyUs({ onCta }: { onCta: () => void }) {
  return (
    <section className="lp-section lp-section-alt" id="why">
      <div className="lp-container lp-split">
        <div className="lp-split-media">
          <img src={`${WP}/2025/05/IMG_6638.jpg`} alt="Renovision remodel" />
        </div>
        <div className="lp-split-copy">
          <p className="lp-eyebrow">Why us</p>
          <h2 className="lp-h2 lp-h2-left">Why Choose Us?</h2>
          <p className="lp-p">
            You’ve lived in your home for years — it’s where memories were made, holidays were hosted,
            and kids grew up. But now, the kitchen feels tired. The bathroom doesn’t quite work for
            your lifestyle anymore.
          </p>
          <h3 className="lp-h3">You don’t need just a contractor — you need a partner you can trust.</h3>
          <p className="lp-p">
            Our clients work directly with a dedicated project manager from day one, and receive a free
            3D design and estimate, so you can see exactly what you’re getting — before you commit to
            anything. No pressure. No pushy sales. Just professionals who care.
          </p>
          <button className="lp-btn lp-btn-gold lp-btn-lg" onClick={onCta}>
            Discover What’s Possible In Your Home <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ Story ----------------------------- */

function Story() {
  return (
    <section className="lp-section" id="story">
      <div className="lp-container lp-split lp-split-rev">
        <div className="lp-split-copy">
          <p className="lp-eyebrow">Our Story</p>
          <h2 className="lp-h2 lp-h2-left">The Renovision Story</h2>
          <p className="lp-p">
            Renovision Design &amp; Build is a family-owned remodeling company proudly serving from
            Tacoma to Marysville for over 15 years.
          </p>
          <p className="lp-p">
            We specialize in full-service home renovations, combining expert craftsmanship with
            innovative 3D design to bring our clients’ visions to life. From bathrooms and kitchens to
            full-scale home transformations, our mission is to deliver high-quality, stress-free
            remodeling experiences rooted in trust, transparency, and attention to detail.
          </p>
          <ul className="lp-story-stats">
            <li><strong>15+</strong><span>Years in business</span></li>
            <li><strong>500+</strong><span>Happy families</span></li>
            <li><strong>Tacoma → Marysville</strong><span>Proudly serving</span></li>
          </ul>
        </div>
        <div className="lp-split-media">
          <img src={`${WP}/2025/05/after3.jpg`} alt="A finished Renovision project" />
        </div>
      </div>
    </section>
  )
}

/* --------------------------- Testimonials ------------------------- */

interface Video { name: string; project: string; driveId: string }

const VIDEOS: Video[] = [
  { name: 'Maya & Lewis', project: 'Kitchen Renovation', driveId: '1M8U6cIAkCh0yRXNR9isCKKfJ4I99bcDB' },
  { name: 'Jennifer', project: 'Wetroom Transformation', driveId: '1JOzVluFR_T-ui90U9suqBWbdDpwKxlw8' },
  { name: 'Maria', project: 'Bathroom Remodel', driveId: '1fm3UESlPIBYjdutByizCGP0b6MNuhYg5' },
  { name: 'Pete', project: 'Outdoor Project', driveId: '1o8_to9b3siT34t8-vV7WiYY_SalHnxQO' },
  { name: 'Jack', project: 'Kitchen Remodel', driveId: '176JLmYNk1krSTKaCkxIS9c3KSl0F040f' },
  { name: 'Terri & Loreli', project: 'Full-Home Remodel', driveId: '1aU95aapYzyzjhlsvZjjfb06TaVeFnMh5' },
]

function Testimonials({ onPlay, onCta }: { onPlay: (v: Video) => void; onCta: () => void }) {
  return (
    <section className="lp-section lp-section-dark" id="testimonials">
      <div className="lp-container">
        <p className="lp-eyebrow lp-eyebrow-light">Testimonials</p>
        <h2 className="lp-h2 lp-h2-light">Hear Their Renovation Stories</h2>
        <div className="lp-vid-grid">
          {VIDEOS.map(v => (
            <button key={v.driveId} className="lp-vid" onClick={() => onPlay(v)} aria-label={`Play ${v.name}'s video`}>
              <span className="lp-vid-play"><Play size={20} fill="currentColor" /></span>
              <span className="lp-vid-name">{v.name}</span>
              <span className="lp-vid-project">{v.project}</span>
            </button>
          ))}
        </div>
        <div className="lp-center">
          <button className="lp-btn lp-btn-gold lp-btn-lg" onClick={onCta}>
            Discover What’s Possible In Your Home <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <div className="lp-modal" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${video.name} testimonial`}>
      <div className="lp-modal-inner" onClick={e => e.stopPropagation()}>
        <button className="lp-modal-close" onClick={onClose} aria-label="Close"><X size={22} /></button>
        <div className="lp-modal-video">
          <iframe src={`https://drive.google.com/file/d/${video.driveId}/preview`} allow="autoplay; fullscreen" allowFullScreen title={`${video.name} — ${video.project}`} />
        </div>
        <div className="lp-modal-cap"><strong>{video.name}</strong><span>{video.project}</span></div>
      </div>
    </div>
  )
}

/* --------------------------- Easy to start ------------------------ */

const COMPARE = [
  { bad: 'A vague estimate over the phone', good: 'A free, detailed 3D design & written estimate before you commit' },
  { bad: 'You’re passed between salespeople and crews', good: 'One dedicated project manager from day one to handover' },
  { bad: 'High-pressure sales tactics', good: 'No pressure, no pushy sales — just honest guidance' },
  { bad: 'You’re left guessing about the schedule', good: 'A clear schedule up front, with updates every step of the way' },
  { bad: 'You deal with permits & code yourself', good: 'We handle all permits and ensure full code compliance' },
  { bad: 'Your home left a dusty construction zone', good: 'Dust protection and a plan so you can stay in your home' },
]

function EasyStart({ onCta }: { onCta: () => void }) {
  return (
    <section className="lp-section lp-section-alt">
      <div className="lp-container">
        <h2 className="lp-h2">We Make It Easy to Start</h2>
        <p className="lp-lead">What Most Contractors Do vs. How We Operate</p>
        <div className="lp-compare">
          <div className="lp-compare-col lp-compare-bad">
            <div className="lp-compare-head">The Usual Experience</div>
            {COMPARE.map(r => <div key={r.bad} className="lp-compare-row">{r.bad}</div>)}
          </div>
          <div className="lp-compare-col lp-compare-good">
            <div className="lp-compare-head">How We Fixed It</div>
            {COMPARE.map(r => <div key={r.good} className="lp-compare-row">{r.good}</div>)}
          </div>
        </div>
        <div className="lp-center">
          <button className="lp-btn lp-btn-gold lp-btn-lg" onClick={onCta}>
            Discover What’s Possible In Your Home <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ Steps ----------------------------- */

function Steps({ onCta }: { onCta: () => void }) {
  return (
    <section className="lp-section lp-section-dark">
      <div className="lp-container lp-split">
        <div className="lp-split-copy">
          <h2 className="lp-h2 lp-h2-left lp-h2-light">Join 500+ Seattle Families Who Upgraded Their Home Life</h2>
          <ol className="lp-steps">
            <li>
              <span className="lp-step-n">1</span>
              <div><strong>Start with a Free 3D Design &amp; Estimate</strong>
                <p>See exactly what your new space will look like — before you commit to anything.</p></div>
            </li>
            <li>
              <span className="lp-step-n">2</span>
              <div><strong>Book a consultation with John</strong>
                <p>A friendly tour of your options, not a sales pitch.</p></div>
            </li>
          </ol>
          <button className="lp-btn lp-btn-gold lp-btn-lg" onClick={onCta}>
            Get Your Free Estimate <ArrowRight size={18} />
          </button>
        </div>
        <div className="lp-split-media lp-john">
          <img src={`${WP}/2025/06/john.webp`} alt="John — Renovision" />
          <span className="lp-john-cap">Book Your Free Estimate With John</span>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------- FAQ ------------------------------ */

const FAQS = [
  { q: 'How much does a kitchen or bath remodel cost?',
    a: 'The cost depends on the size of your space, the materials you choose, and the complexity of the project. We provide a detailed, personalized estimate during your free consultation.' },
  { q: 'How long does a remodel take?',
    a: 'Most kitchen and bath remodels take between 4 to 8 weeks from the start of construction. The exact timeline depends on the scope of work and any custom orders. We’ll give you a clear schedule before we begin and keep you updated every step of the way.' },
  { q: 'Can I stay in my home during the remodel?',
    a: 'In most cases, you can stay in your home during the remodel! We set up dust protection and work to minimize disruption. If the kitchen or bathroom is your only one, we’ll help you plan for temporary solutions.' },
  { q: 'Do you handle permits and design?',
    a: 'Absolutely. We handle all necessary permits to make sure your project complies with local codes. Plus, our design team will guide you through selecting layouts, finishes, and fixtures to match your style and budget.' },
]

function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="lp-section" id="faq">
      <div className="lp-container lp-faq-wrap">
        <h2 className="lp-h2">Frequently Asked Questions</h2>
        <div className="lp-faq">
          {FAQS.map((f, i) => (
            <div key={f.q} className={`lp-faq-item${open === i ? ' lp-faq-open' : ''}`}>
              <button className="lp-faq-q" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                <span>{f.q}</span>
                {open === i ? <Minus size={20} /> : <Plus size={20} />}
              </button>
              {open === i && <p className="lp-faq-a">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------- Final CTA --------------------------- */

function FinalCta({ formRef }: { formRef: React.RefObject<HTMLDivElement> }) {
  return (
    <section className="lp-section lp-section-cta">
      <div className="lp-container lp-cta-grid" ref={formRef}>
        <div className="lp-cta-copy">
          <div className="lp-stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={20} fill="#c0ac7a" stroke="#c0ac7a" />)}</div>
          <h2 className="lp-h2 lp-h2-left">Join 500+ Seattle Families Who Upgraded Their Home Life</h2>
          <p className="lp-p">Fill in your details to receive a FREE 3D design of your future home today.</p>
          <p className="lp-p">
            Choosing the right remodeler is hard. That’s why we make starting easy, risk-free, and
            pressure-free. Our team has helped hundreds of Seattle homeowners reimagine their homes —
            and we’d love to help you too.
          </p>
          <div className="lp-cta-badges">
            {BADGES.map(b => <img key={b.alt} src={b.src} alt={b.alt} />)}
          </div>
        </div>
        <div className="lp-form-wrap">
          <LeadForm variant="general" />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ Footer ---------------------------- */

const REVIEW_LOGOS = [
  `${WP}/2025/05/g1.png`,
  `${WP}/2025/05/yelp-logo-yelp-icon-transparent-free-png.png`,
  `${WP}/2025/05/Houzz-Logo.png`,
  `${WP}/2025/05/BuildZoom_Logo.png`,
  `${WP}/2025/05/Thumbtack_logo_black_RGB.png`,
]

function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer-logos">
          {REVIEW_LOGOS.map(src => <img key={src} src={src} alt="Review platform" />)}
        </div>
        <nav className="lp-footer-nav">
          <a href="#top">Main</a>
          {NAV_LINKS.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
        </nav>
        <p className="lp-footer-fine">
          <a href="/privacy">Privacy Policy</a> · All rights reserved to ‘Renovision — Design &amp; Build’ ©
        </p>
      </div>
    </footer>
  )
}

/* --------------------------- Scoped styles ------------------------ */

function LpStyles() {
  return (
    <style>{`
      .lp-root {
        --lp-gold: #c0ac7a;
        --lp-gold-dark: #a8915f;
        --lp-ink: #1a1a1a;
        --lp-text: #2a2a2a;
        --lp-muted: #6b6b6b;
        --lp-bg: #ffffff;
        --lp-alt: #f5f2ec;
        --lp-dark: #161616;
        --lp-line: rgba(0,0,0,.08);
        color: var(--lp-text);
        background: var(--lp-bg);
        scroll-behavior: smooth;
        overflow-x: hidden;
      }
      .lp-container { width: 100%; max-width: 1180px; margin: 0 auto; padding: 0 24px; }
      .lp-center { text-align: center; margin-top: 40px; }
      .lp-section { padding: clamp(56px, 8vw, 100px) 0; scroll-margin-top: 80px; }
      .lp-section-alt { background: var(--lp-alt); }
      .lp-section-dark { background: var(--lp-dark); }

      /* Buttons */
      .lp-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border: none; cursor: pointer; border-radius: 8px; font-weight: 600; font-size: 15px; padding: 13px 24px; transition: transform .15s ease, background .2s ease, box-shadow .2s ease; text-decoration: none; }
      .lp-btn:hover { transform: translateY(-1px); }
      .lp-btn-lg { font-size: 16px; padding: 16px 30px; }
      .lp-btn-gold { background: var(--lp-gold); color: #fff; box-shadow: 0 8px 22px rgba(192,172,122,.4); }
      .lp-btn-gold:hover { background: var(--lp-gold-dark); }
      .lp-btn-ghost { background: transparent; border: 1.5px solid rgba(255,255,255,.6); color: #fff; }
      .lp-btn-ghost:hover { background: rgba(255,255,255,.12); }

      /* Nav */
      .lp-nav { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,.96); backdrop-filter: blur(8px); border-bottom: 1px solid var(--lp-line); }
      .lp-nav-inner { display: flex; align-items: center; justify-content: space-between; height: 70px; gap: 20px; }
      .lp-nav-logo img { height: 42px; width: auto; display: block; }
      .lp-nav-links { display: flex; gap: 26px; }
      .lp-nav-links a { color: var(--lp-text); text-decoration: none; font-size: 15px; font-weight: 500; transition: color .15s ease; }
      .lp-nav-links a:hover { color: var(--lp-gold); }

      /* Headings */
      .lp-eyebrow { text-transform: uppercase; letter-spacing: .16em; font-size: 12px; font-weight: 700; color: var(--lp-gold); margin: 0 0 14px; text-align: center; }
      .lp-eyebrow-light { color: var(--lp-gold); }
      .lp-h1 { font-size: clamp(2.3rem, 6vw, 4rem); font-weight: 800; line-height: 1.08; color: #fff; margin: 0 0 18px; }
      .lp-h2 { font-size: clamp(1.8rem, 3.6vw, 2.7rem); font-weight: 800; line-height: 1.15; color: var(--lp-ink); margin: 0 0 16px; text-align: center; }
      .lp-h2-left { text-align: left; }
      .lp-h2-light { color: #fff; }
      .lp-h3 { font-size: 1.3rem; font-weight: 700; color: var(--lp-gold-dark); margin: 18px 0 10px; }
      .lp-lead { font-size: 1.1rem; line-height: 1.6; color: var(--lp-muted); max-width: 760px; margin: 0 auto 36px; text-align: center; }
      .lp-p { font-size: 1.02rem; line-height: 1.75; color: var(--lp-muted); margin: 0 0 18px; }

      /* Hero */
      .lp-hero { background-size: cover; background-position: center; padding: clamp(90px, 14vw, 170px) 0; text-align: center; }
      .lp-hero-inner { max-width: 860px; }
      .lp-hero-sub { font-size: clamp(1.1rem, 2vw, 1.5rem); font-weight: 600; color: var(--lp-gold); margin: 0 0 12px; }
      .lp-hero-line { font-size: clamp(1rem, 1.6vw, 1.2rem); color: rgba(255,255,255,.9); margin: 0 0 30px; }
      .lp-hero-cta { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
      .lp-badges { display: flex; gap: 28px; align-items: center; justify-content: center; flex-wrap: wrap; margin-top: 44px; }
      .lp-badges img { height: 54px; width: auto; object-fit: contain; filter: brightness(0) invert(1); opacity: .9; }

      /* Filters */
      .lp-filters { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 36px; }
      .lp-filter { padding: 9px 22px; border-radius: 9999px; border: 1.5px solid var(--lp-line); background: #fff; color: var(--lp-text); font-size: 14px; font-weight: 600; cursor: pointer; transition: all .15s ease; }
      .lp-filter:hover { border-color: var(--lp-gold); }
      .lp-filter-active { background: var(--lp-gold); border-color: var(--lp-gold); color: #fff; }

      /* Projects */
      .lp-proj-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; }
      .lp-proj { background: #fff; border: 1px solid var(--lp-line); border-radius: 14px; overflow: hidden; box-shadow: 0 6px 24px rgba(0,0,0,.06); }
      .lp-ba { position: relative; width: 100%; aspect-ratio: 3/2; overflow: hidden; user-select: none; background: #ddd; }
      .lp-ba-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
      .lp-ba-before { position: absolute; inset: 0; height: 100%; overflow: hidden; border-right: 3px solid var(--lp-gold); }
      .lp-ba-before .lp-ba-img { width: 100vw; max-width: none; }
      .lp-ba-tag { position: absolute; top: 12px; padding: 4px 11px; border-radius: 5px; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; z-index: 3; }
      .lp-ba-tag-before { left: 12px; background: rgba(0,0,0,.55); color: #fff; }
      .lp-ba-tag-after { right: 12px; background: var(--lp-gold); color: #fff; }
      .lp-ba-divider { position: absolute; top: 0; bottom: 0; width: 3px; background: var(--lp-gold); transform: translateX(-50%); pointer-events: none; z-index: 2; }
      .lp-ba-handle { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; border-radius: 50%; background: var(--lp-gold); color: #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 10px rgba(0,0,0,.3); }
      .lp-ba-range { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: ew-resize; margin: 0; z-index: 4; }
      .lp-proj-meta { padding: 20px 22px 24px; }
      .lp-proj-cat { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--lp-gold-dark); background: rgba(192,172,122,.14); padding: 3px 10px; border-radius: 5px; margin-bottom: 10px; }
      .lp-proj-title { font-size: 1.15rem; font-weight: 700; color: var(--lp-ink); margin: 0 0 4px; }
      .lp-proj-loc { font-size: 13px; color: var(--lp-gold-dark); font-weight: 600; margin: 0 0 10px; }
      .lp-proj-blurb { font-size: 14px; line-height: 1.6; color: var(--lp-muted); margin: 0; }

      /* Split sections */
      .lp-split { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
      .lp-split-media img { width: 100%; border-radius: 16px; object-fit: cover; box-shadow: 0 14px 44px rgba(0,0,0,.14); }
      .lp-section-dark .lp-h2, .lp-section-dark .lp-p { color: #fff; }
      .lp-section-dark .lp-p { color: rgba(255,255,255,.78); }

      /* Story stats */
      .lp-story-stats { list-style: none; display: flex; gap: 28px; padding: 0; margin: 26px 0 0; flex-wrap: wrap; }
      .lp-story-stats li { display: flex; flex-direction: column; }
      .lp-story-stats strong { font-size: 1.5rem; font-weight: 800; color: var(--lp-gold-dark); }
      .lp-story-stats span { font-size: 13px; color: var(--lp-muted); }

      /* Video testimonials */
      .lp-vid-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 8px; }
      .lp-vid { position: relative; display: flex; flex-direction: column; justify-content: flex-end; gap: 3px; aspect-ratio: 4/5; border: 1px solid rgba(192,172,122,.3); border-radius: 14px; padding: 22px; cursor: pointer; text-align: left; background: linear-gradient(160deg, #232323, #161616); transition: transform .18s ease, border-color .18s ease; }
      .lp-vid:hover { transform: translateY(-4px); border-color: var(--lp-gold); }
      .lp-vid-play { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 56px; height: 56px; border-radius: 50%; background: var(--lp-gold); color: #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(192,172,122,.5); }
      .lp-vid-name { font-size: 1.1rem; font-weight: 700; color: #fff; }
      .lp-vid-project { font-size: 12.5px; color: var(--lp-gold); font-weight: 600; }

      /* Modal */
      .lp-modal { position: fixed; inset: 0; z-index: 100; background: rgba(8,8,8,.88); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 24px; }
      .lp-modal-inner { position: relative; width: 100%; max-width: 460px; }
      .lp-modal-close { position: absolute; top: -46px; right: 0; width: 38px; height: 38px; border-radius: 50%; border: none; cursor: pointer; background: rgba(255,255,255,.14); color: #fff; display: flex; align-items: center; justify-content: center; }
      .lp-modal-video { position: relative; width: 100%; aspect-ratio: 9/16; max-height: 76vh; border-radius: 14px; overflow: hidden; background: #000; }
      .lp-modal-video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
      .lp-modal-cap { text-align: center; margin-top: 14px; display: flex; flex-direction: column; gap: 2px; }
      .lp-modal-cap strong { color: #fff; }
      .lp-modal-cap span { color: var(--lp-gold); font-size: 13px; }

      /* Compare */
      .lp-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; max-width: 940px; margin: 0 auto; }
      .lp-compare-col { border-radius: 14px; overflow: hidden; border: 1px solid var(--lp-line); background: #fff; }
      .lp-compare-head { padding: 16px 20px; font-weight: 700; font-size: 15px; }
      .lp-compare-bad .lp-compare-head { background: #efe7e7; color: #9a5b5b; }
      .lp-compare-good .lp-compare-head { background: var(--lp-gold); color: #fff; }
      .lp-compare-row { padding: 15px 20px; font-size: 14.5px; line-height: 1.5; border-top: 1px solid var(--lp-line); color: var(--lp-text); }
      .lp-compare-bad .lp-compare-row { color: var(--lp-muted); }

      /* Steps */
      .lp-steps { list-style: none; padding: 0; margin: 8px 0 28px; display: flex; flex-direction: column; gap: 22px; }
      .lp-steps li { display: flex; gap: 16px; align-items: flex-start; }
      .lp-step-n { flex-shrink: 0; width: 40px; height: 40px; border-radius: 50%; background: var(--lp-gold); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; }
      .lp-steps strong { display: block; color: #fff; font-size: 1.1rem; margin-bottom: 4px; }
      .lp-steps p { color: rgba(255,255,255,.72); font-size: 14.5px; line-height: 1.55; margin: 0; }
      .lp-john { position: relative; }
      .lp-john-cap { position: absolute; left: 16px; bottom: 16px; background: var(--lp-gold); color: #fff; font-weight: 600; font-size: 14px; padding: 8px 14px; border-radius: 8px; }

      /* FAQ */
      .lp-faq-wrap { max-width: 820px; }
      .lp-faq { margin-top: 28px; display: flex; flex-direction: column; gap: 12px; }
      .lp-faq-item { border: 1px solid var(--lp-line); border-radius: 12px; overflow: hidden; background: #fff; transition: border-color .15s ease; }
      .lp-faq-open { border-color: var(--lp-gold); }
      .lp-faq-q { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 22px; background: none; border: none; cursor: pointer; font-size: 1.05rem; font-weight: 600; color: var(--lp-ink); text-align: left; }
      .lp-faq-q svg { color: var(--lp-gold); flex-shrink: 0; }
      .lp-faq-a { margin: 0; padding: 0 22px 22px; font-size: 15px; line-height: 1.7; color: var(--lp-muted); }

      /* Final CTA */
      .lp-section-cta { background: linear-gradient(180deg, var(--lp-alt) 0%, #fff 100%); }
      .lp-cta-grid { display: grid; grid-template-columns: 1.05fr .95fr; gap: 52px; align-items: start; }
      .lp-stars { display: flex; gap: 4px; margin-bottom: 16px; }
      .lp-cta-badges { display: flex; gap: 20px; align-items: center; flex-wrap: wrap; margin-top: 24px; }
      .lp-cta-badges img { height: 46px; width: auto; object-fit: contain; }
      .lp-form-wrap { position: sticky; top: 90px; }

      /* Footer */
      .lp-footer { background: var(--lp-ink); color: rgba(255,255,255,.7); padding: 44px 0; }
      .lp-footer-logos { display: flex; gap: 32px; align-items: center; justify-content: center; flex-wrap: wrap; margin-bottom: 26px; }
      .lp-footer-logos img { height: 30px; width: auto; object-fit: contain; filter: brightness(0) invert(1); opacity: .75; }
      .lp-footer-nav { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; margin-bottom: 18px; }
      .lp-footer-nav a { color: rgba(255,255,255,.8); text-decoration: none; font-size: 14px; }
      .lp-footer-nav a:hover { color: var(--lp-gold); }
      .lp-footer-fine { text-align: center; font-size: 13px; color: rgba(255,255,255,.5); margin: 0; }
      .lp-footer-fine a { color: rgba(255,255,255,.6); }

      /* Responsive */
      @media (max-width: 980px) {
        .lp-proj-grid { grid-template-columns: repeat(2, 1fr); }
        .lp-vid-grid { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 820px) {
        .lp-nav-links { display: none; }
        .lp-split, .lp-cta-grid { grid-template-columns: 1fr; gap: 36px; }
        .lp-split-rev .lp-split-media { order: -1; }
        .lp-compare { grid-template-columns: 1fr; }
        .lp-form-wrap { position: static; }
      }
      @media (max-width: 560px) {
        .lp-proj-grid, .lp-vid-grid { grid-template-columns: 1fr; }
        .lp-nav-cta span { display: none; }
        .lp-badges { gap: 18px; }
        .lp-badges img { height: 40px; }
      }
    `}</style>
  )
}
