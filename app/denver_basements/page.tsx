import Header from './_components/Header'
import DenverQuiz from './_components/DenverQuiz'
import { Check, Hammer, DollarSign, ShieldCheck, ArrowRight } from 'lucide-react'

export default function PeakBuildersDenverLanding() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--pb-bg)' }}>
      <Header />

      {/* ---------------- HERO ---------------- */}
      <section className="pbd-hero" id="top">
        <div className="pbd-hero-bg" />
        <div className="pbd-hero-overlay" />
        <div className="pbd-hero-inner">
          {/* Left: copy */}
          <div className="pb-fade-in">
            <span className="pbd-eyebrow">Peak Builders Denver</span>
            <h1 className="pbd-headline">
              Need More Space <span className="pbd-accent">at Home?</span>
            </h1>
            <p className="pbd-sub">
              Your unfinished basement may already be the answer. Answer a few quick questions to
              request a free basement design consultation with Peak Builders Denver.
            </p>
            <p className="pbd-support">
              Basement finishing, remodeling, bedrooms, offices, gyms, bathrooms &amp; family spaces.
            </p>

            <div className="pbd-trust-points">
              <div className="pbd-tp">
                <span className="pbd-tp-check"><Check size={13} strokeWidth={3} /></span>
                Free basement design consultation
              </div>
              <div className="pbd-tp">
                <span className="pbd-tp-check"><Check size={13} strokeWidth={3} /></span>
                $0 down &amp; 0% interest financing options
              </div>
              <div className="pbd-tp">
                <span className="pbd-tp-check"><Check size={13} strokeWidth={3} /></span>
                Licensed, insured &amp; fully warrantied
              </div>
            </div>
          </div>

          {/* Right: quiz */}
          <div className="pbd-card pb-slide-up">
            <DenverQuiz />
          </div>
        </div>
      </section>

      {/* ---------------- TRUST BADGES ---------------- */}
      <section className="pbd-badges">
        <div className="pbd-badge-card">
          <span className="pbd-badge-ic"><Hammer size={19} /></span>
          <div>
            <div className="pbd-badge-title">Hundreds of Basements Finished</div>
            <div className="pbd-badge-sub">Completed across the Denver metro area.</div>
          </div>
        </div>
        <div className="pbd-badge-card">
          <span className="pbd-badge-ic"><DollarSign size={19} /></span>
          <div>
            <div className="pbd-badge-title">$0 Down &amp; 0% Financing</div>
            <div className="pbd-badge-sub">Start your basement without paying upfront.</div>
          </div>
        </div>
        <div className="pbd-badge-card">
          <span className="pbd-badge-ic"><ShieldCheck size={19} /></span>
          <div>
            <div className="pbd-badge-title">Licensed, Insured &amp; Warrantied</div>
            <div className="pbd-badge-sub">Quality work backed in writing.</div>
          </div>
        </div>
      </section>

      {/* ---------------- BEFORE / AFTER ---------------- */}
      <section className="pbd-ba-wrap">
        <div className="pbd-ba-card pb-fade-in">
          <div className="pbd-ba-head">
            <h2 className="pbd-ba-title">
              From Wasted Space to <span className="pbd-ba-titleq">Real Living Space</span>
            </h2>
            <p className="pbd-ba-sub">See the kind of transformation Denver homeowners are getting.</p>
          </div>
          <div className="pbd-ba-grid">
            <div className="pbd-ba-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="pbd-ba-img" src="/denver_basements/before.jpg" alt="Unfinished basement before" />
              <span className="pbd-ba-tag before">Before</span>
              <div className="pbd-ba-cap">Unfinished basement</div>
            </div>
            <div className="pbd-ba-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="pbd-ba-img" src="/denver_basements/after.jpg" alt="Finished basement living space after" />
              <span className="pbd-ba-tag after">After</span>
              <div className="pbd-ba-cap">Finished living space</div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 18 }}>
            <a
              href="#top"
              className="pb-btn-cta"
              style={{ display: 'inline-flex', width: 'auto', textDecoration: 'none', padding: '14px 26px' }}
            >
              Start My Free Basement Design Consultation
              <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      <footer
        style={{
          marginTop: 'auto',
          padding: '22px 24px',
          textAlign: 'center',
          background: 'var(--pb-charcoal-2)',
        }}
      >
        <p style={{ fontSize: 12, color: '#9A9CA2' }}>
          © {new Date().getFullYear()} Peak Builders &amp; Roofers of Denver. Licensed &amp; Insured.
        </p>
      </footer>
    </div>
  )
}
