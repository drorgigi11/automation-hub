'use client'

import Image from 'next/image'
import { useCallback, useRef, useState } from 'react'
import {
  AlertTriangle, Hourglass, Wind, Lock, Timer, HardHat, ShieldCheck,
  Check, X, ArrowRight, Phone, FileDown, BadgeCheck,
} from 'lucide-react'
import LeadForm from '../../_components/LeadForm'

/* ------------------------------------------------------------------ *
 *  Renovision Design-Build — long-form sales landing page
 *  Aesthetic: "premium studio meets engineering corporation"
 *  Black / deep-blue / luxury-gold. Self-contained scoped styles (db-*).
 *  Lead capture reuses the existing renovision LeadForm (variant general),
 *  which posts to /api/webhooks/lovable and routes to /renovision/thank-you.
 * ------------------------------------------------------------------ */

export default function DesignBuildLanding() {
  const formRef = useRef<HTMLDivElement>(null)

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <div className="db-root">
      <DbStyles />

      <TopBar onCta={scrollToForm} />
      <Hero onCta={scrollToForm} />
      <Agitation />
      <Mechanism onCta={scrollToForm} />
      <Transformation onCta={scrollToForm} />
      <SocialProof />
      <Comparison onCta={scrollToForm} />
      <Close formRef={formRef} />
      <Footer />
    </div>
  )
}

/* ----------------------------- Top bar ----------------------------- */

function TopBar({ onCta }: { onCta: () => void }) {
  return (
    <header className="db-topbar">
      <div className="db-container db-topbar-inner">
        <Image
          src="/renovision-logo.png"
          alt="Renovision Design and Build"
          width={170}
          height={56}
          className="db-logo"
          priority
        />
        <button className="db-btn db-btn-ghost db-topbar-cta" onClick={onCta}>
          <Phone size={15} /> Book Your 15-Min Call
        </button>
      </div>
    </header>
  )
}

/* --------------------------- Block 1: Hero -------------------------- */

function Hero({ onCta }: { onCta: () => void }) {
  return (
    <section className="db-hero">
      <div className="db-hero-overlay" />
      <div className="db-container db-hero-inner">
        <p className="db-eyebrow db-eyebrow-light">
          Serving Greater Seattle · Specialized Design-Build Remodeling
        </p>
        <h1 className="db-h1">
          On-Time, <span className="db-gold">Zero-Surprise</span> Remodeling.
        </h1>
        <p className="db-hero-sub">
          Bathroom in <strong>≤ 10 business days</strong>. Kitchen in <strong>≤ 30</strong>.
          All decisions are locked in 3D with a signed materials list before we start.
          You get one dedicated crew to the finish line — and a daily photo report.
        </p>
        <div className="db-hero-cta">
          <button className="db-btn db-btn-gold db-btn-lg" onClick={onCta}>
            Book Your 15-Minute Price-Range Call <ArrowRight size={18} />
          </button>
          <p className="db-microcopy">
            Zero pressure. Zero surprises. Just a transparent estimate for your project.
          </p>
        </div>
        <ul className="db-hero-badges">
          <li><BadgeCheck size={16} /> Licensed &amp; Insured</li>
          <li><BadgeCheck size={16} /> Pre-Build Lock™</li>
          <li><BadgeCheck size={16} /> Daily Credit on Late Days</li>
        </ul>
        <p className="db-asterisk">
          *SLA refers to site-work only. Excludes permit / inspection and supplier delays
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
    <section className="db-section db-section-light">
      <div className="db-container">
        <p className="db-eyebrow db-eyebrow-danger">The Ugly Truth About Remodeling in Greater Seattle</p>
        <h2 className="db-h2 db-h2-dark">
          Why Most “Affordable” Remodels End Up Costing You Thousands in Hidden Fees,
          Lost Time &amp; Pure Frustration.
        </h2>
        <p className="db-intro db-intro-dark">
          You’ve heard the horror stories from your neighbors. A simple bathroom update that turns
          your house into a dusty warzone for three months. A kitchen quote that mysteriously balloons
          by 30% halfway through. Most contractors don’t plan to fail — they just lack a rigid system.
          Without a clear mechanism, every project falls into one of these three traps:
        </p>

        <div className="db-grid-3">
          {TRAPS.map(t => {
            const Icon = t.icon
            return (
              <div key={t.tag} className={`db-trap db-trap-${t.tone}`}>
                <div className="db-trap-icon"><Icon size={26} /></div>
                <span className="db-trap-tag">{t.tag}</span>
                <h3 className="db-trap-title">{t.title}</h3>
                <p className="db-trap-sub">{t.sub}</p>
                <p className="db-trap-body">{t.body}</p>
              </div>
            )
          })}
        </div>

        <p className="db-transition">
          There’s a massive difference between a verbal promise and a managed system. You don’t just
          need a builder — you need a <strong>Design-Build Mechanism</strong> that locks in every detail,
          material and deadline before a single hammer is swung. Here’s how we eliminate all three traps.
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
      'No guesswork. No "allowance" traps. We lock every decision in a 3D walk-through, backed by a signed Bill of Materials (BOM) before demolition begins. You know exactly what you’re getting — down to the last tile.',
  },
  {
    icon: Timer,
    n: '02',
    title: 'SLA-Time™ with Daily Credit',
    tag: 'On-Time, Guaranteed',
    body:
      'We measure what others only promise. Strict timelines for site work: Bathroom ≤ 10 business days, Kitchen ≤ 30 business days. Miss the deadline and you don’t just "wait" — you’re credited daily.',
  },
  {
    icon: HardHat,
    n: '03',
    title: 'One-Crew Focus™ + Daily Visual Reports',
    tag: 'No Disappearing Acts',
    body:
      'The same dedicated crew, every single day, until handover. And to keep you in the loop, you receive a short photo report every evening by 6:00 PM — what was done today, what’s scheduled tomorrow.',
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
    <section className="db-section db-section-dark">
      <div className="db-container">
        <p className="db-eyebrow db-eyebrow-gold">Introducing the Renovision Design-Build Mechanism</p>
        <h2 className="db-h2 db-h2-light">
          We Don’t Rely on “Good Intentions.” We Rely on a Rigid, Unbreakable Protocol.
        </h2>
        <p className="db-intro db-intro-light">
          A promise means nothing without a system to back it up. We’ve engineered the chaos out of
          traditional remodeling. Before we ever swing a hammer, we deploy a multi-layered defense
          system built to protect your budget, your timeline and your sanity. Here’s the exact
          blueprint we use to keep you in total control:
        </p>

        <div className="db-grid-2">
          {MECHANISM.map(m => {
            const Icon = m.icon
            return (
              <div key={m.n} className="db-mech">
                <div className="db-mech-head">
                  <span className="db-mech-icon"><Icon size={24} /></span>
                  <span className="db-mech-n">{m.n}</span>
                </div>
                <h3 className="db-mech-title">{m.title}</h3>
                <p className="db-mech-tag">{m.tag}</p>
                <p className="db-mech-body">{m.body}</p>
              </div>
            )
          })}
        </div>

        <div className="db-center">
          <button className="db-btn db-btn-gold db-btn-lg" onClick={onCta}>
            See a Sample 3D Demo &amp; Signed BOM <ArrowRight size={18} />
          </button>
        </div>
        <p className="db-asterisk db-asterisk-center">
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
    emoji: '🛁',
    title: 'The Morning Sanctuary',
    label: 'Bathrooms',
    body: 'From a chaotic morning rush to a 10-minute daily retreat. Start your day with absolute serenity.',
    eta: 'Delivered in ≤ 10 business days',
  },
  {
    emoji: '🍳',
    title: 'The Culinary Centerpiece',
    label: 'Kitchens',
    body: 'Where the family actually wants to gather. Flawless finishes, smart storage, zero compromises.',
    eta: 'Delivered in ≤ 30 business days',
  },
  {
    emoji: '🛡️',
    title: 'The Safe Haven',
    label: 'Aging-in-Place / Accessibility',
    body: 'Safety, cleanliness and quiet comfort. True luxury means never having to worry about your environment.',
    eta: 'Engineered for your lifestyle',
  },
]

function Transformation({ onCta }: { onCta: () => void }) {
  return (
    <section className="db-section db-section-light">
      <div className="db-container">
        <p className="db-eyebrow db-eyebrow-gold-dark">The End Result: Zero Stress. Pure Elegance.</p>
        <h2 className="db-h2 db-h2-dark">
          Step Into the Space You’ve Always Deserved (Without the Remodeling Trauma).
        </h2>
        <p className="db-intro db-intro-dark">
          A remodel isn’t just about quartz countertops or a walk-in shower. It’s about reclaiming
          your mornings. Hosting family dinners in a kitchen that breathes. The profound peace of
          walking into a sanctuary engineered precisely for your lifestyle. You don’t just get a
          stunning aesthetic — you get the quiet pride of knowing you remodeled the smart way.
          <em> Studio precision, matched with contractor speed.</em>
        </p>

        <BeforeAfter />

        <div className="db-grid-3 db-grid-3-tight">
          {TRANSFORM.map(t => (
            <div key={t.label} className="db-transform">
              <div className="db-transform-emoji">{t.emoji}</div>
              <h3 className="db-transform-title">{t.title}</h3>
              <p className="db-transform-label">{t.label}</p>
              <p className="db-transform-body">{t.body}</p>
              <p className="db-transform-eta">{t.eta}</p>
            </div>
          ))}
        </div>

        <blockquote className="db-quote">
          “I expected the usual remodeling nightmare. Instead, they handed us back a breathtaking
          kitchen exactly on day 29, just like the schedule said. We finally have the home we always
          talked about.”
          <cite>— Sarah &amp; Mark T., Greater Seattle</cite>
        </blockquote>

        <div className="db-center">
          <button className="db-btn db-btn-dark db-btn-lg" onClick={onCta}>
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
    <div className="db-ba">
      {/* TODO: replace the two gradient panels with real project photos
          (e.g. /renovision-before.jpg and /renovision-after.jpg) */}
      <div className="db-ba-after">
        <span className="db-ba-tag db-ba-tag-after">AFTER</span>
      </div>
      <div className="db-ba-before" style={{ width: `${pos}%` }}>
        <span className="db-ba-tag db-ba-tag-before">BEFORE</span>
      </div>
      <div className="db-ba-divider" style={{ left: `${pos}%` }}>
        <span className="db-ba-handle">
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
        className="db-ba-range"
        aria-label="Drag to compare before and after"
      />
    </div>
  )
}

/* ----------- Block 5: Social Proof / Proof-Stack ------------------- */

const STATS = [
  { emoji: '📊', value: '90%', label: 'On-Time Completion Rate', note: 'For standard projects. For the 10% we missed, we paid the daily delay credit — no questions asked.' },
  { emoji: '📉', value: '< 8%', label: 'Change-Order (CO) Rate', note: 'While the industry is plagued by budget blowouts, our Pre-Build Lock™ keeps mid-project changes minimal.' },
  { emoji: '🧹', value: '4.8/5', label: 'Avg. Site-Cleanliness Score', note: 'Rated by clients at handover. Our CleanBuild Protocol™ keeps your home a home, not a hazard zone.' },
  { emoji: '🤝', value: '100%', label: 'Dedicated Crew Consistency', note: 'With One-Crew Focus™, the team that starts your project is the team that finishes it.' },
]

function SocialProof() {
  return (
    <section className="db-section db-section-navy">
      <div className="db-container">
        <p className="db-eyebrow db-eyebrow-gold">Proudly Serving Greater Seattle, Tacoma &amp; Marysville</p>
        <h2 className="db-h2 db-h2-light">Don’t Take Our Word for It. Look at the Numbers.</h2>
        <p className="db-intro db-intro-light">
          In remodeling, everyone promises “high quality” and “great service.” Those words are
          meaningless unless you can measure them. That’s why we operate with radical transparency —
          tracking performance on every project so our SLA-Time™ and Pre-Build Lock™ are never empty
          slogans. Here’s our Proof-Stack from the last quarter:
        </p>

        <div className="db-grid-4">
          {STATS.map(s => (
            <div key={s.label} className="db-stat">
              <div className="db-stat-emoji">{s.emoji}</div>
              <div className="db-stat-value">{s.value}</div>
              <div className="db-stat-label">{s.label}</div>
              <p className="db-stat-note">{s.note}</p>
            </div>
          ))}
        </div>

        <blockquote className="db-quote db-quote-light">
          “With two kids and a dog, we couldn’t afford a remodeling nightmare. The team set up dust
          barriers on day one and actually respected the ‘quiet hours’ we requested for our home
          office. The daily photo reports kept us completely sane.”
          <cite>— Emily R., Tacoma</cite>
        </blockquote>
      </div>
    </section>
  )
}

/* --------------- Block 6: The Comparison Table -------------------- */

const COMPARE = [
  {
    dim: 'Budget & Materials',
    industry: 'Vague “allowances.” Surprise change-orders when materials go out of stock.',
    judah: 'Pre-Build Lock™ — 3D design & signed Bill of Materials before demo begins.',
  },
  {
    dim: 'Timeline & Deadlines',
    industry: '“We’ll try to finish in 6 weeks” (depending on subcontractors).',
    judah: 'SLA-Time™ — Bathroom ≤ 10 days, Kitchen ≤ 30 days. Late? You get a daily credit.',
  },
  {
    dim: 'Who Is in Your Home?',
    industry: 'A revolving door of random sub-contractors at unpredictable hours.',
    judah: 'One-Crew Focus™ — the exact same dedicated crew, every day, until handover.',
  },
  {
    dim: 'Daily Communication',
    industry: 'You chasing the contractor with texts asking, “What happened today?”',
    judah: 'Daily Visual Report — a short photo report sent every evening by 6:00 PM.',
  },
]

function Comparison({ onCta }: { onCta: () => void }) {
  return (
    <section className="db-section db-section-light">
      <div className="db-container">
        <p className="db-eyebrow db-eyebrow-gold-dark">The Industry Standard vs. The Renovision Standard</p>
        <h2 className="db-h2 db-h2-dark">
          Why Traditional Contractors Keep Failing You (And How We Engineered a Better Way).
        </h2>
        <p className="db-intro db-intro-dark">
          Most general contractors aren’t trying to rip you off. They simply sell labor, not a managed
          system. When a contractor relies on vague estimates and juggles multiple jobs, your project
          is the one that suffers. We don’t guess. We execute.
        </p>

        <div className="db-table">
          <div className="db-table-head">
            <div className="db-table-cell db-table-dim">&nbsp;</div>
            <div className="db-table-cell db-table-industry-head">Industry Standard</div>
            <div className="db-table-cell db-table-judah-head">The Renovision Mechanism</div>
          </div>
          {COMPARE.map(row => (
            <div key={row.dim} className="db-table-row">
              <div className="db-table-cell db-table-dim">{row.dim}</div>
              <div className="db-table-cell db-table-industry">
                <X size={16} className="db-x" /> <span>{row.industry}</span>
              </div>
              <div className="db-table-cell db-table-judah">
                <Check size={16} className="db-check" /> <span>{row.judah}</span>
              </div>
            </div>
          ))}
        </div>

        <blockquote className="db-quote">
          “I used a regular contractor for my first bathroom — 3 months of pure stress. For our
          kitchen we hired Renovision. The 3D lock and the daily photo reports made it feel like a
          completely different industry. Night and day.”
          <cite>— Michael D., Bellevue</cite>
        </blockquote>

        <div className="db-center">
          <button className="db-btn db-btn-gold db-btn-lg" onClick={onCta}>
            Stop Gambling with Your Remodel — Book Your 15-Min Call <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}

/* ------------------- Block 7: The Close --------------------------- */

function Close({ formRef }: { formRef: React.RefObject<HTMLDivElement> }) {
  return (
    <section className="db-section db-section-close">
      <div className="db-container db-close-grid" ref={formRef}>
        <div className="db-close-copy">
          <p className="db-eyebrow db-eyebrow-gold-dark">Your Next Step: Zero Pressure. Zero Commitment.</p>
          <h2 className="db-h2 db-h2-dark">
            Find Out Exactly What Your Remodel Will Cost — In Just 15 Minutes.
          </h2>
          <p className="db-intro db-intro-dark">
            The biggest fear in remodeling is the unknown cost. You deserve absolute clarity before
            you ever let a contractor into your home. No high-pressure pitch — just a simple 15-minute
            Price-Range Call. Tell us your vision and we’ll walk you through our transparent 3-Tier
            Budget Model (Basic, Plus, Premium). You’ll know exactly what to expect, with no strings
            attached.
          </p>

          <div className="db-guarantee">
            <ShieldCheck size={28} className="db-guarantee-icon" />
            <div>
              <strong>The Renovision 30-Day Price-Lock™</strong>
              <p>
                If we move forward with a home visit and a formal quote, your price is locked and
                guaranteed for 30 full days. No sudden markups. No expiration-date pressure. Just an
                honest, transparent number you can trust.
              </p>
            </div>
          </div>

          <p className="db-softfall">
            <FileDown size={16} /> Not ready to talk yet? Protect yourself from bad contractors —
            ask for our free 1-page checklist: <em>“10 Critical Questions to Ask Any Seattle
            Bathroom Contractor Before You Hire Them.”</em>
          </p>
        </div>

        <div className="db-form-wrap">
          <LeadForm variant="general" />
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- Footer ----------------------------- */

function Footer() {
  return (
    <footer className="db-footer">
      <div className="db-container">
        <p>© 2026 Renovision Design and Build. All rights reserved. Licensed &amp; Insured.</p>
        <p className="db-footer-sub">
          Serving Greater Seattle, Tacoma &amp; Marysville. SLA applies to site-work only; permits,
          inspections and external supply-chain delays excluded per signed agreement.
        </p>
      </div>
    </footer>
  )
}

/* --------------------------- Scoped styles ------------------------ */

function DbStyles() {
  return (
    <style>{`
      .db-root {
        --db-ink: #0b0f17;
        --db-navy: #0d1b2a;
        --db-navy-2: #11263d;
        --db-gold: #c9a24b;
        --db-gold-bright: #e0b84c;
        --db-light: #f6f5f2;
        --db-text: #1c2330;
        --db-muted: #5b6573;
        --db-line: rgba(0,0,0,0.08);
        font-family: 'Poppins', system-ui, sans-serif;
        color: var(--db-text);
        background: var(--db-light);
        overflow-x: hidden;
      }
      .db-container { width: 100%; max-width: 1120px; margin: 0 auto; padding: 0 24px; }
      .db-center { text-align: center; margin-top: 36px; }

      /* Buttons */
      .db-btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        border: none; cursor: pointer; border-radius: 9px; font-weight: 600;
        font-size: 15px; padding: 13px 22px; transition: transform .15s ease, opacity .15s ease, background .2s ease;
        letter-spacing: .01em;
      }
      .db-btn:hover { transform: translateY(-1px); }
      .db-btn-lg { font-size: 16px; padding: 17px 30px; }
      .db-btn-gold { background: linear-gradient(135deg, var(--db-gold-bright), var(--db-gold)); color: #1a1306; box-shadow: 0 8px 24px rgba(201,162,75,.35); }
      .db-btn-gold:hover { box-shadow: 0 10px 30px rgba(201,162,75,.5); }
      .db-btn-dark { background: var(--db-ink); color: #fff; }
      .db-btn-ghost { background: transparent; border: 1px solid rgba(255,255,255,.35); color: #fff; padding: 9px 16px; font-size: 13px; }
      .db-btn-ghost:hover { background: rgba(255,255,255,.1); }

      /* Top bar */
      .db-topbar { position: sticky; top: 0; z-index: 50; background: rgba(11,15,23,.92); backdrop-filter: blur(8px); border-bottom: 1px solid rgba(255,255,255,.08); }
      .db-topbar-inner { display: flex; align-items: center; justify-content: space-between; padding-top: 12px; padding-bottom: 12px; }
      .db-logo { height: 44px; width: auto; filter: brightness(0) invert(1); }

      /* Eyebrows / headings */
      .db-eyebrow { text-transform: uppercase; letter-spacing: .16em; font-size: 12px; font-weight: 600; margin-bottom: 18px; }
      .db-eyebrow-light { color: var(--db-gold-bright); }
      .db-eyebrow-gold { color: var(--db-gold-bright); }
      .db-eyebrow-gold-dark { color: #a9842f; }
      .db-eyebrow-danger { color: #c0392b; }
      .db-h1 { font-size: clamp(2.2rem, 6vw, 4rem); font-weight: 700; line-height: 1.05; letter-spacing: -.02em; color: #fff; margin: 0 0 22px; }
      .db-gold { color: var(--db-gold-bright); }
      .db-h2 { font-size: clamp(1.5rem, 3.4vw, 2.4rem); font-weight: 700; line-height: 1.18; letter-spacing: -.01em; margin: 0 0 20px; max-width: 880px; }
      .db-h2-light { color: #fff; }
      .db-h2-dark { color: var(--db-text); }
      .db-intro { font-size: clamp(1rem, 1.4vw, 1.12rem); line-height: 1.7; max-width: 820px; margin: 0 0 40px; }
      .db-intro-light { color: rgba(255,255,255,.78); }
      .db-intro-dark { color: var(--db-muted); }

      /* Sections */
      .db-section { padding: clamp(64px, 9vw, 110px) 0; }
      .db-section-light { background: var(--db-light); }
      .db-section-dark { background: radial-gradient(120% 120% at 50% 0%, #14213a 0%, var(--db-ink) 70%); }
      .db-section-navy { background: linear-gradient(180deg, var(--db-navy) 0%, var(--db-navy-2) 100%); }
      .db-section-close { background: linear-gradient(180deg, #ffffff 0%, var(--db-light) 100%); }

      /* Hero */
      .db-hero { position: relative; background: linear-gradient(135deg, #0d1b2a 0%, #0b0f17 55%, #14213a 100%); padding: clamp(72px, 11vw, 150px) 0 clamp(60px, 8vw, 96px); overflow: hidden; }
      .db-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(60% 60% at 75% 15%, rgba(201,162,75,.18) 0%, transparent 60%); pointer-events: none; }
      .db-hero-overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(11,15,23,.55), transparent 70%); }
      .db-hero-inner { position: relative; z-index: 2; max-width: 880px; }
      .db-hero-sub { font-size: clamp(1.05rem, 1.6vw, 1.25rem); line-height: 1.65; color: rgba(255,255,255,.82); max-width: 680px; margin: 0 0 32px; }
      .db-hero-sub strong { color: var(--db-gold-bright); font-weight: 600; }
      .db-hero-cta { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
      .db-microcopy { font-size: 13px; color: rgba(255,255,255,.6); margin: 0; }
      .db-hero-badges { list-style: none; display: flex; flex-wrap: wrap; gap: 22px; padding: 0; margin: 36px 0 0; }
      .db-hero-badges li { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,.85); }
      .db-hero-badges svg { color: var(--db-gold-bright); }
      .db-asterisk { font-size: 11.5px; color: rgba(255,255,255,.45); margin: 28px 0 0; max-width: 620px; line-height: 1.5; }
      .db-asterisk-center { text-align: center; margin-left: auto; margin-right: auto; color: var(--db-muted); }

      /* Grids */
      .db-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
      .db-grid-3-tight { gap: 20px; margin-top: 48px; }
      .db-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; }
      .db-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

      /* Traps */
      .db-trap { background: #fff; border: 1px solid var(--db-line); border-radius: 14px; padding: 30px 26px; box-shadow: 0 4px 20px rgba(0,0,0,.04); }
      .db-trap-icon { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; }
      .db-trap-danger .db-trap-icon { background: rgba(192,57,43,.1); color: #c0392b; }
      .db-trap-warn .db-trap-icon { background: rgba(201,162,75,.14); color: #a9842f; }
      .db-trap-dust .db-trap-icon { background: rgba(91,101,115,.12); color: #5b6573; }
      .db-trap-tag { font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--db-muted); }
      .db-trap-title { font-size: 1.2rem; font-weight: 700; margin: 8px 0 2px; color: var(--db-text); }
      .db-trap-sub { font-size: 13px; font-weight: 600; color: #c0392b; margin: 0 0 14px; }
      .db-trap-warn .db-trap-sub { color: #a9842f; }
      .db-trap-dust .db-trap-sub { color: #5b6573; }
      .db-trap-body { font-size: 14.5px; line-height: 1.65; color: var(--db-muted); margin: 0; }
      .db-transition { margin: 44px auto 0; max-width: 760px; text-align: center; font-size: 1.08rem; line-height: 1.65; color: var(--db-text); }
      .db-transition strong { color: #a9842f; }

      /* Mechanism */
      .db-mech { background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02)); border: 1px solid rgba(201,162,75,.22); border-radius: 16px; padding: 30px 28px; }
      .db-mech-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
      .db-mech-icon { width: 50px; height: 50px; border-radius: 12px; background: rgba(201,162,75,.14); color: var(--db-gold-bright); display: flex; align-items: center; justify-content: center; }
      .db-mech-n { font-size: 2rem; font-weight: 700; color: rgba(201,162,75,.3); line-height: 1; }
      .db-mech-title { font-size: 1.22rem; font-weight: 700; color: #fff; margin: 0 0 4px; }
      .db-mech-tag { font-size: 13px; font-weight: 600; color: var(--db-gold-bright); margin: 0 0 14px; }
      .db-mech-body { font-size: 14.5px; line-height: 1.65; color: rgba(255,255,255,.72); margin: 0; }

      /* Before / After */
      .db-ba { position: relative; width: 100%; max-width: 900px; margin: 0 auto; aspect-ratio: 16/9; border-radius: 16px; overflow: hidden; box-shadow: 0 18px 50px rgba(0,0,0,.18); user-select: none; }
      .db-ba-after, .db-ba-before { position: absolute; inset: 0; height: 100%; }
      .db-ba-after { background: linear-gradient(135deg, #1a2c46, #2b4a6f); }
      .db-ba-before { top: 0; left: 0; overflow: hidden; background: linear-gradient(135deg, #4a443c, #6b6253); border-right: 3px solid var(--db-gold-bright); }
      .db-ba-tag { position: absolute; top: 16px; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; letter-spacing: .12em; }
      .db-ba-tag-before { left: 16px; background: rgba(0,0,0,.5); color: #fff; }
      .db-ba-tag-after { right: 16px; background: var(--db-gold-bright); color: #1a1306; }
      .db-ba-divider { position: absolute; top: 0; bottom: 0; width: 3px; background: var(--db-gold-bright); transform: translateX(-50%); pointer-events: none; }
      .db-ba-handle { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 44px; height: 44px; border-radius: 50%; background: var(--db-gold-bright); color: #1a1306; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 12px rgba(0,0,0,.3); }
      .db-ba-range { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: ew-resize; margin: 0; }

      /* Transformation cards */
      .db-transform { background: #fff; border: 1px solid var(--db-line); border-radius: 14px; padding: 28px 24px; text-align: center; }
      .db-transform-emoji { font-size: 2rem; margin-bottom: 12px; }
      .db-transform-title { font-size: 1.15rem; font-weight: 700; margin: 0 0 2px; color: var(--db-text); }
      .db-transform-label { font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--db-muted); margin: 0 0 12px; }
      .db-transform-body { font-size: 14px; line-height: 1.6; color: var(--db-muted); margin: 0 0 14px; }
      .db-transform-eta { font-size: 13px; font-weight: 600; color: #a9842f; margin: 0; }

      /* Quotes */
      .db-quote { margin: 48px auto 0; max-width: 760px; text-align: center; font-size: 1.18rem; line-height: 1.6; font-style: italic; color: var(--db-text); border: none; padding: 0; }
      .db-quote cite { display: block; margin-top: 16px; font-size: 14px; font-style: normal; font-weight: 600; color: var(--db-muted); }
      .db-quote-light { color: rgba(255,255,255,.92); }
      .db-quote-light cite { color: var(--db-gold-bright); }

      /* Stats */
      .db-stat { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1); border-radius: 14px; padding: 28px 22px; text-align: center; }
      .db-stat-emoji { font-size: 1.5rem; margin-bottom: 10px; }
      .db-stat-value { font-size: 2.4rem; font-weight: 700; color: var(--db-gold-bright); line-height: 1; }
      .db-stat-label { font-size: 14px; font-weight: 600; color: #fff; margin: 10px 0 10px; }
      .db-stat-note { font-size: 12.5px; line-height: 1.55; color: rgba(255,255,255,.6); margin: 0; }

      /* Comparison table */
      .db-table { border: 1px solid var(--db-line); border-radius: 14px; overflow: hidden; background: #fff; box-shadow: 0 6px 26px rgba(0,0,0,.05); }
      .db-table-head, .db-table-row { display: grid; grid-template-columns: 0.8fr 1.1fr 1.1fr; }
      .db-table-row { border-top: 1px solid var(--db-line); }
      .db-table-cell { padding: 18px 20px; font-size: 14px; line-height: 1.55; display: flex; gap: 8px; align-items: flex-start; }
      .db-table-dim { font-weight: 700; color: var(--db-text); background: #fafafa; align-items: center; }
      .db-table-industry-head, .db-table-judah-head { font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: .06em; }
      .db-table-industry-head { background: #f0f0f0; color: var(--db-muted); }
      .db-table-judah-head { background: var(--db-ink); color: var(--db-gold-bright); }
      .db-table-industry { color: var(--db-muted); }
      .db-table-judah { color: var(--db-text); background: rgba(201,162,75,.05); }
      .db-x { color: #c0392b; flex-shrink: 0; margin-top: 2px; }
      .db-check { color: #1e8449; flex-shrink: 0; margin-top: 2px; }

      /* Close */
      .db-close-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 56px; align-items: start; }
      .db-guarantee { display: flex; gap: 16px; background: #fff; border: 1px solid var(--db-line); border-left: 4px solid var(--db-gold); border-radius: 12px; padding: 22px 24px; margin-bottom: 24px; box-shadow: 0 6px 22px rgba(0,0,0,.05); }
      .db-guarantee-icon { color: var(--db-gold); flex-shrink: 0; }
      .db-guarantee strong { display: block; font-size: 1.05rem; color: var(--db-text); margin-bottom: 6px; }
      .db-guarantee p { font-size: 14px; line-height: 1.6; color: var(--db-muted); margin: 0; }
      .db-softfall { display: flex; gap: 10px; align-items: flex-start; font-size: 13.5px; line-height: 1.6; color: var(--db-muted); }
      .db-softfall svg { color: var(--db-gold); flex-shrink: 0; margin-top: 2px; }
      .db-form-wrap { position: sticky; top: 88px; }

      /* Footer */
      .db-footer { background: var(--db-ink); color: rgba(255,255,255,.6); padding: 36px 0; text-align: center; }
      .db-footer p { margin: 0; font-size: 13px; }
      .db-footer-sub { margin-top: 8px; font-size: 11.5px; color: rgba(255,255,255,.4); max-width: 680px; margin-left: auto; margin-right: auto; }

      /* Responsive */
      @media (max-width: 900px) {
        .db-grid-3, .db-grid-2, .db-grid-4 { grid-template-columns: 1fr; }
        .db-close-grid { grid-template-columns: 1fr; gap: 40px; }
        .db-form-wrap { position: static; }
        .db-table-head { display: none; }
        .db-table-row { grid-template-columns: 1fr; }
        .db-table-cell { border-top: 1px solid var(--db-line); }
        .db-table-row:first-child .db-table-cell:first-child { border-top: none; }
      }
      @media (max-width: 560px) {
        .db-topbar-cta { display: none; }
        .db-hero-badges { gap: 14px; }
      }
    `}</style>
  )
}
