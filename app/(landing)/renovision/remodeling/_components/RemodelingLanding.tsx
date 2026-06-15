'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AlertTriangle, Hourglass, Wind, Lock, Timer, HardHat, ShieldCheck,
  Check, X, ArrowRight, Phone, FileDown, BadgeCheck, Play, Quote,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import LeadForm from '../../_components/LeadForm'

/* ------------------------------------------------------------------ *
 *  Renovision — general (all-services) long-form sales landing page.
 *  Same "premium studio meets engineering corporation" aesthetic as the
 *  design-build page (navy / luxury-gold), but the copy spans every
 *  service: kitchens, bathrooms, full-home, basement/garage, outdoor.
 *  Lead capture reuses the existing LeadForm (variant "general"), whose
 *  first step is "What can we help you with?" — it posts to
 *  /api/webhooks/lovable and routes to /renovision/thank-you.
 *  Self-contained scoped styles (rm-*).
 * ------------------------------------------------------------------ */

export default function RemodelingLanding() {
  const formRef = useRef<HTMLDivElement>(null)
  const [activeVideo, setActiveVideo] = useState<Testimonial | null>(null)
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null)

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <div className="rm-root">
      <RmStyles />

      <TopBar onCta={scrollToForm} />
      <Hero onCta={scrollToForm} />
      <Agitation />
      <Mechanism onCta={scrollToForm} />
      <Transformation onCta={scrollToForm} />
      <ProjectGallery onOpen={setGalleryIndex} onCta={scrollToForm} />
      <Testimonials onPlay={setActiveVideo} onCta={scrollToForm} />
      <SocialProof />
      <Difference onCta={scrollToForm} />
      <Close formRef={formRef} />
      <Footer />

      {activeVideo && (
        <VideoModal testimonial={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
      {galleryIndex !== null && (
        <ImageLightbox index={galleryIndex} onChange={setGalleryIndex} onClose={() => setGalleryIndex(null)} />
      )}
    </div>
  )
}

/* ----------------------------- Top bar ----------------------------- */

function TopBar({ onCta }: { onCta: () => void }) {
  return (
    <header className="rm-topbar">
      <div className="rm-container rm-topbar-inner">
        <Image
          src="/renovision-logo.png"
          alt="Renovision Design and Build"
          width={170}
          height={56}
          className="rm-logo"
          priority
        />
        <button className="rm-btn rm-btn-ghost rm-topbar-cta" onClick={onCta}>
          <Phone size={15} /> Get My Free Estimate
        </button>
      </div>
    </header>
  )
}

/* --------------------------- Block 1: Hero -------------------------- */

function Hero({ onCta }: { onCta: () => void }) {
  return (
    <section className="rm-hero">
      <div className="rm-hero-overlay" />
      <div className="rm-container rm-hero-inner">
        <p className="rm-eyebrow rm-eyebrow-light">
          Serving Greater Seattle · One Team for Every Room of Your Home
        </p>
        <h1 className="rm-h1">
          Whatever You&apos;re Remodeling — <span className="rm-gold">Done Right, Done On Time.</span>
        </h1>
        <p className="rm-hero-sub">
          Kitchen, bathroom, basement, addition or outdoor space — it&apos;s the same disciplined
          system every time. Every decision is <strong>locked in 3D</strong> with a signed materials
          list before demo. <strong>One dedicated crew</strong> to the finish line, and a daily photo
          report so you&apos;re never left guessing.
        </p>
        <div className="rm-hero-cta">
          <button className="rm-btn rm-btn-gold rm-btn-lg" onClick={onCta}>
            Get My Free Project Estimate <ArrowRight size={18} />
          </button>
          <p className="rm-microcopy">
            Zero pressure. Zero surprises. Just a transparent estimate for your project.
          </p>
        </div>
        <ul className="rm-hero-badges">
          <li><BadgeCheck size={16} /> Licensed &amp; Insured</li>
          <li><BadgeCheck size={16} /> Pre-Build Lock™</li>
          <li><BadgeCheck size={16} /> One Crew, Start to Finish</li>
        </ul>
        <p className="rm-asterisk">
          *Timelines refer to site-work only. Excludes permit / inspection and supplier delays
          outside the signed agreement.
        </p>
      </div>
    </section>
  )
}

/* ------------------- Block 2: Agitation / Silent Danger ------------- */

const TRAPS = [
  {
    icon: AlertTriangle,
    tone: 'danger',
    tag: 'Trap #1',
    title: 'The "Allowance" Illusion',
    sub: 'Budget Blowouts',
    body:
      'You sign a contract with vague material allowances. Mid-project, the supplier emails: "Out of Stock." Suddenly you\'re forced into rushed, expensive upgrade decisions. Your budget explodes before the drywall is even up.',
  },
  {
    icon: Hourglass,
    tone: 'warn',
    tag: 'Trap #2',
    title: 'The Disappearing Crew',
    sub: 'Schedule Creep',
    body:
      'The "Under Construction" calendar lives on your fridge forever. Your contractor splits his team across five jobs. Your home sits empty for days. You text "Hey, any updates?" — and hear absolute silence.',
  },
  {
    icon: Wind,
    tone: 'dust',
    tag: 'Trap #3',
    title: 'The Living Warzone',
    sub: 'Chaos & Dust',
    body:
      'No isolated dust barriers. Unpredictable noise interrupting your Zoom calls. Workers at random hours. You feel like a hostage in your own home, constantly apologizing to your family for the mess.',
  },
]

function Agitation() {
  return (
    <section className="rm-section rm-section-light">
      <div className="rm-container">
        <p className="rm-eyebrow rm-eyebrow-danger">The Ugly Truth About Remodeling in Greater Seattle</p>
        <h2 className="rm-h2 rm-h2-dark">
          Why Most “Affordable” Remodels End Up Costing You Thousands in Hidden Fees,
          Lost Time &amp; Pure Frustration.
        </h2>
        <p className="rm-intro rm-intro-dark">
          You’ve heard the horror stories from your neighbors. A simple bathroom update that turns
          the house into a dusty warzone for three months. A kitchen quote that mysteriously balloons
          by 30% halfway through. A basement that sits half-finished for a year. Most contractors
          don’t plan to fail — they just lack a rigid system. Without one, every project — no matter
          the room — falls into one of these three traps:
        </p>

        <div className="rm-grid-3">
          {TRAPS.map(t => {
            const Icon = t.icon
            return (
              <div key={t.tag} className={`rm-trap rm-trap-${t.tone}`}>
                <div className="rm-trap-icon"><Icon size={26} /></div>
                <span className="rm-trap-tag">{t.tag}</span>
                <h3 className="rm-trap-title">{t.title}</h3>
                <p className="rm-trap-sub">{t.sub}</p>
                <p className="rm-trap-body">{t.body}</p>
              </div>
            )
          })}
        </div>

        <p className="rm-transition">
          There’s a massive difference between a verbal promise and a managed system. You don’t just
          need a builder — you need a <strong>Design-Build Mechanism</strong> that locks in every
          detail, material and deadline before a single hammer is swung. Here’s how we eliminate all
          three traps on every project we take.
        </p>
      </div>
    </section>
  )
}

/* ------------------- Block 3: The Unique Mechanism ----------------- */

const MECHANISM = [
  {
    icon: Lock,
    n: '01',
    title: 'Pre-Build Lock™',
    tag: 'Zero Mid-Project Surprises',
    body:
      'No guesswork. No "allowance" traps. We lock every decision in a 3D walk-through, backed by a signed Bill of Materials (BOM) before demolition begins. You know exactly what you’re getting — down to the last tile, fixture and finish.',
  },
  {
    icon: Timer,
    n: '02',
    title: 'SLA-Time™ with a Clear Deadline',
    tag: 'On-Time, Guaranteed',
    body:
      'We measure what others only promise. Every project gets a firm, written site-work timeline before we start — and we’re held to it. No open-ended "we’ll try to finish by…" You get a date, and a plan to hit it.',
  },
  {
    icon: HardHat,
    n: '03',
    title: 'One-Crew Focus™ + Daily Visual Reports',
    tag: 'No Disappearing Acts',
    body:
      'The same dedicated crew, every single day, until handover. And to keep you in the loop, you receive a short photo report every evening — what was done today, what’s scheduled tomorrow.',
  },
  {
    icon: ShieldCheck,
    n: '04',
    title: 'CleanBuild Protocol™',
    tag: 'Respecting Your Home',
    body:
      'Your house shouldn’t feel like a construction site 24/7. Strict dust-control barriers, designated "quiet hours" (so you can take that Zoom call), and a mandatory daily clean-pass before our crew leaves.',
  },
]

function Mechanism({ onCta }: { onCta: () => void }) {
  return (
    <section className="rm-section rm-section-dark">
      <div className="rm-container">
        <p className="rm-eyebrow rm-eyebrow-gold">Introducing the Renovision Design-Build Mechanism</p>
        <h2 className="rm-h2 rm-h2-light">
          We Don’t Rely on “Good Intentions.” We Rely on a Rigid, Unbreakable Protocol.
        </h2>
        <p className="rm-intro rm-intro-light">
          A promise means nothing without a system to back it up. We’ve engineered the chaos out of
          traditional remodeling — and we apply the exact same protocol whether it’s a single bathroom
          or a whole-home renovation. Before we ever swing a hammer, we deploy a multi-layered defense
          system built to protect your budget, your timeline and your sanity:
        </p>

        <div className="rm-grid-2">
          {MECHANISM.map(m => {
            const Icon = m.icon
            return (
              <div key={m.n} className="rm-mech">
                <div className="rm-mech-head">
                  <span className="rm-mech-icon"><Icon size={24} /></span>
                  <span className="rm-mech-n">{m.n}</span>
                </div>
                <h3 className="rm-mech-title">{m.title}</h3>
                <p className="rm-mech-tag">{m.tag}</p>
                <p className="rm-mech-body">{m.body}</p>
              </div>
            )
          })}
        </div>

        <div className="rm-center">
          <button className="rm-btn rm-btn-gold rm-btn-lg" onClick={onCta}>
            See a Sample 3D Demo &amp; Signed BOM <ArrowRight size={18} />
          </button>
        </div>
        <p className="rm-asterisk rm-asterisk-center">
          *SLA-Time applies to site-work only. Delays due to permits, inspections, or supply-chain
          issues outside the signed BOM are excluded per proposal.
        </p>
      </div>
    </section>
  )
}

/* ------------- Block 4: Transformation & Before/After -------------- */

const TRANSFORM = [
  {
    emoji: '🍳',
    title: 'The Culinary Centerpiece',
    label: 'Kitchens',
    body: 'Where the family actually wants to gather. Flawless finishes, smart storage, zero compromises.',
    eta: 'Studio precision, contractor speed',
  },
  {
    emoji: '🛁',
    title: 'The Morning Sanctuary',
    label: 'Bathrooms',
    body: 'From a chaotic morning rush to a daily retreat. Start your day with absolute serenity.',
    eta: 'Spa-grade finishes, built to last',
  },
  {
    emoji: '🏠',
    title: 'More Room to Live',
    label: 'Basements · Additions · Outdoor',
    body: 'Finished basements, room additions and outdoor living that add real square footage and value.',
    eta: 'Engineered for how you live',
  },
]

function Transformation({ onCta }: { onCta: () => void }) {
  return (
    <section className="rm-section rm-section-light">
      <div className="rm-container">
        <p className="rm-eyebrow rm-eyebrow-gold-dark">The End Result: Zero Stress. Pure Elegance.</p>
        <h2 className="rm-h2 rm-h2-dark">
          Step Into the Space You’ve Always Deserved (Without the Remodeling Trauma).
        </h2>
        <p className="rm-intro rm-intro-dark">
          A remodel isn’t just about quartz countertops or a walk-in shower. It’s about reclaiming
          your mornings. Hosting family dinners in a kitchen that breathes. Finally finishing that
          basement. The profound peace of walking into a space engineered precisely for your lifestyle.
          You don’t just get a stunning aesthetic — you get the quiet pride of knowing you remodeled
          the smart way. <em>Studio precision, matched with contractor speed.</em>
        </p>

        <BeforeAfter />

        <div className="rm-grid-3 rm-grid-3-tight">
          {TRANSFORM.map(t => (
            <div key={t.label} className="rm-transform">
              <div className="rm-transform-emoji">{t.emoji}</div>
              <h3 className="rm-transform-title">{t.title}</h3>
              <p className="rm-transform-label">{t.label}</p>
              <p className="rm-transform-body">{t.body}</p>
              <p className="rm-transform-eta">{t.eta}</p>
            </div>
          ))}
        </div>

        <blockquote className="rm-quote">
          “I expected the usual remodeling nightmare. Instead, they handed us back a breathtaking
          kitchen exactly on the day the schedule said. We finally have the home we always talked
          about.”
          <cite>— Sarah &amp; Mark T., Greater Seattle</cite>
        </blockquote>

        <div className="rm-center">
          <button className="rm-btn rm-btn-dark rm-btn-lg" onClick={onCta}>
            Browse Our Before / After Gallery <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}

function BeforeAfter() {
  const [pos, setPos] = useState(50)
  return (
    <div className="rm-ba">
      {/* TODO: replace the two gradient panels with real project photos
          (e.g. /renovision-before.jpg and /renovision-after.jpg) */}
      <div className="rm-ba-after">
        <span className="rm-ba-tag rm-ba-tag-after">AFTER</span>
      </div>
      <div className="rm-ba-before" style={{ width: `${pos}%` }}>
        <span className="rm-ba-tag rm-ba-tag-before">BEFORE</span>
      </div>
      <div className="rm-ba-divider" style={{ left: `${pos}%` }}>
        <span className="rm-ba-handle">
          <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} />
          <ArrowRight size={14} />
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={e => setPos(Number(e.target.value))}
        className="rm-ba-range"
        aria-label="Drag to compare before and after"
      />
    </div>
  )
}

/* --------------- Block 4.4: Project Photo Gallery ----------------- */

interface Project {
  src: string
  category: string
  caption: string
  /* portrait images can be flagged to span 2 rows in the masonry grid */
  tall?: boolean
}

/* Real Renovision project photos, downloaded from the client's Drive
   folder and self-hosted under /public/projects for speed & reliability. */
const PROJECTS: Project[] = [
  { src: '/projects/project-01.jpg', category: 'Kitchen',  caption: 'Chef’s Kitchen with Pro Range & Stone Hearth' },
  { src: '/projects/project-09.jpg', category: 'Kitchen',  caption: 'Bright White Shaker Kitchen' },
  { src: '/projects/project-06.jpg', category: 'Bathroom', caption: 'Modern Master Bath with Freestanding Tub' },
  { src: '/projects/project-03.jpg', category: 'Outdoor',  caption: 'Covered Patio & Cedar Deck' },
  { src: '/projects/project-12.jpg', category: 'Bathroom', caption: 'Spa Bath — Tub, Walk-In Shower & Double Vanity' },
  { src: '/projects/project-04.jpg', category: 'Kitchen',  caption: 'Open-Concept Kitchen & Living' },
  { src: '/projects/project-07.jpg', category: 'Bathroom', caption: 'Dark Spa Bath with Mood Lighting' },
  { src: '/projects/project-15.jpg', category: 'Kitchen',  caption: 'U-Shaped Kitchen with Bay Window' },
  { src: '/projects/project-11.jpg', category: 'Bathroom', caption: 'Marble Walk-In Shower' },
  { src: '/projects/project-14.jpg', category: 'Whole Home', caption: 'Kitchen & Dining Great Room' },
  { src: '/projects/project-02.jpg', category: '3D Design', caption: 'Spa-Style Master Bath — 3D Design' },
  { src: '/projects/project-10.jpg', category: 'Living',   caption: 'Waterfront Living Room Remodel' },
  { src: '/projects/project-13.jpg', category: 'Bathroom', caption: 'Custom Wood Double Vanity' },
  { src: '/projects/project-05.png', category: '3D Design', caption: 'Open Kitchen — 3D Design Preview' },
  { src: '/projects/project-08.jpg', category: 'Clients',  caption: 'Another Happy Renovision Homeowner' },
]

function ProjectGallery({ onOpen, onCta }: { onOpen: (i: number) => void; onCta: () => void }) {
  return (
    <section className="rm-section rm-section-light">
      <div className="rm-container">
        <p className="rm-eyebrow rm-eyebrow-gold-dark">Recent Work · Greater Seattle</p>
        <h2 className="rm-h2 rm-h2-dark">A Few of the Spaces We’ve Transformed.</h2>
        <p className="rm-intro rm-intro-dark">
          Kitchens, bathrooms, outdoor living and full-home remodels — all delivered with the same
          disciplined process. Tap any photo to view it full-size.
        </p>

        <div className="rm-gal-grid">
          {PROJECTS.map((p, i) => (
            <button
              key={p.src}
              className="rm-gal-item"
              onClick={() => onOpen(i)}
              aria-label={`View project: ${p.caption}`}
            >
              <Image
                src={p.src}
                alt={p.caption}
                width={800}
                height={600}
                className="rm-gal-img"
                sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
              />
              <span className="rm-gal-overlay">
                <span className="rm-gal-cat">{p.category}</span>
                <span className="rm-gal-cap">{p.caption}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="rm-center">
          <button className="rm-btn rm-btn-gold rm-btn-lg" onClick={onCta}>
            Start My Project <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}

function ImageLightbox({ index, onChange, onClose }: { index: number; onChange: (i: number) => void; onClose: () => void }) {
  const total = PROJECTS.length
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
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next])

  const p = PROJECTS[index]

  return (
    <div className="rm-lb" onClick={onClose} role="dialog" aria-modal="true" aria-label={p.caption}>
      <button className="rm-lb-close" onClick={onClose} aria-label="Close"><X size={24} /></button>
      <button className="rm-lb-nav rm-lb-prev" onClick={e => { e.stopPropagation(); prev() }} aria-label="Previous">
        <ChevronLeft size={30} />
      </button>
      <div className="rm-lb-stage" onClick={e => e.stopPropagation()}>
        <Image
          src={p.src}
          alt={p.caption}
          width={1600}
          height={1200}
          className="rm-lb-img"
          sizes="90vw"
          priority
        />
        <div className="rm-lb-caption">
          <span className="rm-gal-cat">{p.category}</span>
          <span>{p.caption}</span>
          <span className="rm-lb-count">{index + 1} / {total}</span>
        </div>
      </div>
      <button className="rm-lb-nav rm-lb-next" onClick={e => { e.stopPropagation(); next() }} aria-label="Next">
        <ChevronRight size={30} />
      </button>
    </div>
  )
}

/* ------------- Block 4.5: Video Testimonials Gallery -------------- */

interface Testimonial {
  name: string
  location: string
  project: string
  driveId: string
  /* gradient index 0-5 for the card background */
  tone: number
}

/* Real client testimonial videos (Drive folder shared by the client).
   For these to play for site visitors, the Drive files must be shared
   "Anyone with the link → Viewer". Source folder:
   https://drive.google.com/drive/folders/1r15ab12dqDjvYU9CS6saF-ToqsFsYkEr */
const TESTIMONIALS: Testimonial[] = [
  { name: 'Jack',            location: 'Greater Seattle', project: 'Kitchen Remodel',   driveId: '176JLmYNk1krSTKaCkxIS9c3KSl0F040f', tone: 0 },
  { name: 'Terri & Loreli',  location: 'Greater Seattle', project: 'Full-Home Remodel', driveId: '1aU95aapYzyzjhlsvZjjfb06TaVeFnMh5', tone: 1 },
  { name: 'Maria',           location: 'Greater Seattle', project: 'Bathroom Remodel',  driveId: '1fm3UESlPIBYjdutByizCGP0b6MNuhYg5', tone: 2 },
  { name: 'Maya Lewis',      location: 'Greater Seattle', project: 'Kitchen Remodel',   driveId: '1M8U6cIAkCh0yRXNR9isCKKfJ4I99bcDB', tone: 3 },
  { name: 'Pete',            location: 'Greater Seattle', project: 'Outdoor Living',    driveId: '1o8_to9b3siT34t8-vV7WiYY_SalHnxQO', tone: 4 },
  { name: 'Jennifer',        location: 'Greater Seattle', project: 'Bathroom Remodel',  driveId: '1JOzVluFR_T-ui90U9suqBWbdDpwKxlw8', tone: 5 },
]

function initials(name: string) {
  return name
    .replace(/&/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
}

function Testimonials({ onPlay, onCta }: { onPlay: (t: Testimonial) => void; onCta: () => void }) {
  return (
    <section className="rm-section rm-section-vids">
      <div className="rm-container">
        <p className="rm-eyebrow rm-eyebrow-gold">Real Clients · Real Words · Unscripted</p>
        <h2 className="rm-h2 rm-h2-light">Hear It Straight From Our Homeowners.</h2>
        <p className="rm-intro rm-intro-light">
          We could keep telling you how we work — but it lands differently coming from the families
          who lived through the remodel. Tap any story below to watch their unedited take on the
          process, the crew and the finished result.
        </p>

        <div className="rm-vid-grid">
          {TESTIMONIALS.map(t => (
            <button
              key={t.driveId}
              className={`rm-vid-card rm-vid-tone-${t.tone}`}
              onClick={() => onPlay(t)}
              aria-label={`Play ${t.name}'s video testimonial`}
            >
              <Quote className="rm-vid-quote" size={28} />
              <span className="rm-vid-avatar">{initials(t.name)}</span>
              <span className="rm-vid-play"><Play size={22} fill="currentColor" /></span>
              <span className="rm-vid-meta">
                <span className="rm-vid-name">{t.name}</span>
                <span className="rm-vid-project">{t.project} · {t.location}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="rm-center">
          <button className="rm-btn rm-btn-gold rm-btn-lg" onClick={onCta}>
            Get the Same Result for Your Home <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}

function VideoModal({ testimonial, onClose }: { testimonial: Testimonial; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="rm-modal" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${testimonial.name} video testimonial`}>
      <div className="rm-modal-inner" onClick={e => e.stopPropagation()}>
        <button className="rm-modal-close" onClick={onClose} aria-label="Close video">
          <X size={22} />
        </button>
        <div className="rm-modal-video">
          <iframe
            src={`https://drive.google.com/file/d/${testimonial.driveId}/preview`}
            allow="autoplay; fullscreen"
            allowFullScreen
            title={`${testimonial.name} — ${testimonial.project}`}
          />
        </div>
        <div className="rm-modal-caption">
          <strong>{testimonial.name}</strong>
          <span>{testimonial.project} · {testimonial.location}</span>
        </div>
      </div>
    </div>
  )
}

/* ----------- Block 5: Social Proof / Proof-Stack ------------------- */

const STATS = [
  { emoji: '📊', value: '90%', label: 'On-Time Completion Rate', note: 'Across every project type — kitchens, baths, basements and additions. We track it on every job.' },
  { emoji: '📉', value: '< 8%', label: 'Change-Order (CO) Rate', note: 'While the industry is plagued by budget blowouts, our Pre-Build Lock™ keeps mid-project changes minimal.' },
  { emoji: '🧹', value: '4.8/5', label: 'Avg. Site-Cleanliness Score', note: 'Rated by clients at handover. Our CleanBuild Protocol™ keeps your home a home, not a hazard zone.' },
  { emoji: '🤝', value: '100%', label: 'Dedicated Crew Consistency', note: 'With One-Crew Focus™, the team that starts your project is the team that finishes it.' },
]

function SocialProof() {
  return (
    <section className="rm-section rm-section-navy">
      <div className="rm-container">
        <p className="rm-eyebrow rm-eyebrow-gold">Proudly Serving Greater Seattle, Tacoma &amp; Marysville</p>
        <h2 className="rm-h2 rm-h2-light">Don’t Take Our Word for It. Look at the Numbers.</h2>
        <p className="rm-intro rm-intro-light">
          In remodeling, everyone promises “high quality” and “great service.” Those words are
          meaningless unless you can measure them. That’s why we operate with radical transparency —
          tracking performance on every project so our SLA-Time™ and Pre-Build Lock™ are never empty
          slogans. Here’s our Proof-Stack from the last quarter:
        </p>

        <div className="rm-grid-4">
          {STATS.map(s => (
            <div key={s.label} className="rm-stat">
              <div className="rm-stat-emoji">{s.emoji}</div>
              <div className="rm-stat-value">{s.value}</div>
              <div className="rm-stat-label">{s.label}</div>
              <p className="rm-stat-note">{s.note}</p>
            </div>
          ))}
        </div>

        <blockquote className="rm-quote rm-quote-light">
          “With two kids and a dog, we couldn’t afford a remodeling nightmare. The team set up dust
          barriers on day one and actually respected the ‘quiet hours’ we requested for our home
          office. The daily photo reports kept us completely sane.”
          <cite>— Emily R., Tacoma</cite>
        </blockquote>
      </div>
    </section>
  )
}

/* ----- Block 6: How Renovision Does Remodeling Differently -------- */

const DIFFERENCE = [
  {
    typical: 'A rough estimate based on a general idea',
    renovision: 'A clear project proposal based on your actual goals, space, and scope',
  },
  {
    typical: 'You have to imagine how the finished space will look',
    renovision: 'We help you plan the design before work begins, including 3D design for eligible kitchen and bathroom projects',
  },
  {
    typical: 'The price feels unclear until the project is already moving',
    renovision: 'We review the scope, materials, and expectations upfront so you understand what you are getting',
  },
  {
    typical: 'Large payments before real progress is made',
    renovision: 'A more structured process built around project progress and clear communication',
  },
  {
    typical: 'You deal with confusion between sales, crews, and project details',
    renovision: 'You get personal guidance from a dedicated project manager',
  },
  {
    typical: 'The contractor disappears after signing',
    renovision: 'Renovision is licensed, insured, and stands behind the work with a written warranty',
  },
  {
    typical: 'You feel pressured to make a quick decision',
    renovision: 'We start with a free estimate and consultation, with no obligation',
  },
]

function Difference({ onCta }: { onCta: () => void }) {
  return (
    <section className="rm-section rm-section-light">
      <div className="rm-container">
        <p className="rm-eyebrow rm-eyebrow-gold-dark">The Renovision Difference</p>
        <h2 className="rm-h2 rm-h2-dark">How Renovision Does Remodeling Differently</h2>
        <p className="rm-intro rm-intro-dark">
          Most remodeling problems start before construction begins: vague estimates, unclear designs,
          large upfront payments, and surprise changes once the work has already started. At Renovision
          Design &amp; Build, we believe homeowners deserve a clearer, more organized remodeling process
          from day one.
        </p>

        <div className="rm-table rm-table-2">
          <div className="rm-table-2-head">
            <div className="rm-table-cell rm-table-typical-head">The Typical Remodeling Experience</div>
            <div className="rm-table-cell rm-table-judah-head">The Renovision Way</div>
          </div>
          {DIFFERENCE.map(row => (
            <div key={row.typical} className="rm-table-2-row">
              <div className="rm-table-cell rm-table-industry">
                <X size={16} className="rm-x" /> <span>{row.typical}</span>
              </div>
              <div className="rm-table-cell rm-table-judah">
                <Check size={16} className="rm-check" /> <span>{row.renovision}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="rm-diff-close">
          <h3 className="rm-diff-h3">A Better Remodel Starts With a Better Process</h3>
          <p className="rm-diff-p">
            Whether you are planning a kitchen remodel, bathroom remodel, deck, flooring project, or a
            larger home upgrade, our goal is simple: help you understand the project clearly before you
            commit.
          </p>
          <h3 className="rm-diff-h3">Ready to plan your remodel?</h3>
          <p className="rm-diff-p">
            Request your free estimate today and see how Renovision can help bring your project to life.
          </p>
          <div className="rm-center" style={{ marginTop: 28 }}>
            <button className="rm-btn rm-btn-gold rm-btn-lg" onClick={onCta}>
              Get My Free Estimate <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------- Block 7: The Close --------------------------- */

function Close({ formRef }: { formRef: React.RefObject<HTMLDivElement> }) {
  return (
    <section className="rm-section rm-section-close">
      <div className="rm-container rm-close-grid" ref={formRef}>
        <div className="rm-close-copy">
          <p className="rm-eyebrow rm-eyebrow-gold-dark">Your Next Step: Zero Pressure. Zero Commitment.</p>
          <h2 className="rm-h2 rm-h2-dark">
            Tell Us What You&apos;re Remodeling — Get a Transparent Estimate.
          </h2>
          <p className="rm-intro rm-intro-dark">
            The biggest fear in remodeling is the unknown cost. You deserve absolute clarity before
            you ever let a contractor into your home. Start with the form — just tell us which project
            you have in mind — and we’ll walk you through our transparent 3-Tier Budget Model (Basic,
            Plus, Premium). You’ll know exactly what to expect, with no strings attached.
          </p>

          <div className="rm-guarantee">
            <ShieldCheck size={28} className="rm-guarantee-icon" />
            <div>
              <strong>The Renovision 30-Day Price-Lock™</strong>
              <p>
                If we move forward with a home visit and a formal quote, your price is locked and
                guaranteed for 30 full days. No sudden markups. No expiration-date pressure. Just an
                honest, transparent number you can trust.
              </p>
            </div>
          </div>

          <p className="rm-softfall">
            <FileDown size={16} /> Not ready to talk yet? Protect yourself from bad contractors —
            ask for our free 1-page checklist: <em>“10 Critical Questions to Ask Any Seattle
            Remodeling Contractor Before You Hire Them.”</em>
          </p>
        </div>

        <div className="rm-form-wrap">
          <LeadForm variant="general" />
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- Footer ----------------------------- */

function Footer() {
  return (
    <footer className="rm-footer">
      <div className="rm-container">
        <p>© 2026 Renovision Design and Build. All rights reserved. Licensed &amp; Insured.</p>
        <p className="rm-footer-sub">
          Serving Greater Seattle, Tacoma &amp; Marysville. SLA applies to site-work only; permits,
          inspections and external supply-chain delays excluded per signed agreement.
        </p>
      </div>
    </footer>
  )
}

/* --------------------------- Scoped styles ------------------------ */

function RmStyles() {
  return (
    <style>{`
      .rm-root {
        --rm-ink: #0b0f17;
        --rm-navy: #0d1b2a;
        --rm-navy-2: #11263d;
        --rm-gold: #c9a24b;
        --rm-gold-bright: #e0b84c;
        --rm-light: #f6f5f2;
        --rm-text: #1c2330;
        --rm-muted: #5b6573;
        --rm-line: rgba(0,0,0,0.08);
        font-family: 'Poppins', system-ui, sans-serif;
        color: var(--rm-text);
        background: var(--rm-light);
        overflow-x: hidden;
      }
      .rm-container { width: 100%; max-width: 1120px; margin: 0 auto; padding: 0 24px; }
      .rm-center { text-align: center; margin-top: 36px; }

      /* Buttons */
      .rm-btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        border: none; cursor: pointer; border-radius: 9px; font-weight: 600;
        font-size: 15px; padding: 13px 22px; transition: transform .15s ease, opacity .15s ease, background .2s ease;
        letter-spacing: .01em;
      }
      .rm-btn:hover { transform: translateY(-1px); }
      .rm-btn-lg { font-size: 16px; padding: 17px 30px; }
      .rm-btn-gold { background: linear-gradient(135deg, var(--rm-gold-bright), var(--rm-gold)); color: #1a1306; box-shadow: 0 8px 24px rgba(201,162,75,.35); }
      .rm-btn-gold:hover { box-shadow: 0 10px 30px rgba(201,162,75,.5); }
      .rm-btn-dark { background: var(--rm-ink); color: #fff; }
      .rm-btn-ghost { background: transparent; border: 1px solid rgba(255,255,255,.35); color: #fff; padding: 9px 16px; font-size: 13px; }
      .rm-btn-ghost:hover { background: rgba(255,255,255,.1); }

      /* Top bar */
      .rm-topbar { position: sticky; top: 0; z-index: 50; background: rgba(11,15,23,.92); backdrop-filter: blur(8px); border-bottom: 1px solid rgba(255,255,255,.08); }
      .rm-topbar-inner { display: flex; align-items: center; justify-content: space-between; padding-top: 12px; padding-bottom: 12px; }
      .rm-logo { height: 44px; width: auto; filter: brightness(0) invert(1); }

      /* Eyebrows / headings */
      .rm-eyebrow { text-transform: uppercase; letter-spacing: .16em; font-size: 12px; font-weight: 600; margin-bottom: 18px; }
      .rm-eyebrow-light { color: var(--rm-gold-bright); }
      .rm-eyebrow-gold { color: var(--rm-gold-bright); }
      .rm-eyebrow-gold-dark { color: #a9842f; }
      .rm-eyebrow-danger { color: #c0392b; }
      .rm-h1 { font-size: clamp(2.2rem, 6vw, 4rem); font-weight: 700; line-height: 1.05; letter-spacing: -.02em; color: #fff; margin: 0 0 22px; }
      .rm-gold { color: var(--rm-gold-bright); }
      .rm-h2 { font-size: clamp(1.5rem, 3.4vw, 2.4rem); font-weight: 700; line-height: 1.18; letter-spacing: -.01em; margin: 0 0 20px; max-width: 880px; }
      .rm-h2-light { color: #fff; }
      .rm-h2-dark { color: var(--rm-text); }
      .rm-intro { font-size: clamp(1rem, 1.4vw, 1.12rem); line-height: 1.7; max-width: 820px; margin: 0 0 40px; }
      .rm-intro-light { color: rgba(255,255,255,.78); }
      .rm-intro-dark { color: var(--rm-muted); }

      /* Sections */
      .rm-section { padding: clamp(64px, 9vw, 110px) 0; }
      .rm-section-light { background: var(--rm-light); }
      .rm-section-dark { background: radial-gradient(120% 120% at 50% 0%, #14213a 0%, var(--rm-ink) 70%); }
      .rm-section-navy { background: linear-gradient(180deg, var(--rm-navy) 0%, var(--rm-navy-2) 100%); }
      .rm-section-close { background: linear-gradient(180deg, #ffffff 0%, var(--rm-light) 100%); }

      /* Hero */
      .rm-hero { position: relative; background: linear-gradient(135deg, #0d1b2a 0%, #0b0f17 55%, #14213a 100%); padding: clamp(72px, 11vw, 150px) 0 clamp(60px, 8vw, 96px); overflow: hidden; }
      .rm-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(60% 60% at 75% 15%, rgba(201,162,75,.18) 0%, transparent 60%); pointer-events: none; }
      .rm-hero-overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(11,15,23,.55), transparent 70%); }
      .rm-hero-inner { position: relative; z-index: 2; max-width: 880px; }
      .rm-hero-sub { font-size: clamp(1.05rem, 1.6vw, 1.25rem); line-height: 1.65; color: rgba(255,255,255,.82); max-width: 680px; margin: 0 0 32px; }
      .rm-hero-sub strong { color: var(--rm-gold-bright); font-weight: 600; }
      .rm-hero-cta { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
      .rm-microcopy { font-size: 13px; color: rgba(255,255,255,.6); margin: 0; }
      .rm-hero-badges { list-style: none; display: flex; flex-wrap: wrap; gap: 22px; padding: 0; margin: 36px 0 0; }
      .rm-hero-badges li { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,.85); }
      .rm-hero-badges svg { color: var(--rm-gold-bright); }
      .rm-asterisk { font-size: 11.5px; color: rgba(255,255,255,.45); margin: 28px 0 0; max-width: 620px; line-height: 1.5; }
      .rm-asterisk-center { text-align: center; margin-left: auto; margin-right: auto; color: var(--rm-muted); }

      /* Grids */
      .rm-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
      .rm-grid-3-tight { gap: 20px; margin-top: 48px; }
      .rm-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; }
      .rm-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

      /* Traps */
      .rm-trap { background: #fff; border: 1px solid var(--rm-line); border-radius: 14px; padding: 30px 26px; box-shadow: 0 4px 20px rgba(0,0,0,.04); }
      .rm-trap-icon { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; }
      .rm-trap-danger .rm-trap-icon { background: rgba(192,57,43,.1); color: #c0392b; }
      .rm-trap-warn .rm-trap-icon { background: rgba(201,162,75,.14); color: #a9842f; }
      .rm-trap-dust .rm-trap-icon { background: rgba(91,101,115,.12); color: #5b6573; }
      .rm-trap-tag { font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--rm-muted); }
      .rm-trap-title { font-size: 1.2rem; font-weight: 700; margin: 8px 0 2px; color: var(--rm-text); }
      .rm-trap-sub { font-size: 13px; font-weight: 600; color: #c0392b; margin: 0 0 14px; }
      .rm-trap-warn .rm-trap-sub { color: #a9842f; }
      .rm-trap-dust .rm-trap-sub { color: #5b6573; }
      .rm-trap-body { font-size: 14.5px; line-height: 1.65; color: var(--rm-muted); margin: 0; }
      .rm-transition { margin: 44px auto 0; max-width: 760px; text-align: center; font-size: 1.08rem; line-height: 1.65; color: var(--rm-text); }
      .rm-transition strong { color: #a9842f; }

      /* Mechanism */
      .rm-mech { background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02)); border: 1px solid rgba(201,162,75,.22); border-radius: 16px; padding: 30px 28px; }
      .rm-mech-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
      .rm-mech-icon { width: 50px; height: 50px; border-radius: 12px; background: rgba(201,162,75,.14); color: var(--rm-gold-bright); display: flex; align-items: center; justify-content: center; }
      .rm-mech-n { font-size: 2rem; font-weight: 700; color: rgba(201,162,75,.3); line-height: 1; }
      .rm-mech-title { font-size: 1.22rem; font-weight: 700; color: #fff; margin: 0 0 4px; }
      .rm-mech-tag { font-size: 13px; font-weight: 600; color: var(--rm-gold-bright); margin: 0 0 14px; }
      .rm-mech-body { font-size: 14.5px; line-height: 1.65; color: rgba(255,255,255,.72); margin: 0; }

      /* Before / After */
      .rm-ba { position: relative; width: 100%; max-width: 900px; margin: 0 auto; aspect-ratio: 16/9; border-radius: 16px; overflow: hidden; box-shadow: 0 18px 50px rgba(0,0,0,.18); user-select: none; }
      .rm-ba-after, .rm-ba-before { position: absolute; inset: 0; height: 100%; }
      .rm-ba-after { background: linear-gradient(135deg, #1a2c46, #2b4a6f); }
      .rm-ba-before { top: 0; left: 0; overflow: hidden; background: linear-gradient(135deg, #4a443c, #6b6253); border-right: 3px solid var(--rm-gold-bright); }
      .rm-ba-tag { position: absolute; top: 16px; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; letter-spacing: .12em; }
      .rm-ba-tag-before { left: 16px; background: rgba(0,0,0,.5); color: #fff; }
      .rm-ba-tag-after { right: 16px; background: var(--rm-gold-bright); color: #1a1306; }
      .rm-ba-divider { position: absolute; top: 0; bottom: 0; width: 3px; background: var(--rm-gold-bright); transform: translateX(-50%); pointer-events: none; }
      .rm-ba-handle { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 44px; height: 44px; border-radius: 50%; background: var(--rm-gold-bright); color: #1a1306; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 12px rgba(0,0,0,.3); }
      .rm-ba-range { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: ew-resize; margin: 0; }

      /* Transformation cards */
      .rm-transform { background: #fff; border: 1px solid var(--rm-line); border-radius: 14px; padding: 28px 24px; text-align: center; }
      .rm-transform-emoji { font-size: 2rem; margin-bottom: 12px; }
      .rm-transform-title { font-size: 1.15rem; font-weight: 700; margin: 0 0 2px; color: var(--rm-text); }
      .rm-transform-label { font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--rm-muted); margin: 0 0 12px; }
      .rm-transform-body { font-size: 14px; line-height: 1.6; color: var(--rm-muted); margin: 0 0 14px; }
      .rm-transform-eta { font-size: 13px; font-weight: 600; color: #a9842f; margin: 0; }

      /* Quotes */
      .rm-quote { margin: 48px auto 0; max-width: 760px; text-align: center; font-size: 1.18rem; line-height: 1.6; font-style: italic; color: var(--rm-text); border: none; padding: 0; }
      .rm-quote cite { display: block; margin-top: 16px; font-size: 14px; font-style: normal; font-weight: 600; color: var(--rm-muted); }
      .rm-quote-light { color: rgba(255,255,255,.92); }
      .rm-quote-light cite { color: var(--rm-gold-bright); }

      /* Stats */
      .rm-stat { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1); border-radius: 14px; padding: 28px 22px; text-align: center; }
      .rm-stat-emoji { font-size: 1.5rem; margin-bottom: 10px; }
      .rm-stat-value { font-size: 2.4rem; font-weight: 700; color: var(--rm-gold-bright); line-height: 1; }
      .rm-stat-label { font-size: 14px; font-weight: 600; color: #fff; margin: 10px 0 10px; }
      .rm-stat-note { font-size: 12.5px; line-height: 1.55; color: rgba(255,255,255,.6); margin: 0; }

      /* Comparison table */
      .rm-table { border: 1px solid var(--rm-line); border-radius: 14px; overflow: hidden; background: #fff; box-shadow: 0 6px 26px rgba(0,0,0,.05); }
      .rm-table-head, .rm-table-row { display: grid; grid-template-columns: 0.8fr 1.1fr 1.1fr; }
      .rm-table-row { border-top: 1px solid var(--rm-line); }
      .rm-table-cell { padding: 18px 20px; font-size: 14px; line-height: 1.55; display: flex; gap: 8px; align-items: flex-start; }
      .rm-table-dim { font-weight: 700; color: var(--rm-text); background: #fafafa; align-items: center; }
      .rm-table-industry-head, .rm-table-judah-head { font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: .06em; }
      .rm-table-industry-head { background: #f0f0f0; color: var(--rm-muted); }
      .rm-table-judah-head { background: var(--rm-ink); color: var(--rm-gold-bright); }
      .rm-table-industry { color: var(--rm-muted); }
      .rm-table-judah { color: var(--rm-text); background: rgba(201,162,75,.05); }
      .rm-x { color: #c0392b; flex-shrink: 0; margin-top: 2px; }
      .rm-check { color: #1e8449; flex-shrink: 0; margin-top: 2px; }

      /* Close */
      .rm-close-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 56px; align-items: start; }
      .rm-guarantee { display: flex; gap: 16px; background: #fff; border: 1px solid var(--rm-line); border-left: 4px solid var(--rm-gold); border-radius: 12px; padding: 22px 24px; margin-bottom: 24px; box-shadow: 0 6px 22px rgba(0,0,0,.05); }
      .rm-guarantee-icon { color: var(--rm-gold); flex-shrink: 0; }
      .rm-guarantee strong { display: block; font-size: 1.05rem; color: var(--rm-text); margin-bottom: 6px; }
      .rm-guarantee p { font-size: 14px; line-height: 1.6; color: var(--rm-muted); margin: 0; }
      .rm-softfall { display: flex; gap: 10px; align-items: flex-start; font-size: 13.5px; line-height: 1.6; color: var(--rm-muted); }
      .rm-softfall svg { color: var(--rm-gold); flex-shrink: 0; margin-top: 2px; }
      .rm-form-wrap { position: sticky; top: 88px; }

      /* Project gallery */
      .rm-gal-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 8px; }
      .rm-gal-item {
        position: relative; display: block; width: 100%; aspect-ratio: 4/3; padding: 0;
        border: none; cursor: pointer; border-radius: 14px; overflow: hidden; background: #e9e7e2;
        box-shadow: 0 6px 22px rgba(0,0,0,.08);
      }
      .rm-gal-img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s ease; display: block; }
      .rm-gal-item:hover .rm-gal-img { transform: scale(1.06); }
      .rm-gal-overlay {
        position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end;
        gap: 6px; padding: 16px; text-align: left;
        background: linear-gradient(180deg, transparent 45%, rgba(11,15,23,.82) 100%);
        opacity: 0; transition: opacity .25s ease;
      }
      .rm-gal-item:hover .rm-gal-overlay { opacity: 1; }
      .rm-gal-cat {
        align-self: flex-start; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
        color: #1a1306; background: var(--rm-gold-bright); padding: 3px 9px; border-radius: 5px;
      }
      .rm-gal-cap { font-size: 14px; font-weight: 600; color: #fff; line-height: 1.35; }

      /* Lightbox */
      .rm-lb { position: fixed; inset: 0; z-index: 110; background: rgba(5,8,14,.92); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 24px; animation: rmFade .2s ease; }
      .rm-lb-close { position: absolute; top: 20px; right: 20px; width: 42px; height: 42px; border-radius: 50%; border: none; cursor: pointer; background: rgba(255,255,255,.12); color: #fff; display: flex; align-items: center; justify-content: center; transition: background .15s ease; z-index: 2; }
      .rm-lb-close:hover { background: rgba(255,255,255,.24); }
      .rm-lb-nav { position: absolute; top: 50%; transform: translateY(-50%); width: 50px; height: 50px; border-radius: 50%; border: none; cursor: pointer; background: rgba(255,255,255,.12); color: #fff; display: flex; align-items: center; justify-content: center; transition: background .15s ease; z-index: 2; }
      .rm-lb-nav:hover { background: var(--rm-gold-bright); color: #1a1306; }
      .rm-lb-prev { left: 16px; }
      .rm-lb-next { right: 16px; }
      .rm-lb-stage { display: flex; flex-direction: column; align-items: center; gap: 14px; max-width: 1100px; width: 100%; }
      .rm-lb-img { max-width: 90vw; max-height: 80vh; width: auto; height: auto; object-fit: contain; border-radius: 12px; box-shadow: 0 24px 70px rgba(0,0,0,.6); }
      .rm-lb-caption { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; color: #fff; font-size: 15px; font-weight: 500; }
      .rm-lb-count { color: rgba(255,255,255,.55); font-size: 13px; }

      /* 2-column comparison table */
      .rm-table-2-head, .rm-table-2-row { display: grid; grid-template-columns: 1fr 1fr; }
      .rm-table-2-row { border-top: 1px solid var(--rm-line); }
      .rm-table-typical-head { background: #f0f0f0; color: var(--rm-muted); font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: .06em; }
      .rm-diff-close { max-width: 760px; margin: 44px auto 0; text-align: center; }
      .rm-diff-h3 { font-size: 1.3rem; font-weight: 700; color: var(--rm-text); margin: 28px 0 10px; }
      .rm-diff-h3:first-child { margin-top: 0; }
      .rm-diff-p { font-size: 1.05rem; line-height: 1.65; color: var(--rm-muted); margin: 0; }

      /* Video testimonials */
      .rm-section-vids { background: linear-gradient(180deg, var(--rm-ink) 0%, #11192b 100%); }
      .rm-vid-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin-top: 8px; }
      .rm-vid-card {
        position: relative; display: flex; flex-direction: column; justify-content: flex-end;
        aspect-ratio: 4/5; border: 1px solid rgba(201,162,75,.22); border-radius: 16px;
        padding: 22px; cursor: pointer; overflow: hidden; text-align: left;
        transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
      }
      .rm-vid-card:hover { transform: translateY(-4px); border-color: rgba(201,162,75,.55); box-shadow: 0 16px 40px rgba(0,0,0,.4); }
      .rm-vid-tone-0 { background: linear-gradient(150deg, #1a2c46, #0d1b2a); }
      .rm-vid-tone-1 { background: linear-gradient(150deg, #2b3a2e, #14201a); }
      .rm-vid-tone-2 { background: linear-gradient(150deg, #3a2c1a, #1f1710); }
      .rm-vid-tone-3 { background: linear-gradient(150deg, #2b2440, #161023); }
      .rm-vid-tone-4 { background: linear-gradient(150deg, #143038, #0a191d); }
      .rm-vid-tone-5 { background: linear-gradient(150deg, #3a1f2a, #1f1016); }
      .rm-vid-quote { position: absolute; top: 20px; left: 20px; color: rgba(201,162,75,.4); }
      .rm-vid-avatar {
        position: absolute; top: 18px; right: 20px; width: 46px; height: 46px; border-radius: 50%;
        background: rgba(201,162,75,.16); color: var(--rm-gold-bright); border: 1px solid rgba(201,162,75,.4);
        display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700;
      }
      .rm-vid-play {
        position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 60px; height: 60px; border-radius: 50%;
        background: var(--rm-gold-bright); color: #1a1306;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 6px 22px rgba(201,162,75,.5); transition: transform .18s ease;
      }
      .rm-vid-card:hover .rm-vid-play { transform: translate(-50%, -50%) scale(1.08); }
      .rm-vid-meta { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 3px; }
      .rm-vid-name { font-size: 1.1rem; font-weight: 700; color: #fff; }
      .rm-vid-project { font-size: 12.5px; font-weight: 500; color: var(--rm-gold-bright); letter-spacing: .02em; }

      /* Video modal */
      .rm-modal { position: fixed; inset: 0; z-index: 100; background: rgba(5,8,14,.86); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 24px; animation: rmFade .2s ease; }
      @keyframes rmFade { from { opacity: 0; } to { opacity: 1; } }
      .rm-modal-inner { position: relative; width: 100%; max-width: 520px; }
      .rm-modal-close { position: absolute; top: -46px; right: 0; width: 38px; height: 38px; border-radius: 50%; border: none; cursor: pointer; background: rgba(255,255,255,.12); color: #fff; display: flex; align-items: center; justify-content: center; transition: background .15s ease; }
      .rm-modal-close:hover { background: rgba(255,255,255,.24); }
      .rm-modal-video { position: relative; width: 100%; aspect-ratio: 9/16; max-height: 78vh; border-radius: 14px; overflow: hidden; background: #000; box-shadow: 0 24px 70px rgba(0,0,0,.6); }
      .rm-modal-video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
      .rm-modal-caption { display: flex; flex-direction: column; gap: 2px; text-align: center; margin-top: 16px; }
      .rm-modal-caption strong { color: #fff; font-size: 1.05rem; }
      .rm-modal-caption span { color: var(--rm-gold-bright); font-size: 13px; }

      /* Footer */
      .rm-footer { background: var(--rm-ink); color: rgba(255,255,255,.6); padding: 36px 0; text-align: center; }
      .rm-footer p { margin: 0; font-size: 13px; }
      .rm-footer-sub { margin-top: 8px; font-size: 11.5px; color: rgba(255,255,255,.4); max-width: 680px; margin-left: auto; margin-right: auto; }

      /* Responsive */
      @media (max-width: 900px) {
        .rm-grid-3, .rm-grid-2, .rm-grid-4 { grid-template-columns: 1fr; }
        .rm-vid-grid { grid-template-columns: repeat(2, 1fr); }
        .rm-gal-grid { grid-template-columns: repeat(2, 1fr); }
        .rm-gal-overlay { opacity: 1; }
        .rm-close-grid { grid-template-columns: 1fr; gap: 40px; }
        .rm-form-wrap { position: static; }
        .rm-table-head { display: none; }
        .rm-table-row { grid-template-columns: 1fr; }
        .rm-table-cell { border-top: 1px solid var(--rm-line); }
        .rm-table-row:first-child .rm-table-cell:first-child { border-top: none; }
        .rm-table-2-head { display: none; }
        .rm-table-2-row { grid-template-columns: 1fr; }
        .rm-table-2-row:first-child .rm-table-cell:first-child { border-top: none; }
      }
      @media (max-width: 560px) {
        .rm-topbar-cta { display: none; }
        .rm-hero-badges { gap: 14px; }
        .rm-vid-grid { grid-template-columns: 1fr; }
        .rm-gal-grid { grid-template-columns: 1fr; }
        .rm-lb-nav { width: 40px; height: 40px; }
      }
    `}</style>
  )
}
